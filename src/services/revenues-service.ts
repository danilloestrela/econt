import { RevenuesRepository } from "@/repositories/revenues-respository";
import { makeConversionsService } from "@/services/factories/make-conversions-service";
import { anyToUtc } from "@/utils/dateUtils";
import { addScaled, convertNumberToDecimalPrecision, convertToDecimalNumber, convertToDecimalWithNoPrecisionAdjust, divideScaled, multiplyScaled, percentageToDecimalPrecision, subtractScaled } from "@/utils/decimalUtils";
import { Conversions, Currencies, Fees, FeeTypes, Prisma, TransactionAgents, Transactions, TransactionTypes } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { NotCreatedError, NotFoundError } from "./errors/common-errors";
import { makeFeesService } from "./factories/make-fees-service";
import { makePlatformsService } from "./factories/make-platforms-service";
import { makeSourcesService } from "./factories/make-sources-service";
import { makeSummariesService } from "./factories/make-summaries-service";
import { makeTransactionsService } from "./factories/make-transactions-service";
import { makeUsersService } from "./factories/make-users-service";
interface CreateRevenueRequest {
    companyId: number;
    fromAmount: number;
    fromCurrency: Currencies;
    toCurrency: Currencies;
    marketCurrencyValue: number;
    platformCurrencyValue: number;
    receivedDate: string;
    fees?: Array<{
      amount: number;
      amount_percentage?: number;
      description: string;
      fee_type: FeeTypes;
      currency: Currencies;
    }>;
    userId: string;
    sourceId: number;
    platformId: number;
  }

export class RevenuesService {
    constructor(private revenuesRepository: RevenuesRepository) {}

    async newRevenue(data: CreateRevenueRequest) {
        const currenciesSlugs = Object.values(Currencies)
        const transactionsService = makeTransactionsService()
        const usersService = makeUsersService()
        const sourcesService = makeSourcesService()
        const conversionsService = makeConversionsService()
        const platformsService = makePlatformsService()
        const summariesService = makeSummariesService()
        const feesService = makeFeesService()


        if (!data.fromCurrency || !data.toCurrency || !currenciesSlugs.includes(data.fromCurrency) || !currenciesSlugs.includes(data.toCurrency)) {
            throw new NotFoundError({what: 'Currency'})
        }

        await usersService.userExists(data.userId)

        const fromAmount = convertNumberToDecimalPrecision(data.fromAmount);
        // This amount will be the same as fromAmount if we don't convert (fromCurrency === toCurrency)
        let toAmount = fromAmount;

        let source: any = null;
        let platform: any = null;
        let summary: any = null;
        let conversion: any = null;
        let conversionTransaction: any = null;
        let conversionFee: any = null;
        let revenueTransaction: any = null;
        let fees: any = null;
        let revenue: any = null;
        let totalFeeAmount: Decimal = convertNumberToDecimalPrecision(0);
        let totalTaxesAmount: Decimal = convertNumberToDecimalPrecision(0);

        try {

            // Check if source exists
            source = await sourcesService.hasSource(data.sourceId)
            if (!source) throw new NotFoundError({what: 'Source'})

            // Check if platform exists
            platform = await platformsService.hasPlatform(data.platformId)
            if (!platform) throw new NotFoundError({what: 'Platform'})

            // Check if summary exists
            summary = await summariesService.hasSummary({
                companyId: data.companyId,
                summaryDate: data.receivedDate,
            })

            if (!summary) {
                // Create Summary
                summary = await summariesService.newEmptySummary({
                    companyId: data.companyId,
                    summaryDate: data.receivedDate,
                });
                summary.wasCreated = true;
            }

            // Check/create conversion and fees for currency conversion (if some)
            const conversionWithFee = await this.createRevenueConversionWithFee(data)

            if(conversionWithFee) {
                conversion = conversionWithFee.conversion
                conversionTransaction = conversionWithFee.transaction
                conversionFee = conversionWithFee.fee
                toAmount = conversionWithFee.toAmount
                totalFeeAmount = convertToDecimalWithNoPrecisionAdjust(conversionFee.amount)
            }

            // Create revenue transaction (after we convert or if we don't convert)
            revenueTransaction = await transactionsService.create({
                transaction_type: TransactionTypes.revenue,
                from_agent: TransactionAgents.external_platform,
                to_agent: TransactionAgents.company,
                description: `Revenue conversion from ${data.fromCurrency} to ${data.toCurrency}`,
                date: anyToUtc(new Date()),
                users: {
                    connect: {
                        id: data.userId,
                    }
                }
            })
            // add fees from external platform or something if some.
            if (Array.isArray(data.fees) && data.fees.length > 0) {
                const feesData = data.fees.map(fee => {
                    totalFeeAmount = addScaled(totalFeeAmount, convertNumberToDecimalPrecision(fee.amount))
                    return {
                        amount: convertNumberToDecimalPrecision(fee.amount).toString(),
                        amount_percentage: fee?.amount_percentage ? fee.amount_percentage.toString() : '0',
                        currency: fee.currency,
                        description: fee.description,
                        fee_type: fee.fee_type,
                        date: anyToUtc(new Date()),
                    }
                });

                fees.data = await feesService.createManyAndReturn(feesData);
                fees.wasCreated = true
            }


            // Create revenue
            let revenueData: Prisma.RevenuesCreateInput = {
                company: {
                    connect: {
                        id: data.companyId,
                    },
                },
                sources: {
                    connect: {
                        id: data.sourceId,
                    },
                },
                transaction: {
                    connect: {
                        id: revenueTransaction.id,
                    }
                },
                total_amount: toAmount.toString(),
                total_fee_amount: totalFeeAmount.toString(),
                total_taxes_amount: totalTaxesAmount.toString(),
                currency: Currencies.brl,
                received_date: anyToUtc(new Date()),
            }

            revenue = await this.createRevenue(revenueData);
            revenue.wasCreated = true;
            // Create taxes for the company Simples Nacional ou Lucro Presumido ou qualquer outro.
            // Pensar em uma forma universal de decidir isso. Provavelmente checar na empresa qual o tipo de tributação ela está emquadrada seja o caminho.
            // Podemos tirar essa informação do service de companies, e só então do service "taxes" retirar o cálculo de impostos.
            // Update summary
            summary = await summariesService.updateRevenueSummary({
                summaryId: summary.id,
                revenue_amount: revenue.total_amount,
            })
            summary.wasUpdated = true;
            const logData = {
                revenue: {
                    total_amount: convertToDecimalNumber(revenue.total_amount),
                    total_fee_amount: convertToDecimalNumber(revenue.total_fee_amount),
                    transactions: {
                        id: revenueTransaction.id,
                        transaction_type: revenueTransaction.transaction_type,
                        from_agent: revenueTransaction.from_agent,
                        to_agent: revenueTransaction.to_agent,
                        description: revenueTransaction.description,
                        date: revenueTransaction.date,
                    },
                    conversion: {
                        id: conversion.id,
                        from_amount: convertToDecimalNumber(conversion.from_amount),
                        to_amount: convertToDecimalNumber(conversion.to_amount),
                        from_currency: conversion.from_currency,
                        to_currency: conversion.to_currency,
                        market_currency_value: convertToDecimalNumber(conversion.market_currency_value),
                        platform_currency_value: convertToDecimalNumber(conversion.platform_currency_value),
                    },
                    fees: fees.data.map((fee: any) => ({
                        id: fee.id,
                        amount: convertToDecimalNumber(fee.amount),
                        amount_percentage: convertToDecimalNumber(fee.amount_percentage),
                        description: fee.description,
                        fee_type: fee.fee_type,
                        currency: fee.currency,
                    }))
                }
            }

            return logData;

        } catch (error) {
            if (!source || !platform) throw error

            // the variables in the top are in the order
            // we need to cleanup in the reverse order

            if (revenue?.wasCreated) {
                await this.revenuesRepository.delete(revenue.id);
            }

            if (fees?.wasCreated) {
                await feesService.delete(fees.data.id);
            }

            if (revenueTransaction?.wasCreated) {
                await transactionsService.delete(revenueTransaction.id);
            }

            if (conversion?.wasCreated) {
                await conversionsService.delete(conversion.id);
            }

            if (summary?.wasCreated) {
                await summariesService.delete(summary.id);
            }

            throw error; // Re-throw the error after cleanup
        }
    }

    async createRevenue(data: Prisma.RevenuesCreateInput) {
        const revenue = await this.revenuesRepository.create(data);
        if (!revenue) throw new NotCreatedError({what: 'Revenue'})
        return revenue;
    }

    async createRevenueConversionWithFee(data: CreateRevenueRequest): Promise<null | {
        conversion: Conversions;
        transaction: Transactions;
        fee: Fees;
        toAmount: Decimal;
    }> {
        if(data.fromCurrency === data.toCurrency) return null;

        const conversionsService = makeConversionsService()
        const feesService = makeFeesService()
        const transactionsService = makeTransactionsService()
        const fromAmount = convertNumberToDecimalPrecision(data.fromAmount);

        let conversion: any = null;
        let transaction: any = null;
        let fee: any = null;

        // 2. Calcular taxa de conversão (diferença entre mercado e plataforma)
        const platformCurrencyValue = convertNumberToDecimalPrecision(data.platformCurrencyValue);
        const marketCurrencyValue = convertNumberToDecimalPrecision(data.marketCurrencyValue);
        const toAmount = multiplyScaled(fromAmount, platformCurrencyValue);
        const hundredPercentage = percentageToDecimalPrecision(100);
        const conversionFeePercentage = subtractScaled(hundredPercentage, divideScaled(platformCurrencyValue, marketCurrencyValue))

        // 3. Calcular valor pago pela conversão na plataforma
        const conversionFeeAmount = multiplyScaled(fromAmount, conversionFeePercentage);

        // Create conversion
        const conversionData = {
            from_amount: fromAmount.toString(),
            to_amount: toAmount.toString(),
            from_currency: data.fromCurrency,
            to_currency: data.toCurrency,
            market_currency_value: marketCurrencyValue.toString(),
            platform_currency_value: platformCurrencyValue.toString(),
            platform: {
                connect: {
                    id: data.platformId,
                }
            }
        }
        conversion = await conversionsService.create(conversionData)
        conversion.wasCreated = true;

        // Create transaction (who did, where it came from)
        const transactionData = {
            transaction_type: TransactionTypes.revenue,
            from_agent: TransactionAgents.external_platform,
            to_agent: TransactionAgents.external_platform,
            description: `Revenue conversion from ${data.fromCurrency} to ${data.toCurrency} on external platform`,
            date: anyToUtc(new Date()),
            users: {
                connect: {
                    id: data.userId,
                }
            }
        }

        transaction = await transactionsService.create(transactionData)
        transaction.wasCreated = true;
        // Create Fee referent to conversion value
        const conversionFeeData = {
            amount: conversionFeeAmount.toString(),
            amount_percentage: conversionFeePercentage.toString(),
            description: `Conversion fee from ${data.fromCurrency} to ${data.toCurrency}`,
            fee_type: FeeTypes.convertion_from_amount_fee,
            currency: data.toCurrency,
            feesConversions: {
                create: {
                    conversions: {
                        connect: {
                            id: conversion.id,
                        }
                    }
                }
            }
        }

        fee = await feesService.new(conversionFeeData)
        fee.wasCreated = true;

        return {
            conversion,
            transaction,
            fee,
            toAmount,
        }
    }

    async getLast12MonthsRevenueSum(companyId: number): Promise<string> {
        const { totalAmountSum } = await this.revenuesRepository.getSumOfRevenues(companyId, 12);
        return totalAmountSum;
    }

    async getCurrentMonthRevenueSum(companyId: number): Promise<string> {
        const { totalAmountSum } = await this.revenuesRepository.getSumOfRevenues(companyId, 1);
        return totalAmountSum;
    }
}

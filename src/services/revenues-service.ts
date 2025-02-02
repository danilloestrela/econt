import { RevenuesRepository } from "@/repositories/revenues-respository";
import { makeConversionsService } from "@/services/factories/make-conversions-service";
import { anyToUtc } from "@/utils/dateUtils";
import { convertNumberToDecimalPrecision, convertToDecimalNumber, divideScaled, multiplyScaled, percentageToDecimalPrecision, subtractScaled } from "@/utils/decimalUtils";
import { Currencies, FeeTypes, Prisma, TransactionAgents, TransactionTypes } from "@prisma/client";
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
    periodId: number;
    fees?: Array<{
      amount: number;
      amount_percentage?: number;
      description: string;
      fee_type: FeeTypes;
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
        const platformsService = makePlatformsService()
        const summarieService = makeSummariesService()
        const feesService = makeFeesService()


        if (!data.fromCurrency || !data.toCurrency || !currenciesSlugs.includes(data.fromCurrency) || !currenciesSlugs.includes(data.toCurrency)) {
            throw new NotFoundError({what: 'Currency'})
        }

        await usersService.userExists(data.userId)

        const fromAmount = convertNumberToDecimalPrecision(data.fromAmount);

        let source: any = null;
        let platform: any = null;
        let summary: any = null;
        let conversion: any = null;
        let transaction: any = null;
        let fee: any = null;
        let fees: any = null;
        let revenue: any = null;

        try {

            // Check if source exists
            source = await sourcesService.hasSource(data.sourceId)
            if (!source) throw new NotFoundError({what: 'Source'})

            // Check if platform exists
            platform = await platformsService.hasPlatform(data.platformId)
            if (!platform) throw new NotFoundError({what: 'Platform'})

            // Check if summary exists
            summary = await summarieService.hasSummary({
                companyId: data.companyId,
                periodId: data.periodId,
            })

            if (!summary) {
                // Create Summary
                summary = await summarieService.newEmptySummary({
                    companyId: data.companyId,
                    periodId: data.periodId,
                });
                summary.wasCreated = true;
            }

            if(data.fromCurrency !== data.toCurrency) {
                // 2. Calcular taxa de conversão (diferença entre mercado e plataforma)
                const platformCurrencyValue = convertNumberToDecimalPrecision(data.platformCurrencyValue);
                const marketCurrencyValue = convertNumberToDecimalPrecision(data.marketCurrencyValue);
                const toAmount = multiplyScaled(fromAmount, platformCurrencyValue);
                const hundredPercentage = percentageToDecimalPrecision(100);
                const conversionFeePercentage = subtractScaled(hundredPercentage, divideScaled(platformCurrencyValue, marketCurrencyValue))
    
                // 3. Calcular valor pago pela conversão na plataforma
                const conversionFeeAmount = multiplyScaled(fromAmount, conversionFeePercentage);
            // Create conversion
                const conversionService = makeConversionsService()
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
                conversion = await conversionService.create(conversionData)
                conversion.wasCreated = true;
                
                // Create transaction (who did, where it came from)
                const transactionData = {
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
                }
                transaction = await transactionsService.create(transactionData)
                transaction.wasCreated = true;
                // Create Fee referent to conversion value
                const feeData = {
                    amount: conversionFeeAmount.toString(),
                    amount_percentage: conversionFeePercentage.toString(),
                    description: `Conversion fee from ${data.fromCurrency} to ${data.toCurrency}`,
                    fee_type: FeeTypes.convertion_from_amount_fee,
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
    
                fee = await feesService.new(feeData)
                fee.wasCreated = true;
            }

            transaction = await transactionsService.create({
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

            if (Array.isArray(data.fees) && data.fees.length > 0) {
                const feesData = data.fees.map(fee => ({
                    amount: convertNumberToDecimalPrecision(fee.amount).toString(),
                    amount_percentage: fee?.amount_percentage ? fee.amount_percentage.toString() : '0',
                    description: fee.description,
                    fee_type: fee.fee_type,
                    date: anyToUtc(new Date()),
                }));

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
                total_amount: fromAmount.toString(),
                total_fee_amount: '0',
                total_taxes_amount: '0',
                received_date: anyToUtc(new Date()),
            }

            if(transaction.wasCreated) {
                revenueData = {
                    ...revenueData,
                    transaction: {
                        connect: {
                            id: transaction.id,
                        }
                    }
                }
            }

            revenue = await this.createRevenue(revenueData);
            revenue.wasCreated = true;
            // Create taxes for the company Simples Nacional ou Lucro Presumido ou qualquer outro.
            // Pensar em uma forma universal de decidir isso. Provavelmente checar na empresa qual o tipo de tributação ela está emquadrada seja o caminho.
            // Podemos tirar essa informação do service de companies, e só então do service "taxes" retirar o cálculo de impostos.
            // Update summary
            summary = await summarieService.updateRevenueSummary({
                summaryId: summary.id,
                revenue_amount: revenue.total_amount,
            })
            summary.wasUpdated = true;
            const logData = {
                revenue: {
                    total_amount: convertToDecimalNumber(revenue.total_amount),
                    total_fee_amount: convertToDecimalNumber(revenue.total_fee_amount),
                    transaction: {
                        id: transaction.id,
                        transaction_type: transaction.transaction_type,
                        from_agent: transaction.from_agent,
                        to_agent: transaction.to_agent,
                        description: transaction.description,
                        date: transaction.date,
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
                    fees: [
                        {
                            id: fee.id,
                            amount: convertToDecimalNumber(fee.amount),
                            amount_percentage: convertToDecimalNumber(fee.amount_percentage),
                            description: fee.description,
                            fee_type: fee.fee_type,
                        }
                    ]
                }
            }

            return logData;

        } catch (error) {
            if (!source || !platform) throw error

            // the variables in the top are in the order
            // we need to cleanup in the reverse order

            if (revenue.wasCreated) {
                await this.revenuesRepository.delete(revenue.id);
            }

            if (fee.wasCreated) {
                await makeFeesService().delete(fee.id);
            }

            if (transaction.wasCreated) {
                await makeTransactionsService().delete(transaction.id);
            }

            if (conversion.wasCreated) {
                await makeConversionsService().delete(conversion.id);
            }

            if (summary.wasCreated) {
                await makeSummariesService().delete(summary.id);
            }

            throw error; // Re-throw the error after cleanup
        }
    }

    async createRevenue(data: Prisma.RevenuesCreateInput) {
        const revenue = await this.revenuesRepository.create(data);
        if (!revenue) throw new NotCreatedError({what: 'Revenue'})
        return revenue;
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

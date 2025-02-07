import { RemunerationsRepository } from "@/repositories/remunerations-repository";
import { convertNumberToDecimalPrecision, convertToDecimalNumber, convertToDecimalWithNoPrecisionAdjust, multiplyScaled } from "@/utils/decimalUtils";
import { Currencies, Prisma, Taxes } from "@prisma/client";
import Decimal from "decimal.js";
import { NotFoundError } from "./errors/common-errors";
import { makeCompaniesService } from "./factories/make-companies-service";
import { makeEmployeesService } from "./factories/make-employees-service";
import { makeRevenuesService } from "./factories/make-revenues-service";
import { makeTaxesService } from "./factories/make-taxes-service";
import { Anexo3Year, makeAnexo3Service } from "./factories/taxes-factories/make-anexo3-service";
import { IRPFYear, makeIRPFService } from "./factories/taxes-factories/make-irpf-service";
import { IRPFResult } from "./taxes-services/interfaces/base-irpf-service-interface";


interface RemunerationTaxes {
    calc: IRPFResult;
    taxes: Taxes[];
}

interface NewRemunerationData {
    companyId: number;
    date: string;
    employeeId: number;
}

interface UpdateRemunerationData extends NewRemunerationData {}
interface NewEmptyRemunerationData extends NewRemunerationData {}
interface RemunerationCalcResult {
    sugestedRemuneration: Decimal;
    netAmount: Decimal;
    taxes: IRPFResult;
}


export class RemunerationsService {
    constructor(private remunerationsRepository: RemunerationsRepository) {}


    async new({ companyId, date, employeeId }: NewRemunerationData) {

        const { sugestedRemuneration, netAmount } = await this.calcRemunerationWithFatorR({ companyId, date, employeeId });

        // por enquanto nós vamos criar apenas salários baseados no simples nacional.
        const remunerationCreateData: Prisma.RemunerationsCreateInput = {
            company: {
                connect: {
                    id: companyId
                }
            },
            amount_sugested: sugestedRemuneration.toString(),
            netAmount_sugested: netAmount.toString(),
            amount_paid: "0",
            netAmount_paid: "0",
            currency: Currencies.brl,
            date: new Date(date),
            employee: {
                connect: {
                    id: employeeId
                }
            }
        }

        return this.remunerationsRepository.create(remunerationCreateData);
    }

    async newEmptyRemuneration(data: NewEmptyRemunerationData) {
        const company = await makeCompaniesService().getCompanyById(data.companyId);
        if(!company) {
            throw new NotFoundError({ what: "Company" });
        }

        const employee = await makeEmployeesService().findById(data.employeeId);
        if(!employee) {
            throw new NotFoundError({ what: "Employee" });
        }

        const remunerationCreateData: Prisma.RemunerationsCreateInput = {
            company: {
                connect: {
                    id: data.companyId
                }
            },
            employee: {
                connect: {
                    id: data.employeeId
                }
            },
            amount_sugested: "0",
            netAmount_sugested: "0",
            amount_paid: "0",
            netAmount_paid: "0",
            currency: Currencies.brl,
            date: new Date(data.date),
        }

        return this.remunerationsRepository.create(remunerationCreateData);
    }

    async updateRemunerationSugestedAmounts({companyId, date, employeeId }: UpdateRemunerationData) {
        const company = await makeCompaniesService().getCompanyById(companyId);
        if(!company) {
            throw new NotFoundError({ what: "Company" });
        }
        const remuneration = await this.remunerationsRepository.getRemunerationByEmployeeIdAndDate(employeeId, date);
        if(!remuneration) {
            throw new NotFoundError({ what: "Remuneration" });
        }
        const remCalc = await this.calcRemunerationWithFatorR({ companyId, date, employeeId });

        const remunerationUpdateData: Prisma.RemunerationsUpdateInput = {
            amount_sugested: remCalc.sugestedRemuneration.toString(),
            netAmount_sugested: remCalc.netAmount.toString(),
        }

        return this.update(remuneration.id!, remunerationUpdateData);
    }

    async update(id: number, data: Prisma.RemunerationsUpdateInput) {
        return this.remunerationsRepository.update(id, data);
    }

    // calculate the remuneration + fees + taxes (IRRF, INSS)
    // os cálculos de impostos devem ser feitos no service de taxes
    // o cálculo de fees deve ser feito no service de fees (se houver, fazer aqui)
    async calcTaxes(remuneration: number, remunerationsId: number): Promise<RemunerationTaxes> {
        const taxesService = makeTaxesService();
        const irpfService = makeIRPFService(IRPFYear.Y2025);
        const irpfTax = await irpfService.calculateTax(remuneration);
        let irpfTaxCreated: Partial<Taxes & { wasCreated: boolean }> | null = null;
        let inssTaxCreated: Partial<Taxes & { wasCreated: boolean }> | null = null;
        try {
            irpfTaxCreated = await taxesService.create({
                name: "IRPF",
                amount: convertToDecimalNumber(irpfTax.irpfTax).toString(),
                description: "Imposto de Renda Pessoa Física",
                currency: Currencies.brl,
                company: {
                    connect: {
                        id: companyId
                    }
                }
            })
            irpfTaxCreated.wasCreated = true;

            inssTaxCreated = await taxesService.create({
                name: "INSS",
                amount: convertToDecimalNumber(irpfTax.inssTax).toString(),
                description: "INSS Prolabore",
                currency: Currencies.brl,
                taxesRemunerations: {
                    create: {
                        remunerations: {
                            connect: {
                                id: remunerationsId
                            }
                        }
                    }
                }
            })
            inssTaxCreated.wasCreated = true;

            const irpfTaxReturn: Taxes = {
                id: irpfTaxCreated.id!,
                name: irpfTaxCreated.name!,
                amount: irpfTaxCreated.amount!,
                description: irpfTaxCreated.description!,
                currency: irpfTaxCreated.currency!,
                created_at: irpfTaxCreated.created_at!,
                updated_at: irpfTaxCreated.updated_at!
            }
            const inssTaxReturn: Taxes = {
                id: inssTaxCreated.id!,
                name: inssTaxCreated.name!,
                amount: inssTaxCreated.amount!,
                description: inssTaxCreated.description!,
                currency: inssTaxCreated.currency!,
                created_at: inssTaxCreated.created_at!,
                updated_at: inssTaxCreated.updated_at!
            }

            const remunerationTaxes: RemunerationTaxes = {
                calc: {...irpfTax},
                taxes: [
                    irpfTaxReturn,
                    inssTaxReturn
                ]
            }
            return remunerationTaxes;
        } catch (error) {

            if (irpfTaxCreated?.wasCreated) {
                await taxesService.delete(irpfTaxCreated.id!);
            }

            if (inssTaxCreated?.wasCreated) {
                await taxesService.delete(inssTaxCreated.id!);
            }

            throw error;
        }
    }

    async calcRemunerationWithFatorR({ companyId, date, employeeId }: NewRemunerationData): Promise<RemunerationCalcResult> {
        const companiesService = makeCompaniesService();
        const revenuesService = makeRevenuesService();
        const employeesService = makeEmployeesService();
        const company = await companiesService.getCompanyById(companyId);
        if(!company) {
            throw new NotFoundError({ what: "Company" });
        }

        const employee = await employeesService.findById(employeeId);
        if(!employee) {
            throw new NotFoundError({ what: "Employee" });
        }

        const salaryLast12MonthsSum = await this.getLast12MonthsSalarySum(companyId);
        const revenuesLast12MonthsSum = await revenuesService.getLast12MonthsRevenueSum(companyId);
        const revenuesCurrentMonthSum = await revenuesService.getMonthRevenueSum(companyId, date);
        const currentRevenues = convertToDecimalWithNoPrecisionAdjust(revenuesCurrentMonthSum);
        const anexo3Service = makeAnexo3Service(Anexo3Year.Y2025);
        const isFatorRSatisfied = await anexo3Service.isFatorRSatisfied(
            convertToDecimalWithNoPrecisionAdjust(revenuesLast12MonthsSum),
            convertToDecimalWithNoPrecisionAdjust(salaryLast12MonthsSum)
        );

        if(!isFatorRSatisfied) {
            console.log("Fator R not satisfied: " + anexo3Service.getCurrentFatorR());
            // TODO: drop an alert here for future purposes (salary adjustment)
        }

        const currentFatorR = convertNumberToDecimalPrecision(anexo3Service.fatorR);

        const sugestedRemuneration = multiplyScaled(currentRevenues, currentFatorR);
        // calcular o valor do INSS
        // calcular o valor do IRRF
        const irpfService = makeIRPFService(IRPFYear.Y2025);
        const taxes = await irpfService.calculateTax(convertToDecimalNumber(sugestedRemuneration));
        const netAmount = convertNumberToDecimalPrecision(taxes.netSalary);

        return {
            sugestedRemuneration,
            netAmount,
            taxes
        }
    }

    async getLast12MonthsSalarySum(companyId: number) {
        const { amountPaidSum } = await this.remunerationsRepository.getSumOfRemunerations(companyId, 12);
        return amountPaidSum;
    }

    async getRemunerationByEmployeeIdAndDate(employeeId: number, date: string) {
        return this.remunerationsRepository.getRemunerationByEmployeeIdAndDate(employeeId, date);
    }

    async getRemunerationsByDate({ companyId, date }: {companyId: number, date: string}) {
        return this.remunerationsRepository.getRemunerationsByDate(companyId, date);
    }
}
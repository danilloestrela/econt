import { RemunerationsRepository } from "@/repositories/remunerations-repository";
import { convertToDecimalNumber, convertToDecimalWithNoPrecisionAdjust } from "@/utils/decimalUtils";
import { Currencies, Prisma, Taxes } from "@prisma/client";
import { NotFoundError } from "./errors/common-errors";
import { makeCompaniesService } from "./factories/make-companies-service";
import { makeRevenuesService } from "./factories/make-revenues-service";
import { makeTaxesService } from "./factories/make-taxes-service";
import { Anexo3Year, makeAnexo3Service } from "./factories/taxes-factories/make-anexo3-service";
import { IRPFYear, makeIRPFService } from "./factories/taxes-factories/make-irpf-service";
import { IRPFResult } from "./taxes-services/interfaces/base-irpf-service-interface";


interface RemunerationTaxes {
    calc: IRPFResult;
    taxes: Taxes[];
}

export class RemunerationsService {
    constructor(private remunerationsRepository: RemunerationsRepository) {}


    async new({ companyId }: { companyId: number }) {
        const companiesService = makeCompaniesService();
        const revenuesService = makeRevenuesService();
        const company = await companiesService.getCompanyById(companyId);
        if(!company) {
            throw new NotFoundError({ what: "Company" });
        }

        const salaryLast12MonthsSum = await this.getLast12MonthsSalarySum(companyId);
        const revenuesLast12MonthsSum = await revenuesService.getLast12MonthsRevenueSum(companyId);
        const anexo3Service = makeAnexo3Service(Anexo3Year.Y2025);
        const isFatorRSatisfied = await anexo3Service.isFatorRSatisfied(
            convertToDecimalWithNoPrecisionAdjust(revenuesLast12MonthsSum),
            convertToDecimalWithNoPrecisionAdjust(salaryLast12MonthsSum)
        );

        if(!isFatorRSatisfied) {
            console.log("Fator R not satisfied: " + anexo3Service.getCurrentFatorR());
            // TODO: drop an alert here for future purposes (salary adjustment)
        }

        const currentFatorR = anexo3Service.fatorR;


        // por enquanto nós vamos criar apenas salários baseados no simples nacional.
        const remunerationCreateData: Prisma.RemunerationsCreateInput = {
            company: {
                connect: {
                    id: companyId
                }
            },
            amount_sugested: "0",
            netAmount_sugested: "0",
            amount_paid: "0",
            netAmount_paid: "0",
            currency: Currencies.brl,
        }

        return this.remunerationsRepository.create(remunerationCreateData);
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
            })
            irpfTaxCreated.wasCreated = true;

            inssTaxCreated = await taxesService.create({
                name: "INSS",
                amount: convertToDecimalNumber(irpfTax.inssTax).toString(),
                description: "INSS Prolabore",
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
                created_at: irpfTaxCreated.created_at!,
                updated_at: irpfTaxCreated.updated_at!
            }
            const inssTaxReturn: Taxes = {
                id: inssTaxCreated.id!,
                name: inssTaxCreated.name!,
                amount: inssTaxCreated.amount!,
                description: inssTaxCreated.description!,
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

    async getLast12MonthsSalarySum(companyId: number) {
        const { amountPaidSum } = await this.remunerationsRepository.getSumOfRemunerations(companyId, 12);
        return amountPaidSum;
    }


}
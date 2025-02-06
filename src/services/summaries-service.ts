import { SummariesRepository } from "@/repositories/summaries-repository";
import { toSimpleYearMonthDate } from "@/utils/dateUtils";
import { NotCreatedError, NotFoundError } from "./errors/common-errors";
import { makeEmployeesService } from "./factories/make-employees-service";
import { makeFeesService } from "./factories/make-fees-service";
import { makeRemunerationsService } from "./factories/make-remunerations-service";
import { makeTaxesService } from "./factories/make-taxes-service";

interface NewSummaryEmptyData {
    companyId: number;
    summaryDate: string;
}

interface HasSummaryData extends NewSummaryEmptyData {}

interface UpdateRevenueSummaryData {
    summaryId: number;
    revenue_amount?: string;
}

export class SummariesService {
    constructor(private summariesRepository: SummariesRepository) {}

    async newEmptySummary(data: NewSummaryEmptyData) {
        // If a summary is been created, we need to create remuneration
        // take this from remunerations service

        // ---
        // Today we only have one employee per company
        // In the future we might have to create a remuneration for each employee
        // ALso atribute a "automatic" remuneration for each
        const employeeService = makeEmployeesService();
        const employee = await employeeService.findByCompanyId(data.companyId);
        if (!employee) throw new NotFoundError({what: 'Employee'})

        const remuneration = await makeRemunerationsService().newEmptyRemuneration({
            companyId: data.companyId,
            date: data.summaryDate,
            employeeId: employee.id
        });

        if (!remuneration) throw new NotCreatedError({what: 'Remuneration'})

        const summaryDate = new Date(data.summaryDate);

        const summary = await this.summariesRepository.create({
            company: {
                connect: {
                    id: data.companyId
                }
            },
            summary_date: summaryDate,
            total_revenues: '0',
            total_remuneration: remuneration.amount_sugested,
            total_profit: '0',
            total_fees: '0',
            total_taxes: '0',
            total_debts: '0',
            total_debts_percentage: '0',
            total_withdrawed: '0',
            remunaration_withdraw: '0',
            profit_withdraw_sugestion: '0',
            profit_withdrawed: '0',
            remaining_amount: '0',
            remaining_amount_total: '0',
        });

        if (!summary) throw new NotCreatedError({what: 'Summary'})



        return summary;
    }

    async hasSummary(data: HasSummaryData) {
        const summary = await this.summariesRepository.findByCompanyIdAndDate(data.companyId, data.summaryDate);
        return summary !== null;
    }

    async updateSummaryFromRemuneration(data: UpdateRevenueSummaryData) {
        // If a revenue is beeing updated we need to update the remuneration too
        // take this from remunerations service
        // check if the remuneration is already created, if not, create it
        // if it is, update it
        // return the result here to be added to the summary
        const remunerationService = makeRemunerationsService();
        const employeeService = makeEmployeesService();
        const taxesService = makeTaxesService();
        const feesService = makeFeesService();

        const currentSummary = await this.summariesRepository.findById(data.summaryId);
        if (!currentSummary) throw new NotFoundError({what: 'Summary'})

        const employee = await employeeService.findByCompanyId(currentSummary.company_id);
        if (!employee) throw new NotFoundError({what: 'Employee'})

        const currentRemuneration = await remunerationService.getRemunerationByEmployeeIdAndDate(
            employee.id, toSimpleYearMonthDate(currentSummary.summary_date)
        );

        if (!currentRemuneration) throw new NotFoundError({what: 'Remuneration'})

        const remuneration = await remunerationService.updateRemunerationSugestedAmounts({
            companyId: currentSummary.company_id,
            date: toSimpleYearMonthDate(currentSummary.summary_date),
            employeeId: employee.id
        });

        if (!remuneration) throw new NotCreatedError({what: 'Remuneration'})

        const taxesSum = await taxesService.getTaxesSumByCompanyIdAndDate(currentSummary.company_id, toSimpleYearMonthDate(currentSummary.summary_date));
        const feesSum = await feesService.getFeesSumByCompanyIdAndDate(currentSummary.company_id, toSimpleYearMonthDate(currentSummary.summary_date));
        const summary = await this.summariesRepository
        .update(data.summaryId,
            {
                total_revenues: data.revenue_amount,
                total_remuneration: remuneration.amount_sugested,
                total_fees: '0',
                total_taxes: '0',
                total_debts: '0',
                total_debts_percentage: '0',
                total_withdrawed: '0',
                remunaration_withdraw: '0',
                profit_withdraw_sugestion: '0',
                profit_withdrawed: '0',
                remaining_amount: '0',
                remaining_amount_total: '0',
            }
        );
        return summary;
    }

    async findSummaryByCompanyIdAndSummaryDate(data: HasSummaryData) {
        const summary = await this.summariesRepository.findByCompanyIdAndDate(data.companyId, data.summaryDate);
        return summary;
    }

    async delete(id: number) {
        const summary = await this.summariesRepository.delete(id);
        return summary;
    }
}
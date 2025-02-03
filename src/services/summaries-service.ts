import { SummariesRepository } from "@/repositories/summaries-repository";
import { NotCreatedError } from "./errors/common-errors";

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
        // If a summary is been created, we need to update a remuneration too
        // take this from remunerations service
        // (create a new remuneration and return the result here to be added to the summary)
        const summaryDate = new Date(data.summaryDate);

        const summary = await this.summariesRepository.create({
            company: {
                connect: {
                    id: data.companyId
                }
            },
            summary_date: summaryDate,
            total_revenues: '0',
            total_remuneration: '0',
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

    async updateRevenueSummary(data: UpdateRevenueSummaryData) {
        // If a revenue is beeing updated we need to update the remuneration too
        // take this from remunerations service
        // check if the remuneration is already created, if not, create it
        // if it is, update it
        // return the result here to be added to the summary
        const summary = await this.summariesRepository
        .update(data.summaryId,
            {
                total_revenues: data.revenue_amount,
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

    async delete(id: number) {
        const summary = await this.summariesRepository.delete(id);
        return summary;
    }
}
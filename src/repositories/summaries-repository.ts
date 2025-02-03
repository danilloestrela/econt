import { Prisma, Summaries } from "@prisma/client";

export interface SummariesRepository {
    create(data: Prisma.SummariesCreateInput): Promise<Summaries>;
    update(id: number, data: Prisma.SummariesUpdateInput): Promise<Summaries>;
    findByCompanyIdAndDate(companyId: number, date: string): Promise<Summaries | null>;
    findById(id: number): Promise<Summaries | null>;
    list(page: number, pageSize: number, where?: Prisma.SummariesWhereInput): Promise<Summaries[]>;
    delete(id: number): Promise<Summaries>;
}
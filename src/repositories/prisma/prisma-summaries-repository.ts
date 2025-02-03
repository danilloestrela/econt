import { prisma } from "@/lib/prisma";
import { Prisma, Summaries } from "@prisma/client";
import { SummariesRepository } from "../summaries-repository";

export class PrismaSummariesRepository implements SummariesRepository {
    async findByCompanyIdAndDate(companyId: number, date: string): Promise<Summaries | null> {
        const dateObj = new Date(date);
        const startOfMonth = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
        const endOfMonth = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);

        return await prisma.summaries.findFirst({
            where: {
                company_id: companyId,
                summary_date: {
                    gte: startOfMonth,
                    lte: endOfMonth
                }
            }
        });
    }

    async create(data: Prisma.SummariesCreateInput): Promise<Summaries> {
        return await prisma.summaries.create({ data });
    }

    async update(id: number, data: Prisma.SummariesUpdateInput): Promise<Summaries> {
        return await prisma.summaries.update({ where: { id }, data });
    }

    async findByDate(date: string): Promise<Summaries | null> {
        const dateObj = new Date(date);
        const startOfMonth = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
        const endOfMonth = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);

        return await prisma.summaries.findFirst({
            where: {
                summary_date: {
                    gte: startOfMonth,
                    lte: endOfMonth
                }
            }
        });
    }

    async findByCompanyId(companyId: number): Promise<Summaries | null> {
        return await prisma.summaries.findFirst({ where: { company_id: companyId } });
    }

    async findById(id: number): Promise<Summaries | null> {
        return await prisma.summaries.findUnique({ where: { id } });
    }

    async list(page: number, pageSize: number, where?: Prisma.SummariesWhereInput): Promise<Summaries[]> {
        return await prisma.summaries.findMany({ where, skip: (page - 1) * pageSize, take: pageSize });
    }

    async delete(id: number): Promise<Summaries> {
        return await prisma.summaries.delete({ where: { id } });
    }

}
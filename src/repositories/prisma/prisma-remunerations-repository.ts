import { prisma } from "@/lib/prisma";
import { addScaled, convertNumberToDecimalPrecision, convertToDecimalNumber } from "@/utils/decimalUtils";
import { Prisma, Remunerations } from "@prisma/client";
import { RemunerationsRepository } from "../remunerations-repository";

export class PrismaRemunerationsRepository implements RemunerationsRepository {

    async create(data: Prisma.RemunerationsCreateInput): Promise<Remunerations> {
        return await prisma.remunerations.create({ data });
    }
    async update(id: number, data: Prisma.RemunerationsUpdateInput): Promise<Remunerations> {
        return await prisma.remunerations.update({ where: { id }, data });
    }
    async findById(id: number): Promise<Remunerations | null> {
        return await prisma.remunerations.findUnique({ where: { id } });
    }
    async list(page: number, pageSize: number, where?: Prisma.RemunerationsWhereInput): Promise<Remunerations[]> {
        return await prisma.remunerations.findMany({ where, skip: (page - 1) * pageSize, take: pageSize });
    }
    async delete(id: number): Promise<Remunerations> {
        return await prisma.remunerations.delete({ where: { id } });
    }
    async getSumOfRemunerations(companyId: number, months: number): Promise<{amountPaidSum: string, months: number, remunerations: Remunerations[]}> {
        const date = new Date();
        const startDate = new Date(date.getFullYear(), date.getMonth() - months + 1, 1);
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const result = await prisma.remunerations.findMany({
            where: {
                company_id: companyId,
                created_at: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });

        const sum = result.reduce((sum, remunerations) =>  addScaled(sum, convertToDecimalNumber(remunerations.amount_paid)), convertNumberToDecimalPrecision(0));
        return {
            amountPaidSum: sum.toString(),
            months,
            remunerations: result
        }
    }
}
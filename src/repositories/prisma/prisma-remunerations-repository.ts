import { prisma } from "@/lib/prisma";
import { extractYearMonthFromStringDate, getMonthFromMonthsAgo } from "@/utils/dateUtils";
import { addScaled, convertNumberToDecimalPrecision, convertToDecimalNumber } from "@/utils/decimalUtils";
import { Prisma, Remunerations } from "@prisma/client";
import { RemunerationsRepository } from "../remunerations-repository";

export class PrismaRemunerationsRepository implements RemunerationsRepository {
    async create(data: Prisma.RemunerationsCreateInput): Promise<Remunerations> {
        return await prisma.remunerations.create({ data });
    }

    async getMonthTotalRemunerations(companyId: number, month: string): Promise<{ totalAmountSum: string; month: string; remunerations: Remunerations[]; }> {
        const { startDate, endDate } = extractYearMonthFromStringDate(month);

        const result = await prisma.remunerations.findMany({
            where: {
                company_id: companyId,
                created_at: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                employee: true,
                company: true,
                transaction: true,
                feesRemunerations: true,
                taxesRemunerations: true
            }
        });

        const sum = result.reduce((sum, remunerations) =>  addScaled(sum, convertToDecimalNumber(remunerations.amount_paid)), convertNumberToDecimalPrecision(0));

        return {
            totalAmountSum: sum.toString(),
            month,
            remunerations: result
        }
    }
    async getRemunerationByEmployeeId(employeeId: number, date: string): Promise<Remunerations | null> {
        const { startDate, endDate } = extractYearMonthFromStringDate(date);

        const result = await prisma.remunerations.findFirst({
            where: {
                employee_id: employeeId,
                created_at: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                employee: true,
                company: true,
                transaction: true,
                feesRemunerations: true,
                taxesRemunerations: true
            }
        });

        return result;
    }

    async getRemunerationByEmployeeIdAndDate(employeeId: number, date: string): Promise<Remunerations | null> {
        const { startDate, endDate } = extractYearMonthFromStringDate(date);

        const result = await prisma.remunerations.findFirst({
            where: {
                employee_id: employeeId,
                created_at: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                employee: true,
                company: true,
                transaction: true,
                feesRemunerations: true,
                taxesRemunerations: true
            }
        });

        return result;
    }
    async update(id: number, data: Prisma.RemunerationsUpdateInput): Promise<Remunerations> {
        return await prisma.remunerations.update({ where: { id }, data });
    }
    async findById(id: number): Promise<Remunerations | null> {
        return await prisma.remunerations.findUnique({ where: { id }, include: {
            employee: true,
            company: true,
            transaction: true,
            feesRemunerations: true,
            taxesRemunerations: true
        } });
    }
    async list(page: number, pageSize: number, where?: Prisma.RemunerationsWhereInput): Promise<Remunerations[]> {
        return await prisma.remunerations.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, include: {
            employee: true,
            company: true,
            transaction: true,
            feesRemunerations: true,
            taxesRemunerations: true
        } });
    }
    async delete(id: number): Promise<Remunerations> {
        return await prisma.remunerations.delete({ where: { id } });
    }
    async getSumOfRemunerations(companyId: number, months: number): Promise<{amountPaidSum: string, months: number, remunerations: Remunerations[]}> {
        const { startMonthsDate, endMonthsDate } = getMonthFromMonthsAgo(months);

        const result = await prisma.remunerations.findMany({
            where: {
                company_id: companyId,
                created_at: {
                    gte: startMonthsDate,
                    lte: endMonthsDate
                }
            },
            include: {
                employee: true,
                company: true,
                transaction: true,
                feesRemunerations: true,
                taxesRemunerations: true
            }
        });

        const sum = result.reduce((sum, remunerations) =>  addScaled(sum, convertToDecimalNumber(remunerations.amount_paid)), convertNumberToDecimalPrecision(0));
        return {
            amountPaidSum: sum.toString(),
            months,
            remunerations: result
        }
    }

    async getRemunerationsByDate(companyId: number, date: string): Promise<Remunerations[]> {
        const { startDate, endDate } = extractYearMonthFromStringDate(date);

        const result = await prisma.remunerations.findMany({
            where: {
                company_id: companyId,
                created_at: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                employee: true,
                company: true,
                transaction: true,
                feesRemunerations: true,
                taxesRemunerations: true
            }
        });

        return result;
    }
}
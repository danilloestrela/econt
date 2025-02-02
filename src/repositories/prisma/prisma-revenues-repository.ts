import { prisma } from "@/lib/prisma";
import { RevenuesRepository } from "@/repositories/revenues-respository";
import { addScaled, convertNumberToDecimalPrecision, convertToDecimalNumber } from "@/utils/decimalUtils";
import { Prisma, Revenues } from "@prisma/client";

export class PrismaRevenuesRepository implements RevenuesRepository {
  getCurrentMonthRevenueSum(companyId: number, month: string): Promise<{ totalAmountSum: string; months: number; revenues: Revenues[] }> {
    throw new Error("Method not implemented.")
  }
  async create(data: Prisma.RevenuesCreateInput) {
    return await prisma.revenues.create({ data })
  }

  async update(id: string, data: Prisma.RevenuesUpdateInput): Promise<Revenues> {
    return await prisma.revenues.update({ where: { id }, data })
  }

  async delete(id: string): Promise<Revenues | Error> {
    const result = await prisma.revenues.delete({ where: { id } })
    if (!result) {
      return new Error("Revenue not found")
    }
    return result
  }

  async findByCompanyId(companyId: number) {
    return await prisma.revenues.findFirst({ where: { company_id: companyId } })
  }

  async createOrFind(data: Prisma.RevenuesCreateInput) {
    return await prisma.revenues.create({ data })
  }

  async getSumOfRevenues(companyId: number, months: number) {
    const date = new Date();
    const startDate = new Date(date.getFullYear(), date.getMonth() - months + 1, 1);
    const endDate = new Date(date.getFullYear(), date.getMonth(), 0);

    const result = await prisma.revenues.findMany({
        where: {
            company_id: companyId,
            received_date: {
                gte: startDate,
                lte: endDate
            }
        }
    });

    const sum = result.reduce((sum, revenue) =>  addScaled(sum, convertToDecimalNumber(revenue.total_amount)), convertNumberToDecimalPrecision(0));
    return {
        months,
        totalAmountSum: sum.toString(),
        revenues: result
    }
  }

  /**
   * month example: "2025-01-01"
   * Get the sum of revenues for the current month
   * Scenario:
   * Its common that a company receive many different revenues in the same month,
   * so we need to sum all of them to know the total amount of revenue for the month.
   */
  async getMonthTotalRevenue(companyId: number, month: string) {
    const [year, monthIndex, ] = month.split('-').map(Number); // eg: 2025-01-01
    const startDate = new Date(year, monthIndex - 1, 1);
    const endDate = new Date(year, monthIndex, 0);

    const result = await prisma.revenues.findMany({
        where: {
            company_id: companyId,
            received_date: {
                gte: startDate,
                lte: endDate
            }
        }
    });

    const sum = result.reduce((sum, revenue) =>  addScaled(sum, convertToDecimalNumber(revenue.total_amount)), convertNumberToDecimalPrecision(0));
    return {
        month,
        totalAmountSum: sum.toString(),
        revenues: result
    }
  }

  async has12MonthsRevenues(companyId: number) {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 11, 1);

    const revenues = await prisma.revenues.findMany({
      where: {
        company_id: companyId,
        received_date: {
          gte: startDate,
          lte: currentDate
        }
      }
    });

    const monthsWithRevenues = new Set<number>();

    revenues.forEach(revenue => {
      const month = revenue.received_date!.getFullYear() * 12 + revenue.received_date!.getMonth();
      monthsWithRevenues.add(month);
    });

    return monthsWithRevenues.size === 12;
  }
}

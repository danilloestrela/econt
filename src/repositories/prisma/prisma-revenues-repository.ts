import { prisma } from "@/lib/prisma";
import { RevenuesRepository } from "@/repositories/revenues-respository";
import { extractYearMonthFromDate, extractYearMonthFromStringDate, getMonthFromMonthsAgo } from "@/utils/dateUtils";
import { addScaled, convertNumberToDecimalPrecision, convertToDecimalNumber } from "@/utils/decimalUtils";
import { Prisma, Revenues } from "@prisma/client";

export class PrismaRevenuesRepository implements RevenuesRepository {
  async getSumOfMonthRevenues(companyId: number, date: string): Promise<{ totalAmountSum: string, date: string, revenues: Revenues[] }> {
    const { startDate, endDate } = extractYearMonthFromStringDate(date);

    const result = await prisma.revenues.findMany({
        where: {
            company_id: companyId,
            received_date: {
                gte: startDate,
                lte: endDate
            }
        },
        include: {
            company: true,
            sources: true,
            transaction: true,
            conversion: true,
            summary: true
        }
    });

    const sum = result.reduce((sum, revenue) =>  addScaled(sum, convertToDecimalNumber(revenue.total_amount)), convertNumberToDecimalPrecision(0));
    return {
        date,
        totalAmountSum: sum.toString(),
        revenues: result
    }
  }

  async create(data: Prisma.RevenuesCreateInput) {
    return await prisma.revenues.create({ data })
  }

  async update(id: string, data: Prisma.RevenuesUpdateInput): Promise<Revenues> {
    return await prisma.revenues.update({ where: { id }, data })
  }

  async delete(id: string): Promise<Revenues | Error> {
    const result = await prisma.revenues.delete({ where: { id }, include: {
      company: true,
      sources: true,
      transaction: true,
      conversion: true,
      summary: true
    } })
    if (!result) {
      return new Error("Revenue not found")
    }
    return result
  }

  async findByCompanyId(companyId: number) {
    return await prisma.revenues.findFirst({ where: { company_id: companyId }, include: {
      company: true,
      sources: true,
      transaction: true,
      conversion: true,
      summary: true
    } })
  }

  async createOrFind(data: Prisma.RevenuesCreateInput) {
    return await prisma.revenues.create({
      data,
      include: {
        company: true,
        sources: true,
        transaction: true,
        conversion: true,
        summary: true
      }
    })
  }

  async getSumOfRevenues(companyId: number, months: number) {
    const { startMonthsDate, endMonthsDate } = getMonthFromMonthsAgo(months);

    const result = await prisma.revenues.findMany({
        where: {
            company_id: companyId,
            received_date: {
                gte: startMonthsDate,
                lte: endMonthsDate
            }
        },
        include: {
          company: true,
          sources: true,
          transaction: true,
          conversion: true,
          summary: true
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
    const { startDate, endDate } = extractYearMonthFromStringDate(month);

    const result = await prisma.revenues.findMany({
        where: {
            company_id: companyId,
            received_date: {
                gte: startDate,
                lte: endDate
            }
        },
        include: {
          company: true,
          sources: true,
          transaction: true,
          conversion: true,
          summary: true
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
    const { endMonthDate } = extractYearMonthFromDate(currentDate);
    const revenues = await prisma.revenues.findMany({
      where: {
        company_id: companyId,
        received_date: {
          gte: endMonthDate,
          lte: currentDate
        }
      },
      include: {
        company: true,
        sources: true,
        transaction: true,
        conversion: true,
        summary: true
      }
    });

    const monthsWithRevenues = new Set<number>();

    revenues.forEach(revenue => {
      const month = revenue.received_date!.getFullYear() * 12 + revenue.received_date!.getMonth();
      monthsWithRevenues.add(month);
    });

    return monthsWithRevenues.size === 12;
  }

  async getRevenuesByDate(companyId: number, date: string): Promise<Revenues[]> {
    const { startDate, endDate } = extractYearMonthFromStringDate(date);

    return await prisma.revenues.findMany({
      where: {
        company_id: companyId,
        received_date: { gte: startDate, lte: endDate }
      },
      include: {
        company: true,
        sources: true,
        transaction: true,
        conversion: true,
        summary: true
    }
   });

  }

}

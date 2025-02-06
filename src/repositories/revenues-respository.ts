import { Prisma, Revenues } from "@prisma/client"

export interface RevenuesRepository {
  create(data: Prisma.RevenuesCreateInput): Promise<Revenues>
  update(id: string, data: Prisma.RevenuesUpdateInput): Promise<Revenues>
  delete(id: string): Promise<Revenues | Error>
  findByCompanyId(companyId: number): Promise<Revenues | null>
  getSumOfRevenues(companyId: number, months: number): Promise<{ totalAmountSum: string, months: number, revenues: Revenues[] }>
  getSumOfMonthRevenues(companyId: number, date: string): Promise<{ totalAmountSum: string, date: string, revenues: Revenues[] }>
  has12MonthsRevenues(companyId: number): Promise<boolean>
  getRevenuesByDate(companyId: number, date: string): Promise<Revenues[]>
}
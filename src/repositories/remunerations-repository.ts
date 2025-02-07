import { Prisma, Remunerations } from "@prisma/client";

export interface RemunerationsRepository {
    create(data: Prisma.RemunerationsCreateInput): Promise<Remunerations>;
    update(id: number, data: Prisma.RemunerationsUpdateInput): Promise<Remunerations>;
    findById(id: number): Promise<Remunerations | null>;
    list(page: number, pageSize: number, where?: Prisma.RemunerationsWhereInput): Promise<Remunerations[]>;
    delete(id: number): Promise<Remunerations>;
    getSumOfRemunerations(companyId: number, months: number): Promise<{amountPaidSum: string, months: number, remunerations: Remunerations[]}>;
    getMonthTotalRemunerations(companyId: number, month: string): Promise<{totalAmountSum: string, month: string, remunerations: Remunerations[]}>;
    getRemunerationByEmployeeId(employeeId: number, date: string): Promise<Remunerations | null>;
    getRemunerationByEmployeeIdAndDate(employeeId: number, date: string): Promise<Remunerations | null>;
    getRemunerationsByDate(companyId: number, date: string): Promise<Remunerations[]>;
}
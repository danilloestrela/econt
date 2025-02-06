import { Employees, Prisma } from "@prisma/client";

export interface EmployeesRepository {
    create(data: Prisma.EmployeesCreateInput): Promise<Employees>
    findById(id: number): Promise<Employees | null>
    list({page, perPage}: {page: number, perPage: number}): Promise<Employees[]>
    update(id: number, data: Prisma.EmployeesUpdateInput): Promise<Employees>
    delete(id: number): Promise<void>
    getEmployeeByCompanyId(companyId: number): Promise<Employees | null>
}
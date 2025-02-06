import { EmployeesRepository } from "@/repositories/employees-repository";
import { Employees, Prisma } from "@prisma/client";

export class EmployeesService {
    constructor(private employeesRepository: EmployeesRepository) {}
    async create(data: Prisma.EmployeesCreateInput): Promise<Employees> {
        return await this.employeesRepository.create(data)
    }
    async findById(id: number): Promise<Employees | null> {
        return await this.employeesRepository.findById(id)
    }
    async findByCompanyId(companyId: number): Promise<Employees | null> {
        return await this.employeesRepository.getEmployeeByCompanyId(companyId)
    }
    async list({ page, perPage }: { page: number, perPage: number }): Promise<Employees[]> {
        return await this.employeesRepository.list({ page, perPage })
    }
}
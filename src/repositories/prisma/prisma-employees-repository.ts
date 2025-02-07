import { prisma } from "@/lib/prisma";
import { Employees, Prisma } from "@prisma/client";
import { EmployeesRepository } from "../employees-repository";

export class PrismaEmployeesRepository implements EmployeesRepository {
    async create(data: Prisma.EmployeesCreateInput): Promise<Employees> {
        const employee = await prisma.employees.create({data, include: {
            company: true,
            Remunerations: true
        }})
        return employee;
    }
    async findById(id: number): Promise<Employees | null> {
        const employee = await prisma.employees.findUnique({where: {id}, include: {
            company: true,
            Remunerations: true
        }})
        return employee;
    }
    async list({ page, perPage }: { page: number; perPage: number; }): Promise<Employees[]> {
        const employees = await prisma.employees.findMany({skip: (page - 1) * perPage, take: perPage, include: {
            company: true,
            Remunerations: true
        }})
        return employees;
    }
    async update(id: number, data: Prisma.EmployeesUpdateInput): Promise<Employees> {
        const employee = await prisma.employees.update({where: {id}, data, include: {
            company: true,
            Remunerations: true
        }})
        return employee;
    }
    async delete(id: number): Promise<void> {
        await prisma.employees.delete({where: {id}, include: {
            company: true,
            Remunerations: true
        }})
    }
    async getEmployeeByCompanyId(companyId: number): Promise<Employees | null> {
        const employee = await prisma.employees.findFirst({
            where: { company_id: companyId },
            include: {
                company: true,
                Remunerations: true
            }
        })
        return employee;
    }
}


import { prisma } from "@/lib/prisma";
import { Companies, Prisma } from "@prisma/client";
import { CompaniesRepository } from "../companies-repository";

export class PrismaCompaniesRepository implements CompaniesRepository {

    async create(data: Prisma.CompaniesCreateInput): Promise<Companies> {
        return await prisma.companies.create({ data, include: {
            CompaniesUsers: true,
            Revenues: true,
            Summaries: true,
            Remunerations: true,
            Employees: true,
            Taxes: true,
            Fees: true,
        } });
    }

    async getCompanyById(id: number): Promise<Companies | null> {
        return await prisma.companies.findUnique({ where: { id }, include: {
            CompaniesUsers: true,
            Revenues: true,
            Summaries: true,
            Remunerations: true,
            Employees: true,
            Taxes: true,
            Fees: true,
        } });
    }
}
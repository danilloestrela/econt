import { prisma } from "@/lib/prisma";
import { Companies, Prisma } from "@prisma/client";
import { CompaniesRepository } from "../companies-repository";

export class PrismaCompaniesRepository implements CompaniesRepository {

    async create(data: Prisma.CompaniesCreateInput): Promise<Companies> {
        return await prisma.companies.create({ data });
    }

    async getCompanyById(id: number): Promise<Companies | null> {
        return await prisma.companies.findUnique({ where: { id } });
    }
}
import { Companies, Prisma } from "@prisma/client";

export interface CompaniesRepository {
    create(data: Prisma.CompaniesCreateInput): Promise<Companies>;
    getCompanyById(id: number): Promise<Companies | null>;
}
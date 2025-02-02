import { CompaniesRepository } from "@/repositories/companies-repository";
import { Prisma } from "@prisma/client";

export class CompaniesService {
    constructor(private companiesRepository: CompaniesRepository) {}

    async create(data: Prisma.CompaniesCreateInput) {
        return this.companiesRepository.create(data);
    }

    async getCompanyById(id: number) {
        return this.companiesRepository.getCompanyById(id);
    }
}
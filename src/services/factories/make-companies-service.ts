import { PrismaCompaniesRepository } from "@/repositories/prisma/prisma-companies-repository";
import { CompaniesService } from "../companies-service";

export function makeCompaniesService() {
    const companiesRepository = new PrismaCompaniesRepository();
    return new CompaniesService(companiesRepository);
}
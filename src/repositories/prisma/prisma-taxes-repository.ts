import { prisma } from "@/lib/prisma";
import { Prisma, Taxes } from "@prisma/client";
import { TaxesRepository } from "../taxes-repository";

export class PrismaTaxesRepository implements TaxesRepository {
    async findByName(name: string): Promise<Taxes | null> {
        return await prisma.taxes.findFirst({ where: { name }, include: {
            company: true,
            taxesRemunerations: true,
            taxesSummaries: true
        } });
    }

    async list(): Promise<Taxes[]> {
        return await prisma.taxes.findMany({ include: {
            company: true,
            taxesRemunerations: true,
            taxesSummaries: true
        } });
    }

    async update(id: number, data: Prisma.TaxesUpdateInput): Promise<Taxes> {
        return await prisma.taxes.update({ where: { id }, data });
    }

    async delete(id: number): Promise<Taxes | null> {
        return await prisma.taxes.delete({ where: { id }, include: {
            company: true,
            taxesRemunerations: true,
            taxesSummaries: true
        } });
    }

    async create(data: Prisma.TaxesCreateInput): Promise<Taxes> {
        return await prisma.taxes.create({ data, include: {
            company: true,
            taxesRemunerations: true,
            taxesSummaries: true
        } });
    }

    async findById(id: number): Promise<Taxes | null> {
        return await prisma.taxes.findUnique({ where: { id }, include: {
            company: true,
            taxesRemunerations: true,
            taxesSummaries: true
        } });
    }
}
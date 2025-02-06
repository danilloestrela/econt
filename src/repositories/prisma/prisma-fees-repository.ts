import { prisma } from "@/lib/prisma";
import { FeesRepository } from "@/repositories/fees-repository";
import { Fees, Prisma } from "@prisma/client";

export class PrismaFeesRepository implements FeesRepository {
    async findById(id: number): Promise<Fees | null> {
        return await prisma.fees.findUnique({ where: { id }, include: {
            company: true,
            feesConversions: true,
            feesRemunerations: true,
            feesSummaries: true
        } });
    }
    async listByPage(page: number, perPage: number): Promise<Fees[]> {
        return await prisma.fees.findMany({ skip: (page - 1) * perPage, take: perPage, include: {
            company: true,
            feesConversions: true,
            feesRemunerations: true,
            feesSummaries: true
        } });
    }
    async update(id: number, data: Prisma.FeesUpdateInput): Promise<Fees> {
        return await prisma.fees.update({ where: { id }, data, include: {
            company: true,
            feesConversions: true,
            feesRemunerations: true,
            feesSummaries: true
        } });
    }
    async delete(id: number): Promise<Fees> {
        return await prisma.fees.delete({ where: { id }, include: {
            company: true,
            feesConversions: true,
            feesRemunerations: true,
            feesSummaries: true
        } });
    }
    async create(data: Prisma.FeesCreateInput): Promise<Fees> {
        return await prisma.fees.create({ data , include: {
            company: true,
            feesConversions: true,
            feesRemunerations: true,
            feesSummaries: true
        } });
    }
    async createMany(data: Prisma.FeesCreateManyInput[]): Promise<Prisma.BatchPayload> {
        return await prisma.fees.createMany({ data });
    }
    async createManyAndReturn(data: Prisma.FeesCreateManyInput[]): Promise<Fees[]> {
        return await prisma.fees.createManyAndReturn({ data: data });
    }
}

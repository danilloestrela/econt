import { prisma } from "@/lib/prisma";
import { FeesRepository } from "@/repositories/fees-repository";
import { Fees, Prisma } from "@prisma/client";

export class PrismaFeesRepository implements FeesRepository {
    async findById(id: number): Promise<Fees | null> {
        return await prisma.fees.findUnique({ where: { id } });
    }
    async listByPage(page: number, perPage: number): Promise<Fees[]> {
        return await prisma.fees.findMany({ skip: (page - 1) * perPage, take: perPage });
    }
    async update(id: number, data: Prisma.FeesUpdateInput): Promise<Fees> {
        return await prisma.fees.update({ where: { id }, data });
    }
    async delete(id: number): Promise<Fees> {
        return await prisma.fees.delete({ where: { id } });
    }
    async create(data: Prisma.FeesCreateInput): Promise<Fees> {
        return await prisma.fees.create({ data });
    }
}
import { prisma } from "@/lib/prisma";
import { ConversionsRepository } from "@/repositories/conversions-repository";
import { Conversions, Prisma } from "@prisma/client";

export class PrismaConversionsRepository implements ConversionsRepository {
    async create(data: Prisma.ConversionsCreateInput): Promise<Conversions> {
        return await prisma.conversions.create({ data });
    }
    async update(id: number, data: Prisma.ConversionsUpdateInput): Promise<Conversions> {
        return await prisma.conversions.update({ where: { id }, data });
    }
    async delete(id: number): Promise<Conversions> {
        await prisma.feesConversions.deleteMany({ where: { conversions_id: id } });
        return await prisma.conversions.delete({ where: { id } });
    }
    async listByPage(page: number, perPage: number): Promise<Conversions[]> {
        return await prisma.conversions.findMany({ skip: (page - 1) * perPage, take: perPage });
    }
    async findById(id: number): Promise<Conversions | null> {
        return await prisma.conversions.findUnique({ where: { id } });
    }
}
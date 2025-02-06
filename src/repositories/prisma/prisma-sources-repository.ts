import { prisma } from "@/lib/prisma";
import { Sources } from "@prisma/client";
import { SourcesRepository } from "../sources-repository";

export class PrismaSourcesRepository implements SourcesRepository {
    async delete(id: number): Promise<Sources> {
        return await prisma.sources.delete({ where: { id }, include: {
            revenues: true
        } })
    }
    async findById(id: number): Promise<Sources | null> {
        return await prisma.sources.findUnique({ where: { id }, include: {
            revenues: true
        } })
    }
    async create(data: Sources): Promise<Sources> {
        return await prisma.sources.create({ data, include: {
            revenues: true
        } })
    }
}
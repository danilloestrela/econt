import { prisma } from "@/lib/prisma";
import { PlatformsRepository } from "@/repositories/platforms-repository";
import { Platforms, Prisma } from "@prisma/client";

export class PrismaPlatformsRepository implements PlatformsRepository {
    async findById(id: number): Promise<Platforms | null> {
        return await prisma.platforms.findUnique({ where: { id }, include: {
            Conversions: true
        } });
    }

    async listByPage(page: number, perPage: number): Promise<Platforms[]> {
        return await prisma.platforms.findMany({ skip: (page - 1) * perPage, take: perPage, include: {
            Conversions: true
        } });
    }

    async update(id: number, data: Prisma.PlatformsUpdateInput): Promise<Platforms> {
        return await prisma.platforms.update({ where: { id }, data, include: {
            Conversions: true
        } });
    }

    async delete(id: number): Promise<Platforms> {
        return await prisma.platforms.delete({ where: { id }, include: {
            Conversions: true
        } });
    }

    async create(data: Prisma.PlatformsCreateInput): Promise<Platforms> {
        return await prisma.platforms.create({ data, include: {
            Conversions: true
        } });
    }
}
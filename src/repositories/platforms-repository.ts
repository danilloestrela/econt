import { Platforms, Prisma } from "@prisma/client";

export interface PlatformsRepository {
    create(data: Prisma.PlatformsCreateInput): Promise<Platforms>;
    findById(id: number): Promise<Platforms | null>;
    listByPage(page: number, perPage: number): Promise<Platforms[]>;
    update(id: number, data: Prisma.PlatformsUpdateInput): Promise<Platforms>;
    delete(id: number): Promise<Platforms>;
}

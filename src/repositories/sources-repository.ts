import { Prisma, Sources } from "@prisma/client";

export interface SourcesRepository {
    create(data: Prisma.SourcesCreateInput): Promise<Sources>
    delete(id: number): Promise<Sources>
    findById(id: number): Promise<Sources | null>
}
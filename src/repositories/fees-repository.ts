import { Fees, Prisma } from "@prisma/client";

export interface FeesRepository {
    create(data: Prisma.FeesCreateInput): Promise<Fees>;
    findById(id: number): Promise<Fees | null>;
    listByPage(page: number, perPage: number): Promise<Fees[]>;
    update(id: number, data: Prisma.FeesUpdateInput): Promise<Fees>;
    delete(id: number): Promise<Fees>;
}

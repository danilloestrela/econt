import { Conversions, Prisma } from "@prisma/client";

export interface ConversionsRepository {
    create(data: Prisma.ConversionsCreateInput): Promise<Conversions>;
    update(id: number, data: Prisma.ConversionsUpdateInput): Promise<Conversions>;
    delete(id: number): Promise<Conversions>;
    listByPage(page: number, perPage: number): Promise<Conversions[]>;
    findById(id: number): Promise<Conversions | null>;
}
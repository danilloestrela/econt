import { Prisma, Taxes } from "@prisma/client";

export interface TaxesRepository {
    create(data: Prisma.TaxesCreateInput): Promise<Taxes>
    findById(id: number): Promise<Taxes | null>
    findByName(name: string): Promise<Taxes | null>
    list(): Promise<Taxes[]>
    update(id: number, data: Prisma.TaxesUpdateInput): Promise<Taxes>
    delete(id: number): Promise<Taxes | null>
}
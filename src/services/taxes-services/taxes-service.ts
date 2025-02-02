import { TaxesRepository } from "@/repositories/taxes-repository";
import { Prisma, Taxes } from "@prisma/client";

export class TaxesService {
    constructor(private taxesRepository: TaxesRepository) {}

    async create(data: Prisma.TaxesCreateInput): Promise<Taxes> {
        const taxes = await this.taxesRepository.create(data);
        return taxes;
    }

    async list(): Promise<Taxes[]> {
        const taxes = await this.taxesRepository.list();
        return taxes;
    }

    async update(id: number, data: Prisma.TaxesUpdateInput): Promise<Taxes> {
        const taxes = await this.taxesRepository.update(id, data);
        return taxes;
    }

    async delete(id: number): Promise<void> {
        const taxes = await this.taxesRepository.delete(id);
        return this.taxesRepository.delete(id);
    }
}
import { FeesRepository } from "@/repositories/fees-repository";
import { Fees, Prisma } from "@prisma/client";

export class FeesService {
    constructor(private feesRepository: FeesRepository) {}
    async new(data: Prisma.FeesCreateInput) {
        return await this.feesRepository.create(data)
    }
    async getFee(id: number) {
        return await this.feesRepository.findById(id)
    }
    async list({ page, perPage }: { page: number, perPage: number }) {
        return await this.feesRepository.listByPage(page, perPage)
    }
    async update(id: number, data: Fees) {
        return await this.feesRepository.update(id, data)
    }
    async delete(id: number) {
        return await this.feesRepository.delete(id)
    }
    async createManyAndReturn(data: Prisma.FeesCreateManyInput[]): Promise<Fees[]> {
        return await this.feesRepository.createManyAndReturn(data)
    }
}

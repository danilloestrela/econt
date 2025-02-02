import { SourcesRepository } from "@/repositories/sources-repository";
import { Prisma } from "@prisma/client";

export class SourcesService {
    constructor(private sourcesRepository: SourcesRepository) {}

    async create(data: Prisma.SourcesCreateInput) {
        const source = await this.sourcesRepository.create(data)
        return source
    }

    async hasSource(id: number) {
        const source = await this.sourcesRepository.findById(id)
        return source
    }
}
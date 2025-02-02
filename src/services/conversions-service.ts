import { ConversionsRepository } from "@/repositories/conversions-repository";
import { Conversions, Prisma } from "@prisma/client";
export class ConversionsService {
    constructor(private conversionsRepository: ConversionsRepository) {}

    async create(data: Prisma.ConversionsCreateInput): Promise<Conversions> {
        return this.conversionsRepository.create(data);
    }

    async delete(id: number): Promise<Conversions> {
        return this.conversionsRepository.delete(id);
    }
}

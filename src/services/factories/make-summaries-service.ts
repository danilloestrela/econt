import { PrismaSummariesRepository } from "@/repositories/prisma/prisma-summaries-repository";
import { SummariesService } from "@/services/summaries-service";

export function makeSummariesService() {
    const summariesRepository = new PrismaSummariesRepository()
    return new SummariesService(summariesRepository)
}
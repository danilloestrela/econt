import { PrismaSourcesRepository } from "@/repositories/prisma/prisma-sources-repository";
import { SourcesService } from "@/services/sources-service";

export function makeSourcesService() {
    const sourcesRepository = new PrismaSourcesRepository()
    return new SourcesService(sourcesRepository)
}
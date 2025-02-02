import { PrismaFeesRepository } from "@/repositories/prisma/prisma-fees-repository"
import { FeesService } from "../fees-service"

export function makeFeesService() {
    const feesRepository = new PrismaFeesRepository()
    return new FeesService(feesRepository)
}
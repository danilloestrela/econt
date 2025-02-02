import { PrismaRemunerationsRepository } from "@/repositories/prisma/prisma-remunerations-repository";
import { RemunerationsService } from "@/services/remunerations-service";

export function makeRemunerationsService() {
    const remunerationsRepository = new PrismaRemunerationsRepository();
    return new RemunerationsService(remunerationsRepository);
}
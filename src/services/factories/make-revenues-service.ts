import { PrismaRevenuesRepository } from "@/repositories/prisma/prisma-revenues-repository";
import { RevenuesService } from "@/services/revenues-service";

export function makeRevenuesService() {
    return new RevenuesService(new PrismaRevenuesRepository());
}
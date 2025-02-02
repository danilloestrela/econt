import { PrismaTaxesRepository } from "@/repositories/prisma/prisma-taxes-repository";
import { TaxesService } from "../taxes-services/taxes-service";

export function makeTaxesService() {
    return new TaxesService(new PrismaTaxesRepository);
}
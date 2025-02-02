import { Anexo32025Service } from "@/services/taxes-services/simples-nacional/anexo-3/anexo-3-2025-base-service";
import { BaseAnexo3Service } from "@/services/taxes-services/simples-nacional/anexo-3/base-anexo-3-service";

// Factory para criar instâncias com base no ano
const Anexo3ServiceRegistry: Record<string, new () => BaseAnexo3Service> = {
    "2025": Anexo32025Service,
    // Adicione outras classes para anos diferentes
};

export enum Anexo3Year {
    Y2025 = "2025",
}

export function makeAnexo3Service(year: Anexo3Year): BaseAnexo3Service {
    const serviceClass = Anexo3ServiceRegistry[year];
    if (!serviceClass) {
        throw new Error(`Anexo 3 service for year ${year} not found`);
    }
    return new serviceClass();
}
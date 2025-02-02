import { BaseINSSService } from "@/services/taxes-services/inss/base-inss-service";
import { INSS2025ProlaboreService } from "@/services/taxes-services/inss/inss-2025-prolabore-service";

// Factory para criar instâncias com base no ano
const INSSServiceRegistry: Record<string, new () => BaseINSSService> = {
    "2025": INSS2025ProlaboreService,
    // Adicione outras classes para anos diferentes
};

export enum INSSYear {
    Y2025 = "2025",
}

export enum INSSType {
    PROLABORE = "prolabore",
    CLT = "clt",
}

export function makeINSSService(year: INSSYear, type: INSSType): BaseINSSService {
    const serviceClass = INSSServiceRegistry[year];
    if (!serviceClass) {
        throw new Error(`INSS service for year ${year} not found`);
    }
    return new serviceClass();
}
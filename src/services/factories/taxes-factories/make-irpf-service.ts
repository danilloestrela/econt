import { BaseIRPFService } from "@/services/taxes-services/irpf/base-irpf-service";
import { IRPF2025Service } from "@/services/taxes-services/irpf/irpf-2025-service";

// Factory para criar instâncias com base no ano
const IRPFServiceRegistry: Record<string, new () => BaseIRPFService> = {
    "2025": IRPF2025Service,
    // Adicione outras classes para anos diferentes
};

export enum IRPFYear {
    Y2025 = "2025",
}

export function makeIRPFService(year: IRPFYear): BaseIRPFService {
    const serviceClass = IRPFServiceRegistry[year];
    if (!serviceClass) {
        throw new Error(`IRPF service for year ${year} not found`);
    }
    return new serviceClass();
}
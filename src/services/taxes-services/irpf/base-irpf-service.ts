import { IRPFTable, IRPFYearService } from '@/services/taxes-services/interfaces/base-irpf-service-interface';

// Classe base para IRPF
export abstract class BaseIRPFService implements IRPFYearService {
    protected abstract table: IRPFTable;

    async calculateTax(grossSalary: number, dependentsCount: number = 0) {
        return {
            irpfTax: 0,
            inssTax: 0,
            irpfAliquot: 0,
            irpfDeduction: 0,
            salaryMinusDependentDeduction: 0,
            salaryMinusInss: 0,
            grossSalary: 0,
            dependents: 0,
        };
    }
}

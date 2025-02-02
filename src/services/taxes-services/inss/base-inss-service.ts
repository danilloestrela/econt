import { CltINSSTable, INSSProlaboreTable, INSSYearService } from '@/services/taxes-services/interfaces/base-inss-service-interface';

export abstract class BaseINSSService implements INSSYearService {
    protected abstract table: INSSProlaboreTable | CltINSSTable;

    async calculateTax(grossSalary: number) {
        return {
            inssTaxValue: 0,
            salaryMinusInss: 0,
            grossSalary: 0,
        };
    }
}
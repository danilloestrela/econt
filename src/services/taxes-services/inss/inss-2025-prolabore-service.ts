import { BaseINSSService } from '@/services/taxes-services/inss/base-inss-service';
import { INSSProlaboreTable } from '@/services/taxes-services/interfaces/base-inss-service-interface';
import { convertNumberToDecimalPrecision, convertToDecimalNumber, multiplyScaled, percentageToDecimalPrecision, subtractScaled } from '@/utils/decimalUtils';
import Decimal from 'decimal.js';

export class INSS2025ProlaboreService extends BaseINSSService {
    protected table: INSSProlaboreTable = {
        salaryRanges: [
            { min: 0, max: 8157.41 },
        ],
        aliquot: 11,
        maxDeduction: 897.32,
        tableDescription: "INSS Prolabore 2025 Table - INSSProlaboreService"
    }

    async calculateTax(grossSalary: number) {
        const grossSalaryDecimal = convertNumberToDecimalPrecision(grossSalary);
        const { salaryMinusInss, inssTaxValue } = await this.calculateAliquotTax(grossSalaryDecimal);
        return {
            salaryMinusInss: convertToDecimalNumber(salaryMinusInss),
            inssTaxValue: convertToDecimalNumber(inssTaxValue),
            grossSalary,
        };
    }

    async calculateAliquotTax(grossSalary: Decimal) {
        const aliquot = percentageToDecimalPrecision(this.table.aliquot);
        const maxDeduction = convertNumberToDecimalPrecision(this.table.maxDeduction);
        const inssTaxValue = multiplyScaled(grossSalary, aliquot);
        let salaryMinusInss = subtractScaled(grossSalary, inssTaxValue);
        if (inssTaxValue.lessThanOrEqualTo(maxDeduction)) {
            return {
                salaryMinusInss,
                inssTaxValue,
            };
        }
        salaryMinusInss = subtractScaled(salaryMinusInss, maxDeduction);
        return {
            salaryMinusInss,
            inssTaxValue,
        };
    }
}
import { INSSType, INSSYear, makeINSSService } from '@/services/factories/taxes-factories/make-prolabore-inss';
import { IRPFTable } from '@/services/taxes-services/interfaces/base-irpf-service-interface';
import { BaseIRPFService } from '@/services/taxes-services/irpf/base-irpf-service';
import { addScaled, convertNumberToDecimalPrecision, convertToDecimalNumber, multiplyScaled, percentageToDecimalPrecision, subtractScaled } from '@/utils/decimalUtils';
import Decimal from 'decimal.js';

// Classe específica para IRPF 2025
export class IRPF2025Service extends BaseIRPFService {
    protected table: IRPFTable = {
        salaryRange: [
            { min: 0, max: 2112.00 },
            { min: 2112.01, max: 28286.50 },
            { min: 28286.51, max: 37510.50 },
            { min: 37510.51, max: 46646.80 },
            { min: 46646.81, max: 0 }, // 0 means no upper limit
        ],
        aliquot: [0, 7.5, 15, 22.5, 27.5],
        deductions: [0, 169.44, 381.44, 662.77, 896],
        dependentsDeduction: 189.59,
        simplifiedDeduction: 564.8,
        tableDescription: "IRRF 2025 Table - IRRF2025Service"
    };

    async calculateTax(grossSalary: number, dependentsCount: number = 0) {
        const inssService = makeINSSService(INSSYear.Y2025, INSSType.PROLABORE);
        // IRPF depends on INSS, because we calc it taking INSS out from salary
        const { salaryMinusInss, inssTaxValue, grossSalary: grossSalaryInss } = await inssService.calculateTax(grossSalary);
        const salaryMinusInssDecimal = convertNumberToDecimalPrecision(salaryMinusInss);
        // This is the salary we calc the IRPF from, since we need t take out dependents too
        const salaryMinusDependentDeduction = this.getSalaryMinusDependentsDeduction(salaryMinusInssDecimal, dependentsCount);
        // Now we get the aliquot from table.
        const aliquot = this.getAliquot(salaryMinusDependentDeduction);
        // Get the table deduction
        const irpfDeduction = this.getDeduction(salaryMinusDependentDeduction);
        // get the amount we take as tax (irpf)
        const irpfTaxValue = multiplyScaled(salaryMinusDependentDeduction, aliquot);
        // take out deduction from irpf value
        const finalTax = subtractScaled(irpfTaxValue, irpfDeduction);
        const sumTaxes = addScaled(convertNumberToDecimalPrecision(inssTaxValue), finalTax);
        const netSalary = subtractScaled(grossSalaryInss, sumTaxes);
        return {
            irpfTax: convertToDecimalNumber(finalTax),
            inssTax: inssTaxValue,
            irpfAliquot: convertToDecimalNumber(aliquot),
            irpfDeduction: convertToDecimalNumber(irpfDeduction),
            dependents: dependentsCount,
            salaryMinusDependentDeduction: convertToDecimalNumber(salaryMinusDependentDeduction),
            salaryMinusInss: salaryMinusInss,
            netSalary: convertToDecimalNumber(netSalary),
            grossSalary: grossSalaryInss,
        };
    }

    private getSalaryMinusDependentsDeduction(grossSalary: Decimal, dependentsCount: number): Decimal {
        const dependentDeductionValue = convertNumberToDecimalPrecision(this.table.dependentsDeduction);

        const dependentsDeduction = multiplyScaled(dependentDeductionValue, dependentsCount);
        return subtractScaled(grossSalary, dependentsDeduction);
    }

    private getAliquot(grossSalary: Decimal): Decimal {
        const index = this.findSalaryRangeIndex(grossSalary);
        return percentageToDecimalPrecision(this.table.aliquot[index]);
    }

    private getDeduction(grossSalary: Decimal): Decimal {
        const index = this.findSalaryRangeIndex(grossSalary);
        return convertNumberToDecimalPrecision(this.table.deductions[index]);
    }

    private findSalaryRangeIndex(salary: Decimal): number {

        const index = this.table.salaryRange.findIndex(
            (range) => {
                const salaryIsGreaterThanMin = salary.gte(range.min);
                const salaryIsLessThanMax = range.max === 0 || salary.lte(range.max);
                return salaryIsGreaterThanMin && salaryIsLessThanMax;
            }
        );
        if (index === -1) {
            throw new Error("Faixa salarial não encontrada para o valor fornecido.");
        }
        return index;
    }
}
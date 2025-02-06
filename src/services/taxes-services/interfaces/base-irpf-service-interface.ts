export interface IRPFTable {
    salaryRange: Array<{ min: number; max: number }>;
    aliquot: number[];
    deductions: number[];
    dependentsDeduction: number;
    simplifiedDeduction: number;
    tableDescription: string;
}

export interface IRPFResult {
    irpfTax: number;
    inssTax: number;
    irpfAliquot: number;
    irpfDeduction: number;
    salaryMinusDependentDeduction: number;
    salaryMinusInss: number;
    grossSalary: number;
    dependents: number;
    netSalary: number;
}

export interface IRPFYearService {
    calculateTax(grossSalary: number, dependentsCount?: number): Promise<IRPFResult>;
}

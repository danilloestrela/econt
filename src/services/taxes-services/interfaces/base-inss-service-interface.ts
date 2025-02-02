export interface INSSResult {
    inssTaxValue: number;
    salaryMinusInss: number;
    grossSalary: number;
}

export interface INSSProlaboreTable {
    salaryRanges: Array<{ min: number; max: number }> | { min: number; max: number };
    aliquot: number;
    maxDeduction: number;
    tableDescription: string;
}

export interface CltINSSTable {
    salaryRanges: Array<{ min: number; max: number }>;
    aliquots: number[];
    deductions: number[];
    tableDescription: string;
}

export interface INSSYearService {
    calculateTax(grossSalary: number): Promise<INSSResult>;
}
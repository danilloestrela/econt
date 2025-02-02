import { Decimal } from "decimal.js";

export interface Anexo3Table {
    aliquot: number[];
    rtbRange: Array<{ min: number; max: number }>;
    deductions: number[];
    tableDescription: string;
}

export interface ReparticaoDeTributos {
    cpp: number[];
    csll: number[];
    irpj: number[];
    iss: number[];
    cofins: number[];
    pisPasep: number[];
}

export interface ReparticaoDeTributosDecimal {
    cpp: Decimal;
    csll: Decimal;
    irpj: Decimal;
    iss: Decimal;
    cofins: Decimal;
    pisPasep: Decimal;
}

export interface ReparticaoDeTributosCheck {
    cpp: boolean;
    csll: boolean;
    irpj: boolean;
    iss: boolean;
    cofins: boolean;
    pisPasep: boolean;
}

export type CalculateTaxReturn = {
    taxToPay: number;
    aliquoteToApply: number;
    remunerationDecimal: number;
    rba12Decimal: number;
    salaryRangeIndex: number;
    isAbroad: boolean;
    isFatorR: boolean;
}

export type CalculateTaxParams = {
    last12MonthRemuneration: number;
    rba12: number;
    isAbroad: boolean;
}

export interface BaseAnexo3ServiceInterface {
    calculateTax({last12MonthRemuneration, rba12, isAbroad}: CalculateTaxParams): Promise<CalculateTaxReturn>;
}

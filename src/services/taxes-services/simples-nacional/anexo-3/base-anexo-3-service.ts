import {
    Anexo3Table,
    BaseAnexo3ServiceInterface,
    CalculateTaxParams,
    CalculateTaxReturn,
    ReparticaoDeTributos,
    ReparticaoDeTributosCheck
} from "@/services/taxes-services/interfaces/base-anexos-service-interface";
import Decimal from "decimal.js";

export abstract class BaseAnexo3Service implements BaseAnexo3ServiceInterface {

    protected abstract table: Anexo3Table;
    protected abstract isAbroad: boolean;
    protected abstract isFatorR: boolean;
    public abstract fatorR: number;
    protected abstract currentFatorR: number;
    protected abstract reparticaoDeTributos: ReparticaoDeTributos;
    protected abstract reparticaoDeTributosNationalServices: ReparticaoDeTributosCheck;
    protected abstract reparticaoDeTributosForAbroadServices: ReparticaoDeTributosCheck;

    async calculateTax({ last12MonthRemuneration, rba12, isAbroad }: CalculateTaxParams): Promise<CalculateTaxReturn> {
        return {
            taxToPay: 0,
            aliquoteToApply: 0,
            remunerationDecimal: 0,
            rba12Decimal: 0,
            salaryRangeIndex: 0,
            isAbroad: false,
            isFatorR: false
        };
    }

    async isFatorRSatisfied(rba12: Decimal, salaryLast12Months: Decimal): Promise<boolean> {
        return true;
    }

    async getCurrentFatorR(): Promise<number> {
        return 0;
    }
}
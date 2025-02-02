import {
    Anexo3Table,
    BaseAnexo3ServiceInterface,
    ReparticaoDeTributos,
    ReparticaoDeTributosCheck
} from "@/services/taxes-services/interfaces/base-anexos-service-interface";

export abstract class BaseAnexo3Service implements BaseAnexo3ServiceInterface {

    protected abstract table: Anexo3Table;
    protected abstract isAbroad: boolean;
    protected abstract isFatorR: boolean;
    protected abstract reparticaoDeTributos: ReparticaoDeTributos;
    protected abstract reparticaoDeTributosNationalServices: ReparticaoDeTributosCheck;
    protected abstract reparticaoDeTributosForAbroadServices: ReparticaoDeTributosCheck;

    async calculateTax({ revenue, rba12, isAbroad }: { revenue: number; rba12: number; isAbroad: boolean; }) {
        return {
            taxToPay: 0,
            aliquoteToApply: 0,
            revenueDecimal: 0,
            rba12Decimal: 0,
            salaryRangeIndex: 0,
            isAbroad: false,
        };
    }
}
    Anexo3Table,
BaseAnexo3ServiceInterface,
    ReparticaoDeTributos,
    ReparticaoDeTributosCheck,

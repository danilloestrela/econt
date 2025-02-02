import {
    Anexo3Table, CalculateTaxParams, CalculateTaxReturn, ReparticaoDeTributos,
    ReparticaoDeTributosCheck, ReparticaoDeTributosDecimal
} from "@/services/taxes-services/interfaces/base-anexos-service-interface";
import { BaseAnexo3Service } from "@/services/taxes-services/simples-nacional/anexo-3/base-anexo-3-service";
import {
    addScaled, convertNumberToDecimalPrecision, convertToDecimalNumber,
    divideScaled, multiplyScaled, percentageToDecimalPrecision, roundNumberToDecimalPlaces, subtractScaled
} from "@/utils/decimalUtils";
import Decimal from "decimal.js";

// From https://www.contabilizei.com.br/contabilidade-online/anexo-3-simples-nacional/
/* 2024/04/12 - NOVAS FUNÇÕES PARA CÁLCULO DE ALIQUOTA (Não mexa nas anteriores pra não fuder o que você fez de errado.)
 * PS: Funções utilizam modelo de objeto anexo_III_getObject()
 * O que mudou? Agora o anexo III a partir da segunda faixa é calculado progressivamente.
 * Preciso utilizar a fórmula do simples nacional e fazer a distribuição para ter os valores corretos.
 * Fórmula da alíquota do simples nacional: ((rtb12 * aliquota_atual) - deducao_da_tabela)/rtb12
 *
 * Para saber a restituição: aliquota_simples_nacional vezes cada um dos impostos efetivos. No caso de serviços para o exterior,
 * existem alguns impostos que não são cobrados: ISS	Cofins	PIS/Pasep
 * os que são cobrados são: CPP	CSLL IRPJ
*/
export class Anexo32025Service extends BaseAnexo3Service {
    protected isAbroad: boolean = false;
    protected isFatorR: boolean = false;
    public fatorR:number = 0.28;
    protected currentFatorR: number = 0;
    // https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm  < -- Não muda desde 2018
    // https://www.planalto.gov.br/ccivil_03/leis/lcp/Lcp214.htm#art519 < -- Muda a partir da reforma, talvez 2026
    protected table: Anexo3Table = {
            aliquot: [6, 11.2, 13.5, 16, 21, 33],
            rtbRange: [
                { min: 0, max: 180000 },
                { min: 180001, max: 360000 },
                { min: 360001, max: 720000 },
                { min: 720001, max: 1800000 },
                { min: 180001, max: 3600000 },
                { min: 3600001, max: 4800000 }
            ],
            deductions: [0, 9360, 17640, 35640, 125640, 648000],
        tableDescription: "Anexo 3 Table 2025 - Anexo32025Service"
    };
    // percentages
    protected reparticaoDeTributos: ReparticaoDeTributos = {
        cpp: [43.4, 43.4, 43.4, 43.4, 43.4, 30.5],
        csll: [3.5, 3.5, 3.5, 3.5, 3.5, 15],
        irpj: [40, 40, 40, 40, 40, 35],
        iss: [33.5, 32, 32.5, 32.5, 33.5, 0],
        cofins: [12.82, 14.05, 13.64, 13.64, 12.82, 16.03],
        pisPasep: [2.78, 3.05, 2.96, 2.96, 2.78, 3.47],
    };

    protected reparticaoDeTributosForAbroadServices: ReparticaoDeTributosCheck = {
        cpp: false,
        csll: false,
        irpj: false,
        iss: true,
        cofins: true,
        pisPasep: true
    }

    protected reparticaoDeTributosNationalServices: ReparticaoDeTributosCheck = {
        cpp: true,
        csll: true,
        irpj: true,
        iss: true,
        cofins: true,
        pisPasep: true
    }

    async calculateTax({ last12MonthRemuneration, rba12, isAbroad }: CalculateTaxParams): Promise<CalculateTaxReturn> {
        const remunerationDecimal = convertNumberToDecimalPrecision(last12MonthRemuneration);
        const rba12Decimal = convertNumberToDecimalPrecision(rba12);
        this.isAbroad = isAbroad;
        const isFatorRSatisfied = await this.isFatorRSatisfied(rba12Decimal, remunerationDecimal);

        if(!isFatorRSatisfied) {
            // calculate from anexo V
            return {
                taxToPay: 0,
                aliquoteToApply: 0,
                remunerationDecimal: 0,
                rba12Decimal: 0,
                salaryRangeIndex: 0,
                isAbroad: this.isAbroad,
                isFatorR: this.isFatorR
            }
        }
        const aliquoteToApply = await this.getAppliedTax(rba12Decimal);
        const taxToPay = multiplyScaled(rba12Decimal, aliquoteToApply);
        const salaryRangeIndex = await this.findSalaryRangeIndex(rba12Decimal);
        // Retorna o resultado como um número decimal no formato exibível (ex: 0.0000001)
        return {
            taxToPay: roundNumberToDecimalPlaces(taxToPay, 2),
            aliquoteToApply: convertToDecimalNumber(aliquoteToApply),
            remunerationDecimal: roundNumberToDecimalPlaces(remunerationDecimal, 2),
            rba12Decimal: roundNumberToDecimalPlaces(rba12Decimal, 2),
            salaryRangeIndex,
            isAbroad: this.isAbroad,
            isFatorR: this.isFatorR
        };
    }

    async getAppliedTax(rba12: Decimal): Promise<Decimal> {
        /**
         * Fórmula do simples nacional: ((rtb12 * aliquota_atual) - deducao_da_tabela)/rtb12
         * [(RBA12 x ALIQ) – PD] / RBA12
         * RBA12: receita bruta acumulada dos 12 meses anteriores
         * ALIQ: alíquota indicada no anexo correspondente
         * PD: parcela a deduzir indicada no anexo correspondente
         * https://portaldacontabilidade.clmcontroller.com.br/como-calcular-o-simples-nacional/
         */
        const reparticoes = await this.getReparticaoDeTributos(rba12);
        const deduction = await this.getDeductions(rba12);
        const aliquotaAnexo3 = await this.getAliquotAnexo3(rba12);
        const rba12VezesAliquotaAnexo3 = multiplyScaled(rba12, aliquotaAnexo3);
        // Quando não há valor a deduzir, a aliquota não é mais "variável". De qualquer forma, o valor a deduzir é 0.
        const deduzidaDoDesconto = subtractScaled(rba12VezesAliquotaAnexo3, deduction);
        const aliquotaVariavel = divideScaled(deduzidaDoDesconto, rba12);

        const aliquotaAplicada = Object.values(reparticoes)
            .reduce((sum, reparticao) =>
                addScaled(sum, multiplyScaled(aliquotaVariavel, reparticao)), new Decimal(0)
            );

        console.log({
            aliquotaAplicada,
            reparticoes,
            deduction,
            aliquotaAnexo3,
            rba12VezesAliquotaAnexo3,
            deduzidaDoDesconto,
            aliquotaVariavel
        });

        return aliquotaAplicada;
    }

    async getAliquotAnexo3(rba12: Decimal): Promise<Decimal> {
        const index = await this.findSalaryRangeIndex(rba12);
        return percentageToDecimalPrecision(this.table.aliquot[index]);
    }

    async getDeductions(rba12: Decimal): Promise<Decimal> {
        const index = await this.findSalaryRangeIndex(rba12);
        return convertNumberToDecimalPrecision(this.table.deductions[index]);
    }

    async getReparticaoDeTributos(rba12: Decimal): Promise<Partial<ReparticaoDeTributosDecimal>> {
        const index = await this.findSalaryRangeIndex(rba12);

        const reparticao = {
            cpp: percentageToDecimalPrecision(this.reparticaoDeTributos.cpp[index]),
            csll: percentageToDecimalPrecision(this.reparticaoDeTributos.csll[index]),
            irpj: percentageToDecimalPrecision(this.reparticaoDeTributos.irpj[index]),
            iss: percentageToDecimalPrecision(this.reparticaoDeTributos.iss[index]),
            cofins: percentageToDecimalPrecision(this.reparticaoDeTributos.cofins[index]),
            pisPasep: percentageToDecimalPrecision(this.reparticaoDeTributos.pisPasep[index])
        }

        // Only filter out zero values if it's for abroad services
        return Object.fromEntries(
            Object.entries(reparticao).filter(([key, value]) => {
                if(this.isAbroad) {
                    return this.reparticaoDeTributosForAbroadServices[key as keyof ReparticaoDeTributosCheck];
                }

                return this.reparticaoDeTributosNationalServices[key as keyof ReparticaoDeTributosCheck];
            })
        );
    }

    async findSalaryRangeIndex(rba12: Decimal): Promise<number> {
        const index = this.table.rtbRange.findIndex(
            (range) => {
                const min = convertNumberToDecimalPrecision(range.min);
                const max = convertNumberToDecimalPrecision(range.max);
                return rba12 >= min && (range.max === 0 || rba12 <= max);
            }
        );
        if (index === -1) {
            throw new Error("Faixa salarial não encontrada para o valor fornecido.");
        }
        return index;
    }

    async isFatorRSatisfied(rba12: Decimal, salaryLast12Months: Decimal): Promise<boolean> {
        const fatorRCalc = await this.calcFatorR(rba12, salaryLast12Months);

        this.isFatorR = fatorRCalc.greaterThanOrEqualTo(this.fatorR);

        // if this fails, use anexo V as default for calculations (taxes)
        return this.isFatorR;
    }

    async calcFatorR(rba12: Decimal, salaryLast12Months: Decimal): Promise<Decimal> {
        const fatorRCalc = divideScaled(salaryLast12Months, rba12);
        this.currentFatorR = convertToDecimalNumber(fatorRCalc);
        return fatorRCalc;
    }

    async getCurrentFatorR(): Promise<number> {
        return this.currentFatorR;
    }
}
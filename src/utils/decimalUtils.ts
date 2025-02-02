import { DECIMAL_PRECISION } from "@/constants/global-constants";
import Decimal from "decimal.js";

/**
 * Multiplica dois valores escalados e normaliza para a escala 10^7.
 */
export function multiplyScaled(a: Decimal | number, b: Decimal | number): Decimal {
    return new Decimal(a).times(new Decimal(b)).div(DECIMAL_PRECISION);
}

/**
 * Divide dois valores escalados e mantém a escala 10^7.
 */
export function divideScaled(a: Decimal | number, b: Decimal | number): Decimal {
    return new Decimal(a).div(new Decimal(b)).times(DECIMAL_PRECISION);
}

/**
 * Soma dois valores escalados (já na mesma escala).
 */
export function addScaled(a: Decimal | number, b: Decimal | number): Decimal {
    return new Decimal(a).plus(new Decimal(b));
}

/**
 * Subtrai dois valores escalados (já na mesma escala).
 */
export function subtractScaled(a: Decimal | number, b: Decimal | number): Decimal {
    return new Decimal(a).minus(new Decimal(b));
}

export function percentageToDecimalPrecision(a: Decimal | number): Decimal {
    return new Decimal(a).div(100).times(DECIMAL_PRECISION);
}

export function convertToDecimalNumber(a: Decimal | number | string): number {
    return new Decimal(a).div(DECIMAL_PRECISION).toNumber();
}

export function convertNumberToDecimalPrecision(a: number): Decimal {
    return new Decimal(a).times(DECIMAL_PRECISION);
}

export function roundNumberToDecimalPlaces(a: Decimal | number, precision: number): number {
    return new Decimal(a).div(DECIMAL_PRECISION).toDecimalPlaces(precision, Decimal.ROUND_HALF_UP).toNumber();
}

export function convertToDecimalWithNoPrecisionAdjust(a: Decimal | number | string): Decimal {
    return new Decimal(a);
}

import { Decimal } from "decimal.js";

// ALL MONETARY VALUES ARE STORED IN INTEGER 10^10 AND TO CONVERT TO REAL VALUES, DIVIDE BY 10^10
// THIS IS BECAUSE OF THE PRECISION OF THE CURRENCY VALUES
// AND TO AVOID ROUNDING ERRORS
// CHECKOUT @/utils/decimalUtils.ts FOR MORE INFORMATION

export const DECIMAL_PRECISION = new Decimal(10000000000); // 10^10

// Constants for commonly used timezones
export const TIMEZONES = {
    BRAZIL: 'America/Sao_Paulo',
    UTC: 'UTC'
};
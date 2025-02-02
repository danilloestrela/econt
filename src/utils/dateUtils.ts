import { TIMEZONES } from "@/constants/global-constants";
import { TZDate } from "@date-fns/tz";
import { format, formatISO } from "date-fns";
export function formatDate(date: Date) {
    return format(date, "yyyy-MM-dd");
}

export function formatDateToISO(date: Date) {
    return formatISO(date);
}

export function isoToBrt(isoDate: string) {
    return new TZDate(isoDate, TIMEZONES.BRAZIL);
}

export function anyToUtc(date: Date) {
    return new TZDate(date, TIMEZONES.UTC);
}

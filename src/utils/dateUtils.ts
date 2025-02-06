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

export function toSimpleYearMonthDate(date: Date) {
    return format(date, "yyyy-MM-dd");
}

// ex: 2025-01-01
export function extractYearMonthFromStringDate(date: string) {
    const currentDate = new Date(date)
    const [year, month, day] = date.split('-').map(Number); // eg: 2025-01-01
    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    return {
        year,
        month,
        day,
        startDate,
        endDate,
        currentDate
    }
}

export function extractYearMonthFromDate(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const startMonthDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const endMonthDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    return { year, month, day, startMonthDate, endMonthDate };
}

export function getMonthFromMonthsAgo(months: number) {
    const currentDate = new Date();
    const startMonthsDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - months + 1, 1);
    const endMonthsDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    return { startMonthsDate, endMonthsDate, currentDate };
}
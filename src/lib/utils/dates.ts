// ---------------------------------------------------------------------------
// Date utilities using date-fns with Spanish locale
// ---------------------------------------------------------------------------

import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
  endOfMonth,
  endOfWeek,
  endOfYear,
  isAfter,
  isBefore,
  isSameDay,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from 'date-fns';
import { es } from 'date-fns/locale';

// Re-export the Spanish locale for convenience
export { es as esLocale };

// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------

/** Parse an ISO string into a Date, or return the Date as-is */
export function toDate(input: Date | string): Date {
  if (input instanceof Date) return input;
  return parseISO(input);
}

// ---------------------------------------------------------------------------
// Age calculations
// ---------------------------------------------------------------------------

export interface AgeParts {
  years: number;
  months: number;
  days: number;
}

/** Calculate an animal's age in years, months, and days */
export function calculateAge(
  birthDate: Date | string,
  referenceDate: Date = new Date(),
): AgeParts {
  const birth = toDate(birthDate);
  const years = differenceInYears(referenceDate, birth);
  const afterYears = addYears(birth, years);
  const months = differenceInMonths(referenceDate, afterYears);
  const afterMonths = addMonths(afterYears, months);
  const days = differenceInDays(referenceDate, afterMonths);
  return { years, months, days };
}

/** Format age as a human-readable Spanish string: "2 años, 3 meses" */
export function formatAge(birthDate: Date | string, referenceDate?: Date): string {
  const { years, months, days } = calculateAge(birthDate, referenceDate);
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? 'año' : 'años'}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? 'mes' : 'meses'}`);
  if (years === 0 && months === 0) {
    parts.push(`${days} ${days === 1 ? 'día' : 'días'}`);
  }
  return parts.join(', ');
}

/** Get an animal's age in total days */
export function ageInDays(
  birthDate: Date | string,
  referenceDate: Date = new Date(),
): number {
  return differenceInDays(referenceDate, toDate(birthDate));
}

/** Get an animal's age in total months */
export function ageInMonths(
  birthDate: Date | string,
  referenceDate: Date = new Date(),
): number {
  return differenceInMonths(referenceDate, toDate(birthDate));
}

// ---------------------------------------------------------------------------
// Gestation / reproductive dates
// ---------------------------------------------------------------------------

/** Calculate expected birth date from service date and gestation days */
export function expectedBirthDate(
  serviceDate: Date | string,
  gestationDays: number,
): Date {
  return addDays(toDate(serviceDate), gestationDays);
}

/** Calculate days remaining to expected birth */
export function daysToExpectedBirth(
  serviceDate: Date | string,
  gestationDays: number,
  today: Date = new Date(),
): number {
  const expected = expectedBirthDate(serviceDate, gestationDays);
  return differenceInDays(expected, today);
}

/** Calculate gestation progress as 0-1 ratio */
export function gestationProgress(
  serviceDate: Date | string,
  gestationDays: number,
  today: Date = new Date(),
): number {
  if (gestationDays <= 0) return 0;
  const elapsed = differenceInDays(today, toDate(serviceDate));
  return Math.min(Math.max(elapsed / gestationDays, 0), 1);
}

// ---------------------------------------------------------------------------
// Date range utilities
// ---------------------------------------------------------------------------

export interface DateRange {
  start: Date;
  end: Date;
}

/** Check if a date falls within a range (inclusive) */
export function isInRange(date: Date | string, range: DateRange): boolean {
  return isWithinInterval(toDate(date), { start: range.start, end: range.end });
}

/** Get the current week range (Monday start, Spanish locale) */
export function currentWeekRange(): DateRange {
  const now = new Date();
  return {
    start: startOfWeek(now, { locale: es }),
    end: endOfWeek(now, { locale: es }),
  };
}

/** Get the current month range */
export function currentMonthRange(): DateRange {
  const now = new Date();
  return { start: startOfMonth(now), end: endOfMonth(now) };
}

/** Get the current year range */
export function currentYearRange(): DateRange {
  const now = new Date();
  return { start: startOfYear(now), end: endOfYear(now) };
}

/** Get a range of the last N days from today */
export function lastNDaysRange(n: number): DateRange {
  const now = new Date();
  return { start: startOfDay(subDays(now, n)), end: now };
}

/** Get a range of the last N months from today */
export function lastNMonthsRange(n: number): DateRange {
  const now = new Date();
  return { start: startOfDay(subMonths(now, n)), end: now };
}

// ---------------------------------------------------------------------------
// Vaccine / treatment scheduling
// ---------------------------------------------------------------------------

/** Calculate the next application date for a recurring treatment */
export function nextApplicationDate(
  lastApplicationDate: Date | string,
  frequencyDays: number,
): Date {
  return addDays(toDate(lastApplicationDate), frequencyDays);
}

/** Check if a treatment is overdue */
export function isTreatmentOverdue(
  lastApplicationDate: Date | string,
  frequencyDays: number,
  today: Date = new Date(),
): boolean {
  if (frequencyDays <= 0) return false; // one-time treatments are never "overdue"
  const next = nextApplicationDate(lastApplicationDate, frequencyDays);
  return isBefore(next, today);
}

/** Days until next scheduled treatment (negative = overdue) */
export function daysUntilNextTreatment(
  lastApplicationDate: Date | string,
  frequencyDays: number,
  today: Date = new Date(),
): number {
  if (frequencyDays <= 0) return Infinity;
  const next = nextApplicationDate(lastApplicationDate, frequencyDays);
  return differenceInDays(next, today);
}

// ---------------------------------------------------------------------------
// Misc helpers
// ---------------------------------------------------------------------------

/** Check if two dates represent the same calendar day */
export function isSameCalendarDay(
  a: Date | string,
  b: Date | string,
): boolean {
  return isSameDay(toDate(a), toDate(b));
}

/** Check if a date is in the past */
export function isPast(date: Date | string): boolean {
  return isBefore(toDate(date), new Date());
}

/** Check if a date is in the future */
export function isFuture(date: Date | string): boolean {
  return isAfter(toDate(date), new Date());
}

/** Get today's date at start of day (midnight) */
export function today(): Date {
  return startOfDay(new Date());
}

/** Get the number of days between two dates */
export function daysBetween(
  a: Date | string,
  b: Date | string,
): number {
  return Math.abs(differenceInDays(toDate(a), toDate(b)));
}

/** Get the number of weeks between two dates */
export function weeksBetween(
  a: Date | string,
  b: Date | string,
): number {
  return Math.abs(differenceInWeeks(toDate(a), toDate(b)));
}

// Re-export commonly used date-fns functions for convenience
export {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  subDays,
  subMonths,
  subYears,
  startOfDay,
  startOfMonth,
  startOfYear,
  endOfMonth,
  endOfYear,
  parseISO,
};

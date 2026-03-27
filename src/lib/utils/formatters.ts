// ---------------------------------------------------------------------------
// Display formatters — MXN currency, weights, percentages, Spanish dates
// ---------------------------------------------------------------------------

import { format, formatDistanceToNow, type Locale } from 'date-fns';
import { es } from 'date-fns/locale';

// ---------------------------------------------------------------------------
// Currency
// ---------------------------------------------------------------------------

const MXN_FORMATTER = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const MXN_COMPACT_FORMATTER = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 1,
});

/** Format a number as MXN currency: $1,234.56 */
export function formatCurrency(value: number): string {
  return MXN_FORMATTER.format(value);
}

/** Format large currency values compactly: $1.2M */
export function formatCurrencyCompact(value: number): string {
  return MXN_COMPACT_FORMATTER.format(value);
}

// ---------------------------------------------------------------------------
// Weight
// ---------------------------------------------------------------------------

/** Format weight in kilograms: "450.5 kg" */
export function formatWeight(kg: number, decimals = 1): string {
  return `${kg.toFixed(decimals)} kg`;
}

/** Format weight in grams: "320 g" */
export function formatWeightGrams(g: number, decimals = 0): string {
  return `${g.toFixed(decimals)} g`;
}

/** Format weight in tonnes: "1.2 ton" */
export function formatWeightTonnes(kg: number, decimals = 2): string {
  return `${(kg / 1000).toFixed(decimals)} ton`;
}

// ---------------------------------------------------------------------------
// Percentage
// ---------------------------------------------------------------------------

/**
 * Format a ratio (0-1) or raw percentage as "85.3%".
 * If `isRatio` is true (default), the value is multiplied by 100 first.
 */
export function formatPercentage(
  value: number,
  decimals = 1,
  isRatio = true,
): string {
  const pct = isRatio ? value * 100 : value;
  return `${pct.toFixed(decimals)}%`;
}

// ---------------------------------------------------------------------------
// Numbers
// ---------------------------------------------------------------------------

const NUMBER_FORMATTER = new Intl.NumberFormat('es-MX');

/** Format a number with Mexican locale grouping: 1,234,567 */
export function formatNumber(value: number): string {
  return NUMBER_FORMATTER.format(value);
}

const DECIMAL_FORMATTER = new Intl.NumberFormat('es-MX', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Format a decimal number: 1,234.56 */
export function formatDecimal(value: number, decimals = 2): string {
  if (decimals === 2) return DECIMAL_FORMATTER.format(value);
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

// ---------------------------------------------------------------------------
// Dates in Spanish
// ---------------------------------------------------------------------------

const SPANISH_LOCALE: { locale: Locale } = { locale: es };

/** Format as "15 de marzo de 2026" */
export function formatDateLong(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, "d 'de' MMMM 'de' yyyy", SPANISH_LOCALE);
}

/** Format as "15/03/2026" */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'dd/MM/yyyy', SPANISH_LOCALE);
}

/** Format as "15 mar 2026" */
export function formatDateMedium(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'd MMM yyyy', SPANISH_LOCALE);
}

/** Format as "15/03/2026 14:30" */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'dd/MM/yyyy HH:mm', SPANISH_LOCALE);
}

/** Relative time: "hace 3 días" */
export function formatRelative(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, ...SPANISH_LOCALE });
}

/** Format as "marzo 2026" (month year) */
export function formatMonthYear(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, "MMMM 'de' yyyy", SPANISH_LOCALE);
}

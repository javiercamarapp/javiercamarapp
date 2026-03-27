// ---------------------------------------------------------------------------
// Livestock calculations — GDP, weight adjustments, conversion ratios
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Average Daily Gain (GDP — Ganancia Diaria de Peso)
// ---------------------------------------------------------------------------

export interface GdpInput {
  /** Weight at beginning of period (kg) */
  startWeight: number;
  /** Weight at end of period (kg) */
  endWeight: number;
  /** Number of days between measurements */
  days: number;
}

/**
 * Calculate Average Daily Gain (GDP) in kg/day.
 * Returns 0 if days is 0 or negative.
 */
export function calculateGdp({ startWeight, endWeight, days }: GdpInput): number {
  if (days <= 0) return 0;
  return (endWeight - startWeight) / days;
}

/**
 * Calculate GDP from a series of weight records sorted by date.
 * Returns the overall GDP across the full period.
 */
export function calculateGdpFromSeries(
  records: { weight: number; date: Date }[],
): number {
  if (records.length < 2) return 0;
  const sorted = [...records].sort((a, b) => a.date.getTime() - b.date.getTime());
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const days = (last.date.getTime() - first.date.getTime()) / (1000 * 60 * 60 * 24);
  return calculateGdp({
    startWeight: first.weight,
    endWeight: last.weight,
    days,
  });
}

// ---------------------------------------------------------------------------
// BIF-standard weight adjustments (Beef Improvement Federation)
// ---------------------------------------------------------------------------

export interface WeightAdjustmentInput {
  /** Current weight in kg */
  currentWeight: number;
  /** Age in days at the time of weighing */
  ageAtWeighing: number;
  /** Birth weight in kg (default 30 for bovines) */
  birthWeight?: number;
}

/**
 * Adjust weight to a standard age using BIF methodology:
 *   Adjusted = ((currentWeight - birthWeight) / ageAtWeighing) * targetDays + birthWeight
 */
function adjustToAge(
  { currentWeight, ageAtWeighing, birthWeight = 30 }: WeightAdjustmentInput,
  targetDays: number,
): number {
  if (ageAtWeighing <= 0) return 0;
  const dailyGain = (currentWeight - birthWeight) / ageAtWeighing;
  return dailyGain * targetDays + birthWeight;
}

/** Adjust weaning weight to 205 days (standard BIF weaning) */
export function adjustWeightTo205(input: WeightAdjustmentInput): number {
  return adjustToAge(input, 205);
}

/** Adjust yearling weight to 365 days */
export function adjustWeightTo365(input: WeightAdjustmentInput): number {
  return adjustToAge(input, 365);
}

/** Adjust weight to 540 days (18 months / final weight) */
export function adjustWeightTo540(input: WeightAdjustmentInput): number {
  return adjustToAge(input, 540);
}

/** Adjust weight to any arbitrary standard age in days */
export function adjustWeightToAge(
  input: WeightAdjustmentInput,
  targetDays: number,
): number {
  return adjustToAge(input, targetDays);
}

// ---------------------------------------------------------------------------
// Conversion ratios
// ---------------------------------------------------------------------------

/** Feed conversion ratio: kg feed consumed / kg weight gained */
export function feedConversionRatio(
  feedConsumedKg: number,
  weightGainKg: number,
): number {
  if (weightGainKg <= 0) return 0;
  return feedConsumedKg / weightGainKg;
}

/** Feed efficiency: kg weight gained / kg feed consumed (inverse of FCR) */
export function feedEfficiency(
  feedConsumedKg: number,
  weightGainKg: number,
): number {
  if (feedConsumedKg <= 0) return 0;
  return weightGainKg / feedConsumedKg;
}

/** Carcass yield percentage: carcass weight / live weight */
export function carcassYield(
  liveWeightKg: number,
  carcassWeightKg: number,
): number {
  if (liveWeightKg <= 0) return 0;
  return carcassWeightKg / liveWeightKg;
}

/** Dressing percentage (rendimiento en canal) as a display value (0-100) */
export function dressingPercentage(
  liveWeightKg: number,
  carcassWeightKg: number,
): number {
  return carcassYield(liveWeightKg, carcassWeightKg) * 100;
}

// ---------------------------------------------------------------------------
// Reproductive KPIs
// ---------------------------------------------------------------------------

/** Calving/lambing interval in days */
export function calvingInterval(
  previousCalvingDate: Date,
  currentCalvingDate: Date,
): number {
  const diff = currentCalvingDate.getTime() - previousCalvingDate.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

/** Open days: days from calving to next conception */
export function openDays(calvingDate: Date, conceptionDate: Date): number {
  const diff = conceptionDate.getTime() - calvingDate.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

/** Conception rate: conceptions / total services */
export function conceptionRate(
  conceptions: number,
  totalServices: number,
): number {
  if (totalServices <= 0) return 0;
  return conceptions / totalServices;
}

/** Birth/calving rate: births / females exposed */
export function birthRate(births: number, femalesExposed: number): number {
  if (femalesExposed <= 0) return 0;
  return births / femalesExposed;
}

/** Weaning rate: weaned / born alive */
export function weaningRate(weaned: number, bornAlive: number): number {
  if (bornAlive <= 0) return 0;
  return weaned / bornAlive;
}

/** Mortality rate: deaths / total inventory */
export function mortalityRate(deaths: number, totalInventory: number): number {
  if (totalInventory <= 0) return 0;
  return deaths / totalInventory;
}

// ---------------------------------------------------------------------------
// Unit conversions
// ---------------------------------------------------------------------------

/** Convert kg to pounds */
export function kgToLb(kg: number): number {
  return kg * 2.20462;
}

/** Convert pounds to kg */
export function lbToKg(lb: number): number {
  return lb / 2.20462;
}

/** Convert hectares to acres */
export function haToAcres(ha: number): number {
  return ha * 2.47105;
}

/** Convert acres to hectares */
export function acresToHa(acres: number): number {
  return acres / 2.47105;
}

/** Convert litres to gallons (US) */
export function litresToGallons(litres: number): number {
  return litres * 0.264172;
}

/** Convert gallons (US) to litres */
export function gallonsToLitres(gallons: number): number {
  return gallons / 0.264172;
}

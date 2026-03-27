// ---------------------------------------------------------------------------
// Reproductive parameters by species
// ---------------------------------------------------------------------------

import type { SpeciesId } from "@/types/species";

export interface ReproParams {
  /** Gestation length in days */
  gestationDays: number;
  /** Age at puberty in months */
  pubertadMeses: number;
  /** Estrous cycle length in days */
  cicloEstralDias: number;
  /** Duration of standing heat in hours (stored as days here for consistency) */
  duracionCeloDias: number;
  /** Optimal time for service post-estrus onset in hours (stored as fractional days) */
  tiempoOptServicio: number;
  /** Age at weaning in days */
  edadDesteDias: number;
  /** Postpartum rest (voluntary waiting period) in days */
  diasDescansoPostParto: number;
  /** Dry period before parturition in days (dairy species) */
  diasSecadoPreParto: number;
  /** Ideal calving/farrowing interval in days */
  ipIdeal: number;
}

export const REPRODUCTIVE_PARAMS: Record<SpeciesId, ReproParams> = {
  bovino: {
    gestationDays: 283,
    pubertadMeses: 15,
    cicloEstralDias: 21,
    duracionCeloDias: 0.75, // ~18 hours
    tiempoOptServicio: 0.5, // ~12 hours after onset
    edadDesteDias: 210,
    diasDescansoPostParto: 45,
    diasSecadoPreParto: 60,
    ipIdeal: 365,
  },

  porcino: {
    gestationDays: 114,
    pubertadMeses: 7,
    cicloEstralDias: 21,
    duracionCeloDias: 2.5, // 48-72 hours
    tiempoOptServicio: 1.0, // 24 hours after onset
    edadDesteDias: 21,
    diasDescansoPostParto: 7,
    diasSecadoPreParto: 0, // N/A
    ipIdeal: 150,
  },

  ovino: {
    gestationDays: 150,
    pubertadMeses: 8,
    cicloEstralDias: 17,
    duracionCeloDias: 1.25, // ~30 hours
    tiempoOptServicio: 0.5,
    edadDesteDias: 60,
    diasDescansoPostParto: 30,
    diasSecadoPreParto: 0, // N/A typically
    ipIdeal: 240,
  },

  caprino: {
    gestationDays: 150,
    pubertadMeses: 7,
    cicloEstralDias: 21,
    duracionCeloDias: 1.5, // ~36 hours
    tiempoOptServicio: 0.5,
    edadDesteDias: 56,
    diasDescansoPostParto: 30,
    diasSecadoPreParto: 45,
    ipIdeal: 240,
  },

  ave: {
    gestationDays: 21, // incubation
    pubertadMeses: 5, // start of lay ~20 weeks
    cicloEstralDias: 1, // daily ovulation cycle
    duracionCeloDias: 0, // N/A — continuous laying
    tiempoOptServicio: 0, // N/A — natural mating or AI
    edadDesteDias: 0, // N/A
    diasDescansoPostParto: 0,
    diasSecadoPreParto: 0,
    ipIdeal: 1, // daily egg cycle
  },

  abeja: {
    gestationDays: 0, // N/A — queen development ~16 days
    pubertadMeses: 0, // queen mates ~1 week after emergence
    cicloEstralDias: 0,
    duracionCeloDias: 0,
    tiempoOptServicio: 0,
    edadDesteDias: 0,
    diasDescansoPostParto: 0,
    diasSecadoPreParto: 0,
    ipIdeal: 0,
  },

  equido: {
    gestationDays: 340,
    pubertadMeses: 18,
    cicloEstralDias: 21,
    duracionCeloDias: 5, // 5-7 days
    tiempoOptServicio: 2, // 48 hours before ovulation
    edadDesteDias: 180,
    diasDescansoPostParto: 30,
    diasSecadoPreParto: 0,
    ipIdeal: 365,
  },

  conejo: {
    gestationDays: 31,
    pubertadMeses: 4,
    cicloEstralDias: 0, // induced ovulator — no fixed cycle
    duracionCeloDias: 0, // receptive ~12-14 of each 16-day period
    tiempoOptServicio: 0, // mount triggers ovulation
    edadDesteDias: 28,
    diasDescansoPostParto: 7,
    diasSecadoPreParto: 0,
    ipIdeal: 65,
  },

  diversificado: {
    gestationDays: 200, // venado cola blanca average
    pubertadMeses: 16,
    cicloEstralDias: 28,
    duracionCeloDias: 1,
    tiempoOptServicio: 0.5,
    edadDesteDias: 120,
    diasDescansoPostParto: 60,
    diasSecadoPreParto: 0,
    ipIdeal: 365,
  },
};

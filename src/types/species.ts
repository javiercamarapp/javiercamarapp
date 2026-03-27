// ---------------------------------------------------------------------------
// Species-related TypeScript types
// ---------------------------------------------------------------------------

/** All supported species identifiers */
export type SpeciesId =
  | 'bovino'
  | 'porcino'
  | 'ovino'
  | 'caprino'
  | 'ave'
  | 'abeja'
  | 'equido'
  | 'conejo'
  | 'diversificado';

/** How animals of a given species are tracked */
export type ManagementType = 'individual' | 'lot' | 'hive';

/** Biological sex */
export type AnimalSex = 'macho' | 'hembra';

/** Generic lifecycle states shared across species */
export type AnimalStatus =
  | 'activo'
  | 'vendido'
  | 'muerto'
  | 'descartado'
  | 'en_tratamiento'
  | 'en_cuarentena';

/** Reproductive states (primarily for females) */
export type ReproductiveState =
  | 'vacía'
  | 'gestante'
  | 'lactando'
  | 'seca'
  | 'servida'
  | 'en_celo'
  | 'prepúber'
  | 'puesta'
  | 'incubando'
  | 'en_producción'
  | 'inactiva';

/** Age categories used for classification and KPIs */
export type AnimalCategory =
  | 'cría'
  | 'becerro'
  | 'becerra'
  | 'novillo'
  | 'vaquilla'
  | 'torete'
  | 'vaca'
  | 'toro'
  | 'semental'
  | 'lechón'
  | 'cerda'
  | 'verraco'
  | 'cordero'
  | 'borrega'
  | 'carnero'
  | 'cabrito'
  | 'cabra'
  | 'macho_cabrío'
  | 'pollito'
  | 'gallina'
  | 'gallo'
  | 'pollo_engorda'
  | 'colmena'
  | 'núcleo'
  | 'potro'
  | 'yegua'
  | 'caballo'
  | 'gazapo'
  | 'coneja'
  | 'conejo_semental'
  | 'juvenil'
  | 'adulto';

/** Default vaccine definition for a species */
export interface DefaultVaccine {
  /** Display name of the vaccine */
  name: string;
  /** Recommended re-application frequency in days (0 = one-time) */
  frequencyDays: number;
  /** Whether this vaccine is specific to the species vs. generic */
  speciesSpecific: boolean;
}

/** KPI field descriptor shown on dashboards */
export interface KpiField {
  key: string;
  label: string;
  unit: string;
  description: string;
}

/** Full configuration for a single species */
export interface SpeciesConfig {
  id: SpeciesId;
  name: string;
  namePlural: string;
  icon: string;
  gestationDays: number;
  managementType: ManagementType;
  hasReproduction: boolean;
  hasWeights: boolean;
  hasMilk: boolean;
  categories: AnimalCategory[];
  reproductiveStates: ReproductiveState[];
  defaultVaccines: DefaultVaccine[];
  breeds: string[];
  kpiFields: KpiField[];
}

/** Record mapping every species id to its config */
export type SpeciesConfigRecord = Record<SpeciesId, SpeciesConfig>;

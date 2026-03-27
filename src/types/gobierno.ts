// ---------------------------------------------------------------------------
// Types for the government (gobierno) dashboard
// ---------------------------------------------------------------------------

import type { SpeciesId } from './species';

/** Status of a government livestock program */
export type ProgramStatus = 'activo' | 'pausado' | 'finalizado' | 'en_revisión';

/** Type of government support */
export type SupportType =
  | 'subsidio'
  | 'crédito'
  | 'seguro'
  | 'capacitación'
  | 'infraestructura'
  | 'genética'
  | 'sanidad';

/** A government livestock program */
export interface GobiernoProgram {
  id: string;
  name: string;
  description: string;
  status: ProgramStatus;
  supportType: SupportType;
  budgetMxn: number;
  executedMxn: number;
  startDate: string; // ISO date
  endDate: string;   // ISO date
  targetSpecies: SpeciesId[];
  targetStates: string[];
  maxBeneficiaries: number;
  currentBeneficiaries: number;
  requirements: string[];
}

/** Beneficiary registration status */
export type BeneficiaryStatus =
  | 'solicitante'
  | 'aprobado'
  | 'rechazado'
  | 'activo'
  | 'suspendido'
  | 'egresado';

/** A beneficiary of a government program */
export interface Beneficiary {
  id: string;
  curp: string;
  fullName: string;
  state: string;
  municipality: string;
  locality: string;
  phone: string;
  email: string | null;
  species: SpeciesId[];
  headCount: number;
  hectares: number;
  programId: string;
  status: BeneficiaryStatus;
  enrollmentDate: string;
  lastVerificationDate: string | null;
}

/** Government-level KPI */
export interface GobiernoKpi {
  key: string;
  label: string;
  value: number;
  previousValue: number | null;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  period: string;
}

/** Aggregated stats for a geographic region */
export interface RegionStats {
  state: string;
  municipality: string | null;
  totalBeneficiaries: number;
  totalHeadCount: number;
  totalHectares: number;
  speciesBreakdown: Partial<Record<SpeciesId, number>>;
  averageHerdSize: number;
  vaccinationCoverage: number; // 0-1
  mortalityRate: number;       // 0-1
}

/** Summary dashboard payload consumed by the gobierno UI */
export interface GobiernoDashboard {
  programs: GobiernoProgram[];
  kpis: GobiernoKpi[];
  regionStats: RegionStats[];
  totalBudgetMxn: number;
  totalExecutedMxn: number;
  totalBeneficiaries: number;
  updatedAt: string;
}

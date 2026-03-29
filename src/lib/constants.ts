export const ALERT_REFETCH_INTERVAL = 60_000 // 1 minute
export const ANIMAL_ESTADOS = ['activo', 'vendido', 'muerto', 'descartado', 'transferido', 'sacrificado'] as const
export const ESTADOS_REPRODUCTIVOS = ['vacia', 'celo', 'servida', 'gestante', 'lactando', 'descanso', 'semental'] as const
export const ESTADOS_SANITARIOS = ['sano', 'en_tratamiento', 'enfermo', 'cuarentena'] as const
export const PRIORIDADES = ['alta', 'media', 'baja'] as const

export const CREDIT_SCORE_WEIGHTS = {
  completitud: 0.20,
  regularidad: 0.15,
  productividad: 0.20,
  financiero: 0.15,
  antiguedad: 0.10,
  sanitario: 0.10,
  tamano: 0.10,
} as const

export const FRECUENCIA_SCORES = {
  diario: 100,
  semanal: 70,
  mensual: 40,
  irregular: 15,
} as const

export const TAMANO_THRESHOLDS = [
  { min: 200, score: 100 },
  { min: 100, score: 80 },
  { min: 50, score: 60 },
  { min: 20, score: 40 },
  { min: 0, score: 20 },
] as const

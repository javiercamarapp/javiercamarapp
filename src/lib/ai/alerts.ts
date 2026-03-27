// ---------------------------------------------------------------------------
// Rule-based alert detection for HatoAI
// No AI needed - pure deterministic checks
// ---------------------------------------------------------------------------

import type { SpeciesConfig } from "@/types/species"

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export type AlertType =
  | "parto_proximo"
  | "pesaje_atrasado"
  | "vacuna_vencida"
  | "mortalidad_alta"
  | "revision_colmena"
  | "retiro_activo"
  | "alimento_bajo"

export type AlertPriority = "alta" | "media" | "baja"

export interface AlertResult {
  type: AlertType
  animalId?: string
  lotId?: string
  hiveId?: string
  message: string
  priority: AlertPriority
  suggestedAction: string
}

// ---------------------------------------------------------------------------
// Animal-like input shapes (minimal contracts)
// ---------------------------------------------------------------------------

export interface AnimalForBirth {
  id: string
  nombre?: string
  numeroArete?: string
  estadoReproductivo: string
  fechaUltimoServicio?: string | null
  diasGestacion?: number
}

export interface AnimalForWeighing {
  id: string
  nombre?: string
  numeroArete?: string
  fechaUltimoPesaje?: string | null
}

export interface HealthEvent {
  id: string
  animalId?: string
  tipo: string
  fecha: string
  proximaAplicacion?: string | null
  retiroFin?: string | null
  nombreProducto?: string
}

export interface LotForMortality {
  id: string
  nombre: string
  totalCabezas: number
  muertes30d: number
}

export interface HiveForInspection {
  id: string
  numero: string
  fechaUltimaRevision?: string | null
}

export interface FeedInventoryItem {
  id: string
  producto: string
  cantidadKg: number
  consumoDiarioKg: number
}

// ---------------------------------------------------------------------------
// Detection functions
// ---------------------------------------------------------------------------

/**
 * Detect animals with upcoming births (gestationDays - currentDays < 15)
 */
export function detectUpcomingBirths(
  animals: AnimalForBirth[],
  speciesConfig: SpeciesConfig
): AlertResult[] {
  const alerts: AlertResult[] = []
  const now = Date.now()
  const gestationDays = speciesConfig.gestationDays

  if (gestationDays === 0) return alerts

  for (const animal of animals) {
    if (animal.estadoReproductivo !== "gestante") continue
    if (!animal.fechaUltimoServicio) continue

    const serviceDate = new Date(animal.fechaUltimoServicio).getTime()
    const dueDate = serviceDate + gestationDays * 86400000
    const daysUntilDue = Math.floor((dueDate - now) / 86400000)

    if (daysUntilDue >= 0 && daysUntilDue < 15) {
      const label = animal.nombre || animal.numeroArete || animal.id
      alerts.push({
        type: "parto_proximo",
        animalId: animal.id,
        message: `${label} — Parto estimado en ${daysUntilDue} día${daysUntilDue !== 1 ? "s" : ""}`,
        priority: daysUntilDue <= 5 ? "alta" : "media",
        suggestedAction:
          "Preparar maternidad, verificar condición corporal, y vigilar signos de parto inminente.",
      })
    }
  }

  return alerts
}

/**
 * Detect animals whose last weighing was more than 30 days ago
 */
export function detectOverdueWeighing(
  animals: AnimalForWeighing[]
): AlertResult[] {
  const alerts: AlertResult[] = []
  const thirtyDaysAgo = Date.now() - 30 * 86400000

  for (const animal of animals) {
    if (!animal.fechaUltimoPesaje) {
      const label = animal.nombre || animal.numeroArete || animal.id
      alerts.push({
        type: "pesaje_atrasado",
        animalId: animal.id,
        message: `${label} — Sin registro de pesaje`,
        priority: "media",
        suggestedAction: "Programar pesaje inicial para establecer línea base de GDP.",
      })
      continue
    }

    const lastWeighDate = new Date(animal.fechaUltimoPesaje).getTime()
    if (lastWeighDate < thirtyDaysAgo) {
      const daysOverdue = Math.floor((Date.now() - lastWeighDate) / 86400000)
      const label = animal.nombre || animal.numeroArete || animal.id
      alerts.push({
        type: "pesaje_atrasado",
        animalId: animal.id,
        message: `${label} — Último pesaje hace ${daysOverdue} días`,
        priority: daysOverdue > 60 ? "alta" : "media",
        suggestedAction: "Programar jornada de pesaje para actualizar GDP y monitorear crecimiento.",
      })
    }
  }

  return alerts
}

/**
 * Detect expired or overdue vaccines (next application date < today)
 */
export function detectExpiredVaccines(
  healthEvents: HealthEvent[]
): AlertResult[] {
  const alerts: AlertResult[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayMs = today.getTime()

  for (const event of healthEvents) {
    if (event.tipo !== "vacunacion") continue
    if (!event.proximaAplicacion) continue

    const nextApp = new Date(event.proximaAplicacion).getTime()
    if (nextApp < todayMs) {
      const daysOverdue = Math.floor((todayMs - nextApp) / 86400000)
      alerts.push({
        type: "vacuna_vencida",
        animalId: event.animalId,
        message: `Vacuna ${event.nombreProducto || "pendiente"} vencida hace ${daysOverdue} día${daysOverdue !== 1 ? "s" : ""}`,
        priority: daysOverdue > 30 ? "alta" : "media",
        suggestedAction: `Aplicar refuerzo de ${event.nombreProducto || "vacuna"} lo antes posible. Verificar disponibilidad del biológico.`,
      })
    }
  }

  return alerts
}

/**
 * Detect lots with mortality rate above benchmark
 */
export function detectHighMortality(
  lots: LotForMortality[],
  benchmarkPct: number
): AlertResult[] {
  const alerts: AlertResult[] = []

  for (const lot of lots) {
    if (lot.totalCabezas === 0) continue
    const mortalityPct = (lot.muertes30d / lot.totalCabezas) * 100

    if (mortalityPct > benchmarkPct) {
      alerts.push({
        type: "mortalidad_alta",
        lotId: lot.id,
        message: `Lote "${lot.nombre}" — Mortalidad del ${mortalityPct.toFixed(1)}% (${lot.muertes30d}/${lot.totalCabezas}) supera benchmark de ${benchmarkPct}%`,
        priority: mortalityPct > benchmarkPct * 2 ? "alta" : "media",
        suggestedAction:
          "Investigar causa de muerte (necropsia). Revisar condiciones sanitarias del lote, agua, y alimento. Consultar MVZ.",
      })
    }
  }

  return alerts
}

/**
 * Detect hives with last inspection more than 15 days ago
 */
export function detectOverdueHiveInspection(
  hives: HiveForInspection[]
): AlertResult[] {
  const alerts: AlertResult[] = []
  const fifteenDaysAgo = Date.now() - 15 * 86400000

  for (const hive of hives) {
    if (!hive.fechaUltimaRevision) {
      alerts.push({
        type: "revision_colmena",
        hiveId: hive.id,
        message: `Colmena ${hive.numero} — Sin registro de revisión`,
        priority: "alta",
        suggestedAction: "Realizar primera inspección para evaluar estado de la colonia, presencia de reina, y nivel de Varroa.",
      })
      continue
    }

    const lastInspection = new Date(hive.fechaUltimaRevision).getTime()
    if (lastInspection < fifteenDaysAgo) {
      const daysOverdue = Math.floor((Date.now() - lastInspection) / 86400000)
      alerts.push({
        type: "revision_colmena",
        hiveId: hive.id,
        message: `Colmena ${hive.numero} — Sin revisión hace ${daysOverdue} días`,
        priority: daysOverdue > 30 ? "alta" : "media",
        suggestedAction: "Programar revisión de colmena: verificar postura de reina, reservas de miel, y nivel de Varroa.",
      })
    }
  }

  return alerts
}

/**
 * Detect animals with active medication withdrawal period
 */
export function detectActiveWithdrawal(
  healthEvents: HealthEvent[]
): AlertResult[] {
  const alerts: AlertResult[] = []
  const now = Date.now()

  for (const event of healthEvents) {
    if (!event.retiroFin) continue

    const withdrawalEnd = new Date(event.retiroFin).getTime()
    if (withdrawalEnd > now) {
      const daysRemaining = Math.ceil((withdrawalEnd - now) / 86400000)
      alerts.push({
        type: "retiro_activo",
        animalId: event.animalId,
        message: `Retiro activo por ${event.nombreProducto || "medicamento"} — ${daysRemaining} día${daysRemaining !== 1 ? "s" : ""} restantes (vence ${new Date(event.retiroFin).toLocaleDateString("es-MX")})`,
        priority: daysRemaining <= 3 ? "media" : "baja",
        suggestedAction:
          "No comercializar este animal hasta que termine el periodo de retiro. Registrar en bitácora de retiros.",
      })
    }
  }

  return alerts
}

/**
 * Detect feed inventory below 7 days of supply
 */
export function detectLowFeedStock(
  feedInventory: FeedInventoryItem[]
): AlertResult[] {
  const alerts: AlertResult[] = []

  for (const item of feedInventory) {
    if (item.consumoDiarioKg <= 0) continue
    const daysOfSupply = item.cantidadKg / item.consumoDiarioKg

    if (daysOfSupply < 7) {
      alerts.push({
        type: "alimento_bajo",
        message: `Stock bajo de ${item.producto}: ${Math.round(item.cantidadKg)} kg restantes (${daysOfSupply.toFixed(1)} días de suministro)`,
        priority: daysOfSupply < 3 ? "alta" : "media",
        suggestedAction: `Reabastecer ${item.producto}. Consumo diario: ${item.consumoDiarioKg} kg. Se requieren al menos ${Math.round(item.consumoDiarioKg * 14)} kg para 2 semanas.`,
      })
    }
  }

  return alerts
}

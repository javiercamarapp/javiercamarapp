"use client"

import { KpiCard } from "@/components/dashboard/kpi-card"
import { AlertCard } from "@/components/dashboard/alert-card"
import { AiInsightCard } from "@/components/dashboard/ai-insight-card"
import { ActivityTimeline } from "@/components/dashboard/activity-timeline"
import { DollarSign } from "lucide-react"

// Mock data - replace with real data from hooks
const mockKpis = [
  { species: "bovino", speciesName: "Bovinos", total: 247, trend: 8, detail: "38 gestantes" },
  { species: "abeja", speciesName: "Apicultura", total: 40, trend: 5, detail: "420kg última cosecha" },
]

const mockAlerts = [
  {
    species: "bovino",
    identifier: "Vaca #247 Emperatriz",
    message: "Parto estimado en 3 días",
    priority: "alta" as const,
    daysUrgent: 3,
    actionUrl: "/dashboard/inventario/mock-id",
  },
  {
    species: "abeja",
    identifier: "Colmena S07 — Apiario Norte",
    message: "Varroa detectada, nivel alto. Tratar urgente.",
    priority: "alta" as const,
    daysUrgent: 1,
    actionUrl: "/dashboard/inventario/apiarios/mock-id",
  },
  {
    species: "bovino",
    identifier: "5 bovinos",
    message: "Sin pesaje hace más de 45 días",
    priority: "media" as const,
    daysUrgent: 45,
    actionUrl: "/dashboard/pesajes",
  },
  {
    species: "bovino",
    identifier: "Toro #12 Huracán",
    message: "Vacuna de carbón sintomático vencida hace 15 días",
    priority: "media" as const,
    daysUrgent: 15,
    actionUrl: "/dashboard/sanidad",
  },
]

const mockInsights = [
  {
    message:
      "Tu vaca #247 lleva 3 ciclos sin preñar. Considera cambiar de semental o revisar nutrición.",
    actionUrl: "/dashboard/reproduccion",
  },
  {
    message:
      "La GDP del Potrero Sur está 15% abajo del promedio del rancho. Revisa la calidad del pasto y suplementación.",
    actionUrl: "/dashboard/pesajes",
  },
  {
    message:
      "Tu apiario Norte produce 30% más miel que el Sur. La floración de Tajonal hizo la diferencia este mes.",
    actionUrl: "/dashboard/inventario/apiarios",
  },
]

const mockActivities = [
  { id: "1", time: "Hace 2h", type: "Pesaje registrado", species: "bovino", detail: "Toro #12 Huracán — 485 kg" },
  { id: "2", time: "Hace 3h", type: "Revisión de colmena", species: "abeja", detail: "Colmena L03 — Reina vista, buena postura" },
  { id: "3", time: "Hace 5h", type: "Venta registrada", species: "bovino", detail: "3 novillos — $48,500 MXN" },
  { id: "4", time: "Ayer", type: "Vacunación aplicada", species: "bovino", detail: "15 cabezas — Clostridiosis 7 vías" },
  { id: "5", time: "Ayer", type: "Cosecha de miel", species: "abeja", detail: "Apiario Norte — 85 kg miel clara" },
  { id: "6", time: "Hace 2 días", type: "Parto exitoso", species: "bovino", detail: "Vaca #189 Luna — 1 becerro macho, 32kg" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <section>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-2 xl:grid-cols-4">
          {mockKpis.map((kpi) => (
            <KpiCard key={kpi.species} {...kpi} />
          ))}
          {/* Estimated Value Card */}
          <div className="flex-shrink-0 w-[200px] lg:w-auto rounded-xl border border-border bg-white p-5 space-y-3 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-[#22C55E]/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-[#22C55E]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor estimado del hato</p>
                <p className="text-2xl font-bold text-foreground">$2,450,000 MXN</p>
              </div>
            </div>
            <p className="text-xs text-[#16A34A] font-medium">
              Tu hato creció 15% en los últimos 6 meses
            </p>
          </div>
        </div>
      </section>

      {/* Alerts */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Alertas urgentes</h2>
          <span className="text-xs text-muted-foreground">{mockAlerts.length} activas</span>
        </div>
        <div className="space-y-2">
          {mockAlerts.map((alert, i) => (
            <AlertCard key={i} {...alert} />
          ))}
        </div>
      </section>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <AiInsightCard insights={mockInsights} />

        {/* Activity Timeline */}
        <ActivityTimeline activities={mockActivities} />
      </div>
    </div>
  )
}

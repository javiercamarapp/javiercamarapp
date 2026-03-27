"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// ── Mock Data ──────────────────────────────────────────────────────────────────

const programas = [
  {
    id: "renacer-ganadero",
    nombre: "Renacer Ganadero — Inseminación Artificial",
    presupuesto: "$28.5M MXN",
    presupuestoEjercido: 72,
    fechaInicio: "2025-01-15",
    fechaFin: "2026-12-31",
    status: "Activo",
    metricas: [
      { label: "Ranchos inscritos", actual: 847, meta: 1000 },
      { label: "Inseminaciones realizadas", actual: 23450, meta: 100000 },
      { label: "Gestaciones confirmadas", actual: 15230, meta: 65000 },
    ],
    descripcion:
      "Programa de inseminación artificial para mejoramiento genético del hato bovino en municipios prioritarios.",
  },
  {
    id: "mejoramiento-genetico",
    nombre: "Mejoramiento Genético — Sementales",
    presupuesto: "$12.8M MXN",
    presupuestoEjercido: 86,
    fechaInicio: "2025-03-01",
    fechaFin: "2026-06-30",
    status: "Activo",
    metricas: [
      { label: "Sementales entregados", actual: 290, meta: 334 },
      { label: "Ranchos beneficiados", actual: 280, meta: 340 },
      { label: "Crías registradas", actual: 1450, meta: 5000 },
    ],
    descripcion:
      "Entrega de sementales de razas mejoradas a productores de pequeña y mediana escala.",
  },
  {
    id: "repoblamiento-hato",
    nombre: "Repoblamiento del Hato",
    presupuesto: "$8.9M MXN",
    presupuestoEjercido: 64,
    fechaInicio: "2025-06-01",
    fechaFin: "2026-12-31",
    status: "Activo",
    metricas: [
      { label: "Vientres entregados", actual: 650, meta: 800 },
      { label: "Productores activos", actual: 180, meta: 250 },
      { label: "Crías registradas", actual: 420, meta: 1200 },
    ],
    descripcion:
      "Programa de entrega de vientres gestantes a productores afectados por sequía y huracanes.",
  },
  {
    id: "salud-animal",
    nombre: "Salud Animal y Vacunación",
    presupuesto: "$5.4M MXN",
    presupuestoEjercido: 91,
    fechaInicio: "2025-01-01",
    fechaFin: "2025-12-31",
    status: "Cerrado",
    metricas: [
      { label: "Cabezas vacunadas", actual: 312000, meta: 350000 },
      { label: "Municipios cubiertos", actual: 42, meta: 42 },
      { label: "Brotes controlados", actual: 3, meta: 0 },
    ],
    descripcion:
      "Campaña anual de vacunación contra brucelosis, tuberculosis y rabia paralítica bovina.",
  },
  {
    id: "tecnificacion-2027",
    nombre: "Tecnificación Ganadera 2027",
    presupuesto: "$15.0M MXN",
    presupuestoEjercido: 0,
    fechaInicio: "2027-01-01",
    fechaFin: "2027-12-31",
    status: "Planeación",
    metricas: [
      { label: "Ranchos objetivo", actual: 0, meta: 500 },
      { label: "Sistemas de riego", actual: 0, meta: 200 },
      { label: "Capacitaciones", actual: 0, meta: 120 },
    ],
    descripcion:
      "Programa de tecnificación con sistemas de monitoreo digital, riego y capacitación técnica.",
  },
]

function ProgressBar({
  value,
  max,
  color = "bg-[#1B4332]",
}: {
  value: number
  max: number
  color?: string
}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Activo: "bg-green-100 text-green-700",
    Cerrado: "bg-gray-100 text-gray-600",
    "Planeación": "bg-blue-100 text-blue-700",
  }
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status] ?? "bg-gray-100 text-gray-700"}`}
    >
      {status}
    </span>
  )
}

export default function ProgramasPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Programas</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestión y seguimiento de programas ganaderos estatales
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {programas.map((prog) => (
          <Link
            key={prog.id}
            href={`/gobierno/programas/${prog.id}`}
            className="block transition-shadow hover:shadow-lg"
          >
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base leading-tight">
                    {prog.nombre}
                  </CardTitle>
                  <StatusBadge status={prog.status} />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {prog.descripcion}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Budget */}
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                  <div>
                    <p className="text-xs text-gray-500">Presupuesto</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {prog.presupuesto}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Ejercido</p>
                    <p className="text-sm font-semibold text-[#1B4332]">
                      {prog.presupuestoEjercido}%
                    </p>
                  </div>
                </div>

                {/* Dates */}
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>Inicio: {prog.fechaInicio}</span>
                  <span>Fin: {prog.fechaFin}</span>
                </div>

                {/* Metrics */}
                <div className="space-y-2.5">
                  {prog.metricas.map((m) => (
                    <div key={m.label}>
                      <div className="mb-1 flex justify-between text-xs text-gray-500">
                        <span>{m.label}</span>
                        <span>
                          {m.actual.toLocaleString()} / {m.meta.toLocaleString()}
                        </span>
                      </div>
                      <ProgressBar value={m.actual} max={m.meta} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

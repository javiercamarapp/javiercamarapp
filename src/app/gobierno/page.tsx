"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// ── Mock Data ──────────────────────────────────────────────────────────────────

const ranchTableData = [
  { rancho: "Rancho San Pedro", propietario: "Juan Carlos Pech", municipio: "Tizimín", cabezas: 245, sementales: 3, crias: 18, ultimaActividad: "2026-03-25", status: "Activo" },
  { rancho: "Hacienda Santa Rosa", propietario: "María Elena Canul", municipio: "Valladolid", cabezas: 180, sementales: 2, crias: 12, ultimaActividad: "2026-03-24", status: "Activo" },
  { rancho: "El Cenote", propietario: "Roberto Dzul Poot", municipio: "Tekax", cabezas: 320, sementales: 4, crias: 22, ultimaActividad: "2026-03-22", status: "Activo" },
  { rancho: "Los Aluxes", propietario: "Fernando Chi May", municipio: "Mérida", cabezas: 95, sementales: 1, crias: 6, ultimaActividad: "2026-02-15", status: "Sin actividad" },
  { rancho: "Rancho Nuevo", propietario: "Patricia Balam Uc", municipio: "Motul", cabezas: 150, sementales: 2, crias: 10, ultimaActividad: "2026-03-20", status: "Activo" },
  { rancho: "San Miguel Kahua", propietario: "Andrés Couoh Tun", municipio: "Oxkutzcab", cabezas: 275, sementales: 3, crias: 15, ultimaActividad: "2026-03-26", status: "Activo" },
  { rancho: "La Ceiba", propietario: "Laura Mex Chan", municipio: "Tizimín", cabezas: 410, sementales: 5, crias: 28, ultimaActividad: "2026-03-23", status: "Activo" },
  { rancho: "Hacienda Uxmal", propietario: "Diego Nah Puc", municipio: "Santa Elena", cabezas: 60, sementales: 1, crias: 3, ultimaActividad: "2025-12-10", status: "Suspendido" },
  { rancho: "El Ramonal", propietario: "Carmen Tuz Hau", municipio: "Peto", cabezas: 190, sementales: 2, crias: 14, ultimaActividad: "2026-03-18", status: "Activo" },
  { rancho: "Tres Hermanos", propietario: "Miguel Ángel Cen", municipio: "Valladolid", cabezas: 135, sementales: 2, crias: 9, ultimaActividad: "2026-01-05", status: "Sin actividad" },
]

const vaccinationData = [
  { municipio: "Tizimín", porcentaje: 92 },
  { municipio: "Valladolid", porcentaje: 78 },
  { municipio: "Tekax", porcentaje: 85 },
  { municipio: "Mérida", porcentaje: 65 },
  { municipio: "Oxkutzcab", porcentaje: 71 },
]

const aiInsights = [
  {
    title: "Municipios con mayor potencial",
    text: "Tizimín y Tekax muestran el mayor crecimiento en cabezas de ganado (+12% trimestral). Se recomienda priorizar entregas de sementales en estas zonas.",
    type: "oportunidad",
  },
  {
    title: "Ranchos sin actividad reciente",
    text: "14 ranchos no han reportado actividad en los últimos 60 días. Se sugiere agendar visitas de verificación.",
    type: "alerta",
  },
  {
    title: "Eficacia de inseminación por encima del promedio",
    text: "La tasa de gestación del 65% supera el promedio nacional (58%). El uso de semen sexado ha mejorado resultados en 8 puntos porcentuales.",
    type: "positivo",
  },
  {
    title: "Inversión por cabeza en descenso",
    text: "El costo por cabeza producida bajó de $1,450 a $1,180 MXN este trimestre, indicando mayor eficiencia en el programa.",
    type: "positivo",
  },
]

// ── Helper Components ──────────────────────────────────────────────────────────

function ProgressBar({
  value,
  max,
  color = "bg-[#1B4332]",
}: {
  value: number
  max: number
  color?: string
}) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
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
    "Sin actividad": "bg-amber-100 text-amber-700",
    Suspendido: "bg-red-100 text-red-700",
  }
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status] ?? "bg-gray-100 text-gray-700"}`}
    >
      {status}
    </span>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────────

export default function GobiernoDashboard() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("Todos")

  const filteredRanchos = ranchTableData.filter((r) => {
    const matchesSearch =
      r.rancho.toLowerCase().includes(search.toLowerCase()) ||
      r.propietario.toLowerCase().includes(search.toLowerCase()) ||
      r.municipio.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === "Todos" || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-10">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard de Gobierno
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Vista general del estado ganadero en Yucatán
        </p>
      </div>

      {/* ── KPI Cards (2x3 grid) ──────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-5">
        {/* 1. Ranchos activos */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Ranchos Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">847</p>
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs text-gray-500">
                <span>Meta: 1,000</span>
                <span>84.7%</span>
              </div>
              <ProgressBar value={847} max={1000} />
            </div>
          </CardContent>
        </Card>

        {/* 2. Total cabezas */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Cabezas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">387,000</p>
            <div className="mt-3 flex items-center gap-3">
              {/* Pie chart placeholder */}
              <div className="relative h-14 w-14 flex-shrink-0">
                <svg viewBox="0 0 36 36" className="h-14 w-14">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#1B4332"
                    strokeWidth="3"
                    strokeDasharray="62 38"
                    strokeDashoffset="25"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#2D6A4F"
                    strokeWidth="3"
                    strokeDasharray="25 75"
                    strokeDashoffset="63"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#95D5B2"
                    strokeWidth="3"
                    strokeDasharray="13 87"
                    strokeDashoffset="38"
                  />
                </svg>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#1B4332]" />
                  Bovino 62%
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#2D6A4F]" />
                  Porcino 25%
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#95D5B2]" />
                  Ovino 13%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Crecimiento del hato */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Crecimiento del Hato
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">387K</p>
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs text-gray-500">
                <span>350K inicio</span>
                <span>Meta 500K</span>
              </div>
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
                {/* Base from 350K */}
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-gray-300"
                  style={{ width: "70%" }}
                />
                {/* Actual 387K */}
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-[#1B4332]"
                  style={{ width: `${((387 - 350) / (500 - 350)) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                +37K cabezas ({((37 / 150) * 100).toFixed(1)}% del objetivo)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 4. Inseminaciones */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Inseminaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">23,450</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <span className="text-sm font-bold text-green-700">65%</span>
              </div>
              <span className="text-sm text-gray-500">
                Efectividad (gestaciones confirmadas)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 5. Sementales entregados */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Sementales Entregados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">290 / 334</p>
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs text-gray-500">
                <span>Avance</span>
                <span>86.8%</span>
              </div>
              <ProgressBar value={290} max={334} />
            </div>
          </CardContent>
        </Card>

        {/* 6. Inversión ejercida */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Inversión Ejercida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">$45.2M</p>
            <p className="text-sm text-gray-500">MXN</p>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="inline-flex items-center rounded bg-green-100 px-1.5 py-0.5 font-medium text-green-700">
                78%
              </span>
              <span className="text-gray-500">del presupuesto autorizado</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Programs Section ──────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Programas Activos
        </h2>
        <div className="grid grid-cols-3 gap-5">
          {/* Program 1 */}
          <Card className="border-l-4 border-l-[#1B4332]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Renacer Ganadero — Inseminación Artificial
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Ranchos</span>
                  <span>847 / 1,000</span>
                </div>
                <ProgressBar value={847} max={1000} />
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Inseminaciones</span>
                  <span>23,450 / 100,000</span>
                </div>
                <ProgressBar value={23450} max={100000} color="bg-[#2D6A4F]" />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Gestaciones confirmadas</span>
                <span className="font-semibold text-[#1B4332]">15,230</span>
              </div>
            </CardContent>
          </Card>

          {/* Program 2 */}
          <Card className="border-l-4 border-l-[#2D6A4F]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Mejoramiento Genético — Sementales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Sementales</span>
                  <span>290 / 334</span>
                </div>
                <ProgressBar value={290} max={334} color="bg-[#2D6A4F]" />
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Ranchos beneficiados</span>
                  <span>280 / 340</span>
                </div>
                <ProgressBar value={280} max={340} color="bg-[#2D6A4F]" />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Crías registradas</span>
                <span className="font-semibold text-[#2D6A4F]">1,450</span>
              </div>
            </CardContent>
          </Card>

          {/* Program 3 */}
          <Card className="border-l-4 border-l-[#52B788]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Repoblamiento del Hato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Vientres entregados</span>
                  <span>650 / 800</span>
                </div>
                <ProgressBar value={650} max={800} color="bg-[#52B788]" />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Productores activos</span>
                <span className="font-semibold text-gray-900">180</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Crías registradas</span>
                <span className="font-semibold text-[#52B788]">420</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Map Placeholder ───────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Distribución Geográfica
        </h2>
        <div className="flex h-72 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
              />
            </svg>
            <p className="mt-3 text-lg font-medium text-gray-600">
              Mapa de Yucatán — Distribución de ranchos
            </p>
            <p className="mt-1 text-sm text-gray-400">
              847 ranchos distribuidos en 42 municipios
            </p>
          </div>
        </div>
      </section>

      {/* ── Ranch Table ───────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Padrón de Ranchos
        </h2>

        {/* Search & Filters */}
        <div className="mb-4 flex items-center gap-3">
          <Input
            placeholder="Buscar rancho, propietario o municipio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex gap-2">
            {["Todos", "Activo", "Sin actividad", "Suspendido"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  statusFilter === s
                    ? "bg-[#1B4332] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600">Rancho</th>
                <th className="px-4 py-3 font-medium text-gray-600">
                  Propietario
                </th>
                <th className="px-4 py-3 font-medium text-gray-600">
                  Municipio
                </th>
                <th className="px-4 py-3 font-medium text-gray-600 text-right">
                  Cabezas
                </th>
                <th className="px-4 py-3 font-medium text-gray-600 text-right">
                  Sementales
                </th>
                <th className="px-4 py-3 font-medium text-gray-600 text-right">
                  Crías
                </th>
                <th className="px-4 py-3 font-medium text-gray-600">
                  Última actividad
                </th>
                <th className="px-4 py-3 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRanchos.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {r.rancho}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{r.propietario}</td>
                  <td className="px-4 py-3 text-gray-600">{r.municipio}</td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    {r.cabezas.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    {r.sementales}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    {r.crias}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {r.ultimaActividad}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Health Coverage Section ───────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Cobertura Sanitaria — Vacunación por Municipio
        </h2>
        <Card>
          <CardContent className="pt-6 space-y-4">
            {vaccinationData.map((v) => (
              <div key={v.municipio}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-gray-700">{v.municipio}</span>
                  <span className="font-medium text-gray-900">
                    {v.porcentaje}%
                  </span>
                </div>
                <ProgressBar
                  value={v.porcentaje}
                  max={100}
                  color={
                    v.porcentaje >= 85
                      ? "bg-[#1B4332]"
                      : v.porcentaje >= 70
                        ? "bg-[#52B788]"
                        : "bg-amber-500"
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* ── AI Government Insights ────────────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">
            Insights de IA
          </h2>
          <span className="rounded-full bg-[#1B4332] px-2 py-0.5 text-xs font-medium text-white">
            HatoAI
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {aiInsights.map((insight, i) => {
            const borderColor =
              insight.type === "alerta"
                ? "border-l-amber-500"
                : insight.type === "oportunidad"
                  ? "border-l-blue-500"
                  : "border-l-[#1B4332]"
            const iconBg =
              insight.type === "alerta"
                ? "bg-amber-100 text-amber-700"
                : insight.type === "oportunidad"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
            return (
              <Card key={i} className={`border-l-4 ${borderColor}`}>
                <CardContent className="flex gap-3 pt-5">
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${iconBg}`}
                  >
                    {insight.type === "alerta" ? (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {insight.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">{insight.text}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}

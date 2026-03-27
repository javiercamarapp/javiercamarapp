"use client"

import { use } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// ── Mock Data ──────────────────────────────────────────────────────────────────

const programasData: Record<string, {
  nombre: string
  descripcion: string
  status: string
  presupuesto: string
  ejercido: string
  porcentajeEjercido: number
  fechaInicio: string
  fechaFin: string
  responsable: string
  kpis: { label: string; actual: number; meta: number }[]
  timeline: { fecha: string; evento: string; status: string }[]
  beneficiarios: {
    nombre: string
    municipio: string
    animales: number
    fechaAlta: string
    status: string
  }[]
  monthlyProgress: { mes: string; valor: number }[]
}> = {
  "renacer-ganadero": {
    nombre: "Renacer Ganadero — Inseminación Artificial",
    descripcion:
      "Programa de inseminación artificial para mejoramiento genético del hato bovino en municipios prioritarios del estado de Yucatán.",
    status: "Activo",
    presupuesto: "$28,500,000 MXN",
    ejercido: "$20,520,000 MXN",
    porcentajeEjercido: 72,
    fechaInicio: "2025-01-15",
    fechaFin: "2026-12-31",
    responsable: "MVZ. Roberto Chan Canul",
    kpis: [
      { label: "Ranchos inscritos", actual: 847, meta: 1000 },
      { label: "Inseminaciones realizadas", actual: 23450, meta: 100000 },
      { label: "Gestaciones confirmadas", actual: 15230, meta: 65000 },
      { label: "Técnicos capacitados", actual: 45, meta: 50 },
      { label: "Pajillas utilizadas", actual: 28400, meta: 120000 },
      { label: "Municipios activos", actual: 38, meta: 42 },
    ],
    timeline: [
      { fecha: "2025-01-15", evento: "Lanzamiento del programa", status: "completado" },
      { fecha: "2025-03-01", evento: "Primera fase — Inscripción de ranchos", status: "completado" },
      { fecha: "2025-06-15", evento: "Inicio de inseminaciones en campo", status: "completado" },
      { fecha: "2025-10-01", evento: "Evaluación de medio término", status: "completado" },
      { fecha: "2026-03-01", evento: "Segunda fase — Ampliación", status: "en progreso" },
      { fecha: "2026-06-30", evento: "Meta de 50,000 inseminaciones", status: "pendiente" },
      { fecha: "2026-12-31", evento: "Cierre y evaluación final", status: "pendiente" },
    ],
    beneficiarios: [
      { nombre: "Juan Carlos Pech", municipio: "Tizimín", animales: 245, fechaAlta: "2025-02-10", status: "Activo" },
      { nombre: "María Elena Canul", municipio: "Valladolid", animales: 180, fechaAlta: "2025-02-15", status: "Activo" },
      { nombre: "Roberto Dzul Poot", municipio: "Tekax", animales: 320, fechaAlta: "2025-03-01", status: "Activo" },
      { nombre: "Fernando Chi May", municipio: "Mérida", animales: 95, fechaAlta: "2025-03-10", status: "Suspendido" },
      { nombre: "Patricia Balam Uc", municipio: "Motul", animales: 150, fechaAlta: "2025-04-05", status: "Activo" },
      { nombre: "Andrés Couoh Tun", municipio: "Oxkutzcab", animales: 275, fechaAlta: "2025-04-12", status: "Activo" },
      { nombre: "Laura Mex Chan", municipio: "Tizimín", animales: 410, fechaAlta: "2025-05-01", status: "Activo" },
      { nombre: "Carmen Tuz Hau", municipio: "Peto", animales: 190, fechaAlta: "2025-05-20", status: "Activo" },
    ],
    monthlyProgress: [
      { mes: "Mar 2025", valor: 1200 },
      { mes: "Abr 2025", valor: 1850 },
      { mes: "May 2025", valor: 2100 },
      { mes: "Jun 2025", valor: 2450 },
      { mes: "Jul 2025", valor: 2800 },
      { mes: "Ago 2025", valor: 2650 },
      { mes: "Sep 2025", valor: 2200 },
      { mes: "Oct 2025", valor: 1900 },
      { mes: "Nov 2025", valor: 1750 },
      { mes: "Dic 2025", valor: 1400 },
      { mes: "Ene 2026", valor: 1600 },
      { mes: "Feb 2026", valor: 1550 },
    ],
  },
}

// Fallback for any id
const defaultProgram = programasData["renacer-ganadero"]

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
    Suspendido: "bg-red-100 text-red-700",
    completado: "bg-green-100 text-green-700",
    "en progreso": "bg-blue-100 text-blue-700",
    pendiente: "bg-gray-100 text-gray-500",
  }
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status] ?? "bg-gray-100 text-gray-700"}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export default function ProgramaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const programa = programasData[id] ?? defaultProgram

  const maxMonthly = Math.max(...programa.monthlyProgress.map((m) => m.valor))

  return (
    <div className="space-y-8">
      {/* Breadcrumb + header */}
      <div>
        <Link
          href="/gobierno/programas"
          className="text-sm text-gray-500 hover:text-[#1B4332]"
        >
          &larr; Programas
        </Link>
        <div className="mt-2 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {programa.nombre}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {programa.descripcion}
            </p>
          </div>
          <StatusBadge status={programa.status} />
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-gray-500">Presupuesto</p>
            <p className="text-lg font-bold text-gray-900">
              {programa.presupuesto}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-gray-500">Ejercido</p>
            <p className="text-lg font-bold text-[#1B4332]">
              {programa.ejercido}
            </p>
            <ProgressBar
              value={programa.porcentajeEjercido}
              max={100}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-gray-500">Periodo</p>
            <p className="text-sm font-semibold text-gray-900">
              {programa.fechaInicio} — {programa.fechaFin}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-gray-500">Responsable</p>
            <p className="text-sm font-semibold text-gray-900">
              {programa.responsable}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── All KPIs ──────────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Indicadores Clave
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {programa.kpis.map((kpi) => (
            <Card key={kpi.label}>
              <CardContent className="pt-5">
                <p className="text-xs text-gray-500">{kpi.label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {kpi.actual.toLocaleString()}
                </p>
                <div className="mt-2">
                  <div className="mb-1 flex justify-between text-xs text-gray-500">
                    <span>Meta: {kpi.meta.toLocaleString()}</span>
                    <span>
                      {((kpi.actual / kpi.meta) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <ProgressBar value={kpi.actual} max={kpi.meta} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Progress Timeline ─────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Cronograma del Programa
        </h2>
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              {programa.timeline.map((item, i) => (
                <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
                  {/* Vertical line */}
                  {i < programa.timeline.length - 1 && (
                    <div className="absolute left-[11px] top-6 h-full w-0.5 bg-gray-200" />
                  )}
                  {/* Dot */}
                  <div
                    className={`relative z-10 mt-1 h-6 w-6 flex-shrink-0 rounded-full border-2 ${
                      item.status === "completado"
                        ? "border-[#1B4332] bg-[#1B4332]"
                        : item.status === "en progreso"
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300 bg-white"
                    }`}
                  >
                    {item.status === "completado" && (
                      <svg
                        className="h-full w-full p-0.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                    )}
                  </div>
                  {/* Content */}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.evento}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {item.fecha}
                      </span>
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Monthly Progress Chart Placeholder ────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Avance Mensual — Inseminaciones
        </h2>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-end gap-2" style={{ height: 180 }}>
              {programa.monthlyProgress.map((m) => (
                <div
                  key={m.mes}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <span className="text-xs font-medium text-gray-700">
                    {m.valor.toLocaleString()}
                  </span>
                  <div
                    className="w-full rounded-t bg-[#1B4332]"
                    style={{
                      height: `${(m.valor / maxMonthly) * 140}px`,
                    }}
                  />
                  <span className="text-[10px] text-gray-500">
                    {m.mes.slice(0, 3)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Beneficiary List Table ────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Padrón de Beneficiarios
        </h2>
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600">
                  Beneficiario
                </th>
                <th className="px-4 py-3 font-medium text-gray-600">
                  Municipio
                </th>
                <th className="px-4 py-3 font-medium text-gray-600 text-right">
                  Animales
                </th>
                <th className="px-4 py-3 font-medium text-gray-600">
                  Fecha de alta
                </th>
                <th className="px-4 py-3 font-medium text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {programa.beneficiarios.map((b, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {b.nombre}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{b.municipio}</td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    {b.animales}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{b.fechaAlta}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

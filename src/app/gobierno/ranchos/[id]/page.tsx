"use client"

import { use } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// ── Mock Data ──────────────────────────────────────────────────────────────────

const ranchoData = {
  nombre: "Rancho San Pedro",
  propietario: "Juan Carlos Pech Canul",
  curp: "PECJ780415HYNCHJ01",
  municipio: "Tizimín",
  localidad: "Colonia Yucatán",
  superficie: "120 hectáreas",
  coordenadas: "21.1428° N, -88.1647° W",
  telefono: "999-234-5678",
  fechaRegistro: "2025-02-10",
  programas: ["Renacer Ganadero — Inseminación Artificial", "Mejoramiento Genético — Sementales"],
  animalesPrograma: [
    { tipo: "Semental Brahman", arete: "SM-2025-0142", fechaEntrega: "2025-04-15", status: "Activo", programa: "Mejoramiento Genético" },
    { tipo: "Semental Suizo", arete: "SM-2025-0287", fechaEntrega: "2025-06-20", status: "Activo", programa: "Mejoramiento Genético" },
    { tipo: "Semental Gyr", arete: "SM-2025-0301", fechaEntrega: "2025-08-10", status: "Baja — Muerte", programa: "Mejoramiento Genético" },
    { tipo: "Vientre Brahman", arete: "VT-2025-0890", fechaEntrega: "2025-05-01", status: "Gestante", programa: "Inseminación Artificial" },
    { tipo: "Vientre Suizo", arete: "VT-2025-0912", fechaEntrega: "2025-05-01", status: "Activo", programa: "Inseminación Artificial" },
  ],
  produccion: [
    { mes: "Oct 2025", leche: 4200, crias: 3, peso: 185 },
    { mes: "Nov 2025", leche: 4500, crias: 2, peso: 190 },
    { mes: "Dic 2025", leche: 3800, crias: 4, peso: 188 },
    { mes: "Ene 2026", leche: 4100, crias: 3, peso: 192 },
    { mes: "Feb 2026", leche: 4350, crias: 5, peso: 195 },
    { mes: "Mar 2026", leche: 4600, crias: 1, peso: 198 },
  ],
  cumplimiento: {
    vacunacion: { cumple: true, ultimaFecha: "2026-02-15" },
    reporteMensual: { cumple: true, ultimaFecha: "2026-03-01" },
    visitaVerificacion: { cumple: true, ultimaFecha: "2026-01-20" },
    areteo: { cumple: false, ultimaFecha: "2025-11-10" },
    guiaSanitaria: { cumple: true, ultimaFecha: "2026-03-10" },
  },
  cabezasTotales: 245,
  sementales: 3,
  vientres: 85,
  crias: 18,
  statusGeneral: "Activo",
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Activo: "bg-green-100 text-green-700",
    Gestante: "bg-purple-100 text-purple-700",
    "Baja — Muerte": "bg-red-100 text-red-700",
  }
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status] ?? "bg-gray-100 text-gray-700"}`}
    >
      {status}
    </span>
  )
}

function ComplianceRow({
  label,
  cumple,
  fecha,
}: {
  label: string
  cumple: boolean
  fecha: string
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-2">
        <div
          className={`flex h-5 w-5 items-center justify-center rounded-full ${
            cumple ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {cumple ? (
            <svg
              className="h-3 w-3 text-green-700"
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
          ) : (
            <svg
              className="h-3 w-3 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>
        <span className="text-sm text-gray-700">{label}</span>
      </div>
      <span className="text-xs text-gray-500">{fecha}</span>
    </div>
  )
}

export default function RanchoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const rancho = ranchoData

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div>
        <Link
          href="/gobierno"
          className="text-sm text-gray-500 hover:text-[#1B4332]"
        >
          &larr; Dashboard
        </Link>
      </div>

      {/* ── Ranch Info Header ─────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {rancho.nombre}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {rancho.propietario} — CURP: {rancho.curp}
            </p>
          </div>
          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
            {rancho.statusGeneral}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-gray-500">Municipio</p>
            <p className="text-sm font-medium text-gray-900">
              {rancho.municipio}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Localidad</p>
            <p className="text-sm font-medium text-gray-900">
              {rancho.localidad}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Superficie</p>
            <p className="text-sm font-medium text-gray-900">
              {rancho.superficie}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Coordenadas</p>
            <p className="text-sm font-medium text-gray-900">
              {rancho.coordenadas}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Teléfono</p>
            <p className="text-sm font-medium text-gray-900">
              {rancho.telefono}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Fecha de registro</p>
            <p className="text-sm font-medium text-gray-900">
              {rancho.fechaRegistro}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-500">Programas inscritos</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {rancho.programas.map((p) => (
                <span
                  key={p}
                  className="rounded bg-[#1B4332]/10 px-2 py-0.5 text-xs font-medium text-[#1B4332]"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          {[
            { label: "Cabezas totales", value: rancho.cabezasTotales },
            { label: "Sementales", value: rancho.sementales },
            { label: "Vientres", value: rancho.vientres },
            { label: "Crías", value: rancho.crias },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg bg-gray-50 px-4 py-3 text-center"
            >
              <p className="text-2xl font-bold text-[#1B4332]">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Animals from Program ──────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Animales del Programa
        </h2>
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600">Tipo</th>
                <th className="px-4 py-3 font-medium text-gray-600">Arete</th>
                <th className="px-4 py-3 font-medium text-gray-600">
                  Fecha entrega
                </th>
                <th className="px-4 py-3 font-medium text-gray-600">
                  Programa
                </th>
                <th className="px-4 py-3 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rancho.animalesPrograma.map((a, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {a.tipo}
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-600">
                    {a.arete}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {a.fechaEntrega}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{a.programa}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={a.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Production Reported ───────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Producción Reportada
        </h2>
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600">Mes</th>
                <th className="px-4 py-3 font-medium text-gray-600 text-right">
                  Leche (L)
                </th>
                <th className="px-4 py-3 font-medium text-gray-600 text-right">
                  Crías nacidas
                </th>
                <th className="px-4 py-3 font-medium text-gray-600 text-right">
                  Peso prom. (kg)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rancho.produccion.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {p.mes}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    {p.leche.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    {p.crias}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    {p.peso}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Compliance Summary ────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Resumen de Cumplimiento
        </h2>
        <Card>
          <CardContent className="pt-6 divide-y divide-gray-100">
            <ComplianceRow
              label="Vacunación al día"
              cumple={rancho.cumplimiento.vacunacion.cumple}
              fecha={rancho.cumplimiento.vacunacion.ultimaFecha}
            />
            <ComplianceRow
              label="Reporte mensual entregado"
              cumple={rancho.cumplimiento.reporteMensual.cumple}
              fecha={rancho.cumplimiento.reporteMensual.ultimaFecha}
            />
            <ComplianceRow
              label="Visita de verificación"
              cumple={rancho.cumplimiento.visitaVerificacion.cumple}
              fecha={rancho.cumplimiento.visitaVerificacion.ultimaFecha}
            />
            <ComplianceRow
              label="Areteo completo"
              cumple={rancho.cumplimiento.areteo.cumple}
              fecha={rancho.cumplimiento.areteo.ultimaFecha}
            />
            <ComplianceRow
              label="Guía sanitaria vigente"
              cumple={rancho.cumplimiento.guiaSanitaria.cumple}
              fecha={rancho.cumplimiento.guiaSanitaria.ultimaFecha}
            />
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

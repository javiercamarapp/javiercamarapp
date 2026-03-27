"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// ── Mock Data ──────────────────────────────────────────────────────────────────

const periodos = [
  "Q1 2026 (Ene-Mar)",
  "Q4 2025 (Oct-Dic)",
  "Q3 2025 (Jul-Sep)",
  "Q2 2025 (Abr-Jun)",
  "Q1 2025 (Ene-Mar)",
]

const reportes = [
  {
    titulo: "Informe Trimestral",
    descripcion:
      "Reporte consolidado de avance de todos los programas ganaderos, incluyendo KPIs, presupuesto ejercido y metas alcanzadas.",
    icono: "chart",
    ultimaGeneracion: "2026-03-15",
    paginas: 42,
  },
  {
    titulo: "Informe por Municipio",
    descripcion:
      "Desglose de actividad ganadera por municipio: ranchos activos, cabezas de ganado, cobertura sanitaria y programas vigentes.",
    icono: "map",
    ultimaGeneracion: "2026-03-10",
    paginas: 28,
  },
  {
    titulo: "Padrón de Beneficiarios",
    descripcion:
      "Lista completa de beneficiarios de todos los programas con datos de contacto, animales asignados y status de cumplimiento.",
    icono: "users",
    ultimaGeneracion: "2026-03-01",
    paginas: 65,
  },
  {
    titulo: "Avance del Programa",
    descripcion:
      "Reporte detallado de avance por programa individual: inseminaciones, sementales, repoblamiento, con gráficas de tendencia.",
    icono: "trending",
    ultimaGeneracion: "2026-03-12",
    paginas: 35,
  },
]

function ReportIcon({ type }: { type: string }) {
  const iconClass = "h-6 w-6 text-[#1B4332]"
  switch (type) {
    case "chart":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
      )
    case "map":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
        </svg>
      )
    case "users":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </svg>
      )
    case "trending":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
        </svg>
      )
    default:
      return null
  }
}

export default function ReportesPage() {
  const [selectedPeriodo, setSelectedPeriodo] = useState(periodos[0])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
        <p className="mt-1 text-sm text-gray-500">
          Generación y descarga de informes oficiales
        </p>
      </div>

      {/* Period selector */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Periodo
        </label>
        <div className="flex gap-2">
          {periodos.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPeriodo(p)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                selectedPeriodo === p
                  ? "bg-[#1B4332] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Report cards */}
      <div className="grid grid-cols-2 gap-6">
        {reportes.map((reporte) => (
          <Card key={reporte.titulo} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#1B4332]/10">
                  <ReportIcon type={reporte.icono} />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base">
                    {reporte.titulo}
                  </CardTitle>
                  <p className="mt-1 text-sm text-gray-500">
                    {reporte.descripcion}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="mt-auto">
              <div className="mb-4 flex items-center gap-4 text-xs text-gray-500">
                <span>Última generación: {reporte.ultimaGeneracion}</span>
                <span>{reporte.paginas} páginas</span>
                <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700">
                  {selectedPeriodo}
                </span>
              </div>
              <div className="flex gap-3">
                <Button className="flex items-center gap-2">
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
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>
                  Descargar PDF
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
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
                      d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M10.875 12h-1.5m1.5 0c.621 0 1.125.504 1.125 1.125M12 12h7.5m-7.5 0c0 .621-.504 1.125-1.125 1.125M21.375 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h17.25"
                    />
                  </svg>
                  Descargar Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

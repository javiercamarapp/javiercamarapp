"use client"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// ---------------------------------------------------------------------------
// InseminacionesChart - Line chart of inseminations over time
// ---------------------------------------------------------------------------

export interface InseminacionesDataPoint {
  fecha: string
  cantidad: number
}

interface InseminacionesChartProps {
  data: InseminacionesDataPoint[]
  title?: string
}

export function InseminacionesChart({
  data,
  title = "Inseminaciones",
}: InseminacionesChartProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Sin datos de inseminaciones
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="fecha" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
                allowDecimals={false}
                label={{
                  value: "Inseminaciones",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 12, fill: "#6b7280" },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 13,
                }}
                formatter={(value) => [`${value}`, "Inseminaciones"]}
                labelFormatter={(label) => `Periodo: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="cantidad"
                stroke="#1B4332"
                strokeWidth={2}
                dot={{ fill: "#1B4332", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// CoberturaMunicipalChart - Horizontal bar chart
// ---------------------------------------------------------------------------

export interface CoberturaMunicipalDataPoint {
  municipio: string
  cobertura: number
}

interface CoberturaMunicipalChartProps {
  data: CoberturaMunicipalDataPoint[]
  title?: string
}

export function CoberturaMunicipalChart({
  data,
  title = "Cobertura municipal",
}: CoberturaMunicipalChartProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Sin datos de cobertura
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(300, data.length * 40)}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                type="number"
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                type="category"
                dataKey="municipio"
                tick={{ fontSize: 11 }}
                stroke="#9ca3af"
                width={75}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 13,
                }}
                formatter={(value) => [`${value}%`, "Cobertura"]}
              />
              <Bar dataKey="cobertura" fill="#2D6A4F" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// CrecimientoHatoChart - Area chart of herd growth
// ---------------------------------------------------------------------------

export interface CrecimientoHatoDataPoint {
  fecha: string
  total: number
}

interface CrecimientoHatoChartProps {
  data: CrecimientoHatoDataPoint[]
  title?: string
}

export function CrecimientoHatoChart({
  data,
  title = "Crecimiento del hato",
}: CrecimientoHatoChartProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Sin datos de crecimiento
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="gradientHato" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="fecha" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
                allowDecimals={false}
                label={{
                  value: "Cabezas",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 12, fill: "#6b7280" },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 13,
                }}
                formatter={(value) => [Number(value).toLocaleString("es-MX"), "Total de cabezas"]}
                labelFormatter={(label) => `Periodo: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#1B4332"
                strokeWidth={2}
                fill="url(#gradientHato)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// ROIChart - Line chart with dual Y-axis
// ---------------------------------------------------------------------------

export interface ROIDataPoint {
  fecha: string
  inversion: number
  retorno: number
}

interface ROIChartProps {
  data: ROIDataPoint[]
  title?: string
}

export function ROIChart({ data, title = "Retorno de inversion" }: ROIChartProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Sin datos de ROI
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="fecha" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12 }}
                stroke="#1B4332"
                tickFormatter={(v) => (v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`)}
                label={{
                  value: "Inversion ($)",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 11, fill: "#1B4332" },
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                stroke="#22C55E"
                tickFormatter={(v) => `${v}%`}
                label={{
                  value: "Retorno (%)",
                  angle: 90,
                  position: "insideRight",
                  style: { fontSize: 11, fill: "#22C55E" },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 13,
                }}
                formatter={(value, name) => {
                  if (name === "inversion")
                    return [`$${Number(value).toLocaleString("es-MX")}`, "Inversion"]
                  if (name === "retorno") return [`${value}%`, "Retorno"]
                  return [`${value}`, String(name)]
                }}
                labelFormatter={(label) => `Periodo: ${label}`}
              />
              <Legend
                formatter={(value) => {
                  if (value === "inversion") return "Inversion ($)"
                  if (value === "retorno") return "Retorno (%)"
                  return value
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="inversion"
                stroke="#1B4332"
                strokeWidth={2}
                dot={{ fill: "#1B4332", r: 4 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="retorno"
                stroke="#22C55E"
                strokeWidth={2}
                dot={{ fill: "#22C55E", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface ProductionDataPoint {
  fecha: string
  [key: string]: string | number
}

interface ProductionChartProps {
  data: ProductionDataPoint[]
  lines?: { key: string; label: string; color?: string }[]
  yLabel?: string
  title?: string
}

const DEFAULT_COLORS = ["#1B4332", "#22C55E", "#2D6A4F", "#4ADE80", "#166534", "#86EFAC"]

export function ProductionChart({
  data,
  lines,
  yLabel = "Litros",
  title = "Produccion",
}: ProductionChartProps) {
  // Auto-detect lines from data keys if not provided
  const lineConfigs = lines ?? (() => {
    if (data.length === 0) return []
    const keys = Object.keys(data[0]).filter((k) => k !== "fecha")
    return keys.map((key, i) => ({
      key,
      label: key,
      color: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
    }))
  })()

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Sin datos de produccion
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="fecha"
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
                label={{
                  value: yLabel,
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
                formatter={(value, name) => {
                  const config = lineConfigs.find((l) => l.key === String(name))
                  return [`${value} ${yLabel.toLowerCase()}`, config?.label || String(name)]
                }}
                labelFormatter={(label) => `Fecha: ${label}`}
              />
              <Legend
                formatter={(value) => {
                  const config = lineConfigs.find((l) => l.key === value)
                  return config?.label || value
                }}
              />
              {lineConfigs.map((line, i) => (
                <Line
                  key={line.key}
                  type="monotone"
                  dataKey={line.key}
                  stroke={line.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
                  strokeWidth={2}
                  dot={{ fill: line.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length], r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

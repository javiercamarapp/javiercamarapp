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

export interface WeightDataPoint {
  fecha: string
  peso: number
  gdp?: number | null
}

interface WeightChartProps {
  data: WeightDataPoint[]
  title?: string
}

export function WeightChart({ data, title = "Historial de peso" }: WeightChartProps) {
  const hasGdp = data.some((d) => d.gdp != null)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Sin datos de peso registrados
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
                  value: "Peso (kg)",
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
                  if (name === "peso") return [`${value} kg`, "Peso"]
                  if (name === "gdp") return [`${value} kg/dia`, "GDP"]
                  return [`${value}`, String(name)]
                }}
                labelFormatter={(label) => `Fecha: ${label}`}
              />
              <Legend
                formatter={(value) => {
                  if (value === "peso") return "Peso (kg)"
                  if (value === "gdp") return "GDP (kg/dia)"
                  return value
                }}
              />
              <Line
                type="monotone"
                dataKey="peso"
                stroke="#1B4332"
                strokeWidth={2}
                dot={{ fill: "#1B4332", r: 4 }}
                activeDot={{ r: 6 }}
              />
              {hasGdp && (
                <Line
                  type="monotone"
                  dataKey="gdp"
                  stroke="#22C55E"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "#22C55E", r: 3 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

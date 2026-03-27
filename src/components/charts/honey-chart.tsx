"use client"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface HoneyDataPoint {
  fecha: string
  miel?: number
  cera?: number
  polen?: number
}

interface HoneyChartProps {
  data: HoneyDataPoint[]
  title?: string
}

export function HoneyChart({ data, title = "Cosechas de miel" }: HoneyChartProps) {
  const hasMiel = data.some((d) => d.miel != null && d.miel > 0)
  const hasCera = data.some((d) => d.cera != null && d.cera > 0)
  const hasPolen = data.some((d) => d.polen != null && d.polen > 0)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Sin datos de cosecha
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
                  value: "kg",
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
                  if (name === "miel") return [`${value} kg`, "Miel"]
                  if (name === "cera") return [`${value} kg`, "Cera"]
                  if (name === "polen") return [`${value} kg`, "Polen"]
                  return [`${value} kg`, String(name)]
                }}
              />
              <Legend
                formatter={(value) => {
                  if (value === "miel") return "Miel"
                  if (value === "cera") return "Cera"
                  if (value === "polen") return "Polen"
                  return value
                }}
              />
              {hasMiel && (
                <Bar dataKey="miel" fill="#D97706" radius={[4, 4, 0, 0]} barSize={24} />
              )}
              {hasCera && (
                <Bar dataKey="cera" fill="#EAB308" radius={[4, 4, 0, 0]} barSize={24} />
              )}
              {hasPolen && (
                <Bar dataKey="polen" fill="#F97316" radius={[4, 4, 0, 0]} barSize={24} />
              )}
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

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

export interface BirthsDataPoint {
  mes: string
  vivos: number
  muertos: number
}

interface BirthsChartProps {
  data: BirthsDataPoint[]
  title?: string
}

export function BirthsChart({ data, title = "Nacimientos por mes" }: BirthsChartProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Sin datos de nacimientos
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="mes"
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
                allowDecimals={false}
                label={{
                  value: "Cantidad",
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
                  if (name === "vivos") return [`${value}`, "Nacidos vivos"]
                  if (name === "muertos") return [`${value}`, "Nacidos muertos"]
                  return [`${value}`, String(name)]
                }}
              />
              <Legend
                formatter={(value) => {
                  if (value === "vivos") return "Nacidos vivos"
                  if (value === "muertos") return "Nacidos muertos"
                  return value
                }}
              />
              <Bar
                dataKey="vivos"
                stackId="nacimientos"
                fill="#22C55E"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="muertos"
                stackId="nacimientos"
                fill="#EF4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

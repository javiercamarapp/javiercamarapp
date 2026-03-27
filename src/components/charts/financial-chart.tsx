"use client"

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface FinancialDataPoint {
  mes: string
  ingresos: number
  egresos: number
}

interface FinancialChartProps {
  data: FinancialDataPoint[]
  title?: string
}

export function FinancialChart({
  data,
  title = "Ingresos y egresos",
}: FinancialChartProps) {
  const dataWithMargin = data.map((d) => ({
    ...d,
    margen: d.ingresos - d.egresos,
  }))

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Sin datos financieros
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              data={dataWithMargin}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="mes"
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
                tickFormatter={(value) =>
                  value >= 1000 ? `$${(value / 1000).toFixed(0)}k` : `$${value}`
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 13,
                }}
                formatter={(value, name) => {
                  const formatted = `$${Number(value).toLocaleString("es-MX")}`
                  if (name === "ingresos") return [formatted, "Ingresos"]
                  if (name === "egresos") return [formatted, "Egresos"]
                  if (name === "margen") return [formatted, "Margen neto"]
                  return [formatted, String(name)]
                }}
              />
              <Legend
                formatter={(value) => {
                  if (value === "ingresos") return "Ingresos"
                  if (value === "egresos") return "Egresos"
                  if (value === "margen") return "Margen neto"
                  return value
                }}
              />
              <Bar dataKey="ingresos" fill="#22C55E" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="egresos" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={20} />
              <Line
                type="monotone"
                dataKey="margen"
                stroke="#1B4332"
                strokeWidth={2}
                dot={{ fill: "#1B4332", r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

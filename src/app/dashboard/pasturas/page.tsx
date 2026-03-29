'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Satellite, RefreshCw, Leaf, AlertTriangle, TrendingUp, Flower2 } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const historicoData = [
  { mes: 'Oct', ndvi: 0.31 },
  { mes: 'Nov', ndvi: 0.28 },
  { mes: 'Dic', ndvi: 0.25 },
  { mes: 'Ene', ndvi: 0.33 },
  { mes: 'Feb', ndvi: 0.38 },
  { mes: 'Mar', ndvi: 0.42 },
]

const potreros = [
  { nombre: 'Potrero Norte', ndvi: 0.52, estado: 'bueno', color: 'bg-green-500' },
  { nombre: 'Potrero Sur', ndvi: 0.31, estado: 'moderado', color: 'bg-yellow-500' },
  { nombre: 'Potrero Este', ndvi: 0.45, estado: 'bueno', color: 'bg-green-500' },
  { nombre: 'Corral de manga', ndvi: null, estado: 'N/A', color: 'bg-gray-400' },
]

function getNDVIColor(ndvi: number): string {
  if (ndvi < 0.2) return '#EF4444'
  if (ndvi < 0.4) return '#F59E0B'
  if (ndvi < 0.6) return '#22C55E'
  return '#166534'
}

function getNDVILabel(ndvi: number): string {
  if (ndvi < 0.2) return 'Bajo'
  if (ndvi < 0.4) return 'Moderado'
  if (ndvi < 0.6) return 'Bueno'
  return 'Excelente'
}

export default function PasturasPage() {
  const [loading, setLoading] = useState(false)
  const [ndvi] = useState(0.42)

  const handleRefresh = async () => {
    setLoading(true)
    try {
      await fetch('/api/satellite/ndvi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: 20.6597, lng: -103.3496 }),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
            <Satellite className="h-6 w-6 text-green-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Monitoreo de Pasturas</h1>
            <p className="text-sm text-muted-foreground">Índice NDVI vía satélite — actualización cada 5 días</p>
          </div>
        </div>
        <Button onClick={handleRefresh} disabled={loading} variant="outline" size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar datos satelitales
        </Button>
      </div>

      {/* NDVI Gauge + Interpretation */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Índice NDVI General</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Gauge visualization */}
            <div className="flex flex-col items-center">
              <div
                className="relative flex h-32 w-32 items-center justify-center rounded-full border-8"
                style={{ borderColor: getNDVIColor(ndvi) }}
              >
                <div className="text-center">
                  <span className="text-3xl font-bold" style={{ color: getNDVIColor(ndvi) }}>
                    {ndvi.toFixed(2)}
                  </span>
                  <p className="text-xs text-muted-foreground">{getNDVILabel(ndvi)}</p>
                </div>
              </div>
              {/* Color scale */}
              <div className="mt-4 flex w-full gap-1">
                <div className="flex-1 rounded-l-full bg-red-500 py-1 text-center text-[10px] text-white">&lt;0.2</div>
                <div className="flex-1 bg-yellow-500 py-1 text-center text-[10px] text-white">0.2-0.4</div>
                <div className="flex-1 bg-green-500 py-1 text-center text-[10px] text-white">0.4-0.6</div>
                <div className="flex-1 rounded-r-full bg-green-800 py-1 text-center text-[10px] text-white">&gt;0.6</div>
              </div>
              <div className="mt-1 flex w-full justify-between text-[10px] text-muted-foreground px-1">
                <span>Suelo desnudo</span>
                <span>Pasto seco</span>
                <span>Pasto verde</span>
                <span>Vegetación densa</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Leaf className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-sm">Interpretación</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Vegetación moderada — pasturas en condición aceptable
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-sm">Recomendación</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Capacidad de carga actual: ~1.5 UA/ha. Considerar rotación si el NDVI baja de 0.35.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Flower2 className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-sm">Índice de floración (EVI): 0.38</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Floración moderada de tajonal — útil para apicultores
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Historical NDVI Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Histórico NDVI — Últimos 6 meses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicoData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="ndviGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="mes" className="text-xs" />
                <YAxis domain={[0, 1]} ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]} className="text-xs" />
                <Tooltip
                  formatter={(value) => [Number(value).toFixed(2), 'NDVI']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="ndvi"
                  stroke="#22C55E"
                  strokeWidth={2}
                  fill="url(#ndviGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Potrero Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-3">NDVI por Potrero</h2>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {potreros.map((p) => (
            <Card key={p.nombre}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">{p.nombre}</h3>
                  {p.ndvi !== null ? (
                    <Badge
                      variant="outline"
                      className={
                        p.estado === 'bueno'
                          ? 'border-green-500 text-green-700'
                          : 'border-yellow-500 text-yellow-700'
                      }
                    >
                      {p.estado}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-gray-400 text-gray-500">
                      N/A
                    </Badge>
                  )}
                </div>
                {p.ndvi !== null ? (
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold" style={{ color: getNDVIColor(p.ndvi) }}>
                      {p.ndvi.toFixed(2)}
                    </span>
                    <span className="text-xs text-muted-foreground mb-1">NDVI</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">Sin vegetación</span>
                  </div>
                )}
                <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${p.color}`}
                    style={{ width: p.ndvi !== null ? `${p.ndvi * 100}%` : '0%' }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

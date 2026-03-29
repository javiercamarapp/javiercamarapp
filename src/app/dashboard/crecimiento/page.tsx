'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LineChart as LineChartIcon, Target, ArrowUp, ArrowDown } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  ComposedChart,
  Line,
} from 'recharts'
import { SPECIES_CONFIG } from '@/lib/species/config'
import {
  getGrowthParams,
  generateGrowthCurve,
  predictWeight,
  predictDaysToWeight,
} from '@/lib/ai/growth-curves'

// Demo actual weights for a Brahman male
const DEMO_ACTUAL_WEIGHTS = [
  { dia: 0, pesoReal: 32 },
  { dia: 60, pesoReal: 85 },
  { dia: 120, pesoReal: 140 },
  { dia: 180, pesoReal: 210 },
  { dia: 240, pesoReal: 280 },
  { dia: 300, pesoReal: 350 },
  { dia: 360, pesoReal: 420 },
]

const speciesWithGrowth = ['bovino', 'porcino', 'ovino', 'caprino'] as const

export default function CrecimientoPage() {
  const [especie, setEspecie] = useState('bovino')
  const [raza, setRaza] = useState('Brahman')
  const [sexo, setSexo] = useState('macho')
  const [pesoObjetivo, setPesoObjetivo] = useState('450')

  const speciesConfig = SPECIES_CONFIG[especie as keyof typeof SPECIES_CONFIG]
  const razas = speciesConfig?.razas || []

  const params = useMemo(
    () => getGrowthParams(especie, raza, sexo),
    [especie, raza, sexo]
  )

  const curveData = useMemo(() => {
    const curve = generateGrowthCurve(params, 730, 30)
    // Merge actual weights for demo
    if (especie === 'bovino' && raza === 'Brahman' && sexo === 'macho') {
      return curve.map((point) => {
        const actual = DEMO_ACTUAL_WEIGHTS.find((a) => a.dia === point.dia)
        return {
          ...point,
          pesoReal: actual?.pesoReal ?? null,
        }
      })
    }
    return curve.map((p) => ({ ...p, pesoReal: null }))
  }, [params, especie, raza, sexo])

  const targetWeight = Number(pesoObjetivo) || 0
  const daysToTarget = useMemo(
    () => predictDaysToWeight(params, targetWeight),
    [params, targetWeight]
  )
  const monthsToTarget = Math.round(daysToTarget / 30)

  // Compare last actual weight vs expected
  const lastActual = DEMO_ACTUAL_WEIGHTS[DEMO_ACTUAL_WEIGHTS.length - 1]
  const expectedAtLastDay = predictWeight(params, lastActual.dia)
  const diffPercent = ((lastActual.pesoReal - expectedAtLastDay) / expectedAtLastDay) * 100
  const isAboveCurve = diffPercent > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <LineChartIcon className="h-6 w-6 text-green-600" />
          Curvas de Crecimiento
        </h1>
        <p className="text-muted-foreground">
          Predicciones de peso basadas en el modelo Gompertz y comparaci&oacute;n con pesajes reales
        </p>
      </div>

      {/* Selectors */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Especie</Label>
              <Select
                value={especie}
                onValueChange={(v) => {
                  setEspecie(v)
                  const cfg = SPECIES_CONFIG[v as keyof typeof SPECIES_CONFIG]
                  if (cfg?.razas?.length) setRaza(cfg.razas[0])
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {speciesWithGrowth.map((sp) => (
                    <SelectItem key={sp} value={sp}>
                      {SPECIES_CONFIG[sp].emoji} {SPECIES_CONFIG[sp].nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Raza</Label>
              <Select value={raza} onValueChange={setRaza}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {razas.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sexo</Label>
              <Select value={sexo} onValueChange={setSexo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="macho">Macho</SelectItem>
                  <SelectItem value="hembra">Hembra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Growth Curve Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChartIcon className="h-5 w-5 text-green-600" />
            Curva de Crecimiento Predicha vs Real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={curveData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="dia"
                label={{ value: 'Edad (d\u00edas)', position: 'insideBottomRight', offset: -5 }}
              />
              <YAxis
                label={{ value: 'Peso (kg)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                formatter={(value, name) => [
                  `${value} kg`,
                  name === 'peso' ? 'Predicci\u00f3n Gompertz' : 'Peso Real',
                ]}
                labelFormatter={(label) => `D\u00eda ${label}`}
              />
              <Area
                type="monotone"
                dataKey="peso"
                stroke="#1B6B3C"
                fill="#1B6B3C"
                fillOpacity={0.15}
                strokeWidth={2}
                name="peso"
              />
              <Line
                type="monotone"
                dataKey="pesoReal"
                stroke="#D97706"
                strokeWidth={2}
                dot={{ fill: '#D97706', r: 5 }}
                connectNulls
                name="pesoReal"
              />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#1B6B3C]" />
              Predicci&oacute;n Gompertz
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#D97706]" />
              Pesajes Reales
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison and calculator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weight comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comparaci&oacute;n con Curva Esperada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Peso real (d&iacute;a {lastActual.dia})</span>
              <span className="font-semibold">{lastActual.pesoReal} kg</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Peso esperado (d&iacute;a {lastActual.dia})</span>
              <span className="font-semibold">{Math.round(expectedAtLastDay)} kg</span>
            </div>
            <div className={`flex items-center gap-2 p-3 rounded-lg ${isAboveCurve ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {isAboveCurve ? (
                <ArrowUp className="h-5 w-5" />
              ) : (
                <ArrowDown className="h-5 w-5" />
              )}
              <span className="text-sm font-medium">
                Tu animal est&aacute; {Math.abs(Math.round(diffPercent))}% {isAboveCurve ? 'por encima' : 'por debajo'} de la curva esperada
                {isAboveCurve ? ' \u2014 excelente GDP' : ' \u2014 revisar alimentaci\u00f3n'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Days to target calculator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-5 w-5 text-amber-500" />
              &iquest;Cu&aacute;ndo alcanzar&aacute; X kg?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Peso objetivo (kg)</Label>
              <Input
                type="number"
                value={pesoObjetivo}
                onChange={(e) => setPesoObjetivo(e.target.value)}
                placeholder="Ej: 450"
              />
            </div>
            {targetWeight > 0 && (
              <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                {daysToTarget === Infinity ? (
                  <span>El peso objetivo excede el peso maduro estimado ({params.A} kg) para esta raza.</span>
                ) : (
                  <span>
                    Tu {sexo === 'macho' ? 'novillo' : 'vaquilla'} {raza} alcanzar&aacute;{' '}
                    <strong>{targetWeight} kg</strong> en aproximadamente{' '}
                    <strong>{daysToTarget} d&iacute;as</strong> ({monthsToTarget} meses)
                  </span>
                )}
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              Peso maduro estimado: <Badge variant="secondary">{params.A} kg</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, ArrowUp, ArrowDown, Brain } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { REGIONAL_BENCHMARKS } from '@/lib/ai/growth-curves'

// Demo: user's ranch data for bovino
const MI_RANCHO = {
  gdp_promedio: 0.85,
  tasa_prenez: 62,
  mortalidad: 3,
  produccion_leche: 6.1,
}

const TOP_25 = {
  gdp_promedio: 0.95,
  tasa_prenez: 70,
  mortalidad: 2.5,
  produccion_leche: 7.8,
}

const regional = REGIONAL_BENCHMARKS.bovino

interface ComparisonCardProps {
  titulo: string
  tuValor: number
  regionalValor: number
  unidad: string
  invertido?: boolean // true = lower is better (mortality)
}

function ComparisonCard({ titulo, tuValor, regionalValor, unidad, invertido = false }: ComparisonCardProps) {
  const diff = ((tuValor - regionalValor) / regionalValor) * 100
  const isPositive = invertido ? diff < 0 : diff > 0

  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm font-medium text-muted-foreground mb-2">{titulo}</p>
        <div className="flex items-end justify-between mb-3">
          <div>
            <span className="text-2xl font-bold">{tuValor}</span>
            <span className="text-sm text-muted-foreground ml-1">{unidad}</span>
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            {invertido ? `${Math.abs(Math.round(diff))}%` : `+${Math.abs(Math.round(diff))}%`}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Tu promedio: <strong>{tuValor} {unidad}</strong> vs Regional: <strong>{regionalValor} {unidad}</strong>
        </p>
      </CardContent>
    </Card>
  )
}

const chartData = [
  {
    indicador: 'GDP (kg/d\u00eda)',
    'Tu rancho': MI_RANCHO.gdp_promedio,
    'Promedio regional': regional.gdp_promedio,
    'Top 25%': TOP_25.gdp_promedio,
  },
  {
    indicador: 'Tasa pre\u00f1ez (%)',
    'Tu rancho': MI_RANCHO.tasa_prenez,
    'Promedio regional': regional.tasa_prenez,
    'Top 25%': TOP_25.tasa_prenez,
  },
  {
    indicador: 'Mortalidad (%)',
    'Tu rancho': MI_RANCHO.mortalidad,
    'Promedio regional': regional.mortalidad,
    'Top 25%': TOP_25.mortalidad,
  },
  {
    indicador: 'Leche (L/d\u00eda)',
    'Tu rancho': MI_RANCHO.produccion_leche,
    'Promedio regional': regional.produccion_leche,
    'Top 25%': TOP_25.produccion_leche,
  },
]

export default function BenchmarkPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-green-600" />
          Benchmarking Regional
        </h1>
        <p className="text-muted-foreground">
          Compara tu rancho con el promedio de productores de tu regi&oacute;n (datos an&oacute;nimos)
        </p>
      </div>

      {/* Percentile badge */}
      <div className="flex items-center gap-3">
        <Badge className="bg-green-600 text-white text-sm px-4 py-1">
          Tu rancho est&aacute; en el percentil 72 de tu regi&oacute;n
        </Badge>
      </div>

      {/* 4 comparison cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ComparisonCard
          titulo="GDP"
          tuValor={MI_RANCHO.gdp_promedio}
          regionalValor={regional.gdp_promedio}
          unidad="kg/d\u00eda"
        />
        <ComparisonCard
          titulo="Tasa de Pre\u00f1ez"
          tuValor={MI_RANCHO.tasa_prenez}
          regionalValor={regional.tasa_prenez}
          unidad="%"
        />
        <ComparisonCard
          titulo="Mortalidad"
          tuValor={MI_RANCHO.mortalidad}
          regionalValor={regional.mortalidad}
          unidad="%"
          invertido
        />
        <ComparisonCard
          titulo="Producci\u00f3n Leche"
          tuValor={MI_RANCHO.produccion_leche}
          regionalValor={regional.produccion_leche}
          unidad="L/d\u00eda"
        />
      </div>

      {/* Bar chart comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            Comparativa: Tu Rancho vs Regi&oacute;n vs Top 25%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="indicador" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Tu rancho" fill="#1B6B3C" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Promedio regional" fill="#93C5FD" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Top 25%" fill="#D97706" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* AI Recommendation */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <Brain className="h-5 w-5" />
            Recomendaci&oacute;n de IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-900">
            Para subir al top 25%, enf&oacute;cate en reducir d&iacute;as abiertos (actualmente 145 d&iacute;as, meta: &lt;120).
            Implementar IATF (inseminaci&oacute;n artificial a tiempo fijo) podr&iacute;a mejorar tu tasa de pre&ntilde;ez
            de 62% a ~70% en 2 ciclos reproductivos. Tambi&eacute;n considera suplementaci&oacute;n mineral
            estrat&eacute;gica durante la &eacute;poca de secas para mantener el GDP por encima de 0.90 kg/d&iacute;a.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

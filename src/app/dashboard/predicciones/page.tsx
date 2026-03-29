'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Brain,
  Baby,
  DollarSign,
  Bug,
  Scale,
  Wheat,
  Loader2,
  Sparkles,
  CalendarDays,
  TrendingUp,
} from 'lucide-react'

interface Prediccion {
  tipo: 'parto' | 'venta' | 'enfermedad' | 'peso' | 'alimentacion'
  animal_id: string | null
  titulo: string
  prediccion: string
  fecha_estimada: string | null
  confianza_pct: number
  valor_economico_mxn: number | null
  accion_recomendada: string
}

const tipoConfig: Record<string, { icon: typeof Brain; color: string; label: string }> = {
  parto: { icon: Baby, color: 'bg-pink-100 text-pink-800 border-pink-200', label: 'Parto' },
  venta: { icon: DollarSign, color: 'bg-green-100 text-green-800 border-green-200', label: 'Venta' },
  enfermedad: { icon: Bug, color: 'bg-red-100 text-red-800 border-red-200', label: 'Enfermedad' },
  peso: { icon: Scale, color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Peso' },
  alimentacion: { icon: Wheat, color: 'bg-amber-100 text-amber-800 border-amber-200', label: 'Alimentación' },
}

const demoPredicciones: Prediccion[] = [
  {
    tipo: 'parto',
    animal_id: null,
    titulo: 'Parto esperado: Vaca La Negra',
    prediccion:
      'Vaca La Negra parirá entre el 12-15 de abril 2026. Gestación de 280 días desde el servicio del 5 de julio 2025. Se recomienda moverla al potrero de maternidad a partir del 8 de abril.',
    fecha_estimada: '2026-04-13',
    confianza_pct: 92,
    valor_economico_mxn: null,
    accion_recomendada: 'Mover a potrero de maternidad y preparar kit de parto. Verificar condición corporal.',
  },
  {
    tipo: 'venta',
    animal_id: null,
    titulo: 'Momento óptimo de venta: Novillo #008',
    prediccion:
      'Momento óptimo de venta para Novillo #008: esta semana. Peso estimado 480kg a $65/kg = $31,200 MXN. El precio de novillo en la región está al alza y el GDP está desacelerando, indicando que mantenerlo más tiempo generaría costo de alimentación sin ganancia proporcional.',
    fecha_estimada: '2026-04-02',
    confianza_pct: 85,
    valor_economico_mxn: 31200,
    accion_recomendada: 'Vender esta semana en subasta de Mérida. Contactar al comprador José Kumul.',
  },
  {
    tipo: 'enfermedad',
    animal_id: null,
    titulo: 'Riesgo alto: Garrapata Boophilus en Potrero Norte',
    prediccion:
      'Riesgo alto de garrapata Boophilus en Potrero Norte por temporada de lluvias. Aplicar baño garrapaticida antes del 5 de abril. El año pasado en las mismas fechas se registraron 12 casos en ese potrero.',
    fecha_estimada: '2026-04-05',
    confianza_pct: 78,
    valor_economico_mxn: null,
    accion_recomendada:
      'Aplicar baño garrapaticida (Amitraz) antes del 5 de abril. Revisar orejas y entrepiernas diariamente.',
  },
  {
    tipo: 'peso',
    animal_id: null,
    titulo: 'Proyección de peso: Becerro BC-012',
    prediccion:
      'Becerro BC-012 alcanzará 200kg en 45 días al GDP actual de 1.3 kg/día. Actualmente pesa 141.5 kg. La curva de crecimiento es consistente con la raza Brahman en condiciones de pastoreo tropical.',
    fecha_estimada: '2026-05-13',
    confianza_pct: 88,
    valor_economico_mxn: null,
    accion_recomendada: 'Mantener suplemento mineral actual. Pesar nuevamente en 15 días para validar GDP.',
  },
  {
    tipo: 'alimentacion',
    animal_id: null,
    titulo: 'Optimización: Reducir concentrado 15%',
    prediccion:
      'Reducir concentrado 15% y aumentar pastoreo rotacional ahorraría $3,200 MXN/mes sin afectar GDP. El pasto en los potreros Sur y Este está en estado óptimo (45 cm) y puede soportar la carga animal actual.',
    fecha_estimada: null,
    confianza_pct: 72,
    valor_economico_mxn: 3200,
    accion_recomendada:
      'Implementar rotación de potreros cada 3 días. Reducir concentrado de 2kg a 1.7kg/animal/día.',
  },
]

export default function PrediccionesPage() {
  const [predicciones, setPredicciones] = useState<Prediccion[]>(demoPredicciones)
  const [loading, setLoading] = useState(false)

  const handleGenerar = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/predictor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rancho_id: null, tipo: 'todos' }),
      })
      if (!res.ok) throw new Error('Error del servidor')
      const data = await res.json()
      if (data.predicciones && data.predicciones.length > 0) {
        setPredicciones(data.predicciones)
      }
    } catch {
      // Si falla, mantener las predicciones demo
    } finally {
      setLoading(false)
    }
  }

  const confianzaColor = (pct: number) => {
    if (pct >= 85) return 'text-green-700'
    if (pct >= 70) return 'text-amber-700'
    return 'text-red-700'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Predicciones AI
          </h1>
          <p className="text-muted-foreground text-sm">
            Pronósticos inteligentes para tu rancho generados por inteligencia artificial
          </p>
        </div>
        <Button onClick={handleGenerar} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          {loading ? 'Generando...' : 'Generar nuevas predicciones'}
        </Button>
      </div>

      {/* Resumen rápido */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Object.entries(tipoConfig).map(([key, config]) => {
          const count = predicciones.filter((p) => p.tipo === key).length
          const Icon = config.icon
          return (
            <Card key={key} className="text-center">
              <CardContent className="pt-4 pb-3">
                <Icon className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{config.label}</p>
                <p className="text-lg font-bold">{count}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Predicciones */}
      <div className="space-y-4">
        {predicciones.map((pred, i) => {
          const config = tipoConfig[pred.tipo] || tipoConfig.peso
          const Icon = config.icon
          return (
            <Card key={i} className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Icon className="h-5 w-5 shrink-0" />
                    {pred.titulo}
                  </CardTitle>
                  <Badge variant="outline" className={config.color}>
                    {config.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{pred.prediccion}</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Confianza */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Confianza</p>
                    <div className="flex items-center gap-2">
                      <Progress value={pred.confianza_pct} className="flex-1 h-2" />
                      <span className={`text-sm font-semibold ${confianzaColor(pred.confianza_pct)}`}>
                        {pred.confianza_pct}%
                      </span>
                    </div>
                  </div>

                  {/* Fecha estimada */}
                  {pred.fecha_estimada && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Fecha estimada</p>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        {new Date(pred.fecha_estimada + 'T12:00:00').toLocaleDateString('es-MX', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  )}

                  {/* Valor económico */}
                  {pred.valor_economico_mxn && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Valor económico</p>
                      <p className="text-sm font-semibold text-green-700 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />$
                        {pred.valor_economico_mxn.toLocaleString('es-MX')} MXN
                      </p>
                    </div>
                  )}
                </div>

                {/* Acción recomendada */}
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                  <p className="text-xs font-medium text-primary mb-1">Acción recomendada</p>
                  <p className="text-sm">{pred.accion_recomendada}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

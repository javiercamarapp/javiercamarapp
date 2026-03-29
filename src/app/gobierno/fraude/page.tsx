'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShieldAlert, Search, AlertTriangle, Info, Loader2 } from 'lucide-react'

type Anomalia = {
  tipo: string
  severidad: string
  rancho: string
  descripcion: string
  evidencia: string
  accion: string
}

type AnalisisResult = {
  programa: string
  fecha_analisis: string
  total_anomalias: number
  anomalias: Anomalia[]
  score_integridad: number
  nota: string
}

const severidadStyles: Record<string, { badge: string; border: string }> = {
  alta: { badge: 'bg-red-600 text-white', border: 'border-l-red-600' },
  media: { badge: 'bg-amber-600 text-white', border: 'border-l-amber-600' },
  baja: { badge: 'bg-blue-500 text-white', border: 'border-l-blue-500' },
}

const tipoLabels: Record<string, string> = {
  inventario_inconsistente: 'Inventario Inconsistente',
  semental_sin_crias: 'Semental sin Crías',
  benford_anomalia: 'Anomalía de Benford',
}

export default function FraudeDetectionPage() {
  const [resultado, setResultado] = useState<AnalisisResult | null>(null)
  const [loading, setLoading] = useState(false)

  const ejecutarAnalisis = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/agents/fraud-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ programa_id: 'renacer-2026' }),
      })
      const data = await res.json()
      setResultado(data)
    } catch {
      // Error silencioso
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-red-600" />
            Detección de Anomalías
          </h1>
          <p className="text-muted-foreground text-sm">
            Este módulo analiza patrones en los datos de los beneficiarios para detectar inconsistencias
          </p>
        </div>
        <Button onClick={ejecutarAnalisis} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          Ejecutar análisis
        </Button>
      </div>

      {!resultado && !loading && (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center py-12">
            <ShieldAlert className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Presiona &quot;Ejecutar análisis&quot; para escanear los datos del programa en busca de anomalías
            </p>
          </CardContent>
        </Card>
      )}

      {resultado && (
        <>
          {/* Score de integridad */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="sm:col-span-1">
              <CardContent className="pt-6 flex flex-col items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60" cy="60" r="52"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                    />
                    <circle
                      cx="60" cy="60" r="52"
                      fill="none"
                      stroke={resultado.score_integridad >= 80 ? '#16a34a' : resultado.score_integridad >= 60 ? '#d97706' : '#dc2626'}
                      strokeWidth="12"
                      strokeDasharray={`${(resultado.score_integridad / 100) * 327} 327`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{resultado.score_integridad}</span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                </div>
                <p className="mt-2 text-sm font-medium text-center">Score de Integridad</p>
                <p className="text-xs text-muted-foreground text-center">{resultado.programa}</p>
              </CardContent>
            </Card>

            <Card className="sm:col-span-2">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Resumen del Análisis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {resultado.anomalias.filter(a => a.severidad === 'alta').length}
                    </p>
                    <p className="text-xs text-muted-foreground">Severidad Alta</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-amber-600">
                      {resultado.anomalias.filter(a => a.severidad === 'media').length}
                    </p>
                    <p className="text-xs text-muted-foreground">Severidad Media</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {resultado.anomalias.filter(a => a.severidad === 'baja').length}
                    </p>
                    <p className="text-xs text-muted-foreground">Severidad Baja</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground pt-2 border-t">
                  {resultado.nota}
                </p>
                <p className="text-xs text-muted-foreground">
                  Fecha de análisis: {new Date(resultado.fecha_analisis).toLocaleString('es-MX')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Anomaly cards */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Anomalías Detectadas ({resultado.total_anomalias})
            </h2>
            {resultado.anomalias.map((anomalia, i) => {
              const styles = severidadStyles[anomalia.severidad] || severidadStyles.baja
              return (
                <Card key={i} className={`border-l-4 ${styles.border}`}>
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className={styles.badge}>{anomalia.severidad}</Badge>
                          <Badge variant="outline">
                            {tipoLabels[anomalia.tipo] || anomalia.tipo}
                          </Badge>
                        </div>
                        <p className="font-semibold text-sm">{anomalia.rancho}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{anomalia.descripcion}</p>
                    <div className="bg-muted/50 rounded p-3 text-xs font-mono">
                      {anomalia.evidencia}
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded p-2 text-sm">
                      <span className="font-medium text-primary">Acción recomendada:</span>{' '}
                      {anomalia.accion}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FileText, Download, RefreshCw, Clock } from 'lucide-react'

type Indicador = {
  nivel: string
  resumen: string
  indicador: string
  formula?: string
  valor_actual: number
  meta: number
  unidad: string
  fuente: string
}

type MIRData = {
  programa: string
  dependencia: string
  fecha_generacion: string
  indicadores: {
    fin: Indicador
    proposito: Indicador
    componentes: Indicador[]
    actividades: Indicador[]
  }
}

function getSemaforoColor(pct: number) {
  if (pct >= 80) return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', label: 'Satisfactorio' }
  if (pct >= 50) return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', label: 'En proceso' }
  return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', label: 'Crítico' }
}

function IndicadorRow({ ind }: { ind: Indicador }) {
  const pct = Math.round((ind.valor_actual / ind.meta) * 100)
  const semaforo = getSemaforoColor(pct)

  return (
    <TableRow>
      <TableCell>
        <Badge variant="outline" className="font-medium">
          {ind.nivel}
        </Badge>
      </TableCell>
      <TableCell className="max-w-[200px]">
        <p className="text-sm font-medium">{ind.resumen}</p>
      </TableCell>
      <TableCell className="max-w-[180px]">
        <p className="text-sm">{ind.indicador}</p>
      </TableCell>
      <TableCell className="text-right font-medium">
        {ind.meta.toLocaleString()} {ind.unidad !== 'porcentaje' ? ind.unidad : '%'}
      </TableCell>
      <TableCell className="text-right font-medium">
        {ind.valor_actual.toLocaleString()} {ind.unidad !== 'porcentaje' ? ind.unidad : '%'}
      </TableCell>
      <TableCell className="w-[180px]">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className={semaforo.text}>{pct}%</span>
            <Badge className={`${semaforo.bg} ${semaforo.text} ${semaforo.border} border text-xs`}>
              {semaforo.label}
            </Badge>
          </div>
          <Progress value={pct} className="h-2" />
        </div>
      </TableCell>
    </TableRow>
  )
}

export default function ConevalPage() {
  const [loading, setLoading] = useState(false)
  const [mir, setMir] = useState<MIRData | null>(null)
  const [lastGenerated, setLastGenerated] = useState<string | null>(null)

  async function generarReporte() {
    setLoading(true)
    try {
      const res = await fetch('/api/reports/coneval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ programa_id: 'renacer-ganadero-2026' }),
      })
      const data = await res.json()
      setMir(data)
      setLastGenerated(data.fecha_generacion)
    } catch {
      // Error silencioso
    } finally {
      setLoading(false)
    }
  }

  const allIndicadores: Indicador[] = mir
    ? [
        mir.indicadores.fin,
        mir.indicadores.proposito,
        ...mir.indicadores.componentes,
        ...mir.indicadores.actividades,
      ]
    : []

  return (
    <div className="space-y-6 mt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Reporte CONEVAL — Matriz de Indicadores para Resultados
          </h2>
          <p className="text-muted-foreground">
            Generación automática de la MIR con datos en tiempo real de HatoAI
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled={!mir} className="gap-2">
            <Download className="h-4 w-4" />
            Descargar PDF
          </Button>
          <Button onClick={generarReporte} disabled={loading} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Generando...' : 'Generar Reporte Actualizado'}
          </Button>
        </div>
      </div>

      {/* Timestamp */}
      {lastGenerated && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Última generación: {new Date(lastGenerated).toLocaleString('es-MX', {
            dateStyle: 'long',
            timeStyle: 'short',
          })}
        </div>
      )}

      {/* Content */}
      {!mir ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sin reporte generado</h3>
            <p className="text-muted-foreground mb-6">
              Haz clic en &quot;Generar Reporte Actualizado&quot; para crear la MIR con los datos más recientes del programa.
            </p>
            <Button onClick={generarReporte} disabled={loading} className="gap-2">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Generando...' : 'Generar Reporte'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Program info */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Programa</p>
                  <p className="font-semibold text-lg">{mir.programa}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dependencia</p>
                  <p className="font-semibold text-lg">{mir.dependencia}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* MIR Table */}
          <Card>
            <CardHeader>
              <CardTitle>Matriz de Indicadores para Resultados (MIR)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Nivel MIR</TableHead>
                      <TableHead>Resumen Narrativo</TableHead>
                      <TableHead>Indicador</TableHead>
                      <TableHead className="text-right">Meta</TableHead>
                      <TableHead className="text-right">Avance</TableHead>
                      <TableHead className="w-[180px]">% Cumplimiento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allIndicadores.map((ind, i) => (
                      <IndicadorRow key={i} ind={ind} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Indicadores satisfactorios', count: allIndicadores.filter(i => (i.valor_actual / i.meta) * 100 >= 80).length, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Indicadores en proceso', count: allIndicadores.filter(i => { const p = (i.valor_actual / i.meta) * 100; return p >= 50 && p < 80; }).length, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Indicadores críticos', count: allIndicadores.filter(i => (i.valor_actual / i.meta) * 100 < 50).length, color: 'text-red-600', bg: 'bg-red-50' },
            ].map((s) => (
              <Card key={s.label} className={s.bg}>
                <CardContent className="pt-6 text-center">
                  <p className={`text-3xl font-bold ${s.color}`}>{s.count}</p>
                  <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

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
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  RefreshCw,
} from 'lucide-react'

type CampanaStatus = {
  status: string
  ultima_prueba?: string
  ultima_vacuna?: string
  proxima: string
  animales_probados?: number
  animales_vacunados?: number
  total: number
}

type AnimalSinArete = {
  id: string
  especie: string
  nombre: string | null
  fecha_nacimiento: string
  motivo: string
}

type Reporte = {
  rancho: string
  upp: string
  fecha: string
  resumen: {
    total_animales: number
    con_siniiga: number
    sin_siniiga: number
    pct_cobertura: number
    animales_sin_arete: AnimalSinArete[]
  }
  campanas_senasica: Record<string, CampanaStatus>
  reemo_listo: boolean
  documentos_vigentes: string[]
  documentos_faltantes: string[]
}

function CampanaCard({ nombre, data }: { nombre: string; data: CampanaStatus }) {
  const isAlDia = data.status === 'al_dia'
  const cobertura = ((data.animales_probados ?? data.animales_vacunados ?? 0) / data.total) * 100

  return (
    <Card className={isAlDia ? 'border-green-200' : 'border-amber-200'}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="capitalize">{nombre}</span>
          <Badge className={isAlDia
            ? 'bg-green-100 text-green-700 border-green-300 border'
            : 'bg-amber-100 text-amber-700 border-amber-300 border'
          }>
            {isAlDia ? 'Al día' : 'Pendiente'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          {isAlDia
            ? <CheckCircle2 className="h-5 w-5 text-green-500" />
            : <AlertTriangle className="h-5 w-5 text-amber-500" />
          }
          <span className="text-sm">
            {data.animales_probados ?? data.animales_vacunados}/{data.total} animales
          </span>
        </div>
        <Progress value={cobertura} className="h-2" />
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Última: {data.ultima_prueba ?? data.ultima_vacuna}</p>
          <p>Próxima: {data.proxima}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function CumplimientoPage() {
  const [loading, setLoading] = useState(false)
  const [reporte, setReporte] = useState<Reporte | null>(null)

  async function generarReporte() {
    setLoading(true)
    try {
      const res = await fetch('/api/reports/siniiga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rancho_id: 'rancho-santa-cruz' }),
      })
      const data = await res.json()
      setReporte(data)
    } catch {
      // Error silencioso
    } finally {
      setLoading(false)
    }
  }

  const hayPendientes = reporte
    ? reporte.resumen.sin_siniiga > 0 ||
      Object.values(reporte.campanas_senasica).some(c => c.status !== 'al_dia') ||
      reporte.documentos_faltantes.length > 0
    : false

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            Cumplimiento — SINIIGA y SENASICA
          </h1>
          <p className="text-muted-foreground">
            Estado de cumplimiento normativo de tu rancho
          </p>
        </div>
        <Button onClick={generarReporte} disabled={loading} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Generando...' : 'Generar Reporte de Cumplimiento'}
        </Button>
      </div>

      {/* Alert if pending */}
      {hayPendientes && (
        <div className="flex items-center gap-3 p-4 rounded-lg border bg-amber-50 border-amber-200">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
          <div>
            <p className="font-medium text-sm">Tienes pendientes de cumplimiento</p>
            <p className="text-sm text-muted-foreground">
              Revisa los elementos marcados en amarillo o rojo para mantener tu rancho al día.
            </p>
          </div>
        </div>
      )}

      {!reporte ? (
        <Card>
          <CardContent className="py-16 text-center">
            <ShieldCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sin reporte generado</h3>
            <p className="text-muted-foreground mb-6">
              Genera un reporte para ver el estado de cumplimiento de tu rancho.
            </p>
            <Button onClick={generarReporte} disabled={loading} className="gap-2">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Generando...' : 'Generar Reporte'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Ranch info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {reporte.rancho} — UPP: {reporte.upp} — Generado: {new Date(reporte.fecha).toLocaleString('es-MX', {
              dateStyle: 'long',
              timeStyle: 'short',
            })}
          </div>

          {/* SINIIGA Coverage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Cobertura SINIIGA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className={`text-4xl font-bold ${
                    reporte.resumen.pct_cobertura >= 90 ? 'text-green-600' :
                    reporte.resumen.pct_cobertura >= 70 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {reporte.resumen.pct_cobertura}%
                  </p>
                  <p className="text-sm text-muted-foreground">Cobertura</p>
                </div>
                <div className="flex-1 space-y-2">
                  <Progress value={reporte.resumen.pct_cobertura} className="h-3" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{reporte.resumen.con_siniiga} con arete SINIIGA</span>
                    <span>{reporte.resumen.sin_siniiga} sin arete</span>
                  </div>
                </div>
              </div>

              {reporte.resumen.animales_sin_arete.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Animales sin arete SINIIGA</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Especie</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Fecha Nacimiento</TableHead>
                        <TableHead>Motivo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reporte.resumen.animales_sin_arete.map((a) => (
                        <TableRow key={a.id}>
                          <TableCell className="font-mono text-sm">{a.id}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{a.especie}</Badge>
                          </TableCell>
                          <TableCell>{a.nombre ?? '—'}</TableCell>
                          <TableCell>{a.fecha_nacimiento}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{a.motivo}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* SENASICA Campaigns */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Campañas SENASICA</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(reporte.campanas_senasica).map(([nombre, data]) => (
                <CampanaCard key={nombre} nombre={nombre} data={data} />
              ))}
            </div>
          </div>

          {/* REEMO Readiness */}
          <Card className={reporte.reemo_listo ? 'border-green-200' : 'border-red-200'}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                {reporte.reemo_listo
                  ? <CheckCircle2 className="h-6 w-6 text-green-500" />
                  : <XCircle className="h-6 w-6 text-red-500" />
                }
                <div>
                  <p className="font-semibold">
                    REEMO {reporte.reemo_listo ? 'Listo' : 'No listo'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {reporte.reemo_listo
                      ? 'Tu rancho cumple los requisitos para movilización de ganado.'
                      : 'Faltan requisitos para poder tramitar guías de tránsito.'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Documentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Vigentes */}
              <div>
                <h4 className="font-medium text-sm text-green-700 mb-2">Vigentes</h4>
                <div className="space-y-2">
                  {reporte.documentos_vigentes.map((doc) => (
                    <div key={doc} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      {doc}
                    </div>
                  ))}
                </div>
              </div>

              {/* Faltantes */}
              {reporte.documentos_faltantes.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-amber-700 mb-2">Pendientes</h4>
                  <div className="space-y-2">
                    {reporte.documentos_faltantes.map((doc) => (
                      <div key={doc} className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                        {doc}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

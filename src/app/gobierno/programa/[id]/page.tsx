'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Users,
  Bug,
  Syringe,
  Baby,
  DollarSign,
  MapPin,
  ArrowLeft,
  FileText,
} from 'lucide-react'
import Link from 'next/link'

/* ── Demo data: Renacer Ganadero 2026 ── */
const programa = {
  id: 'renacer-ganadero-2026',
  nombre: 'Renacer Ganadero 2026',
  descripcion:
    'Programa estatal de mejoramiento genético y productivo para el sector ganadero de Chihuahua. Busca incrementar la productividad mediante inseminación artificial, entrega de sementales de registro y capacitación técnica a productores.',
  estado: 'Activo',
  inicio: '2026-01-15',
  fin: '2026-12-31',
}

const kpis = [
  {
    label: 'Ranchos inscritos',
    valor: 25,
    meta: 50,
    icon: Users,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    formato: (v: number) => v.toString(),
  },
  {
    label: 'Cabezas registradas',
    valor: 3450,
    meta: 8000,
    icon: Bug,
    color: 'text-green-600',
    bg: 'bg-green-50',
    formato: (v: number) => v.toLocaleString(),
  },
  {
    label: 'Inseminaciones',
    valor: 34500,
    meta: 100000,
    icon: Syringe,
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    formato: (v: number) => v.toLocaleString(),
  },
  {
    label: 'Sementales entregados',
    valor: 120,
    meta: 334,
    icon: Baby,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    formato: (v: number) => v.toString(),
  },
  {
    label: 'Nacencias',
    valor: 1200,
    meta: 3000,
    icon: Baby,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    formato: (v: number) => v.toLocaleString(),
  },
  {
    label: 'Presupuesto ejercido',
    valor: 42000000,
    meta: 98000000,
    icon: DollarSign,
    color: 'text-green-600',
    bg: 'bg-green-50',
    formato: (v: number) => `$${(v / 1_000_000).toFixed(0)}M`,
  },
]

const municipios = [
  { nombre: 'Aldama', ranchos: 8, cabezas: 1200, inseminaciones: 12000, nacencias: 450, presupuesto: 12500000 },
  { nombre: 'Delicias', ranchos: 6, cabezas: 980, inseminaciones: 9500, nacencias: 320, presupuesto: 10200000 },
  { nombre: 'Camargo', ranchos: 5, cabezas: 650, inseminaciones: 7000, nacencias: 230, presupuesto: 8400000 },
  { nombre: 'Jiménez', ranchos: 4, cabezas: 420, inseminaciones: 4000, nacencias: 150, presupuesto: 6800000 },
  { nombre: 'Saucillo', ranchos: 2, cabezas: 200, inseminaciones: 2000, nacencias: 50, presupuesto: 4100000 },
]

const ranchosInscritos = [
  { id: 'r1', nombre: 'Rancho El Porvenir', municipio: 'Aldama', cabezas: 320, estado: 'Activo', cumplimiento: 92 },
  { id: 'r2', nombre: 'Rancho Los Alamos', municipio: 'Aldama', cabezas: 185, estado: 'Activo', cumplimiento: 88 },
  { id: 'r3', nombre: 'Rancho Santa Fe', municipio: 'Delicias', cabezas: 240, estado: 'Activo', cumplimiento: 95 },
  { id: 'r4', nombre: 'Rancho La Esperanza', municipio: 'Delicias', cabezas: 160, estado: 'En revisión', cumplimiento: 72 },
  { id: 'r5', nombre: 'Rancho San Pedro', municipio: 'Camargo', cabezas: 290, estado: 'Activo', cumplimiento: 85 },
  { id: 'r6', nombre: 'Rancho El Milagro', municipio: 'Camargo', cabezas: 110, estado: 'Suspendido', cumplimiento: 45 },
  { id: 'r7', nombre: 'Rancho Las Palomas', municipio: 'Jiménez', cabezas: 200, estado: 'Activo', cumplimiento: 90 },
  { id: 'r8', nombre: 'Rancho El Trébol', municipio: 'Saucillo', cabezas: 95, estado: 'Activo', cumplimiento: 78 },
]

function estadoBadge(estado: string) {
  switch (estado) {
    case 'Activo':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Activo</Badge>
    case 'En revisión':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En revisión</Badge>
    case 'Suspendido':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Suspendido</Badge>
    default:
      return <Badge variant="outline">{estado}</Badge>
  }
}

export default function ProgramaDetalle({ params }: { params: { id: string } }) {
  void params // used for routing

  return (
    <div className="space-y-6 mt-4">
      {/* Back + Header */}
      <div>
        <Link
          href="/gobierno"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold">{programa.nombre}</h2>
            <p className="text-muted-foreground text-sm max-w-2xl mt-1">{programa.descripcion}</p>
          </div>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 self-start text-sm px-3 py-1">
            {programa.estado}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Periodo: {programa.inicio} al {programa.fin}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          const pct = Math.round((kpi.valor / kpi.meta) * 100)
          return (
            <Card key={kpi.label} className={kpi.bg}>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${kpi.color}`} />
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                </div>
                <p className={`text-2xl font-bold ${kpi.color}`}>
                  {kpi.formato(kpi.valor)}
                  <span className="text-sm font-normal text-muted-foreground">
                    {' '}/ {kpi.formato(kpi.meta)}
                  </span>
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Avance</span>
                    <span className="font-medium">{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Desglose por municipio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Desglose por Municipio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Municipio</TableHead>
                <TableHead className="text-right">Ranchos</TableHead>
                <TableHead className="text-right">Cabezas</TableHead>
                <TableHead className="text-right">Inseminaciones</TableHead>
                <TableHead className="text-right">Nacencias</TableHead>
                <TableHead className="text-right">Presupuesto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {municipios.map((m) => (
                <TableRow key={m.nombre}>
                  <TableCell className="font-medium">{m.nombre}</TableCell>
                  <TableCell className="text-right">{m.ranchos}</TableCell>
                  <TableCell className="text-right">{m.cabezas.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{m.inseminaciones.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{m.nacencias.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${(m.presupuesto / 1_000_000).toFixed(1)}M</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Ranchos inscritos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Ranchos Inscritos ({ranchosInscritos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rancho</TableHead>
                <TableHead>Municipio</TableHead>
                <TableHead className="text-right">Cabezas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Cumplimiento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ranchosInscritos.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <Link
                      href={`/gobierno/ranchos/${r.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {r.nombre}
                    </Link>
                  </TableCell>
                  <TableCell>{r.municipio}</TableCell>
                  <TableCell className="text-right">{r.cabezas}</TableCell>
                  <TableCell>{estadoBadge(r.estado)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Progress value={r.cumplimiento} className="h-2 w-20" />
                      <span className="text-xs font-medium w-8 text-right">{r.cumplimiento}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Generar Reporte */}
      <div className="flex justify-end">
        <Button className="gap-2">
          <FileText className="h-4 w-4" />
          Exportar Reporte del Programa
        </Button>
      </div>
    </div>
  )
}

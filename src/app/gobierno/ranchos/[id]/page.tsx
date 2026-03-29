'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  MapPin,
  ArrowLeft,
  ShieldCheck,
  Beef,
  Activity,
  Syringe,
  Heart,
  TrendingUp,
  Eye,
  Calendar,
} from 'lucide-react'
import Link from 'next/link'

/* ── Demo data ── */
const rancho = {
  nombre: 'Rancho El Porvenir',
  propietario: 'Juan Carlos Mendoza',
  municipio: 'Aldama',
  estado: 'Chihuahua',
  coordenadas: '28.8333° N, 105.9167° O',
  hectareas: 450,
  especies: ['Bovinos', 'Porcinos'],
  programa: 'Renacer Ganadero 2026',
  fechaInscripcion: '2026-02-10',
}

const inventario = [
  { especie: 'Bovinos', total: 280, hembras: 195, machos: 55, crias: 30 },
  { especie: 'Porcinos', total: 40, hembras: 25, machos: 5, crias: 10 },
]

const actividadReciente = [
  { fecha: '2026-03-28', tipo: 'Sanitario', detalle: 'Vacunación contra brucelosis — 45 cabezas', color: 'bg-green-500' },
  { fecha: '2026-03-25', tipo: 'Reproductivo', detalle: 'Inseminación artificial — 12 vientres', color: 'bg-pink-500' },
  { fecha: '2026-03-22', tipo: 'Inventario', detalle: 'Alta de 3 becerros nacidos esta semana', color: 'bg-blue-500' },
  { fecha: '2026-03-18', tipo: 'Sanitario', detalle: 'Desparasitación interna — lote completo', color: 'bg-green-500' },
  { fecha: '2026-03-15', tipo: 'Reproductivo', detalle: 'Diagnóstico de gestación — 8 confirmadas', color: 'bg-pink-500' },
  { fecha: '2026-03-10', tipo: 'Producción', detalle: 'Pesaje mensual — promedio 420 kg', color: 'bg-amber-500' },
]

const reproductivo = {
  vientresActivos: 195,
  gestantes: 68,
  tasaConcepcion: 74,
  intervaloParto: '13.2 meses',
  inseminacionesMes: 12,
  semental: 'Toro Brahman Reg. #4521',
}

const sanidad = {
  vacunasAlDia: 92,
  ultimaVacunacion: '2026-03-28',
  proximaVacunacion: '2026-04-15',
  brucelosis: 'Negativo',
  tuberculosis: 'Negativo',
  desparasitacion: '2026-03-18',
}

const produccion = {
  pesoPromedio: '420 kg',
  gananciasDiarias: '1.2 kg/día',
  tasaMortalidad: '2.1%',
  litrosLecheDia: '—',
  becerrosDestetados: 28,
  tasaDestete: '89%',
}

export default function RanchoGobiernoDetalle({ params }: { params: { id: string } }) {
  void params

  return (
    <div className="space-y-6 mt-4">
      {/* Solo lectura badge + back */}
      <div>
        <Link
          href="/gobierno"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">{rancho.nombre}</h2>
            <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
              <MapPin className="h-4 w-4" /> {rancho.municipio}, {rancho.estado} — {rancho.hectareas} ha
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Propietario: {rancho.propietario} | Coordenadas: {rancho.coordenadas}
            </p>
            <div className="flex gap-2 mt-2">
              {rancho.especies.map((e) => (
                <Badge key={e} variant="outline">{e}</Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Inscrito en: {rancho.programa} desde {rancho.fechaInscripcion}
            </p>
          </div>

          {/* Solo lectura prominente */}
          <Badge className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-100 text-sm px-4 py-2 gap-2 self-start shrink-0">
            <Eye className="h-4 w-4" />
            Solo lectura
          </Badge>
        </div>
      </div>

      {/* Inventario por especie */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Beef className="h-5 w-5 text-green-600" />
            Inventario de Animales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Especie</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Hembras</TableHead>
                <TableHead className="text-right">Machos</TableHead>
                <TableHead className="text-right">Crías</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventario.map((inv) => (
                <TableRow key={inv.especie}>
                  <TableCell className="font-medium">{inv.especie}</TableCell>
                  <TableCell className="text-right font-bold">{inv.total}</TableCell>
                  <TableCell className="text-right">{inv.hembras}</TableCell>
                  <TableCell className="text-right">{inv.machos}</TableCell>
                  <TableCell className="text-right">{inv.crias}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-bold">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">{inventario.reduce((s, i) => s + i.total, 0)}</TableCell>
                <TableCell className="text-right">{inventario.reduce((s, i) => s + i.hembras, 0)}</TableCell>
                <TableCell className="text-right">{inventario.reduce((s, i) => s + i.machos, 0)}</TableCell>
                <TableCell className="text-right">{inventario.reduce((s, i) => s + i.crias, 0)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Actividad reciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {actividadReciente.map((a, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="flex flex-col items-center">
                  <div className={`h-3 w-3 rounded-full ${a.color} mt-1`} />
                  {i < actividadReciente.length - 1 && (
                    <div className="w-px h-full bg-gray-200 min-h-[24px]" />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {a.fecha}
                    </span>
                    <Badge variant="outline" className="text-xs">{a.tipo}</Badge>
                  </div>
                  <p className="text-sm mt-0.5">{a.detalle}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3-column grid: Reproductivo, Sanidad, Producción */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Reproductivo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Heart className="h-5 w-5 text-pink-600" />
              Estado Reproductivo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vientres activos</span>
              <span className="font-medium">{reproductivo.vientresActivos}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gestantes</span>
              <span className="font-medium">{reproductivo.gestantes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tasa de concepción</span>
              <span className="font-medium">{reproductivo.tasaConcepcion}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Intervalo entre partos</span>
              <span className="font-medium">{reproductivo.intervaloParto}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Inseminaciones este mes</span>
              <span className="font-medium">{reproductivo.inseminacionesMes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Semental principal</span>
              <span className="font-medium text-xs">{reproductivo.semental}</span>
            </div>
          </CardContent>
        </Card>

        {/* Sanidad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Syringe className="h-5 w-5 text-green-600" />
              Cumplimiento Sanitario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vacunas al día</span>
                <span className="font-medium">{sanidad.vacunasAlDia}%</span>
              </div>
              <Progress value={sanidad.vacunasAlDia} className="h-2" />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Última vacunación</span>
              <span className="font-medium">{sanidad.ultimaVacunacion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Próxima vacunación</span>
              <span className="font-medium">{sanidad.proximaVacunacion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Brucelosis</span>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">{sanidad.brucelosis}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tuberculosis</span>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">{sanidad.tuberculosis}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Desparasitación</span>
              <span className="font-medium">{sanidad.desparasitacion}</span>
            </div>
          </CardContent>
        </Card>

        {/* Producción */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-amber-600" />
              Métricas de Producción
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Peso promedio</span>
              <span className="font-medium">{produccion.pesoPromedio}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ganancia diaria</span>
              <span className="font-medium">{produccion.gananciasDiarias}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tasa de mortalidad</span>
              <span className="font-medium">{produccion.tasaMortalidad}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Litros de leche/día</span>
              <span className="font-medium">{produccion.litrosLecheDia}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Becerros destetados</span>
              <span className="font-medium">{produccion.becerrosDestetados}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tasa de destete</span>
              <span className="font-medium">{produccion.tasaDestete}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nota de solo lectura al pie */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0" />
        <p className="text-sm text-amber-800">
          Este portal es de <strong>solo lectura</strong>. Los datos son proporcionados por el
          productor a través de la plataforma HatoAI y no pueden ser editados desde este panel de
          gobierno.
        </p>
      </div>
    </div>
  )
}

'use client'

import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
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
  AlertTriangle,
  MapPin,
  FileText,
  Download,
} from 'lucide-react'
import Link from 'next/link'
import { exportToCSV } from '@/lib/utils/export-csv'

const CoverageMap = dynamic(
  () => import('@/components/gobierno/coverage-map').then(mod => ({ default: mod.CoverageMap })),
  { ssr: false, loading: () => <div className="h-[450px] bg-muted rounded-lg animate-pulse" /> }
)

/* ── Formateador es-MX ── */
const fmtNum = (n: number) => n.toLocaleString('es-MX')
const fmtMoney = (n: number) => `$${n.toLocaleString('es-MX')}`

/* ── KPI data per species tab ── */
type KpiData = {
  label: string
  valor: string
  valorNum?: number
  meta: string | null
  icon: typeof Users
  color: string
  bg: string
}

type MunicipioData = {
  nombre: string
  ranchos: number
  cabezas: number
  inseminaciones: number
  nacencias: number
  programaId: string
}

type TabData = {
  kpis: KpiData[]
  municipios: MunicipioData[]
  progreso: { label: string; valor: number }[]
}

const tabsData: Record<string, TabData> = {
  todos: {
    kpis: [
      { label: 'Ranchos activos', valor: '25', meta: '50', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Cabezas registradas', valor: fmtNum(3450), valorNum: 3450, meta: null, icon: Bug, color: 'text-green-600', bg: 'bg-green-50' },
      { label: 'Inseminaciones', valor: fmtNum(34500), valorNum: 34500, meta: fmtNum(100000), icon: Syringe, color: 'text-pink-600', bg: 'bg-pink-50' },
      { label: 'Sementales entregados', valor: '120', meta: '334', icon: Baby, color: 'text-purple-600', bg: 'bg-purple-50' },
      { label: 'Nacencias', valor: fmtNum(1200), valorNum: 1200, meta: null, icon: Baby, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'Inversi\u00f3n ejercida', valor: fmtMoney(42000000), valorNum: 42000000, meta: fmtMoney(98000000), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    ],
    municipios: [
      { nombre: 'Aldama', ranchos: 8, cabezas: 1200, inseminaciones: 12000, nacencias: 450, programaId: 'renacer-ganadero-2026' },
      { nombre: 'Delicias', ranchos: 6, cabezas: 980, inseminaciones: 9500, nacencias: 320, programaId: 'renacer-ganadero-2026' },
      { nombre: 'Camargo', ranchos: 5, cabezas: 650, inseminaciones: 7000, nacencias: 230, programaId: 'renacer-ganadero-2026' },
      { nombre: 'Jim\u00e9nez', ranchos: 4, cabezas: 420, inseminaciones: 4000, nacencias: 150, programaId: 'renacer-ganadero-2026' },
      { nombre: 'Saucillo', ranchos: 2, cabezas: 200, inseminaciones: 2000, nacencias: 50, programaId: 'renacer-ganadero-2026' },
    ],
    progreso: [
      { label: 'Ranchos activados', valor: 50 },
      { label: 'Meta de inseminaciones', valor: 34.5 },
      { label: 'Presupuesto ejercido', valor: 42.8 },
    ],
  },
  bovinos: {
    kpis: [
      { label: 'Ranchos activos', valor: '22', meta: '45', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Cabezas registradas', valor: fmtNum(2890), valorNum: 2890, meta: null, icon: Bug, color: 'text-green-600', bg: 'bg-green-50' },
      { label: 'Inseminaciones', valor: fmtNum(31200), valorNum: 31200, meta: fmtNum(90000), icon: Syringe, color: 'text-pink-600', bg: 'bg-pink-50' },
      { label: 'Sementales entregados', valor: '98', meta: '280', icon: Baby, color: 'text-purple-600', bg: 'bg-purple-50' },
      { label: 'Nacencias', valor: '980', meta: null, icon: Baby, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'Inversi\u00f3n ejercida', valor: fmtMoney(35000000), valorNum: 35000000, meta: fmtMoney(80000000), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    ],
    municipios: [
      { nombre: 'Aldama', ranchos: 7, cabezas: 1050, inseminaciones: 11000, nacencias: 400, programaId: 'renacer-ganadero-2026' },
      { nombre: 'Delicias', ranchos: 5, cabezas: 820, inseminaciones: 8500, nacencias: 280, programaId: 'renacer-ganadero-2026' },
      { nombre: 'Camargo', ranchos: 5, cabezas: 540, inseminaciones: 6200, nacencias: 165, programaId: 'renacer-ganadero-2026' },
      { nombre: 'Jim\u00e9nez', ranchos: 3, cabezas: 320, inseminaciones: 3500, nacencias: 95, programaId: 'renacer-ganadero-2026' },
      { nombre: 'Saucillo', ranchos: 2, cabezas: 160, inseminaciones: 2000, nacencias: 40, programaId: 'renacer-ganadero-2026' },
    ],
    progreso: [
      { label: 'Ranchos activados', valor: 48.9 },
      { label: 'Meta de inseminaciones', valor: 34.7 },
      { label: 'Presupuesto ejercido', valor: 43.8 },
    ],
  },
  porcinos: {
    kpis: [
      { label: 'Ranchos activos', valor: '8', meta: '15', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Cabezas registradas', valor: '320', meta: null, icon: Bug, color: 'text-green-600', bg: 'bg-green-50' },
      { label: 'Inseminaciones', valor: fmtNum(1800), valorNum: 1800, meta: fmtNum(5000), icon: Syringe, color: 'text-pink-600', bg: 'bg-pink-50' },
      { label: 'Sementales entregados', valor: '12', meta: '30', icon: Baby, color: 'text-purple-600', bg: 'bg-purple-50' },
      { label: 'Nacencias', valor: '145', meta: null, icon: Baby, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'Inversi\u00f3n ejercida', valor: fmtMoney(4000000), valorNum: 4000000, meta: fmtMoney(10000000), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    ],
    municipios: [
      { nombre: 'Delicias', ranchos: 3, cabezas: 140, inseminaciones: 800, nacencias: 65, programaId: 'renacer-ganadero-2026' },
      { nombre: 'Camargo', ranchos: 3, cabezas: 100, inseminaciones: 600, nacencias: 45, programaId: 'renacer-ganadero-2026' },
      { nombre: 'Aldama', ranchos: 2, cabezas: 80, inseminaciones: 400, nacencias: 35, programaId: 'renacer-ganadero-2026' },
    ],
    progreso: [
      { label: 'Ranchos activados', valor: 53.3 },
      { label: 'Meta de inseminaciones', valor: 36 },
      { label: 'Presupuesto ejercido', valor: 40 },
    ],
  },
  ovinos: {
    kpis: [
      { label: 'Ranchos activos', valor: '4', meta: '10', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Cabezas registradas', valor: '180', meta: null, icon: Bug, color: 'text-green-600', bg: 'bg-green-50' },
      { label: 'Inseminaciones', valor: '900', meta: fmtNum(3000), icon: Syringe, color: 'text-pink-600', bg: 'bg-pink-50' },
      { label: 'Sementales entregados', valor: '8', meta: '20', icon: Baby, color: 'text-purple-600', bg: 'bg-purple-50' },
      { label: 'Nacencias', valor: '55', meta: null, icon: Baby, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'Inversi\u00f3n ejercida', valor: fmtMoney(2000000), valorNum: 2000000, meta: fmtMoney(5000000), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    ],
    municipios: [
      { nombre: 'Jim\u00e9nez', ranchos: 2, cabezas: 90, inseminaciones: 450, nacencias: 30, programaId: 'renacer-ganadero-2026' },
      { nombre: 'Aldama', ranchos: 2, cabezas: 90, inseminaciones: 450, nacencias: 25, programaId: 'renacer-ganadero-2026' },
    ],
    progreso: [
      { label: 'Ranchos activados', valor: 40 },
      { label: 'Meta de inseminaciones', valor: 30 },
      { label: 'Presupuesto ejercido', valor: 40 },
    ],
  },
  aves: {
    kpis: [
      { label: 'Ranchos activos', valor: '3', meta: '8', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Cabezas registradas', valor: fmtNum(1200), valorNum: 1200, meta: null, icon: Bug, color: 'text-green-600', bg: 'bg-green-50' },
      { label: 'Inseminaciones', valor: '\u2014', meta: null, icon: Syringe, color: 'text-pink-600', bg: 'bg-pink-50' },
      { label: 'Sementales entregados', valor: '\u2014', meta: null, icon: Baby, color: 'text-purple-600', bg: 'bg-purple-50' },
      { label: 'Nacencias', valor: '350', meta: null, icon: Baby, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'Inversi\u00f3n ejercida', valor: fmtMoney(800000), valorNum: 800000, meta: fmtMoney(2000000), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    ],
    municipios: [
      { nombre: 'Delicias', ranchos: 2, cabezas: 800, inseminaciones: 0, nacencias: 250, programaId: 'renacer-ganadero-2026' },
      { nombre: 'Saucillo', ranchos: 1, cabezas: 400, inseminaciones: 0, nacencias: 100, programaId: 'renacer-ganadero-2026' },
    ],
    progreso: [
      { label: 'Ranchos activados', valor: 37.5 },
      { label: 'Meta de producci\u00f3n', valor: 28 },
      { label: 'Presupuesto ejercido', valor: 40 },
    ],
  },
  abejas: {
    kpis: [
      { label: 'Ranchos activos', valor: '2', meta: '5', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Colmenas registradas', valor: '85', meta: null, icon: Bug, color: 'text-green-600', bg: 'bg-green-50' },
      { label: 'Inseminaciones', valor: '\u2014', meta: null, icon: Syringe, color: 'text-pink-600', bg: 'bg-pink-50' },
      { label: 'Reinas entregadas', valor: '15', meta: '40', icon: Baby, color: 'text-purple-600', bg: 'bg-purple-50' },
      { label: 'Nuevas colmenas', valor: '12', meta: null, icon: Baby, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'Inversi\u00f3n ejercida', valor: fmtMoney(200000), valorNum: 200000, meta: fmtMoney(1000000), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    ],
    municipios: [
      { nombre: 'Camargo', ranchos: 1, cabezas: 50, inseminaciones: 0, nacencias: 8, programaId: 'renacer-ganadero-2026' },
      { nombre: 'Aldama', ranchos: 1, cabezas: 35, inseminaciones: 0, nacencias: 4, programaId: 'renacer-ganadero-2026' },
    ],
    progreso: [
      { label: 'Ranchos activados', valor: 40 },
      { label: 'Meta de reinas', valor: 37.5 },
      { label: 'Presupuesto ejercido', valor: 20 },
    ],
  },
}

const alertas = [
  { tipo: 'warning', mensaje: 'El municipio de Saucillo tiene baja participaci\u00f3n (4% de ranchos)' },
  { tipo: 'info', mensaje: 'Meta de inseminaciones al 34.5% \u2014 se requiere acelerar el programa' },
  { tipo: 'warning', mensaje: 'Inversi\u00f3n ejercida al 42.8% con 75% del a\u00f1o transcurrido' },
]

const speciesTabs = [
  { value: 'todos', label: 'Todos' },
  { value: 'bovinos', label: 'Bovinos' },
  { value: 'porcinos', label: 'Porcinos' },
  { value: 'ovinos', label: 'Ovinos' },
  { value: 'aves', label: 'Aves' },
  { value: 'abejas', label: 'Abejas' },
]

function handleExportExcel() {
  const data = tabsData.todos.municipios.map((m) => ({
    Municipio: m.nombre,
    Ranchos: m.ranchos,
    Cabezas: m.cabezas,
    Inseminaciones: m.inseminaciones,
    Nacencias: m.nacencias,
  }))
  exportToCSV(data, 'gobierno_municipios')
}

function TabContent({ data }: { data: TabData }) {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {data.kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.label} className={kpi.bg}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-5 w-5 ${kpi.color}`} />
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                </div>
                <p className={`text-2xl font-bold ${kpi.color}`}>
                  {kpi.valor}
                  {kpi.meta && (
                    <span className="text-sm font-normal text-muted-foreground">
                      {' '}/ {kpi.meta}
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Progreso del programa */}
      <Card>
        <CardHeader>
          <CardTitle>Progreso General del Programa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.progreso.map((p) => (
            <div key={p.label} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{p.label}</span>
                <span className="font-bold">{p.valor}%</span>
              </div>
              <Progress value={p.valor} className="h-3" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tabla de municipios -- clickable */}
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.municipios.map((m) => (
                <TableRow key={m.nombre} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <Link
                      href={`/gobierno/programa/${m.programaId}`}
                      className="text-blue-600 hover:underline"
                    >
                      {m.nombre}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">{fmtNum(m.ranchos)}</TableCell>
                  <TableCell className="text-right">{fmtNum(m.cabezas)}</TableCell>
                  <TableCell className="text-right">{fmtNum(m.inseminaciones)}</TableCell>
                  <TableCell className="text-right">{fmtNum(m.nacencias)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default function GobiernoDashboard() {
  return (
    <div className="space-y-6 mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Dashboard del Programa Ganadero</h2>
          <p className="text-muted-foreground">
            Monitoreo en tiempo real de indicadores del programa estatal
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExportExcel}>
            <Download className="h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* Species Tabs */}
      <Tabs defaultValue="todos">
        <TabsList className="flex flex-wrap h-auto gap-1">
          {speciesTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {speciesTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <TabContent data={tabsData[tab.value]} />
          </TabsContent>
        ))}
      </Tabs>

      {/* Mapa de Cobertura */}
      <CoverageMap />

      {/* Alertas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Alertas del Programa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alertas.map((alerta, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                alerta.tipo === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'
              }`}
            >
              <AlertTriangle
                className={`h-5 w-5 shrink-0 ${
                  alerta.tipo === 'warning' ? 'text-amber-500' : 'text-blue-500'
                }`}
              />
              <p className="text-sm">{alerta.mensaje}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Generar Reporte CONEVAL */}
      <div className="flex justify-end">
        <Link href="/gobierno/coneval">
          <Button className="gap-2" size="lg">
            <FileText className="h-5 w-5" />
            Generar Reporte CONEVAL
          </Button>
        </Link>
      </div>
    </div>
  )
}

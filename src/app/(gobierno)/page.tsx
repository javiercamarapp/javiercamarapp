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
  Users,
  Bug,
  Syringe,
  Baby,
  DollarSign,
  AlertTriangle,
  MapPin,
} from 'lucide-react'

const kpis = [
  { label: 'Ranchos activos', valor: '25', meta: '50', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Cabezas registradas', valor: '3,450', meta: null, icon: Bug, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Inseminaciones', valor: '34,500', meta: '100,000', icon: Syringe, color: 'text-pink-600', bg: 'bg-pink-50' },
  { label: 'Sementales entregados', valor: '120', meta: '334', icon: Baby, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Nacencias', valor: '1,200', meta: null, icon: Baby, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Inversión ejercida', valor: '$42M', meta: '$98M', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
]

const municipios = [
  { nombre: 'Aldama', ranchos: 8, cabezas: 1200, inseminaciones: 12000, nacencias: 450 },
  { nombre: 'Delicias', ranchos: 6, cabezas: 980, inseminaciones: 9500, nacencias: 320 },
  { nombre: 'Camargo', ranchos: 5, cabezas: 650, inseminaciones: 7000, nacencias: 230 },
  { nombre: 'Jiménez', ranchos: 4, cabezas: 420, inseminaciones: 4000, nacencias: 150 },
  { nombre: 'Saucillo', ranchos: 2, cabezas: 200, inseminaciones: 2000, nacencias: 50 },
]

const alertas = [
  { tipo: 'warning', mensaje: 'El municipio de Saucillo tiene baja participación (4% de ranchos)' },
  { tipo: 'info', mensaje: 'Meta de inseminaciones al 34.5% — se requiere acelerar el programa' },
  { tipo: 'warning', mensaje: 'Inversión ejercida al 42.8% con 75% del año transcurrido' },
]

export default function GobiernoDashboard() {
  return (
    <div className="space-y-6 mt-4">
      <div>
        <h2 className="text-2xl font-bold">Dashboard del Programa Ganadero</h2>
        <p className="text-muted-foreground">
          Monitoreo en tiempo real de indicadores del programa estatal
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => {
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
                      {' '}
                      / {kpi.meta}
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
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Ranchos activados</span>
              <span className="font-bold">50%</span>
            </div>
            <Progress value={50} className="h-3" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Meta de inseminaciones</span>
              <span className="font-bold">34.5%</span>
            </div>
            <Progress value={34.5} className="h-3" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Presupuesto ejercido</span>
              <span className="font-bold">42.8%</span>
            </div>
            <Progress value={42.8} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Tabla de municipios */}
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
                <TableHead>Ranchos</TableHead>
                <TableHead>Cabezas</TableHead>
                <TableHead>Inseminaciones</TableHead>
                <TableHead>Nacencias</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {municipios.map((m) => (
                <TableRow key={m.nombre}>
                  <TableCell className="font-medium">{m.nombre}</TableCell>
                  <TableCell>{m.ranchos}</TableCell>
                  <TableCell>{m.cabezas.toLocaleString()}</TableCell>
                  <TableCell>{m.inseminaciones.toLocaleString()}</TableCell>
                  <TableCell>{m.nacencias.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DollarSign, TrendingUp, TrendingDown, Landmark, Wallet } from 'lucide-react'

const kpis = [
  {
    label: 'Ingresos del mes',
    valor: '$45,000 MXN',
    icon: TrendingUp,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    label: 'Egresos del mes',
    valor: '$28,000 MXN',
    icon: TrendingDown,
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
  {
    label: 'Utilidad',
    valor: '$17,000 MXN',
    icon: Wallet,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    label: 'Valor del hato',
    valor: '$1,200,000 MXN',
    icon: Landmark,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
]

const movimientos = [
  { fecha: '28 mar 2026', tipo: 'Ingreso', categoria: 'Venta de leche', monto: '$12,500', descripcion: '500L a $25/L' },
  { fecha: '27 mar 2026', tipo: 'Egreso', categoria: 'Alimentación', monto: '$4,200', descripcion: 'Compra de alfalfa 1 ton' },
  { fecha: '25 mar 2026', tipo: 'Ingreso', categoria: 'Venta de becerro', monto: '$18,000', descripcion: 'Becerro BC-009, 220kg' },
  { fecha: '24 mar 2026', tipo: 'Egreso', categoria: 'Sanidad', monto: '$1,800', descripcion: 'Vacunas y desparasitante' },
  { fecha: '22 mar 2026', tipo: 'Egreso', categoria: 'Mano de obra', monto: '$3,500', descripcion: 'Pago semanal vaquero' },
  { fecha: '20 mar 2026', tipo: 'Ingreso', categoria: 'Venta de queso', monto: '$8,500', descripcion: '85kg queso fresco' },
]

export default function EconomicoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Económico</h1>
        <p className="text-muted-foreground">
          Resumen financiero y movimientos del rancho
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.label} className={kpi.bg}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-5 w-5 ${kpi.color}`} />
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                </div>
                <p className={`text-xl font-bold ${kpi.color}`}>{kpi.valor}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Movimientos Recientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Movimientos Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Descripción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movimientos.map((m, i) => (
                <TableRow key={i}>
                  <TableCell>{m.fecha}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        m.tipo === 'Ingreso'
                          ? 'bg-green-100 text-green-700 hover:bg-green-100'
                          : 'bg-red-100 text-red-700 hover:bg-red-100'
                      }
                    >
                      {m.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>{m.categoria}</TableCell>
                  <TableCell className="font-medium">{m.monto}</TableCell>
                  <TableCell className="text-muted-foreground">{m.descripcion}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

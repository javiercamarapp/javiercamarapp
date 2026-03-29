import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Wheat, UtensilsCrossed } from 'lucide-react'

const inventario = [
  { nombre: 'Maíz molido', tipo: 'Grano', cantidad_actual_kg: 2500, costo_por_kg: 5.80 },
  { nombre: 'Pasta de soya', tipo: 'Proteína', cantidad_actual_kg: 800, costo_por_kg: 12.50 },
  { nombre: 'Heno de alfalfa', tipo: 'Forraje', cantidad_actual_kg: 3200, costo_por_kg: 4.20 },
  { nombre: 'Sorgo', tipo: 'Grano', cantidad_actual_kg: 1800, costo_por_kg: 4.50 },
  { nombre: 'Sales minerales', tipo: 'Suplemento', cantidad_actual_kg: 150, costo_por_kg: 28.00 },
  { nombre: 'Melaza', tipo: 'Energético', cantidad_actual_kg: 500, costo_por_kg: 3.50 },
]

const consumoReciente = [
  { corral: 'Corral 1 - Vacas lactantes', alimento: 'Heno de alfalfa', cantidad_kg: 120, fecha: '29 mar 2026' },
  { corral: 'Corral 1 - Vacas lactantes', alimento: 'Maíz molido', cantidad_kg: 45, fecha: '29 mar 2026' },
  { corral: 'Corral 2 - Becerros', alimento: 'Maíz molido', cantidad_kg: 30, fecha: '29 mar 2026' },
  { corral: 'Corral 3 - Engorda', alimento: 'Sorgo', cantidad_kg: 80, fecha: '28 mar 2026' },
  { corral: 'Corral 3 - Engorda', alimento: 'Pasta de soya', cantidad_kg: 25, fecha: '28 mar 2026' },
]

export default function AlimentacionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Alimentación</h1>
        <p className="text-muted-foreground">
          Inventario de alimentos y registro de consumo
        </p>
      </div>

      {/* Inventario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wheat className="h-5 w-5 text-amber-500" />
            Inventario de Alimentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cantidad Actual (kg)</TableHead>
                <TableHead>Costo/kg (MXN)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventario.map((item) => (
                <TableRow key={item.nombre}>
                  <TableCell className="font-medium">{item.nombre}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.tipo}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={item.cantidad_actual_kg < 200 ? 'text-red-600 font-bold' : ''}>
                      {item.cantidad_actual_kg.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>${item.costo_por_kg.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Consumo Reciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-green-600" />
            Consumo Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Corral</TableHead>
                <TableHead>Alimento</TableHead>
                <TableHead>Cantidad (kg)</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consumoReciente.map((item, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{item.corral}</TableCell>
                  <TableCell>{item.alimento}</TableCell>
                  <TableCell>{item.cantidad_kg}</TableCell>
                  <TableCell>{item.fecha}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Scale, BarChart3, Rows3 } from 'lucide-react'

const pesajesRecientes = [
  { animal: 'Toro BR-001', peso: 520, fecha: '28 mar 2026', gdp: '1.2 kg/día' },
  { animal: 'Vaca La Negra', peso: 430, fecha: '28 mar 2026', gdp: '0.8 kg/día' },
  { animal: 'Becerro BC-012', peso: 180, fecha: '27 mar 2026', gdp: '1.5 kg/día' },
  { animal: 'Vaca La Pinta', peso: 410, fecha: '27 mar 2026', gdp: '0.6 kg/día' },
  { animal: 'Becerro BC-015', peso: 165, fecha: '26 mar 2026', gdp: '1.3 kg/día' },
]

export default function PesajesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pesajes</h1>
          <p className="text-muted-foreground">
            Registro de pesos y ganancia diaria de peso
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Rows3 className="h-4 w-4 mr-2" />
          Modo Manga
        </Button>
      </div>

      {/* Pesajes Recientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-green-600" />
            Pesajes Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Animal</TableHead>
                <TableHead>Peso (kg)</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>GDP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pesajesRecientes.map((p) => (
                <TableRow key={p.animal}>
                  <TableCell className="font-medium">{p.animal}</TableCell>
                  <TableCell>{p.peso} kg</TableCell>
                  <TableCell>{p.fecha}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{p.gdp}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Gráfica de tendencia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            Tendencia de Peso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-muted-foreground font-medium">
                Gráfica de tendencia de peso
              </p>
              <p className="text-sm text-muted-foreground">
                Aquí se mostrará la evolución de pesos del hato
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

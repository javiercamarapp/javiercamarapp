'use client'

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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const pesajesRecientes = [
  { animal: 'Toro BR-001', peso: 520, fecha: '28 mar 2026', gdp: '1.2 kg/día' },
  { animal: 'Vaca La Negra', peso: 430, fecha: '28 mar 2026', gdp: '0.8 kg/día' },
  { animal: 'Becerro BC-012', peso: 180, fecha: '27 mar 2026', gdp: '1.5 kg/día' },
  { animal: 'Vaca La Pinta', peso: 410, fecha: '27 mar 2026', gdp: '0.6 kg/día' },
  { animal: 'Becerro BC-015', peso: 165, fecha: '26 mar 2026', gdp: '1.3 kg/día' },
]

const weightData = [
  { fecha: '01 Ene', peso: 380 },
  { fecha: '15 Ene', peso: 398 },
  { fecha: '01 Feb', peso: 415 },
  { fecha: '15 Feb', peso: 428 },
  { fecha: '01 Mar', peso: 440 },
  { fecha: '15 Mar', peso: 450 },
  { fecha: '29 Mar', peso: 462 },
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
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weightData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis domain={['dataMin - 20', 'dataMax + 20']} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="peso"
                stroke="#1B6B3C"
                strokeWidth={2}
                dot={{ fill: '#1B6B3C', r: 4 }}
                activeDot={{ r: 6 }}
                name="Peso (kg)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

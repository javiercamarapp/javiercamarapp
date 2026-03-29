'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Milk, Egg, Flower2 } from 'lucide-react'

const lecheData = [
  { vaca: 'Vaca La Negra', litros_am: 8.5, litros_pm: 7.2, total: 15.7, fecha: '29 mar 2026' },
  { vaca: 'Vaca La Pinta', litros_am: 9.0, litros_pm: 8.1, total: 17.1, fecha: '29 mar 2026' },
  { vaca: 'Vaca Estrella', litros_am: 7.3, litros_pm: 6.8, total: 14.1, fecha: '29 mar 2026' },
  { vaca: 'Vaca Mariposa', litros_am: 10.2, litros_pm: 9.5, total: 19.7, fecha: '28 mar 2026' },
]

const huevosData = [
  { lote: 'Lote A-01', huevos_totales: 320, rotos: 5, vendibles: 315, fecha: '29 mar 2026' },
  { lote: 'Lote A-02', huevos_totales: 280, rotos: 8, vendibles: 272, fecha: '29 mar 2026' },
  { lote: 'Lote B-01', huevos_totales: 195, rotos: 3, vendibles: 192, fecha: '28 mar 2026' },
]

const mielData = [
  { apiario: 'Apiario Norte', colmena: 'C-001', kg_miel: 12.5, tipo_floral: 'Multifloral', fecha: '25 mar 2026' },
  { apiario: 'Apiario Norte', colmena: 'C-002', kg_miel: 10.8, tipo_floral: 'Azahar', fecha: '25 mar 2026' },
  { apiario: 'Apiario Sur', colmena: 'C-010', kg_miel: 15.2, tipo_floral: 'Tajonal', fecha: '24 mar 2026' },
]

export default function ProduccionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Producción</h1>
        <p className="text-muted-foreground">
          Registro de producción por tipo: leche, huevos y miel
        </p>
      </div>

      <Tabs defaultValue="leche" className="w-full">
        <TabsList>
          <TabsTrigger value="leche" className="gap-1">
            <Milk className="h-4 w-4" />
            Leche
          </TabsTrigger>
          <TabsTrigger value="huevos" className="gap-1">
            <Egg className="h-4 w-4" />
            Huevos
          </TabsTrigger>
          <TabsTrigger value="miel" className="gap-1">
            <Flower2 className="h-4 w-4" />
            Miel
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leche">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Milk className="h-5 w-5 text-blue-500" />
                Producción de Leche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vaca</TableHead>
                    <TableHead>Litros AM</TableHead>
                    <TableHead>Litros PM</TableHead>
                    <TableHead>Total (L)</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lecheData.map((row) => (
                    <TableRow key={`${row.vaca}-${row.fecha}`}>
                      <TableCell className="font-medium">{row.vaca}</TableCell>
                      <TableCell>{row.litros_am}</TableCell>
                      <TableCell>{row.litros_pm}</TableCell>
                      <TableCell className="font-bold">{row.total}</TableCell>
                      <TableCell>{row.fecha}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="huevos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Egg className="h-5 w-5 text-amber-500" />
                Producción de Huevos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lote</TableHead>
                    <TableHead>Huevos Totales</TableHead>
                    <TableHead>Rotos</TableHead>
                    <TableHead>Vendibles</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {huevosData.map((row) => (
                    <TableRow key={`${row.lote}-${row.fecha}`}>
                      <TableCell className="font-medium">{row.lote}</TableCell>
                      <TableCell>{row.huevos_totales}</TableCell>
                      <TableCell className="text-red-500">{row.rotos}</TableCell>
                      <TableCell className="font-bold">{row.vendibles}</TableCell>
                      <TableCell>{row.fecha}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="miel">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flower2 className="h-5 w-5 text-yellow-500" />
                Producción de Miel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Apiario</TableHead>
                    <TableHead>Colmena</TableHead>
                    <TableHead>Kg Miel</TableHead>
                    <TableHead>Tipo Floral</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mielData.map((row) => (
                    <TableRow key={`${row.colmena}-${row.fecha}`}>
                      <TableCell>{row.apiario}</TableCell>
                      <TableCell className="font-medium">{row.colmena}</TableCell>
                      <TableCell className="font-bold">{row.kg_miel}</TableCell>
                      <TableCell>{row.tipo_floral}</TableCell>
                      <TableCell>{row.fecha}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

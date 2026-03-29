'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  Edit,
  CalendarPlus,
  Weight,
  Heart,
  Syringe,
  DollarSign,
  Info,
} from 'lucide-react'
import Link from 'next/link'
import { SPECIES_CONFIG, type SpeciesKey } from '@/lib/species/config'

// Demo animal data
const DEMO_ANIMAL = {
  id: '1',
  nombre: 'La Negra',
  numero_arete: '484-0-2601234001',
  especie: 'bovino' as SpeciesKey,
  raza: 'Brahman',
  sexo: 'hembra',
  categoria: 'vaca',
  estado: 'activo',
  estado_reproductivo: 'gestante',
  peso_actual: 450,
  fecha_nacimiento: '2021-03-15',
  tipo_produccion: 'doble_proposito',
  origen: 'nacido_rancho',
  corral: 'Potrero Norte',
  notas: 'Vaca con excelente temperamento. Buena produccion de leche.',
  condicion_corporal: 7,
  padre_arete: '484-0-2601234010',
  madre_arete: '484-0-2601234008',
}

const DEMO_REPRO = [
  { fecha: '2025-12-10', evento: 'Monta natural', detalle: 'Toro: El Patron (484-0-2601234002)', resultado: 'Confirmada gestante' },
  { fecha: '2025-06-01', evento: 'Parto', detalle: 'Cria: becerro macho, 32 kg', resultado: 'Sin complicaciones' },
  { fecha: '2024-08-20', evento: 'Inseminacion artificial', detalle: 'Semen: Brahman registrado #4521', resultado: 'Gestante confirmada' },
]

const DEMO_PESAJES = [
  { fecha: '2026-03-01', peso: 450, gdp: 0.45, condicion_corporal: 7 },
  { fecha: '2026-01-15', peso: 430, gdp: 0.50, condicion_corporal: 6.5 },
  { fecha: '2025-11-01', peso: 410, gdp: 0.42, condicion_corporal: 6 },
  { fecha: '2025-08-20', peso: 395, gdp: 0.48, condicion_corporal: 6 },
]

const DEMO_SANIDAD = [
  { fecha: '2026-02-15', tipo: 'Vacuna', descripcion: 'Clostridiosis', producto: 'Ultrabac 8', dosis: '5 ml', via: 'Subcutanea', proximo: '2026-08-15' },
  { fecha: '2026-01-10', tipo: 'Desparasitacion', descripcion: 'Desparasitacion interna', producto: 'Ivermectina 1%', dosis: '10 ml', via: 'Subcutanea', proximo: '2026-07-10' },
  { fecha: '2025-11-20', tipo: 'Vacuna', descripcion: 'Rabia', producto: 'Rabiguard', dosis: '2 ml', via: 'Intramuscular', proximo: '2026-11-20' },
]

const DEMO_ECONOMICO = [
  { fecha: '2026-02-15', concepto: 'Vacuna Clostridiosis', tipo: 'gasto', monto: 85 },
  { fecha: '2026-01-10', concepto: 'Desparasitacion', tipo: 'gasto', monto: 120 },
  { fecha: '2025-12-01', concepto: 'Venta de leche (mes)', tipo: 'ingreso', monto: 2400 },
  { fecha: '2025-11-20', concepto: 'Vacuna Rabia', tipo: 'gasto', monto: 65 },
  { fecha: '2025-11-01', concepto: 'Venta de leche (mes)', tipo: 'ingreso', monto: 2200 },
]

const estadoColors: Record<string, string> = {
  activo: 'bg-green-100 text-green-800',
  vendido: 'bg-blue-100 text-blue-800',
  muerto: 'bg-red-100 text-red-800',
  descartado: 'bg-gray-100 text-gray-800',
}

const reproColors: Record<string, string> = {
  gestante: 'bg-purple-100 text-purple-800',
  lactando: 'bg-blue-100 text-blue-800',
  vacia: 'bg-yellow-100 text-yellow-800',
  semental: 'bg-indigo-100 text-indigo-800',
}

export default function AnimalDetailPage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState('general')

  // In real app, fetch by params.id
  const animal = DEMO_ANIMAL
  const speciesConfig = SPECIES_CONFIG[animal.especie]

  const edadAnios = Math.floor(
    (new Date().getTime() - new Date(animal.fecha_nacimiento).getTime()) /
      (365.25 * 24 * 60 * 60 * 1000)
  )
  const edadMeses =
    Math.floor(
      (new Date().getTime() - new Date(animal.fecha_nacimiento).getTime()) /
        (30.44 * 24 * 60 * 60 * 1000)
    ) % 12

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/inventario">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
              style={{ backgroundColor: speciesConfig.color + '20' }}
            >
              {speciesConfig.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">
                  {animal.nombre || animal.numero_arete}
                </h1>
                <Badge variant="outline" className={estadoColors[animal.estado]}>
                  {animal.estado}
                </Badge>
                {animal.estado_reproductivo && (
                  <Badge variant="outline" className={reproColors[animal.estado_reproductivo]}>
                    {animal.estado_reproductivo}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {animal.numero_arete} · {animal.raza} · {animal.categoria}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-1" />
          Editar
        </Button>
        <Button size="sm">
          <CalendarPlus className="w-4 h-4 mr-1" />
          Registrar evento
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full overflow-x-auto flex-nowrap justify-start">
          <TabsTrigger value="general">
            <Info className="w-4 h-4 mr-1" />
            General
          </TabsTrigger>
          <TabsTrigger value="reproduccion">
            <Heart className="w-4 h-4 mr-1" />
            Reproduccion
          </TabsTrigger>
          <TabsTrigger value="pesajes">
            <Weight className="w-4 h-4 mr-1" />
            Pesajes
          </TabsTrigger>
          <TabsTrigger value="sanidad">
            <Syringe className="w-4 h-4 mr-1" />
            Sanidad
          </TabsTrigger>
          <TabsTrigger value="economico">
            <DollarSign className="w-4 h-4 mr-1" />
            Economico
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Datos generales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Especie</p>
                  <p className="font-medium">{speciesConfig.emoji} {speciesConfig.nombre}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Raza</p>
                  <p className="font-medium">{animal.raza}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sexo</p>
                  <p className="font-medium capitalize">{animal.sexo}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Categoria</p>
                  <p className="font-medium capitalize">{animal.categoria}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Fecha de nacimiento</p>
                  <p className="font-medium">{animal.fecha_nacimiento}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Edad</p>
                  <p className="font-medium">{edadAnios} anios, {edadMeses} meses</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tipo de produccion</p>
                  <p className="font-medium capitalize">{animal.tipo_produccion.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Origen</p>
                  <p className="font-medium capitalize">{animal.origen.replace(/_/g, ' ')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Ubicacion y peso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Corral / Potrero</p>
                  <p className="font-medium">{animal.corral}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Peso actual</p>
                  <p className="font-medium">{animal.peso_actual} kg</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Condicion corporal</p>
                  <p className="font-medium">{animal.condicion_corporal} / {speciesConfig.condicion_corporal.max}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Genealogia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Padre (arete)</p>
                  <p className="font-medium">{animal.padre_arete}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Madre (arete)</p>
                  <p className="font-medium">{animal.madre_arete}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {animal.notas && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Notas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{animal.notas}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Reproduccion Tab */}
        <TabsContent value="reproduccion" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Estado reproductivo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Estado</p>
                  <Badge variant="outline" className={reproColors[animal.estado_reproductivo || '']}>
                    {animal.estado_reproductivo || 'N/A'}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Dias de gestacion (especie)</p>
                  <p className="font-medium">{speciesConfig.gestacion_dias} dias</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Historial reproductivo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DEMO_REPRO.map((evento, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{evento.evento}</p>
                      <span className="text-xs text-muted-foreground">{evento.fecha}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{evento.detalle}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {evento.resultado}
                    </Badge>
                    {i < DEMO_REPRO.length - 1 && <Separator className="mt-3" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pesajes Tab */}
        <TabsContent value="pesajes" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Resumen de peso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{animal.peso_actual}</p>
                  <p className="text-xs text-muted-foreground">Peso actual (kg)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">0.45</p>
                  <p className="text-xs text-muted-foreground">GDP (kg/dia)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{DEMO_PESAJES.length}</p>
                  <p className="text-xs text-muted-foreground">Pesajes totales</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Historial de pesajes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {DEMO_PESAJES.map((pesaje, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{pesaje.peso} kg</p>
                        <p className="text-xs text-muted-foreground">
                          GDP: {pesaje.gdp} kg/dia · CC: {pesaje.condicion_corporal}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">{pesaje.fecha}</span>
                    </div>
                    {i < DEMO_PESAJES.length - 1 && <Separator className="mt-3" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sanidad Tab */}
        <TabsContent value="sanidad" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Vacunas recomendadas para {speciesConfig.nombre.toLowerCase()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {speciesConfig.vacunas.map((vacuna) => (
                  <Badge key={vacuna} variant="outline">{vacuna}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Historial sanitario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DEMO_SANIDAD.map((evento, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={evento.tipo === 'Vacuna' ? 'default' : 'secondary'} className="text-xs">
                          {evento.tipo}
                        </Badge>
                        <p className="font-medium text-sm">{evento.descripcion}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{evento.fecha}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {evento.producto} · {evento.dosis} · Via {evento.via.toLowerCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Proxima aplicacion: {evento.proximo}
                    </p>
                    {i < DEMO_SANIDAD.length - 1 && <Separator className="mt-3" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Economico Tab */}
        <TabsContent value="economico" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Resumen economico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    ${DEMO_ECONOMICO.filter((e) => e.tipo === 'ingreso').reduce((s, e) => s + e.monto, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Ingresos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    ${DEMO_ECONOMICO.filter((e) => e.tipo === 'gasto').reduce((s, e) => s + e.monto, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Gastos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    ${(
                      DEMO_ECONOMICO.filter((e) => e.tipo === 'ingreso').reduce((s, e) => s + e.monto, 0) -
                      DEMO_ECONOMICO.filter((e) => e.tipo === 'gasto').reduce((s, e) => s + e.monto, 0)
                    ).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Balance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Movimientos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {DEMO_ECONOMICO.map((mov, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{mov.concepto}</p>
                        <span className="text-xs text-muted-foreground">{mov.fecha}</span>
                      </div>
                      <p className={`font-semibold text-sm ${mov.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'}`}>
                        {mov.tipo === 'ingreso' ? '+' : '-'}${mov.monto.toLocaleString()}
                      </p>
                    </div>
                    {i < DEMO_ECONOMICO.length - 1 && <Separator className="mt-3" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

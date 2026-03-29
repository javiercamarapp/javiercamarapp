'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, MapPin, TreePine, Warehouse } from 'lucide-react'
import Link from 'next/link'
import { SPECIES_CONFIG } from '@/lib/species/config'

const DEMO_APIARIOS = [
  {
    id: '1',
    nombre: 'Apiario Monte Norte',
    num_colmenas: 20,
    ubicacion: 'Monte Norte, Km 12 carretera Tizimin',
    coordenadas: '21.1234, -88.5678',
    vegetacion_predominante: 'Tajonal, Dzidzilche',
    estado: 'activo',
    tipo_colmena: 'Langstroth',
    ultima_revision: '2026-03-15',
    produccion_estimada: '25 kg/colmena/temporada',
    raza_abejas: 'Italiana',
    notas: 'Apiario principal. Buen acceso todo el anio.',
  },
  {
    id: '2',
    nombre: 'Apiario Cenote Sur',
    num_colmenas: 15,
    ubicacion: 'Cenote Sur, Rancho Las Palmas',
    coordenadas: '20.9876, -88.4321',
    vegetacion_predominante: 'Tzalam, Ja\'abin, Flor de naranja',
    estado: 'activo',
    tipo_colmena: 'Langstroth',
    ultima_revision: '2026-03-10',
    produccion_estimada: '30 kg/colmena/temporada',
    raza_abejas: 'Africanizada',
    notas: 'Zona con excelente floracion de citricos.',
  },
  {
    id: '3',
    nombre: 'Meliponario Huerto',
    num_colmenas: 8,
    ubicacion: 'Huerto familiar, casco del rancho',
    coordenadas: '21.0001, -88.5000',
    vegetacion_predominante: 'Multifloral, Ts\'its\'ilche',
    estado: 'activo',
    tipo_colmena: 'Jobones tradicionales',
    ultima_revision: '2026-03-20',
    produccion_estimada: '2 kg/colmena/temporada',
    raza_abejas: 'Melipona beecheii',
    notas: 'Meliponicultura. Abejas sin aguijon (Xunan kab).',
  },
]

const estadoColors: Record<string, string> = {
  activo: 'bg-green-100 text-green-800',
  inactivo: 'bg-gray-100 text-gray-800',
  en_revision: 'bg-yellow-100 text-yellow-800',
}

export default function ApiariosPage() {
  const speciesConfig = SPECIES_CONFIG.abeja

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/inventario">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Apiarios</h1>
            <p className="text-muted-foreground text-sm">
              Manejo de apiarios y colmenas
            </p>
          </div>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo apiario
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{DEMO_APIARIOS.length}</p>
            <p className="text-xs text-muted-foreground">Apiarios</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">
              {DEMO_APIARIOS.reduce((s, a) => s + a.num_colmenas, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Colmenas totales</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{speciesConfig.emoji}</p>
            <p className="text-xs text-muted-foreground">{speciesConfig.nombre}</p>
          </CardContent>
        </Card>
      </div>

      {/* Apiarios list */}
      <div className="grid gap-3">
        {DEMO_APIARIOS.map((apiario) => (
          <Card key={apiario.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: speciesConfig.color + '20' }}
                >
                  {speciesConfig.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{apiario.nombre}</h3>
                    <Badge variant="outline" className={estadoColors[apiario.estado]}>
                      {apiario.estado}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                    <Warehouse className="w-3.5 h-3.5" />
                    <span>{apiario.num_colmenas} colmenas · {apiario.tipo_colmena}</span>
                  </div>

                  <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{apiario.ubicacion}</span>
                  </div>

                  <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                    <TreePine className="w-3.5 h-3.5" />
                    <span>{apiario.vegetacion_predominante}</span>
                  </div>

                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>Raza: {apiario.raza_abejas}</span>
                    <span>Produccion est.: {apiario.produccion_estimada}</span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1">
                    Ultima revision: {apiario.ultima_revision}
                  </p>

                  {apiario.notas && (
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      {apiario.notas}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

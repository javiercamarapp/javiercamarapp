'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Layers, Users } from 'lucide-react'
import Link from 'next/link'
import { SPECIES_CONFIG, type SpeciesKey } from '@/lib/species/config'

const DEMO_LOTES = [
  {
    id: '1',
    nombre: 'Lote Postura',
    cantidad_actual: 50,
    especie: 'ave' as SpeciesKey,
    raza: 'Hy-Line',
    estado: 'activo',
    tipo_produccion: 'postura',
    fecha_ingreso: '2025-09-15',
    mortalidad: 2,
    galpón: 'Galpon 1',
  },
  {
    id: '2',
    nombre: 'Lote Engorda',
    cantidad_actual: 100,
    especie: 'ave' as SpeciesKey,
    raza: 'Ross 308',
    estado: 'activo',
    tipo_produccion: 'engorda',
    fecha_ingreso: '2026-02-01',
    mortalidad: 3,
    galpón: 'Galpon 2',
  },
  {
    id: '3',
    nombre: 'Lote Conejas Reproductoras',
    cantidad_actual: 15,
    especie: 'conejo' as SpeciesKey,
    raza: 'Nueva Zelanda',
    estado: 'activo',
    tipo_produccion: 'carne',
    fecha_ingreso: '2025-06-10',
    mortalidad: 0,
    galpón: 'Conejera A',
  },
  {
    id: '4',
    nombre: 'Lote Engorda Conejos',
    cantidad_actual: 40,
    especie: 'conejo' as SpeciesKey,
    raza: 'California',
    estado: 'activo',
    tipo_produccion: 'carne',
    fecha_ingreso: '2026-01-20',
    mortalidad: 1,
    galpón: 'Conejera B',
  },
]

const estadoColors: Record<string, string> = {
  activo: 'bg-green-100 text-green-800',
  finalizado: 'bg-gray-100 text-gray-800',
  en_cuarentena: 'bg-yellow-100 text-yellow-800',
}

export default function LotesPage() {
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
            <h1 className="text-2xl font-bold">Lotes</h1>
            <p className="text-muted-foreground text-sm">
              Manejo por lotes para aves y conejos
            </p>
          </div>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo lote
        </Button>
      </div>

      {/* Lotes list */}
      <div className="grid gap-3">
        {DEMO_LOTES.map((lote) => {
          const speciesConfig = SPECIES_CONFIG[lote.especie]
          return (
            <Card key={lote.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
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
                      <h3 className="font-semibold truncate">{lote.nombre}</h3>
                      <Badge variant="outline" className={estadoColors[lote.estado]}>
                        {lote.estado}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {lote.raza} · {lote.tipo_produccion}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="w-3 h-3" />
                        <span>{lote.cantidad_actual} animales</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {lote.galpón}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Ingreso: {lote.fecha_ingreso}
                      </span>
                    </div>
                    {lote.mortalidad > 0 && (
                      <p className="text-xs text-red-600 mt-1">
                        Mortalidad: {lote.mortalidad} animales
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

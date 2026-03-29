'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Filter } from 'lucide-react'
import Link from 'next/link'
import { SPECIES_CONFIG, type SpeciesKey } from '@/lib/species/config'

// Demo data
const DEMO_ANIMALS = [
  { id: '1', nombre: 'La Negra', numero_arete: '484-0-2601234001', especie: 'bovino' as SpeciesKey, raza: 'Brahman', sexo: 'hembra', categoria: 'vaca', estado: 'activo', estado_reproductivo: 'gestante', peso_actual: 450 },
  { id: '2', nombre: 'El Patrón', numero_arete: '484-0-2601234002', especie: 'bovino' as SpeciesKey, raza: 'Brahman', sexo: 'macho', categoria: 'toro', estado: 'activo', estado_reproductivo: 'semental', peso_actual: 680 },
  { id: '3', nombre: 'Estrella', numero_arete: '484-0-2601234003', especie: 'bovino' as SpeciesKey, raza: 'Suizo', sexo: 'hembra', categoria: 'vaca', estado: 'activo', estado_reproductivo: 'lactando', peso_actual: 420 },
  { id: '4', nombre: null, numero_arete: 'OV-001', especie: 'ovino' as SpeciesKey, raza: 'Pelibuey', sexo: 'hembra', categoria: 'borrega', estado: 'activo', estado_reproductivo: 'gestante', peso_actual: 45 },
  { id: '5', nombre: null, numero_arete: 'OV-002', especie: 'ovino' as SpeciesKey, raza: 'Dorper', sexo: 'macho', categoria: 'carnero', estado: 'activo', estado_reproductivo: 'semental', peso_actual: 65 },
  { id: '6', nombre: null, numero_arete: 'PC-001', especie: 'porcino' as SpeciesKey, raza: 'Yorkshire', sexo: 'hembra', categoria: 'marrana', estado: 'activo', estado_reproductivo: 'gestante', peso_actual: 180 },
  { id: '7', nombre: 'Lucero', numero_arete: 'EQ-001', especie: 'equino' as SpeciesKey, raza: 'Cuarto de Milla', sexo: 'macho', categoria: 'caballo_castrado', estado: 'activo', estado_reproductivo: null, peso_actual: 450 },
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

export default function InventarioPage() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('todos')

  const filteredAnimals = DEMO_ANIMALS.filter((animal) => {
    const matchesSearch =
      search === '' ||
      animal.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      animal.numero_arete.toLowerCase().includes(search.toLowerCase()) ||
      animal.raza.toLowerCase().includes(search.toLowerCase())
    const matchesTab =
      activeTab === 'todos' || animal.especie === activeTab
    return matchesSearch && matchesTab
  })

  const speciesWithAnimals = ['todos', ...Array.from(new Set(DEMO_ANIMALS.map((a) => a.especie)))]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventario</h1>
          <p className="text-muted-foreground text-sm">
            {DEMO_ANIMALS.length} animales registrados
          </p>
        </div>
        <Link href="/inventario/nuevo">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo animal
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, arete o raza..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Species Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full overflow-x-auto flex-nowrap justify-start">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          {speciesWithAnimals
            .filter((s) => s !== 'todos')
            .map((species) => {
              const config = SPECIES_CONFIG[species as SpeciesKey]
              return (
                <TabsTrigger key={species} value={species}>
                  {config?.emoji} {config?.nombre}
                </TabsTrigger>
              )
            })}
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="grid gap-3">
            {filteredAnimals.map((animal) => {
              const speciesConfig = SPECIES_CONFIG[animal.especie]
              return (
                <Link key={animal.id} href={`/inventario/${animal.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Species icon */}
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                          style={{ backgroundColor: speciesConfig?.color + '20' }}
                        >
                          {speciesConfig?.emoji}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold truncate">
                              {animal.nombre || animal.numero_arete}
                            </h3>
                            <Badge variant="outline" className={estadoColors[animal.estado]}>
                              {animal.estado}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {animal.numero_arete} · {animal.raza} · {animal.categoria}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {animal.peso_actual && (
                              <span className="text-xs text-muted-foreground">
                                {animal.peso_actual} kg
                              </span>
                            )}
                            {animal.estado_reproductivo && (
                              <Badge variant="outline" className={reproColors[animal.estado_reproductivo] || ''}>
                                {animal.estado_reproductivo}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}

            {filteredAnimals.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No se encontraron animales</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

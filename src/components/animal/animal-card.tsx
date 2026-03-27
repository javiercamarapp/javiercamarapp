"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SpeciesIcon } from "@/components/icons/species-icons"
import { SPECIES_CONFIG } from "@/lib/species/config"
import type { SpeciesId, AnimalStatus, ReproductiveState, AnimalSex } from "@/types/species"

export interface AnimalCardData {
  id: string
  numero_arete: string
  nombre?: string | null
  especie: SpeciesId
  raza?: string | null
  sexo: AnimalSex
  fecha_nacimiento?: string | null
  peso_actual?: number | null
  estado: AnimalStatus
  estado_reproductivo?: ReproductiveState | null
  foto_url?: string | null
  corral?: { nombre: string } | null
}

interface AnimalCardProps {
  animal: AnimalCardData
}

const STATUS_COLORS: Record<AnimalStatus, string> = {
  activo: "bg-green-100 text-green-800 border-green-200",
  vendido: "bg-blue-100 text-blue-800 border-blue-200",
  muerto: "bg-red-100 text-red-800 border-red-200",
  descartado: "bg-gray-100 text-gray-800 border-gray-200",
  en_tratamiento: "bg-yellow-100 text-yellow-800 border-yellow-200",
  en_cuarentena: "bg-orange-100 text-orange-800 border-orange-200",
}

function calcularEdad(fechaNacimiento: string): string {
  const nacimiento = new Date(fechaNacimiento)
  const hoy = new Date()
  const diffMs = hoy.getTime() - nacimiento.getTime()
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDias < 30) return `${diffDias}d`
  if (diffDias < 365) return `${Math.floor(diffDias / 30)}m`
  const anios = Math.floor(diffDias / 365)
  const meses = Math.floor((diffDias % 365) / 30)
  return meses > 0 ? `${anios}a ${meses}m` : `${anios}a`
}

export function AnimalCard({ animal }: AnimalCardProps) {
  const router = useRouter()
  const speciesConfig = SPECIES_CONFIG[animal.especie]

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow min-h-[48px]"
      onClick={() => router.push(`/inventario/${animal.id}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Foto o icono de especie */}
          <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
            {animal.foto_url ? (
              <img
                src={animal.foto_url}
                alt={animal.nombre || animal.numero_arete}
                className="w-full h-full object-cover"
              />
            ) : (
              <SpeciesIcon species={animal.especie} size={32} />
            )}
          </div>

          {/* Info principal */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm truncate">
                {animal.numero_arete}
              </span>
              {animal.raza && (
                <Badge variant="secondary" className="text-xs">
                  {animal.raza}
                </Badge>
              )}
            </div>

            {animal.nombre && (
              <p className="text-sm text-muted-foreground truncate">
                {animal.nombre}
              </p>
            )}

            <div className="flex items-center gap-2 mt-1.5 flex-wrap text-xs text-muted-foreground">
              {animal.fecha_nacimiento && (
                <span>{calcularEdad(animal.fecha_nacimiento)}</span>
              )}
              {animal.peso_actual != null && (
                <span>{animal.peso_actual} kg</span>
              )}
              {animal.corral?.nombre && (
                <span className="truncate">{animal.corral.nombre}</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <Badge className={STATUS_COLORS[animal.estado]}>
                {animal.estado.replace(/_/g, " ")}
              </Badge>
              {animal.sexo === "hembra" && animal.estado_reproductivo && (
                <Badge variant="outline" className="text-xs">
                  {animal.estado_reproductivo.replace(/_/g, " ")}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

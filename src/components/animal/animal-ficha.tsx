"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SpeciesIcon } from "@/components/icons/species-icons"
import { SPECIES_CONFIG } from "@/lib/species/config"
import type { SpeciesId, AnimalStatus, ReproductiveState, AnimalSex } from "@/types/species"
import { Scale, Heart, ShieldPlus, Pencil } from "lucide-react"

export interface AnimalFichaData {
  id: string
  numero_arete: string
  numero_siniiga?: string | null
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

interface AnimalFichaProps {
  animal: AnimalFichaData
  onPesar?: () => void
  onEventoReproductivo?: () => void
  onEventoSanitario?: () => void
  onEditar?: () => void
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

  if (diffDias < 30) return `${diffDias} dias`
  if (diffDias < 365) {
    const meses = Math.floor(diffDias / 30)
    return `${meses} ${meses === 1 ? "mes" : "meses"}`
  }
  const anios = Math.floor(diffDias / 365)
  const meses = Math.floor((diffDias % 365) / 30)
  const partes: string[] = [`${anios} ${anios === 1 ? "año" : "años"}`]
  if (meses > 0) partes.push(`${meses} ${meses === 1 ? "mes" : "meses"}`)
  return partes.join(", ")
}

export function AnimalFicha({
  animal,
  onPesar,
  onEventoReproductivo,
  onEventoSanitario,
  onEditar,
}: AnimalFichaProps) {
  const speciesConfig = SPECIES_CONFIG[animal.especie]

  return (
    <div className="flex flex-col sm:flex-row gap-6">
      {/* Foto / placeholder */}
      <div className="flex-shrink-0 w-full sm:w-40 h-40 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
        {animal.foto_url ? (
          <img
            src={animal.foto_url}
            alt={animal.nombre || animal.numero_arete}
            className="w-full h-full object-cover"
          />
        ) : (
          <SpeciesIcon species={animal.especie} size={80} />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold">
              {animal.nombre || animal.numero_arete}
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span className="font-mono">{animal.numero_arete}</span>
              {animal.numero_siniiga && (
                <>
                  <span className="text-muted-foreground/50">|</span>
                  <span className="font-mono">SINIIGA: {animal.numero_siniiga}</span>
                </>
              )}
            </div>
          </div>
          {onEditar && (
            <Button variant="outline" size="sm" onClick={onEditar}>
              <Pencil className="h-4 w-4 mr-1" />
              Editar
            </Button>
          )}
        </div>

        {/* Detalles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 mt-4 text-sm">
          <div>
            <span className="text-muted-foreground">Especie</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <SpeciesIcon species={animal.especie} size={18} />
              <span className="font-medium">{speciesConfig.name}</span>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Raza</span>
            <p className="font-medium mt-0.5">{animal.raza || "-"}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Sexo</span>
            <p className="font-medium capitalize mt-0.5">{animal.sexo}</p>
          </div>
          {animal.fecha_nacimiento && (
            <div>
              <span className="text-muted-foreground">Edad</span>
              <p className="font-medium mt-0.5">
                {calcularEdad(animal.fecha_nacimiento)}
              </p>
            </div>
          )}
          {animal.peso_actual != null && (
            <div>
              <span className="text-muted-foreground">Peso actual</span>
              <p className="font-medium mt-0.5">{animal.peso_actual} kg</p>
            </div>
          )}
          {animal.corral?.nombre && (
            <div>
              <span className="text-muted-foreground">Corral</span>
              <p className="font-medium mt-0.5">{animal.corral.nombre}</p>
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <Badge className={STATUS_COLORS[animal.estado]}>
            {animal.estado.replace(/_/g, " ")}
          </Badge>
          {animal.sexo === "hembra" && animal.estado_reproductivo && (
            <Badge variant="outline">
              {animal.estado_reproductivo.replace(/_/g, " ")}
            </Badge>
          )}
        </div>

        {/* Acciones rapidas */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {onPesar && (
            <Button size="sm" variant="outline" onClick={onPesar}>
              <Scale className="h-4 w-4 mr-1" />
              Pesar
            </Button>
          )}
          {onEventoReproductivo && (
            <Button size="sm" variant="outline" onClick={onEventoReproductivo}>
              <Heart className="h-4 w-4 mr-1" />
              Evento Reproductivo
            </Button>
          )}
          {onEventoSanitario && (
            <Button size="sm" variant="outline" onClick={onEventoSanitario}>
              <ShieldPlus className="h-4 w-4 mr-1" />
              Evento Sanitario
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SPECIES_CONFIG } from "@/lib/species/config"
import type { SpeciesId, AnimalStatus, ReproductiveState, AnimalSex } from "@/types/species"
import { ArrowUpDown } from "lucide-react"

export interface AnimalTableRow {
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
  corral?: { nombre: string } | null
}

interface AnimalTableProps {
  animals: AnimalTableRow[]
}

type SortKey = "numero_arete" | "nombre" | "especie" | "raza" | "sexo" | "edad" | "peso_actual" | "estado" | "corral"
type SortDir = "asc" | "desc"

const STATUS_COLORS: Record<AnimalStatus, string> = {
  activo: "bg-green-100 text-green-800 border-green-200",
  vendido: "bg-blue-100 text-blue-800 border-blue-200",
  muerto: "bg-red-100 text-red-800 border-red-200",
  descartado: "bg-gray-100 text-gray-800 border-gray-200",
  en_tratamiento: "bg-yellow-100 text-yellow-800 border-yellow-200",
  en_cuarentena: "bg-orange-100 text-orange-800 border-orange-200",
}

function calcularEdadDias(fechaNacimiento: string): number {
  const nacimiento = new Date(fechaNacimiento)
  const hoy = new Date()
  return Math.floor((hoy.getTime() - nacimiento.getTime()) / (1000 * 60 * 60 * 24))
}

function formatEdad(dias: number): string {
  if (dias < 30) return `${dias}d`
  if (dias < 365) return `${Math.floor(dias / 30)}m`
  const anios = Math.floor(dias / 365)
  const meses = Math.floor((dias % 365) / 30)
  return meses > 0 ? `${anios}a ${meses}m` : `${anios}a`
}

export function AnimalTable({ animals }: AnimalTableProps) {
  const router = useRouter()
  const [sortKey, setSortKey] = useState<SortKey>("numero_arete")
  const [sortDir, setSortDir] = useState<SortDir>("asc")

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const sorted = [...animals].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1
    switch (sortKey) {
      case "numero_arete":
        return dir * a.numero_arete.localeCompare(b.numero_arete)
      case "nombre":
        return dir * (a.nombre || "").localeCompare(b.nombre || "")
      case "especie":
        return dir * a.especie.localeCompare(b.especie)
      case "raza":
        return dir * (a.raza || "").localeCompare(b.raza || "")
      case "sexo":
        return dir * a.sexo.localeCompare(b.sexo)
      case "edad": {
        const aDias = a.fecha_nacimiento ? calcularEdadDias(a.fecha_nacimiento) : 0
        const bDias = b.fecha_nacimiento ? calcularEdadDias(b.fecha_nacimiento) : 0
        return dir * (aDias - bDias)
      }
      case "peso_actual":
        return dir * ((a.peso_actual || 0) - (b.peso_actual || 0))
      case "estado":
        return dir * a.estado.localeCompare(b.estado)
      case "corral":
        return dir * (a.corral?.nombre || "").localeCompare(b.corral?.nombre || "")
      default:
        return 0
    }
  })

  const SortableHead = ({ label, column }: { label: string; column: SortKey }) => (
    <TableHead
      className="cursor-pointer select-none hover:bg-muted/50"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
      </div>
    </TableHead>
  )

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <SortableHead label="Arete" column="numero_arete" />
          <SortableHead label="Nombre" column="nombre" />
          <TableHead className="hidden md:table-cell">
            <button
              className="flex items-center gap-1 hover:text-foreground"
              onClick={() => handleSort("especie")}
            >
              Especie
              <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
            </button>
          </TableHead>
          <TableHead className="hidden lg:table-cell">
            <button
              className="flex items-center gap-1 hover:text-foreground"
              onClick={() => handleSort("raza")}
            >
              Raza
              <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
            </button>
          </TableHead>
          <TableHead className="hidden sm:table-cell">
            <button
              className="flex items-center gap-1 hover:text-foreground"
              onClick={() => handleSort("sexo")}
            >
              Sexo
              <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
            </button>
          </TableHead>
          <SortableHead label="Edad" column="edad" />
          <SortableHead label="Peso" column="peso_actual" />
          <SortableHead label="Estado" column="estado" />
          <TableHead className="hidden lg:table-cell">
            <button
              className="flex items-center gap-1 hover:text-foreground"
              onClick={() => handleSort("corral")}
            >
              Corral
              <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
            </button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((animal) => {
          const speciesConfig = SPECIES_CONFIG[animal.especie]
          const edadDias = animal.fecha_nacimiento
            ? calcularEdadDias(animal.fecha_nacimiento)
            : null

          return (
            <TableRow
              key={animal.id}
              className="cursor-pointer"
              onClick={() => router.push(`/inventario/${animal.id}`)}
            >
              <TableCell className="font-medium">{animal.numero_arete}</TableCell>
              <TableCell>{animal.nombre || "-"}</TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="mr-1">{speciesConfig.icon}</span>
                {speciesConfig.name}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {animal.raza || "-"}
              </TableCell>
              <TableCell className="hidden sm:table-cell capitalize">
                {animal.sexo}
              </TableCell>
              <TableCell>
                {edadDias != null ? formatEdad(edadDias) : "-"}
              </TableCell>
              <TableCell>
                {animal.peso_actual != null ? `${animal.peso_actual} kg` : "-"}
              </TableCell>
              <TableCell>
                <Badge className={STATUS_COLORS[animal.estado]}>
                  {animal.estado.replace(/_/g, " ")}
                </Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {animal.corral?.nombre || "-"}
              </TableCell>
            </TableRow>
          )
        })}
        {sorted.length === 0 && (
          <TableRow>
            <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
              No se encontraron animales
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

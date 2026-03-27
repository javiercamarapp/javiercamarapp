"use client"

import { useState } from "react"
import { SpeciesSelector } from "@/components/shared/species-selector"
import { SpeciesIcon } from "@/components/icons/species-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Plus, LayoutGrid, List } from "lucide-react"
import Link from "next/link"

interface Animal {
  id: string
  arete: string
  nombre: string
  especie: string
  raza: string
  sexo: "Macho" | "Hembra"
  fechaNacimiento: string
  edad: string
  peso: number
  estado: "Activo" | "Vendido" | "Muerto"
  corral: string
}

const MOCK_ANIMALS: Animal[] = [
  { id: "1", arete: "MX-001", nombre: "Ixchel", especie: "bovino", raza: "Brahman", sexo: "Hembra", fechaNacimiento: "2022-03-15", edad: "4 a", peso: 485, estado: "Activo", corral: "Potrero Norte" },
  { id: "2", arete: "MX-002", nombre: "Kukulcan", especie: "bovino", raza: "Charolais", sexo: "Macho", fechaNacimiento: "2021-08-20", edad: "4.5 a", peso: 620, estado: "Activo", corral: "Potrero Sur" },
  { id: "3", arete: "MX-003", nombre: "Chaac", especie: "bovino", raza: "Suizo", sexo: "Macho", fechaNacimiento: "2023-01-10", edad: "3 a", peso: 540, estado: "Activo", corral: "Corral 1" },
  { id: "4", arete: "MX-004", nombre: "Yum Kaax", especie: "bovino", raza: "Angus", sexo: "Macho", fechaNacimiento: "2020-06-05", edad: "5.5 a", peso: 580, estado: "Vendido", corral: "Potrero Norte" },
  { id: "5", arete: "MX-005", nombre: "Xtabay", especie: "bovino", raza: "Holstein", sexo: "Hembra", fechaNacimiento: "2022-11-22", edad: "3 a", peso: 510, estado: "Activo", corral: "Potrero Sur" },
  { id: "6", arete: "MX-006", nombre: "Ah Puch", especie: "bovino", raza: "Cebú", sexo: "Macho", fechaNacimiento: "2023-05-18", edad: "2.5 a", peso: 420, estado: "Activo", corral: "Corral 2" },
  { id: "7", arete: "MX-007", nombre: "Ixtab", especie: "bovino", raza: "Simmental", sexo: "Hembra", fechaNacimiento: "2021-02-14", edad: "5 a", peso: 495, estado: "Activo", corral: "Potrero Norte" },
  { id: "8", arete: "MX-008", nombre: "Kinich Ahau", especie: "bovino", raza: "Brahman", sexo: "Macho", fechaNacimiento: "2022-07-30", edad: "3.5 a", peso: 560, estado: "Activo", corral: "Corral 1" },
  { id: "9", arete: "MX-009", nombre: "Itzamna", especie: "bovino", raza: "Limousin", sexo: "Macho", fechaNacimiento: "2019-12-01", edad: "6 a", peso: 650, estado: "Muerto", corral: "Potrero Sur" },
  { id: "10", arete: "MX-010", nombre: "Xbalanque", especie: "bovino", raza: "Hereford", sexo: "Hembra", fechaNacimiento: "2023-09-08", edad: "2.5 a", peso: 380, estado: "Activo", corral: "Corral 2" },
]

const ACTIVE_SPECIES = ["bovino", "porcino", "ovino", "caprino", "ave", "abeja", "equido", "conejo", "diversificado"]

function EstadoBadge({ estado }: { estado: Animal["estado"] }) {
  const colors = {
    Activo: "bg-green-100 text-green-800",
    Vendido: "bg-blue-100 text-blue-800",
    Muerto: "bg-gray-100 text-gray-600",
  }
  return (
    <Badge className={`${colors[estado]} border-0`}>
      {estado}
    </Badge>
  )
}

export default function InventarioPage() {
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"card" | "table">("table")
  const [searchQuery, setSearchQuery] = useState("")
  const [estadoFilter, setEstadoFilter] = useState<string>("todos")
  const [sexoFilter, setSexoFilter] = useState<string>("todos")
  const [razaFilter, setRazaFilter] = useState<string>("todos")
  const [corralFilter, setCorralFilter] = useState<string>("todos")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const filtered = MOCK_ANIMALS.filter((a) => {
    if (selectedSpecies && a.especie !== selectedSpecies) return false
    if (estadoFilter !== "todos" && a.estado !== estadoFilter) return false
    if (sexoFilter !== "todos" && a.sexo !== sexoFilter) return false
    if (razaFilter !== "todos" && a.raza !== razaFilter) return false
    if (corralFilter !== "todos" && a.corral !== corralFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return a.arete.toLowerCase().includes(q) || a.nombre.toLowerCase().includes(q)
    }
    return true
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const razas = [...new Set(MOCK_ANIMALS.map((a) => a.raza))]
  const corrales = [...new Set(MOCK_ANIMALS.map((a) => a.corral))]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1B4332]">Inventario</h1>
        <Link href="/inventario/nuevo">
          <Button className="h-12 min-w-[48px] text-base">
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Registrar</span>
          </Button>
        </Link>
      </div>

      <SpeciesSelector
        activeSpecies={ACTIVE_SPECIES}
        selected={selectedSpecies}
        onSelect={(s) => { setSelectedSpecies(s || null); setCurrentPage(1) }}
      />

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por arete o nombre..."
            className="pl-10 h-12 text-base"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Select value={estadoFilter} onValueChange={(v) => { setEstadoFilter(v); setCurrentPage(1) }}>
            <SelectTrigger className="w-[130px] h-12 shrink-0">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="Activo">Activo</SelectItem>
              <SelectItem value="Vendido">Vendido</SelectItem>
              <SelectItem value="Muerto">Muerto</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sexoFilter} onValueChange={(v) => { setSexoFilter(v); setCurrentPage(1) }}>
            <SelectTrigger className="w-[120px] h-12 shrink-0">
              <SelectValue placeholder="Sexo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="Macho">Macho</SelectItem>
              <SelectItem value="Hembra">Hembra</SelectItem>
            </SelectContent>
          </Select>
          <Select value={razaFilter} onValueChange={(v) => { setRazaFilter(v); setCurrentPage(1) }}>
            <SelectTrigger className="w-[140px] h-12 shrink-0">
              <SelectValue placeholder="Raza" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas</SelectItem>
              {razas.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={corralFilter} onValueChange={(v) => { setCorralFilter(v); setCurrentPage(1) }}>
            <SelectTrigger className="w-[150px] h-12 shrink-0">
              <SelectValue placeholder="Corral" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {corrales.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{filtered.length} animales</p>
        <div className="flex border rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode("card")}
            className={`p-3 min-w-[48px] min-h-[48px] flex items-center justify-center ${viewMode === "card" ? "bg-[#1B4332] text-white" : "bg-white text-muted-foreground"}`}
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-3 min-w-[48px] min-h-[48px] flex items-center justify-center ${viewMode === "table" ? "bg-[#1B4332] text-white" : "bg-white text-muted-foreground"}`}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === "table" && (
        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[50px]">Foto</TableHead>
                <TableHead>Arete</TableHead>
                <TableHead className="hidden sm:table-cell">Nombre</TableHead>
                <TableHead className="hidden md:table-cell">Raza</TableHead>
                <TableHead className="hidden md:table-cell">Edad</TableHead>
                <TableHead>Peso</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden lg:table-cell">Corral</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((animal) => (
                <TableRow key={animal.id} className="cursor-pointer">
                  <TableCell>
                    <Link href={`/inventario/${animal.id}`} className="block">
                      <div className="h-10 w-10 rounded-full bg-[#1B4332]/10 flex items-center justify-center">
                        <SpeciesIcon species={animal.especie} size={24} />
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/inventario/${animal.id}`} className="block font-medium text-base">
                      {animal.arete}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Link href={`/inventario/${animal.id}`} className="block text-base">
                      {animal.nombre}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-base">{animal.raza}</TableCell>
                  <TableCell className="hidden md:table-cell text-base">{animal.edad}</TableCell>
                  <TableCell className="text-base font-medium">{animal.peso} kg</TableCell>
                  <TableCell><EstadoBadge estado={animal.estado} /></TableCell>
                  <TableCell className="hidden lg:table-cell text-base">{animal.corral}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Card View */}
      {viewMode === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((animal) => (
            <Link key={animal.id} href={`/inventario/${animal.id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-16 w-16 rounded-xl bg-[#1B4332]/10 flex items-center justify-center shrink-0">
                      <SpeciesIcon species={animal.especie} size={40} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-lg truncate">{animal.nombre}</p>
                        <EstadoBadge estado={animal.estado} />
                      </div>
                      <p className="text-base text-muted-foreground">{animal.arete}</p>
                      <div className="flex items-center gap-3 mt-2 text-base">
                        <span>{animal.raza}</span>
                        <span className="text-muted-foreground">|</span>
                        <span className="font-medium">{animal.peso} kg</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            className="h-12 min-w-[48px]"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Anterior
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              className="h-12 min-w-[48px]"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            className="h-12 min-w-[48px]"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { SpeciesIcon } from "@/components/icons/species-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { SPECIES_CONFIG, SPECIES_IDS } from "@/lib/species/config"
import type { SpeciesId } from "@/types/species"

const animalSchema = z.object({
  arete: z.string().min(1, "El arete es obligatorio"),
  siniiga: z.string().optional(),
  nombre: z.string().optional(),
  sexo: z.enum(["macho", "hembra"]),
  raza: z.string().min(1, "Selecciona una raza"),
  fecha_nacimiento: z.string().optional(),
  color: z.string().optional(),
  tipo_ingreso: z.enum(["nacimiento", "compra", "donacion", "traspaso"]).default("nacimiento"),
  fecha_ingreso: z.string().min(1, "La fecha de ingreso es obligatoria"),
  precio_compra: z.string().optional(),
  corral: z.string().optional(),
})

type AnimalFormData = z.infer<typeof animalSchema>

const CORRALES = ["Potrero Norte", "Potrero Sur", "Corral 1", "Corral 2", "Corral 3", "Maternidad"]

const SPECIES_GRID = SPECIES_IDS.map((id) => ({
  id,
  name: SPECIES_CONFIG[id].name,
  namePlural: SPECIES_CONFIG[id].namePlural,
}))

export default function NuevoAnimalPage() {
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AnimalFormData>({
    defaultValues: {
      tipo_ingreso: "nacimiento",
      fecha_ingreso: new Date().toISOString().split("T")[0],
    },
  })

  const tipoIngreso = watch("tipo_ingreso")

  const onSubmit = (data: AnimalFormData) => {
    toast.success("Animal registrado exitosamente", {
      description: `${data.nombre || data.arete} fue registrado como ${selectedSpecies}`,
    })
  }

  const speciesConfig = selectedSpecies ? SPECIES_CONFIG[selectedSpecies as SpeciesId] : null

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/inventario">
          <Button variant="ghost" className="h-12 w-12">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-[#1B4332]">Registrar animal</h1>
      </div>

      {/* Species Selector Grid */}
      {!selectedSpecies ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Selecciona la especie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {SPECIES_GRID.map((sp) => (
                <button
                  key={sp.id}
                  onClick={() => setSelectedSpecies(sp.id)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-border hover:border-[#1B4332] hover:bg-[#1B4332]/5 transition-colors min-h-[100px] justify-center"
                >
                  <SpeciesIcon species={sp.id} size={40} />
                  <span className="text-base font-medium text-center">{sp.namePlural}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Selected species indicator */}
          <button
            onClick={() => setSelectedSpecies(null)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#1B4332] bg-[#1B4332]/10 text-[#1B4332] text-base font-medium"
          >
            <SpeciesIcon species={selectedSpecies} size={24} />
            {speciesConfig?.namePlural}
            <span className="text-sm ml-1">(cambiar)</span>
          </button>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Datos basicos */}
            <Card>
              <CardHeader><CardTitle className="text-lg">Datos basicos</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="arete" className="text-base">Arete *</Label>
                    <Input
                      id="arete"
                      placeholder="Ej. MX-001"
                      className="h-12 text-base"
                      {...register("arete")}
                    />
                    {errors.arete && <p className="text-sm text-red-500">{errors.arete.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siniiga" className="text-base">SINIIGA</Label>
                    <Input
                      id="siniiga"
                      placeholder="Numero SINIIGA"
                      className="h-12 text-base"
                      {...register("siniiga")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-base">Nombre</Label>
                    <Input
                      id="nombre"
                      placeholder="Nombre del animal"
                      className="h-12 text-base"
                      {...register("nombre")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base">Sexo *</Label>
                    <Select onValueChange={(v) => setValue("sexo", v as "macho" | "hembra")}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Seleccionar sexo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="macho">Macho</SelectItem>
                        <SelectItem value="hembra">Hembra</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.sexo && <p className="text-sm text-red-500">{errors.sexo.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base">Raza *</Label>
                    <Select onValueChange={(v) => setValue("raza", v)}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Seleccionar raza" />
                      </SelectTrigger>
                      <SelectContent>
                        {speciesConfig?.breeds.map((breed: string) => (
                          <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.raza && <p className="text-sm text-red-500">{errors.raza.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fecha_nacimiento" className="text-base">Fecha de nacimiento</Label>
                    <Input
                      id="fecha_nacimiento"
                      type="date"
                      className="h-12 text-base"
                      {...register("fecha_nacimiento")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color" className="text-base">Color</Label>
                    <Input
                      id="color"
                      placeholder="Color del animal"
                      className="h-12 text-base"
                      {...register("color")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Origen */}
            <Card>
              <CardHeader><CardTitle className="text-lg">Origen</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-base">Tipo de ingreso</Label>
                    <Select
                      defaultValue="nacimiento"
                      onValueChange={(v) => setValue("tipo_ingreso", v as AnimalFormData["tipo_ingreso"])}
                    >
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nacimiento">Nacimiento en rancho</SelectItem>
                        <SelectItem value="compra">Compra</SelectItem>
                        <SelectItem value="donacion">Donacion</SelectItem>
                        <SelectItem value="traspaso">Traspaso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fecha_ingreso" className="text-base">Fecha de ingreso *</Label>
                    <Input
                      id="fecha_ingreso"
                      type="date"
                      className="h-12 text-base"
                      {...register("fecha_ingreso")}
                    />
                    {errors.fecha_ingreso && <p className="text-sm text-red-500">{errors.fecha_ingreso.message}</p>}
                  </div>
                  {tipoIngreso === "compra" && (
                    <div className="space-y-2">
                      <Label htmlFor="precio_compra" className="text-base">Precio de compra (MXN)</Label>
                      <Input
                        id="precio_compra"
                        type="number"
                        placeholder="0.00"
                        className="h-12 text-base"
                        {...register("precio_compra")}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Ubicacion */}
            <Card>
              <CardHeader><CardTitle className="text-lg">Ubicacion</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label className="text-base">Corral / Potrero</Label>
                  <Select onValueChange={(v) => setValue("corral", v)}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Seleccionar corral" />
                    </SelectTrigger>
                    <SelectContent>
                      {CORRALES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <Button type="submit" className="w-full h-14 text-lg font-semibold">
              Registrar animal
            </Button>
          </form>
        </>
      )}
    </div>
  )
}

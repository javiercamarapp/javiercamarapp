"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SPECIES_CONFIG, SPECIES_IDS } from "@/lib/species/config"
import { useCreateAnimal } from "@/hooks/use-animals"
import { useAnimals } from "@/hooks/use-animals"
import { useCorrales } from "@/hooks/use-ranch"
import { toast } from "sonner"
import { useState } from "react"
import type { SpeciesId } from "@/types/species"

const animalSchema = z.object({
  numero_arete: z.string().min(1, "El arete es requerido"),
  siniiga: z.string().optional(),
  nombre: z.string().optional(),
  especie: z.string().min(1, "La especie es requerida"),
  sexo: z.enum(["macho", "hembra"], { required_error: "Selecciona el sexo" }),
  raza: z.string().optional(),
  color: z.string().optional(),
  fecha_nacimiento: z.string().optional(),
  tipo_ingreso: z.enum(["nacimiento", "compra", "donacion", "traspaso"]).optional(),
  fecha_ingreso: z.string().optional(),
  precio_compra: z.coerce.number().min(0).optional(),
  padre_id: z.string().optional(),
  madre_id: z.string().optional(),
  corral_id: z.string().optional(),
  peso_nacimiento: z.coerce.number().min(0).optional(),
  condicion_corporal: z.coerce.number().min(1).max(9).optional(),
  notas: z.string().optional(),
})

type AnimalFormValues = z.infer<typeof animalSchema>

interface AnimalFormProps {
  ranchoId: string
  defaultSpecies?: SpeciesId
  onSuccess?: () => void
}

export function AnimalForm({ ranchoId, defaultSpecies, onSuccess }: AnimalFormProps) {
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesId | "">(defaultSpecies || "")
  const [fotos, setFotos] = useState<File[]>([])

  const createAnimal = useCreateAnimal()
  const { data: corrales } = useCorrales(ranchoId)
  const { data: animals } = useAnimals(ranchoId, selectedSpecies || undefined)

  const speciesConfig = selectedSpecies ? SPECIES_CONFIG[selectedSpecies] : null

  const males = animals?.filter((a: any) => a.sexo === "macho") || []
  const females = animals?.filter((a: any) => a.sexo === "hembra") || []

  const form = useForm<AnimalFormValues>({
    resolver: zodResolver(animalSchema),
    defaultValues: {
      especie: defaultSpecies || "",
      tipo_ingreso: "nacimiento",
      fecha_ingreso: new Date().toISOString().split("T")[0],
    },
  })

  const onSubmit = async (values: AnimalFormValues) => {
    createAnimal.mutate(
      { ...values, rancho_id: ranchoId },
      {
        onSuccess: () => {
          toast.success("Animal registrado exitosamente")
          form.reset()
          setFotos([])
          onSuccess?.()
        },
      }
    )
  }

  const handleSpeciesChange = (value: string) => {
    setSelectedSpecies(value as SpeciesId)
    form.setValue("especie", value)
    form.setValue("raza", "")
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Datos basicos */}
      <Card>
        <CardHeader>
          <CardTitle>Datos basicos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero_arete">Arete *</Label>
              <Input
                id="numero_arete"
                placeholder="Numero de arete"
                className="h-12"
                {...form.register("numero_arete")}
              />
              {form.formState.errors.numero_arete && (
                <p className="text-sm text-destructive">{form.formState.errors.numero_arete.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="siniiga">SINIIGA</Label>
              <Input
                id="siniiga"
                placeholder="Clave SINIIGA"
                className="h-12"
                {...form.register("siniiga")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                placeholder="Nombre del animal"
                className="h-12"
                {...form.register("nombre")}
              />
            </div>

            <div className="space-y-2">
              <Label>Especie *</Label>
              <Select value={selectedSpecies} onValueChange={handleSpeciesChange}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccionar especie" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIES_IDS.filter((id) => SPECIES_CONFIG[id].managementType === "individual").map((id) => (
                    <SelectItem key={id} value={id} className="h-12">
                      {SPECIES_CONFIG[id].icon} {SPECIES_CONFIG[id].name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.especie && (
                <p className="text-sm text-destructive">{form.formState.errors.especie.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Sexo *</Label>
              <Select
                value={form.watch("sexo")}
                onValueChange={(v) => form.setValue("sexo", v as "macho" | "hembra")}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccionar sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="macho" className="h-12">Macho</SelectItem>
                  <SelectItem value="hembra" className="h-12">Hembra</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.sexo && (
                <p className="text-sm text-destructive">{form.formState.errors.sexo.message}</p>
              )}
            </div>

            {speciesConfig && (
              <div className="space-y-2">
                <Label>Raza</Label>
                <Select
                  value={form.watch("raza") || ""}
                  onValueChange={(v) => form.setValue("raza", v)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Seleccionar raza" />
                  </SelectTrigger>
                  <SelectContent>
                    {speciesConfig.breeds.map((breed) => (
                      <SelectItem key={breed} value={breed} className="h-12">
                        {breed}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                placeholder="Color del animal"
                className="h-12"
                {...form.register("color")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_nacimiento">Fecha de nacimiento</Label>
              <Input
                id="fecha_nacimiento"
                type="date"
                className="h-12"
                {...form.register("fecha_nacimiento")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Origen */}
      <Card>
        <CardHeader>
          <CardTitle>Origen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de ingreso</Label>
              <Select
                value={form.watch("tipo_ingreso") || ""}
                onValueChange={(v) => form.setValue("tipo_ingreso", v as any)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nacimiento" className="h-12">Nacimiento</SelectItem>
                  <SelectItem value="compra" className="h-12">Compra</SelectItem>
                  <SelectItem value="donacion" className="h-12">Donacion</SelectItem>
                  <SelectItem value="traspaso" className="h-12">Traspaso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_ingreso">Fecha de ingreso</Label>
              <Input
                id="fecha_ingreso"
                type="date"
                className="h-12"
                {...form.register("fecha_ingreso")}
              />
            </div>

            {form.watch("tipo_ingreso") === "compra" && (
              <div className="space-y-2">
                <Label htmlFor="precio_compra">Precio de compra ($)</Label>
                <Input
                  id="precio_compra"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="h-12"
                  {...form.register("precio_compra")}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Genealogia */}
      {speciesConfig?.hasReproduction && (
        <Card>
          <CardHeader>
            <CardTitle>Genealogia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Padre</Label>
                <Select
                  value={form.watch("padre_id") || ""}
                  onValueChange={(v) => form.setValue("padre_id", v)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Buscar padre..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="" className="h-12">Sin padre registrado</SelectItem>
                    {males.map((m: any) => (
                      <SelectItem key={m.id} value={m.id} className="h-12">
                        {m.numero_arete} - {m.nombre || "Sin nombre"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Madre</Label>
                <Select
                  value={form.watch("madre_id") || ""}
                  onValueChange={(v) => form.setValue("madre_id", v)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Buscar madre..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="" className="h-12">Sin madre registrada</SelectItem>
                    {females.map((f: any) => (
                      <SelectItem key={f.id} value={f.id} className="h-12">
                        {f.numero_arete} - {f.nombre || "Sin nombre"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ubicacion */}
      <Card>
        <CardHeader>
          <CardTitle>Ubicacion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Corral</Label>
            <Select
              value={form.watch("corral_id") || ""}
              onValueChange={(v) => form.setValue("corral_id", v)}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Seleccionar corral" />
              </SelectTrigger>
              <SelectContent>
                {corrales?.map((c: any) => (
                  <SelectItem key={c.id} value={c.id} className="h-12">
                    {c.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Medidas */}
      {speciesConfig?.hasWeights && (
        <Card>
          <CardHeader>
            <CardTitle>Medidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="peso_nacimiento">Peso al nacimiento (kg)</Label>
                <Input
                  id="peso_nacimiento"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  className="h-12"
                  {...form.register("peso_nacimiento")}
                />
              </div>

              <div className="space-y-2">
                <Label>Condicion corporal (1-9)</Label>
                <Select
                  value={form.watch("condicion_corporal")?.toString() || ""}
                  onValueChange={(v) => form.setValue("condicion_corporal", parseInt(v))}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <SelectItem key={n} value={n.toString()} className="h-12">
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fotos */}
      <Card>
        <CardHeader>
          <CardTitle>Fotos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="fotos">Subir fotos</Label>
            <Input
              id="fotos"
              type="file"
              accept="image/*"
              multiple
              className="h-12"
              onChange={(e) => setFotos(Array.from(e.target.files || []))}
            />
            {fotos.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {fotos.length} foto(s) seleccionada(s)
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notas */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label htmlFor="notas">Notas</Label>
            <Textarea
              id="notas"
              placeholder="Observaciones adicionales..."
              {...form.register("notas")}
            />
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        className="w-full h-12 text-base"
        disabled={createAnimal.isPending}
      >
        {createAnimal.isPending ? "Guardando..." : "Registrar animal"}
      </Button>
    </form>
  )
}

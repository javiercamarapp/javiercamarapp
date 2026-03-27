"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApiaries } from "@/hooks/use-apiaries"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

const colmenaSchema = z.object({
  numero: z.string().min(1, "El numero es requerido"),
  tipo: z.enum(["langstroth", "top-bar", "jumbo", "melipona", "tronco"], {
    required_error: "Selecciona el tipo",
  }),
  raza_reina: z.enum(["italiana", "carniola", "africanizada", "melipona_beecheii"]).optional(),
  origen_reina: z.string().optional(),
  fecha_instalacion: z.string().optional(),
  num_cuadros: z.coerce.number().int().min(0).optional(),
  tiene_alza: z.boolean().default(false),
  apiario_id: z.string().min(1, "Selecciona un apiario"),
  notas: z.string().optional(),
})

type ColmenaFormValues = z.infer<typeof colmenaSchema>

interface ColmenaFormProps {
  ranchoId: string
  defaultApiarioId?: string
  onSuccess?: () => void
}

function useCreateColmena() {
  const queryClient = useQueryClient()
  const supabase = createClient()
  return useMutation({
    mutationFn: async (colmena: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("colmenas")
        .insert(colmena)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["hives", data.apiario_id] })
      toast.success("Colmena registrada exitosamente")
    },
    onError: (error: Error) => toast.error("Error al registrar: " + error.message),
  })
}

const TIPOS_COLMENA = [
  { value: "langstroth", label: "Langstroth" },
  { value: "top-bar", label: "Top Bar" },
  { value: "jumbo", label: "Jumbo" },
  { value: "melipona", label: "Melipona" },
  { value: "tronco", label: "Tronco" },
]

const RAZAS_REINA = [
  { value: "italiana", label: "Italiana" },
  { value: "carniola", label: "Carniola" },
  { value: "africanizada", label: "Africanizada" },
  { value: "melipona_beecheii", label: "Melipona beecheii" },
]

export function ColmenaForm({ ranchoId, defaultApiarioId, onSuccess }: ColmenaFormProps) {
  const createColmena = useCreateColmena()
  const { data: apiarios } = useApiaries(ranchoId)

  const form = useForm<ColmenaFormValues>({
    resolver: zodResolver(colmenaSchema),
    defaultValues: {
      apiario_id: defaultApiarioId || "",
      tiene_alza: false,
      fecha_instalacion: new Date().toISOString().split("T")[0],
    },
  })

  const onSubmit = async (values: ColmenaFormValues) => {
    createColmena.mutate(
      { ...values, rancho_id: ranchoId, estado: "activa" },
      {
        onSuccess: () => {
          form.reset()
          onSuccess?.()
        },
      }
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Datos de la colmena</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero">Numero de colmena *</Label>
              <Input
                id="numero"
                placeholder="Ej: C-001"
                className="h-12"
                {...form.register("numero")}
              />
              {form.formState.errors.numero && (
                <p className="text-sm text-destructive">{form.formState.errors.numero.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Tipo *</Label>
              <Select
                value={form.watch("tipo") || ""}
                onValueChange={(v) => form.setValue("tipo", v as any)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_COLMENA.map((t) => (
                    <SelectItem key={t.value} value={t.value} className="h-12">
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.tipo && (
                <p className="text-sm text-destructive">{form.formState.errors.tipo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Raza de la reina</Label>
              <Select
                value={form.watch("raza_reina") || ""}
                onValueChange={(v) => form.setValue("raza_reina", v as any)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccionar raza" />
                </SelectTrigger>
                <SelectContent>
                  {RAZAS_REINA.map((r) => (
                    <SelectItem key={r.value} value={r.value} className="h-12">
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="origen_reina">Origen de la reina</Label>
              <Input
                id="origen_reina"
                placeholder="Proveedor o criadero"
                className="h-12"
                {...form.register("origen_reina")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_instalacion">Fecha de instalacion</Label>
              <Input
                id="fecha_instalacion"
                type="date"
                className="h-12"
                {...form.register("fecha_instalacion")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="num_cuadros">Numero de cuadros</Label>
              <Input
                id="num_cuadros"
                type="number"
                placeholder="10"
                className="h-12"
                {...form.register("num_cuadros")}
              />
            </div>

            <div className="space-y-2">
              <Label>Apiario *</Label>
              <Select
                value={form.watch("apiario_id") || ""}
                onValueChange={(v) => form.setValue("apiario_id", v)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccionar apiario" />
                </SelectTrigger>
                <SelectContent>
                  {apiarios?.map((a: any) => (
                    <SelectItem key={a.id} value={a.id} className="h-12">
                      {a.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.apiario_id && (
                <p className="text-sm text-destructive">{form.formState.errors.apiario_id.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-3 pt-6">
              <Checkbox
                id="tiene_alza"
                checked={form.watch("tiene_alza")}
                onCheckedChange={(checked) => form.setValue("tiene_alza", !!checked)}
                className="h-6 w-6"
              />
              <Label htmlFor="tiene_alza" className="text-base">
                Tiene alza
              </Label>
            </div>
          </div>

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
        disabled={createColmena.isPending}
      >
        {createColmena.isPending ? "Guardando..." : "Registrar colmena"}
      </Button>
    </form>
  )
}

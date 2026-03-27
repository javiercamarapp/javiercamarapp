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
import { useCreateEconomicMovement } from "@/hooks/use-economics"
import { toast } from "sonner"
import { useMemo, useState } from "react"

const CATEGORIAS_INGRESO = [
  { value: "venta_ganado", label: "Venta de ganado" },
  { value: "venta_leche", label: "Venta de leche" },
  { value: "venta_huevo", label: "Venta de huevo" },
  { value: "venta_miel", label: "Venta de miel" },
  { value: "venta_lana", label: "Venta de lana" },
  { value: "venta_otros", label: "Venta de otros productos" },
  { value: "subsidio", label: "Subsidio / Apoyo gobierno" },
  { value: "otro_ingreso", label: "Otro ingreso" },
]

const CATEGORIAS_EGRESO = [
  { value: "compra_ganado", label: "Compra de ganado" },
  { value: "alimentacion", label: "Alimentacion" },
  { value: "medicamentos", label: "Medicamentos" },
  { value: "veterinario", label: "Servicios veterinarios" },
  { value: "mano_obra", label: "Mano de obra" },
  { value: "transporte", label: "Transporte" },
  { value: "equipo", label: "Equipo e infraestructura" },
  { value: "combustible", label: "Combustible" },
  { value: "servicios", label: "Servicios (luz, agua)" },
  { value: "impuestos", label: "Impuestos" },
  { value: "otro_egreso", label: "Otro egreso" },
]

const movimientoSchema = z.object({
  tipo: z.enum(["ingreso", "egreso"], { required_error: "Selecciona el tipo" }),
  categoria: z.string().min(1, "La categoria es requerida"),
  subcategoria: z.string().optional(),
  monto: z.coerce.number().min(0.01, "El monto es requerido"),
  cantidad: z.coerce.number().min(0).optional(),
  unidad: z.string().optional(),
  precio_unitario: z.coerce.number().min(0).optional(),
  descripcion: z.string().optional(),
  fecha: z.string().min(1, "La fecha es requerida"),
  proveedor_comprador: z.string().optional(),
  metodo_pago: z.string().optional(),
  folio_fiscal: z.string().optional(),
  programa_gobierno: z.string().optional(),
  notas: z.string().optional(),
})

type MovimientoFormValues = z.infer<typeof movimientoSchema>

interface MovimientoEconomicoFormProps {
  ranchoId: string
  onSuccess?: () => void
}

export function MovimientoEconomicoForm({ ranchoId, onSuccess }: MovimientoEconomicoFormProps) {
  const [comprobante, setComprobante] = useState<File | null>(null)
  const createMovement = useCreateEconomicMovement()

  const form = useForm<MovimientoFormValues>({
    resolver: zodResolver(movimientoSchema),
    defaultValues: {
      tipo: "egreso",
      fecha: new Date().toISOString().split("T")[0],
    },
  })

  const tipoMovimiento = form.watch("tipo")
  const cantidad = form.watch("cantidad")
  const monto = form.watch("monto")

  const categorias = tipoMovimiento === "ingreso" ? CATEGORIAS_INGRESO : CATEGORIAS_EGRESO

  const precioUnitarioCalc = useMemo(() => {
    if (cantidad && cantidad > 0 && monto && monto > 0) {
      return (monto / cantidad).toFixed(2)
    }
    return null
  }, [cantidad, monto])

  const onSubmit = async (values: MovimientoFormValues) => {
    createMovement.mutate(
      {
        ...values,
        rancho_id: ranchoId,
        precio_unitario: precioUnitarioCalc ? parseFloat(precioUnitarioCalc) : values.precio_unitario,
      },
      {
        onSuccess: () => {
          toast.success(
            values.tipo === "ingreso" ? "Ingreso registrado exitosamente" : "Egreso registrado exitosamente"
          )
          form.reset({ tipo: "egreso", fecha: new Date().toISOString().split("T")[0] })
          setComprobante(null)
          onSuccess?.()
        },
      }
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Movimiento economico</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tipo toggle */}
          <div className="space-y-2">
            <Label>Tipo *</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={tipoMovimiento === "ingreso" ? "default" : "outline"}
                className={`h-12 text-base ${tipoMovimiento === "ingreso" ? "bg-green-700 hover:bg-green-800" : ""}`}
                onClick={() => {
                  form.setValue("tipo", "ingreso")
                  form.setValue("categoria", "")
                }}
              >
                Ingreso
              </Button>
              <Button
                type="button"
                variant={tipoMovimiento === "egreso" ? "default" : "outline"}
                className={`h-12 text-base ${tipoMovimiento === "egreso" ? "bg-red-700 hover:bg-red-800" : ""}`}
                onClick={() => {
                  form.setValue("tipo", "egreso")
                  form.setValue("categoria", "")
                }}
              >
                Egreso
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoria *</Label>
              <Select
                value={form.watch("categoria") || ""}
                onValueChange={(v) => form.setValue("categoria", v)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccionar categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((c) => (
                    <SelectItem key={c.value} value={c.value} className="h-12">
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.categoria && (
                <p className="text-sm text-destructive">{form.formState.errors.categoria.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategoria">Subcategoria</Label>
              <Input
                id="subcategoria"
                placeholder="Detalle adicional"
                className="h-12"
                {...form.register("subcategoria")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monto">Monto total ($) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground">
                  $
                </span>
                <Input
                  id="monto"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="h-14 text-2xl font-bold pl-8"
                  {...form.register("monto")}
                />
              </div>
              {form.formState.errors.monto && (
                <p className="text-sm text-destructive">{form.formState.errors.monto.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha *</Label>
              <Input
                id="fecha"
                type="date"
                className="h-12"
                {...form.register("fecha")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cantidad">Cantidad</Label>
              <Input
                id="cantidad"
                type="number"
                step="0.01"
                placeholder="0"
                className="h-12"
                {...form.register("cantidad")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unidad">Unidad</Label>
              <Input
                id="unidad"
                placeholder="Ej: cabezas, kg, litros"
                className="h-12"
                {...form.register("unidad")}
              />
            </div>

            {precioUnitarioCalc && (
              <div className="space-y-2">
                <Label>Precio unitario (auto)</Label>
                <div className="h-12 flex items-center px-3 rounded-md border bg-muted/50 text-lg font-medium">
                  $ {precioUnitarioCalc}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="proveedor_comprador">
                {tipoMovimiento === "ingreso" ? "Comprador" : "Proveedor"}
              </Label>
              <Input
                id="proveedor_comprador"
                placeholder={tipoMovimiento === "ingreso" ? "Nombre del comprador" : "Nombre del proveedor"}
                className="h-12"
                {...form.register("proveedor_comprador")}
              />
            </div>

            <div className="space-y-2">
              <Label>Metodo de pago</Label>
              <Select
                value={form.watch("metodo_pago") || ""}
                onValueChange={(v) => form.setValue("metodo_pago", v)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccionar metodo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efectivo" className="h-12">Efectivo</SelectItem>
                  <SelectItem value="transferencia" className="h-12">Transferencia</SelectItem>
                  <SelectItem value="cheque" className="h-12">Cheque</SelectItem>
                  <SelectItem value="tarjeta" className="h-12">Tarjeta</SelectItem>
                  <SelectItem value="otro" className="h-12">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="folio_fiscal">Folio fiscal</Label>
              <Input
                id="folio_fiscal"
                placeholder="UUID del CFDI"
                className="h-12"
                {...form.register("folio_fiscal")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="programa_gobierno">Programa de gobierno</Label>
              <Input
                id="programa_gobierno"
                placeholder="Nombre del programa"
                className="h-12"
                {...form.register("programa_gobierno")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripcion</Label>
            <Textarea
              id="descripcion"
              placeholder="Descripcion del movimiento..."
              {...form.register("descripcion")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comprobante">Comprobante</Label>
            <Input
              id="comprobante"
              type="file"
              accept="image/*,.pdf"
              className="h-12"
              onChange={(e) => setComprobante(e.target.files?.[0] || null)}
            />
            {comprobante && (
              <p className="text-sm text-muted-foreground">{comprobante.name}</p>
            )}
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
        disabled={createMovement.isPending}
      >
        {createMovement.isPending ? "Guardando..." : "Registrar movimiento"}
      </Button>
    </form>
  )
}

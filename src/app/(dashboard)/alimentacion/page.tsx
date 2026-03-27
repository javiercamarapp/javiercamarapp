"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, AlertTriangle, Package } from "lucide-react"
import { toast } from "sonner"

interface FeedProduct {
  id: string
  nombre: string
  tipo: string
  stockActual: number
  stockMinimo: number
  unidad: string
  precioKg: number
  caducidad: string
}

const MOCK_PRODUCTS: FeedProduct[] = [
  { id: "1", nombre: "Alfalfa henificada", tipo: "Forraje", stockActual: 2500, stockMinimo: 500, unidad: "kg", precioKg: 6.5, caducidad: "2026-08-15" },
  { id: "2", nombre: "Maiz molido", tipo: "Grano", stockActual: 1800, stockMinimo: 400, unidad: "kg", precioKg: 8.2, caducidad: "2026-06-30" },
  { id: "3", nombre: "Pasta de soya", tipo: "Concentrado", stockActual: 300, stockMinimo: 200, unidad: "kg", precioKg: 12.0, caducidad: "2026-05-20" },
  { id: "4", nombre: "Premezcla mineral", tipo: "Suplemento", stockActual: 150, stockMinimo: 100, unidad: "kg", precioKg: 45.0, caducidad: "2026-12-01" },
  { id: "5", nombre: "Melaza", tipo: "Suplemento", stockActual: 80, stockMinimo: 100, unidad: "kg", precioKg: 4.5, caducidad: "2026-09-30" },
  { id: "6", nombre: "Sorgo grano", tipo: "Grano", stockActual: 950, stockMinimo: 300, unidad: "kg", precioKg: 5.8, caducidad: "2026-07-15" },
]

interface ConsumoRecord {
  id: string
  fecha: string
  corral: string
  producto: string
  cantidadKg: number
}

const MOCK_CONSUMOS: ConsumoRecord[] = [
  { id: "1", fecha: "2026-03-27", corral: "Potrero Norte", producto: "Alfalfa henificada", cantidadKg: 120 },
  { id: "2", fecha: "2026-03-27", corral: "Corral 1", producto: "Maiz molido", cantidadKg: 85 },
  { id: "3", fecha: "2026-03-26", corral: "Potrero Sur", producto: "Alfalfa henificada", cantidadKg: 100 },
  { id: "4", fecha: "2026-03-26", corral: "Corral 2", producto: "Pasta de soya", cantidadKg: 30 },
  { id: "5", fecha: "2026-03-25", corral: "Potrero Norte", producto: "Premezcla mineral", cantidadKg: 15 },
  { id: "6", fecha: "2026-03-25", corral: "Corral 1", producto: "Melaza", cantidadKg: 20 },
  { id: "7", fecha: "2026-03-24", corral: "Potrero Sur", producto: "Sorgo grano", cantidadKg: 60 },
  { id: "8", fecha: "2026-03-24", corral: "Potrero Norte", producto: "Maiz molido", cantidadKg: 90 },
]

const CORRALES = ["Potrero Norte", "Potrero Sur", "Corral 1", "Corral 2"]

function StockBadge({ actual, minimo }: { actual: number; minimo: number }) {
  if (actual <= minimo) return <Badge className="bg-red-100 text-red-800 border-0">Bajo</Badge>
  if (actual <= minimo * 1.5) return <Badge className="bg-yellow-100 text-yellow-800 border-0">Medio</Badge>
  return <Badge className="bg-green-100 text-green-800 border-0">OK</Badge>
}

export default function AlimentacionPage() {
  const [dialogOpen, setDialogOpen] = useState(false)

  const lowStockProducts = MOCK_PRODUCTS.filter((p) => p.stockActual <= p.stockMinimo)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Consumo registrado")
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1B4332]">Alimentacion</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 text-base">
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Registrar consumo</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar consumo</DialogTitle>
              <DialogDescription>Registre el consumo de alimento por corral.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base">Corral</Label>
                <Select>
                  <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Seleccionar corral" /></SelectTrigger>
                  <SelectContent>
                    {CORRALES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-base">Producto</Label>
                <Select>
                  <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Seleccionar producto" /></SelectTrigger>
                  <SelectContent>
                    {MOCK_PRODUCTS.map((p) => <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-base">Cantidad (kg)</Label>
                <Input type="number" placeholder="0" className="h-12 text-base" />
              </div>
              <div className="space-y-2">
                <Label className="text-base">Fecha</Label>
                <Input type="date" className="h-12 text-base" defaultValue={new Date().toISOString().split("T")[0]} />
              </div>
              <Button type="submit" className="w-full h-12 text-base">
                Guardar consumo
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Low stock alerts */}
      {lowStockProducts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <p className="font-semibold text-base text-orange-800">Alerta de stock bajo</p>
            </div>
            <div className="space-y-2">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-base">
                  <span>{p.nombre}</span>
                  <span className="font-medium text-orange-800">{p.stockActual} {p.unidad} (min: {p.stockMinimo})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feed inventory cards */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Package className="h-5 w-5" />
          Inventario de alimentos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_PRODUCTS.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-base">{product.nombre}</p>
                    <p className="text-sm text-muted-foreground">{product.tipo}</p>
                  </div>
                  <StockBadge actual={product.stockActual} minimo={product.stockMinimo} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Stock actual</p>
                    <p className="font-medium text-base">{product.stockActual.toLocaleString()} {product.unidad}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Precio/kg</p>
                    <p className="font-medium text-base">${product.precioKg}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Caducidad</p>
                    <p className="font-medium text-base">{product.caducidad}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Consumption history */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Historial de consumo</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Corral</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_CONSUMOS.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="text-base">{c.fecha}</TableCell>
                  <TableCell className="text-base">{c.corral}</TableCell>
                  <TableCell className="text-base">{c.producto}</TableCell>
                  <TableCell className="text-base text-right font-medium">{c.cantidadKg} kg</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

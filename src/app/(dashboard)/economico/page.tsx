"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { toast } from "sonner"

interface Transaction {
  id: string
  fecha: string
  tipo: "ingreso" | "egreso"
  categoria: string
  descripcion: string
  monto: number
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "1", fecha: "2026-03-25", tipo: "ingreso", categoria: "Venta de ganado", descripcion: "3 novillos a rastro", monto: 48500 },
  { id: "2", fecha: "2026-03-22", tipo: "egreso", categoria: "Alimentacion", descripcion: "Compra maiz molido 2 ton", monto: 16400 },
  { id: "3", fecha: "2026-03-20", tipo: "egreso", categoria: "Sanidad", descripcion: "Vacunas clostridiosis lote completo", monto: 3200 },
  { id: "4", fecha: "2026-03-18", tipo: "ingreso", categoria: "Venta de leche", descripcion: "Entrega quincenal 850L", monto: 12750 },
  { id: "5", fecha: "2026-03-15", tipo: "egreso", categoria: "Mano de obra", descripcion: "Nomina quincenal 2 vaqueros", monto: 9000 },
  { id: "6", fecha: "2026-03-12", tipo: "egreso", categoria: "Veterinario", descripcion: "Consulta y cirugia descorne", monto: 2500 },
  { id: "7", fecha: "2026-03-10", tipo: "ingreso", categoria: "Venta de becerros", descripcion: "5 becerros al destete", monto: 75000 },
  { id: "8", fecha: "2026-03-08", tipo: "egreso", categoria: "Combustible", descripcion: "Diesel para tractor", monto: 4200 },
  { id: "9", fecha: "2026-03-05", tipo: "egreso", categoria: "Mantenimiento", descripcion: "Reparacion de cerca potrero norte", monto: 3800 },
  { id: "10", fecha: "2026-03-02", tipo: "ingreso", categoria: "Venta de leche", descripcion: "Entrega quincenal 920L", monto: 13800 },
  { id: "11", fecha: "2026-02-28", tipo: "egreso", categoria: "Alimentacion", descripcion: "Compra alfalfa henificada", monto: 12500 },
  { id: "12", fecha: "2026-02-25", tipo: "egreso", categoria: "Mano de obra", descripcion: "Nomina quincenal 2 vaqueros", monto: 9000 },
]

const CATEGORIAS_INGRESO = ["Venta de ganado", "Venta de leche", "Venta de becerros", "Subsidios", "Otros ingresos"]
const CATEGORIAS_EGRESO = ["Alimentacion", "Sanidad", "Mano de obra", "Veterinario", "Combustible", "Mantenimiento", "Equipo", "Otros gastos"]

export default function EconomicoPage() {
  const [activeTab, setActiveTab] = useState("resumen")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [tipoMovimiento, setTipoMovimiento] = useState<"ingreso" | "egreso">("ingreso")
  const [filterCategoria, setFilterCategoria] = useState("todos")

  const totalIngresos = MOCK_TRANSACTIONS.filter((t) => t.tipo === "ingreso").reduce((s, t) => s + t.monto, 0)
  const totalEgresos = MOCK_TRANSACTIONS.filter((t) => t.tipo === "egreso").reduce((s, t) => s + t.monto, 0)
  const balance = totalIngresos - totalEgresos

  const filteredTransactions = MOCK_TRANSACTIONS.filter((t) => {
    if (activeTab === "ingresos" && t.tipo !== "ingreso") return false
    if (activeTab === "egresos" && t.tipo !== "egreso") return false
    if (filterCategoria !== "todos" && t.categoria !== filterCategoria) return false
    return true
  })

  const currentCategories = activeTab === "ingresos" ? CATEGORIAS_INGRESO : activeTab === "egresos" ? CATEGORIAS_EGRESO : [...CATEGORIAS_INGRESO, ...CATEGORIAS_EGRESO]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success(`${tipoMovimiento === "ingreso" ? "Ingreso" : "Egreso"} registrado`)
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1B4332]">Economico</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 text-base">
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Registrar movimiento</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar movimiento</DialogTitle>
              <DialogDescription>Registre un ingreso o egreso economico.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base">Tipo</Label>
                <Select value={tipoMovimiento} onValueChange={(v) => setTipoMovimiento(v as "ingreso" | "egreso")}>
                  <SelectTrigger className="h-12 text-base"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ingreso">Ingreso</SelectItem>
                    <SelectItem value="egreso">Egreso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-base">Categoria</Label>
                <Select>
                  <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Seleccionar categoria" /></SelectTrigger>
                  <SelectContent>
                    {(tipoMovimiento === "ingreso" ? CATEGORIAS_INGRESO : CATEGORIAS_EGRESO).map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-base">Monto (MXN)</Label>
                <Input type="number" placeholder="0.00" className="h-12 text-base" />
              </div>
              <div className="space-y-2">
                <Label className="text-base">Fecha</Label>
                <Input type="date" className="h-12 text-base" defaultValue={new Date().toISOString().split("T")[0]} />
              </div>
              <div className="space-y-2">
                <Label className="text-base">Descripcion</Label>
                <Textarea placeholder="Descripcion del movimiento..." className="text-base" />
              </div>
              <Button type="submit" className="w-full h-12 text-base">
                Guardar movimiento
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total ingresos</p>
                <p className="text-2xl font-bold text-green-600">${totalIngresos.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total egresos</p>
                <p className="text-2xl font-bold text-red-600">${totalEgresos.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full ${balance >= 0 ? "bg-green-100" : "bg-red-100"} flex items-center justify-center shrink-0`}>
                <DollarSign className={`h-5 w-5 ${balance >= 0 ? "text-green-600" : "text-red-600"}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ${balance.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Chart Placeholder */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Ingresos vs Egresos mensuales</CardTitle></CardHeader>
        <CardContent>
          <div className="h-48 rounded-lg bg-muted/50 border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
            <p className="text-muted-foreground text-base">Grafica de barras mensual - Conectar con Recharts</p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs + Transactions */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full h-12">
          <TabsTrigger value="resumen" className="flex-1 min-h-[48px] text-base">Resumen</TabsTrigger>
          <TabsTrigger value="ingresos" className="flex-1 min-h-[48px] text-base">Ingresos</TabsTrigger>
          <TabsTrigger value="egresos" className="flex-1 min-h-[48px] text-base">Egresos</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          {/* Filter */}
          <div className="mb-4">
            <Select value={filterCategoria} onValueChange={setFilterCategoria}>
              <SelectTrigger className="w-[200px] h-12 text-base">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las categorias</SelectItem>
                {currentCategories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="hidden sm:table-cell">Categoria</TableHead>
                    <TableHead className="hidden md:table-cell">Descripcion</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="text-base">{t.fecha}</TableCell>
                      <TableCell>
                        <Badge className={`border-0 ${t.tipo === "ingreso" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {t.tipo === "ingreso" ? "Ingreso" : "Egreso"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-base">{t.categoria}</TableCell>
                      <TableCell className="hidden md:table-cell text-base">{t.descripcion}</TableCell>
                      <TableCell className={`text-base text-right font-medium ${t.tipo === "ingreso" ? "text-green-600" : "text-red-600"}`}>
                        {t.tipo === "ingreso" ? "+" : "-"}${t.monto.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  )
}

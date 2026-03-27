"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { toast } from "sonner"

interface ReproKPI {
  label: string
  value: string
  suffix: string
  color: string
}

const KPIS: ReproKPI[] = [
  { label: "Tasa prenez", value: "65", suffix: "%", color: "text-green-600" },
  { label: "Servicios/concepcion", value: "1.8", suffix: "", color: "text-blue-600" },
  { label: "IPP", value: "380", suffix: "d", color: "text-orange-600" },
  { label: "Tasa destete", value: "85", suffix: "%", color: "text-purple-600" },
]

interface AnimalRepro {
  id: string
  arete: string
  nombre: string
  estado: "vacia" | "servida" | "gestante" | "lactando"
  diasEnEstado: number
}

const MOCK_ANIMALS: AnimalRepro[] = [
  { id: "1", arete: "MX-001", nombre: "Ixchel", estado: "gestante", diasEnEstado: 107 },
  { id: "2", arete: "MX-005", nombre: "Xtabay", estado: "gestante", diasEnEstado: 85 },
  { id: "3", arete: "MX-007", nombre: "Ixtab", estado: "lactando", diasEnEstado: 45 },
  { id: "4", arete: "MX-010", nombre: "Xbalanque", estado: "vacia", diasEnEstado: 120 },
  { id: "5", arete: "MX-011", nombre: "Itzamara", estado: "servida", diasEnEstado: 15 },
  { id: "6", arete: "MX-012", nombre: "Nicte Ha", estado: "servida", diasEnEstado: 8 },
  { id: "7", arete: "MX-013", nombre: "Zazil", estado: "vacia", diasEnEstado: 200 },
  { id: "8", arete: "MX-014", nombre: "Sacnicte", estado: "lactando", diasEnEstado: 90 },
  { id: "9", arete: "MX-015", nombre: "Xunaan", estado: "gestante", diasEnEstado: 210 },
  { id: "10", arete: "MX-016", nombre: "Zuhuy", estado: "vacia", diasEnEstado: 60 },
  { id: "11", arete: "MX-017", nombre: "Lool", estado: "lactando", diasEnEstado: 30 },
  { id: "12", arete: "MX-018", nombre: "Kanik", estado: "gestante", diasEnEstado: 150 },
]

const ESTADO_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  vacia: { label: "Vacias", color: "text-gray-700", bgColor: "bg-gray-100" },
  servida: { label: "Servidas", color: "text-blue-700", bgColor: "bg-blue-100" },
  gestante: { label: "Gestantes", color: "text-purple-700", bgColor: "bg-purple-100" },
  lactando: { label: "Lactando", color: "text-pink-700", bgColor: "bg-pink-100" },
}

const ESTADOS_REPRO = ["vacia", "servida", "gestante", "lactando"] as const

export default function ReproduccionPage() {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleSubmitEvento = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Evento reproductivo registrado")
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1B4332]">Reproduccion</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 text-base">
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Registrar evento</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar evento reproductivo</DialogTitle>
              <DialogDescription>Complete los datos del evento reproductivo.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitEvento} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base">Tipo de evento</Label>
                <Select>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="celo">Deteccion de celo</SelectItem>
                    <SelectItem value="servicio_ia">Servicio (IA)</SelectItem>
                    <SelectItem value="servicio_monta">Servicio (monta natural)</SelectItem>
                    <SelectItem value="diagnostico_gestacion">Diagnostico de gestacion</SelectItem>
                    <SelectItem value="parto">Parto</SelectItem>
                    <SelectItem value="destete">Destete</SelectItem>
                    <SelectItem value="aborto">Aborto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-base">Animal</Label>
                <Select>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Seleccionar animal" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_ANIMALS.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.arete} - {a.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-base">Fecha</Label>
                <Input type="date" className="h-12 text-base" defaultValue={new Date().toISOString().split("T")[0]} />
              </div>
              <div className="space-y-2">
                <Label className="text-base">Toro / Semental</Label>
                <Select>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Seleccionar toro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="t1">MX-002 - Kukulcan</SelectItem>
                    <SelectItem value="t2">MX-003 - Chaac</SelectItem>
                    <SelectItem value="t3">MX-008 - Kinich Ahau</SelectItem>
                    <SelectItem value="semen">Semen importado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-base">Notas</Label>
                <Textarea placeholder="Observaciones..." className="text-base" />
              </div>
              <Button type="submit" className="w-full h-12 text-base">
                Guardar evento
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {KPIS.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
              <p className={`text-3xl font-bold ${kpi.color}`}>
                {kpi.value}<span className="text-lg">{kpi.suffix}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ESTADOS_REPRO.map((estado) => {
          const config = ESTADO_CONFIG[estado]
          const animals = MOCK_ANIMALS.filter((a) => a.estado === estado)
          return (
            <div key={estado} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold text-base ${config.color}`}>{config.label}</h3>
                <Badge className={`${config.bgColor} ${config.color} border-0`}>{animals.length}</Badge>
              </div>
              <div className="space-y-2">
                {animals.map((animal) => (
                  <Card key={animal.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-base">{animal.arete}</p>
                          <p className="text-sm text-muted-foreground">{animal.nombre}</p>
                        </div>
                        <Badge variant="outline" className="text-sm shrink-0">
                          {animal.diasEnEstado}d
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

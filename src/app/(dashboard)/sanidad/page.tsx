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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, AlertTriangle, Calendar } from "lucide-react"
import { toast } from "sonner"

interface HealthEvent {
  id: string
  fecha: string
  animal: string
  animalNombre: string
  tipo: string
  producto: string
  dosis: string
  via: string
  veterinario: string
  notas: string
}

const MOCK_EVENTS: HealthEvent[] = [
  { id: "1", fecha: "2026-03-25", animal: "MX-001", animalNombre: "Ixchel", tipo: "Vacunacion", producto: "Clostridiosis 7 vias", dosis: "5 ml", via: "SC", veterinario: "Dr. Lopez", notas: "" },
  { id: "2", fecha: "2026-03-20", animal: "MX-002", animalNombre: "Kukulcan", tipo: "Desparasitacion", producto: "Ivermectina 1%", dosis: "12 ml", via: "SC", veterinario: "Dr. Lopez", notas: "" },
  { id: "3", fecha: "2026-03-18", animal: "MX-006", animalNombre: "Ah Puch", tipo: "Tratamiento", producto: "Oxitetraciclina LA", dosis: "15 ml", via: "IM", veterinario: "Dr. Martinez", notas: "Infeccion respiratoria" },
  { id: "4", fecha: "2026-03-15", animal: "MX-007", animalNombre: "Ixtab", tipo: "Vacunacion", producto: "Rabia paralitica", dosis: "2 ml", via: "IM", veterinario: "Dr. Lopez", notas: "" },
  { id: "5", fecha: "2026-03-10", animal: "MX-003", animalNombre: "Chaac", tipo: "Cirugia", producto: "Descorne", dosis: "-", via: "-", veterinario: "Dr. Martinez", notas: "Procedimiento sin complicaciones" },
  { id: "6", fecha: "2026-03-05", animal: "MX-010", animalNombre: "Xbalanque", tipo: "Laboratorio", producto: "Prueba brucelosis", dosis: "-", via: "-", veterinario: "Dr. Lopez", notas: "Resultado negativo" },
  { id: "7", fecha: "2026-02-28", animal: "MX-005", animalNombre: "Xtabay", tipo: "Desparasitacion", producto: "Albendazol", dosis: "20 ml", via: "Oral", veterinario: "Dr. Lopez", notas: "" },
  { id: "8", fecha: "2026-02-20", animal: "MX-008", animalNombre: "Kinich Ahau", tipo: "Vacunacion", producto: "IBR-DVB-PI3", dosis: "5 ml", via: "IM", veterinario: "Dr. Martinez", notas: "" },
]

const MOCK_RETIROS = [
  { animal: "MX-006", nombre: "Ah Puch", producto: "Oxitetraciclina LA", fechaAplicacion: "2026-03-18", diasRetiro: 28, diasRestantes: 19 },
  { animal: "MX-005", nombre: "Xtabay", producto: "Albendazol", fechaAplicacion: "2026-02-28", diasRetiro: 14, diasRestantes: 0 },
]

const MOCK_PROXIMAS_VACUNAS = [
  { animal: "MX-002", nombre: "Kukulcan", vacuna: "Clostridiosis 7 vias", fechaProgramada: "2026-04-15", diasRestantes: 19 },
  { animal: "MX-003", nombre: "Chaac", vacuna: "Rabia paralitica", fechaProgramada: "2026-04-20", diasRestantes: 24 },
  { animal: "MX-010", nombre: "Xbalanque", vacuna: "Clostridiosis 7 vias", fechaProgramada: "2026-04-25", diasRestantes: 29 },
  { animal: "MX-001", nombre: "Ixchel", vacuna: "IBR-DVB-PI3", fechaProgramada: "2026-05-01", diasRestantes: 35 },
]

function TipoBadge({ tipo }: { tipo: string }) {
  const colors: Record<string, string> = {
    Vacunacion: "bg-blue-100 text-blue-800",
    Desparasitacion: "bg-purple-100 text-purple-800",
    Tratamiento: "bg-orange-100 text-orange-800",
    Cirugia: "bg-red-100 text-red-800",
    Laboratorio: "bg-teal-100 text-teal-800",
  }
  return <Badge className={`${colors[tipo] || "bg-gray-100 text-gray-800"} border-0`}>{tipo}</Badge>
}

export default function SanidadPage() {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Evento sanitario registrado")
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1B4332]">Sanidad</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 text-base">
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Registrar evento</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar evento sanitario</DialogTitle>
              <DialogDescription>Complete los datos del evento sanitario.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base">Tipo</Label>
                <Select>
                  <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Seleccionar tipo" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacunacion">Vacunacion</SelectItem>
                    <SelectItem value="desparasitacion">Desparasitacion</SelectItem>
                    <SelectItem value="tratamiento">Tratamiento</SelectItem>
                    <SelectItem value="cirugia">Cirugia</SelectItem>
                    <SelectItem value="laboratorio">Laboratorio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-base">Animal</Label>
                <Select>
                  <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Seleccionar animal" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MX-001">MX-001 - Ixchel</SelectItem>
                    <SelectItem value="MX-002">MX-002 - Kukulcan</SelectItem>
                    <SelectItem value="MX-003">MX-003 - Chaac</SelectItem>
                    <SelectItem value="MX-005">MX-005 - Xtabay</SelectItem>
                    <SelectItem value="MX-006">MX-006 - Ah Puch</SelectItem>
                    <SelectItem value="MX-007">MX-007 - Ixtab</SelectItem>
                    <SelectItem value="MX-008">MX-008 - Kinich Ahau</SelectItem>
                    <SelectItem value="MX-010">MX-010 - Xbalanque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-base">Producto</Label>
                <Input placeholder="Nombre del producto" className="h-12 text-base" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-base">Dosis</Label>
                  <Input placeholder="Ej. 5 ml" className="h-12 text-base" />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Via</Label>
                  <Select>
                    <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Via" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IM">IM</SelectItem>
                      <SelectItem value="SC">SC</SelectItem>
                      <SelectItem value="IV">IV</SelectItem>
                      <SelectItem value="Oral">Oral</SelectItem>
                      <SelectItem value="Topica">Topica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-base">Fecha</Label>
                <Input type="date" className="h-12 text-base" defaultValue={new Date().toISOString().split("T")[0]} />
              </div>
              <div className="space-y-2">
                <Label className="text-base">Veterinario</Label>
                <Input placeholder="Nombre del veterinario" className="h-12 text-base" />
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

      {/* Retiros activos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Retiros activos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {MOCK_RETIROS.length === 0 ? (
            <p className="text-base text-muted-foreground text-center py-4">No hay retiros activos</p>
          ) : (
            <div className="space-y-3">
              {MOCK_RETIROS.map((r, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${r.diasRestantes > 0 ? "bg-orange-50 border border-orange-200" : "bg-green-50 border border-green-200"}`}>
                  <div>
                    <p className="font-medium text-base">{r.animal} - {r.nombre}</p>
                    <p className="text-sm text-muted-foreground">{r.producto} - Aplicado: {r.fechaAplicacion}</p>
                  </div>
                  <Badge className={`border-0 ${r.diasRestantes > 0 ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"}`}>
                    {r.diasRestantes > 0 ? `${r.diasRestantes}d restantes` : "Liberado"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Proximas vacunas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Proximas vacunas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MOCK_PROXIMAS_VACUNAS.map((v, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div>
                  <p className="font-medium text-base">{v.animal} - {v.nombre}</p>
                  <p className="text-sm text-muted-foreground">{v.vacuna}</p>
                </div>
                <div className="text-right shrink-0">
                  <Badge className="bg-blue-100 text-blue-800 border-0">
                    En {v.diasRestantes}d
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{v.fechaProgramada}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Eventos table */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Historial de eventos</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Animal</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="hidden sm:table-cell">Producto</TableHead>
                <TableHead className="hidden md:table-cell">Veterinario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_EVENTS.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="text-base">{event.fecha}</TableCell>
                  <TableCell className="text-base">
                    <div>
                      <p className="font-medium">{event.animal}</p>
                      <p className="text-sm text-muted-foreground">{event.animalNombre}</p>
                    </div>
                  </TableCell>
                  <TableCell><TipoBadge tipo={event.tipo} /></TableCell>
                  <TableCell className="hidden sm:table-cell text-base">{event.producto}</TableCell>
                  <TableCell className="hidden md:table-cell text-base">{event.veterinario}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

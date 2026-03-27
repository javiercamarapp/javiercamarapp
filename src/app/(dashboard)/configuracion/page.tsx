"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
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
import { SpeciesIcon } from "@/components/icons/species-icons"
import { Plus, Edit, Trash2, Users, MapPin, Settings } from "lucide-react"
import { toast } from "sonner"

const MOCK_RANCH = {
  nombre: "Rancho El Cenote",
  ubicacion: "Tizimin, Yucatan, Mexico",
  hectareas: 320,
  tipoProduccion: "Doble proposito",
  speciesEnabled: ["bovino", "abeja"],
}

const SPECIES_NAMES: Record<string, string> = {
  bovino: "Bovinos",
  porcino: "Porcinos",
  ovino: "Ovinos",
  caprino: "Caprinos",
  ave: "Aves",
  abeja: "Abejas",
  equido: "Equidos",
  conejo: "Conejos",
  diversificado: "Diversificados",
}

interface Corral {
  id: string
  nombre: string
  tipo: string
  capacidad: number
  animalesActuales: number
}

const MOCK_CORRALES: Corral[] = [
  { id: "1", nombre: "Potrero Norte", tipo: "Pastoreo", capacidad: 80, animalesActuales: 45 },
  { id: "2", nombre: "Potrero Sur", tipo: "Pastoreo", capacidad: 60, animalesActuales: 38 },
  { id: "3", nombre: "Corral 1", tipo: "Corral", capacidad: 30, animalesActuales: 22 },
  { id: "4", nombre: "Corral 2", tipo: "Corral", capacidad: 25, animalesActuales: 15 },
  { id: "5", nombre: "Corral 3", tipo: "Corral", capacidad: 20, animalesActuales: 0 },
  { id: "6", nombre: "Maternidad", tipo: "Especial", capacidad: 10, animalesActuales: 3 },
]

interface User {
  id: string
  nombre: string
  email: string
  rol: "propietario" | "administrador" | "vaquero" | "veterinario" | "invitado"
  ultimoAcceso: string
}

const MOCK_USERS: User[] = [
  { id: "1", nombre: "Juan Carlos Perez", email: "juan@rancho.com", rol: "propietario", ultimoAcceso: "2026-03-27" },
  { id: "2", nombre: "Maria Elena Gomez", email: "maria@rancho.com", rol: "administrador", ultimoAcceso: "2026-03-27" },
  { id: "3", nombre: "Pedro Canul", email: "pedro@rancho.com", rol: "vaquero", ultimoAcceso: "2026-03-26" },
  { id: "4", nombre: "Dr. Alberto Lopez", email: "alopez@vet.com", rol: "veterinario", ultimoAcceso: "2026-03-20" },
  { id: "5", nombre: "Ana Garcia", email: "ana@mail.com", rol: "invitado", ultimoAcceso: "2026-03-15" },
]

const ROL_COLORS: Record<string, string> = {
  propietario: "bg-[#1B4332]/10 text-[#1B4332]",
  administrador: "bg-blue-100 text-blue-800",
  vaquero: "bg-orange-100 text-orange-800",
  veterinario: "bg-purple-100 text-purple-800",
  invitado: "bg-gray-100 text-gray-600",
}

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState("rancho")
  const [corralDialogOpen, setCorralDialogOpen] = useState(false)
  const [userDialogOpen, setUserDialogOpen] = useState(false)

  const handleSaveCorral = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Corral guardado")
    setCorralDialogOpen(false)
  }

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Invitacion enviada")
    setUserDialogOpen(false)
  }

  const handleDeleteCorral = (nombre: string) => {
    toast.success(`Corral "${nombre}" eliminado`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-[#1B4332]" />
        <h1 className="text-2xl font-bold text-[#1B4332]">Configuracion</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full h-12">
          <TabsTrigger value="rancho" className="flex-1 min-h-[48px] text-base">Mi rancho</TabsTrigger>
          <TabsTrigger value="corrales" className="flex-1 min-h-[48px] text-base">Corrales</TabsTrigger>
          <TabsTrigger value="usuarios" className="flex-1 min-h-[48px] text-base">Usuarios</TabsTrigger>
        </TabsList>

        {/* Mi rancho */}
        <TabsContent value="rancho" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Informacion del rancho</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <p className="font-medium text-lg">{MOCK_RANCH.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ubicacion</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {MOCK_RANCH.ubicacion}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Superficie</p>
                  <p className="font-medium">{MOCK_RANCH.hectareas} hectareas</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de produccion</p>
                  <p className="font-medium">{MOCK_RANCH.tipoProduccion}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Especies habilitadas</CardTitle></CardHeader>
            <CardContent>
              <div className="flex gap-3 flex-wrap">
                {MOCK_RANCH.speciesEnabled.map((sp) => (
                  <div key={sp} className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-[#1B4332]/20 bg-[#1B4332]/5">
                    <SpeciesIcon species={sp} size={32} />
                    <span className="text-base font-medium">{SPECIES_NAMES[sp]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Corrales */}
        <TabsContent value="corrales" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Dialog open={corralDialogOpen} onOpenChange={setCorralDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-12 text-base">
                  <Plus className="h-5 w-5" />
                  Agregar corral
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Agregar corral</DialogTitle>
                  <DialogDescription>Complete los datos del nuevo corral.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSaveCorral} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-base">Nombre</Label>
                    <Input placeholder="Ej. Potrero Este" className="h-12 text-base" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base">Tipo</Label>
                    <Select>
                      <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Seleccionar tipo" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pastoreo">Pastoreo</SelectItem>
                        <SelectItem value="corral">Corral</SelectItem>
                        <SelectItem value="especial">Especial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base">Capacidad</Label>
                    <Input type="number" placeholder="0" className="h-12 text-base" />
                  </div>
                  <Button type="submit" className="w-full h-12 text-base">Guardar</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="hidden sm:table-cell">Tipo</TableHead>
                    <TableHead>Capacidad</TableHead>
                    <TableHead className="hidden sm:table-cell">Actuales</TableHead>
                    <TableHead className="w-[100px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_CORRALES.map((corral) => (
                    <TableRow key={corral.id}>
                      <TableCell className="text-base font-medium">{corral.nombre}</TableCell>
                      <TableCell className="hidden sm:table-cell text-base">
                        <Badge variant="outline">{corral.tipo}</Badge>
                      </TableCell>
                      <TableCell className="text-base">{corral.capacidad}</TableCell>
                      <TableCell className="hidden sm:table-cell text-base">
                        <span className={corral.animalesActuales >= corral.capacidad * 0.9 ? "text-red-600 font-medium" : ""}>
                          {corral.animalesActuales}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            className="h-10 w-10"
                            onClick={() => toast.success("Editar corral")}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            className="h-10 w-10 text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteCorral(corral.nombre)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usuarios */}
        <TabsContent value="usuarios" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-12 text-base">
                  <Users className="h-5 w-5" />
                  Invitar usuario
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Invitar usuario</DialogTitle>
                  <DialogDescription>Envie una invitacion a un nuevo usuario.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleInviteUser} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-base">Nombre</Label>
                    <Input placeholder="Nombre completo" className="h-12 text-base" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base">Email</Label>
                    <Input type="email" placeholder="correo@ejemplo.com" className="h-12 text-base" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base">Rol</Label>
                    <Select>
                      <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Seleccionar rol" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="administrador">Administrador</SelectItem>
                        <SelectItem value="vaquero">Vaquero</SelectItem>
                        <SelectItem value="veterinario">Veterinario</SelectItem>
                        <SelectItem value="invitado">Invitado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full h-12 text-base">Enviar invitacion</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {MOCK_USERS.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-[#1B4332]/10 flex items-center justify-center shrink-0">
                      <span className="text-lg font-bold text-[#1B4332]">
                        {user.nombre.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-base">{user.nombre}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge className={`${ROL_COLORS[user.rol]} border-0 capitalize`}>{user.rol}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">Ultimo: {user.ultimoAcceso}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

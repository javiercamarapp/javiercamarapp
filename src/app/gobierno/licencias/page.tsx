'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Key, CheckCircle2, Clock, XCircle, Plus, Send, Download } from 'lucide-react'
import { exportToCSV } from '@/lib/utils/export-csv'

type Productor = {
  nombre: string
  email: string
  municipio: string
  cabezas: number
  estado: 'Activa' | 'Pendiente' | 'Expirada'
  fechaActivacion: string
}

const initialProductores: Productor[] = [
  { nombre: 'Juan P\u00e9rez Garc\u00eda', email: 'juan.perez@correo.com', municipio: 'Aldama', cabezas: 45, estado: 'Activa', fechaActivacion: '15 ene 2026' },
  { nombre: 'Mar\u00eda L\u00f3pez Torres', email: 'maria.lopez@correo.com', municipio: 'Delicias', cabezas: 32, estado: 'Activa', fechaActivacion: '20 ene 2026' },
  { nombre: 'Roberto Hern\u00e1ndez', email: 'roberto.h@correo.com', municipio: 'Camargo', cabezas: 28, estado: 'Activa', fechaActivacion: '3 feb 2026' },
  { nombre: 'Ana Mart\u00ednez Ruiz', email: 'ana.martinez@correo.com', municipio: 'Jim\u00e9nez', cabezas: 15, estado: 'Pendiente', fechaActivacion: '-' },
  { nombre: 'Carlos Dom\u00ednguez', email: 'carlos.d@correo.com', municipio: 'Aldama', cabezas: 50, estado: 'Activa', fechaActivacion: '10 feb 2026' },
  { nombre: 'Laura S\u00e1nchez', email: 'laura.s@correo.com', municipio: 'Saucillo', cabezas: 20, estado: 'Pendiente', fechaActivacion: '-' },
  { nombre: 'Pedro Ram\u00edrez', email: 'pedro.r@correo.com', municipio: 'Delicias', cabezas: 38, estado: 'Activa', fechaActivacion: '22 feb 2026' },
  { nombre: 'Sof\u00eda Guti\u00e9rrez', email: 'sofia.g@correo.com', municipio: 'Camargo', cabezas: 42, estado: 'Expirada', fechaActivacion: '5 ene 2025' },
]

const municipios = ['Aldama', 'Delicias', 'Camargo', 'Jim\u00e9nez', 'Saucillo']

function EstadoBadge({ estado }: { estado: string }) {
  if (estado === 'Activa') {
    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
        <CheckCircle2 className="h-3 w-3" />
        Activa
      </Badge>
    )
  }
  if (estado === 'Pendiente') {
    return (
      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 gap-1">
        <Clock className="h-3 w-3" />
        Pendiente
      </Badge>
    )
  }
  return (
    <Badge className="bg-red-100 text-red-700 hover:bg-red-100 gap-1">
      <XCircle className="h-3 w-3" />
      Expirada
    </Badge>
  )
}

export default function LicenciasPage() {
  const [productores, setProductores] = useState<Productor[]>(initialProductores)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formNombre, setFormNombre] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formMunicipio, setFormMunicipio] = useState('')
  const [reminderSent, setReminderSent] = useState<Record<string, boolean>>({})

  const totalCompradas = 1000
  const activadas = productores.filter(p => p.estado === 'Activa').length
  const pendientes = productores.filter(p => p.estado === 'Pendiente').length
  const disponibles = totalCompradas - productores.length

  const resumen = [
    { label: 'Compradas', valor: totalCompradas.toLocaleString('es-MX'), color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Activadas', valor: activadas.toLocaleString('es-MX'), color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Disponibles', valor: disponibles.toLocaleString('es-MX'), color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  function handleAsignar() {
    if (!formNombre || !formEmail || !formMunicipio) return
    const nuevo: Productor = {
      nombre: formNombre,
      email: formEmail,
      municipio: formMunicipio,
      cabezas: 0,
      estado: 'Pendiente',
      fechaActivacion: '-',
    }
    setProductores([...productores, nuevo])
    setFormNombre('')
    setFormEmail('')
    setFormMunicipio('')
    setDialogOpen(false)
  }

  function handleRecordatorio(nombre: string) {
    setReminderSent(prev => ({ ...prev, [nombre]: true }))
    // En demo se simula el envio
    setTimeout(() => {
      setReminderSent(prev => ({ ...prev, [nombre]: false }))
    }, 3000)
  }

  function handleExportCSV() {
    const data = productores.map(p => ({
      Nombre: p.nombre,
      Email: p.email,
      Municipio: p.municipio,
      Cabezas: p.cabezas,
      Estado: p.estado,
      'Fecha Activaci\u00f3n': p.fechaActivacion,
    }))
    exportToCSV(data, 'licencias_productores')
  }

  const pctActivadas = Math.round((activadas / totalCompradas) * 100)

  return (
    <div className="space-y-6 mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Key className="h-6 w-6 text-blue-600" />
            Gesti\u00f3n de Licencias
          </h2>
          <p className="text-muted-foreground">
            Administraci\u00f3n de licencias HatoAI para productores del programa
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Asignar Licencia
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Asignar Nueva Licencia</DialogTitle>
                <DialogDescription>
                  Ingresa los datos del productor para asignarle una licencia de HatoAI.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre completo</Label>
                  <Input
                    id="nombre"
                    placeholder="Nombre del productor"
                    value={formNombre}
                    onChange={(e) => setFormNombre(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electr\u00f3nico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="municipio">Municipio</Label>
                  <Select value={formMunicipio} onValueChange={setFormMunicipio}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar municipio" />
                    </SelectTrigger>
                    <SelectContent>
                      {municipios.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAsignar} disabled={!formNombre || !formEmail || !formMunicipio}>
                  Asignar Licencia
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-3 gap-4">
        {resumen.map((item) => (
          <Card key={item.label} className={item.bg}>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className={`text-3xl font-bold ${item.color}`}>{item.valor}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Barra de progreso */}
      <Card>
        <CardContent className="pt-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Licencias activadas</span>
            <span className="font-bold">{pctActivadas}% ({activadas.toLocaleString('es-MX')} de {totalCompradas.toLocaleString('es-MX')})</span>
          </div>
          <Progress value={pctActivadas} className="h-3" />
        </CardContent>
      </Card>

      {/* Tabla de productores */}
      <Card>
        <CardHeader>
          <CardTitle>Productores</CardTitle>
          <CardDescription>Estado de activaci\u00f3n por productor</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Productor</TableHead>
                <TableHead>Municipio</TableHead>
                <TableHead className="text-right">Cabezas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Activaci\u00f3n</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productores.map((p) => (
                <TableRow key={p.nombre}>
                  <TableCell className="font-medium">{p.nombre}</TableCell>
                  <TableCell>{p.municipio}</TableCell>
                  <TableCell className="text-right">{p.cabezas.toLocaleString('es-MX')}</TableCell>
                  <TableCell>
                    <EstadoBadge estado={p.estado} />
                  </TableCell>
                  <TableCell>{p.fechaActivacion}</TableCell>
                  <TableCell className="text-right">
                    {(p.estado === 'Pendiente' || p.estado === 'Expirada') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-blue-600 hover:text-blue-700"
                        onClick={() => handleRecordatorio(p.nombre)}
                        disabled={reminderSent[p.nombre]}
                      >
                        <Send className="h-3 w-3" />
                        {reminderSent[p.nombre] ? 'Enviado' : 'Enviar recordatorio'}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

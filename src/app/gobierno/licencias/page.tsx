import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Key, CheckCircle2, Clock, XCircle } from 'lucide-react'

const resumen = [
  { label: 'Compradas', valor: 1000, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Activadas', valor: 450, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Disponibles', valor: 550, color: 'text-amber-600', bg: 'bg-amber-50' },
]

const productores = [
  { nombre: 'Juan Pérez García', municipio: 'Aldama', cabezas: 45, estado: 'Activa', fechaActivacion: '15 ene 2026' },
  { nombre: 'María López Torres', municipio: 'Delicias', cabezas: 32, estado: 'Activa', fechaActivacion: '20 ene 2026' },
  { nombre: 'Roberto Hernández', municipio: 'Camargo', cabezas: 28, estado: 'Activa', fechaActivacion: '3 feb 2026' },
  { nombre: 'Ana Martínez Ruiz', municipio: 'Jiménez', cabezas: 15, estado: 'Pendiente', fechaActivacion: '-' },
  { nombre: 'Carlos Domínguez', municipio: 'Aldama', cabezas: 50, estado: 'Activa', fechaActivacion: '10 feb 2026' },
  { nombre: 'Laura Sánchez', municipio: 'Saucillo', cabezas: 20, estado: 'Pendiente', fechaActivacion: '-' },
  { nombre: 'Pedro Ramírez', municipio: 'Delicias', cabezas: 38, estado: 'Activa', fechaActivacion: '22 feb 2026' },
  { nombre: 'Sofía Gutiérrez', municipio: 'Camargo', cabezas: 42, estado: 'Expirada', fechaActivacion: '5 ene 2025' },
]

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
  return (
    <div className="space-y-6 mt-4">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Key className="h-6 w-6 text-blue-600" />
          Gestión de Licencias
        </h2>
        <p className="text-muted-foreground">
          Administración de licencias HatoAI para productores del programa
        </p>
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
            <span className="font-bold">45% (450 de 1,000)</span>
          </div>
          <Progress value={45} className="h-3" />
        </CardContent>
      </Card>

      {/* Tabla de productores */}
      <Card>
        <CardHeader>
          <CardTitle>Productores</CardTitle>
          <CardDescription>Estado de activación por productor</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Productor</TableHead>
                <TableHead>Municipio</TableHead>
                <TableHead>Cabezas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Activación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productores.map((p) => (
                <TableRow key={p.nombre}>
                  <TableCell className="font-medium">{p.nombre}</TableCell>
                  <TableCell>{p.municipio}</TableCell>
                  <TableCell>{p.cabezas}</TableCell>
                  <TableCell>
                    <EstadoBadge estado={p.estado} />
                  </TableCell>
                  <TableCell>{p.fechaActivacion}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

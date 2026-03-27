"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { SpeciesIcon } from "@/components/icons/species-icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"

const MOCK_ANIMAL = {
  id: "1",
  arete: "MX-001",
  siniiga: "840003200001234",
  nombre: "Ixchel",
  especie: "bovino",
  raza: "Brahman",
  sexo: "Hembra" as const,
  color: "Gris claro",
  fechaNacimiento: "2022-03-15",
  edad: "4 anos",
  pesoActual: 485,
  estado: "Activo" as const,
  estadoReproductivo: "Gestante",
  corral: "Potrero Norte",
  tipoIngreso: "Nacimiento en rancho",
  fechaIngreso: "2022-03-15",
  precioCompra: null as number | null,
  madre: "Vaca #089 Luna",
  padre: "Toro #012 Huracan",
  notas: "Excelente genetica, madre de alto rendimiento.",
}

const MOCK_PESAJES = [
  { fecha: "2026-03-01", peso: 485, gdp: 0.62 },
  { fecha: "2026-01-15", peso: 457, gdp: 0.58 },
  { fecha: "2025-11-01", peso: 432, gdp: 0.65 },
  { fecha: "2025-08-20", peso: 405, gdp: 0.60 },
  { fecha: "2025-06-01", peso: 380, gdp: 0.55 },
  { fecha: "2025-03-15", peso: 358, gdp: 0.52 },
]

const MOCK_REPRODUCCION = [
  { fecha: "2025-12-10", tipo: "Servicio (IA)", toro: "Toro #015 Zeus", resultado: "Gestante", notas: "Inseminacion artificial, semen importado" },
  { fecha: "2025-10-05", tipo: "Celo detectado", toro: "-", resultado: "-", notas: "Celo fuerte, programar servicio" },
  { fecha: "2025-03-20", tipo: "Parto", toro: "Toro #012 Huracan", resultado: "Becerro macho 32kg", notas: "Parto normal, sin complicaciones" },
  { fecha: "2024-06-15", tipo: "Servicio (monta natural)", toro: "Toro #012 Huracan", resultado: "Gestante", notas: "" },
]

const MOCK_SANIDAD = [
  { fecha: "2026-02-15", tipo: "Vacunacion", producto: "Clostridiosis 7 vias", dosis: "5 ml", veterinario: "Dr. Lopez", notas: "Aplicacion rutinaria" },
  { fecha: "2025-11-20", tipo: "Desparasitacion", producto: "Ivermectina 1%", dosis: "10 ml", veterinario: "Dr. Lopez", notas: "" },
  { fecha: "2025-08-10", tipo: "Tratamiento", producto: "Oxitetraciclina LA", dosis: "15 ml", veterinario: "Dr. Martinez", notas: "Infeccion respiratoria leve" },
  { fecha: "2025-06-01", tipo: "Vacunacion", producto: "Rabia paralitica bovina", dosis: "2 ml", veterinario: "Dr. Lopez", notas: "" },
]

const MOCK_ECONOMIA = {
  costos: [
    { concepto: "Alimentacion (estimado anual)", monto: 8500 },
    { concepto: "Vacunas y medicamentos", monto: 1200 },
    { concepto: "Inseminacion artificial", monto: 850 },
    { concepto: "Veterinario", monto: 600 },
  ],
  ingresos: [
    { concepto: "Cria vendida (becerro 2024)", monto: 18000 },
    { concepto: "Leche acumulada (est.)", monto: 5200 },
  ],
}

function SaludBadge({ tipo }: { tipo: string }) {
  const colors: Record<string, string> = {
    Vacunacion: "bg-blue-100 text-blue-800",
    Desparasitacion: "bg-purple-100 text-purple-800",
    Tratamiento: "bg-orange-100 text-orange-800",
    Cirugia: "bg-red-100 text-red-800",
    Laboratorio: "bg-teal-100 text-teal-800",
  }
  return <Badge className={`${colors[tipo] || "bg-gray-100 text-gray-800"} border-0`}>{tipo}</Badge>
}

export default function AnimalDetailPage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState("general")
  const animal = MOCK_ANIMAL // In production, fetch by params.id

  const totalCostos = MOCK_ECONOMIA.costos.reduce((s, c) => s + c.monto, 0)
  const totalIngresos = MOCK_ECONOMIA.ingresos.reduce((s, c) => s + c.monto, 0)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/inventario">
          <Button variant="ghost" className="h-12 w-12">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <div className="h-14 w-14 rounded-xl bg-[#1B4332]/10 flex items-center justify-center">
            <SpeciesIcon species={animal.especie} size={36} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-[#1B4332]">{animal.nombre}</h1>
              <Badge className="bg-green-100 text-green-800 border-0">{animal.estado}</Badge>
              <Badge className="bg-purple-100 text-purple-800 border-0">{animal.estadoReproductivo}</Badge>
            </div>
            <p className="text-base text-muted-foreground">{animal.arete} &middot; {animal.raza}</p>
          </div>
        </div>
        <Button variant="outline" className="h-12 min-w-[48px]">
          <Edit className="h-4 w-4" />
          <span className="hidden sm:inline">Editar</span>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full h-12 overflow-x-auto flex justify-start bg-muted/50">
          <TabsTrigger value="general" className="min-h-[48px] text-base px-4">General</TabsTrigger>
          <TabsTrigger value="pesajes" className="min-h-[48px] text-base px-4">Pesajes</TabsTrigger>
          <TabsTrigger value="reproduccion" className="min-h-[48px] text-base px-4">Reproduccion</TabsTrigger>
          <TabsTrigger value="sanidad" className="min-h-[48px] text-base px-4">Sanidad</TabsTrigger>
          <TabsTrigger value="economia" className="min-h-[48px] text-base px-4">Economia</TabsTrigger>
        </TabsList>

        {/* Tab General */}
        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Datos basicos</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-base">
              <div><p className="text-sm text-muted-foreground">Arete</p><p className="font-medium">{animal.arete}</p></div>
              <div><p className="text-sm text-muted-foreground">SINIIGA</p><p className="font-medium">{animal.siniiga}</p></div>
              <div><p className="text-sm text-muted-foreground">Nombre</p><p className="font-medium">{animal.nombre}</p></div>
              <div><p className="text-sm text-muted-foreground">Sexo</p><p className="font-medium">{animal.sexo}</p></div>
              <div><p className="text-sm text-muted-foreground">Raza</p><p className="font-medium">{animal.raza}</p></div>
              <div><p className="text-sm text-muted-foreground">Color</p><p className="font-medium">{animal.color}</p></div>
              <div><p className="text-sm text-muted-foreground">Fecha de nacimiento</p><p className="font-medium">{animal.fechaNacimiento}</p></div>
              <div><p className="text-sm text-muted-foreground">Edad</p><p className="font-medium">{animal.edad}</p></div>
              <div><p className="text-sm text-muted-foreground">Peso actual</p><p className="font-medium">{animal.pesoActual} kg</p></div>
              <div><p className="text-sm text-muted-foreground">Estado reproductivo</p><p className="font-medium">{animal.estadoReproductivo}</p></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Origen</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-base">
              <div><p className="text-sm text-muted-foreground">Tipo de ingreso</p><p className="font-medium">{animal.tipoIngreso}</p></div>
              <div><p className="text-sm text-muted-foreground">Fecha de ingreso</p><p className="font-medium">{animal.fechaIngreso}</p></div>
              <div><p className="text-sm text-muted-foreground">Madre</p><p className="font-medium">{animal.madre}</p></div>
              <div><p className="text-sm text-muted-foreground">Padre</p><p className="font-medium">{animal.padre}</p></div>
              {animal.precioCompra && (
                <div><p className="text-sm text-muted-foreground">Precio de compra</p><p className="font-medium">${animal.precioCompra.toLocaleString()} MXN</p></div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Ubicacion</CardTitle></CardHeader>
            <CardContent className="text-base">
              <div><p className="text-sm text-muted-foreground">Corral / Potrero</p><p className="font-medium">{animal.corral}</p></div>
            </CardContent>
          </Card>

          {animal.notas && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Notas</CardTitle></CardHeader>
              <CardContent className="text-base">
                <p>{animal.notas}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab Pesajes */}
        <TabsContent value="pesajes" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Grafica de peso</CardTitle></CardHeader>
            <CardContent>
              <div className="h-48 rounded-lg bg-muted/50 border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                <p className="text-muted-foreground text-base">Grafica de peso - Conectar con Recharts</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Historial de pesajes</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Peso (kg)</TableHead>
                    <TableHead>GDP (kg/dia)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_PESAJES.map((p, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-base">{p.fecha}</TableCell>
                      <TableCell className="text-base font-medium">{p.peso}</TableCell>
                      <TableCell className="text-base">{p.gdp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Reproduccion */}
        <TabsContent value="reproduccion" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Estado actual</CardTitle></CardHeader>
            <CardContent className="text-base">
              <div className="flex items-center gap-3">
                <Badge className="bg-purple-100 text-purple-800 border-0 text-base px-3 py-1">{animal.estadoReproductivo}</Badge>
                <span className="text-muted-foreground">Desde: 2025-12-10</span>
              </div>
              <p className="mt-2 text-muted-foreground">Parto estimado: 2026-09-20 (193 dias restantes)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Linea de tiempo reproductiva</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_REPRODUCCION.map((evento, i) => (
                  <div key={i} className="flex gap-4 relative">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-[#1B4332] shrink-0 mt-1.5" />
                      {i < MOCK_REPRODUCCION.length - 1 && <div className="w-0.5 flex-1 bg-[#1B4332]/20 mt-1" />}
                    </div>
                    <div className="pb-4 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-base">{evento.tipo}</p>
                        {evento.resultado !== "-" && (
                          <Badge variant="outline" className="text-sm">{evento.resultado}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{evento.fecha}</p>
                      {evento.toro !== "-" && <p className="text-sm text-muted-foreground">Toro: {evento.toro}</p>}
                      {evento.notas && <p className="text-sm text-muted-foreground mt-1">{evento.notas}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Sanidad */}
        <TabsContent value="sanidad" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Historial sanitario</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="hidden sm:table-cell">Producto</TableHead>
                    <TableHead className="hidden md:table-cell">Dosis</TableHead>
                    <TableHead className="hidden md:table-cell">Veterinario</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_SANIDAD.map((s, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-base">{s.fecha}</TableCell>
                      <TableCell><SaludBadge tipo={s.tipo} /></TableCell>
                      <TableCell className="hidden sm:table-cell text-base">{s.producto}</TableCell>
                      <TableCell className="hidden md:table-cell text-base">{s.dosis}</TableCell>
                      <TableCell className="hidden md:table-cell text-base">{s.veterinario}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Economia */}
        <TabsContent value="economia" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Total costos</p>
                <p className="text-2xl font-bold text-red-600">${totalCostos.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Total ingresos</p>
                <p className="text-2xl font-bold text-green-600">${totalIngresos.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className={`text-2xl font-bold ${totalIngresos - totalCostos >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ${(totalIngresos - totalCostos).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-lg">Costos</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Concepto</TableHead><TableHead className="text-right">Monto</TableHead></TableRow></TableHeader>
                <TableBody>
                  {MOCK_ECONOMIA.costos.map((c, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-base">{c.concepto}</TableCell>
                      <TableCell className="text-base text-right font-medium">${c.monto.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Ingresos</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Concepto</TableHead><TableHead className="text-right">Monto</TableHead></TableRow></TableHeader>
                <TableBody>
                  {MOCK_ECONOMIA.ingresos.map((c, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-base">{c.concepto}</TableCell>
                      <TableCell className="text-base text-right font-medium text-green-600">${c.monto.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

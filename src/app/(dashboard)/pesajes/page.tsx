"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { ChevronRight } from "lucide-react"
import { toast } from "sonner"

const MOCK_CORRALES = ["Potrero Norte", "Potrero Sur", "Corral 1", "Corral 2"]

const MOCK_ANIMALS_MANGA = [
  { id: "1", arete: "MX-001", nombre: "Ixchel", pesoAnterior: 460 },
  { id: "2", arete: "MX-002", nombre: "Kukulcan", pesoAnterior: 595 },
  { id: "3", arete: "MX-003", nombre: "Chaac", pesoAnterior: 510 },
  { id: "4", arete: "MX-005", nombre: "Xtabay", pesoAnterior: 488 },
  { id: "5", arete: "MX-006", nombre: "Ah Puch", pesoAnterior: 395 },
  { id: "6", arete: "MX-007", nombre: "Ixtab", pesoAnterior: 470 },
  { id: "7", arete: "MX-008", nombre: "Kinich Ahau", pesoAnterior: 535 },
  { id: "8", arete: "MX-010", nombre: "Xbalanque", pesoAnterior: 355 },
]

const MOCK_GDP_RANKING = [
  { arete: "MX-002", nombre: "Kukulcan", gdp: 0.82, peso: 620, raza: "Charolais" },
  { arete: "MX-003", nombre: "Chaac", gdp: 0.72, peso: 540, raza: "Suizo" },
  { arete: "MX-008", nombre: "Kinich Ahau", gdp: 0.68, peso: 560, raza: "Brahman" },
  { arete: "MX-001", nombre: "Ixchel", gdp: 0.62, peso: 485, raza: "Brahman" },
  { arete: "MX-005", nombre: "Xtabay", gdp: 0.58, peso: 510, raza: "Holstein" },
  { arete: "MX-007", nombre: "Ixtab", gdp: 0.55, peso: 495, raza: "Simmental" },
  { arete: "MX-006", nombre: "Ah Puch", gdp: 0.50, peso: 420, raza: "Cebu" },
  { arete: "MX-010", nombre: "Xbalanque", gdp: 0.45, peso: 380, raza: "Hereford" },
]

export default function PesajesPage() {
  const [activeTab, setActiveTab] = useState("individual")

  // Individual state
  const [individualAnimal, setIndividualAnimal] = useState("")
  const [individualWeight, setIndividualWeight] = useState("")
  const [individualDate, setIndividualDate] = useState(new Date().toISOString().split("T")[0])

  // Manga state
  const [mangaCorral, setMangaCorral] = useState("")
  const [mangaStarted, setMangaStarted] = useState(false)
  const [mangaIndex, setMangaIndex] = useState(0)
  const [mangaWeight, setMangaWeight] = useState("")
  const [pesados, setPesados] = useState(0)

  const currentAnimal = MOCK_ANIMALS_MANGA[mangaIndex]
  const totalAnimals = MOCK_ANIMALS_MANGA.length

  const handleIndividualSave = () => {
    if (!individualAnimal || !individualWeight) {
      toast.error("Completa todos los campos")
      return
    }
    toast.success("Pesaje registrado", {
      description: `${individualWeight} kg guardado`,
    })
    setIndividualWeight("")
  }

  const handleMangaSiguiente = () => {
    if (!mangaWeight) {
      toast.error("Ingresa el peso")
      return
    }
    toast.success(`${currentAnimal.arete} - ${mangaWeight} kg`)
    setPesados(pesados + 1)
    setMangaWeight("")
    if (mangaIndex < totalAnimals - 1) {
      setMangaIndex(mangaIndex + 1)
    } else {
      toast.success("Sesion de manga completada!", {
        description: `${pesados + 1} animales pesados`,
      })
      setMangaStarted(false)
      setMangaIndex(0)
      setPesados(0)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1B4332]">Pesajes</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full h-12">
          <TabsTrigger value="individual" className="flex-1 min-h-[48px] text-base">Individual</TabsTrigger>
          <TabsTrigger value="manga" className="flex-1 min-h-[48px] text-base">Modo Manga</TabsTrigger>
        </TabsList>

        {/* Individual Tab */}
        <TabsContent value="individual" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Registrar pesaje individual</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base">Animal</Label>
                <Select value={individualAnimal} onValueChange={setIndividualAnimal}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Seleccionar animal" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_ANIMALS_MANGA.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.arete} - {a.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-base">Peso (kg)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  className="h-12 text-base"
                  value={individualWeight}
                  onChange={(e) => setIndividualWeight(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-base">Fecha</Label>
                <Input
                  type="date"
                  className="h-12 text-base"
                  value={individualDate}
                  onChange={(e) => setIndividualDate(e.target.value)}
                />
              </div>
              <Button onClick={handleIndividualSave} className="w-full h-12 text-base">
                Guardar pesaje
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Modo Manga Tab */}
        <TabsContent value="manga" className="space-y-4 mt-4">
          {!mangaStarted ? (
            <Card>
              <CardHeader><CardTitle className="text-lg">Iniciar sesion de manga</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base">Seleccionar corral</Label>
                  <Select value={mangaCorral} onValueChange={setMangaCorral}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Seleccionar corral" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_CORRALES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {mangaCorral && (
                  <div className="space-y-3">
                    <p className="text-base text-muted-foreground">{totalAnimals} animales en {mangaCorral}</p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {MOCK_ANIMALS_MANGA.map((a) => (
                        <div key={a.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 text-base">
                          <span className="font-medium">{a.arete} - {a.nombre}</span>
                          <span className="text-muted-foreground">{a.pesoAnterior} kg (ant.)</span>
                        </div>
                      ))}
                    </div>
                    <Button onClick={() => setMangaStarted(true)} className="w-full h-14 text-lg font-semibold">
                      Iniciar manga
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-base">
                    <span className="font-medium">{pesados} de {totalAnimals} pesados</span>
                    <span className="text-muted-foreground">{Math.round((pesados / totalAnimals) * 100)}%</span>
                  </div>
                  <Progress value={(pesados / totalAnimals) * 100} className="h-3" />
                </div>

                {/* Current Animal */}
                <div className="text-center space-y-1">
                  <p className="text-lg text-muted-foreground">Animal actual</p>
                  <p className="text-3xl font-bold text-[#1B4332]">{currentAnimal.arete}</p>
                  <p className="text-xl">{currentAnimal.nombre}</p>
                  <p className="text-base text-muted-foreground">Peso anterior: {currentAnimal.pesoAnterior} kg</p>
                </div>

                {/* HUGE numeric input */}
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="0"
                    value={mangaWeight}
                    onChange={(e) => setMangaWeight(e.target.value)}
                    className="h-24 text-center border-2 border-[#1B4332]/30 focus:border-[#1B4332]"
                    style={{ fontSize: "48px" }}
                    autoFocus
                  />
                  <p className="text-center text-base text-muted-foreground">kg</p>
                </div>

                {/* Big green SIGUIENTE button */}
                <Button
                  onClick={handleMangaSiguiente}
                  className="w-full h-14 text-xl font-bold bg-[#1B4332] hover:bg-[#1B4332]/90"
                >
                  SIGUIENTE
                  <ChevronRight className="h-6 w-6" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => { setMangaStarted(false); setMangaIndex(0); setPesados(0); setMangaWeight("") }}
                  className="w-full h-12 text-base"
                >
                  Cancelar sesion
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* GDP Ranking Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ranking GDP (Ganancia Diaria de Peso)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">#</TableHead>
                <TableHead>Arete</TableHead>
                <TableHead className="hidden sm:table-cell">Nombre</TableHead>
                <TableHead className="hidden md:table-cell">Raza</TableHead>
                <TableHead>Peso</TableHead>
                <TableHead>GDP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_GDP_RANKING.map((animal, i) => (
                <TableRow key={animal.arete}>
                  <TableCell>
                    <Badge className={`border-0 ${i === 0 ? "bg-yellow-100 text-yellow-800" : i === 1 ? "bg-gray-200 text-gray-800" : i === 2 ? "bg-orange-100 text-orange-800" : "bg-muted text-muted-foreground"}`}>
                      {i + 1}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-base">{animal.arete}</TableCell>
                  <TableCell className="hidden sm:table-cell text-base">{animal.nombre}</TableCell>
                  <TableCell className="hidden md:table-cell text-base">{animal.raza}</TableCell>
                  <TableCell className="text-base">{animal.peso} kg</TableCell>
                  <TableCell className="text-base font-medium text-[#1B4332]">{animal.gdp} kg/d</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

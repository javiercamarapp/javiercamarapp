"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, ShieldCheck, Heart, DollarSign } from "lucide-react"

type InsightType = "productividad" | "sanidad" | "reproduccion" | "economico"
type Priority = "alta" | "media" | "baja"

interface Insight {
  id: string
  tipo: InsightType
  prioridad: Priority
  mensaje: string
  accionSugerida: string
  fecha: string
}

const MOCK_INSIGHTS: Insight[] = [
  {
    id: "1",
    tipo: "reproduccion",
    prioridad: "alta",
    mensaje: "La vaca MX-004 Yum Kaax lleva 3 ciclos sin prenar. Su fertilidad ha disminuido significativamente.",
    accionSugerida: "Considere cambiar de semental o programar revision ginecologica con el veterinario.",
    fecha: "2026-03-27",
  },
  {
    id: "2",
    tipo: "productividad",
    prioridad: "alta",
    mensaje: "La GDP del Potrero Sur esta 15% por debajo del promedio del rancho en los ultimos 60 dias.",
    accionSugerida: "Revisar calidad del pasto y considerar suplementacion con concentrado proteico.",
    fecha: "2026-03-26",
  },
  {
    id: "3",
    tipo: "sanidad",
    prioridad: "alta",
    mensaje: "5 animales del Corral 1 tienen vacunacion de clostridiosis vencida hace mas de 15 dias.",
    accionSugerida: "Programar jornada de vacunacion urgente para Corral 1.",
    fecha: "2026-03-26",
  },
  {
    id: "4",
    tipo: "economico",
    prioridad: "media",
    mensaje: "El costo de alimentacion por cabeza aumento 12% respecto al mes anterior.",
    accionSugerida: "Evaluar alternativas de alimento o negociar precios con proveedores a granel.",
    fecha: "2026-03-25",
  },
  {
    id: "5",
    tipo: "productividad",
    prioridad: "media",
    mensaje: "El toro MX-002 Kukulcan muestra la mejor GDP del rancho (0.82 kg/dia). Excelente genetica.",
    accionSugerida: "Considerar usarlo como semental principal para mejorar la genetica del hato.",
    fecha: "2026-03-24",
  },
  {
    id: "6",
    tipo: "reproduccion",
    prioridad: "media",
    mensaje: "3 vacas gestantes estan a menos de 30 dias de su fecha estimada de parto.",
    accionSugerida: "Trasladar a corral de maternidad y preparar protocolo de parto.",
    fecha: "2026-03-24",
  },
  {
    id: "7",
    tipo: "sanidad",
    prioridad: "baja",
    mensaje: "El inventario de Ivermectina esta al 60%. Considerando la proxima jornada de desparasitacion sera insuficiente.",
    accionSugerida: "Solicitar compra de Ivermectina al proveedor antes de la proxima jornada.",
    fecha: "2026-03-23",
  },
  {
    id: "8",
    tipo: "economico",
    prioridad: "baja",
    mensaje: "El precio del becerro al destete en tu region subio 8% este trimestre.",
    accionSugerida: "Buen momento para programar ventas de becerros proximos al destete.",
    fecha: "2026-03-22",
  },
  {
    id: "9",
    tipo: "productividad",
    prioridad: "media",
    mensaje: "El peso promedio al destete de las crias de este ano es 5% superior al ano pasado.",
    accionSugerida: "La estrategia de suplementacion esta funcionando. Mantener protocolo actual.",
    fecha: "2026-03-21",
  },
  {
    id: "10",
    tipo: "economico",
    prioridad: "alta",
    mensaje: "Tu balance mensual es positivo por $89,450 MXN. El mejor mes de los ultimos 6.",
    accionSugerida: "Considerar reinvertir en mejora de infraestructura o genetica.",
    fecha: "2026-03-20",
  },
]

const TYPE_CONFIG: Record<InsightType, { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  productividad: { label: "Productividad", icon: <TrendingUp className="h-4 w-4" />, color: "text-[#1B4332]", bgColor: "bg-[#1B4332]/10" },
  sanidad: { label: "Sanidad", icon: <ShieldCheck className="h-4 w-4" />, color: "text-blue-700", bgColor: "bg-blue-100" },
  reproduccion: { label: "Reproduccion", icon: <Heart className="h-4 w-4" />, color: "text-purple-700", bgColor: "bg-purple-100" },
  economico: { label: "Economico", icon: <DollarSign className="h-4 w-4" />, color: "text-green-700", bgColor: "bg-green-100" },
}

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  alta: { label: "Alta", color: "bg-red-100 text-red-800" },
  media: { label: "Media", color: "bg-yellow-100 text-yellow-800" },
  baja: { label: "Baja", color: "bg-gray-100 text-gray-600" },
}

const FILTER_OPTIONS: Array<{ value: InsightType | "todos"; label: string }> = [
  { value: "todos", label: "Todos" },
  { value: "productividad", label: "Productividad" },
  { value: "sanidad", label: "Sanidad" },
  { value: "reproduccion", label: "Reproduccion" },
  { value: "economico", label: "Economico" },
]

export default function AiInsightsPage() {
  const [filter, setFilter] = useState<InsightType | "todos">("todos")

  const filtered = filter === "todos"
    ? MOCK_INSIGHTS
    : MOCK_INSIGHTS.filter((i) => i.tipo === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1B4332]">AI Insights</h1>
          <p className="text-sm text-muted-foreground">Recomendaciones inteligentes para tu rancho</p>
        </div>
      </div>

      {/* Credit Score Radar Placeholder */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Credit Score del Rancho</CardTitle></CardHeader>
        <CardContent>
          <div className="h-48 rounded-lg bg-muted/50 border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
            <p className="text-muted-foreground text-base">Grafica radar de Credit Score - Conectar con Recharts</p>
          </div>
        </CardContent>
      </Card>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-4 py-2 rounded-full border text-base font-medium whitespace-nowrap transition-colors shrink-0 min-h-[48px] ${
              filter === opt.value
                ? "border-[#1B4332] bg-[#1B4332]/10 text-[#1B4332]"
                : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Insights Feed */}
      <div className="space-y-4">
        {filtered.map((insight) => {
          const typeConf = TYPE_CONFIG[insight.tipo]
          const priorConf = PRIORITY_CONFIG[insight.prioridad]

          return (
            <Card key={insight.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`h-8 w-8 rounded-full ${typeConf.bgColor} flex items-center justify-center ${typeConf.color}`}>
                      {typeConf.icon}
                    </div>
                    <Badge className={`${typeConf.bgColor} ${typeConf.color} border-0`}>
                      {typeConf.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${priorConf.color} border-0`}>{priorConf.label}</Badge>
                    <span className="text-sm text-muted-foreground">{insight.fecha}</span>
                  </div>
                </div>
                <p className="text-base">{insight.mensaje}</p>
                <div className="bg-[#1B4332]/5 rounded-lg p-3">
                  <p className="text-sm font-medium text-[#1B4332] mb-1">Accion sugerida:</p>
                  <p className="text-base text-[#1B4332]/80">{insight.accionSugerida}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

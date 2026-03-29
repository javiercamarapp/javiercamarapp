import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, Heart, ShieldAlert, DollarSign, TrendingUp, BarChart3 } from 'lucide-react'

const insights = [
  {
    tipo: 'Reproductivo',
    icono: Heart,
    color: 'bg-purple-500',
    badgeBg: 'bg-purple-100 text-purple-700',
    titulo: 'Oportunidad de inseminación detectada',
    mensaje:
      'La Vaca La Pinta lleva 45 días vacía post-parto y muestra signos de celo regular. Considera programar inseminación en los próximos 3 días para optimizar el intervalo entre partos.',
    datos: 'Historial reproductivo, días abiertos, detección de celo',
  },
  {
    tipo: 'Sanitario',
    icono: ShieldAlert,
    color: 'bg-red-500',
    badgeBg: 'bg-red-100 text-red-700',
    titulo: 'Alerta: posible brote respiratorio',
    mensaje:
      'El Becerro BC-020 presenta síntomas compatibles con neumonía. Hay 2 becerros más en el mismo corral que podrían estar en riesgo. Se recomienda aislar y tratar de inmediato.',
    datos: 'Registros sanitarios, temperatura ambiental, densidad de corral',
  },
  {
    tipo: 'Económico',
    icono: DollarSign,
    color: 'bg-amber-500',
    badgeBg: 'bg-amber-100 text-amber-700',
    titulo: 'Costo de alimentación por encima del promedio',
    mensaje:
      'Tu costo de alimentación por kg de carne producido es $32 MXN, un 18% por encima del promedio regional ($27 MXN). Considera ajustar la ración o buscar proveedores alternativos de forraje.',
    datos: 'Costos de alimentación, pesajes, precios de mercado',
  },
  {
    tipo: 'Predictivo',
    icono: TrendingUp,
    color: 'bg-blue-500',
    badgeBg: 'bg-blue-100 text-blue-700',
    titulo: 'Predicción de peso al destete',
    mensaje:
      'Basado en la ganancia diaria de peso actual (1.3 kg/día), el Becerro BC-012 alcanzará 220 kg al destete programado el 15 de mayo. Esto está un 10% por encima del objetivo.',
    datos: 'Historial de pesajes, GDP, genética del padre',
  },
  {
    tipo: 'Benchmarking',
    icono: BarChart3,
    color: 'bg-green-500',
    badgeBg: 'bg-green-100 text-green-700',
    titulo: 'Tu tasa de preñez supera el promedio municipal',
    mensaje:
      'Tu tasa de preñez del 78% está 12 puntos por encima del promedio del municipio (66%). Tu manejo reproductivo es destacado comparado con otros productores de la región.',
    datos: 'Datos reproductivos propios, promedios municipales anónimos',
  },
]

export default function AIInsightsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="h-7 w-7 text-purple-600" />
        <div>
          <h1 className="text-2xl font-bold">Insights de IA</h1>
          <p className="text-muted-foreground">
            Recomendaciones inteligentes basadas en los datos de tu rancho
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {insights.map((insight) => {
          const Icon = insight.icono
          return (
            <Card key={insight.titulo}>
              <CardHeader className={`${insight.color} text-white rounded-t-lg py-3 px-4`}>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <Badge className="bg-white/20 text-white hover:bg-white/20">
                    {insight.tipo}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2">
                <h3 className="font-semibold">{insight.titulo}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.mensaje}
                </p>
              </CardContent>
              <CardFooter className="border-t pt-3">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Datos que usa:</span> {insight.datos}
                </p>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

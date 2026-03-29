import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Baby, Calendar, Heart, Milk } from 'lucide-react'

const statusCards = [
  {
    label: 'Vacías',
    count: 3,
    icon: Heart,
    color: 'bg-gray-100 text-gray-700',
    headerColor: 'bg-gray-500',
  },
  {
    label: 'Servidas',
    count: 2,
    icon: Heart,
    color: 'bg-blue-100 text-blue-700',
    headerColor: 'bg-blue-500',
  },
  {
    label: 'Gestantes',
    count: 5,
    icon: Baby,
    color: 'bg-pink-100 text-pink-700',
    headerColor: 'bg-pink-500',
  },
  {
    label: 'Lactando',
    count: 2,
    icon: Milk,
    color: 'bg-purple-100 text-purple-700',
    headerColor: 'bg-purple-500',
  },
]

const proximosPartos = [
  {
    animal: 'Vaca La Negra',
    fechaEsperada: '15 abril 2026',
  },
  {
    animal: 'Marrana PC-001',
    fechaEsperada: '22 abril 2026',
  },
]

export default function ReproduccionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reproducción</h1>
        <p className="text-muted-foreground">
          Estado reproductivo del hato y calendario de partos
        </p>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statusCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.label}>
              <CardHeader className={`${card.headerColor} text-white rounded-t-lg py-3 px-4`}>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {card.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-3xl font-bold">{card.count}</p>
                <p className="text-xs text-muted-foreground mt-1">animales</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Calendario de Partos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-pink-500" />
            Próximos Partos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {proximosPartos.map((parto) => (
              <div
                key={parto.animal}
                className="flex items-center justify-between p-3 rounded-lg border bg-pink-50"
              >
                <div>
                  <p className="font-medium">{parto.animal}</p>
                  <p className="text-sm text-muted-foreground">
                    Parto esperado: {parto.fechaEsperada}
                  </p>
                </div>
                <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-100">
                  Próximo
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

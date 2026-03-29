import { Scale, Syringe, Baby, Heart, Milk, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TimelineEvent {
  icon: React.ElementType
  iconColor: string
  iconBg: string
  description: string
  detail: string
  time: string
}

const events: TimelineEvent[] = [
  {
    icon: Scale,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    description: 'Pesaje registrado',
    detail: 'Vaca #003: 450 kg (+12 kg desde ultimo pesaje)',
    time: 'Hace 2 horas',
  },
  {
    icon: Syringe,
    iconColor: 'text-red-600',
    iconBg: 'bg-red-50',
    description: 'Vacunacion aplicada',
    detail: 'Lote bovinos: Clostridiosis — 8 animales tratados',
    time: 'Hace 4 horas',
  },
  {
    icon: Baby,
    iconColor: 'text-pink-600',
    iconBg: 'bg-pink-50',
    description: 'Parto registrado',
    detail: 'Vaca #007: becerro macho, 32 kg. Parto normal.',
    time: 'Ayer, 06:30',
  },
  {
    icon: Heart,
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-50',
    description: 'Inseminacion registrada',
    detail: 'Vaca #011: IA con semen Holstein — Toro: MX-1245',
    time: 'Ayer, 10:15',
  },
  {
    icon: Milk,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
    description: 'Produccion de leche',
    detail: 'Total del dia: 216 litros — 12 vacas en ordena',
    time: 'Ayer, 18:00',
  },
  {
    icon: DollarSign,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    description: 'Venta registrada',
    detail: '2 becerros vendidos a $18,500 c/u — Comprador: Rancho El Porvenir',
    time: 'Hace 3 dias',
  },
]

export function ActivityTimeline() {
  return (
    <section>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Actividad reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {events.map((event, index) => {
              const Icon = event.icon
              return (
                <div key={index} className="flex gap-3 pb-4 last:pb-0">
                  {/* Icon + line */}
                  <div className="flex flex-col items-center">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${event.iconBg}`}>
                      <Icon className={`h-4 w-4 ${event.iconColor}`} />
                    </div>
                    {index < events.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-1" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <p className="text-sm font-semibold text-foreground">{event.description}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{event.detail}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">{event.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

interface SpeciesKPI {
  label: string
  value: string | number
}

interface SpeciesData {
  emoji: string
  name: string
  color: string
  kpis: SpeciesKPI[]
}

const speciesData: SpeciesData[] = [
  {
    emoji: '🐄',
    name: 'Bovinos',
    color: 'border-l-amber-700',
    kpis: [
      { label: 'Cabezas', value: 12 },
      { label: 'Gestantes', value: 3 },
      { label: 'GDP', value: '0.8 kg/dia' },
      { label: 'Produccion leche', value: '18 L/dia' },
    ],
  },
  {
    emoji: '🐷',
    name: 'Porcinos',
    color: 'border-l-pink-500',
    kpis: [
      { label: 'Cabezas', value: 5 },
      { label: 'Gestantes', value: 2 },
      { label: 'GDP', value: '0.65 kg/dia' },
    ],
  },
  {
    emoji: '🐑',
    name: 'Ovinos',
    color: 'border-l-gray-500',
    kpis: [
      { label: 'Cabezas', value: 4 },
      { label: 'Gestantes', value: 1 },
      { label: 'Lana (kg)', value: 2.5 },
    ],
  },
  {
    emoji: '🐔',
    name: 'Aves',
    color: 'border-l-orange-500',
    kpis: [
      { label: 'Aves', value: 150 },
      { label: '% Postura', value: '85%' },
      { label: 'Huevos/dia', value: 128 },
    ],
  },
  {
    emoji: '🐝',
    name: 'Abejas',
    color: 'border-l-yellow-500',
    kpis: [
      { label: 'Colmenas', value: 35 },
      { label: 'kg/colmena', value: 28 },
      { label: 'Produccion total', value: '980 kg' },
    ],
  },
]

export function SpeciesKPICards() {
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground mb-3">Resumen por especie</h2>
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {speciesData.map((species) => (
            <Card
              key={species.name}
              className={`min-w-[220px] max-w-[260px] shrink-0 border-l-4 ${species.color}`}
            >
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <span className="text-xl">{species.emoji}</span>
                  {species.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="space-y-1.5">
                  {species.kpis.map((kpi) => (
                    <div key={kpi.label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{kpi.label}</span>
                      <span className="font-semibold text-foreground">{kpi.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  )
}

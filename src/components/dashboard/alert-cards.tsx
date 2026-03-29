import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface AlertItem {
  type: 'critical' | 'warning' | 'info'
  message: string
  detail: string
}

const alerts: AlertItem[] = [
  {
    type: 'critical',
    message: 'Vaca #005: 180 dias abiertos',
    detail: 'Considerar revision veterinaria. Ultima revision hace 45 dias.',
  },
  {
    type: 'warning',
    message: '12 animales con vacuna vencida',
    detail: 'Vacuna contra rabia vencida. Programar aplicacion lo antes posible.',
  },
  {
    type: 'info',
    message: '3 partos esperados proximos 7 dias',
    detail: 'Vaca #007, Vaca #011 y Cerda #003. Preparar area de maternidad.',
  },
  {
    type: 'warning',
    message: 'Inventario bajo de alimento',
    detail: 'Quedan aproximadamente 5 dias de concentrado para bovinos.',
  },
]

const alertConfig = {
  critical: {
    border: 'border-l-red-500',
    bg: 'bg-red-50',
    icon: AlertCircle,
    iconColor: 'text-red-600',
  },
  warning: {
    border: 'border-l-amber-500',
    bg: 'bg-amber-50',
    icon: AlertTriangle,
    iconColor: 'text-amber-600',
  },
  info: {
    border: 'border-l-green-500',
    bg: 'bg-green-50',
    icon: CheckCircle2,
    iconColor: 'text-green-600',
  },
}

export function AlertCards() {
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground mb-3">Alertas y pendientes</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {alerts.map((alert, index) => {
          const config = alertConfig[alert.type]
          const Icon = config.icon
          return (
            <Card
              key={index}
              className={`border-l-4 ${config.border} ${config.bg}`}
            >
              <CardContent className="flex gap-3 p-4">
                <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${config.iconColor}`} />
                <div>
                  <p className="text-sm font-semibold text-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{alert.detail}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

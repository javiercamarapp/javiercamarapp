import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatTrendProps {
  label: string
  value: string | number
  previousValue?: number
  currentValue?: number
  unit?: string
  format?: 'number' | 'currency' | 'percent'
}

export function StatTrend({ label, value, previousValue, currentValue, unit, format }: StatTrendProps) {
  const trend = previousValue && currentValue
    ? currentValue > previousValue ? 'up' : currentValue < previousValue ? 'down' : 'neutral'
    : 'neutral'

  const pctChange = previousValue && currentValue && previousValue > 0
    ? Math.round(((currentValue - previousValue) / previousValue) * 100)
    : 0

  const formatValue = (v: string | number) => {
    if (typeof v === 'string') return v
    if (format === 'currency') return `$${v.toLocaleString('es-MX')}`
    if (format === 'percent') return `${v}%`
    return v.toLocaleString('es-MX')
  }

  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold">{formatValue(value)}{unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}</span>
        {trend !== 'neutral' && (
          <span className={cn(
            'flex items-center text-xs font-medium',
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          )}>
            {trend === 'up' ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
            {Math.abs(pctChange)}%
          </span>
        )}
      </div>
    </div>
  )
}

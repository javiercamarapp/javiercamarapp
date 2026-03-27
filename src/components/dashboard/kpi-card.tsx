"use client"

import { SpeciesIcon } from "@/components/icons/species-icons"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  species: string
  speciesName: string
  total: number
  trend: number
  detail: string
}

export function KpiCard({ species, speciesName, total, trend, detail }: KpiCardProps) {
  const isPositive = trend >= 0

  return (
    <div className="flex-shrink-0 w-[200px] lg:w-auto rounded-xl border border-border bg-white p-5 space-y-3">
      <div className="flex items-center gap-3">
        <SpeciesIcon species={species} size={48} />
        <div>
          <p className="text-sm text-muted-foreground">{speciesName}</p>
          <p className="text-2xl font-bold text-foreground">{total.toLocaleString("es-MX")}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "flex items-center gap-1 text-xs font-medium",
            isPositive ? "text-[#16A34A]" : "text-destructive"
          )}
        >
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {isPositive ? "+" : ""}
          {trend}%
        </span>
        <span className="text-xs text-muted-foreground">{detail}</span>
      </div>
    </div>
  )
}

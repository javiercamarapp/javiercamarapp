"use client"

import { AlertTriangle, ChevronRight } from "lucide-react"
import { SpeciesIcon } from "@/components/icons/species-icons"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface AlertCardProps {
  species: string
  identifier: string
  message: string
  priority: "alta" | "media" | "baja"
  actionUrl?: string
  daysUrgent?: number
}

const priorityStyles = {
  alta: "border-destructive/30 bg-destructive/5",
  media: "border-[#F59E0B]/30 bg-[#F59E0B]/5",
  baja: "border-border bg-muted/50",
}

export function AlertCard({
  species,
  identifier,
  message,
  priority,
  actionUrl,
  daysUrgent,
}: AlertCardProps) {
  const Wrapper = actionUrl ? Link : "div"
  const wrapperProps = actionUrl ? { href: actionUrl } : {}

  return (
    <Wrapper
      {...(wrapperProps as any)}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border transition-colors",
        priorityStyles[priority],
        actionUrl && "hover:bg-muted/80 cursor-pointer"
      )}
    >
      <SpeciesIcon species={species} size={32} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{identifier}</p>
        <p className="text-xs text-muted-foreground">{message}</p>
      </div>
      {daysUrgent !== undefined && (
        <span
          className={cn(
            "text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap",
            priority === "alta"
              ? "bg-destructive text-white"
              : priority === "media"
              ? "bg-[#F59E0B] text-white"
              : "bg-muted-foreground/20 text-muted-foreground"
          )}
        >
          {daysUrgent}d
        </span>
      )}
      {actionUrl && <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
    </Wrapper>
  )
}

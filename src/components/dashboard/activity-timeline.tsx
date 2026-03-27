"use client"

import { SpeciesIcon } from "@/components/icons/species-icons"

interface Activity {
  id: string
  time: string
  type: string
  species: string
  detail: string
}

interface ActivityTimelineProps {
  activities: Activity[]
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <div className="rounded-xl border border-border p-5 space-y-4">
      <h3 className="font-semibold text-foreground">Actividad reciente</h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <SpeciesIcon species={activity.species} size={24} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{activity.type}</p>
              <p className="text-xs text-muted-foreground">{activity.detail}</p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

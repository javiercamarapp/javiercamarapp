import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { SpeciesKPICards } from '@/components/dashboard/species-kpi-cards'
import { AlertCards } from '@/components/dashboard/alert-cards'
import { GamificationBadges } from '@/components/shared/gamification-badge'
import { ActivityTimeline } from '@/components/dashboard/activity-timeline'
import { QuickActionFAB } from '@/components/shared/quick-action-fab'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <SpeciesKPICards />
      <AlertCards />
      <GamificationBadges />
      <ActivityTimeline />
      <QuickActionFAB />
    </div>
  )
}

import { ErrorBoundary } from '@/components/shared/error-boundary'
import { Sidebar } from '@/components/shared/sidebar'
import { Topbar } from '@/components/shared/topbar'
import { MobileNav } from '@/components/shared/mobile-nav'
import { OfflineIndicator } from '@/components/shared/offline-indicator'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      <OfflineIndicator />
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="p-4 pb-20 lg:pb-4">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}

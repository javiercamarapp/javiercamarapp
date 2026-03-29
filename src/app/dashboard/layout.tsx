import { Sidebar } from '@/components/shared/sidebar'
import { Topbar } from '@/components/shared/topbar'
import { MobileNav } from '@/components/shared/mobile-nav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="p-4 pb-20 lg:pb-4">{children}</main>
      </div>
      <MobileNav />
    </div>
  )
}

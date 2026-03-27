"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Header } from "@/components/layout/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className="lg:pl-[280px]">
        <Header />
        <main className="p-4 lg:p-6 pb-24 lg:pb-6">{children}</main>
      </div>
      <BottomNav />
    </div>
  )
}

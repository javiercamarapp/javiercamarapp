"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navTabs = [
  { label: "Dashboard", href: "/gobierno" },
  { label: "Programas", href: "/gobierno/programas" },
  { label: "Ranchos", href: "/gobierno/ranchos" },
  { label: "Reportes", href: "/gobierno/reportes" },
]

export default function GobiernoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === "/gobierno") return pathname === "/gobierno"
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1B4332]">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21"
                />
              </svg>
            </div>
            <div>
              <span className="text-lg font-bold text-[#1B4332]">HatoAI</span>
              <span className="ml-1 text-sm text-gray-500">
                — Portal de Gobierno
              </span>
            </div>
          </div>

          {/* User info */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                Lic. Carlos Mendoza
              </p>
              <p className="text-xs text-gray-500">
                Dir. Desarrollo Ganadero — Yucatán
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1B4332] text-sm font-semibold text-white">
              CM
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="mx-auto max-w-7xl px-6">
          <nav className="flex gap-1">
            {navTabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive(tab.href)
                    ? "border-[#1B4332] text-[#1B4332]"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  )
}

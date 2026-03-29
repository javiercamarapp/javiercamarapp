import Link from 'next/link'
import { Landmark, Shield, LayoutDashboard, FileText, ShieldAlert } from 'lucide-react'

export default function GobiernoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del Portal de Gobierno */}
      <header className="bg-[#1a1a2e] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <Landmark className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Portal de Gobierno</h1>
              <p className="text-xs text-gray-300">
                HatoAI — Panel de Monitoreo de Programas Ganaderos
              </p>
            </div>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/gobierno" className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link href="/gobierno/alertas" className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors">
              <Shield className="h-4 w-4" />
              Alertas
            </Link>
            <Link href="/gobierno/fraude" className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors">
              <ShieldAlert className="h-4 w-4" />
              Anomalías
            </Link>
            <Link href="/gobierno/coneval" className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors">
              <FileText className="h-4 w-4" />
              CONEVAL
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4">{children}</main>
    </div>
  )
}

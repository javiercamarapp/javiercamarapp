import { Landmark } from 'lucide-react'

export default function GobiernoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del Portal de Gobierno */}
      <header className="bg-[#1a1a2e] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
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
      </header>
      <main className="max-w-7xl mx-auto p-4">{children}</main>
    </div>
  )
}

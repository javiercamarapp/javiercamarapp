import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <h1 className="text-2xl font-bold">HatoAI</h1>
        </div>
        <h2 className="text-6xl font-bold text-muted-foreground mb-4">404</h2>
        <p className="text-lg text-muted-foreground mb-6">Página no encontrada</p>
        <p className="text-sm text-muted-foreground mb-8">
          La página que buscas no existe o fue movida.
        </p>
        <Button asChild>
          <Link href="/dashboard">
            <Home className="h-4 w-4 mr-2" />
            Ir al Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}

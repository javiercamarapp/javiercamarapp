import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, CheckCircle2 } from 'lucide-react'

const campanas = [
  {
    nombre: 'Tuberculosis Bovina',
    progreso: 85,
    estado: 'En curso',
    animalesProgramados: 12,
    animalesCompletados: 10,
    proximaFecha: '10 abril 2026',
    color: 'text-red-600',
  },
  {
    nombre: 'Brucelosis',
    progreso: 72,
    estado: 'En curso',
    animalesProgramados: 12,
    animalesCompletados: 9,
    proximaFecha: '15 abril 2026',
    color: 'text-amber-600',
  },
  {
    nombre: 'Rabia Paralítica Bovina',
    progreso: 90,
    estado: 'En curso',
    animalesProgramados: 12,
    animalesCompletados: 11,
    proximaFecha: '8 abril 2026',
    color: 'text-blue-600',
  },
]

export default function CampanasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-green-600" />
          Campañas SENASICA
        </h1>
        <p className="text-muted-foreground">
          Progreso de las campañas zoosanitarias oficiales
        </p>
      </div>

      <div className="grid gap-4">
        {campanas.map((campana) => (
          <Card key={campana.nombre}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className={`text-lg ${campana.color}`}>
                    {campana.nombre}
                  </CardTitle>
                  <CardDescription>
                    {campana.animalesCompletados} de {campana.animalesProgramados} animales completados
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {campana.estado}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progreso</span>
                <span className="font-bold">{campana.progreso}% completado</span>
              </div>
              <Progress value={campana.progreso} className="h-3" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" />
                Próxima acción: {campana.proximaFecha}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

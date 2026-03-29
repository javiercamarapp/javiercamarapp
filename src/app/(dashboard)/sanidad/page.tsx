import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, Syringe, AlertTriangle } from 'lucide-react'

const columnas = [
  {
    titulo: 'Sano',
    color: 'bg-green-500',
    badgeColor: 'bg-green-100 text-green-700',
    animales: [
      'Vaca La Negra',
      'Toro BR-001',
      'Vaca La Pinta',
      'Becerro BC-012',
      'Yegua Luna',
      'Becerro BC-015',
      'Vaca Estrella',
      'Vaca Mariposa',
    ],
  },
  {
    titulo: 'En tratamiento',
    color: 'bg-amber-500',
    badgeColor: 'bg-amber-100 text-amber-700',
    animales: ['Becerro BC-008', 'Marrana PC-001'],
  },
  {
    titulo: 'Enfermo',
    color: 'bg-red-500',
    badgeColor: 'bg-red-100 text-red-700',
    animales: ['Becerro BC-020'],
  },
  {
    titulo: 'Cuarentena',
    color: 'bg-purple-500',
    badgeColor: 'bg-purple-100 text-purple-700',
    animales: [],
  },
]

const proximasVacunaciones = [
  {
    animal: 'Becerro BC-012',
    vacuna: 'Clostridial 7 vías',
    fecha: '5 abril 2026',
  },
  {
    animal: 'Becerro BC-015',
    vacuna: 'Clostridial 7 vías',
    fecha: '5 abril 2026',
  },
  {
    animal: 'Todo el hato bovino',
    vacuna: 'Brucelosis (campaña SENASICA)',
    fecha: '15 abril 2026',
  },
]

export default function SanidadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sanidad</h1>
        <p className="text-muted-foreground">
          Estado sanitario del hato y seguimiento de tratamientos
        </p>
      </div>

      {/* Kanban de estado sanitario */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columnas.map((col) => (
          <Card key={col.titulo}>
            <CardHeader className={`${col.color} text-white rounded-t-lg py-3 px-4`}>
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                {col.titulo}
                <Badge className="bg-white/20 text-white hover:bg-white/20">
                  {col.animales.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              {col.animales.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Sin animales
                </p>
              ) : (
                <div className="space-y-2">
                  {col.animales.map((animal) => (
                    <div
                      key={animal}
                      className="text-sm p-2 rounded-md border bg-white hover:bg-gray-50"
                    >
                      {animal}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Próximas vacunaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Syringe className="h-5 w-5 text-blue-500" />
            Próximas Vacunaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {proximasVacunaciones.map((v, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg border bg-blue-50"
              >
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{v.animal}</p>
                  <p className="text-sm text-muted-foreground">{v.vacuna}</p>
                </div>
                <Badge variant="outline">{v.fecha}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

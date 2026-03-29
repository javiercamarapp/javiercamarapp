import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  FileText,
  ClipboardList,
  Heart,
  ShieldCheck,
  BarChart3,
  DollarSign,
  Landmark,
  Download,
} from 'lucide-react'

const reportes = [
  {
    titulo: 'Inventario actual',
    descripcion: 'Listado completo de animales con especie, raza, edad y estado.',
    icono: ClipboardList,
    color: 'text-blue-600',
  },
  {
    titulo: 'Estado reproductivo',
    descripcion: 'Resumen del estado reproductivo del hato: vacías, gestantes, lactando.',
    icono: Heart,
    color: 'text-pink-600',
  },
  {
    titulo: 'Historial sanitario',
    descripcion: 'Registro de vacunaciones, tratamientos y campañas SENASICA.',
    icono: ShieldCheck,
    color: 'text-green-600',
  },
  {
    titulo: 'Producción mensual',
    descripcion: 'Resumen de producción de leche, huevos y miel del mes.',
    icono: BarChart3,
    color: 'text-amber-600',
  },
  {
    titulo: 'Estado financiero',
    descripcion: 'Ingresos, egresos, utilidad y flujo de efectivo del período.',
    icono: DollarSign,
    color: 'text-green-600',
  },
  {
    titulo: 'Reporte para banco',
    descripcion: 'Documento con credit score, historial productivo y valor del hato para solicitar crédito.',
    icono: Landmark,
    color: 'text-purple-600',
  },
]

export default function ReportesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-600" />
          Reportes
        </h1>
        <p className="text-muted-foreground">
          Genera reportes en PDF de tu rancho
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportes.map((reporte) => {
          const Icon = reporte.icono
          return (
            <Card key={reporte.titulo} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gray-100 ${reporte.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{reporte.titulo}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription>{reporte.descripcion}</CardDescription>
              </CardContent>
              <div className="p-6 pt-0">
                <Button variant="outline" className="w-full" onClick={() => window.print()}>
                  <Download className="h-4 w-4 mr-2" />
                  Generar PDF
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

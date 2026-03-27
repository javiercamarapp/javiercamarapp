"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ClipboardList,
  Heart,
  ShieldCheck,
  DollarSign,
  FileText,
  FileDown,
  FileSpreadsheet,
} from "lucide-react"
import { toast } from "sonner"

interface ReportCard {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  color: string
  bgColor: string
}

const REPORTS: ReportCard[] = [
  {
    id: "inventario",
    icon: <ClipboardList className="h-8 w-8" />,
    title: "Inventario",
    description: "Reporte completo del inventario ganadero con desglose por especie, raza, sexo y estado.",
    color: "text-[#1B4332]",
    bgColor: "bg-[#1B4332]/10",
  },
  {
    id: "reproductivo",
    icon: <Heart className="h-8 w-8" />,
    title: "Reproductivo",
    description: "Tasas de prenez, servicios por concepcion, intervalos entre partos y eventos reproductivos.",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    id: "sanitario",
    icon: <ShieldCheck className="h-8 w-8" />,
    title: "Sanitario",
    description: "Historial de vacunaciones, desparasitaciones, tratamientos y periodos de retiro.",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    id: "economico",
    icon: <DollarSign className="h-8 w-8" />,
    title: "Economico",
    description: "Balance de ingresos y egresos, costos por cabeza, rentabilidad por especie.",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    id: "completo",
    icon: <FileText className="h-8 w-8" />,
    title: "Completo",
    description: "Reporte integral del rancho que incluye inventario, reproduccion, sanidad y economia.",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
]

export default function ReportesPage() {
  const handleGeneratePDF = (title: string) => {
    toast.success("Generando reporte...", {
      description: `Preparando PDF de ${title}`,
    })
  }

  const handleExportExcel = (title: string) => {
    toast.success("Generando reporte...", {
      description: `Exportando ${title} a Excel`,
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1B4332]">Reportes</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORTS.map((report) => (
          <Card key={report.id} className="flex flex-col">
            <CardContent className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-14 w-14 rounded-xl ${report.bgColor} flex items-center justify-center shrink-0 ${report.color}`}>
                  {report.icon}
                </div>
                <h2 className="text-xl font-bold">{report.title}</h2>
              </div>
              <p className="text-base text-muted-foreground mb-6 flex-1">{report.description}</p>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  className="flex-1 h-12 text-base"
                  onClick={() => handleGeneratePDF(report.title)}
                >
                  <FileDown className="h-4 w-4" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-12 text-base"
                  onClick={() => handleExportExcel(report.title)}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

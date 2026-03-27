"use client";

import { FileDown, FileSpreadsheet } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export interface ReportMetric {
  label: string;
  value: number;
  total: number;
  unit?: string;
}

interface ProgressReportProps {
  title: string;
  period: string;
  metrics: ReportMetric[];
  onExportPdf?: () => void;
  onExportExcel?: () => void;
}

export function ProgressReport({
  title,
  period,
  metrics,
  onExportPdf,
  onExportExcel,
}: ProgressReportProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{period}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {metrics.map((metric) => {
          const pct = metric.total > 0 ? Math.round((metric.value / metric.total) * 100) : 0;
          return (
            <div key={metric.label} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{metric.label}</span>
                <span className="font-medium">
                  {metric.value.toLocaleString("es-MX")}
                  {metric.unit ? ` ${metric.unit}` : ""} / {metric.total.toLocaleString("es-MX")}
                  {" "}({pct}%)
                </span>
              </div>
              <Progress value={pct} />
            </div>
          );
        })}
      </CardContent>

      <CardFooter className="gap-2">
        <Button variant="outline" size="sm" onClick={onExportPdf}>
          <FileDown className="mr-1 h-4 w-4" />
          Exportar PDF
        </Button>
        <Button variant="outline" size="sm" onClick={onExportExcel}>
          <FileSpreadsheet className="mr-1 h-4 w-4" />
          Exportar Excel
        </Button>
      </CardFooter>
    </Card>
  );
}

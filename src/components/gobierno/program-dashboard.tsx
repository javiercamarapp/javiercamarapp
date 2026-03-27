"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { GobiernoProgram, ProgramStatus } from "@/types/gobierno";

interface ProgramMetrics {
  ranchosRegistrados: number;
  ranchosMeta: number;
  animalesRegistrados: number;
  animalesMeta: number;
  inseminacionesRealizadas: number;
  inseminacionesMeta: number;
  sementalesDistribuidos: number;
  sementalesMeta: number;
}

interface ProgramDashboardProps {
  program: GobiernoProgram;
  metrics: ProgramMetrics;
  trend: "up" | "down" | "stable";
}

const STATUS_STYLES: Record<ProgramStatus, { label: string; className: string }> = {
  activo: { label: "Activo", className: "bg-green-100 text-green-800 border-green-200" },
  pausado: { label: "Pausado", className: "bg-amber-100 text-amber-800 border-amber-200" },
  finalizado: { label: "Finalizado", className: "bg-gray-100 text-gray-800 border-gray-200" },
  en_revisión: { label: "En revisión", className: "bg-blue-100 text-blue-800 border-blue-200" },
};

function formatMXN(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function pct(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

function TrendArrow({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-600" />;
  if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-600" />;
  return <Minus className="h-4 w-4 text-gray-400" />;
}

export function ProgramDashboard({ program, metrics, trend }: ProgramDashboardProps) {
  const statusStyle = STATUS_STYLES[program.status];

  const progressBars = [
    {
      label: "Ranchos",
      value: metrics.ranchosRegistrados,
      total: metrics.ranchosMeta,
    },
    {
      label: "Animales",
      value: metrics.animalesRegistrados,
      total: metrics.animalesMeta,
    },
    {
      label: "Inseminaciones",
      value: metrics.inseminacionesRealizadas,
      total: metrics.inseminacionesMeta,
    },
    {
      label: "Sementales",
      value: metrics.sementalesDistribuidos,
      total: metrics.sementalesMeta,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{program.name}</CardTitle>
          <div className="flex items-center gap-2">
            <TrendArrow trend={trend} />
            <Badge className={statusStyle.className}>{statusStyle.label}</Badge>
          </div>
        </div>
        <CardDescription>{program.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Budget */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Presupuesto</span>
          <span className="font-semibold">{formatMXN(program.budgetMxn)}</span>
        </div>

        {/* Executed */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Ejecutado</span>
          <span className="font-semibold">
            {formatMXN(program.executedMxn)} ({pct(program.executedMxn, program.budgetMxn)}%)
          </span>
        </div>

        {/* Date range */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Periodo</span>
          <span>
            {new Date(program.startDate).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
            {" — "}
            {new Date(program.endDate).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>

        {/* Progress bars */}
        <div className="space-y-3 pt-2">
          {progressBars.map((bar) => {
            const percentage = pct(bar.value, bar.total);
            return (
              <div key={bar.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{bar.label}</span>
                  <span className="font-medium">
                    {bar.value.toLocaleString("es-MX")} / {bar.total.toLocaleString("es-MX")} ({percentage}%)
                  </span>
                </div>
                <Progress value={percentage} />
              </div>
            );
          })}
        </div>
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground">
        {program.currentBeneficiaries.toLocaleString("es-MX")} de{" "}
        {program.maxBeneficiaries.toLocaleString("es-MX")} beneficiarios
      </CardFooter>
    </Card>
  );
}

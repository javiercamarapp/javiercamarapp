"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

export interface MunicipalityRow {
  municipio: string;
  ranchos: number;
  cabezas: number;
  crecimiento: number; // percentage
  coberturaVacunal: number; // percentage
  estado: "bueno" | "regular" | "critico";
}

type SortKey = keyof MunicipalityRow;
type SortDir = "asc" | "desc";

const ESTADO_STYLES: Record<string, { label: string; className: string }> = {
  bueno: { label: "Bueno", className: "bg-green-100 text-green-800 border-green-200" },
  regular: { label: "Regular", className: "bg-amber-100 text-amber-800 border-amber-200" },
  critico: { label: "Crítico", className: "bg-red-100 text-red-800 border-red-200" },
};

interface MunicipalityTableProps {
  data: MunicipalityRow[];
}

export function MunicipalityTable({ data }: MunicipalityTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("municipio");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sorted = useMemo(() => {
    const copy = [...data];
    copy.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc"
          ? aVal.localeCompare(bVal, "es")
          : bVal.localeCompare(aVal, "es");
      }
      const diff = (aVal as number) - (bVal as number);
      return sortDir === "asc" ? diff : -diff;
    });
    return copy;
  }, [data, sortKey, sortDir]);

  const columns: { key: SortKey; label: string; align?: string }[] = [
    { key: "municipio", label: "Municipio" },
    { key: "ranchos", label: "Ranchos", align: "right" },
    { key: "cabezas", label: "Cabezas", align: "right" },
    { key: "crecimiento", label: "Crecimiento %", align: "right" },
    { key: "coberturaVacunal", label: "Cobertura Vacunal %", align: "right" },
    { key: "estado", label: "Estado" },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead
              key={col.key}
              className={`cursor-pointer select-none ${col.align === "right" ? "text-right" : ""}`}
              onClick={() => handleSort(col.key)}
            >
              <span className="inline-flex items-center gap-1">
                {col.label}
                <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
              </span>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((row) => {
          const estilo = ESTADO_STYLES[row.estado];
          return (
            <TableRow key={row.municipio}>
              <TableCell className="font-medium">{row.municipio}</TableCell>
              <TableCell className="text-right">
                {row.ranchos.toLocaleString("es-MX")}
              </TableCell>
              <TableCell className="text-right">
                {row.cabezas.toLocaleString("es-MX")}
              </TableCell>
              <TableCell className="text-right">
                {row.crecimiento.toFixed(1)}%
              </TableCell>
              <TableCell className="text-right">
                {row.coberturaVacunal.toFixed(1)}%
              </TableCell>
              <TableCell>
                <Badge className={estilo.className}>{estilo.label}</Badge>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

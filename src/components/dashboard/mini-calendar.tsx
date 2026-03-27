"use client";

import { useMemo } from "react";
import { startOfWeek, addDays, isSameDay, format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

export type CalendarEventType = "partos" | "vacunas" | "alertas";

export interface CalendarEvent {
  date: Date;
  type: CalendarEventType;
  count: number;
}

interface MiniCalendarProps {
  events: CalendarEvent[];
  onDayClick?: (date: Date) => void;
}

const DOT_COLORS: Record<CalendarEventType, string> = {
  partos: "bg-green-500",
  vacunas: "bg-amber-500",
  alertas: "bg-red-500",
};

export function MiniCalendar({ events, onDayClick }: MiniCalendarProps) {
  const today = new Date();

  const weekDays = useMemo(() => {
    const monday = startOfWeek(today, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  }, [today]);

  function getEventsForDay(date: Date): CalendarEvent[] {
    return events.filter((e) => isSameDay(e.date, date));
  }

  return (
    <div className="rounded-lg border bg-card p-3 shadow-sm">
      <div className="mb-2 text-xs font-medium text-muted-foreground">
        Semana del{" "}
        {format(weekDays[0], "d 'de' MMMM", { locale: es })}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Day labels */}
        {weekDays.map((day) => (
          <div
            key={`label-${day.toISOString()}`}
            className="text-center text-[10px] font-medium uppercase text-muted-foreground"
          >
            {format(day, "EEE", { locale: es })}
          </div>
        ))}

        {/* Day numbers + dots */}
        {weekDays.map((day) => {
          const isToday = isSameDay(day, today);
          const dayEvents = getEventsForDay(day);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onDayClick?.(day)}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-md py-1 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332]",
                isToday
                  ? "bg-[#1B4332] text-white"
                  : "hover:bg-muted/50"
              )}
            >
              <span
                className={cn(
                  "text-sm font-semibold tabular-nums",
                  isToday ? "text-white" : "text-foreground"
                )}
              >
                {format(day, "d")}
              </span>

              {/* Colored dots */}
              <div className="flex gap-0.5">
                {dayEvents.map((evt) => (
                  <span
                    key={evt.type}
                    className={cn("h-1.5 w-1.5 rounded-full", DOT_COLORS[evt.type])}
                    title={`${evt.count} ${evt.type}`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

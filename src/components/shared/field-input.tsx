"use client";

import { cn } from "@/lib/utils";

type InputSize = "normal" | "large" | "huge";

interface FieldInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  size?: InputSize;
  placeholder?: string;
  min?: number;
  max?: number;
}

const SIZE_CLASSES: Record<InputSize, string> = {
  normal: "h-10 text-base",
  large: "h-14 text-2xl",
  huge: "h-20 text-5xl",
};

export function FieldInput({
  label,
  value,
  onChange,
  unit,
  size = "normal",
  placeholder = "0",
  min,
  max,
}: FieldInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => {
            const raw = e.target.value;
            // Allow digits, single decimal point, and empty string
            if (/^(\d+\.?\d*)?$/.test(raw)) {
              const num = parseFloat(raw);
              if (min !== undefined && !isNaN(num) && num < min) return;
              if (max !== undefined && !isNaN(num) && num > max) return;
              onChange(raw);
            }
          }}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-lg border border-input bg-background px-3 font-semibold tabular-nums shadow-sm transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:ring-offset-1",
            "placeholder:text-muted-foreground/50",
            SIZE_CLASSES[size]
          )}
        />
        {unit && (
          <span
            className={cn(
              "shrink-0 font-medium text-muted-foreground",
              size === "huge" ? "text-3xl" : size === "large" ? "text-lg" : "text-sm"
            )}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

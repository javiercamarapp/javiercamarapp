"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

export function QuickAction({
  icon: Icon,
  label,
  onClick,
  variant = "primary",
}: QuickActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-14 w-full items-center gap-3 rounded-xl px-4 text-base font-medium shadow-sm transition-colors active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] focus-visible:ring-offset-2",
        variant === "primary"
          ? "bg-[#1B4332] text-white hover:bg-[#1B4332]/90"
          : "border border-input bg-background text-foreground hover:bg-accent"
      )}
    >
      <Icon className="h-6 w-6 shrink-0" />
      <span>{label}</span>
    </button>
  );
}

"use client"

import { Bot, ChevronRight } from "lucide-react"
import Link from "next/link"

interface AiInsightCardProps {
  insights: { message: string; actionUrl?: string }[]
}

export function AiInsightCard({ insights }: AiInsightCardProps) {
  return (
    <div className="rounded-xl border-2 border-[#22C55E]/30 bg-[#22C55E]/5 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5 text-[#1B4332]" />
        <h3 className="font-semibold text-[#1B4332]">HatoAI Insights</h3>
        <span className="text-xs bg-[#22C55E]/20 text-[#1B4332] px-2 py-0.5 rounded-full font-medium">
          AI
        </span>
      </div>
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-lg bg-white/60"
          >
            <div className="h-6 w-6 rounded-full bg-[#1B4332]/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold text-[#1B4332]">{i + 1}</span>
            </div>
            <p className="text-sm text-foreground flex-1">{insight.message}</p>
            {insight.actionUrl && (
              <Link href={insight.actionUrl}>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </Link>
            )}
          </div>
        ))}
      </div>
      <Link
        href="/dashboard/ai-insights"
        className="text-sm font-medium text-[#1B4332] hover:underline flex items-center gap-1"
      >
        Ver todos los insights
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  )
}

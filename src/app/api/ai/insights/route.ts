import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { SYSTEM_PROMPT } from "@/lib/ai/prompts"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { ranchoId, prompt } = await request.json()

    if (!ranchoId || !prompt) {
      return NextResponse.json(
        { error: "ranchoId y prompt son requeridos" },
        { status: 400 }
      )
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key no configurada" },
        { status: 500 }
      )
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: "Error de AI: " + errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    const content = data.content?.[0]?.text || "{}"

    let insights
    try {
      insights = JSON.parse(content)
    } catch {
      insights = { raw: content }
    }

    return NextResponse.json({ insights })
  } catch (error) {
    console.error("AI insights error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

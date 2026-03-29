import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateCreditScore } from '@/lib/ai/credit-score'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const input = await req.json()
    const score = calculateCreditScore(input)
    return NextResponse.json(score)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error calculando credit score' },
      { status: 500 }
    )
  }
}

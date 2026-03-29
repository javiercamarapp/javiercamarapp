import { NextResponse } from 'next/server'
import { calculateCreditScore } from '@/lib/ai/credit-score'

export async function POST(req: Request) {
  try {
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

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const formData = await req.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    // Send to OpenAI Whisper API
    const whisperForm = new FormData()
    whisperForm.append('file', audioFile)
    whisperForm.append('model', 'whisper-1')
    whisperForm.append('language', 'es')
    whisperForm.append('response_format', 'text')

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: whisperForm,
    })

    if (!response.ok) {
      console.error('Whisper API error:', response.status)
      return NextResponse.json({ error: 'Error transcribiendo audio' }, { status: 500 })
    }

    const transcription = await response.text()

    return NextResponse.json({ transcription: transcription.trim() })
  } catch (error) {
    console.error('Transcription error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

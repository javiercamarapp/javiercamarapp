import { NextResponse } from 'next/server'
import { callClaude, parseJSONResponse } from '@/lib/ai/client'
import { createClient } from '@/lib/supabase/server'

// Verify webhook (GET) — Meta sends this to verify the endpoint
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'hatoai_webhook_2026'

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 })
  }
  return new Response('Forbidden', { status: 403 })
}

// Receive messages (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const entry = body.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value
    const message = value?.messages?.[0]

    if (!message) {
      return NextResponse.json({ status: 'no_message' })
    }

    const from = message.from // phone number
    const text = message.text?.body || message.audio?.id || ''
    const messageType = message.type // text, audio, image

    // Find user by phone number
    const supabase = await createClient()
    const { data: perfil } = await supabase
      .from('perfiles')
      .select('id, nombre')
      .eq('telefono', from)
      .single()

    if (!perfil) {
      // Send response: "No encontramos tu cuenta. Regístrate en app.hatoai.com"
      await sendWhatsAppMessage(from, '¡Hola! No encontramos una cuenta de HatoAI vinculada a este número. Regístrate en app.hatoai.com y agrega tu teléfono para usar esta función.')
      return NextResponse.json({ status: 'user_not_found' })
    }

    // Get user's ranch
    const { data: ranchoUser } = await supabase
      .from('rancho_usuarios')
      .select('rancho_id')
      .eq('user_id', perfil.id)
      .eq('activo', true)
      .single()

    if (!ranchoUser) {
      await sendWhatsAppMessage(from, 'No tienes un rancho registrado. Completa tu registro en app.hatoai.com')
      return NextResponse.json({ status: 'no_ranch' })
    }

    // Parse the message with AI
    let parsedText = text

    // If audio, transcribe first (placeholder - needs Whisper API)
    if (messageType === 'audio') {
      parsedText = '[Audio recibido - transcripción pendiente]'
    }

    // Use Claude to parse the event
    const systemPrompt = `Eres el parser de WhatsApp de HatoAI. El ganadero ${perfil.nombre} te envía mensajes por WhatsApp sobre su rancho.

Convierte el mensaje en un evento estructurado. Responde en JSON:
{
  "tipo": "pesaje|parto|vacunacion|leche|muerte|venta|compra|enfermedad|otro",
  "animal": "nombre o ID mencionado",
  "datos": {"campo": "valor"},
  "respuesta": "Mensaje corto de confirmación para enviar por WhatsApp (máximo 160 caracteres)",
  "tabla_destino": "pesajes|eventos_reproductivos|eventos_sanitarios|produccion_leche|movimientos_economicos"
}

Si no puedes interpretar el mensaje, responde:
{"tipo": "otro", "respuesta": "No entendí tu mensaje. Prueba algo como: 'La Negra pesó 465 kg' o 'Vacuné 12 bovinos contra rabia'"}`

    const content = await callClaude({
      systemPrompt,
      userMessage: parsedText,
      maxTokens: 500,
    })

    const parsed = parseJSONResponse(content, {
      tipo: 'otro',
      respuesta: 'Recibido. Revisa tu app de HatoAI para más detalles.',
    })

    // TODO: Save to database based on parsed.tabla_destino
    // For now, log and respond

    // Send confirmation back via WhatsApp
    await sendWhatsAppMessage(from, `✅ ${parsed.respuesta}`)

    // Log the interaction
    await supabase.from('activity_log').insert({
      rancho_id: ranchoUser.rancho_id,
      user_id: perfil.id,
      tabla: 'whatsapp_messages',
      accion: 'INSERT',
      datos_nuevos: { mensaje: parsedText, parsed, from },
    })

    return NextResponse.json({ status: 'processed', parsed })
  } catch (error) {
    console.error('WhatsApp webhook error:', error)
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}

async function sendWhatsAppMessage(to: string, text: string) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID

  if (!token || !phoneNumberId) {
    console.log('WhatsApp not configured. Would send to', to, ':', text)
    return
  }

  try {
    await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: text },
        }),
      }
    )
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error)
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromCookies } from '@/lib/auth'
import { getAIResponse } from '@/lib/ai'

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromCookies(req.headers.get('cookie'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = await verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Session expired. Please log in again.' }, { status: 401 })

    const body = await req.json()
    if (!Array.isArray(body?.messages)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const response = await getAIResponse(body.messages)
    return NextResponse.json(response)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/ai/chat] error:', message)

    if (message.includes('API key')) {
      return NextResponse.json({ error: message }, { status: 503 })
    }
    if (message.includes('credits')) {
      return NextResponse.json({ error: message }, { status: 402 })
    }
    if (message.includes('Rate limit')) {
      return NextResponse.json({ error: message }, { status: 429 })
    }

    // Return the real error message so it shows in the chat UI during development
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

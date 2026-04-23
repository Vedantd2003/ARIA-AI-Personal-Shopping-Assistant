import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromCookies } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const token = getTokenFromCookies(req.headers.get('cookie'))
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const payload = await verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

  // Return user data straight from the verified JWT — no Map lookup needed
  return NextResponse.json({ user: { id: payload.userId, email: payload.email } })
}

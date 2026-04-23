import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createUser, findUserByEmail } from '@/lib/users'
import { signToken } from '@/lib/auth'
import { generateId } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 })
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password is required.' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      )
    }

    if (!/(?=.*[A-Z])(?=.*[0-9])/.test(password)) {
      return NextResponse.json(
        { error: 'Password must include at least one uppercase letter and one number.' },
        { status: 400 }
      )
    }

    const existing = findUserByEmail(email)
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = createUser({
      id: generateId(),
      email: email.toLowerCase(),
      passwordHash,
      createdAt: new Date().toISOString(),
    })

    const token = await signToken({ userId: user.id, email: user.email })

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email },
    })

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}

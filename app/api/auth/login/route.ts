import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { findUserByEmail } from '@/lib/users'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 })
    }

    const user = findUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: 'No account found with this email.' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
    }

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

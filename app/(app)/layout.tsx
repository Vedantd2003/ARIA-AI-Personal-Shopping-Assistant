import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) redirect('/login')

  const payload = await verifyToken(token)
  if (!payload) redirect('/login')

  // JWT is the source of truth — no in-memory Map lookup needed
  return <>{children}</>
}

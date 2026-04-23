'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useStore } from '@/store/useStore'
import { Input } from '@/components/ui/Input'
import { Sparkles, Mail, Lock, ArrowRight, ShoppingBag, Zap, Shield } from 'lucide-react'

const FEATURES = [
  { icon: <Sparkles size={14} />, text: 'AI-powered recommendations' },
  { icon: <Zap size={14} />, text: 'Voice-first experience' },
  { icon: <Shield size={14} />, text: 'Zero-regret guarantee' },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser } = useStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Login failed.'); return }
      setUser(data.user)
      window.location.href = '/app'
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#060912] flex overflow-hidden relative">
      {/* Ambient orbs */}
      <div className="orb w-[500px] h-[500px] bg-violet-900/20 -top-48 -left-24 pointer-events-none" />
      <div className="orb w-[300px] h-[300px] bg-indigo-800/15 bottom-0 right-0 pointer-events-none" />

      {/* Left panel — hidden on mobile */}
      <div className="hidden lg:flex flex-col justify-between w-[440px] flex-shrink-0 p-10 border-r border-white/5 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-violet">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="font-bold text-white text-lg">ARIA</span>
        </div>

        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/20 flex items-center justify-center mb-6">
              <ShoppingBag size={24} className="text-violet-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
              Shop smarter with<br />
              <span className="gradient-text">AI guidance</span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed mb-8">
              Tell ARIA what you need. It asks the right questions and picks the perfect product — no more decision fatigue.
            </p>
            <div className="space-y-3">
              {FEATURES.map((f) => (
                <div key={f.text} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center text-violet-400">
                    {f.icon}
                  </div>
                  <span className="text-sm text-slate-300">{f.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <p className="text-xs text-slate-700">© 2025 ARIA. Built with ♥ and AI.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="font-bold text-white">ARIA</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-slate-500 text-sm mb-7">Sign in to continue shopping smarter.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email address" type="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={14} />} autoComplete="email" required
            />
            <Input label="Password" type="password" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={14} />} autoComplete="current-password" required
            />

            <AnimatedError error={error} />

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.97 } : {}}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium text-sm shadow-violet hover:brightness-110 disabled:opacity-60 transition-all"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign in <ArrowRight size={16} /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Create one free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

function AnimatedError({ error }: { error: string }) {
  if (!error) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      className="overflow-hidden"
    >
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
        {error}
      </div>
    </motion.div>
  )
}

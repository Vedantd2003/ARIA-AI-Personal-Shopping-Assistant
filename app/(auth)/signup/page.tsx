'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useStore } from '@/store/useStore'
import { Input } from '@/components/ui/Input'
import { Sparkles, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react'

const rules = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
]

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const { setUser } = useStore()

  const allMet = rules.every((r) => r.test(password))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Signup failed.'); return }
      setUser(data.user)
      window.location.href = '/app'
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#060912] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="orb w-[500px] h-[500px] bg-violet-900/18 -top-32 -right-24 pointer-events-none" />
      <div className="orb w-[300px] h-[300px] bg-indigo-800/12 bottom-0 -left-16 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220 }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring' }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-violet mb-4"
          >
            <Sparkles size={26} className="text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white">Create account</h1>
          <p className="text-slate-500 text-sm mt-1">Start shopping smarter with ARIA.</p>
        </div>

        {/* Value props */}
        <div className="grid grid-cols-3 gap-2 mb-7">
          {['Voice-first', 'Zero regrets', 'Smart picks'].map((label, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
              className="glass rounded-xl p-2.5 text-center border border-white/6"
            >
              <p className="text-[11px] text-slate-400 font-medium">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Form */}
        <div className="glass rounded-2xl p-6 border border-white/8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={14} />} autoComplete="email" required
            />

            <div>
              <Input label="Password" type="password" placeholder="Create a strong password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setShowRules(true) }}
                onFocus={() => setShowRules(true)}
                icon={<Lock size={14} />} autoComplete="new-password" required
              />
              {showRules && password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2.5 space-y-1.5 overflow-hidden"
                >
                  {rules.map((r) => (
                    <div key={r.label} className="flex items-center gap-1.5 text-xs">
                      <CheckCircle2 size={11} className={r.test(password) ? 'text-emerald-400' : 'text-slate-600'} />
                      <span className={r.test(password) ? 'text-slate-400' : 'text-slate-600'}>{r.label}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading || (password.length > 0 && !allMet)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium text-sm shadow-violet hover:brightness-110 disabled:opacity-60 transition-all mt-1"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create account <ArrowRight size={16} /></>
              )}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-600 mt-5">
          Already have an account?{' '}
          <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

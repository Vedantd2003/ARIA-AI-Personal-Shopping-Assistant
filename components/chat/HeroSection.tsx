'use client'

import { motion } from 'framer-motion'
import { Sparkles, Mic, MessageSquare } from 'lucide-react'

const CHIPS = [
  { label: 'Best phone under ₹30k', icon: '📱' },
  { label: 'Laptop for coding', icon: '💻' },
  { label: 'Gaming headphones', icon: '🎧' },
  { label: 'Running shoes', icon: '👟' },
  { label: 'DSLR camera', icon: '📷' },
  { label: '4K Smart TV', icon: '📺' },
]

interface HeroSectionProps {
  onChipClick: (text: string) => void
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 28 } },
}

export function HeroSection({ onChipClick }: HeroSectionProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-center h-full px-6 py-12 text-center relative"
    >
      {/* Background glow orbs */}
      <div className="orb w-96 h-96 bg-violet-700/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="orb w-64 h-64 bg-indigo-600/10 top-1/4 right-1/4" />

      {/* Icon */}
      <motion.div variants={item} className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-violet mx-auto relative z-10">
          <Sparkles size={34} className="text-white" />
        </div>
        {/* Pulse rings */}
        <div className="absolute inset-0 rounded-3xl border-2 border-violet-500/30 animate-ping" style={{ animationDuration: '2s' }} />
      </motion.div>

      {/* Headline */}
      <motion.h1 variants={item} className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
        Your{' '}
        <span className="gradient-text">AI Personal</span>
        <br />Shopper
      </motion.h1>

      <motion.p variants={item} className="text-slate-400 text-base mb-3 max-w-sm leading-relaxed">
        Get smart, personalized recommendations with voice or chat.
        <br />No more decision fatigue.
      </motion.p>

      {/* Feature pills */}
      <motion.div variants={item} className="flex items-center gap-3 mb-10 flex-wrap justify-center">
        {[
          { icon: <Mic size={12} />, label: 'Voice-first' },
          { icon: <Sparkles size={12} />, label: 'Zero regrets' },
          { icon: <MessageSquare size={12} />, label: 'Deep reasoning' },
        ].map(({ icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass border border-white/8 text-xs text-slate-400"
          >
            <span className="text-violet-400">{icon}</span>
            {label}
          </div>
        ))}
      </motion.div>

      {/* Suggestion chips */}
      <motion.div variants={item} className="w-full max-w-lg">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
          Try asking about
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CHIPS.map((chip) => (
            <motion.button
              key={chip.label}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onChipClick(chip.label)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl glass border border-white/8 hover:border-violet-500/40 hover:bg-violet-500/8 transition-all text-left group"
            >
              <span className="text-lg flex-shrink-0 leading-none">{chip.icon}</span>
              <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors leading-tight">
                {chip.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

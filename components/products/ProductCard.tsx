'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Product } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Check, X, ChevronDown, AlertTriangle, TrendingUp, Shield } from 'lucide-react'

interface ProductCardProps {
  product: Product
  rank: 1 | 2 | 3
  hiddenCosts?: string[]
  longTermValue?: string
}

const regretColors = {
  low: 'green' as const,
  medium: 'yellow' as const,
  high: 'red' as const,
}

const regretLabels = {
  low: 'Low regret risk',
  medium: 'Some regret risk',
  high: 'Higher regret risk',
}

function ScoreRing({ score }: { score: number }) {
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <motion.circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-ring"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-white">{score}</span>
        <span className="text-[9px] text-slate-500">score</span>
      </div>
    </div>
  )
}

export function ProductCard({ product, rank, hiddenCosts, longTermValue }: ProductCardProps) {
  const [expanded, setExpanded] = useState(false)
  const isPrimary = rank === 1

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: (rank - 1) * 0.1, type: 'spring', stiffness: 200 }}
      className={`
        relative overflow-hidden rounded-2xl border transition-all duration-300
        ${isPrimary
          ? 'bg-gradient-to-br from-violet-950/60 to-indigo-950/60 border-violet-500/30 shadow-glow-violet'
          : 'glass border-white/8 hover:border-violet-500/20'
        }
      `}
    >
      {/* Primary badge */}
      {isPrimary && (
        <div className="absolute top-0 right-0">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
            BEST PICK
          </div>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <ScoreRing score={product.score} />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-base leading-tight">{product.name}</h3>
            <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{product.tagline}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xl font-bold gradient-text">{product.price}</span>
              <Badge variant={regretColors[product.regretRisk]}>
                <Shield size={9} />
                {regretLabels[product.regretRisk]}
              </Badge>
            </div>
          </div>
        </div>

        {/* Pros & Cons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wide mb-2">Pros</p>
            <ul className="space-y-1.5">
              {product.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
                  <Check size={11} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-red-400 uppercase tracking-wide mb-2">Cons</p>
            <ul className="space-y-1.5">
              {product.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-slate-400">
                  <X size={11} className="text-red-400 mt-0.5 flex-shrink-0" />
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Why This */}
        {isPrimary && (
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-3 mb-3">
            <p className="text-[10px] font-semibold text-violet-400 uppercase tracking-wide mb-1">Why this fits you</p>
            <p className="text-xs text-slate-300 leading-relaxed">{product.whyThis}</p>
          </div>
        )}

        {/* Expandable details */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-300 transition-colors py-1"
        >
          <span>Regret risk & long-term value</span>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={14} />
          </motion.div>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="pt-3 space-y-3">
                <div className="flex items-start gap-2 p-3 bg-amber-500/8 rounded-xl border border-amber-500/15">
                  <AlertTriangle size={12} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-amber-400 mb-0.5">Regret scenario</p>
                    <p className="text-xs text-slate-400">{product.regretReason}</p>
                  </div>
                </div>

                {longTermValue && (
                  <div className="flex items-start gap-2 p-3 bg-blue-500/8 rounded-xl border border-blue-500/15">
                    <TrendingUp size={12} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-semibold text-blue-400 mb-0.5">Long-term value</p>
                      <p className="text-xs text-slate-400">{longTermValue}</p>
                    </div>
                  </div>
                )}

                {hiddenCosts && hiddenCosts.length > 0 && (
                  <div className="p-3 bg-white/3 rounded-xl border border-white/6">
                    <p className="text-[10px] font-semibold text-slate-400 mb-2">Hidden costs to consider</p>
                    <ul className="space-y-1">
                      {hiddenCosts.map((cost, i) => (
                        <li key={i} className="text-xs text-slate-500 flex items-start gap-1.5">
                          <span className="text-slate-600 mt-0.5">•</span>
                          {cost}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

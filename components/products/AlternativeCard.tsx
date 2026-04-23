'use client'

import { motion } from 'framer-motion'
import { AlternativeProduct } from '@/types'
import { Check, X, ArrowRight } from 'lucide-react'

interface AlternativeCardProps {
  product: AlternativeProduct
  rank: 2 | 3
}

export function AlternativeCard({ product, rank }: AlternativeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
      className="glass rounded-xl p-4 border border-white/6 glass-hover"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h4 className="font-medium text-white text-sm">{product.name}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{product.tagline}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-bold text-slate-200">{product.price}</p>
          <div className="flex items-center gap-1 mt-0.5 justify-end">
            <div className="text-xs text-slate-500">{product.score}/100</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="space-y-1">
          {product.pros.slice(0, 2).map((pro, i) => (
            <div key={i} className="flex items-start gap-1 text-xs text-slate-400">
              <Check size={10} className="text-emerald-400 mt-0.5 flex-shrink-0" />
              {pro}
            </div>
          ))}
        </div>
        <div className="space-y-1">
          {product.cons.slice(0, 2).map((con, i) => (
            <div key={i} className="flex items-start gap-1 text-xs text-slate-500">
              <X size={10} className="text-red-400/70 mt-0.5 flex-shrink-0" />
              {con}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-1.5 bg-white/3 rounded-lg p-2.5">
        <ArrowRight size={11} className="text-violet-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-slate-400">{product.whyConsider}</p>
      </div>
    </motion.div>
  )
}

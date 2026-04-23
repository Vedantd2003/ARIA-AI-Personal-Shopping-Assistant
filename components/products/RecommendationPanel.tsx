'use client'

import { motion } from 'framer-motion'
import { RecommendationData } from '@/types'
import { ProductCard } from './ProductCard'
import { AlternativeCard } from './AlternativeCard'
import { Sparkles, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface RecommendationPanelProps {
  recommendation: RecommendationData
  summary: string
  onStartOver: () => void
}

export function RecommendationPanel({ recommendation, summary, onStartOver }: RecommendationPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full overflow-y-auto space-y-4 pr-1"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} className="text-violet-400" />
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-wide">ARIA's Recommendation</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{summary}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onStartOver}
          className="flex-shrink-0 gap-1.5 text-slate-500 hover:text-slate-300"
        >
          <RotateCcw size={13} />
          <span className="hidden sm:inline">Start over</span>
        </Button>
      </div>

      {/* Primary recommendation */}
      <ProductCard
        product={recommendation.primary}
        rank={1}
        hiddenCosts={recommendation.hiddenCosts}
        longTermValue={recommendation.longTermValue}
      />

      {/* Alternatives */}
      {recommendation.alternatives.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Alternatives to consider</p>
          <div className="space-y-3">
            {recommendation.alternatives.map((alt, i) => (
              <AlternativeCard key={i} product={alt} rank={(i + 2) as 2 | 3} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

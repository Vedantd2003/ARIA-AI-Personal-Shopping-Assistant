'use client'

import { motion } from 'framer-motion'

interface WaveformProps {
  isActive: boolean
  className?: string
}

const BARS = [
  { delay: 0, minH: 6, maxH: 28 },
  { delay: 0.1, minH: 10, maxH: 40 },
  { delay: 0.2, minH: 8, maxH: 48 },
  { delay: 0.05, minH: 12, maxH: 36 },
  { delay: 0.15, minH: 6, maxH: 44 },
  { delay: 0.25, minH: 10, maxH: 32 },
  { delay: 0.08, minH: 8, maxH: 40 },
]

export function Waveform({ isActive, className = '' }: WaveformProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {BARS.map((bar, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-violet-400"
          animate={
            isActive
              ? {
                  height: [bar.minH, bar.maxH, bar.minH],
                  opacity: [0.6, 1, 0.6],
                }
              : { height: 4, opacity: 0.3 }
          }
          transition={
            isActive
              ? {
                  duration: 0.8 + bar.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: bar.delay,
                }
              : { duration: 0.3 }
          }
          style={{ height: 4 }}
        />
      ))}
    </div>
  )
}

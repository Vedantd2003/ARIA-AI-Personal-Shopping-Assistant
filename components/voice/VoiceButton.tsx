'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Square } from 'lucide-react'
import { VoiceState } from '@/hooks/useVoice'

interface VoiceButtonProps {
  voiceState: VoiceState
  isSupported: boolean
  onStart: () => void
  onStop: () => void
  size?: 'sm' | 'md'
}

const WAVEFORM_BARS = [
  { h: [4, 22, 4], dur: 0.9 },
  { h: [4, 34, 4], dur: 1.1 },
  { h: [4, 44, 4], dur: 0.8 },
  { h: [4, 30, 4], dur: 1.0 },
  { h: [4, 40, 4], dur: 0.85 },
  { h: [4, 26, 4], dur: 1.05 },
  { h: [4, 36, 4], dur: 0.95 },
]

export function VoiceButton({ voiceState, isSupported, onStart, onStop, size = 'md' }: VoiceButtonProps) {
  const isListening = voiceState === 'listening'
  const isIdle = voiceState === 'idle'
  const btnSize = size === 'sm' ? 'w-10 h-10' : 'w-16 h-16'
  const iconSize = size === 'sm' ? 16 : 24

  const handleClick = () => {
    if (!isSupported) return
    if (isListening) onStop()
    else if (isIdle) onStart()
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={!isSupported}
      whileHover={isSupported ? { scale: 1.06 } : {}}
      whileTap={isSupported ? { scale: 0.93 } : {}}
      className={`relative ${btnSize} rounded-full flex items-center justify-center flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all duration-300 ${
        isListening
          ? 'bg-gradient-to-br from-red-500 to-rose-600'
          : isSupported
          ? 'bg-gradient-to-br from-violet-600 to-indigo-600 shadow-violet-sm hover:shadow-violet'
          : 'bg-white/5 cursor-not-allowed'
      }`}
    >
      {/* Pulse rings — only when idle and supported */}
      {isIdle && isSupported && size === 'md' && (
        <>
          {[1, 2].map((i) => (
            <span
              key={i}
              className="absolute inset-0 rounded-full border-2 border-violet-500/30"
              style={{
                animation: `micPulse ${1.5 + i * 0.4}s ease-out infinite`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </>
      )}

      {/* Listening rings */}
      <AnimatePresence>
        {isListening && (
          <>
            {[1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute inset-0 rounded-full border-2 border-red-400/40"
                initial={{ scale: 1, opacity: 0.7 }}
                animate={{ scale: 1 + i * 0.7, opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3, ease: 'easeOut' }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Icon */}
      <AnimatePresence mode="wait">
        {isListening ? (
          <motion.div
            key="stop"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Square size={iconSize - 4} fill="white" className="text-white" />
          </motion.div>
        ) : !isSupported ? (
          <MicOff size={iconSize} className="text-white/40" />
        ) : (
          <motion.div
            key="mic"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Mic size={iconSize} className="text-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recording dot */}
      {isListening && (
        <motion.div
          className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-white"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </motion.button>
  )
}

export function WaveformVisualizer({ isActive }: { isActive: boolean }) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scaleY: 0.5 }}
          animate={{ opacity: 1, scaleY: 1 }}
          exit={{ opacity: 0, scaleY: 0.5 }}
          className="flex items-center gap-[3px] px-2"
        >
          {WAVEFORM_BARS.map((bar, i) => (
            <motion.div
              key={i}
              className="w-[3px] rounded-full bg-violet-400"
              animate={{ height: bar.h }}
              transition={{ duration: bar.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 0.07 }}
              style={{ height: 4 }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

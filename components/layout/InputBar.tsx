'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, AlertCircle, X } from 'lucide-react'
import { VoiceButton, WaveformVisualizer } from '@/components/voice/VoiceButton'
import { VoiceState } from '@/hooks/useVoice'

interface InputBarProps {
  onSend: (text: string) => void
  isLoading: boolean
  voiceState: VoiceState
  isVoiceSupported: boolean
  voiceError: string | null
  onVoiceStart: () => void
  onVoiceStop: () => void
  onClearVoiceError: () => void
}

export function InputBar({
  onSend,
  isLoading,
  voiceState,
  isVoiceSupported,
  voiceError,
  onVoiceStart,
  onVoiceStop,
  onClearVoiceError,
}: InputBarProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const isListening = voiceState === 'listening'
  const canSend = input.trim().length > 0 && !isLoading

  // Listen for quick reply events from chat bubbles
  useEffect(() => {
    const handler = (e: CustomEvent<string>) => {
      setInput(e.detail)
      inputRef.current?.focus()
    }
    window.addEventListener('aria:quickreply', handler as EventListener)
    return () => window.removeEventListener('aria:quickreply', handler as EventListener)
  }, [])

  const handleSend = () => {
    const text = input.trim()
    if (!text || isLoading) return
    onSend(text)
    setInput('')
  }

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }, [input])

  return (
    <div className="flex-shrink-0 px-4 pb-4 pt-2">
      {/* Voice error */}
      <AnimatePresence>
        {voiceError && (
          <motion.div
            initial={{ opacity: 0, y: 6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 6, height: 0 }}
            className="overflow-hidden mb-2"
          >
            <div className="flex items-center gap-2 bg-red-500/8 border border-red-500/20 rounded-xl px-3 py-2">
              <AlertCircle size={13} className="text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-400 flex-1">{voiceError}</p>
              <button onClick={onClearVoiceError} className="text-red-400/50 hover:text-red-400 transition-colors">
                <X size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Waveform when listening */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-center mb-2 overflow-hidden"
          >
            <div className="flex items-center gap-2 glass border border-red-500/20 rounded-xl px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
              <WaveformVisualizer isActive />
              <span className="text-xs text-slate-400">Listening… tap mic to stop</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main input container */}
      <div className="input-glow glass rounded-2xl border border-white/8 transition-all duration-200 overflow-hidden">
        <div className="flex items-end gap-2 px-3 py-2.5">
          {/* Voice button */}
          <div className="flex-shrink-0 pb-0.5">
            <VoiceButton
              voiceState={voiceState}
              isSupported={isVoiceSupported}
              onStart={onVoiceStart}
              onStop={onVoiceStop}
              size="sm"
            />
          </div>

          {/* Textarea */}
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={isListening ? 'Listening…' : isLoading ? 'ARIA is thinking…' : 'Ask ARIA anything…'}
            disabled={isLoading || isListening}
            rows={1}
            className="flex-1 bg-transparent text-sm text-slate-200 placeholder:text-slate-600 outline-none resize-none leading-relaxed py-1.5 min-h-[36px] max-h-[120px] disabled:opacity-50 transition-opacity"
          />

          {/* Send button */}
          <motion.button
            onClick={handleSend}
            disabled={!canSend}
            whileHover={canSend ? { scale: 1.08 } : {}}
            whileTap={canSend ? { scale: 0.92 } : {}}
            className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 pb-0.5 ${
              canSend
                ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-violet-sm hover:shadow-violet'
                : 'bg-white/5 text-slate-600 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={15} className={canSend ? 'text-white' : 'text-slate-600'} />
            )}
          </motion.button>
        </div>

        {/* Character limit hint */}
        {input.length > 200 && (
          <div className="px-4 pb-2">
            <span className={`text-[10px] ${input.length > 500 ? 'text-red-400' : 'text-slate-600'}`}>
              {input.length}/500
            </span>
          </div>
        )}
      </div>

      <p className="text-center text-[10px] text-slate-700 mt-2">
        ARIA can make mistakes. Always verify important purchases.
      </p>
    </div>
  )
}

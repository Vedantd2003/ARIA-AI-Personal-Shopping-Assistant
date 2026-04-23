'use client'

import { motion } from 'framer-motion'
import { ChatMessage } from '@/types'
import { formatTime } from '@/lib/utils'
import { Sparkles } from 'lucide-react'

interface ChatBubbleProps {
  message: ChatMessage
  index: number
}

function safeContent(content: string): string {
  if (content.trimStart().startsWith('{')) {
    try {
      const p = JSON.parse(content)
      if (typeof p?.message === 'string') return p.message
    } catch {}
  }
  return content
}

const SUGGESTED_REPLIES: Record<string, string[]> = {
  budget: ['Under ₹10,000', 'Under ₹25,000', 'Under ₹50,000', 'No limit'],
  use: ['Daily use', 'Gaming', 'Work/Office', 'Travel'],
  brand: ['No preference', 'Premium brands only', 'Value for money'],
}

function getSuggestions(content: string): string[] {
  const lower = content.toLowerCase()
  if (lower.includes('budget') || lower.includes('price') || lower.includes('spend')) return SUGGESTED_REPLIES.budget
  if (lower.includes('use') || lower.includes('purpose') || lower.includes('need it for')) return SUGGESTED_REPLIES.use
  if (lower.includes('brand') || lower.includes('prefer')) return SUGGESTED_REPLIES.brand
  return []
}

export function ChatBubble({ message, index }: ChatBubbleProps) {
  const isUser = message.role === 'user'
  const isThinking = message.type === 'thinking'
  const suggestions = !isUser && !isThinking ? getSuggestions(message.content) : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 32, delay: index * 0.03 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      {!isUser && (
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20, delay: index * 0.03 + 0.1 }}
          className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-violet-sm self-end mb-1"
        >
          <Sparkles size={13} className="text-white" />
        </motion.div>
      )}

      <div className={`max-w-[78%] flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Bubble */}
        {isThinking ? (
          <div className="glass rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
            <span className="text-xs text-slate-500">ARIA is thinking…</span>
          </div>
        ) : (
          <motion.div
            whileHover={{ scale: 1.005 }}
            className={`px-4 py-3 rounded-2xl text-sm leading-relaxed relative ${
              isUser
                ? 'bubble-user text-white rounded-tr-sm'
                : 'glass text-slate-200 rounded-bl-sm border border-white/6'
            }`}
          >
            {safeContent(message.content)}
          </motion.div>
        )}

        {/* Timestamp */}
        {!isThinking && (
          <span className="text-[10px] text-slate-700 px-1">{formatTime(message.timestamp)}</span>
        )}

        {/* Suggested quick replies */}
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-1.5"
          >
            {suggestions.map((s) => (
              <button
                key={s}
                className="px-2.5 py-1 rounded-full text-[11px] border border-violet-500/25 text-violet-400 hover:bg-violet-500/10 hover:border-violet-500/50 hover:text-violet-300 transition-all"
                onClick={() => {
                  // Will be handled by parent via window event
                  window.dispatchEvent(new CustomEvent('aria:quickreply', { detail: s }))
                }}
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* User avatar dot */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center self-end mb-1">
          <span className="text-xs font-bold text-slate-300">U</span>
        </div>
      )}
    </motion.div>
  )
}

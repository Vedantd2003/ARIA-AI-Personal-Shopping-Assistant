'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ChatMessage } from '@/types'
import { ChatBubble } from './ChatBubble'
import { HeroSection } from './HeroSection'

interface ChatContainerProps {
  messages: ChatMessage[]
  isLoading: boolean
  onChipClick: (text: string) => void
}

export function ChatContainer({ messages, isLoading, onChipClick }: ChatContainerProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const visibleMessages = messages.filter((m) => m.type !== 'recommendation')
  const isEmpty = visibleMessages.length === 0

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (isEmpty) {
    return <HeroSection onChipClick={onChipClick} />
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      <AnimatePresence initial={false}>
        {visibleMessages.map((msg, i) => (
          <ChatBubble key={msg.id} message={msg} index={i} />
        ))}
      </AnimatePresence>
      <div ref={bottomRef} className="h-2" />
    </div>
  )
}

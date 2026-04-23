'use client'

import { useCallback } from 'react'
import { useStore } from '@/store/useStore'
import { ChatMessage } from '@/types'
import { generateId } from '@/lib/utils'

export function useChat() {
  const {
    messages, isLoading, progress,
    addMessage, setLoading, setProgress,
    startNewSession, persistCurrentSession,
  } = useStore()

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      type: 'text',
      timestamp: Date.now(),
    }
    addMessage(userMsg)

    const thinkingMsg: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: '',
      type: 'thinking',
      timestamp: Date.now(),
    }
    addMessage(thinkingMsg)
    setLoading(true)

    try {
      const history = [...useStore.getState().messages, userMsg]
        .filter((m) => m.type !== 'thinking')
        .map((m) => ({
          role: m.role,
          content:
            m.role === 'assistant' && m.recommendation
              ? `I recommended: ${m.content}`
              : m.content,
        }))

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to get response')

      const type: string = data?.type ?? 'question'
      const recommendation = data?.recommendation ?? undefined
      let message: string = typeof data?.message === 'string' ? data.message : ''
      if (!message || message.trimStart().startsWith('{')) {
        message = "I'm here to help. What are you looking to buy?"
      }
      const prog: number | undefined = data?.progress

      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: message,
        type: type === 'recommendation' ? 'recommendation' : 'text',
        recommendation,
        timestamp: Date.now(),
      }

      useStore.setState((state) => ({
        messages: [...state.messages.filter((m) => m.type !== 'thinking'), assistantMsg],
      }))

      if (prog !== undefined) setProgress(prog)

      // Auto-persist after each assistant reply
      setTimeout(() => persistCurrentSession(), 300)
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
        type: 'text',
        timestamp: Date.now(),
      }
      useStore.setState((state) => ({
        messages: [...state.messages.filter((m) => m.type !== 'thinking'), errorMsg],
      }))
    } finally {
      setLoading(false)
    }
  }, [messages, isLoading, addMessage, setLoading, setProgress, persistCurrentSession])

  return { messages, isLoading, progress, sendMessage, startNewSession }
}

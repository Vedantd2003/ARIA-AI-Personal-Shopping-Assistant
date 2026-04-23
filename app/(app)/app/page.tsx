'use client'

import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useChat } from '@/hooks/useChat'
import { useVoice } from '@/hooks/useVoice'
import { useStore } from '@/store/useStore'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { InputBar } from '@/components/layout/InputBar'
import { ChatContainer } from '@/components/chat/ChatContainer'
import { RecommendationPanel } from '@/components/products/RecommendationPanel'
import { RecommendationData } from '@/types'
import { LayoutGrid, MessageSquare } from 'lucide-react'

export default function AppPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'picks'>('chat')
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const { messages, isLoading, progress, sendMessage, startNewSession } = useChat()
  const { user } = useStore()
  const didInit = useRef(false)

  // Auto-open sidebar on desktop
  useEffect(() => {
    if (window.innerWidth >= 768) {
      useStore.getState().setSidebarOpen(true)
    }
  }, [])

  // Hydrate user from JWT if Zustand was cleared (e.g. hard refresh)
  useEffect(() => {
    if (!user) {
      fetch('/api/auth/me')
        .then((r) => r.json())
        .then((d) => { if (d.user) useStore.getState().setUser(d.user) })
        .catch(() => {})
    }
    if (!didInit.current && messages.length === 0) {
      didInit.current = true
      sendMessage('Hello!')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleVoiceResult = (text: string) => sendMessage(text)

  const { voiceState, error: voiceHookError, isSupported, startListening, stopListening } = useVoice(handleVoiceResult)

  useEffect(() => {
    if (voiceHookError) {
      setVoiceError(voiceHookError)
      const t = setTimeout(() => setVoiceError(null), 5000)
      return () => clearTimeout(t)
    }
  }, [voiceHookError])

  const latestRec = [...messages].reverse().find((m) => m.recommendation)
  const recommendation: RecommendationData | undefined = latestRec?.recommendation
  const recSummary = latestRec?.content ?? ''
  const hasRec = !!recommendation

  useEffect(() => {
    if (hasRec) setActiveTab('picks')
  }, [hasRec])

  return (
    <div className="flex h-screen bg-[#060912] overflow-hidden relative">
      {/* Ambient background orbs */}
      <div className="orb w-[500px] h-[500px] bg-violet-900/12 top-0 left-1/4 pointer-events-none" />
      <div className="orb w-[350px] h-[350px] bg-indigo-900/10 bottom-0 right-1/4 pointer-events-none" />

      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar progress={progress} />

        {/* Mobile tab bar — only when recommendation exists */}
        <AnimatePresence>
          {hasRec && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden px-4 pt-2 overflow-hidden"
            >
              <div className="flex glass rounded-xl p-1 border border-white/6">
                <TabBtn active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageSquare size={13} />} label="Chat" />
                <TabBtn active={activeTab === 'picks'} onClick={() => setActiveTab('picks')} icon={<LayoutGrid size={13} />} label="My Picks" badge />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="flex-1 flex gap-3 overflow-hidden px-3 pb-0 pt-3 md:px-4">

          {/* Chat panel */}
          <div className={`flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden rounded-2xl border border-white/6 bg-[#0a0e1a]/60 backdrop-blur-sm ${hasRec && activeTab === 'picks' ? 'hidden md:flex' : 'flex'}`}>
            {/* Chat messages or hero */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              <ChatContainer
                messages={messages}
                isLoading={isLoading}
                onChipClick={sendMessage}
              />
            </div>

            {/* Input bar */}
            <InputBar
              onSend={sendMessage}
              isLoading={isLoading}
              voiceState={voiceState}
              isVoiceSupported={isSupported}
              voiceError={voiceError}
              onVoiceStart={startListening}
              onVoiceStop={stopListening}
              onClearVoiceError={() => setVoiceError(null)}
            />
          </div>

          {/* Recommendations panel */}
          <AnimatePresence>
            {hasRec && recommendation && (
              <motion.div
                key="rec-panel"
                initial={{ opacity: 0, x: 32, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 'auto' }}
                exit={{ opacity: 0, x: 32, width: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 28 }}
                className={`
                  overflow-hidden
                  ${activeTab === 'picks' ? 'flex flex-1' : 'hidden'}
                  md:flex md:w-[380px] md:flex-shrink-0
                `}
              >
                <div className="w-full rounded-2xl border border-white/6 bg-[#0a0e1a]/60 backdrop-blur-sm overflow-y-auto p-4">
                  <RecommendationPanel
                    recommendation={recommendation}
                    summary={recSummary}
                    onStartOver={() => {
                      startNewSession()
                      setActiveTab('chat')
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Spacer below content */}
        <div className="h-3 flex-shrink-0" />
      </div>
    </div>
  )
}

function TabBtn({
  active, onClick, icon, label, badge,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  badge?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
        active ? 'bg-violet-600 text-white' : 'text-slate-500 hover:text-slate-300'
      }`}
    >
      {icon}
      {label}
      {badge && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
    </button>
  )
}

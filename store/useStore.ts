'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ChatMessage, UserPreferences } from '@/types'

export interface Session {
  id: string
  title: string
  messages: ChatMessage[]
  progress: number
  createdAt: number
}

interface AuthState {
  user: { id: string; email: string } | null
  setUser: (user: { id: string; email: string } | null) => void
}

interface SessionState {
  sessions: Session[]
  currentSessionId: string | null
  messages: ChatMessage[]
  isLoading: boolean
  progress: number
  addMessage: (msg: ChatMessage) => void
  setLoading: (v: boolean) => void
  setProgress: (v: number) => void
  startNewSession: () => void
  switchSession: (id: string) => void
  deleteSession: (id: string) => void
  renameSession: (id: string, title: string) => void
  persistCurrentSession: () => void
  clearChat: () => void
}

interface PreferencesState {
  preferences: Partial<UserPreferences>
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
  updatePreferences: (updates: Partial<UserPreferences>) => void
}

type Store = AuthState & SessionState & PreferencesState

function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      setUser: (user) => set({ user }),

      // Sessions
      sessions: [],
      currentSessionId: null,
      messages: [],
      isLoading: false,
      progress: 0,

      addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
      setLoading: (isLoading) => set({ isLoading }),
      setProgress: (progress) => set({ progress }),

      persistCurrentSession: () => {
        const { messages, progress, currentSessionId, sessions } = get()
        if (messages.filter((m) => m.type !== 'thinking').length === 0) return

        const firstUserMsg = messages.find((m) => m.role === 'user')
        const title = firstUserMsg?.content?.slice(0, 45) || 'New conversation'

        if (currentSessionId) {
          set({
            sessions: sessions.map((s) =>
              s.id === currentSessionId ? { ...s, messages, progress } : s
            ),
          })
        } else {
          const session: Session = { id: genId(), title, messages, progress, createdAt: Date.now() }
          set({ sessions: [session, ...sessions], currentSessionId: session.id })
        }
      },

      clearChat: () => set({ messages: [], progress: 0, currentSessionId: null }),

      startNewSession: () => {
        get().persistCurrentSession()
        set({ messages: [], progress: 0, currentSessionId: null })
      },

      switchSession: (id) => {
        get().persistCurrentSession()
        const session = get().sessions.find((s) => s.id === id)
        if (session) {
          set({ messages: session.messages, progress: session.progress, currentSessionId: id })
        }
      },

      deleteSession: (id) => {
        const { currentSessionId, sessions } = get()
        const next = sessions.filter((s) => s.id !== id)
        if (currentSessionId === id) {
          set({ sessions: next, messages: [], progress: 0, currentSessionId: null })
        } else {
          set({ sessions: next })
        }
      },

      renameSession: (id, title) =>
        set((s) => ({ sessions: s.sessions.map((x) => (x.id === id ? { ...x, title } : x)) })),

      // UI
      sidebarOpen: true,
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

      // Preferences
      preferences: {},
      updatePreferences: (updates) =>
        set((s) => ({ preferences: { ...s.preferences, ...updates } })),
    }),
    {
      name: 'aria-v2',
      partialize: (s) => ({
        user: s.user,
        preferences: s.preferences,
        sessions: s.sessions,
        sidebarOpen: s.sidebarOpen,
      }),
    }
  )
)

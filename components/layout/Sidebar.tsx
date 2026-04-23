'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore, Session } from '@/store/useStore'
import { MessageSquare, Plus, Trash2, Pencil, Check, X, Sparkles, Clock } from 'lucide-react'

function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts
  if (diff < 60_000) return 'just now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`
  return `${Math.floor(diff / 86_400_000)}d ago`
}

function SessionItem({
  session, isActive, onSwitch, onDelete, onRename,
}: {
  session: Session
  isActive: boolean
  onSwitch: () => void
  onDelete: () => void
  onRename: (t: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(session.title)
  const [hovered, setHovered] = useState(false)

  const commit = () => { if (draft.trim()) onRename(draft.trim()); setEditing(false) }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className={`group relative rounded-xl border p-3 cursor-pointer mb-1.5 sidebar-item ${
        isActive ? 'active border-violet-500/30' : 'border-transparent'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !editing && onSwitch()}
    >
      <div className="flex items-start gap-2.5">
        <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${isActive ? 'bg-violet-500/20' : 'bg-white/5'}`}>
          <MessageSquare size={11} className={isActive ? 'text-violet-400' : 'text-slate-500'} />
        </div>
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false) }}
                className="flex-1 text-xs bg-white/10 border border-violet-500/40 rounded px-2 py-0.5 text-white outline-none"
              />
              <button onClick={commit} className="text-emerald-400 hover:text-emerald-300"><Check size={12} /></button>
              <button onClick={() => setEditing(false)} className="text-slate-500 hover:text-slate-300"><X size={12} /></button>
            </div>
          ) : (
            <p className="text-xs font-medium text-slate-300 truncate leading-tight">{session.title}</p>
          )}
          <div className="flex items-center gap-1 mt-0.5">
            <Clock size={9} className="text-slate-600" />
            <span className="text-[10px] text-slate-600">{formatRelativeTime(session.createdAt)}</span>
          </div>
        </div>
        <AnimatePresence>
          {(hovered || editing) && !editing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-0.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => { setDraft(session.title); setEditing(true) }}
                className="p-1 rounded text-slate-600 hover:text-violet-400 hover:bg-violet-500/10 transition-colors">
                <Pencil size={11} />
              </button>
              <button onClick={onDelete}
                className="p-1 rounded text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                <Trash2 size={11} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { sessions, currentSessionId, startNewSession, switchSession, deleteSession, renameSession, setSidebarOpen } = useStore()

  const handleSwitch = (id: string) => {
    switchSession(id)
    onClose?.()
  }

  return (
    <div className="w-[260px] h-full flex flex-col border-r border-white/5 bg-[#0C1021]">
      {/* Brand */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-violet-sm flex-shrink-0">
            <Sparkles size={15} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm tracking-tight">ARIA</p>
            <p className="text-[10px] text-slate-600">AI Personal Shopper</p>
          </div>
        </div>
        {/* Close button — visible on mobile */}
        {onClose && (
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/8 transition-all md:hidden">
            <X size={15} />
          </button>
        )}
      </div>

      {/* New chat */}
      <div className="px-3 pt-3 pb-2">
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => { startNewSession(); onClose?.() }}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/20 hover:border-violet-500/40 text-violet-300 hover:text-violet-200 text-sm font-medium transition-all"
        >
          <Plus size={15} />
          New conversation
        </motion.button>
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
              <MessageSquare size={16} className="text-slate-600" />
            </div>
            <p className="text-xs text-slate-600 text-center">No conversations yet.<br />Start chatting!</p>
          </div>
        ) : (
          <>
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-2 px-1">History</p>
            <AnimatePresence>
              {sessions.map((s) => (
                <SessionItem key={s.id} session={s} isActive={s.id === currentSessionId}
                  onSwitch={() => handleSwitch(s.id)}
                  onDelete={() => deleteSession(s.id)}
                  onRename={(t) => renameSession(s.id, t)}
                />
              ))}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  )
}

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useStore()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // Auto-close on mobile on first mount
      if (mobile) setSidebarOpen(false)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Slide-in panel */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              key="mobile-sidebar"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 320, damping: 36 }}
              className="fixed inset-y-0 left-0 z-50 shadow-2xl"
            >
              <SidebarContent onClose={() => setSidebarOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )
  }

  // Desktop — inline flex item with width animation
  return (
    <AnimatePresence initial={false}>
      {sidebarOpen && (
        <motion.aside
          key="desktop-sidebar"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 260, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 35 }}
          className="flex-shrink-0 h-full overflow-hidden"
        >
          <SidebarContent />
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

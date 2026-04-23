'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { Menu, LogOut, User, Sparkles, ChevronRight } from 'lucide-react'

interface TopBarProps {
  progress?: number
}

export function TopBar({ progress = 0 }: TopBarProps) {
  const { user, setUser, clearChat, sidebarOpen, setSidebarOpen } = useStore()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    clearChat()
    router.push('/login')
  }

  return (
    <div className="flex-shrink-0">
      <div className="flex items-center justify-between px-4 h-14 border-b border-white/5">
        {/* Left: sidebar toggle + brand */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/8 transition-all"
          >
            <Menu size={17} />
          </motion.button>

          {!sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <Sparkles size={12} className="text-white" />
              </div>
              <span className="font-semibold text-white text-sm">ARIA</span>
            </motion.div>
          )}
        </div>

        {/* Center: progress breadcrumb */}
        {progress > 0 && progress < 100 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hidden md:flex items-center gap-1.5 text-xs text-slate-500"
          >
            <span className={progress >= 30 ? 'text-violet-400' : ''}>Category</span>
            <ChevronRight size={12} />
            <span className={progress >= 60 ? 'text-violet-400' : ''}>Budget</span>
            <ChevronRight size={12} />
            <span className={progress >= 85 ? 'text-violet-400' : ''}>Priorities</span>
            <ChevronRight size={12} />
            <span className={progress >= 100 ? 'text-violet-400' : ''}>Recommendation</span>
          </motion.div>
        )}

        {/* Right: user + logout */}
        {user && (
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 glass px-3 py-1.5 rounded-xl">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <User size={10} className="text-white" />
              </div>
              <span className="text-xs text-slate-400 max-w-[120px] truncate">{user.email}</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/8 text-slate-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/8 transition-all text-xs font-medium"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Sign out</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {progress > 0 && (
        <div className="h-px bg-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      )}
    </div>
  )
}

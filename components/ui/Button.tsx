'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base = 'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none'

    const variants = {
      primary: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-glow-violet hover:shadow-glow-violet-lg hover:brightness-110',
      secondary: 'glass border border-white/10 text-slate-200 hover:bg-white/10 hover:border-violet-500/40',
      ghost: 'text-slate-400 hover:text-white hover:bg-white/5',
      danger: 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-7 py-3.5 text-base gap-2.5',
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...(props as object)}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
            <span>Loading…</span>
          </>
        ) : (
          children
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
export { Button }

'use client'

import { forwardRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-slate-300">{label}</label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={resolvedType}
            className={cn(
              'w-full rounded-xl bg-white/5 border border-white/8 text-slate-100 placeholder:text-slate-600',
              'py-3 pr-4 text-sm transition-all duration-200 outline-none',
              'focus:border-violet-500/60 focus:bg-white/7 focus:ring-2 focus:ring-violet-500/20',
              'hover:border-white/15',
              icon ? 'pl-10' : 'pl-4',
              isPassword ? 'pr-11' : '',
              error ? 'border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20' : '',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export { Input }

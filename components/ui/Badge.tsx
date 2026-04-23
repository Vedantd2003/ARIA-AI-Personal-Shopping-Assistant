import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'violet' | 'green' | 'yellow' | 'red' | 'blue' | 'slate'
  className?: string
}

const variantStyles = {
  violet: 'bg-violet-500/15 text-violet-300 border-violet-500/20',
  green: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
  yellow: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
  red: 'bg-red-500/15 text-red-300 border-red-500/20',
  blue: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
  slate: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
}

export function Badge({ children, variant = 'slate', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

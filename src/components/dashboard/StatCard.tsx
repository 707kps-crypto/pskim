interface StatCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  color: 'blue' | 'yellow' | 'green' | 'purple' | 'orange' | 'red'
  change?: number
  onClick?: () => void
  active?: boolean
}

const COLOR_MAP: Record<string, { iconBg: string; iconText: string; accent: string; activeBg: string; activeRing: string }> = {
  blue: {
    iconBg: 'bg-blue-500/15',
    iconText: 'text-blue-400',
    accent: 'bg-blue-500',
    activeBg: 'bg-blue-500/10',
    activeRing: 'ring-2 ring-blue-400',
  },
  yellow: {
    iconBg: 'bg-amber-500/15',
    iconText: 'text-amber-400',
    accent: 'bg-amber-500',
    activeBg: 'bg-amber-500/10',
    activeRing: 'ring-2 ring-amber-400',
  },
  green: {
    iconBg: 'bg-emerald-500/15',
    iconText: 'text-emerald-400',
    accent: 'bg-emerald-500',
    activeBg: 'bg-emerald-500/10',
    activeRing: 'ring-2 ring-emerald-400',
  },
  purple: {
    iconBg: 'bg-purple-500/15',
    iconText: 'text-purple-400',
    accent: 'bg-purple-500',
    activeBg: 'bg-purple-500/10',
    activeRing: 'ring-2 ring-purple-400',
  },
  orange: {
    iconBg: 'bg-orange-500/15',
    iconText: 'text-orange-400',
    accent: 'bg-orange-500',
    activeBg: 'bg-orange-500/10',
    activeRing: 'ring-2 ring-orange-400',
  },
  red: {
    iconBg: 'bg-red-500/15',
    iconText: 'text-red-400',
    accent: 'bg-red-500',
    activeBg: 'bg-red-500/10',
    activeRing: 'ring-2 ring-red-400',
  },
}

export default function StatCard({ label, value, icon, color, change, onClick, active }: StatCardProps) {
  const colors = COLOR_MAP[color] || COLOR_MAP.blue
  const isPositive = change !== undefined && change >= 0
  const isNegative = change !== undefined && change < 0
  const isClickable = typeof onClick === 'function'

  return (
    <div
      onClick={onClick}
      className={`
        relative bg-[#141e33] rounded-2xl border border-white/[0.06] p-5 overflow-hidden group
        transition-all duration-300
        ${active ? `${colors.activeBg} ${colors.activeRing} border-transparent` : 'shadow-sm hover:shadow-md hover:border-white/[0.1]'}
        ${isClickable ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''}
      `}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.() } : undefined}
    >
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${colors.accent} opacity-60`} />

      <div className="flex items-start justify-between">
        {/* Left: label + value */}
        <div className="flex flex-col">
          <p className="text-[13px] font-medium text-gray-400 mb-1.5">{label}</p>
          <div className="flex items-end gap-2">
            <p className="text-[28px] font-extrabold text-white leading-none tracking-tight">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {change !== undefined && (
              <span
                className={`
                  inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[11px] font-bold mb-1
                  ${isPositive ? 'bg-emerald-500/15 text-emerald-400' : ''}
                  ${isNegative ? 'bg-red-500/15 text-red-400' : ''}
                `}
              >
                {isPositive && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                  </svg>
                )}
                {isNegative && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
                {isPositive ? '+' : ''}{change}%
              </span>
            )}
          </div>
        </div>

        {/* Right: icon */}
        <div className={`w-11 h-11 rounded-xl ${colors.iconBg} ${colors.iconText} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

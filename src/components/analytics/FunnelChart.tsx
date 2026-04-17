'use client'

interface FunnelStep {
  label: string
  value: number
  eventName: string
}

interface FunnelChartProps {
  steps: FunnelStep[]
}

export default function FunnelChart({ steps }: FunnelChartProps) {
  if (!steps || steps.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        퍼널 데이터 없음
      </div>
    )
  }

  const maxVal = Math.max(...steps.map((s) => s.value), 1)

  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        const widthPct = (step.value / maxVal) * 100
        const dropRate =
          i > 0 && steps[i - 1].value > 0
            ? Math.round((1 - step.value / steps[i - 1].value) * 100)
            : null

        return (
          <div key={step.eventName} className="relative">
            {/* Drop-off indicator */}
            {dropRate !== null && (
              <div className="flex items-center justify-end mb-1">
                <span className="text-[10px] text-red-400 font-medium">
                  -{dropRate}% 이탈
                </span>
              </div>
            )}
            <div className="flex items-center gap-3">
              {/* Step number */}
              <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-blue-400">{i + 1}</span>
              </div>
              {/* Bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-300 truncate">{step.label}</span>
                  <span className="text-xs font-semibold text-white ml-2">{step.value.toLocaleString()}</span>
                </div>
                <div className="w-full h-7 bg-white/[0.04] rounded-lg overflow-hidden">
                  <div
                    className="h-full rounded-lg transition-all duration-500"
                    style={{
                      width: `${Math.max(widthPct, 2)}%`,
                      background: `linear-gradient(90deg, rgba(59,130,246,0.6), rgba(59,130,246,${0.2 + (widthPct / 100) * 0.4}))`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

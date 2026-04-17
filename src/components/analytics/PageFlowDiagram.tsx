'use client'

interface FlowNode {
  page: string
  views: number
}

interface FlowLink {
  from: string
  to: string
  count: number
}

interface PageFlowDiagramProps {
  nodes: FlowNode[]
  links: FlowLink[]
}

export default function PageFlowDiagram({ nodes, links }: PageFlowDiagramProps) {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        페이지 흐름 데이터 없음
      </div>
    )
  }

  const maxViews = Math.max(...nodes.map((n) => n.views), 1)
  const sorted = [...nodes].sort((a, b) => b.views - a.views).slice(0, 8)

  // Build link map for display
  const linkMap = new Map<string, { to: string; count: number }[]>()
  for (const link of links) {
    const arr = linkMap.get(link.from) || []
    arr.push({ to: link.to, count: link.count })
    linkMap.set(link.from, arr)
  }

  return (
    <div className="space-y-2">
      {sorted.map((node, i) => {
        const barWidth = (node.views / maxViews) * 100
        const outLinks = linkMap.get(node.page) || []

        return (
          <div key={node.page} className="group">
            <div className="flex items-center gap-3">
              {/* Rank */}
              <span className="text-[10px] text-gray-500 w-4 text-right flex-shrink-0">{i + 1}</span>
              {/* Page name + bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs text-gray-300 truncate max-w-[60%]">{node.page}</span>
                  <span className="text-xs font-medium text-white">{node.views.toLocaleString()}</span>
                </div>
                <div className="w-full h-4 bg-white/[0.04] rounded overflow-hidden">
                  <div
                    className="h-full rounded transition-all duration-500"
                    style={{
                      width: `${Math.max(barWidth, 2)}%`,
                      background: `linear-gradient(90deg, rgba(16,185,129,0.5), rgba(16,185,129,${0.15 + (barWidth / 100) * 0.35}))`,
                    }}
                  />
                </div>
              </div>
            </div>
            {/* Flow arrows */}
            {outLinks.length > 0 && (
              <div className="ml-7 mt-1 mb-1 flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {outLinks.slice(0, 3).map((l) => (
                  <span key={l.to} className="text-[10px] text-emerald-400/70 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    &rarr; {l.to} ({l.count})
                  </span>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

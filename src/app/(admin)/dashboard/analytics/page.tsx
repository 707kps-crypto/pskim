'use client'

import { useEffect, useState, useCallback } from 'react'
import FunnelChart from '@/components/analytics/FunnelChart'
import PageFlowDiagram from '@/components/analytics/PageFlowDiagram'

/* ────────────── 타입 ────────────── */
interface RealtimeData {
  activeUsers: number
  pages: { path: string; users: number }[]
}

interface ConversionsData {
  phone_click: number
  cta_click: number
  form_submit: number
  form_visible: number
  form_start: number
  scroll_depth: number
}

interface FunnelStep {
  label: string
  value: number
  eventName: string
}

interface PageFlowData {
  nodes: { page: string; views: number }[]
  links: { from: string; to: string; count: number }[]
}

interface AnalyticsData {
  realtime: RealtimeData
  visitors: number
  pageviews: number
  avgDuration: string
  bounceRate: string
  dailyVisitors: { date: string; count: number }[]
  trafficSources: { source: string; count: number; percent: number }[]
  referrers: { url: string; count: number }[]
  devices: { type: string; count: number; percent: number }[]
  topPages: { path: string; views: number }[]
  regions: { name: string; count: number; percent: number }[]
  conversions: ConversionsData
  funnel: FunnelStep[]
  pageFlow: PageFlowData
}

const PERIOD_OPTIONS = [
  { label: '오늘', value: 1 },
  { label: '7일', value: 7 },
  { label: '14일', value: 14 },
  { label: '30일', value: 30 },
]

/* ────────────── StatCard ────────────── */
function AnalyticsStatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: string
  icon: React.ReactNode
  color: string
}) {
  const colorMap: Record<string, { bg: string; iconBg: string }> = {
    blue: { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', iconBg: 'bg-blue-500/15' },
    green: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', iconBg: 'bg-emerald-500/15' },
    purple: { bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20', iconBg: 'bg-purple-500/15' },
    orange: { bg: 'bg-orange-500/10 text-orange-400 border-orange-500/20', iconBg: 'bg-orange-500/15' },
    amber: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', iconBg: 'bg-amber-500/15' },
    rose: { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20', iconBg: 'bg-rose-500/15' },
    cyan: { bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', iconBg: 'bg-cyan-500/15' },
    indigo: { bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', iconBg: 'bg-indigo-500/15' },
  }
  const scheme = colorMap[color] || colorMap.blue

  return (
    <div className={`rounded-2xl border p-5 ${scheme.bg}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-70 mb-1">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${scheme.iconBg} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

/* ────────────── 빈 테이블 ────────────── */
function EmptyPanel({ title }: { title: string }) {
  return (
    <div className="bg-[#141e33] rounded-2xl border border-white/[0.06] overflow-hidden">
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <h3 className="font-semibold text-white text-sm">{title}</h3>
      </div>
      <div className="p-6 text-center text-gray-400 text-sm">
        데이터 없음
      </div>
    </div>
  )
}

/* ────────────── 바 차트 (심플 CSS) ────────────── */
function SimpleBarChart({ data }: { data: { date: string; count: number }[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        차트 데이터 없음
      </div>
    )
  }

  const maxVal = Math.max(...data.map((d) => d.count), 1)

  return (
    <div className="flex items-end gap-1 h-full px-2 pb-6 pt-4">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[10px] text-gray-400 font-medium">{d.count || ''}</span>
          <div
            className="w-full bg-blue-400 rounded-t-sm min-h-[2px] transition-all duration-300"
            style={{ height: `${(d.count / maxVal) * 100}%` }}
          />
          <span className="text-[9px] text-gray-400 mt-1 truncate w-full text-center">
            {d.date.slice(5)}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ────────────── 데이터 테이블 패널 ────────────── */
function DataPanel({
  title,
  data,
  columns,
}: {
  title: string
  data: { label: string; value: string | number; bar?: number }[]
  columns: [string, string]
}) {
  if (!data || data.length === 0) return <EmptyPanel title={title} />

  return (
    <div className="bg-[#141e33] rounded-2xl border border-white/[0.06] overflow-hidden">
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <h3 className="font-semibold text-white text-sm">{title}</h3>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {/* 헤더 */}
        <div className="flex px-5 py-2 text-[11px] font-medium text-gray-400 uppercase">
          <span className="flex-1">{columns[0]}</span>
          <span className="w-20 text-right">{columns[1]}</span>
        </div>
        {data.map((row, i) => (
          <div key={i} className="flex items-center px-5 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-300 truncate">{row.label}</p>
              {row.bar !== undefined && (
                <div className="w-full h-1.5 bg-white/[0.06] rounded-full mt-1.5">
                  <div
                    className="h-full bg-blue-400 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(row.bar, 100)}%` }}
                  />
                </div>
              )}
            </div>
            <span className="w-20 text-right text-sm font-medium text-white">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ────────────── 메인 페이지 ────────────── */
export default function AnalyticsPage() {
  const [period, setPeriod] = useState(7)
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)

  const fetchAnalytics = useCallback(async (days: number) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/analytics?days=${days}`)
      const json = await res.json()
      if (json.success && json.data) {
        const d = json.data
        const sec = d.avgDuration || 0
        setData({
          realtime: d.realtime || { activeUsers: 0, pages: [] },
          visitors: d.visitors ?? 0,
          pageviews: d.pageviews ?? 0,
          avgDuration: sec > 0 ? `${Math.floor(sec / 60)}분 ${Math.round(sec % 60)}초` : '0분',
          bounceRate: d.bounceRate !== undefined ? `${d.bounceRate}%` : '0%',
          dailyVisitors: d.dailyVisitors || [],
          trafficSources: d.trafficSources || [],
          referrers: d.referrers || [],
          devices: d.devices || [],
          topPages: d.topPages || [],
          regions: d.regions || [],
          conversions: d.conversions || {
            phone_click: 0, cta_click: 0, form_submit: 0,
            form_visible: 0, form_start: 0, scroll_depth: 0,
          },
          funnel: d.funnel || [],
          pageFlow: d.pageFlow || { nodes: [], links: [] },
        })
        setConnected(true)
      } else {
        setData(null)
        setConnected(false)
      }
    } catch {
      setData(null)
      setConnected(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalytics(period)
  }, [period, fetchAnalytics])

  return (
    <div className="space-y-6">
      {/* 헤더 + 기간 필터 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-white">유입통계</h1>
        <div className="flex gap-1.5 bg-white/[0.06] rounded-xl p-1">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              disabled={!connected}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                period === opt.value && connected
                  ? 'bg-white/[0.1] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-300'
              } ${!connected ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* GA4 연결 상태 + 실시간 */}
      {!loading && connected && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 bg-emerald-400 rounded-full" />
                <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-300">GA4 연동됨</p>
                <p className="text-xs text-emerald-500">Property ID: 522393091</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-emerald-300">{data?.realtime.activeUsers ?? 0}</p>
              <p className="text-xs text-emerald-500">실시간 접속자 (30분)</p>
            </div>
          </div>
          {data && data.realtime.pages.length > 0 && (
            <div className="mt-3 pt-3 border-t border-emerald-500/20 flex flex-wrap gap-2">
              {data.realtime.pages.map((p, i) => (
                <span key={i} className="text-xs bg-emerald-500/15 text-emerald-400 px-2 py-1 rounded-lg">
                  {p.path} ({p.users})
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* GA4 미연결 안내 */}
      {!connected && !loading && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 text-center">
          <svg className="w-12 h-12 text-amber-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h2 className="text-lg font-bold text-amber-300 mb-2">GA4 연동이 필요합니다</h2>
          <p className="text-sm text-amber-400 mb-4">
            설정 &gt; GA4 연동에서 Property ID와 Service Account를 등록하세요.
          </p>
          <p className="text-xs text-amber-600">
            연동 완료 후 방문자 수, 페이지뷰, 트래픽 소스 등의 실시간 분석 데이터를 확인할 수 있습니다.
          </p>
        </div>
      )}

      {/* 로딩 */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/[0.06] animate-pulse" />
          ))}
        </div>
      )}

      {/* 기본 통계 카드 4x */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnalyticsStatCard
            label="방문자"
            value={data ? data.visitors.toLocaleString() : '--'}
            color="blue"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          <AnalyticsStatCard
            label="페이지뷰"
            value={data ? data.pageviews.toLocaleString() : '--'}
            color="green"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
          />
          <AnalyticsStatCard
            label="평균 체류"
            value={data ? data.avgDuration : '--'}
            color="purple"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <AnalyticsStatCard
            label="이탈률"
            value={data ? data.bounceRate : '--'}
            color="orange"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          />
        </div>
      )}

      {/* 전환 지표 카드 4x (NEW) */}
      {!loading && data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnalyticsStatCard
            label="전화 클릭"
            value={data.conversions.phone_click.toLocaleString()}
            color="amber"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            }
          />
          <AnalyticsStatCard
            label="CTA 클릭"
            value={data.conversions.cta_click.toLocaleString()}
            color="cyan"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            }
          />
          <AnalyticsStatCard
            label="폼 제출"
            value={data.conversions.form_submit.toLocaleString()}
            color="rose"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <AnalyticsStatCard
            label="스크롤 90%"
            value={data.conversions.scroll_depth.toLocaleString()}
            color="indigo"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            }
          />
        </div>
      )}

      {/* 퍼널 분석 패널 (NEW) */}
      {!loading && data && (
        <div className="bg-[#141e33] rounded-2xl border border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white text-sm">전환 퍼널</h3>
            <span className="text-[10px] text-gray-500">방문 &rarr; CTA &rarr; 폼 노출 &rarr; 입력 &rarr; 제출</span>
          </div>
          <FunnelChart steps={data.funnel} />
        </div>
      )}

      {/* 차트 영역 */}
      {!loading && (
        <div className="bg-[#141e33] rounded-2xl border border-white/[0.06] p-6">
          <h3 className="font-semibold text-white text-sm mb-4">일별 방문자 추이</h3>
          <div className="h-56">
            {data && data.dailyVisitors.length > 0 ? (
              <SimpleBarChart data={data.dailyVisitors} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                {connected ? '차트 데이터 없음' : 'GA4 연동 후 차트가 표시됩니다'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 페이지 흐름 다이어그램 (NEW) */}
      {!loading && data && (
        <div className="bg-[#141e33] rounded-2xl border border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white text-sm">페이지 흐름</h3>
            <span className="text-[10px] text-gray-500">상위 페이지별 조회수 및 이동 경로</span>
          </div>
          <PageFlowDiagram nodes={data.pageFlow.nodes} links={data.pageFlow.links} />
        </div>
      )}

      {/* 분석 패널 5개 */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {data ? (
            <>
              <DataPanel
                title="트래픽 소스"
                data={data.trafficSources.map((s) => ({
                  label: s.source,
                  value: `${s.percent}%`,
                  bar: s.percent,
                }))}
                columns={['소스', '비율']}
              />
              <DataPanel
                title="리퍼러"
                data={data.referrers.map((r) => ({
                  label: r.url,
                  value: r.count,
                }))}
                columns={['URL', '유입수']}
              />
              <DataPanel
                title="기기 분포"
                data={data.devices.map((d) => ({
                  label: d.type,
                  value: `${d.percent}%`,
                  bar: d.percent,
                }))}
                columns={['기기', '비율']}
              />
              <DataPanel
                title="상위 페이지"
                data={data.topPages.map((p) => ({
                  label: p.path,
                  value: p.views,
                }))}
                columns={['페이지', '조회수']}
              />
              <DataPanel
                title="지역별"
                data={data.regions.map((r) => ({
                  label: r.name,
                  value: `${r.percent}%`,
                  bar: r.percent,
                }))}
                columns={['지역', '비율']}
              />
            </>
          ) : (
            <>
              <EmptyPanel title="트래픽 소스" />
              <EmptyPanel title="리퍼러" />
              <EmptyPanel title="기기 분포" />
              <EmptyPanel title="상위 페이지" />
              <EmptyPanel title="지역별" />
            </>
          )}
        </div>
      )}
    </div>
  )
}

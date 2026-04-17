'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

/* ────────────── 요금 안내 데이터 ────────────── */
const SERVICES = [
  { name: 'Vercel (호스팅)', plan: 'Free', limit: '월 100GB 대역폭', icon: '▲', color: 'bg-black text-white' },
  { name: 'Airtable (DB)', plan: 'Free', limit: '1,200 레코드', icon: '📊', color: 'bg-blue-100 text-blue-600' },
  { name: 'Cloudflare R2 (이미지)', plan: 'Free', limit: '10GB 저장', icon: '☁️', color: 'bg-orange-100 text-orange-600' },
  { name: 'Google Analytics 4', plan: 'Free', limit: '무제한', icon: '📈', color: 'bg-green-100 text-green-600' },
  { name: 'Telegram Bot (알림)', plan: 'Free', limit: '무제한', icon: '✈️', color: 'bg-sky-100 text-sky-600' },
]

/* ────────────── 트래픽 시뮬레이션 ────────────── */
const TRAFFIC_SCENARIOS = [
  {
    daily: 300,
    monthly: '~9,000',
    bandwidth: '~5GB',
    airtable: '~900건/월',
    status: 'safe',
    label: '여유',
  },
  {
    daily: 500,
    monthly: '~15,000',
    bandwidth: '~12GB',
    airtable: '~1,000건/월',
    status: 'safe',
    label: '안전',
  },
  {
    daily: 1000,
    monthly: '~30,000',
    bandwidth: '~30GB',
    airtable: '~1,100건/월',
    status: 'warning',
    label: '주의',
  },
  {
    daily: 1500,
    monthly: '~45,000',
    bandwidth: '~50GB',
    airtable: '~1,200건/월',
    status: 'danger',
    label: '위험',
  },
]

const STATUS_COLORS: Record<string, string> = {
  safe: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
}

/* ────────────── 메인 페이지 ────────────── */
export default function SettingsPage() {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch('/api/admin-logout', { method: 'POST' })
      router.push('/admin-login')
    } catch {
      setLoggingOut(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">설정</h1>

      {/* ── 서비스 요금 안내 ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">서비스 요금 안내</h2>
        <p className="text-xs text-gray-400 mb-4">현재 모든 서비스가 무료 플랜으로 운영 중입니다.</p>

        <div className="space-y-3">
          {SERVICES.map((svc) => (
            <div
              key={svc.name}
              className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100"
            >
              <div className={`w-10 h-10 rounded-lg ${svc.color} flex items-center justify-center text-sm font-bold shrink-0`}>
                {svc.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{svc.name}</p>
                <p className="text-xs text-gray-400">{svc.limit}</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium shrink-0">
                {svc.plan}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 트래픽 시뮬레이터 ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">트래픽 시뮬레이터</h2>
        <p className="text-xs text-gray-400 mb-4">일 방문자 수에 따른 무료 플랜 소비 예상치입니다.</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2.5 px-3 text-xs font-medium text-gray-500">일 방문자</th>
                <th className="text-left py-2.5 px-3 text-xs font-medium text-gray-500">월 방문자</th>
                <th className="text-left py-2.5 px-3 text-xs font-medium text-gray-500">대역폭</th>
                <th className="text-left py-2.5 px-3 text-xs font-medium text-gray-500">Airtable</th>
                <th className="text-center py-2.5 px-3 text-xs font-medium text-gray-500">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {TRAFFIC_SCENARIOS.map((scenario) => (
                <tr key={scenario.daily} className="hover:bg-gray-50">
                  <td className="py-3 px-3 font-medium text-gray-900">
                    {scenario.daily.toLocaleString()}명
                  </td>
                  <td className="py-3 px-3 text-gray-600">{scenario.monthly}</td>
                  <td className="py-3 px-3 text-gray-600">{scenario.bandwidth}</td>
                  <td className="py-3 px-3 text-gray-600">{scenario.airtable}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[scenario.status]}`}>
                      {scenario.label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-xs text-blue-700">
            <span className="font-semibold">참고:</span> Vercel Free 대역폭은 월 100GB이며,
            일 1,000명 이상 방문 시 유료 전환을 권장합니다.
            Airtable Free는 1,200 레코드까지 지원합니다.
          </p>
        </div>
      </div>

      {/* ── 알림 설정 현황 ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">알림 설정 현황</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-900">텔레그램 알림</p>
              <p className="text-xs text-gray-500">새 접수 시 텔레그램으로 알림</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium">활성</span>
          </div>
          <div className="border-t border-gray-50" />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-900">이메일 알림</p>
              <p className="text-xs text-gray-500">새 접수 시 사내 이메일로 알림</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium">활성</span>
          </div>
          <div className="border-t border-gray-50" />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-900">고객 확인 이메일</p>
              <p className="text-xs text-gray-500">접수 완료 시 고객에게 확인 이메일 발송</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium">활성</span>
          </div>
        </div>
      </div>

      {/* ── 로그아웃 ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">세션</h2>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="px-6 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
        >
          {loggingOut ? '로그아웃 중...' : '로그아웃'}
        </button>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import StatCard from '@/components/dashboard/StatCard'

interface Lead {
  id: string
  기업명: string
  대표자명: string
  연락처: string
  자금종류: string
  접수일시: string
  상태: string
}

interface Post {
  id: string
  제목: string
  카테고리: string
  작성일: string
  공개여부: boolean
}

interface Stats {
  total: number
  신규: number
  대기: number
  상담중: number
  진행중: number
  완료: number
}

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [totalPosts, setTotalPosts] = useState(0)
  const [stats, setStats] = useState<Stats>({ total: 0, 신규: 0, 대기: 0, 상담중: 0, 진행중: 0, 완료: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [leadsRes, boardRes] = await Promise.all([
          fetch('/api/leads'),
          fetch('/api/board'),
        ])
        const leadsData = await leadsRes.json()
        const boardData = await boardRes.json()

        if (leadsData.success) {
          setLeads(leadsData.leads.slice(0, 5))
          setStats(leadsData.stats)
        }
        if (boardData.success) {
          setPosts(boardData.posts.slice(0, 5))
          setTotalPosts(boardData.posts.length)
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const STATUS_COLORS: Record<string, string> = {
    신규: 'bg-blue-500/20 text-blue-400',
    대기: 'bg-yellow-500/20 text-yellow-400',
    상담중: 'bg-purple-500/20 text-purple-400',
    진행중: 'bg-orange-500/20 text-orange-400',
    완료: 'bg-green-500/20 text-green-400',
  }

  const CATEGORY_COLORS: Record<string, string> = {
    성공사례: 'bg-blue-500/20 text-blue-400',
    정책자금: 'bg-green-500/20 text-green-400',
    인증지원: 'bg-purple-500/20 text-purple-400',
  }

  // 스켈레톤 로딩
  if (loading) {
    return (
      <div className="space-y-6">
        {/* 헤더 스켈레톤 */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 bg-white/[0.06] rounded-lg animate-pulse" />
          <div className="h-5 w-48 bg-white/[0.06] rounded-lg animate-pulse" />
        </div>

        {/* 통계 카드 스켈레톤 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[104px] rounded-2xl bg-white/[0.04] animate-pulse">
              <div className="p-5 flex items-center justify-between">
                <div className="space-y-3">
                  <div className="h-4 w-16 bg-white/[0.06] rounded" />
                  <div className="h-8 w-12 bg-white/[0.06] rounded" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/[0.06]" />
              </div>
            </div>
          ))}
        </div>

        {/* 테이블 스켈레톤 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-[#141e33] rounded-2xl border border-white/[0.06] overflow-hidden">
              <div className="px-6 py-4 border-b border-white/[0.04] flex items-center justify-between">
                <div className="h-5 w-24 bg-white/[0.06] rounded animate-pulse" />
                <div className="h-4 w-14 bg-white/[0.06] rounded animate-pulse" />
              </div>
              {[...Array(4)].map((_, j) => (
                <div key={j} className="px-6 py-3.5 flex items-center justify-between border-b border-white/[0.04] last:border-b-0">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-32 bg-white/[0.04] rounded animate-pulse" />
                    <div className="h-3 w-48 bg-white/[0.04] rounded animate-pulse" />
                  </div>
                  <div className="h-6 w-14 bg-white/[0.04] rounded-full animate-pulse" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">대시보드</h1>
        <p className="text-sm text-gray-500">
          마지막 업데이트: {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="전체 접수"
          value={stats.total}
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatCard
          label="대기 중"
          value={stats.신규 + stats.대기}
          color="yellow"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="완료"
          value={stats.완료}
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="게시글"
          value={totalPosts}
          color="purple"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          }
        />
      </div>

      {/* 최근 접수 + 최근 게시글 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 접수 */}
        <div className="bg-[#141e33] rounded-2xl border border-white/[0.06] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.04] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-white">최근 접수</h2>
              {stats.신규 > 0 && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[11px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {stats.신규} 신규
                </span>
              )}
            </div>
            <Link href="/dashboard/leads" className="text-sm text-blue-400 hover:underline font-medium">
              전체보기 &rarr;
            </Link>
          </div>

          {/* Desktop 테이블 */}
          <div className="hidden sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/[0.02]">
                  <th className="text-left px-6 py-2.5 font-medium text-gray-500 text-xs">기업명</th>
                  <th className="text-left px-4 py-2.5 font-medium text-gray-500 text-xs">자금종류</th>
                  <th className="text-left px-4 py-2.5 font-medium text-gray-500 text-xs">접수일</th>
                  <th className="text-right px-6 py-2.5 font-medium text-gray-500 text-xs">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500 text-sm">
                      접수 내역이 없습니다
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-3">
                        <p className="font-medium text-gray-200 truncate max-w-[140px]">{lead.기업명 || lead.대표자명}</p>
                        <p className="text-xs text-gray-500">{lead.대표자명}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{lead.자금종류 || '-'}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{lead.접수일시}</td>
                      <td className="px-6 py-3 text-right">
                        <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[lead.상태] || 'bg-white/[0.06] text-gray-400'}`}>
                          {lead.상태}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile 카드 */}
          <div className="sm:hidden divide-y divide-white/[0.04]">
            {leads.length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-500 text-sm">
                접수 내역이 없습니다
              </div>
            ) : (
              leads.map((lead) => (
                <div key={lead.id} className="px-4 py-3 flex items-center justify-between hover:bg-white/[0.02]">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">{lead.기업명 || lead.대표자명}</p>
                    <p className="text-xs text-gray-500">{lead.자금종류} &middot; {lead.접수일시}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${STATUS_COLORS[lead.상태] || 'bg-white/[0.06] text-gray-400'}`}>
                    {lead.상태}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 최근 게시글 */}
        <div className="bg-[#141e33] rounded-2xl border border-white/[0.06] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.04] flex items-center justify-between">
            <h2 className="font-semibold text-white">최근 게시글</h2>
            <Link href="/dashboard/board" className="text-sm text-blue-400 hover:underline font-medium">
              전체보기 &rarr;
            </Link>
          </div>

          {/* Desktop 테이블 */}
          <div className="hidden sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/[0.02]">
                  <th className="text-left px-6 py-2.5 font-medium text-gray-500 text-xs">제목</th>
                  <th className="text-left px-4 py-2.5 font-medium text-gray-500 text-xs">카테고리</th>
                  <th className="text-left px-4 py-2.5 font-medium text-gray-500 text-xs">작성일</th>
                  <th className="text-right px-6 py-2.5 font-medium text-gray-500 text-xs">공개</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500 text-sm">
                      게시글이 없습니다
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-3">
                        <p className="font-medium text-gray-200 truncate max-w-[180px]">{post.제목}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[post.카테고리] || 'bg-white/[0.06] text-gray-400'}`}>
                          {post.카테고리 || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{post.작성일}</td>
                      <td className="px-6 py-3 text-right">
                        {post.공개여부 ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-400">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            공개
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                            비공개
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile 카드 */}
          <div className="sm:hidden divide-y divide-white/[0.04]">
            {posts.length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-500 text-sm">
                게시글이 없습니다
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="px-4 py-3 flex items-center justify-between hover:bg-white/[0.02]">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">{post.제목}</p>
                    <p className="text-xs text-gray-500">
                      {post.카테고리} &middot; {post.작성일}
                    </p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${post.공개여부 ? 'bg-green-500/20 text-green-400' : 'bg-white/[0.06] text-gray-500'}`}>
                    {post.공개여부 ? '공개' : '비공개'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

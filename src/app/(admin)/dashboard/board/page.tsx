'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

interface Post {
  id: string
  제목: string
  카테고리: string
  작성일: string
  공개여부: boolean
  요약: string
  금액: string
}

const CATEGORY_TABS = ['전체', '성공사례', '정책자금', '인증지원'] as const

const CATEGORY_BADGE: Record<string, string> = {
  성공사례: 'bg-blue-500/20 text-blue-400',
  정책자금: 'bg-green-500/20 text-green-400',
  인증지원: 'bg-purple-500/20 text-purple-400',
}

const CATEGORY_TAB_ACTIVE: Record<string, string> = {
  전체: 'bg-navy text-white border-navy',
  성공사례: 'bg-blue-500 text-white border-blue-500',
  정책자금: 'bg-green-500 text-white border-green-500',
  인증지원: 'bg-purple-500 text-white border-purple-500',
}

export default function BoardManagePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filter, setFilter] = useState<string>('전체')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 2500)
  }

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/board')
      const data = await res.json()
      if (data.success) {
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Board fetch error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" 게시글을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) return

    setDeletingId(id)
    try {
      const res = await fetch(`/api/board?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setPosts((prev) => prev.filter((p) => p.id !== id))
        showToast('success', `"${title}" 삭제됨`)
      } else {
        showToast('error', '삭제 실패: ' + (data.error || '알 수 없는 오류'))
      }
    } catch (error) {
      console.error('Delete error:', error)
      showToast('error', '네트워크 오류')
    } finally {
      setDeletingId(null)
    }
  }

  const filteredPosts = filter === '전체' ? posts : posts.filter((p) => p.카테고리 === filter)

  const getCategoryCount = (tab: string): number => {
    if (tab === '전체') return posts.length
    return posts.filter((p) => p.카테고리 === tab).length
  }

  // 스켈레톤 로딩
  if (loading) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 bg-white/[0.06] rounded-lg animate-pulse" />
          <div className="h-10 w-28 bg-white/[0.04] rounded-xl animate-pulse" />
        </div>
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 w-24 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="bg-[#141e33] rounded-2xl border border-white/[0.06] overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between border-b border-gray-50 last:border-b-0">
              <div className="space-y-2 flex-1">
                <div className="h-4 w-48 bg-white/[0.04] rounded animate-pulse" />
                <div className="h-3 w-64 bg-white/[0.04] rounded animate-pulse" />
              </div>
              <div className="h-6 w-14 bg-white/[0.04] rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-up">
          <div className={`px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg flex items-center gap-2 ${
            toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {toast.type === 'success' ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {toast.message}
          </div>
        </div>
      )}

      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">게시판 관리</h1>
          <p className="text-sm text-gray-400 mt-0.5">총 {posts.length}개 게시글</p>
        </div>
        <Link
          href="/dashboard/board/edit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy text-white text-sm font-medium hover:bg-navy-light transition-all active:scale-95 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 글 작성
        </Link>
      </div>

      {/* 카테고리 필터 탭 */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORY_TABS.map((tab) => {
          const isActive = filter === tab
          const count = getCategoryCount(tab)
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`
                inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap border transition-all duration-200
                ${isActive
                  ? CATEGORY_TAB_ACTIVE[tab] + ' shadow-sm'
                  : 'bg-white/[0.04] text-gray-400 border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.12]'
                }
              `}
            >
              {tab}
              <span className={`
                text-[11px] px-1.5 py-0.5 rounded-full font-bold
                ${isActive ? 'bg-white/20 text-white' : 'bg-white/[0.06] text-gray-400'}
              `}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* 게시글 목록 */}
      <div className="bg-[#141e33] rounded-2xl border border-white/[0.06] overflow-hidden">
        {filteredPosts.length === 0 ? (
          <div className="py-16 text-center">
            <svg className="w-12 h-12 text-white/[0.1] mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <p className="text-gray-400 text-sm">게시글이 없습니다</p>
            <Link
              href="/dashboard/board/edit"
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-blue-500 hover:underline font-medium"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              첫 게시글 작성하기
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/[0.06]">
                    <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">카테고리</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">제목</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">작성일</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">금액</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">공개</th>
                    <th className="text-right px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredPosts.map((post) => (
                    <tr
                      key={post.id}
                      className={`hover:bg-white/[0.02] transition-colors ${deletingId === post.id ? 'opacity-50' : ''}`}
                    >
                      {/* 카테고리 배지 */}
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${CATEGORY_BADGE[post.카테고리] || 'bg-white/[0.06] text-gray-400'}`}>
                          {post.카테고리 || '-'}
                        </span>
                      </td>
                      {/* 제목 + 요약 */}
                      <td className="px-6 py-4 max-w-[320px]">
                        <p className="font-medium text-white truncate">{post.제목}</p>
                        {post.요약 && (
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{post.요약}</p>
                        )}
                      </td>
                      {/* 작성일 */}
                      <td className="px-4 py-4 text-gray-500 text-xs whitespace-nowrap">{post.작성일}</td>
                      {/* 금액 */}
                      <td className="px-4 py-4 text-gray-300 text-xs whitespace-nowrap">
                        {post.금액 ? (
                          <span className="font-medium">{post.금액}</span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                      {/* 공개여부 */}
                      <td className="px-4 py-4 text-center">
                        {post.공개여부 ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            공개
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                            비공개
                          </span>
                        )}
                      </td>
                      {/* 관리 버튼 */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/board/edit?id=${post.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            수정
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id, post.제목)}
                            disabled={deletingId === post.id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            {deletingId === post.id ? (
                              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-white/[0.06]">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className={`p-4 ${deletingId === post.id ? 'opacity-50' : ''}`}
                >
                  {/* 상단: 카테고리 + 공개여부 */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${CATEGORY_BADGE[post.카테고리] || 'bg-white/[0.06] text-gray-400'}`}>
                      {post.카테고리 || '-'}
                    </span>
                    <div className="flex items-center gap-2">
                      {post.공개여부 ? (
                        <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          공개
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                          비공개
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 제목 + 요약 */}
                  <p className="font-medium text-white mb-0.5">{post.제목}</p>
                  {post.요약 && (
                    <p className="text-xs text-gray-400 truncate mb-1.5">{post.요약}</p>
                  )}

                  {/* 날짜 + 금액 */}
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span>{post.작성일}</span>
                    {post.금액 && (
                      <>
                        <span>&middot;</span>
                        <span className="text-gray-300 font-medium">{post.금액}</span>
                      </>
                    )}
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/board/edit?id=${post.id}`}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-blue-600 bg-blue-50 active:bg-blue-100 border border-blue-100"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      수정
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id, post.제목)}
                      disabled={deletingId === post.id}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-red-600 bg-red-50 active:bg-red-100 border border-red-100 disabled:opacity-50"
                    >
                      {deletingId === post.id ? (
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 필터 결과 카운트 */}
      {filter !== '전체' && filteredPosts.length > 0 && (
        <p className="text-xs text-gray-400 text-center">
          {filter} 카테고리 {filteredPosts.length}건
        </p>
      )}
    </div>
  )
}

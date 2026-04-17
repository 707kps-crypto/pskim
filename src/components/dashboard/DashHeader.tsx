'use client'

import { useRouter } from 'next/navigation'

interface DashHeaderProps {
  onMenuToggle: () => void
}

export default function DashHeader({ onMenuToggle }: DashHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/admin-logout', { method: 'POST' })
    router.push('/admin-login')
  }

  return (
    <header className="h-[72px] bg-[#0f1a2e] border-b border-white/[0.06] flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      {/* Left: Hamburger (mobile) */}
      <button
        onClick={onMenuToggle}
        className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-white/[0.06] hover:text-gray-200 active:scale-95 transition-all"
        aria-label="메뉴 열기"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Center spacer for desktop */}
      <div className="hidden md:block flex-1" />

      {/* Right: Admin info + logout */}
      <div className="flex items-center gap-3">
        {/* Admin badge */}
        <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/[0.06]">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-navy to-navy-light flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-gray-200 leading-tight">관리자</span>
            <span className="text-[10px] text-gray-500 leading-tight">Administrator</span>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-8 bg-white/[0.08]" />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] text-gray-400 hover:text-red-400 hover:bg-red-500/10 active:scale-95 transition-all duration-200"
          aria-label="로그아웃"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline font-medium">로그아웃</span>
        </button>
      </div>
    </header>
  )
}

'use client'

import { useEffect, useState } from 'react'

interface Popup {
  id: string
  제목: string
  ALT텍스트: string
  이미지URL: string
  링크URL: string
  링크타겟: string
  순서: number
}

const STORAGE_KEY = 'jni_popup_hide_'

function isHiddenToday(popupId: string): boolean {
  try {
    const saved = localStorage.getItem(STORAGE_KEY + popupId)
    if (!saved) return false
    const today = new Date().toISOString().split('T')[0]
    return saved === today
  } catch {
    return false
  }
}

function hideToday(popupId: string) {
  try {
    const today = new Date().toISOString().split('T')[0]
    localStorage.setItem(STORAGE_KEY + popupId, today)
  } catch {
    // localStorage unavailable
  }
}

export default function PopupModal() {
  const [popups, setPopups] = useState<Popup[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const fetchPopups = async () => {
      try {
        const res = await fetch('/api/popups')
        const data = await res.json()
        if (data.success && data.popups?.length > 0) {
          // 오늘 숨긴 팝업 제외
          const active = data.popups.filter((p: Popup) => !isHiddenToday(p.id))
          if (active.length > 0) {
            setPopups(active)
            setVisible(true)
          }
        }
      } catch {
        // 팝업 로드 실패 시 무시
      }
    }
    fetchPopups()
  }, [])

  if (!visible || popups.length === 0) return null

  const popup = popups[currentIndex]

  const handleClose = () => {
    if (currentIndex < popups.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setVisible(false)
    }
  }

  const handleHideToday = () => {
    hideToday(popup.id)
    handleClose()
  }

  const handleImageClick = () => {
    if (popup.링크URL) {
      window.open(popup.링크URL, popup.링크타겟 || '_blank')
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[420px] animate-fade-up">
        {/* 팝업 카운터 (여러 개일 때) */}
        {popups.length > 1 && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-white/70 text-xs font-medium">
            {currentIndex + 1} / {popups.length}
          </div>
        )}

        {/* 이미지 영역 */}
        <div
          className={`relative rounded-2xl overflow-hidden shadow-2xl bg-white ${popup.링크URL ? 'cursor-pointer' : ''}`}
          onClick={popup.링크URL ? handleImageClick : undefined}
        >
          {popup.이미지URL && (
            <img
              src={popup.이미지URL}
              alt={popup.ALT텍스트 || popup.제목}
              className="w-full h-auto block"
              loading="eager"
            />
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="flex mt-3 rounded-xl overflow-hidden bg-[#1a1a2e]/90 backdrop-blur-sm">
          <button
            onClick={handleHideToday}
            className="flex-1 py-3 text-sm text-gray-300 hover:bg-white/10 transition-colors border-r border-white/10"
          >
            오늘 하루 보지 않기
          </button>
          <button
            onClick={handleClose}
            className="flex-1 py-3 text-sm text-white font-medium hover:bg-white/10 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}

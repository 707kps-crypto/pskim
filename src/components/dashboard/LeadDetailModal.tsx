'use client'

import { useState, useEffect } from 'react'

interface Lead {
  id: string
  기업명: string
  사업자번호: string
  대표자명: string
  연락처: string
  이메일: string
  업종: string
  설립연도: string
  통화가능시간: string
  자금규모: string
  자금종류: string
  문의사항: string
  접수일시: string
  상태: string
  메모: string
}

const STATUS_OPTIONS = ['신규', '대기', '상담중', '진행중', '완료'] as const

const STATUS_CONFIG: Record<string, { bg: string; text: string; ring: string; dot: string; activeBg: string; activeText: string; activeShadow: string }> = {
  신규: { bg: 'bg-blue-500/15', text: 'text-blue-400', ring: 'ring-blue-500/30', dot: 'bg-blue-500', activeBg: 'bg-blue-500', activeText: 'text-white', activeShadow: 'shadow-blue-500/20' },
  대기: { bg: 'bg-amber-500/15', text: 'text-amber-400', ring: 'ring-amber-500/30', dot: 'bg-amber-500', activeBg: 'bg-amber-500', activeText: 'text-white', activeShadow: 'shadow-amber-500/20' },
  상담중: { bg: 'bg-purple-500/15', text: 'text-purple-400', ring: 'ring-purple-500/30', dot: 'bg-purple-500', activeBg: 'bg-purple-500', activeText: 'text-white', activeShadow: 'shadow-purple-500/20' },
  진행중: { bg: 'bg-orange-500/15', text: 'text-orange-400', ring: 'ring-orange-500/30', dot: 'bg-orange-500', activeBg: 'bg-orange-500', activeText: 'text-white', activeShadow: 'shadow-orange-500/20' },
  완료: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', ring: 'ring-emerald-500/30', dot: 'bg-emerald-500', activeBg: 'bg-emerald-500', activeText: 'text-white', activeShadow: 'shadow-emerald-500/20' },
}

interface LeadDetailModalProps {
  lead: Lead
  onClose: () => void
  onUpdate: () => void
}

export default function LeadDetailModal({ lead, onClose, onUpdate }: LeadDetailModalProps) {
  const [status, setStatus] = useState(lead.상태)
  const [memo, setMemo] = useState(lead.메모 || '')
  const [saving, setSaving] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Animate in
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true))
  }, [])

  // Close with animation
  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 2500)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id, status, memo }),
      })
      const data = await res.json()
      if (data.success) {
        showToast('success', '저장 완료')
        setTimeout(() => {
          onUpdate()
          handleClose()
        }, 600)
      } else {
        showToast('error', '저장 실패: ' + (data.error || '알 수 없는 오류'))
      }
    } catch (error) {
      console.error('Update failed:', error)
      showToast('error', '네트워크 오류')
    } finally {
      setSaving(false)
    }
  }

  const fields = [
    { label: '기업명', value: lead.기업명 },
    { label: '사업자번호', value: lead.사업자번호 },
    { label: '대표자명', value: lead.대표자명 },
    { label: '연락처', value: lead.연락처, isPhone: true },
    { label: '이메일', value: lead.이메일, isEmail: true },
    { label: '업종', value: lead.업종 },
    { label: '설립연도', value: lead.설립연도 },
    { label: '통화가능시간', value: lead.통화가능시간 },
    { label: '자금규모', value: lead.자금규모 },
    { label: '자금종류', value: lead.자금종류 },
    { label: '접수일시', value: lead.접수일시 },
  ]

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* Desktop: center modal / Mobile: bottom sheet */}
      <div
        className={`
          absolute
          lg:inset-0 lg:flex lg:items-center lg:justify-center lg:p-6
          max-lg:bottom-0 max-lg:left-0 max-lg:right-0
          transition-all duration-300
          ${isVisible ? 'max-lg:translate-y-0 lg:opacity-100 lg:scale-100' : 'max-lg:translate-y-full lg:opacity-0 lg:scale-95'}
        `}
      >
        <div className="relative bg-[#141e33] lg:rounded-2xl max-lg:rounded-t-3xl shadow-2xl w-full lg:max-w-2xl max-h-[92vh] lg:max-h-[85vh] overflow-hidden flex flex-col">

          {/* Toast notification */}
          {toast && (
            <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all ${
              toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {toast.message}
            </div>
          )}

          {/* Mobile drag handle */}
          <div className="lg:hidden flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-white/[0.15]" />
          </div>

          {/* Header */}
          <div className="sticky top-0 bg-[#141e33] border-b border-white/[0.06] px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center">
                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-white leading-tight">{lead.기업명 || '(기업명 없음)'}</h2>
                <p className="text-[12px] text-gray-500 mt-0.5">{lead.대표자명} &middot; {lead.접수일시}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-white/[0.06] transition-colors"
              aria-label="닫기"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content - scrollable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Status pills - 5-step pipeline */}
            <div>
              <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-3">상태 변경</label>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((opt, idx) => {
                  const config = STATUS_CONFIG[opt]
                  const isSelected = status === opt
                  return (
                    <button
                      key={opt}
                      onClick={() => setStatus(opt)}
                      className={`
                        relative inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[13px] font-semibold
                        transition-all duration-200
                        ${isSelected
                          ? `${config.activeBg} ${config.activeText} shadow-md ${config.activeShadow}`
                          : `${config.bg} ${config.text} hover:opacity-80`
                        }
                      `}
                    >
                      <span className={`
                        w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center
                        ${isSelected ? 'bg-white/30 text-white' : 'bg-white/10'}
                      `}>
                        {idx + 1}
                      </span>
                      {opt}
                      {isSelected && (
                        <svg className="w-4 h-4 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Detail fields */}
            <div>
              <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-3">접수 정보</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {fields.map((field) => (
                  <div key={field.label} className="bg-white/[0.04] rounded-xl px-4 py-3">
                    <p className="text-[11px] font-medium text-gray-500 mb-0.5">{field.label}</p>
                    {field.isPhone && field.value ? (
                      <a
                        href={`tel:${field.value}`}
                        className="text-[14px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {field.value}
                      </a>
                    ) : field.isEmail && field.value ? (
                      <a
                        href={`mailto:${field.value}`}
                        className="text-[14px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {field.value}
                      </a>
                    ) : (
                      <p className="text-[14px] font-semibold text-gray-200">
                        {field.value || '-'}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Inquiry */}
            {lead.문의사항 && (
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-3">문의사항</label>
                <div className="bg-white/[0.04] rounded-xl p-4">
                  <p className="text-[13px] text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {lead.문의사항}
                  </p>
                </div>
              </div>
            )}

            {/* Memo */}
            <div>
              <label htmlFor="lead-memo" className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-3">
                관리자 메모
              </label>
              <textarea
                id="lead-memo"
                rows={3}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-[14px] text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 resize-none transition-all"
                placeholder="메모를 입력하세요..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-[#141e33] border-t border-white/[0.06] px-6 py-4 flex items-center justify-between gap-3">
            {/* Call button */}
            {lead.연락처 ? (
              <a
                href={`tel:${lead.연락처}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-[13px] font-semibold hover:bg-emerald-600 active:scale-95 transition-all shadow-sm shadow-emerald-500/20"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                전화하기
              </a>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl text-[13px] font-medium text-gray-400 hover:bg-white/[0.06] transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-navy text-white text-[13px] font-semibold hover:bg-navy-light active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-navy/20"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    저장 중...
                  </span>
                ) : '저장'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

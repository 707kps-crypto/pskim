'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

/* ────────────── 타입 & 상수 ────────────── */
interface Popup {
  id: string
  제목: string
  ALT텍스트: string
  이미지URL: string
  링크URL: string
  링크타겟: string
  순서: number
  활성여부: boolean
  시작일: string
  종료일: string
}

interface PopupForm {
  제목: string
  ALT텍스트: string
  이미지URL: string
  링크URL: string
  링크타겟: string
  순서: number
  활성여부: boolean
  시작일: string
  종료일: string
}

const MAX_POPUPS = 8

const emptyForm: PopupForm = {
  제목: '',
  ALT텍스트: '',
  이미지URL: '',
  링크URL: '',
  링크타겟: '_blank',
  순서: 1,
  활성여부: true,
  시작일: '',
  종료일: '',
}

/* ────────────── WebP 압축 유틸 ────────────── */
function compressToWebP(file: File, maxSize = 30 * 1024, maxDim = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let w = img.width
        let h = img.height

        if (w > maxDim || h > maxDim) {
          const ratio = Math.min(maxDim / w, maxDim / h)
          w = Math.round(w * ratio)
          h = Math.round(h * ratio)
        }

        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Canvas not supported'))
        ctx.drawImage(img, 0, 0, w, h)

        let quality = 0.7
        let dataUrl = canvas.toDataURL('image/webp', quality)

        // quality를 줄여 목표 크기에 맞춤
        while (dataUrl.length * 0.75 > maxSize && quality > 0.1) {
          quality -= 0.1
          dataUrl = canvas.toDataURL('image/webp', quality)
        }

        // quality 최저인데도 크면 해상도를 600px로 축소 후 재시도
        if (dataUrl.length * 0.75 > maxSize && (w > 600 || h > 600)) {
          const ratio2 = Math.min(600 / w, 600 / h)
          w = Math.round(w * ratio2)
          h = Math.round(h * ratio2)
          canvas.width = w
          canvas.height = h
          const ctx2 = canvas.getContext('2d')
          if (ctx2) {
            ctx2.drawImage(img, 0, 0, w, h)
            quality = 0.7
            dataUrl = canvas.toDataURL('image/webp', quality)
            while (dataUrl.length * 0.75 > maxSize && quality > 0.1) {
              quality -= 0.1
              dataUrl = canvas.toDataURL('image/webp', quality)
            }
          }
        }

        resolve(dataUrl)
      }
      img.onerror = () => reject(new Error('이미지 로드 실패'))
      img.src = reader.result as string
    }
    reader.onerror = () => reject(new Error('파일 읽기 실패'))
    reader.readAsDataURL(file)
  })
}

/* ────────────── R2 이미지 삭제 유틸 (클라이언트) ────────────── */
async function deleteR2ImageClient(url: string): Promise<void> {
  if (!url) return
  try {
    await fetch(`/api/upload-thumbnail?url=${encodeURIComponent(url)}`, {
      method: 'DELETE',
    })
  } catch (e) {
    console.error('[JNI] Failed to delete R2 image:', e)
  }
}

/* ────────────── 상태 배지 유틸 ────────────── */
function getPopupStatus(popup: Popup): { label: string; color: string } {
  const today = new Date().toISOString().split('T')[0]

  if (!popup.활성여부) return { label: '비활성', color: 'bg-white/[0.06] text-gray-500' }

  if (popup.시작일 && popup.시작일 > today) return { label: '예약', color: 'bg-yellow-100 text-yellow-700' }

  if (popup.종료일 && popup.종료일 < today) return { label: '만료', color: 'bg-red-100 text-red-700' }

  return { label: '활성', color: 'bg-green-100 text-green-700' }
}

/* ────────────── 메인 페이지 ────────────── */
export default function PopupsPage() {
  const [popups, setPopups] = useState<Popup[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPopup, setEditingPopup] = useState<Popup | null>(null)
  const [form, setForm] = useState<PopupForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Popup | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  /* ── 데이터 로드 ── */
  const fetchPopups = useCallback(async () => {
    try {
      const res = await fetch('/api/popups?all=true')
      const data = await res.json()
      if (data.success) {
        setPopups(data.popups)
      }
    } catch (error) {
      console.error('Popups fetch error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPopups()
  }, [fetchPopups])

  /* ── 폼 헬퍼 ── */
  const setField = useCallback(<K extends keyof PopupForm>(key: K, value: PopupForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

  /* ── 모달 열기 ── */
  const openCreateModal = () => {
    setEditingPopup(null)
    setForm({ ...emptyForm, 순서: popups.length + 1 })
    setShowModal(true)
    setMessage(null)
  }

  const openEditModal = (popup: Popup) => {
    setEditingPopup(popup)
    setForm({
      제목: popup.제목,
      ALT텍스트: popup.ALT텍스트,
      이미지URL: popup.이미지URL,
      링크URL: popup.링크URL,
      링크타겟: popup.링크타겟 || '_blank',
      순서: popup.순서 || 1,
      활성여부: popup.활성여부,
      시작일: popup.시작일 || '',
      종료일: popup.종료일 || '',
    })
    setShowModal(true)
    setMessage(null)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingPopup(null)
    setForm(emptyForm)
    setMessage(null)
  }

  /* ── 이미지 업로드 ── */
  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: '이미지 파일만 업로드할 수 있습니다.' })
      return
    }
    setUploading(true)
    setMessage(null)
    try {
      // 기존 이미지가 있으면 교체 후 R2에서 삭제
      const oldUrl = form.이미지URL
      const base64 = await compressToWebP(file)
      const res = await fetch('/api/upload-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, filename: file.name }),
      })
      const data = await res.json()
      if (data.success && data.url) {
        setField('이미지URL', data.url)
        if (oldUrl) {
          deleteR2ImageClient(oldUrl)
        }
      } else {
        setMessage({ type: 'error', text: data.error || '업로드 실패' })
      }
    } catch {
      setMessage({ type: 'error', text: '이미지 업로드 중 오류가 발생했습니다.' })
    } finally {
      setUploading(false)
    }
  }

  /* ── 이미지 제거 (R2에서도 삭제) ── */
  const handleRemoveImage = () => {
    const oldUrl = form.이미지URL
    setField('이미지URL', '')
    if (oldUrl) {
      deleteR2ImageClient(oldUrl)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleImageFile(file)
  }

  /* ── 저장 ── */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.제목.trim()) {
      setMessage({ type: 'error', text: '제목을 입력해주세요.' })
      return
    }
    if (!form.이미지URL) {
      setMessage({ type: 'error', text: '이미지를 업로드해주세요.' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      const isEditing = !!editingPopup
      const method = isEditing ? 'PUT' : 'POST'
      const payload = isEditing ? { id: editingPopup!.id, ...form } : form

      const res = await fetch('/api/popups', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (data.success) {
        closeModal()
        await fetchPopups()
      } else {
        setMessage({ type: 'error', text: data.error || '저장 실패' })
      }
    } catch {
      setMessage({ type: 'error', text: '서버 연결에 실패했습니다.' })
    } finally {
      setSaving(false)
    }
  }

  /* ── 삭제 ── */
  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/popups?id=${deleteTarget.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setPopups((prev) => prev.filter((p) => p.id !== deleteTarget.id))
        setDeleteTarget(null)
      }
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-white">팝업 관리</h1>
        <p className="text-sm text-gray-500 mt-1">
          PC에서는 최대 4개까지 노출되며, 모바일에서는 스와이프로 확인 가능합니다.
        </p>
      </div>

      {/* 로딩 */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-white/[0.06] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* 팝업 카드 */}
          {popups.map((popup) => {
            const status = getPopupStatus(popup)
            return (
              <div
                key={popup.id}
                className="bg-[#141e33] rounded-2xl border border-white/[0.06] overflow-hidden group hover:shadow-md transition-shadow"
              >
                {/* 이미지 */}
                <div className="relative aspect-[4/3] bg-white/[0.06]">
                  {popup.이미지URL ? (
                    <img
                      src={popup.이미지URL}
                      alt={popup.ALT텍스트 || popup.제목}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300">
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {/* 순서 배지 */}
                  <span className="absolute top-2 left-2 w-7 h-7 bg-navy text-white text-xs font-bold rounded-lg flex items-center justify-center shadow">
                    {popup.순서}
                  </span>
                  {/* 상태 배지 */}
                  <span className={`absolute top-2 right-2 text-[11px] px-2 py-0.5 rounded-full font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                {/* 정보 */}
                <div className="p-4">
                  <p className="font-medium text-white text-sm truncate">{popup.제목}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {popup.시작일 || '시작일 없음'} ~ {popup.종료일 || '종료일 없음'}
                  </p>

                  {/* 액션 버튼 */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => openEditModal(popup)}
                      className="flex-1 px-3 py-2 rounded-lg text-xs font-medium bg-white/[0.04] text-gray-300 hover:bg-white/[0.08] transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => setDeleteTarget(popup)}
                      className="px-3 py-2 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {/* 추가 카드 */}
          {popups.length < MAX_POPUPS && (
            <button
              onClick={openCreateModal}
              className="flex flex-col items-center justify-center gap-3 min-h-[260px] border-2 border-dashed border-white/[0.08] rounded-2xl hover:border-white/[0.15] hover:bg-white/[0.04] transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-sm text-gray-500 font-medium">팝업 추가</span>
              <span className="text-xs text-gray-400">{popups.length}/{MAX_POPUPS}</span>
            </button>
          )}
        </div>
      )}

      {/* ────── 추가/수정 모달 ────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141e33] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <h2 className="text-lg font-bold text-white">
                {editingPopup ? '팝업 수정' : '팝업 추가'}
              </h2>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-300 hover:bg-white/[0.08] transition-colors"
                aria-label="닫기"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 모달 폼 */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* 메시지 */}
              {message && (
                <div className={`p-3 rounded-xl text-sm ${
                  message.type === 'success'
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}>
                  {message.text}
                </div>
              )}

              {/* 이미지 업로드 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  이미지 <span className="text-red-500">*</span>
                </label>
                {form.이미지URL ? (
                  <div className="relative group">
                    <img
                      src={form.이미지URL}
                      alt="팝업 이미지"
                      className="w-full h-48 object-cover rounded-xl border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="이미지 삭제"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                      uploading
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.04]'
                    }`}
                  >
                    {uploading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs text-blue-600">업로드 중...</p>
                      </>
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xs text-gray-500">클릭 또는 드래그 (WebP, 30KB 이하)</p>
                      </>
                    )}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageFile(file)
                    e.target.value = ''
                  }}
                />
              </div>

              {/* 제목 */}
              <div>
                <label htmlFor="popup-title" className="block text-sm font-medium text-gray-300 mb-1">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  id="popup-title"
                  type="text"
                  value={form.제목}
                  onChange={(e) => setField('제목', e.target.value)}
                  placeholder="팝업 제목"
                  className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] text-sm text-gray-200 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 bg-white/[0.04]"
                  required
                />
              </div>

              {/* ALT 텍스트 */}
              <div>
                <label htmlFor="popup-alt" className="block text-sm font-medium text-gray-300 mb-1">
                  ALT 텍스트
                </label>
                <input
                  id="popup-alt"
                  type="text"
                  value={form.ALT텍스트}
                  onChange={(e) => setField('ALT텍스트', e.target.value)}
                  placeholder="이미지 대체 텍스트 (접근성)"
                  className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] text-sm text-gray-200 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 bg-white/[0.04]"
                />
              </div>

              {/* 링크 URL + 링크 타겟 */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label htmlFor="popup-link" className="block text-sm font-medium text-gray-300 mb-1">
                    링크 URL
                  </label>
                  <input
                    id="popup-link"
                    type="url"
                    value={form.링크URL}
                    onChange={(e) => setField('링크URL', e.target.value)}
                    placeholder="https://"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] text-sm text-gray-200 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 bg-white/[0.04]"
                  />
                </div>
                <div>
                  <label htmlFor="popup-target" className="block text-sm font-medium text-gray-300 mb-1">
                    링크 열기
                  </label>
                  <select
                    id="popup-target"
                    value={form.링크타겟}
                    onChange={(e) => setField('링크타겟', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-white/[0.08] text-sm text-gray-200 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 bg-white/[0.04] bg-white"
                  >
                    <option value="_blank">새 창</option>
                    <option value="_self">같은 창</option>
                  </select>
                </div>
              </div>

              {/* 순서 + 활성 토글 */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label htmlFor="popup-order" className="block text-sm font-medium text-gray-300 mb-1">
                    순서 (1~{MAX_POPUPS})
                  </label>
                  <input
                    id="popup-order"
                    type="number"
                    min={1}
                    max={MAX_POPUPS}
                    value={form.순서}
                    onChange={(e) => setField('순서', Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] text-sm text-gray-200 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 bg-white/[0.04]"
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <span className="text-sm text-gray-300">활성</span>
                  <button
                    type="button"
                    onClick={() => setField('활성여부', !form.활성여부)}
                    className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
                      form.활성여부 ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                    role="switch"
                    aria-checked={form.활성여부}
                    aria-label="활성여부 토글"
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ${
                        form.활성여부 ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* 시작일/종료일 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="popup-start" className="block text-sm font-medium text-gray-300 mb-1">
                    시작일
                  </label>
                  <input
                    id="popup-start"
                    type="date"
                    value={form.시작일}
                    onChange={(e) => setField('시작일', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] text-sm text-gray-200 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 bg-white/[0.04]"
                  />
                </div>
                <div>
                  <label htmlFor="popup-end" className="block text-sm font-medium text-gray-300 mb-1">
                    종료일
                  </label>
                  <input
                    id="popup-end"
                    type="date"
                    value={form.종료일}
                    onChange={(e) => setField('종료일', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] text-sm text-gray-200 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 bg-white/[0.04]"
                  />
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-300 hover:bg-white/[0.08] transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-navy text-white text-sm font-medium hover:bg-navy-light transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  {saving ? '저장 중...' : editingPopup ? '수정' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ────── 삭제 확인 모달 ────── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141e33] rounded-2xl w-full max-w-sm p-6 shadow-xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">팝업 삭제</h3>
              <p className="text-sm text-gray-500 mb-6">
                &quot;{deleteTarget.제목}&quot; 팝업을 삭제하시겠습니까?<br />
                이 작업은 되돌릴 수 없습니다.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 bg-white/[0.06] hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deleting ? '삭제 중...' : '삭제'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

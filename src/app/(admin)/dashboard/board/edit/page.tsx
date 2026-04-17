'use client'

import { Suspense, useEffect, useState, useRef, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

/* ────────────── 상수 & 타입 ────────────── */
const CATEGORIES = ['성공사례', '정책자금', '인증지원']
const AUTOSAVE_KEY = 'jni_board_draft'
const AUTOSAVE_INTERVAL = 5000

interface PostForm {
  제목: string
  요약: string
  카테고리: string
  금액: string
  공개여부: boolean
  썸네일: string
  내용: string
}

const emptyForm: PostForm = {
  제목: '',
  요약: '',
  카테고리: '성공사례',
  금액: '',
  공개여부: true,
  썸네일: '',
  내용: '',
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

        // 반복적으로 quality를 줄여 목표 크기에 맞춤
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

/* ────────────── 마크다운 미리보기 ────────────── */
function renderPreview(raw: string): string {
  return raw
    .split('\n')
    .map((line) => {
      const trimmed = line.trim()
      if (!trimmed) return '<br/>'
      // 섹션 제목 (■)
      if (trimmed.startsWith('■')) {
        return `<h3 class="text-lg font-bold text-white mt-6 mb-2">${trimmed.slice(1).trim()}</h3>`
      }
      // 번호 리스트
      if (/^\d+\.\s/.test(trimmed)) {
        return `<div class="flex gap-2 my-1 ml-1"><span class="text-gold font-semibold shrink-0">${trimmed.match(/^\d+\./)![0]}</span><span class="text-gray-300">${trimmed.replace(/^\d+\.\s*/, '')}</span></div>`
      }
      // 불릿 리스트
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return `<div class="flex gap-2 my-1 ml-3"><span class="text-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0"></span><span class="text-gray-300">${trimmed.slice(2)}</span></div>`
      }
      // 들여쓰기
      if (line.startsWith('  ') || line.startsWith('\t')) {
        return `<p class="text-gray-600 ml-6 my-0.5">${trimmed}</p>`
      }
      return `<p class="text-gray-300 my-1">${trimmed}</p>`
    })
    .join('')
}

/* ────────────── 에디터 본체 (useSearchParams 사용) ────────────── */
function BoardEditor() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const editId = searchParams.get('id')
  const isEdit = !!editId

  const [form, setForm] = useState<PostForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [loadingPost, setLoadingPost] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [thumbnailUploading, setThumbnailUploading] = useState(false)
  const [draftRestored, setDraftRestored] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const autosaveTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  /* ── 폼 값 변경 헬퍼 ── */
  const setField = useCallback(<K extends keyof PostForm>(key: K, value: PostForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

  /* ── 수정 모드: 기존 게시글 로드 ── */
  useEffect(() => {
    if (!editId) return
    setLoadingPost(true)
    fetch(`/api/board?id=${editId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.post) {
          setForm({
            제목: data.post.제목 || '',
            요약: data.post.요약 || '',
            카테고리: data.post.카테고리 || '성공사례',
            금액: data.post.금액 || '',
            공개여부: data.post.공개여부 !== false,
            썸네일: data.post.썸네일 || '',
            내용: data.post.내용 || '',
          })
        }
      })
      .catch(() => setMessage({ type: 'error', text: '게시글을 불러올 수 없습니다.' }))
      .finally(() => setLoadingPost(false))
  }, [editId])

  /* ── 새 글 모드: localStorage 복원 프롬프트 ── */
  useEffect(() => {
    if (isEdit) return
    try {
      const saved = localStorage.getItem(AUTOSAVE_KEY)
      if (saved) {
        const parsed: PostForm = JSON.parse(saved)
        if (parsed.제목 || parsed.내용) {
          setDraftRestored(true)
          setForm(parsed)
        }
      }
    } catch { /* ignore */ }
  }, [isEdit])

  /* ── 자동 임시저장 (5초) ── */
  useEffect(() => {
    if (isEdit) return
    autosaveTimer.current = setInterval(() => {
      try {
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(form))
      } catch { /* ignore */ }
    }, AUTOSAVE_INTERVAL)

    return () => {
      if (autosaveTimer.current) clearInterval(autosaveTimer.current)
    }
  }, [form, isEdit])

  /* ── 임시저장 삭제 ── */
  const clearDraft = useCallback(() => {
    localStorage.removeItem(AUTOSAVE_KEY)
    setDraftRestored(false)
    setForm(emptyForm)
  }, [])

  /* ── 썸네일 처리 ── */
  const handleThumbnailFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: '이미지 파일만 업로드할 수 있습니다.' })
      return
    }
    setThumbnailUploading(true)
    setMessage(null)
    try {
      // 기존 썸네일이 있으면 R2에서 삭제 (새 이미지로 교체)
      const oldUrl = form.썸네일
      const base64 = await compressToWebP(file)
      const res = await fetch('/api/upload-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, filename: file.name }),
      })
      const data = await res.json()
      if (data.success && data.url) {
        setField('썸네일', data.url)
        // 업로드 성공 후 기존 이미지 삭제
        if (oldUrl) {
          deleteR2ImageClient(oldUrl)
        }
      } else {
        setMessage({ type: 'error', text: data.error || '업로드 실패' })
      }
    } catch {
      setMessage({ type: 'error', text: '썸네일 업로드 중 오류가 발생했습니다.' })
    } finally {
      setThumbnailUploading(false)
    }
  }

  /* ── 썸네일 제거 (R2에서도 삭제) ── */
  const handleRemoveThumbnail = () => {
    const oldUrl = form.썸네일
    setField('썸네일', '')
    if (oldUrl) {
      deleteR2ImageClient(oldUrl)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleThumbnailFile(file)
  }

  /* ── 저장 ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.제목.trim()) {
      setMessage({ type: 'error', text: '제목을 입력해주세요.' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      const method = isEdit ? 'PUT' : 'POST'
      const payload = isEdit ? { id: editId, ...form } : form

      const res = await fetch('/api/board', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (data.success) {
        if (!isEdit) localStorage.removeItem(AUTOSAVE_KEY)
        router.push('/dashboard/board')
      } else {
        setMessage({ type: 'error', text: data.error || '저장에 실패했습니다.' })
      }
    } catch {
      setMessage({ type: 'error', text: '서버 연결에 실패했습니다.' })
    } finally {
      setSaving(false)
    }
  }

  /* ── 로딩 ── */
  if (loadingPost) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="h-8 w-48 bg-white/[0.06] rounded-lg animate-pulse" />
        <div className="h-[600px] bg-white/[0.04] rounded-2xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/dashboard/board')}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-200 hover:bg-white/[0.06] transition-colors"
          aria-label="뒤로가기"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-white">
          {isEdit ? '글 수정' : '새 글 작성'}
        </h1>
      </div>

      {/* 임시저장 복원 안내 */}
      {draftRestored && !isEdit && (
        <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-blue-400 flex-1">임시 저장된 글이 복원되었습니다.</p>
          <button
            onClick={clearDraft}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-500/20 transition-colors"
          >
            초기화
          </button>
        </div>
      )}

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

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 제목 */}
        <div className="bg-[#141e33] rounded-2xl border border-white/[0.06] p-6 space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={form.제목}
              onChange={(e) => setField('제목', e.target.value)}
              placeholder="게시글 제목"
              className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] text-sm text-gray-200 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 bg-white/[0.04]"
              required
            />
          </div>

          {/* 요약 */}
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-300 mb-1">
              요약
            </label>
            <input
              id="summary"
              type="text"
              value={form.요약}
              onChange={(e) => setField('요약', e.target.value)}
              placeholder="게시글 요약 (목록에 표시)"
              className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] text-sm text-gray-200 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 bg-white/[0.04]"
            />
          </div>

          {/* 카테고리 + 금액 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                카테고리
              </label>
              <select
                id="category"
                value={form.카테고리}
                onChange={(e) => setField('카테고리', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] text-sm text-gray-200 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 bg-white/[0.04] bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                금액
              </label>
              <input
                id="amount"
                type="text"
                value={form.금액}
                onChange={(e) => setField('금액', e.target.value)}
                placeholder="예: 3억원"
                className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] text-sm text-gray-200 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 bg-white/[0.04]"
              />
            </div>
          </div>

          {/* 공개여부 토글 */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">공개여부</p>
              <p className="text-xs text-gray-400 mt-0.5">{form.공개여부 ? '공개 상태 - 사이트에 표시됩니다' : '비공개 상태 - 사이트에 표시되지 않습니다'}</p>
            </div>
            <button
              type="button"
              onClick={() => setField('공개여부', !form.공개여부)}
              className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
                form.공개여부 ? 'bg-green-500' : 'bg-gray-300'
              }`}
              role="switch"
              aria-checked={form.공개여부}
              aria-label="공개여부 토글"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ${
                  form.공개여부 ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 썸네일 */}
        <div className="bg-[#141e33] rounded-2xl border border-white/[0.06] p-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">썸네일</label>

          {form.썸네일 ? (
            <div className="relative group">
              <img
                src={form.썸네일}
                alt="썸네일 미리보기"
                className="w-full max-w-xs h-48 object-cover rounded-xl border border-gray-200"
              />
              <button
                type="button"
                onClick={handleRemoveThumbnail}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="썸네일 삭제"
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
              className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                thumbnailUploading
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.04]'
              }`}
            >
              {thumbnailUploading ? (
                <>
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-blue-600">압축 및 업로드 중...</p>
                </>
              ) : (
                <>
                  <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-500">클릭 또는 드래그하여 이미지 업로드</p>
                  <p className="text-xs text-gray-400">WebP 자동 변환 (최대 800x800, 30KB 이하)</p>
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
              if (file) handleThumbnailFile(file)
              e.target.value = ''
            }}
          />
        </div>

        {/* 내용 */}
        <div className="bg-[#141e33] rounded-2xl border border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-3">
            <label htmlFor="content" className="text-sm font-medium text-gray-300">내용</label>
            <div className="flex bg-white/[0.06] rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setPreviewMode(false)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  !previewMode ? 'bg-white/[0.1] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                작성
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode(true)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  previewMode ? 'bg-white/[0.1] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                미리보기
              </button>
            </div>
          </div>

          {previewMode ? (
            <div className="min-h-[320px] p-4 border border-white/[0.06] rounded-xl bg-white/[0.04]">
              {form.내용 ? (
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderPreview(form.내용) }}
                />
              ) : (
                <p className="text-sm text-gray-400 text-center pt-20">내용을 입력하면 미리보기가 표시됩니다.</p>
              )}
            </div>
          ) : (
            <div>
              <textarea
                id="content"
                value={form.내용}
                onChange={(e) => setField('내용', e.target.value)}
                placeholder={`게시글 내용을 입력하세요.\n\n서식 안내:\n■ 제목 → 섹션 제목\n1. 내용 → 번호 리스트\n- 내용 → 불릿 리스트\n  들여쓰기 → 인덴트 처리`}
                rows={14}
                className="w-full px-4 py-3 rounded-xl border border-white/[0.08] text-sm text-gray-200 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 bg-white/[0.04] resize-y min-h-[320px] font-mono leading-relaxed"
              />
              <p className="text-xs text-gray-400 mt-2">
                &#9632; 섹션제목 | 1. 번호리스트 | - 불릿리스트 | 들여쓰기(공백2칸) 인덴트
              </p>
            </div>
          )}
        </div>

        {/* 저장 버튼 */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => router.push('/dashboard/board')}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-200 hover:bg-white/[0.06] transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-2.5 rounded-xl bg-navy text-white text-sm font-medium hover:bg-navy-light transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {saving ? '저장 중...' : isEdit ? '수정 완료' : '게시하기'}
          </button>
        </div>
      </form>
    </div>
  )
}

/* ────────────── Page (Suspense 래핑) ────────────── */
export default function BoardEditPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 max-w-4xl">
          <div className="h-8 w-48 bg-white/[0.06] rounded-lg animate-pulse" />
          <div className="h-[600px] bg-white/[0.04] rounded-2xl animate-pulse" />
        </div>
      }
    >
      <BoardEditor />
    </Suspense>
  )
}

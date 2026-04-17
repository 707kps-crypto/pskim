"use client";

import { useEffect, useRef } from "react";

interface LegalSection {
  heading: string;
  content: string;
}

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export default function LegalModal({
  isOpen,
  onClose,
  title,
  lastUpdated,
  sections,
}: LegalModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      contentRef.current?.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-[fadeIn_200ms_ease]"
        onClick={onClose}
      />

      {/* 모달 본문 */}
      <div className="relative w-full max-w-[680px] max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col animate-[modalUp_300ms_ease]">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 md:px-8 py-4 md:py-5 border-b border-slate-200 flex-shrink-0">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-800">
              {title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              최종 수정일: {lastUpdated}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
            aria-label="닫기"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* 콘텐츠 */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto px-5 md:px-8 py-5 md:py-6"
        >
          <div className="space-y-6 md:space-y-8">
            {sections.map((section, i) => (
              <div key={i}>
                <h3 className="text-[14px] md:text-[15px] font-bold text-slate-800 mb-2 md:mb-3">
                  {section.heading}
                </h3>
                <p className="text-[13px] md:text-[14px] text-slate-600 leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* 회사 정보 */}
          <div className="mt-8 md:mt-10 pt-5 border-t border-slate-200">
            <div className="text-[12px] md:text-[13px] text-slate-400 space-y-1">
              <p className="font-semibold text-slate-500">피에스킴컨설팅</p>
              <p>대표자: 권준성 | 사업자등록번호: 611-79-00413</p>
              <p>주소: 인천광역시 남동구 호구포로 535번길 25, A동 101호</p>
              <p>휴대전화: 010-8008-0186 | 이메일: kps707@naver.com</p>
            </div>
          </div>
        </div>

        {/* 하단 닫기 */}
        <div className="px-5 md:px-8 py-3 md:py-4 border-t border-slate-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 md:py-3 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

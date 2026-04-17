"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LegalModal from "./LegalModal";
import { TERMS_OF_SERVICE, PRIVACY_POLICY } from "@/config/legal-content";

const NAV_ITEMS = [
  { href: "/", label: "홈" },
  { href: "/company", label: "회사소개" },
  { href: "/process", label: "진행과정" },
  { href: "/fund", label: "자금상담" },
  { href: "/pro", label: "전문서비스" },
  { href: "/mkt", label: "온라인마케팅" },
];

export default function Footer() {
  const [openModal, setOpenModal] = useState<"terms" | "privacy" | null>(null);

  return (
    <>
      <footer className="bg-navy text-white">
        <div className="max-w-content mx-auto px-5 md:px-5">
          {/* 상단: 로고 + 설명 */}
          <div className="py-8 border-b border-gold/20">
            <div className="flex items-center gap-2.5 md:gap-3 mb-3">
              <Image
                src="/images/logo.png"
                alt="피에스킴컨설팅 로고"
                width={75}
                height={32}
                className="h-7 w-auto md:h-8"
              />
              <span className="text-[22px] md:text-[28px] font-bold gold-gradient-text">
                피에스킴컨설팅
              </span>
            </div>
            <p className="text-white/90 text-[15px] leading-relaxed">
              자금 문제 해결의 맞춤 | 기업의 신뢰 파트너
            </p>
          </div>

          {/* 중간: Contact + Menu */}
          <div className="grid grid-cols-[1.5fr_0.7fr] md:grid-cols-[2.5fr_1fr] gap-3 md:gap-20 py-8 md:py-10 border-b border-gold/20">
            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold text-gold mb-5">Contact</h4>

              <div className="space-y-3.5">
                <ContactItem icon="person" text="대표자: 권준성" />
                <ContactItem
                  icon="business"
                  text="사업자등록번호: 611-79-00413"
                />
                <ContactItem icon="phone" text="휴대전화: 010-8008-0186" />
                <ContactItem icon="email" text="이메일: kps707@naver.com" />
                <ContactItem
                  icon="location"
                  text={
                    <>
                      주소: 인천광역시 남동구 호구포로
                      <br className="md:hidden" />
                      535번길 25, A동 101호
                    </>
                  }
                />
                <ContactItem icon="time" text="상담시간: 평일 10:00-18:00" />
              </div>
            </div>

            {/* Menu */}
            <div>
              <h4 className="text-sm md:text-lg font-semibold text-gold mb-3 md:mb-5">
                Menu
              </h4>
              <ul className="list-none space-y-1.5 md:space-y-3">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-white/80 text-[10.5px] md:text-[15px] no-underline hover:text-gold hover:pl-1 transition-all duration-300"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 주석 */}
          <div className="py-5 border-b border-gold/20">
            <p className="text-[9px] md:text-[11px] text-white/60 leading-relaxed">
              <span className="block mb-1">
                ※ 피에스킴컨설팅은 정책자금 서류작성을 대행하지 않습니다.
              </span>
              <span className="block">※ 기업평가를 하지 않습니다.</span>
            </p>
          </div>

          {/* 업무협약 배너 */}
          <div className="py-6 md:py-8 border-b border-gold/20 flex justify-start md:justify-start">
            <a
              href="http://jjk-biz.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-col md:flex-row items-center gap-1.5 md:gap-3.5 no-underline
                bg-gradient-to-br from-[rgba(212,175,55,0.15)] to-[rgba(212,175,55,0.1)]
                border-2 border-[rgba(212,175,55,0.4)] rounded-[10px]
                px-4 py-2.5 md:px-6 md:py-3.5
                backdrop-blur-[10px]
                shadow-[0_0_30px_rgba(212,175,55,0.3)]
                hover:bg-gradient-to-br hover:from-[rgba(212,175,55,0.25)] hover:to-[rgba(212,175,55,0.15)]
                hover:-translate-y-0.5 hover:shadow-[0_0_60px_rgba(212,175,55,0.6),0_0_90px_rgba(212,175,55,0.4)]
                transition-all duration-300
                animate-[goldenGlow_3s_ease-in-out_infinite]"
            >
              <img
                src="/images/jjk-logo.png"
                alt="JJK 정책자금지원센터"
                className="h-4 md:h-6 w-auto max-w-[80px] md:max-w-[112px] object-contain brightness-0 invert drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]"
              />
              <span
                className="text-[10px] md:text-[13px] font-semibold text-gold whitespace-nowrap
                [text-shadow:0_0_15px_rgba(212,175,55,0.8),0_0_30px_rgba(212,175,55,0.5)]"
              >
                정책자금지원센터 | 업무협약 피에스킴컨설팅
              </span>
            </a>
          </div>

          {/* 하단 */}
          <div className="py-6 md:py-8 flex flex-col md:flex-row justify-between items-center gap-5">
            <p className="text-white/70 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} 피에스킴컨설팅. All rights
              reserved.
            </p>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setOpenModal("terms")}
                className="text-white/70 text-xs md:text-sm bg-transparent border-none cursor-pointer hover:text-gold transition-colors"
              >
                이용약관
              </button>
              <span className="text-gold/40">|</span>
              <button
                onClick={() => setOpenModal("privacy")}
                className="text-white/70 text-xs md:text-sm bg-transparent border-none cursor-pointer hover:text-gold transition-colors"
              >
                개인정보처리방침
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* 이용약관 모달 */}
      <LegalModal
        isOpen={openModal === "terms"}
        onClose={() => setOpenModal(null)}
        title={TERMS_OF_SERVICE.title}
        lastUpdated={TERMS_OF_SERVICE.lastUpdated}
        sections={TERMS_OF_SERVICE.sections}
      />

      {/* 개인정보처리방침 모달 */}
      <LegalModal
        isOpen={openModal === "privacy"}
        onClose={() => setOpenModal(null)}
        title={PRIVACY_POLICY.title}
        lastUpdated={PRIVACY_POLICY.lastUpdated}
        sections={PRIVACY_POLICY.sections}
      />
    </>
  );
}

function ContactItem({ icon, text }: { icon: string; text: React.ReactNode }) {
  const icons: Record<string, React.ReactNode> = {
    person: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M16 12h-3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3v7z" />
      </svg>
    ),
    business: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    phone: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    email: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M12 12l8-5H4l8 5z" />
      </svg>
    ),
    location: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    time: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  };

  return (
    <div className="flex items-start gap-2.5 text-white/90 text-[11.5px] md:text-[15px]">
      <span className="flex-shrink-0 text-gold mt-0.5">{icons[icon]}</span>
      <span className="leading-snug break-keep">{text}</span>
    </div>
  );
}

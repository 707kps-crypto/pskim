"use client";

import { useEffect, useRef, useState } from "react";
import ConsultForm from "@/components/ConsultForm";
import LocalVideoBackground from "@/components/LocalVideoBackground";
import CountUpNumber from "@/components/CountUpNumber";
import { HERO_VIDEOS } from "@/config/hero-videos";

/* ──────────────────────────────────────────────
   1. Hero Section – 온라인마케팅 타이틀
   ────────────────────────────────────────────── */
function MktHero() {
  return (
    <section className="relative w-full min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] flex items-center justify-center px-4 md:px-10 pt-[130px] md:pt-[180px] pb-[60px] md:pb-[80px] lg:pb-[100px] overflow-hidden">
      <LocalVideoBackground src={HERO_VIDEOS.marketing} />
      {/* 타이틀 */}
      <div className="relative z-[2] max-w-[1200px] mx-auto text-center animate-fade-up">
        <span className="inline-block px-[30px] py-[10px] bg-[rgba(212,175,55,0.2)] border border-[rgba(212,175,55,0.4)] rounded-[50px] text-gold text-[12px] md:text-sm font-bold tracking-[2px] uppercase backdrop-blur-[10px] mb-[30px]">
          Digital Marketing Solution
        </span>
        <h1 className="text-[28px] md:text-[clamp(32px,5vw,48px)] font-black text-[#e0f2f1] mb-[20px] leading-[1.2] tracking-[-1px]">
          기업 성장의 핵심 전략 <br />
          <span className="gold-gradient-text font-black">온라인마케팅</span>
        </h1>
        <p className="text-[clamp(15px,2.5vw,20px)] text-[rgba(224,242,241,0.9)] leading-[1.6] max-w-[700px] mx-auto font-normal">
          데이터 기반 전략적 온라인 마케팅으로 <br className="md:hidden" />
          중소기업 비즈니스 성과를 극대화합니다.
          <br />각 분야 마케팅 전문가들이 <br className="md:hidden" />
          기업 맞춤형 솔루션을 제공합니다.
        </p>
      </div>

      {/* 스크롤 인디케이터 */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          viewBox="0 0 24 24"
          className="w-[30px] h-[30px] fill-[rgba(224,242,241,0.5)]"
        >
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
        </svg>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   2. Services Section – 서비스 카드 6개
   ────────────────────────────────────────────── */
const SERVICE_DATA = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-10 h-10 fill-white">
        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
      </svg>
    ),
    name: "홈페이지 제작",
    desc: "비즈니스 성장을 돕는\nSEO 최적화 반응형 웹사이트 구축",
    features: ["맞춤형 디자인 & UX/UI", "모바일 최적화", "SEO 기본 설정"],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-10 h-10 fill-white">
        <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z" />
      </svg>
    ),
    name: "검색광고 운영",
    desc: "구글, 네이버 등 검색광고로\n효율적인 타겟 고객 유입 전략",
    features: ["키워드 분석 & 선정", "광고 예산 최적화", "실시간 성과 분석"],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-10 h-10 fill-white">
        <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
      </svg>
    ),
    name: "SNS 마케팅",
    desc: "인스타그램, 페이스북 등 SNS로\n브랜드 인지도 향상과 고객 소통 강화",
    features: ["콘텐츠 기획 & 제작", "타겟 광고 운영", "인플루언서 협업"],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-10 h-10 fill-white">
        <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
      </svg>
    ),
    name: "블로그 마케팅",
    desc: "네이버 블로그, 티스토리를 활용한\n콘텐츠 마케팅으로 자연스러운 유입 증대",
    features: ["키워드 최적화 포스팅", "체험단 운영 관리", "바이럴 마케팅"],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-10 h-10 fill-white">
        <path d="M9,3V5H7A2,2 0 0,0 5,7V9H3V11H5V13H3V15H5V17A2,2 0 0,0 7,19H9V21H11V19H13V21H15V19H17A2,2 0 0,0 19,17V15H21V13H19V11H21V9H19V7A2,2 0 0,0 17,5H15V3H13V5H11V3M7,9H17V15H7V9Z" />
      </svg>
    ),
    name: "AI 자동화 구축",
    desc: "효율적인 DB 확보를 위한\nAI 자동화 시스템 구축",
    features: ["입력폼 디자인", "자동화 설정", "메신저로 DB 받기 설정"],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-10 h-10 fill-white">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
      </svg>
    ),
    name: "퍼포먼스 마케팅",
    desc: "데이터 분석 기반의 성과 중심\n통합 마케팅 전략 수립과 실행",
    features: ["GA4 & GTM 설정", "전환율 최적화", "A/B 테스트"],
  },
];

const TAB_LABELS = [
  "홈페이지 제작",
  "검색광고 운영",
  "SNS 마케팅",
  "블로그 마케팅",
  "AI 자동화 구축",
  "퍼포먼스 마케팅",
];

function ServicesSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 모바일 스와이프로 카드 이동
  useEffect(() => {
    if (!isMobile) return;
    const grid = gridRef.current;
    if (!grid) return;

    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let isScrolling = false;

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
      isScrolling = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const diffX = Math.abs(e.touches[0].clientX - startX);
      const diffY = Math.abs(e.touches[0].clientY - startY);
      if (!isScrolling && (diffX > 5 || diffY > 5)) {
        isScrolling = diffY > diffX;
      }
      if (!isScrolling && diffX > diffY && diffX > 10) {
        e.preventDefault();
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!isDragging || isScrolling) {
        isDragging = false;
        return;
      }
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      if (Math.abs(diffX) > 50) {
        if (diffX > 0 && activeIndex < SERVICE_DATA.length - 1) {
          setActiveIndex((prev) => prev + 1);
        } else if (diffX < 0 && activeIndex > 0) {
          setActiveIndex((prev) => prev - 1);
        }
      }
      isDragging = false;
    };

    grid.addEventListener("touchstart", onTouchStart, { passive: true });
    grid.addEventListener("touchmove", onTouchMove, { passive: false });
    grid.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      grid.removeEventListener("touchstart", onTouchStart);
      grid.removeEventListener("touchmove", onTouchMove);
      grid.removeEventListener("touchend", onTouchEnd);
    };
  }, [isMobile, activeIndex]);

  const scrollToConsult = () => {
    const target = document.getElementById("consult-form");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative w-full py-[60px] md:py-[80px] lg:py-[100px] px-4 md:px-10 bg-navy overflow-hidden">
      <div className="relative z-[2] max-w-[1200px] mx-auto">
        {/* 모바일 탭 인디케이터 */}
        <div className="grid grid-cols-3 gap-[5px] md:hidden mb-[30px] px-[10px]">
          {TAB_LABELS.map((label, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`py-[10px] px-[3px] border-2 rounded-xl text-[11px] font-semibold text-center transition-all duration-300 whitespace-nowrap overflow-hidden text-ellipsis
                ${
                  activeIndex === i
                    ? "bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-transparent scale-105"
                    : "bg-[#f8f9fa] border-[#e9ecef] text-[#6c757d] hover:bg-[#e9ecef] hover:text-[#495057]"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 서비스 카드 그리드 */}
        <div className="relative md:mb-[80px] mb-[50px]">
          {/* 데스크톱: 3열 그리드, 모바일: 슬라이드 */}
          <div
            ref={gridRef}
            className={`${
              isMobile
                ? "flex transition-transform duration-300 ease-in-out"
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]"
            }`}
            style={
              isMobile
                ? { transform: `translateX(-${activeIndex * 100}%)` }
                : undefined
            }
          >
            {SERVICE_DATA.map((service, i) => (
              <div
                key={i}
                className={`bg-[rgba(212,175,55,0.08)] backdrop-blur-[10px] border border-[rgba(212,175,55,0.2)] rounded-[20px] p-6 md:p-10 text-center transition-all duration-300 relative overflow-hidden cursor-pointer
                  flex flex-col items-center
                  hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] hover:border-[rgba(212,175,55,0.5)]
                  ${isMobile ? "flex-[0_0_100%] max-w-full" : ""}`}
              >
                {/* 호버 그라데이션 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(212,175,55,0.08)] to-[rgba(212,175,55,0.04)] opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* 서비스 아이콘 */}
                <div
                  className="w-[56px] h-[56px] md:w-[80px] md:h-[80px] bg-gradient-to-br from-gold-dark to-gold rounded-[14px] md:rounded-[20px] flex items-center justify-center mb-3 md:mb-6 relative z-[1]
                  shadow-[0_4px_15px_rgba(212,175,55,0.3)]"
                >
                  <div className="w-[28px] h-[28px] md:w-[40px] md:h-[40px] flex items-center justify-center">
                    {service.icon}
                  </div>
                </div>

                {/* 서비스 이름 */}
                <h3 className="text-[18px] md:text-[24px] font-bold text-white mb-2 md:mb-4 relative z-[1]">
                  {service.name}
                </h3>

                {/* 서비스 설명 */}
                <p className="text-[13px] md:text-base text-[rgba(224,242,241,0.75)] leading-[1.5] md:leading-[1.6] mb-3 md:mb-6 relative z-[1] px-[5px] md:px-0">
                  {service.desc.split("\n").map((line, j) => (
                    <span key={j}>
                      {line}
                      {j < service.desc.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </p>

                {/* 특징 리스트 */}
                <ul className="list-none p-0 m-0 text-left inline-block relative z-[1]">
                  {service.features.map((feature, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2 py-1 md:py-1.5 text-[12px] md:text-sm text-[rgba(224,242,241,0.85)]"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-[14px] h-[14px] md:w-4 md:h-4 fill-gold flex-shrink-0"
                      >
                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* 모바일 네비게이션 화살표 */}
          {isMobile && activeIndex > 0 && (
            <button
              onClick={() => setActiveIndex((prev) => prev - 1)}
              className="absolute top-[40%] left-[5px] -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center border border-[#e9ecef] shadow-[0_2px_8px_rgba(0,0,0,0.1)] z-10 transition-all hover:bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
              aria-label="이전 서비스"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#6c757d]">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
          )}
          {isMobile && activeIndex < SERVICE_DATA.length - 1 && (
            <button
              onClick={() => setActiveIndex((prev) => prev + 1)}
              className="absolute top-[40%] right-[5px] -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center border border-[#e9ecef] shadow-[0_2px_8px_rgba(0,0,0,0.1)] z-10 transition-all hover:bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
              aria-label="다음 서비스"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#6c757d]">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          )}
        </div>

        {/* 통합 마케팅 섹션 */}
        <div className="relative bg-[rgba(212,175,55,0.08)] backdrop-blur-[10px] border border-[rgba(212,175,55,0.2)] rounded-[20px] md:rounded-[30px] p-6 md:p-[60px] mb-[50px] md:mb-[80px] overflow-hidden">
          {/* 배경 원형 */}
          <div className="absolute top-[-50%] right-[-30%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(212,175,55,0.1)_0%,transparent_70%)] rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-[60px] items-center relative z-[1]">
            {/* 정보 (모바일: 하단, 데스크톱: 좌측) */}
            <div className="order-2 md:order-1">
              <h3 className="text-[22px] md:text-[36px] font-bold text-white mb-4 md:mb-5 leading-[1.3]">
                온·오프라인 통합 마케팅으로
                <br className="hidden md:block" />더 큰 시너지를 창출합니다
              </h3>
              <p className="text-[14px] md:text-lg text-[rgba(224,242,241,0.75)] leading-[1.5] md:leading-[1.6] mb-6 md:mb-8">
                단순한 온라인 광고를 넘어, 중소기업의 전체적인 마케팅 전략을
                수립하고 실행합니다. 데이터 기반 의사결정으로 기업 성장과 마케팅
                ROI를 극대화합니다.
              </p>

              {/* 혜택 카드 */}
              <div className="grid grid-cols-2 gap-3 md:gap-5">
                {[
                  {
                    number: <CountUpNumber end={250} suffix="%" />,
                    label: "평균 매출 상승률",
                  },
                  {
                    number: <CountUpNumber end={90} suffix="%" />,
                    label: "높은 고객만족도",
                  },
                  {
                    number: <CountUpNumber end={72} suffix="시간" />,
                    label: "신규 캠페인 구축",
                  },
                  {
                    number: <CountUpNumber end={15} suffix="개" />,
                    label: "채널 통합 관리",
                  },
                ].map((benefit, i) => (
                  <div
                    key={i}
                    className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[10px] border border-[rgba(212,175,55,0.2)] rounded-xl p-4 md:p-6
                      shadow-[0_4px_12px_rgba(0,0,0,0.05)]
                      hover:border-[rgba(212,175,55,0.5)] hover:bg-[rgba(212,175,55,0.08)] transition-all duration-300"
                  >
                    <div className="text-[24px] md:text-[32px] font-bold gold-gradient-text mb-1 md:mb-2">
                      {benefit.number}
                    </div>
                    <div className="text-[12px] md:text-sm text-[rgba(224,242,241,0.6)]">
                      {benefit.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 비주얼 (모바일: 상단, 데스크톱: 우측) */}
            <div className="order-1 md:order-2 relative">
              <div
                className="w-full h-[280px] md:h-[400px] rounded-2xl md:rounded-[20px] relative overflow-hidden
                border border-[rgba(212,175,55,0.3)]
                shadow-[0_8px_32px_rgba(212,175,55,0.15)]"
              >
                <img
                  src="https://pub-0e18ef29fe4a4730aadb9253775bd479.r2.dev/images/mkt-dashboard.webp"
                  alt="온라인마케팅 통합 대시보드"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* 그라데이션 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(212,175,55,0.15)] to-[rgba(139,111,63,0.15)] rounded-[20px]" />
              </div>
            </div>
          </div>
        </div>

        {/* CTA 섹션 */}
        <div
          className="text-center p-8 md:p-[60px_40px] bg-[rgba(212,175,55,0.08)] backdrop-blur-[10px] border border-[rgba(212,175,55,0.25)] rounded-2xl md:rounded-[20px]
          hover:border-[rgba(212,175,55,0.4)] transition-all duration-300"
        >
          <h3 className="text-[22px] md:text-[32px] font-bold text-white mb-3 md:mb-4">
            지금 시작하세요, <br className="md:hidden" />
            내일의 성장을 위해
          </h3>
          <p className="text-[15px] md:text-lg text-[rgba(224,242,241,0.75)] mb-6 md:mb-8">
            전문 마케터가 귀사의 비즈니스 성장을 위한{" "}
            <br className="md:hidden" />
            최적의 솔루션을 제안합니다
          </p>
          <button
            onClick={scrollToConsult}
            className="inline-block px-8 py-4 rounded-lg text-base font-semibold text-white transition-all duration-300
              gold-gradient-bg gold-glow
              hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(212,175,55,0.5),0_0_60px_rgba(212,175,55,0.3)]
              w-full max-w-[280px] md:w-auto md:max-w-none cursor-pointer"
          >
            무료 상담 신청
          </button>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   MKT Page (온라인마케팅)
   ────────────────────────────────────────────── */
export default function MktClient() {
  return (
    <>
      <MktHero />
      <ServicesSection />
      <ConsultForm />
    </>
  );
}

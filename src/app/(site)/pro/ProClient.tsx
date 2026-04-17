"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ConsultCTA from "@/components/ConsultCTA";
import LocalVideoBackground from "@/components/LocalVideoBackground";
import { HERO_VIDEOS } from "@/config/hero-videos";

/* ──────────────────────────────────────────────
   1. Hero Section – Expert Network
   ────────────────────────────────────────────── */
function ProHero() {
  return (
    <section className="relative w-full pb-[40px] md:pb-[40px] pt-[130px] md:pt-[180px] overflow-hidden">
      <LocalVideoBackground src={HERO_VIDEOS.professional} />
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 relative z-[1]">
        <div className="text-center">
          {/* 네온 펄스 뱃지 */}
          <span
            className="inline-block bg-transparent text-gold px-5 py-2 rounded-[24px] text-[10px] sm:text-[11px] md:text-sm font-semibold tracking-[0.5px] uppercase mb-4 md:mb-5 max-w-[95%] md:max-w-[90%] overflow-hidden text-ellipsis whitespace-nowrap
              border-2 border-gold
              shadow-[0_0_20px_rgba(212,175,55,0.5),inset_0_0_15px_rgba(212,175,55,0.2)]
              [text-shadow:0_0_10px_rgba(212,175,55,0.8)]
              animate-neon-pulse"
          >
            Expert Network
          </span>

          {/* 타이틀 */}
          <h2
            className="text-[22px] sm:text-[26px] md:text-[48px] font-bold text-light leading-[1.35] sm:leading-[1.3] md:leading-[1.2] mb-4 md:mb-5 break-keep
              [text-shadow:0_0_10px_rgba(250,248,243,0.5),0_0_20px_rgba(212,175,55,0.5),0_0_30px_rgba(212,175,55,0.3)]"
          >
            법무, 세무, 회계, 노무, 행정, 변리
            <br />
            기업이 필요한 모든 전문가가
            <br />
            피에스킴컨설팅와 함께합니다
          </h2>

          {/* 서브타이틀 */}
          <p
            className="text-[13px] sm:text-[15px] md:text-[20px] text-body leading-[1.65] sm:leading-[1.6] md:leading-[1.6] max-w-[100%] md:max-w-[700px] mx-auto break-keep
              [text-shadow:0_0_5px_rgba(232,212,168,0.5),0_1px_2px_rgba(0,0,0,0.3)]"
          >
            정책자금 자금조달 심사통과율을 높이기 위해
            <br />
            필요한 분야의 경영컨설팅 전문가를 맞춤형으로 연결합니다
            <br />
            <br />
            피에스킴컨설팅의{" "}
            <span className="text-gold font-semibold [text-shadow:0_0_10px_rgba(212,175,55,0.8)]">
              전문가 네트워크
            </span>
            로
            <br />
            완벽하게 준비된 상태로 자금조달을 시작하세요.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   2. Pro Service Section – 전문가 서비스 카드
   ────────────────────────────────────────────── */
function ProServiceSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const expertCards = [
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 fill-light drop-shadow-[0_0_3px_rgba(250,248,243,0.5)]"
        >
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z M12 11.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V8.93l7-3.11v6.17z" />
        </svg>
      ),
      title: "법무 전문가",
      items: ["변호사 네트워크", "법률 자문 및 위험 검토", "계약 구조 최적화"],
      services: ["법률 검토", "계약 관리", "리스크 관리", "자문 서비스"],
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 fill-light drop-shadow-[0_0_3px_rgba(250,248,243,0.5)]"
        >
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
        </svg>
      ),
      title: "세무 전문가",
      items: ["세무사 네트워크", "세무 전략 및 절세 계획", "세무 리스크 관리"],
      services: ["절세 전략", "세무 자문", "세무 신고", "리스크 관리"],
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 fill-light drop-shadow-[0_0_3px_rgba(250,248,243,0.5)]"
        >
          <path d="M9 3V1h6v2H9zM11 21h2V8h-2v13zM17.5 11.5L19 13l-6 6-4.5-4.5L10 13l3 3 4.5-4.5z" />
        </svg>
      ),
      title: "회계 전문가",
      items: ["회계사 네트워크", "재무제표 검토 및 분석", "재무 컨설팅"],
      services: ["회계 감시", "재무 분석", "재무 계획", "내부 감시"],
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 fill-light drop-shadow-[0_0_3px_rgba(250,248,243,0.5)]"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      ),
      title: "노무 전문가",
      items: ["공인노무사 네트워크", "인사노무 컨설팅", "근로계약 관리"],
      services: ["노무 관리", "임금 설계", "노동분쟁", "4대보험"],
    },
  ];

  // 스크롤 상태 체크
  const checkScroll = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const scrollLeft = grid.scrollLeft;
    const maxScroll = grid.scrollWidth - grid.clientWidth;
    setCanScrollPrev(scrollLeft > 10);
    setCanScrollNext(scrollLeft < maxScroll - 10);
  }, []);

  // 모바일 스크롤 네비게이션
  const scrollBy = useCallback((direction: "prev" | "next") => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = grid.querySelectorAll<HTMLElement>(".expert-card");
    if (!cards.length) return;
    const cardWidth = cards[0].offsetWidth + 16;
    grid.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const grid = gridRef.current;
    if (!grid) return;

    // 스포트라이트 마우스 트래킹 (데스크톱)
    if (window.innerWidth > 768) {
      const cards = grid.querySelectorAll<HTMLElement>(".expert-card");
      cards.forEach((card) => {
        const onMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
          card.style.setProperty("--my", `${e.clientY - rect.top}px`);
        };
        const onLeave = () => {
          card.style.removeProperty("--mx");
          card.style.removeProperty("--my");
        };
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
      });
    }

    // 스크롤 이벤트
    grid.addEventListener("scroll", checkScroll);
    checkScroll();
    window.addEventListener("resize", checkScroll);

    return () => {
      grid.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  return (
    <section className="relative w-full overflow-hidden bg-navy z-[3]">
      <div className="w-full py-[35px] md:py-[50px]">
        <div className="max-w-[1200px] mx-auto px-5">
          {/* 섹션 헤더 */}
          <div className="text-center mb-[30px] md:mb-10">
            <h2
              className="text-[24px] md:text-[38px] font-bold text-light leading-[1.4] md:leading-[1.2] mb-4 break-keep
                [text-shadow:0_0_10px_rgba(250,248,243,0.5),0_0_20px_rgba(212,175,55,0.5)]"
            >
              다양한 분야의 전문가 서비스로
              <br />
              기업의 모든 니즈를 충족합니다
            </h2>
            <p
              className="text-[15px] md:text-lg text-body leading-[1.5] break-keep
                [text-shadow:0_0_5px_rgba(232,212,168,0.5)]"
            >
              정책자금 심사통과율을 높이는
              <br />
              피에스킴컨설팅의 경영컨설팅 전문가 매칭
            </p>
          </div>

          {/* 카드 그리드 래퍼 */}
          <div ref={wrapperRef} className="relative mb-[30px] md:mb-[45px]">
            {/* 카드 그리드 */}
            <div
              ref={gridRef}
              className="grid grid-cols-2 gap-6
                max-md:flex max-md:gap-4 max-md:overflow-x-auto max-md:snap-x max-md:snap-mandatory max-md:px-5 max-md:pt-2.5 max-md:pb-5 max-md:mb-0"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {expertCards.map((card, i) => (
                <div
                  key={i}
                  className="expert-card relative flex flex-col items-center p-6 md:p-8 rounded-[14px] transition-all duration-300 overflow-hidden
                    bg-[rgba(212,175,55,0.05)] border border-[rgba(212,175,55,0.3)] backdrop-blur-[10px]
                    hover:-translate-y-[3px] hover:border-gold hover:bg-[rgba(212,175,55,0.1)]
                    hover:shadow-[0_0_30px_rgba(212,175,55,0.4),inset_0_0_20px_rgba(212,175,55,0.1)]
                    max-md:flex-[0_0_280px] max-md:snap-start max-md:p-[24px_18px]"
                >
                  {/* 스포트라이트 오버레이 */}
                  <div
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0 blur-[10px] rounded-[inherit]"
                    style={{
                      background:
                        "radial-gradient(circle 150px at var(--mx, 50%) var(--my, 50%), rgba(250,248,243,0.3), rgba(212,175,55,0.25) 40%, rgba(139,111,63,0.15) 60%, transparent 100%)",
                    }}
                  />

                  {/* 아이콘 */}
                  <div
                    className="relative z-[1] w-[44px] h-[44px] md:w-[54px] md:h-[54px] rounded-[10px] flex items-center justify-center mb-3.5 md:mb-5
                      bg-gradient-to-br from-gold-dark to-gold
                      shadow-[0_0_20px_rgba(212,175,55,0.5),inset_0_0_10px_rgba(212,175,55,0.3)]"
                  >
                    {card.icon}
                  </div>

                  {/* 타이틀 */}
                  <h3
                    className="relative z-[1] text-[19px] md:text-[22px] font-bold text-gold text-center mb-3 md:mb-3.5
                      [text-shadow:0_0_10px_rgba(212,175,55,0.8)]"
                  >
                    {card.title}
                  </h3>

                  {/* 리스트 */}
                  <ul className="relative z-[1] list-none mb-4 md:mb-5 max-w-[250px] md:max-w-[280px] flex flex-col items-start">
                    {card.items.map((item, j) => (
                      <li
                        key={j}
                        className="relative pl-[18px] md:pl-5 mb-2 md:mb-2.5 text-sm md:text-base leading-[1.5] text-[#cbd5e1] text-left"
                      >
                        <span className="absolute left-0 top-[7px] w-[5px] h-[5px] bg-gold rounded-full shadow-[0_0_6px_rgba(212,175,55,0.8)]" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* 서비스 영역 */}
                  <div className="relative z-[1] mt-auto pt-4 md:pt-5 border-t border-[rgba(212,175,55,0.2)] w-full max-w-[250px] md:max-w-[320px]">
                    <p
                      className="text-[12px] md:text-sm font-semibold text-[#e0f2f1] mb-2.5 md:mb-3 uppercase tracking-[0.5px] text-center
                        [text-shadow:0_0_5px_rgba(224,242,241,0.5)]"
                    >
                      핵심 서비스
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 md:gap-2 justify-items-center">
                      {card.services.map((service, k) => (
                        <span
                          key={k}
                          className="bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.3)] py-1.5 md:py-2 px-2 md:px-3 rounded-[14px] md:rounded-[18px] text-[11px] md:text-sm text-body text-center w-[115px] md:w-[150px] min-h-[30px] md:min-h-[36px] flex items-center justify-center transition-all duration-200
                            hover:bg-[rgba(212,175,55,0.2)] hover:border-gold hover:shadow-[0_0_10px_rgba(212,175,55,0.5)] hover:text-light"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 모바일 스크롤 네비게이션 버튼 */}
            <button
              onClick={() => scrollBy("prev")}
              className={`hidden max-md:flex absolute top-1/2 left-[5px] -translate-y-1/2 w-9 h-9 rounded-full items-center justify-center cursor-pointer transition-all duration-300 z-10
                bg-[rgba(212,175,55,0.1)] backdrop-blur-[10px] border border-[rgba(212,175,55,0.3)] shadow-[0_0_15px_rgba(212,175,55,0.3)]
                hover:bg-[rgba(212,175,55,0.2)] hover:shadow-[0_0_20px_rgba(212,175,55,0.5)]
                ${!canScrollPrev ? "opacity-0 pointer-events-none" : ""}`}
              aria-label="이전 카드"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-gold drop-shadow-[0_0_3px_rgba(212,175,55,0.8)]"
              >
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            <button
              onClick={() => scrollBy("next")}
              className={`hidden max-md:flex absolute top-1/2 right-[5px] -translate-y-1/2 w-9 h-9 rounded-full items-center justify-center cursor-pointer transition-all duration-300 z-10
                bg-[rgba(212,175,55,0.1)] backdrop-blur-[10px] border border-[rgba(212,175,55,0.3)] shadow-[0_0_15px_rgba(212,175,55,0.3)]
                hover:bg-[rgba(212,175,55,0.2)] hover:shadow-[0_0_20px_rgba(212,175,55,0.5)]
                ${!canScrollNext ? "opacity-0 pointer-events-none" : ""}`}
              aria-label="다음 카드"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-gold drop-shadow-[0_0_3px_rgba(212,175,55,0.8)]"
              >
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </div>

          {/* CTA 영역 */}
          <div className="text-center mt-[30px] md:mt-[45px]">
            <p className="text-[15px] md:text-[17px] text-[#cbd5e1] mb-6 leading-[1.5] break-keep">
              피에스킴컨설팅의 전문가 네트워크로
              <br />
              정책자금 자금조달 심사통과율을 높이세요
            </p>
            <a
              href="#consult-form"
              className="inline-block px-10 py-3.5 rounded-[50px] text-[15px] md:text-[17px] font-bold text-light no-underline transition-all duration-300
                bg-gradient-to-br from-gold-dark to-gold border border-gold
                [text-shadow:0_0_10px_rgba(250,248,243,0.8)]
                shadow-[0_0_30px_rgba(212,175,55,0.8),inset_0_0_20px_rgba(212,175,55,0.3)]
                hover:-translate-y-0.5 hover:scale-105 hover:bg-gradient-to-br hover:from-gold hover:to-body
                hover:shadow-[0_0_40px_rgba(212,175,55,1),0_10px_30px_rgba(212,175,55,0.5),inset_0_0_30px_rgba(212,175,55,0.4)]"
            >
              전문가 서비스 신청하기
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   3. Pro Process Section – 전문서비스 프로세스
   ────────────────────────────────────────────── */
function ProProcessSection() {
  const [activeStep, setActiveStep] = useState(0);
  const stepsRef = useRef<HTMLDivElement>(null);
  const swipeRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const isDraggingRef = useRef(false);

  const steps = [
    {
      icon: (
        <svg
          className="w-10 h-10 fill-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
      ),
      title: "역량 진단",
      items: [
        "정책자금 신청 자격 검토",
        "기업의 자금조달 강점 분석",
        "필요한 경영컨설팅 영역 파악",
        "개선 목표 및 일정 수립",
      ],
    },
    {
      icon: (
        <svg
          className="w-10 h-10 fill-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]"
          viewBox="0 0 24 24"
        >
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
      ),
      title: "전문가 매칭",
      items: [
        "법무, 세무, 회계, 노무 전문가",
        "기업 맞춤형 경영컨설팅 구성",
        "자금조달 역량 강화 커리큘럼",
        "서비스 범위 및 일정 확정",
      ],
    },
    {
      icon: (
        <svg
          className="w-10 h-10 fill-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]"
          viewBox="0 0 24 24"
        >
          <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
        </svg>
      ),
      title: "역량강화 실행",
      items: [
        "맞춤형 코칭 시행",
        "통합 코디네이션 관리",
        "주간/월간 진행상황 점검",
        "실시간 이슈 처리 및 개선",
      ],
    },
    {
      icon: (
        <svg
          className="w-10 h-10 fill-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      ),
      title: "완성 및 사후관리",
      items: [
        "최종 역량 평가 및 결과 검증",
        "정책자금 신청 준비 완료 확인",
        "지속적 자금조달 지원 체계",
        "심사통과 후 사후관리 및 피드백",
      ],
    },
  ];

  const trustItems = [
    "418+ 성공 기업 수",
    "전문가 맞춤 매칭",
    "체계적인 프로세스",
    "투명한 비용 체계",
    "성공 후 사후관리",
    "기업정보 철저 보안",
  ];

  const goToStep = useCallback(
    (index: number) => {
      if (index < 0 || index >= steps.length) return;
      setActiveStep(index);
    },
    [steps.length],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 스포트라이트 마우스 트래킹 (데스크톱)
    if (window.innerWidth > 768) {
      const contents =
        stepsRef.current?.querySelectorAll<HTMLElement>(".step-content-card");
      contents?.forEach((content) => {
        const onMove = (e: MouseEvent) => {
          const rect = content.getBoundingClientRect();
          content.style.setProperty("--mx", `${e.clientX - rect.left}px`);
          content.style.setProperty("--my", `${e.clientY - rect.top}px`);
        };
        const onLeave = () => {
          content.style.removeProperty("--mx");
          content.style.removeProperty("--my");
        };
        content.addEventListener("mousemove", onMove);
        content.addEventListener("mouseleave", onLeave);
      });

      // CTA 버튼 스포트라이트
      const ctaBtn = document.querySelector<HTMLElement>(".cta-primary-btn");
      if (ctaBtn) {
        const onMove = (e: MouseEvent) => {
          const rect = ctaBtn.getBoundingClientRect();
          ctaBtn.style.setProperty("--mx", `${e.clientX - rect.left}px`);
          ctaBtn.style.setProperty("--my", `${e.clientY - rect.top}px`);
        };
        ctaBtn.addEventListener("mousemove", onMove);
        ctaBtn.addEventListener("mouseleave", () => {
          ctaBtn.style.removeProperty("--mx");
          ctaBtn.style.removeProperty("--my");
        });
      }
    }

    // 모바일 스와이프
    const wrapper = swipeRef.current;
    if (window.innerWidth <= 768 && wrapper) {
      const onTouchStart = (e: TouchEvent) => {
        startXRef.current = e.touches[0].clientX;
        isDraggingRef.current = true;
      };
      const onTouchMove = (e: TouchEvent) => {
        if (!isDraggingRef.current) return;
        e.preventDefault();
      };
      const onTouchEnd = (e: TouchEvent) => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;
        const endX = e.changedTouches[0].clientX;
        const diff = startXRef.current - endX;
        if (Math.abs(diff) > 50) {
          if (diff > 0 && activeStep < steps.length - 1) {
            goToStep(activeStep + 1);
          } else if (diff < 0 && activeStep > 0) {
            goToStep(activeStep - 1);
          }
        }
      };
      wrapper.addEventListener("touchstart", onTouchStart);
      wrapper.addEventListener("touchmove", onTouchMove, { passive: false });
      wrapper.addEventListener("touchend", onTouchEnd);
      return () => {
        wrapper.removeEventListener("touchstart", onTouchStart);
        wrapper.removeEventListener("touchmove", onTouchMove);
        wrapper.removeEventListener("touchend", onTouchEnd);
      };
    }
  }, [activeStep, goToStep, steps.length]);

  return (
    <section className="relative w-full bg-navy overflow-visible z-[3]">
      {/* 배경 골드 파티클 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(212,175,55,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(139,111,63,0.06)_0%,transparent_50%),radial-gradient(circle_at_50%_20%,rgba(212,175,55,0.05)_0%,transparent_40%)] pointer-events-none z-0" />

      <div className="relative w-full py-[50px] md:py-[60px] overflow-visible">
        <div className="max-w-[1200px] mx-auto px-5 relative z-[1] overflow-visible">
          {/* 섹션 헤더 */}
          <div className="text-center mb-[30px] md:mb-[50px] overflow-visible">
            <h2
              className="text-[22px] sm:text-[26px] md:text-[48px] font-bold text-light mb-5 leading-[1.2] break-keep
                [text-shadow:0_0_10px_rgba(250,248,243,0.5),0_0_20px_rgba(212,175,55,0.5),0_0_30px_rgba(212,175,55,0.3)]"
            >
              피에스킴컨설팅
              <br />
              전문서비스 프로세스
            </h2>
            <p
              className="text-[13px] sm:text-[15px] md:text-[20px] text-body leading-[1.6] break-keep
                [text-shadow:0_0_5px_rgba(232,212,168,0.5),0_1px_2px_rgba(0,0,0,0.3)]"
            >
              정책자금 심사통과율을 높이는
              <br />
              4단계 경영컨설팅 코칭 프로세스
            </p>
            <p className="text-[12px] md:text-sm text-[rgba(232,212,168,0.8)] mt-4 leading-[1.6]">
              ※ 피에스킴컨설팅은 기업 평가 및 진단, 컨설팅 및 자문, 서류작성
              대행을 제공하지 않습니다.
              <br />
              대표님의 역량 강화를 위한 정보 제공 및 코칭 서비스를 제공합니다.
            </p>
          </div>

          {/* 모바일 탭 버튼 */}
          <div className="hidden max-md:grid grid-cols-4 sm:grid-cols-4 gap-2 sm:gap-2.5 mb-[30px] max-[480px]:grid-cols-2 max-[480px]:gap-2">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => goToStep(i)}
                className={`py-3 px-2.5 rounded-[10px] text-[11px] sm:text-[13px] font-semibold text-center cursor-pointer transition-all duration-300 border
                  ${
                    activeStep === i
                      ? "bg-gradient-to-br from-gold-dark to-gold border-transparent text-light shadow-[0_0_20px_rgba(212,175,55,0.5)]"
                      : "bg-[rgba(15,23,42,0.5)] border-[rgba(212,175,55,0.4)] text-[rgba(255,255,255,0.7)]"
                  }`}
              >
                STEP {i + 1}
              </button>
            ))}
          </div>

          {/* 프로세스 컨테이너 */}
          <div className="relative mb-[60px] overflow-visible">
            {/* 프로세스 라인 (데스크톱) */}
            <div
              className="hidden md:block lg:block absolute top-[120px] left-[10%] right-[10%] h-[2px] z-[1]
                bg-gradient-to-r from-gold-dark via-gold to-body
                shadow-[0_0_10px_rgba(212,175,55,0.5)]
                max-lg:hidden"
            />

            {/* 스와이프 래퍼 */}
            <div
              ref={swipeRef}
              className="overflow-hidden relative w-full max-md:min-h-[240px]"
            >
              <div
                ref={stepsRef}
                className="flex justify-between items-start relative z-[2] pt-[80px] overflow-visible
                  max-lg:grid max-lg:grid-cols-2 max-lg:gap-5
                  max-md:relative max-md:w-full max-md:h-full"
              >
                {steps.map((step, i) => (
                  <div
                    key={i}
                    className={`flex-1 text-center px-2.5 relative flex flex-col overflow-visible
                      max-md:absolute max-md:top-0 max-md:left-0 max-md:w-full max-md:px-2.5 max-md:flex-col max-md:items-center max-md:justify-center max-md:box-border
                      ${
                        typeof window !== "undefined" &&
                        window.innerWidth <= 768
                          ? activeStep === i
                            ? "max-md:flex max-md:opacity-100"
                            : "max-md:hidden max-md:opacity-0"
                          : ""
                      }`}
                    style={{
                      display:
                        typeof window !== "undefined" &&
                        window.innerWidth <= 768
                          ? activeStep === i
                            ? "flex"
                            : "none"
                          : undefined,
                      opacity:
                        typeof window !== "undefined" &&
                        window.innerWidth <= 768
                          ? activeStep === i
                            ? 1
                            : 0
                          : 1,
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    {/* 스텝 번호 (데스크톱) */}
                    <div
                      className="hidden md:flex w-[80px] h-[80px] mx-auto mb-4 rounded-full items-center justify-center relative transition-all duration-300
                        bg-gradient-to-br from-gold-dark to-gold border border-body
                        shadow-[0_0_30px_rgba(212,175,55,0.6),inset_0_0_20px_rgba(250,248,243,0.3)]
                        hover:scale-110 hover:bg-gradient-to-br hover:from-gold hover:to-body
                        hover:shadow-[0_0_40px_rgba(212,175,55,0.8),inset_0_0_30px_rgba(250,248,243,0.4)]"
                    >
                      <span className="text-sm font-bold text-light [text-shadow:0_0_10px_rgba(250,248,243,0.8)]">
                        STEP {i + 1}
                      </span>
                    </div>

                    {/* 스텝 콘텐츠 카드 */}
                    <div
                      className="step-content-card relative rounded-xl p-[18px_16px] md:p-[24px_18px] min-h-0 md:min-h-[220px] transition-all duration-300 overflow-hidden
                        bg-[rgba(30,60,120,0.4)] backdrop-blur-[15px] border border-[rgba(212,175,55,0.5)]
                        hover:bg-[rgba(40,80,140,0.5)] hover:border-gold hover:-translate-y-[5px] hover:shadow-[0_10px_30px_rgba(212,175,55,0.5)]
                        max-md:w-full max-md:max-w-full max-md:min-h-0 max-md:text-center"
                    >
                      {/* 왼쪽 골드 바 */}
                      <div className="absolute top-0 left-0 w-[3px] md:w-[4px] h-full bg-gradient-to-b from-gold-dark to-gold shadow-[0_0_10px_rgba(212,175,55,0.8)] z-[1]" />

                      {/* 스포트라이트 오버레이 */}
                      <div
                        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0 blur-[10px] rounded-[inherit]"
                        style={{
                          background:
                            "radial-gradient(circle 150px at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.3), rgba(232,212,168,0.25) 40%, rgba(212,175,55,0.15) 60%, transparent 100%)",
                        }}
                      />

                      {/* 아이콘 (데스크톱) */}
                      <div className="hidden md:block mx-auto mb-4 relative z-[1]">
                        {step.icon}
                      </div>

                      {/* 타이틀 */}
                      <h3
                        className="text-[17px] md:text-[20px] font-bold text-gold mb-3 md:mb-4 relative z-[1] text-center md:text-left
                          [text-shadow:0_0_10px_rgba(212,175,55,0.5)]"
                      >
                        {step.title}
                      </h3>

                      {/* 체크리스트 */}
                      <ul className="list-none p-0 relative z-[1] inline-block text-left mx-auto md:mx-0">
                        {step.items.map((item, j) => (
                          <li
                            key={j}
                            className="text-[13px] md:text-[15px] text-[rgba(255,255,255,0.85)] leading-[1.6] md:leading-[1.8] mb-1.5 md:mb-2 relative pl-5 md:pl-6 whitespace-nowrap md:whitespace-normal"
                          >
                            <span className="absolute left-0 text-gold font-bold [text-shadow:0_0_5px_rgba(212,175,55,0.8)]">
                              &#10003;
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Banner */}
          <div className="mt-[60px] mb-10">
            <div
              className="p-[30px_20px] md:p-10 rounded-2xl text-center relative overflow-hidden
                bg-[rgba(30,80,140,0.25)] border border-[rgba(212,175,55,0.4)]"
            >
              {/* 배경 글로우 */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" />

              <h3
                className="text-[22px] md:text-[28px] font-bold text-gold text-center mb-6 md:mb-[30px] relative
                  [text-shadow:0_0_10px_rgba(212,175,55,0.5)]"
              >
                피에스킴컨설팅의 약속
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5 relative max-w-full mx-auto max-md:grid-cols-1 max-md:gap-3">
                {trustItems.map((item, i) => (
                  <div
                    key={i}
                    className="text-sm md:text-base text-[rgba(255,255,255,0.9)] py-5 px-5 text-center rounded-[10px] flex items-center justify-center gap-3 transition-all duration-300 relative
                      bg-[rgba(30,80,140,0.35)] border border-[rgba(212,175,55,0.5)]
                      hover:bg-[rgba(40,100,160,0.45)] hover:border-gold hover:-translate-y-[3px] hover:shadow-[0_5px_20px_rgba(212,175,55,0.3)]"
                  >
                    <span className="text-gold font-bold text-xl flex-shrink-0">
                      &#10003;
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA 영역 */}
          <div className="text-center mt-[50px]">
            <p
              className="text-[15px] md:text-lg text-body mb-[30px] leading-[1.8]
                [text-shadow:0_0_5px_rgba(232,212,168,0.5)]"
            >
              정책자금 자금조달, 전문가와 함께 시작하세요
              <br />
              성공적인 심사통과를 위한 완벽한 준비
              <br />
              피에스킴컨설팅의 경영컨설팅 프로세스로 시작하세요
            </p>

            <div className="flex gap-5 justify-center flex-wrap max-md:flex-col max-md:items-center">
              {/* Primary CTA */}
              <a
                href="#consult-form"
                className="cta-primary-btn relative inline-block px-[50px] py-4 rounded-[50px] text-[15px] md:text-[17px] font-bold text-light no-underline transition-all duration-300 overflow-hidden
                  bg-gradient-to-br from-gold-dark to-gold border border-body
                  [text-shadow:0_0_10px_rgba(250,248,243,0.8)]
                  shadow-[0_0_30px_rgba(212,175,55,0.8),inset_0_0_20px_rgba(250,248,243,0.3)]
                  hover:bg-gradient-to-br hover:from-gold hover:to-body hover:-translate-y-[3px] hover:scale-105
                  hover:shadow-[0_0_40px_rgba(212,175,55,1),0_10px_30px_rgba(212,175,55,0.5),inset_0_0_30px_rgba(250,248,243,0.4)]
                  max-md:w-full max-md:max-w-[320px] max-md:px-10 max-md:py-3.5"
              >
                {/* 스포트라이트 오버레이 */}
                <span
                  className="absolute inset-0 opacity-100 pointer-events-none z-0 blur-[8px] rounded-[inherit]"
                  style={{
                    background:
                      "radial-gradient(circle 80px at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.4), rgba(232,212,168,0.3) 40%, rgba(212,175,55,0.2) 60%, transparent 100%)",
                  }}
                />
                <span className="relative z-[1]">전문가 매칭 신청</span>
              </a>

              {/* Secondary CTA */}
              <a
                href="tel:010-8008-0186"
                className="inline-block px-[50px] py-4 rounded-[50px] text-[15px] md:text-[17px] font-bold text-gold no-underline transition-all duration-300
                  bg-transparent border-2 border-gold
                  [text-shadow:0_0_5px_rgba(212,175,55,0.5)]
                  hover:bg-gradient-to-br hover:from-gold-dark hover:to-gold hover:text-light hover:-translate-y-[3px] hover:border-body hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]
                  max-md:w-full max-md:max-w-[320px] max-md:px-10 max-md:py-3.5"
              >
                전화 상담
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Pro Page
   ────────────────────────────────────────────── */
export default function ProClient() {
  return (
    <>
      <ProHero />
      <ProServiceSection />
      <ProProcessSection />
      <ConsultCTA
        title="전문 서비스 1:1 컨설팅을 시작하세요"
        subtitle="기업 상황에 맞는 맞춤형 솔루션을 제안해드립니다"
      />
    </>
  );
}

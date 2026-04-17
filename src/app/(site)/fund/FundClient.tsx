"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ConsultFormWizard from "@/components/ConsultFormWizard";
import LocalVideoBackground from "@/components/LocalVideoBackground";
import CountUpNumber from "@/components/CountUpNumber";
import { HERO_VIDEOS } from "@/config/hero-videos";

/* ──────────────────────────────────────────────
   1. Hero Section - 자금 소개 + 4 Fund Cards
   ────────────────────────────────────────────── */
function FundHero() {
  const cardsRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth <= 768) return;

    // 카드 마우스 추적 스포트라이트
    const cards = cardsRef.current?.querySelectorAll<HTMLElement>(".fund-card");
    cards?.forEach((card) => {
      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        card.style.setProperty("--my", `${e.clientY - rect.top}px`);
      };
      const onLeave = () => {
        card.style.setProperty("--mx", "50%");
        card.style.setProperty("--my", "50%");
      };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
    });

    // CTA 버튼 마우스 추적
    const btn = btnRef.current;
    if (btn) {
      const onMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        btn.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        btn.style.setProperty("--my", `${e.clientY - rect.top}px`);
      };
      const onLeave = () => {
        btn.style.setProperty("--mx", "50%");
        btn.style.setProperty("--my", "50%");
      };
      btn.addEventListener("mousemove", onMove);
      btn.addEventListener("mouseleave", onLeave);
    }
  }, []);

  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    const formSection = document.querySelector("#consult-form");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const fundCards = [
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-[30px] h-[30px] md:w-[30px] md:h-[30px] fill-light"
        >
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
        </svg>
      ),
      title: "정책자금",
      desc: "중소기업 창업·성장·시설자금",
      amountPrefix: "최대 ",
      amountNum: 30,
      amountSuffix: "억원",
      ratePrefix: "연 ",
      rateNum: 2.5,
      rateSuffix: "%~",
      rateDecimals: 1,
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-[30px] h-[30px] md:w-[30px] md:h-[30px] fill-light"
        >
          <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
        </svg>
      ),
      title: "기업대출",
      desc: "운전·시설·신용대출",
      amountPrefix: "최대 ",
      amountNum: 50,
      amountSuffix: "억원",
      ratePrefix: "연 ",
      rateNum: 3.2,
      rateSuffix: "%~",
      rateDecimals: 1,
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-[30px] h-[30px] md:w-[30px] md:h-[30px] fill-light"
        >
          <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
        </svg>
      ),
      title: "보증서발급",
      desc: "신용·기술보증서",
      amountPrefix: "최대 ",
      amountNum: 30,
      amountSuffix: "억원",
      ratePrefix: "보증료 ",
      rateNum: 0.5,
      rateSuffix: "%~",
      rateDecimals: 1,
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-[30px] h-[30px] md:w-[30px] md:h-[30px] fill-light"
        >
          <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z" />
        </svg>
      ),
      title: "경영컨설팅",
      desc: "현황진단·자금조달 설계",
      amountStatic: "무료 상담",
      rateStatic: "전문가 매칭",
    },
  ];

  return (
    <section className="relative w-full pt-[130px] md:pt-[180px] pb-[50px] md:pb-[80px] px-0 overflow-hidden">
      <LocalVideoBackground src={HERO_VIDEOS.funding} overlayOpacity={0.7} />
      {/* 플로팅 아이콘 배경 */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg
          className="absolute top-[10%] left-[10%] opacity-[0.03] text-gold animate-[haFloat_20s_ease-in-out_infinite]"
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
        </svg>
        <svg
          className="absolute top-[20%] right-[15%] opacity-[0.03] text-gold animate-[haFloat_20s_ease-in-out_infinite_5s]"
          width="60"
          height="60"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z" />
        </svg>
        <svg
          className="absolute bottom-[20%] left-[20%] opacity-[0.03] text-gold animate-[haFloat_20s_ease-in-out_infinite_10s]"
          width="70"
          height="70"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
        </svg>
        <svg
          className="absolute bottom-[10%] right-[10%] opacity-[0.03] text-gold animate-[haFloat_20s_ease-in-out_infinite_15s]"
          width="75"
          height="75"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
        </svg>
      </div>

      <div className="max-w-[1200px] mx-auto px-5 md:px-5 relative z-[1]">
        {/* Hero Content - PC: 2col, Mobile: 1col */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-[60px] items-center text-center md:text-left">
          {/* 왼쪽: 텍스트 */}
          <div className="text-body px-5 md:px-0">
            <span className="inline-block bg-[rgba(107,83,53,0.2)] text-gold px-5 py-2 rounded-[30px] text-[12px] md:text-sm font-semibold mb-4 md:mb-5 border border-[rgba(212,175,55,0.4)] backdrop-blur-[10px] shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              피에스킴컨설팅 정책자금 성장 전략
            </span>
            <h1 className="text-[26px] md:text-[48px] font-bold leading-[1.2] md:leading-[1.2] mb-4 md:mb-6 text-light [text-shadow:0_0_30px_rgba(212,175,55,0.2)] break-keep">
              정책자금 조달,
              <br />
              <span className="relative inline-block gold-gradient-bg text-light px-3 md:px-6 py-1 md:py-2 rounded-lg font-extrabold shadow-[0_0_40px_rgba(212,175,55,0.6),0_4px_20px_rgba(139,111,63,0.4),inset_0_0_20px_rgba(255,255,255,0.2)] mx-1 md:mx-2 [text-shadow:0_2px_4px_rgba(0,0,0,0.3)]">
                성장 전문가와 함께
              </span>
              하면
              <br />
              확실히 다릅니다
            </h1>
            <p className="text-[15px] md:text-[20px] leading-[1.6] mb-6 md:mb-10 text-body [text-shadow:0_0_10px_rgba(0,0,0,0.3)] break-keep">
              중소기업 맞춤형 정책자금 전략 수립부터
              <br className="md:hidden" /> 성공적인 자금조달까지
              <br />
              체계적인 경영컨설팅으로
              <br className="md:hidden" /> 대표님의 기업 성장을 지원합니다
            </p>
            <div className="flex gap-2.5 md:gap-4 flex-wrap justify-center md:justify-start mt-6 md:mt-0 mb-3 md:mb-0">
              <a
                ref={btnRef}
                href="#consult-form"
                onClick={scrollToForm}
                className="relative overflow-hidden gold-gradient-bg text-light px-5 md:px-8 py-3 md:py-4 rounded-lg text-[15px] md:text-lg font-bold inline-flex items-center gap-2 transition-all duration-400 shadow-[0_4px_20px_rgba(139,111,63,0.4),0_0_40px_rgba(212,175,55,0.3)] [text-shadow:0_1px_2px_rgba(0,0,0,0.2)] cursor-pointer
                  hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_0_70px_rgba(212,175,55,0.9),0_0_110px_rgba(250,248,243,0.6),0_0_150px_rgba(139,111,63,0.4),0_12px_35px_rgba(139,111,63,0.5)]
                  before:absolute before:inset-0 before:bg-[radial-gradient(circle_150px_at_var(--mx,50%)_var(--my,50%),rgba(250,248,243,0.4),rgba(212,175,55,0.3)_40%,transparent_100%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:pointer-events-none before:z-[1]"
              >
                <span className="relative z-[2]">무료 상담 신청하기</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="relative z-[2]"
                >
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              </a>
              <a
                href="tel:010-8008-0186"
                className="bg-[rgba(255,255,255,0.1)] backdrop-blur-[10px] text-light px-5 md:px-8 py-3 md:py-4 border border-[rgba(212,175,55,0.3)] rounded-lg text-[15px] md:text-lg font-semibold inline-flex items-center gap-2 transition-all duration-300 shadow-[0_4px_20px_rgba(212,175,55,0.2)] no-underline
                  hover:bg-[rgba(255,255,255,0.15)] hover:border-[rgba(212,175,55,0.5)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(212,175,55,0.3)]"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                전문가 바로 연결
              </a>
            </div>
          </div>

          {/* 모바일 요약 카드 */}
          <div className="block md:hidden bg-[rgba(30,60,120,0.15)] backdrop-blur-[15px] border border-[rgba(212,175,55,0.3)] rounded-2xl p-4 mx-5 mb-3 shadow-[0_0_30px_rgba(139,111,63,0.4),0_8px_32px_rgba(212,175,55,0.2)]">
            <div className="grid grid-cols-3 text-center">
              <div className="px-2 border-r border-[rgba(212,175,55,0.3)]">
                <div className="text-[22px] font-bold text-gold mb-0.5 [text-shadow:0_0_15px_rgba(212,175,55,0.8)]">
                  <CountUpNumber end={418} suffix="+" />
                </div>
                <div className="text-[11px] text-body font-medium">
                  성공 기업
                </div>
              </div>
              <div className="px-2 border-r border-[rgba(212,175,55,0.3)]">
                <div className="text-[22px] font-bold text-gold mb-0.5 [text-shadow:0_0_15px_rgba(212,175,55,0.8)]">
                  <CountUpNumber end={2.8} suffix="억" decimals={1} />
                </div>
                <div className="text-[11px] text-body font-medium">
                  평균 조달액
                </div>
              </div>
              <div className="px-2">
                <div className="text-[22px] font-bold text-gold mb-0.5 [text-shadow:0_0_15px_rgba(212,175,55,0.8)]">
                  <CountUpNumber end={97} suffix="%" />
                </div>
                <div className="text-[11px] text-body font-medium">
                  심사 통과율
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 4 Fund Cards */}
          <div className="relative mt-0 md:mt-0 px-5 md:px-0">
            <div ref={cardsRef} className="grid grid-cols-2 gap-3 md:gap-5">
              {fundCards.map((card, i) => (
                <div
                  key={i}
                  className="fund-card relative bg-[rgba(30,60,120,0.15)] backdrop-blur-[15px] rounded-2xl p-4 md:p-[30px] border border-[rgba(212,175,55,0.3)] shadow-[0_0_30px_rgba(139,111,63,0.4),0_8px_32px_rgba(212,175,55,0.2),inset_0_1px_0_rgba(212,175,55,0.1)] transition-all duration-400 cursor-pointer flex flex-col items-center text-center overflow-hidden min-h-[160px] md:min-h-0
                    hover:bg-[rgba(30,60,120,0.25)] hover:-translate-y-0.5 hover:border-[rgba(212,175,55,0.8)] hover:shadow-[0_0_60px_rgba(212,175,55,0.8),0_0_100px_rgba(139,111,63,0.5),0_12px_40px_rgba(212,175,55,0.4)]"
                >
                  {/* 스포트라이트 */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_200px_at_var(--mx,50%)_var(--my,50%),rgba(250,248,243,0.35),rgba(212,175,55,0.3)_30%,rgba(139,111,63,0.2)_50%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[1] blur-[12px] hover:opacity-100" />

                  <div className="w-[45px] h-[45px] md:w-[60px] md:h-[60px] gold-gradient-bg rounded-xl flex items-center justify-center mb-3 md:mb-5 relative z-[2] shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                    {card.icon}
                  </div>
                  <h3 className="text-[15px] md:text-[22px] font-bold text-light mb-1 relative z-[2] [text-shadow:0_0_15px_rgba(0,0,0,0.5)]">
                    {card.title}
                  </h3>
                  <p className="text-[12px] md:text-base text-body leading-[1.5] mb-3 md:mb-5 relative z-[2]">
                    {card.desc}
                  </p>
                  <div className="text-[17px] md:text-2xl font-bold text-gold mb-0.5 md:mb-2 relative z-[2] [text-shadow:0_0_20px_rgba(212,175,55,0.8)]">
                    {"amountStatic" in card ? (
                      card.amountStatic
                    ) : (
                      <>
                        {card.amountPrefix}
                        <CountUpNumber end={card.amountNum!} />
                        {card.amountSuffix}
                      </>
                    )}
                  </div>
                  <div className="text-[13px] md:text-lg font-semibold text-body relative z-[2]">
                    {"rateStatic" in card ? (
                      card.rateStatic
                    ) : (
                      <>
                        {card.ratePrefix}
                        <CountUpNumber
                          end={card.rateNum!}
                          decimals={card.rateDecimals}
                        />
                        {card.rateSuffix}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 면책문구 - 히어로 하단 */}
      <p className="text-[9px] md:text-xs text-[rgba(232,212,168,0.6)] mt-8 leading-[1.6] text-center relative z-[1] [text-shadow:0_0_10px_rgba(0,0,0,0.3)]">
        ※ 피에스킴컨설팅은 정책자금 서류작성을 대행하지 않습니다.
        <br className="md:hidden" /> ※ 기업평가를 하지 않습니다.
      </p>
    </section>
  );
}

/* ──────────────────────────────────────────────
   2. Process Section - 4-Step Timeline
   ────────────────────────────────────────────── */
function ProcessSection() {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isMobile = window.innerWidth <= 768;

    // 데스크톱: 마우스 추적 스포트라이트
    if (!isMobile) {
      const contents =
        timelineRef.current?.querySelectorAll<HTMLElement>(".process-card");
      contents?.forEach((content) => {
        const onMove = (e: MouseEvent) => {
          const rect = content.getBoundingClientRect();
          content.style.setProperty("--mx", `${e.clientX - rect.left}px`);
          content.style.setProperty("--my", `${e.clientY - rect.top}px`);
        };
        const onLeave = () => {
          content.style.setProperty("--mx", "50%");
          content.style.setProperty("--my", "50%");
        };
        content.addEventListener("mousemove", onMove);
        content.addEventListener("mouseleave", onLeave);
      });
    }

    // 스크롤 애니메이션
    if (!isMobile) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
            }
          });
        },
        { threshold: 0.3, rootMargin: "0px 0px -100px 0px" },
      );

      const items = timelineRef.current?.querySelectorAll(".process-item");
      items?.forEach((item) => observer.observe(item));

      return () => observer.disconnect();
    } else {
      // 모바일: 즉시 표시
      const items = timelineRef.current?.querySelectorAll(".process-item");
      items?.forEach((item) => item.classList.add("visible"));
    }
  }, []);

  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    const formSection = document.querySelector("#consult-form");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const steps = [
    {
      step: "STEP 01",
      title: "무료 상담 및 역량 진단",
      desc: "대표님의 재무 현황과 정책자금 수요를 분석하여 최적의 자금조달 솔루션을 제안합니다",
      details: ["재무 현황 정밀 분석", "정책자금 수요 파악"],
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 md:w-10 md:h-10 fill-gold drop-shadow-[0_0_5px_rgba(212,175,55,0.8)]"
        >
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
        </svg>
      ),
    },
    {
      step: "STEP 02",
      title: "맞춤형 자금조달 전략 수립",
      desc: "정책자금, 기업대출, 보증서 등 다양한 자금조달 옵션을 검토하여 최적의 조합을 제시합니다",
      details: ["최적 자금조달 조합", "금융 비용 절감"],
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 md:w-10 md:h-10 fill-gold drop-shadow-[0_0_5px_rgba(212,175,55,0.8)]"
        >
          <path d="M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4zm2.5 2.1h-15V5h15v14.1zm0-16.1h-15c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
        </svg>
      ),
    },
    {
      step: "STEP 03",
      title: "서류 정보 제공 및 심사통과 전략",
      desc: "대표님이 직접 작성하실 수 있도록 서류 정보를 제공하고 정책자금 심사통과 전략을 체계적으로 제시합니다",
      details: ["서류 정보 제공", "심사통과 전략 수립"],
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 md:w-10 md:h-10 fill-gold drop-shadow-[0_0_5px_rgba(212,175,55,0.8)]"
        >
          <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
        </svg>
      ),
    },
    {
      step: "STEP 04",
      title: "자금 집행 및 사후 관리",
      desc: "정책자금 수령 후에도 실적 관리와 추가 자금조달 연계로 지속적인 기업 성장을 지원합니다",
      details: ["실적 관리 지원", "추가 정책자금 연계"],
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 md:w-10 md:h-10 fill-gold drop-shadow-[0_0_5px_rgba(212,175,55,0.8)]"
        >
          <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative w-full bg-[#111d35] py-[40px] md:py-[60px] overflow-hidden">
      {/* 히어로-프로세스 구분선 */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.4)] to-transparent" />
      <div className="max-w-[1200px] mx-auto px-4 md:px-5 relative z-[1]">
        {/* 헤더 */}
        <div className="text-center mb-[30px] md:mb-10">
          <span className="inline-block bg-[rgba(107,83,53,0.2)] text-gold px-5 py-2 rounded-[30px] text-[12px] md:text-sm font-semibold mb-3.5 md:mb-4 border border-[rgba(212,175,55,0.4)] backdrop-blur-[10px] [text-shadow:0_0_10px_rgba(212,175,55,0.5)]">
            피에스킴컨설팅 정책자금 성장 전략 과정
          </span>
          <h2 className="text-[24px] md:text-[42px] font-bold text-light mb-2.5 md:mb-3 leading-[1.2] md:leading-[1.2] [text-shadow:0_0_20px_rgba(212,175,55,0.2)] break-keep">
            전문적인 프로세스로 성공을 이끕니다
          </h2>
          <p className="text-[15px] md:text-lg text-body leading-[1.5] md:leading-[1.6] break-keep">
            성장 전문가가 대표님의 성장을 위해
            <br />
            역량 분석부터 자금 조달까지 완벽하게 지원합니다
          </p>
          <p className="text-[9px] md:text-xs text-[rgba(232,212,168,0.6)] mt-3 leading-[1.6]">
            ※ 피에스킴컨설팅은 정책자금 서류작성을 대행하지 않습니다.
            <br className="md:hidden" /> ※ 기업평가를 하지 않습니다.
          </p>
        </div>

        {/* 타임라인 */}
        <div ref={timelineRef} className="relative max-w-[900px] mx-auto">
          {/* 연결선 - 데스크톱 */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[rgba(212,175,55,0.5)] to-[rgba(139,111,63,0.2)] -translate-x-1/2 shadow-[0_0_10px_rgba(212,175,55,0.4)]" />
          {/* 연결선 - 모바일 */}
          <div className="block md:hidden absolute left-[30px] sm:left-[35px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[rgba(212,175,55,0.5)] to-[rgba(139,111,63,0.2)]" />

          {steps.map((s, i) => {
            const isEven = i % 2 === 1;
            return (
              <div
                key={i}
                className={`process-item relative flex items-center mb-[25px] md:mb-[35px] last:mb-0 min-h-[90px] md:min-h-0
                  md:${isEven ? "flex-row-reverse" : "flex-row"}
                  flex-row
                  [&.visible_.process-card]:opacity-100 [&.visible_.process-card]:translate-x-0
                  [&.visible_.process-icon-circle]:opacity-100 [&.visible_.process-icon-circle]:scale-100`}
                style={{
                  flexDirection:
                    typeof window !== "undefined" &&
                    window.innerWidth > 768 &&
                    isEven
                      ? "row-reverse"
                      : "row",
                }}
              >
                {/* 아이콘 */}
                <div
                  className="relative md:absolute md:left-1/2 md:-translate-x-1/2 z-[5] flex-shrink-0 ml-0 mr-5 md:mr-0 md:ml-0"
                  style={{
                    left:
                      typeof window !== "undefined" && window.innerWidth <= 768
                        ? "30px"
                        : undefined,
                    transform:
                      typeof window !== "undefined" && window.innerWidth <= 768
                        ? "translateX(-50%)"
                        : undefined,
                  }}
                >
                  <div
                    className="process-icon-circle w-[50px] h-[50px] md:w-[80px] md:h-[80px] bg-[rgba(30,60,120,0.15)] backdrop-blur-[15px] rounded-full flex items-center justify-center border-2 md:border-[3px] border-[rgba(212,175,55,0.5)] shadow-[0_0_30px_rgba(139,111,63,0.4),0_8px_32px_rgba(212,175,55,0.2),inset_0_0_20px_rgba(212,175,55,0.1)] transition-all duration-300 opacity-0 scale-[0.8] md:opacity-0 md:scale-[0.8]
                    hover:border-gold hover:scale-110 hover:shadow-[0_0_60px_rgba(212,175,55,0.8),0_0_100px_rgba(139,111,63,0.5),inset_0_0_30px_rgba(212,175,55,0.2)] hover:bg-[rgba(30,60,120,0.25)]"
                  >
                    {s.icon}
                  </div>
                </div>

                {/* 콘텐츠 */}
                <div
                  className={`process-card flex-1 p-[18px] md:p-[25px] bg-[rgba(30,60,120,0.15)] backdrop-blur-[20px] rounded-2xl border border-[rgba(212,175,55,0.3)] shadow-[0_0_30px_rgba(139,111,63,0.4),0_8px_32px_rgba(212,175,55,0.2),inset_0_1px_0_rgba(212,175,55,0.1)] relative overflow-hidden transition-all duration-600 z-[10]
                    opacity-100 md:opacity-0 translate-x-0 ${!isEven ? "md:-translate-x-[30px]" : "md:translate-x-[30px]"}
                    ${isEven ? "md:text-right" : "text-left"}
                    hover:border-[rgba(212,175,55,0.8)] hover:shadow-[0_0_60px_rgba(212,175,55,0.8),0_0_100px_rgba(139,111,63,0.5),0_12px_40px_rgba(212,175,55,0.4),inset_0_0_40px_rgba(212,175,55,0.1)] hover:bg-[rgba(30,60,120,0.25)] hover:-translate-y-0.5`}
                >
                  {/* 골드 사이드 라인 */}
                  <div
                    className={`absolute top-0 ${isEven ? "md:right-0 md:left-auto" : ""} left-0 w-1 h-full bg-gradient-to-b from-gold-dark to-gold shadow-[0_0_10px_rgba(212,175,55,0.8)] z-[2] transition-all duration-300 hover:w-2`}
                  />

                  {/* 스포트라이트 */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_200px_at_var(--mx,50%)_var(--my,50%),rgba(250,248,243,0.35),rgba(212,175,55,0.3)_30%,rgba(139,111,63,0.2)_50%,transparent_100%)] opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[1] blur-[12px]" />

                  <span className="process-step inline-block gold-gradient-bg text-light px-3 md:px-4 py-1 md:py-1.5 rounded-[20px] text-[11px] md:text-[13px] font-semibold mb-2 md:mb-2.5 shadow-[0_0_15px_rgba(212,175,55,0.4)] relative z-[3]">
                    {s.step}
                  </span>
                  <h3 className="text-[17px] md:text-2xl font-bold text-light mb-2 md:mb-2.5 [text-shadow:0_0_15px_rgba(0,0,0,0.5)] relative z-[3] leading-[1.3] break-keep">
                    {s.title}
                  </h3>
                  <p className="text-[12px] md:text-[15px] text-body leading-[1.5] md:leading-[1.6] mb-2.5 md:mb-3.5 relative z-[3] break-keep">
                    {s.desc}
                  </p>
                  <div
                    className={`flex gap-2 flex-wrap relative z-[3] ${isEven ? "md:justify-end" : ""} flex-col md:flex-row`}
                  >
                    {s.details.map((d, j) => (
                      <div
                        key={j}
                        className="inline-flex items-center gap-1.5 md:gap-2 text-[12px] md:text-sm text-body bg-[rgba(30,60,120,0.15)] px-2.5 md:px-3 py-1 md:py-1.5 rounded-[20px] border border-[rgba(212,175,55,0.3)] transition-all duration-300 w-fit
                          hover:bg-[rgba(30,60,120,0.25)] hover:border-[rgba(212,175,55,0.6)] hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                      >
                        <svg
                          className="w-3 h-3 md:w-4 md:h-4 fill-gold shrink-0 drop-shadow-[0_0_3px_rgba(212,175,55,0.8)]"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA 영역 */}
        <div className="text-center mt-[35px] md:mt-[50px] p-[30px_22px] md:p-[40px_35px] bg-[rgba(30,60,120,0.15)] backdrop-blur-[20px] rounded-2xl md:rounded-[20px] border border-[rgba(212,175,55,0.3)] shadow-[0_0_30px_rgba(139,111,63,0.4),0_8px_32px_rgba(212,175,55,0.2),inset_0_1px_0_rgba(212,175,55,0.1)]">
          <h3 className="text-[20px] md:text-[32px] font-bold text-light mb-2.5 md:mb-3.5 [text-shadow:0_0_20px_rgba(212,175,55,0.2)] break-keep leading-[1.3]">
            지금 바로 시작하세요
          </h3>
          <p className="text-[14px] md:text-[17px] text-body mb-5 md:mb-[25px] leading-[1.5] md:leading-[1.6] break-keep">
            피에스킴컨설팅의 전문 지원으로 정책자금 성공률을 높이세요
          </p>
          <a
            href="#consult-form"
            onClick={scrollToForm}
            className="relative inline-block gold-gradient-bg text-light px-[30px] md:px-9 py-[13px] md:py-4 rounded-lg md:rounded-[10px] text-base md:text-lg font-semibold no-underline transition-all duration-400 overflow-hidden border-2 border-transparent shadow-[0_4px_20px_rgba(139,111,63,0.4),0_0_40px_rgba(212,175,55,0.3)] w-full md:w-auto max-w-[280px]
              hover:-translate-y-[3px] hover:scale-[1.02] hover:shadow-[0_0_70px_rgba(212,175,55,0.9),0_0_110px_rgba(250,248,243,0.6),0_0_150px_rgba(139,111,63,0.4),0_12px_35px_rgba(139,111,63,0.5)]
              before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] before:transition-[left] before:duration-500 hover:before:left-[100%]"
          >
            무료 상담 신청하기
          </a>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   3. Detail Section - Fund Details with Tabs
   ────────────────────────────────────────────── */
function DetailSection() {
  const [activeTab, setActiveTab] = useState("policy");
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth <= 768) return;

    const el = sectionRef.current;
    if (!el) return;

    // info-item, benefit-card에 스포트라이트
    const smallCards = el.querySelectorAll<HTMLElement>(
      ".info-item, .benefit-card",
    );
    smallCards.forEach((card) => {
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
  }, [activeTab]);

  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    const formSection = document.querySelector("#consult-form");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const showTab = (tabName: string) => {
    setActiveTab(tabName);
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      setTimeout(() => {
        const tabContent = document.getElementById(`tab-${tabName}`);
        if (tabContent) {
          tabContent.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 100);
    }
  };

  const tabs = [
    {
      id: "policy",
      label: "정책자금",
      icon: (
        <svg
          className="w-4 h-4 md:w-5 md:h-5 fill-current shrink-0 drop-shadow-[0_0_3px_currentColor]"
          viewBox="0 0 24 24"
        >
          <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z" />
        </svg>
      ),
    },
    {
      id: "loan",
      label: "기업대출",
      icon: (
        <svg
          className="w-4 h-4 md:w-5 md:h-5 fill-current shrink-0 drop-shadow-[0_0_3px_currentColor]"
          viewBox="0 0 24 24"
        >
          <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
        </svg>
      ),
    },
    {
      id: "guarantee",
      label: "보증서발급",
      icon: (
        <svg
          className="w-4 h-4 md:w-5 md:h-5 fill-current shrink-0 drop-shadow-[0_0_3px_currentColor]"
          viewBox="0 0 24 24"
        >
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
        </svg>
      ),
    },
    {
      id: "consulting",
      label: "성장 지원",
      icon: (
        <svg
          className="w-4 h-4 md:w-5 md:h-5 fill-current shrink-0 drop-shadow-[0_0_3px_currentColor]"
          viewBox="0 0 24 24"
        >
          <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM9 8H7v2h2V8zm0 3H7v2h2v-2zm0 3H7v2h2v-2zm4-6h-2v2h2V8zm0 3h-2v2h2v-2zm0 3h-2v2h2v-2zm4-6h-2v2h2V8zm0 3h-2v2h2v-2zm0 3h-2v2h2v-2z" />
        </svg>
      ),
    },
  ];

  type TabData = {
    name: string;
    summary: string;
    highlightLabel: string;
    highlightValue: string;
    info: { label: string; value: string }[];
    targetTitle: string;
    targets: string[];
    serviceTitle: string;
    services: { title: string; desc: string }[];
  };

  const tabData: Record<string, TabData> = {
    policy: {
      name: "정부 정책자금 신청 정보",
      summary:
        "중소기업 창업·운전·시설자금 등 기업 성장 단계별 맞춤형 정부지원 정책자금 정보",
      highlightLabel: "최대 지원",
      highlightValue: "10억원",
      info: [
        { label: "이율", value: "1.5%~3.0%" },
        { label: "한도", value: "최대 10억" },
        { label: "기간", value: "최장 15년" },
        { label: "거치", value: "5년 가능" },
      ],
      targetTitle: "대상 기업",
      targets: [
        "창업·운전·시설 자금 필요 기업",
        "중소·중견기업 해당 사업자",
        "정상 영업활동 중인 기업",
        "사업계획서 제출 가능 기업",
      ],
      serviceTitle: "피에스킴컨설팅 제공 서비스",
      services: [
        {
          title: "정책자금 정보 분석",
          desc: "대표님 상황별 최적 정부지원 정책자금 정보",
        },
        { title: "서류 작성 교육", desc: "사업계획서 작성 방법 경영컨설팅" },
        {
          title: "심사통과 전략 코칭",
          desc: "대표님이 직접 준비하는 심사통과 전략",
        },
      ],
    },
    loan: {
      name: "대표님 맞춤형 대출 정보",
      summary:
        "은행·저축은행·캐피탈 등 다양한 금융기관 기업대출 자금조달 정보 제공",
      highlightLabel: "최대 한도",
      highlightValue: "30억원",
      info: [
        { label: "이율", value: "3.5%~8.0%" },
        { label: "한도", value: "최대 30억" },
        { label: "기간", value: "최장 10년" },
        { label: "승인", value: "2~7일" },
      ],
      targetTitle: "대상 기업",
      targets: [
        "사업자등록증 보유 기업",
        "운영 실적 보유 기업",
        "담보 또는 신용보증 가능 기업",
        "재무제표 제출 가능 기업",
      ],
      serviceTitle: "피에스킴컨설팅 제공 서비스",
      services: [
        { title: "금융기관 정보", desc: "은행·저축은행·캐피탈 정보 제공" },
        { title: "조건 비교 교육", desc: "금리·한도·조건 비교 방법 교육" },
        { title: "신청 전략 코칭", desc: "대표님이 직접 신청하는 전략 코칭" },
      ],
    },
    guarantee: {
      name: "신용보증서 발급 정보",
      summary: "신용보증재단·기술보증기금 등 보증기관 정보 제공",
      highlightLabel: "보증한도",
      highlightValue: "15억원",
      info: [
        { label: "보증료", value: "0.5%~1.5%" },
        { label: "보증비율", value: "85%~95%" },
        { label: "기간", value: "최장 10년" },
        { label: "심사", value: "3~10일" },
      ],
      targetTitle: "대상 기업",
      targets: [
        "담보 부족 중소기업",
        "창업 및 성장단계 기업",
        "기술력·성장성 보유 기업",
        "정상 운영 중인 사업자",
      ],
      serviceTitle: "피에스킴컨설팅 제공 서비스",
      services: [
        { title: "보증기관 정보", desc: "신보·기보·지역보증 정보 제공" },
        { title: "서류 작성 교육", desc: "대표님이 직접 작성하는 방법 교육" },
        { title: "심사 전략 코칭", desc: "대표님이 직접 준비하는 전략 코칭" },
      ],
    },
    consulting: {
      name: "대표님 자금전략 교육",
      summary:
        "대표님이 직접 수립하고 실행하는 맞춤형 자금조달 경영컨설팅 교육 및 코칭",
      highlightLabel: "성공률",
      highlightValue: "97%",
      info: [
        { label: "교육비용", value: "무료 상담" },
        { label: "교육기간", value: "1~3개월" },
        { label: "교육수수료", value: "자금집행 시" },
        { label: "정보제공", value: "지속제공" },
      ],
      targetTitle: "교육 대상",
      targets: [
        "자금조달 방법을 배우고 싶은 대표님",
        "신청 서류 작성 방법을 익히고 싶은 대표님",
        "최적 조건을 직접 찾고 싶은 대표님",
        "승인 확률을 직접 높이고 싶은 대표님",
      ],
      serviceTitle: "피에스킴컨설팅 제공 서비스",
      services: [
        { title: "역량 분석 교육", desc: "대표자 현황 분석·자금 전략 교육" },
        { title: "서류 작성 교육", desc: "대표님이 직접 작성하는 방법 교육" },
        { title: "사후관리 정보", desc: "자금 집행·상환 관리 정보 제공" },
      ],
    },
  };

  const data = tabData[activeTab];

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-navy overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto py-[50px] md:py-[80px] px-4 md:px-5 relative z-[1]">
        {/* 헤더 */}
        <div className="text-center mb-[30px] md:mb-10">
          <span className="inline-block bg-[rgba(107,83,53,0.2)] text-gold px-5 py-2 rounded-[30px] text-[12px] md:text-sm font-semibold mb-4 md:mb-5 border border-[rgba(212,175,55,0.4)] shadow-[0_0_10px_rgba(212,175,55,0.5),inset_0_0_10px_rgba(212,175,55,0.2)] [text-shadow:0_0_10px_rgba(212,175,55,0.8)] animate-[neonPulse_2s_ease-in-out_infinite]">
            피에스킴컨설팅 금융 솔루션
          </span>
          <h2 className="text-[24px] md:text-[42px] font-bold text-light mb-3 md:mb-4 leading-[1.2] [text-shadow:0_0_10px_rgba(212,175,55,0.5),0_0_20px_rgba(212,175,55,0.3),0_0_30px_rgba(139,111,63,0.2)] break-keep">
            대표님 성장을 위한 맞춤형 자금 지원
          </h2>
          <p className="text-[15px] md:text-lg text-body leading-[1.6] opacity-90 break-keep">
            정책자금부터 기업대출까지, 성장 전문가의 정밀한 분석으로
            <br className="hidden md:block" />
            대표님에게 최적화된 금융 솔루션을 제공합니다
          </p>
          <p className="text-[9px] md:text-xs text-[rgba(232,212,168,0.6)] mt-3 leading-[1.6]">
            ※ 피에스킴컨설팅은 정책자금 서류작성을 대행하지 않습니다.
            <br className="md:hidden" /> ※ 기업평가를 하지 않습니다.
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="grid grid-cols-2 md:flex md:justify-center gap-2 md:gap-3 mb-[30px] md:mb-[35px] flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => showTab(tab.id)}
              className={`bg-[rgba(30,60,120,0.1)] backdrop-blur-[10px] border rounded-[10px] px-2 md:px-[25px] py-3 text-[13px] md:text-[15px] font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center gap-1 md:gap-2 relative overflow-hidden whitespace-nowrap min-w-0
                ${
                  activeTab === tab.id
                    ? "bg-[rgba(30,60,120,0.2)] text-light border-[rgba(212,175,55,0.8)] shadow-[0_0_25px_rgba(212,175,55,0.9),inset_0_0_20px_rgba(212,175,55,0.2)] [text-shadow:0_0_15px_rgba(212,175,55,1)]"
                    : "text-body border-[rgba(212,175,55,0.3)] hover:bg-[rgba(30,60,120,0.15)] hover:border-[rgba(212,175,55,0.5)] hover:text-light hover:shadow-[0_0_20px_rgba(212,175,55,0.6),inset_0_0_15px_rgba(212,175,55,0.1)] hover:-translate-y-0.5 hover:[text-shadow:0_0_10px_rgba(212,175,55,0.8)]"
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div id={`tab-${activeTab}`} className="animate-[fadeInNeon_0.5s_ease]">
          <div className="relative bg-[rgba(15,23,46,0.6)] backdrop-blur-[20px] rounded-[20px] p-[25px_20px] md:p-[35px] border border-[rgba(212,175,55,0.3)] overflow-hidden shadow-[0_0_30px_rgba(139,111,63,0.2),inset_0_0_30px_rgba(212,175,55,0.05)]">
            {/* 네온 골드 상단 라인 */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[linear-gradient(90deg,transparent_0%,#8b6f3f_20%,#d4af37_50%,#8b6f3f_80%,transparent_100%)] animate-[neonSlide_3s_linear_infinite] z-[2]" />

            {/* 헤더 */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-[25px] pb-[25px] border-b border-[rgba(212,175,55,0.2)] gap-5 relative z-[2]">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-[24px] md:text-[32px] font-bold text-light mb-2 [text-shadow:0_0_10px_rgba(250,248,243,0.5),0_0_20px_rgba(212,175,55,0.3)]">
                  {data.name}
                </h3>
                <p className="text-[15px] md:text-[17px] text-body">
                  {data.summary}
                </p>
              </div>
              <div className="gold-gradient-bg text-light rounded-[14px] px-6 py-[18px] text-center min-w-[150px] w-full md:w-auto max-w-[200px] relative overflow-hidden border border-gold shadow-[0_0_30px_rgba(212,175,55,0.8),inset_0_0_20px_rgba(250,248,243,0.3)] animate-[neonGlow_3s_ease-in-out_infinite]">
                <div className="text-[13px] text-light mb-1 uppercase tracking-[0.5px] relative z-[1]">
                  {data.highlightLabel}
                </div>
                <div className="text-[26px] font-bold text-light relative z-[1] [text-shadow:0_0_15px_rgba(250,248,243,0.8)]">
                  {data.highlightValue}
                </div>
              </div>
            </div>

            {/* 정보 그리드 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-6 md:mb-7 relative z-[2]">
              {data.info.map((item, i) => (
                <div
                  key={i}
                  className="info-item text-center p-3 md:p-4 bg-[rgba(30,60,120,0.1)] rounded-[10px] border border-[rgba(212,175,55,0.2)] transition-all duration-300 relative overflow-hidden
                    hover:-translate-y-[3px] hover:border-[rgba(212,175,55,0.6)] hover:bg-[rgba(30,60,120,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5),inset_0_0_15px_rgba(212,175,55,0.1)]"
                >
                  {/* 스포트라이트 */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_120px_at_var(--mx,50%)_var(--my,50%),rgba(250,248,243,0.4),rgba(212,175,55,0.3)_40%,rgba(139,111,63,0.15)_60%,transparent_100%)] opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0 blur-[10px] rounded-[inherit]" />
                  <div className="text-sm text-body mb-1.5 font-medium relative z-[1]">
                    {item.label}
                  </div>
                  <div className="text-lg md:text-xl text-light font-bold relative z-[1]">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* 대상 기업 */}
            <div className="mb-6 md:mb-7 relative z-[2]">
              <h4 className="text-[19px] md:text-[22px] font-bold text-light mb-4 md:mb-[18px] flex items-center gap-2.5 [text-shadow:0_0_10px_rgba(250,248,243,0.5)]">
                <div className="w-8 h-8 bg-[rgba(107,83,53,0.2)] border border-[rgba(212,175,55,0.4)] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.5),inset_0_0_10px_rgba(212,175,55,0.2)]">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-[18px] h-[18px] fill-gold drop-shadow-[0_0_5px_#d4af37]"
                  >
                    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                  </svg>
                </div>
                {data.targetTitle}
              </h4>
              <ul className="list-none p-0 m-0 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-3.5">
                {data.targets.map((t, i) => (
                  <li key={i} className="flex items-start gap-2.5 py-2.5">
                    <svg
                      className="w-[18px] h-[18px] fill-gold shrink-0 mt-0.5 drop-shadow-[0_0_5px_#d4af37]"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <span className="text-base text-body leading-[1.5]">
                      {t}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 제공 서비스 */}
            <div className="mb-6 md:mb-7 relative z-[2]">
              <h4 className="text-[19px] md:text-[22px] font-bold text-light mb-4 md:mb-[18px] flex items-center gap-2.5 [text-shadow:0_0_10px_rgba(250,248,243,0.5)]">
                <div className="w-8 h-8 bg-[rgba(107,83,53,0.2)] border border-[rgba(212,175,55,0.4)] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.5),inset_0_0_10px_rgba(212,175,55,0.2)]">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-[18px] h-[18px] fill-gold drop-shadow-[0_0_5px_#d4af37]"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                {data.serviceTitle}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-5">
                {data.services.map((svc, i) => (
                  <div
                    key={i}
                    className="benefit-card bg-[rgba(30,60,120,0.1)] border border-[rgba(212,175,55,0.3)] rounded-xl p-[22px] transition-all duration-300 text-center relative overflow-hidden
                      hover:bg-[rgba(30,60,120,0.15)] hover:-translate-y-[5px] hover:shadow-[0_0_30px_rgba(212,175,55,0.6),inset_0_0_20px_rgba(212,175,55,0.15)] hover:border-[rgba(212,175,55,0.6)]"
                  >
                    {/* 스포트라이트 */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_120px_at_var(--mx,50%)_var(--my,50%),rgba(250,248,243,0.4),rgba(212,175,55,0.3)_40%,rgba(139,111,63,0.15)_60%,transparent_100%)] opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0 blur-[10px] rounded-[inherit]" />
                    <h5 className="text-[17px] md:text-[19px] font-semibold text-light mb-2 [text-shadow:0_0_8px_rgba(250,248,243,0.5)] relative z-[1]">
                      {svc.title}
                    </h5>
                    <p className="text-[14px] md:text-[15px] text-body leading-[1.5] relative z-[1]">
                      {svc.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 신청 버튼 */}
            <div className="text-center pt-[25px] border-t border-[rgba(212,175,55,0.2)] mt-[30px] relative z-[2]">
              <a
                href="#consult-form"
                onClick={scrollToForm}
                className="relative inline-block gold-gradient-bg text-light px-9 py-4 rounded-[10px] text-[17px] font-semibold no-underline transition-all duration-300 overflow-hidden border border-gold [text-shadow:0_0_10px_rgba(250,248,243,0.8)] shadow-[0_0_30px_rgba(212,175,55,0.8),inset_0_0_20px_rgba(250,248,243,0.3)]
                  hover:bg-[linear-gradient(135deg,#d4af37,#e8d4a8)] hover:-translate-y-[3px] hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,1),0_10px_30px_rgba(212,175,55,0.6),inset_0_0_30px_rgba(250,248,243,0.4)]
                  before:absolute before:top-1/2 before:left-1/2 before:w-0 before:h-0 before:bg-[radial-gradient(circle,rgba(250,248,243,0.5)_0%,transparent_70%)] before:-translate-x-1/2 before:-translate-y-1/2 before:transition-[width,height] before:duration-600 hover:before:w-[300px] hover:before:h-[300px]"
              >
                무료 상담 신청하기
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 커스텀 애니메이션 스타일 */}
      <style jsx>{`
        @keyframes neonPulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
        @keyframes neonGlow {
          0%,
          100% {
            box-shadow:
              0 0 20px rgba(139, 111, 63, 0.5),
              0 0 40px rgba(107, 83, 53, 0.3),
              0 0 60px rgba(212, 175, 55, 0.1);
          }
          50% {
            box-shadow:
              0 0 30px rgba(139, 111, 63, 0.8),
              0 0 50px rgba(212, 175, 55, 0.5),
              0 0 70px rgba(107, 83, 53, 0.2);
          }
        }
        @keyframes neonSlide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes fadeInNeon {
          from {
            opacity: 0;
            transform: translateY(15px);
            filter: blur(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
      `}</style>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Fund Page
   ────────────────────────────────────────────── */
export default function FundClient() {
  return (
    <>
      <style jsx global>{`
        @keyframes haFloat {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(30px, -30px) rotate(90deg);
          }
          50% {
            transform: translate(-20px, 20px) rotate(180deg);
          }
          75% {
            transform: translate(20px, 30px) rotate(270deg);
          }
        }
      `}</style>
      <FundHero />
      <ProcessSection />
      <DetailSection />
      <ConsultFormWizard />
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import ConsultCTA from "@/components/ConsultCTA";
import LocalVideoBackground from "@/components/LocalVideoBackground";
import CountUpNumber from "@/components/CountUpNumber";
import { HERO_VIDEOS } from "@/config/hero-videos";

/* ──────────────────────────────────────────────
   1. Hero Section – About Us
   ────────────────────────────────────────────── */
function CompanyHero() {
  return (
    <section className="relative w-full min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] flex items-center justify-center px-4 md:px-10 pt-[130px] md:pt-[180px] pb-[60px] md:pb-[80px] lg:pb-[100px] overflow-hidden">
      <LocalVideoBackground src={HERO_VIDEOS.about} />
      {/* 타이틀 */}
      <div className="relative z-[2] max-w-[1200px] mx-auto text-center animate-fade-up">
        <span className="block mx-auto w-fit px-[30px] py-[10px] bg-[rgba(212,175,55,0.2)] border border-[rgba(212,175,55,0.4)] rounded-[50px] text-gold text-[12px] md:text-sm font-bold tracking-[2px] uppercase backdrop-blur-[10px] mb-[30px]">
          About Us
        </span>
        <div className="block mx-auto w-fit bg-[rgba(212,175,55,0.12)] backdrop-blur-[10px] border border-[rgba(212,175,55,0.3)] rounded-2xl px-6 md:px-10 py-6 md:py-8 shadow-[0_0_40px_rgba(212,175,55,0.08)]">
          <h1 className="text-[28px] md:text-[clamp(32px,5vw,56px)] font-black text-[#e0f2f1] mb-[20px] leading-[1.2] tracking-[-1px]">
            <span className="text-white font-black inline-block [text-shadow:0_2px_12px_rgba(0,0,0,0.8),0_0_30px_rgba(0,0,0,0.5)]">
              피에스킴컨설팅
            </span>
          </h1>
          <p className="text-[14px] md:text-[clamp(16px,2.5vw,24px)] text-[rgba(224,242,241,0.95)] leading-[1.6] max-w-[800px] mx-auto font-normal [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
            정책자금 경영컨설팅 전문 파트너
            <br />
            성공적인 자금조달을 위한 완벽한 준비,
            <br className="md:hidden" /> 심사통과율{" "}
            <CountUpNumber end={97} suffix="%" />
          </p>
        </div>
        <p className="text-[9px] md:text-xs text-[rgba(224,242,241,0.7)] mt-5 leading-[2] whitespace-nowrap">
          ※ 피에스킴컨설팅은 정책자금 서류작성을 대행하지 않습니다.
          <br />※ 기업평가를 하지 않습니다.
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
   2. System Section – Our System (4카드)
   ────────────────────────────────────────────── */
function SystemSection() {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 스크롤 애니메이션
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              const el = entry.target as HTMLElement;
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
            }, index * 100);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    const cards =
      cardsRef.current?.querySelectorAll<HTMLElement>(".system-card");
    cards?.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      card.style.transition = "all 0.6s ease";
      observer.observe(card);
    });

    // 마우스 추적 (데스크톱)
    if (window.innerWidth > 768) {
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
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-full h-full fill-gold drop-shadow-[0_0_6px_rgba(212,175,55,0.5)]"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
        </svg>
      ),
      title: "전담 컨설팅 지원",
      text: "전문가 1:1\n맞춤 자금조달 준비",
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-full h-full fill-gold drop-shadow-[0_0_6px_rgba(212,175,55,0.5)]"
        >
          <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
        </svg>
      ),
      title: "체계적 자금조달 프로세스",
      text: "단계별 정책자금 준비\n철저한 일정 관리",
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-full h-full fill-gold drop-shadow-[0_0_6px_rgba(212,175,55,0.5)]"
        >
          <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
        </svg>
      ),
      title: "완벽한 심사통과 준비",
      text: "꼼꼼한 자금조달 전략\n철저한 서류 검토",
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-full h-full fill-gold drop-shadow-[0_0_6px_rgba(212,175,55,0.5)]"
        >
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
        </svg>
      ),
      title: "투명한 컨설팅 과정",
      text: "모든 자금조달 단계\n공개 운영",
    },
  ];

  return (
    <section className="relative w-full py-[50px] md:py-[80px] lg:py-[100px] px-4 md:px-10 bg-navy overflow-hidden">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_50%_50%,#004e92_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-[2] max-w-[1200px] mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-10 md:mb-[60px] animate-fade-up">
          <span className="inline-block px-6 py-2 bg-[rgba(212,175,55,0.2)] border border-[rgba(212,175,55,0.4)] rounded-[30px] text-gold text-sm font-semibold tracking-[1px] uppercase mb-5">
            Our System
          </span>
          <h2 className="text-[clamp(28px,4vw,48px)] font-black text-white mb-5 leading-[1.2]">
            <span className="text-white font-black [text-shadow:0_2px_8px_rgba(255,255,255,0.3)]">
              피에스킴컨설팅 준비 시스템
            </span>
            이란?
          </h2>
          <p className="text-[15px] md:text-lg leading-[1.7] md:leading-[1.8] text-[rgba(224,242,241,0.85)] max-w-[800px] mx-auto md:text-center text-left px-2.5 md:px-0">
            경영컨설팅 전문가가 설계한
            <br className="hidden md:block" /> 피에스킴컨설팅만의
            <br className="hidden md:block" /> 체계적 정책자금 준비 시스템으로,
            <br className="hidden md:block" /> 대표님이 직접 신청하실 때
            <br className="hidden md:block" /> 최상의 상태로 자금조달을 진행할
            수 있도록
            <br className="hidden md:block" /> 완벽하게 준비합니다.
          </p>
          <p className="text-[9px] md:text-xs text-[rgba(224,242,241,0.6)] mt-6 leading-[1.6] text-center">
            ※ 피에스킴컨설팅은 정책자금 서류작성을 대행하지 않습니다.
            <br />※ 기업평가를 하지 않습니다.
          </p>
        </div>

        {/* 카드 그리드 */}
        <div
          ref={cardsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-5 mt-10 md:mt-[60px]"
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="system-card relative p-4 md:p-7 bg-[rgba(212,175,55,0.15)] backdrop-blur-[20px] border border-[rgba(212,175,55,0.3)] rounded-[20px] text-center transition-all duration-400 overflow-hidden
                shadow-[0_0_30px_rgba(212,175,55,0.2),0_8px_32px_rgba(212,175,55,0.15),inset_0_1px_0_rgba(212,175,55,0.1)]
                hover:translate-y-[-5px] hover:bg-[rgba(212,175,55,0.25)] hover:border-[rgba(212,175,55,0.8)]
                hover:shadow-[0_0_60px_rgba(212,175,55,0.6),0_0_100px_rgba(212,175,55,0.3),0_12px_40px_rgba(212,175,55,0.3),inset_0_0_40px_rgba(212,175,55,0.1)]
                min-h-[105px] md:min-h-0 flex flex-col justify-center"
            >
              {/* 스포트라이트 오버레이 */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_180px_at_var(--mx,50%)_var(--my,50%),rgba(255,255,255,0.3),rgba(30,144,255,0.25)_30%,rgba(0,78,146,0.15)_50%,transparent_100%)] opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[1] blur-[8px]" />
              {/* 탑 네온 라인 */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[linear-gradient(90deg,transparent,#d4af37,transparent)] opacity-0 hover:opacity-100 transition-opacity duration-300 z-[2]" />

              <div className="w-7 h-7 md:w-[55px] md:h-[55px] mx-auto mb-1.5 md:mb-3 p-[7px] md:p-3.5 bg-[rgba(212,175,55,0.15)] rounded-[15px] flex items-center justify-center transition-all duration-300 relative z-[3]">
                {f.icon}
              </div>
              <h3 className="text-[14px] md:text-[22px] font-extrabold text-white mb-1.5 md:mb-2.5 whitespace-nowrap relative z-[3] overflow-hidden text-ellipsis">
                {f.title}
              </h3>
              <p className="text-[10.5px] md:text-[15px] text-[rgba(224,242,241,0.75)] leading-[1.5] md:leading-[1.6] relative z-[3] whitespace-nowrap md:whitespace-normal">
                {f.text.split("\n").map((line, j) => (
                  <span key={j}>
                    {line}
                    {j < f.text.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   3. Category Section – 사업분야 (4카드)
   ────────────────────────────────────────────── */
function CategorySection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const categories = [
    {
      title: "정책자금 역량 진단",
      desc: "대표님이 직접 신청하시기 전, 기업의 자금조달 잠재력과 경쟁력을 면밀히 분석하여 최적의 정부지원 정책자금을 선별합니다.",
      tags: ["역량 진단", "정책자금 적합성 진단", "경쟁력 분석"],
    },
    {
      title: "맞춤형 전략 수립",
      desc: "정책자금 신청 전 준비 단계에서 최적화된 자금조달 포트폴리오를 설계하고, 대표님이 직접 진행하실 맞춤형 경영컨설팅 전략을 수립합니다.",
      tags: ["정부지원 공고 분석", "자금조달 포트폴리오", "전략 사전 설계"],
    },
    {
      title: "사전 준비 완성도 극대화",
      desc: "대표님이 직접 작성하실 때 활용할 정책자금 사업계획 전략과 심사통과 필수 증빙 구성을 사전에 철저히 준비합니다.",
      tags: ["사업계획 전략", "심사 증빙 설계", "준비 완성도 강화"],
    },
    {
      title: "대표님 실행을 위한 지속 지원",
      desc: "대표님이 직접 진행하시는 정책자금 협약부터 정산까지 전 과정에서, 추가 정부지원 사업 발굴로 지속적 자금조달을 함께합니다.",
      tags: ["자금조달 가이드", "정산 방향 안내", "정부지원 연계"],
    },
  ];

  const navLabels = ["역량진단", "전략수립", "사전준비", "실행지원"];

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 데스크톱 마우스 추적
    if (window.innerWidth > 768) {
      const cards = gridRef.current?.querySelectorAll<HTMLElement>(".biz-card");
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
    }

    // 모바일 스크롤 감지
    const grid = gridRef.current;
    if (window.innerWidth <= 768 && grid) {
      const onScroll = () => {
        const cards = grid.querySelectorAll<HTMLElement>(".biz-card");
        const containerWidth = grid.offsetWidth;
        const scrollLeft = grid.scrollLeft;
        const center = scrollLeft + containerWidth / 2;
        let closest = 0;
        cards.forEach((card, idx) => {
          const cardCenter = card.offsetLeft + card.offsetWidth / 2;
          if (
            Math.abs(cardCenter - center) <
            Math.abs(
              (cards[closest]?.offsetLeft || 0) +
                (cards[closest]?.offsetWidth || 0) / 2 -
                center,
            )
          ) {
            closest = idx;
          }
        });
        setActiveIndex(closest);
      };
      grid.addEventListener("scroll", onScroll);
      return () => grid.removeEventListener("scroll", onScroll);
    }
  }, []);

  const scrollToCard = (index: number) => {
    const grid = gridRef.current;
    const cards = grid?.querySelectorAll<HTMLElement>(".biz-card");
    if (!grid || !cards?.[index]) return;
    const card = cards[index];
    const scrollPos =
      card.offsetLeft - (grid.offsetWidth - card.offsetWidth) / 2;
    grid.scrollTo({ left: scrollPos, behavior: "smooth" });
    setActiveIndex(index);
  };

  return (
    <section className="relative w-full py-[60px] bg-navy overflow-hidden">
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(0,78,146,0.15)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(30,144,255,0.12)_0%,transparent_50%),radial-gradient(circle_at_50%_20%,rgba(0,4,40,0.08)_0%,transparent_40%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(15,21,53,0.3)_100%)] pointer-events-none z-0" />

      <div className="relative z-[1] max-w-[1200px] mx-auto px-5">
        {/* 타이틀 */}
        <div className="text-center mb-10">
          <h2 className="text-[28px] md:text-[36px] font-bold text-white mb-4 [text-shadow:0_2px_8px_rgba(255,255,255,0.3)]">
            정책자금 역량강화 서비스
          </h2>
          <p className="text-lg text-[rgba(224,242,241,0.8)] [text-shadow:0_0_10px_rgba(0,0,0,0.3)]">
            피에스킴컨설팅이 제공하는 정책자금 경영컨설팅 솔루션
          </p>
          <p className="text-[9px] md:text-xs text-[rgba(224,242,241,0.6)] mt-6 leading-[1.6]">
            ※ 피에스킴컨설팅은 정책자금 서류작성을 대행하지 않습니다.
            <br />※ 기업평가를 하지 않습니다.
          </p>
        </div>

        {/* 모바일 네비게이션 블록 */}
        <div className="grid grid-cols-2 gap-3 md:hidden mb-10">
          {navLabels.map((label, i) => (
            <button
              key={i}
              onClick={() => scrollToCard(i)}
              className={`bg-[rgba(212,175,55,0.15)] backdrop-blur-[10px] border rounded-xl p-4 text-center text-sm font-semibold transition-all duration-300
                ${
                  activeIndex === i
                    ? "bg-[rgba(212,175,55,0.2)] text-gold border-[rgba(212,175,55,0.8)] font-bold shadow-[0_0_20px_rgba(212,175,55,0.5)]"
                    : "text-[rgba(224,242,241,0.7)] border-[rgba(212,175,55,0.3)] hover:bg-[rgba(212,175,55,0.25)] hover:-translate-y-0.5"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 카드 그리드 (PC: 2x2, 모바일: 가로 스크롤) */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 gap-10 mt-[60px]
            max-md:flex max-md:gap-4 max-md:mt-0 max-md:px-0 max-md:pt-5 max-md:overflow-x-auto max-md:snap-x max-md:snap-mandatory max-md:scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat, i) => (
            <div
              key={i}
              className="biz-card relative bg-[rgba(212,175,55,0.15)] backdrop-blur-[20px] border border-[rgba(212,175,55,0.3)] rounded-2xl p-6 md:p-10 transition-all duration-400 overflow-hidden
                shadow-[0_0_30px_rgba(212,175,55,0.2),0_8px_32px_rgba(212,175,55,0.15),inset_0_1px_0_rgba(212,175,55,0.1)]
                hover:border-[rgba(212,175,55,0.8)] hover:-translate-y-[5px] hover:bg-[rgba(212,175,55,0.25)]
                hover:shadow-[0_0_60px_rgba(212,175,55,0.6),0_0_100px_rgba(212,175,55,0.3),0_12px_40px_rgba(212,175,55,0.3),inset_0_0_40px_rgba(212,175,55,0.1)]
                max-md:flex-[0_0_calc(100vw-56px)] max-md:max-w-[320px] max-md:snap-center max-md:snap-stop-always max-md:my-2.5"
            >
              {/* 스포트라이트 */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_180px_at_var(--mx,50%)_var(--my,50%),rgba(255,255,255,0.3),rgba(30,144,255,0.25)_30%,rgba(0,78,146,0.15)_50%,transparent_100%)] opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[2] blur-[8px]" />
              {/* 워터마크 */}
              <div className="absolute bottom-[-20px] right-[-20px] w-[120px] h-[120px] md:w-[120px] max-md:w-[80px] max-md:h-[80px] bg-[radial-gradient(circle,rgba(30,144,255,0.15)_0%,transparent_70%)] opacity-30 transition-all duration-300 z-[1]" />

              <h4 className="text-[18px] md:text-2xl font-semibold text-white mb-3 md:mb-4 [text-shadow:0_2px_8px_rgba(0,0,0,0.3)] relative z-[3]">
                {cat.title}
              </h4>
              <p className="text-sm md:text-base text-[rgba(224,242,241,0.85)] leading-[1.6] md:leading-[1.8] mb-4 md:mb-5 relative z-[3]">
                {cat.desc}
              </p>
              <div className="flex flex-wrap gap-1.5 md:gap-2 relative z-[3]">
                {cat.tags.map((tag, j) => (
                  <span
                    key={j}
                    className="bg-[rgba(212,175,55,0.15)] text-gold px-2 md:px-4 py-0.5 md:py-1.5 rounded-[20px] text-[8px] md:text-sm font-medium border border-[rgba(212,175,55,0.3)] backdrop-blur-[5px] [text-shadow:0_0_5px_rgba(212,175,55,0.5)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 모바일 스크롤 인디케이터 */}
        <div className="flex md:hidden justify-center gap-2 mt-8">
          {categories.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToCard(i)}
              className={`h-2 rounded transition-all duration-300 cursor-pointer
                ${
                  activeIndex === i
                    ? "w-6 bg-gradient-to-r from-gold-dark to-gold shadow-[0_0_15px_rgba(212,175,55,0.8)]"
                    : "w-2 bg-[rgba(224,242,241,0.2)] hover:bg-[rgba(212,175,55,0.5)] hover:shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                }`}
              aria-label={`카드 ${i + 1}로 이동`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   4. CEO Section – 대표 소개
   ────────────────────────────────────────────── */
function CeoSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth <= 768) return;
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section className="relative w-full py-10 md:py-[60px] bg-navy overflow-hidden">
      {/* 배경 골드 파티클 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(212,175,55,0.12)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(212,175,55,0.10)_0%,transparent_50%),radial-gradient(circle_at_50%_20%,rgba(212,175,55,0.08)_0%,transparent_40%)] pointer-events-none z-0" />

      <div className="relative z-[1] max-w-[1200px] mx-auto px-5">
        {/* 타이틀 */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-[28px] md:text-[36px] font-bold text-white mb-4 [text-shadow:0_2px_8px_rgba(255,255,255,0.3)]">
            대표 소개
          </h2>
          <p className="text-lg text-[rgba(224,242,241,0.8)]">
            정책자금 자금조달 경영컨설팅 전문, 피에스킴컨설팅
          </p>
          <p className="text-[9px] md:text-xs text-[rgba(224,242,241,0.6)] mt-6 leading-[1.6]">
            ※ 피에스킴컨설팅은 정책자금 서류작성을 대행하지 않습니다.
            <br />※ 기업평가를 하지 않습니다.
          </p>
        </div>

        {/* CEO 카드 - 가로 레이아웃 */}
        <div
          ref={containerRef}
          className="relative bg-[rgba(212,175,55,0.12)] backdrop-blur-[20px] p-8 md:p-10 rounded-[20px]
            shadow-[0_8px_32px_rgba(212,175,55,0.15),0_0_60px_rgba(212,175,55,0.1),inset_0_0_40px_rgba(212,175,55,0.05)]
            border border-[rgba(212,175,55,0.3)]
            flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-[50px] overflow-hidden"
        >
          {/* 스포트라이트 */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_200px_at_var(--mx,50%)_var(--my,50%),rgba(232,212,168,0.4),rgba(212,175,55,0.3)_30%,rgba(180,135,63,0.15)_50%,transparent_100%)] opacity-0 hover:opacity-100 transition-opacity duration-400 pointer-events-none z-[1] blur-[10px]" />
          {/* 네온 글로우 */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_600px_400px_at_50%_50%,rgba(212,175,55,0.12),rgba(212,175,55,0.06)_40%,transparent_70%)] pointer-events-none z-0 animate-pulse" />

          {/* 왼쪽: 사진 */}
          <div className="flex-shrink-0 text-center relative z-[2] w-full max-w-[350px] md:w-auto md:max-w-none md:flex-[0_0_320px]">
            <div
              className="relative inline-block bg-white p-5 rounded-2xl border-[3px] border-[rgba(212,175,55,0.5)]
              shadow-[0_0_30px_rgba(212,175,55,0.3),0_0_60px_rgba(212,175,55,0.15),0_4px_20px_rgba(0,0,0,0.1)]
              transition-all duration-400 hover:shadow-[0_0_40px_rgba(212,175,55,0.5),0_0_80px_rgba(212,175,55,0.3),0_8px_30px_rgba(0,0,0,0.15)] hover:-translate-y-1 overflow-visible"
            >
              {/* 리본 */}
              <span className="absolute top-[15px] right-[-25px] bg-gradient-to-br from-gold-dark to-gold text-white px-[30px] py-[5px] text-xs font-semibold rotate-45 shadow-[0_2px_15px_rgba(212,175,55,0.5)] z-10">
                심사관
              </span>
              {/* 사진 영역 */}
              <div className="w-[180px] h-[240px] md:w-[280px] md:h-[360px] rounded-xl overflow-hidden bg-[#f8fafc] shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
                <img
                  src="/images/ceo-profile.png"
                  alt="피에스킴컨설팅 김판수 기업심사관"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
            {/* 이름 / 직함 */}
            <div className="mt-5">
              <div className="text-[22px] md:text-[28px] font-bold text-white tracking-[2px] [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
                김 판 수
              </div>
              <div className="text-[15px] md:text-lg text-gold font-semibold [text-shadow:0_0_10px_rgba(212,175,55,0.6)] animate-pulse">
                기업심사관
              </div>
            </div>
          </div>

          {/* 오른쪽: 인사말 */}
          <div className="flex-1 relative z-[2]">
            <h3 className="text-[20px] md:text-[28px] font-bold text-white mb-[30px] leading-[1.4] relative inline-block break-keep">
              대표님의 잠재력을 실체화하고
              <br />
              <span className="text-white font-extrabold [text-shadow:0_2px_8px_rgba(255,255,255,0.4)]">
                자금조달을 극대화
              </span>
              하는 파트너가 되겠습니다
              {/* 골드 라인 */}
              <span className="absolute bottom-[-12px] left-0 w-[60px] h-[3px] bg-gradient-to-r from-gold-dark to-gold rounded-sm shadow-[0_0_15px_rgba(212,175,55,0.6)]" />
            </h3>

            <div className="mt-8 md:mt-0">
              <p className="text-[15px] md:text-[18px] text-[rgba(224,242,241,0.95)] leading-[1.8] font-medium mb-7 break-keep">
                안녕하십니까, 피에스킴컨설팅 기업심사관 김판수입니다.
              </p>
              <p className="text-[15px] md:text-[17px] text-[rgba(224,242,241,0.9)] leading-[1.8] mb-6 break-keep">
                정책자금 확보는{" "}
                <span className="text-gold font-bold">
                  경영컨설팅 전문가와의 협업이 핵심
                </span>
                입니다.
                <br className="hidden md:inline" /> 저희는 정책자금 자금조달
                전문가로서, 대표님의 자금조달 구조를 체계적으로 분석하고
                <br className="hidden md:inline" /> 최적의 정부지원 자금 확보
                방안을 제시하여 실질적인 성과를 창출합니다.
              </p>
              <p className="text-[15px] md:text-[17px] text-[rgba(224,242,241,0.9)] leading-[1.8] mb-6 break-keep">
                많은 대표님들이 전문 지원 없이 소중한 기회를 놓치고 있습니다.
                <br className="hidden md:inline" />{" "}
                <span className="text-gold font-bold">
                  대표님이 최선의 정책자금 전략으로 기업을 성장시킬 수 있도록
                  함께하겠습니다.
                </span>
              </p>
              <p className="text-[15px] md:text-[17px] text-[rgba(224,242,241,0.9)] leading-[1.8] break-keep">
                귀사의 성장이 저희의 보람입니다.
              </p>
            </div>
          </div>
        </div>

        {/* 자격사항 */}
        <div className="mt-8 max-w-[800px] mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
            {[
              "기업심사관전문가",
              "대표자 성장 지원",
              "정책자금 극대화 전략",
            ].map((q, i) => (
              <div
                key={i}
                className="bg-[rgba(212,175,55,0.15)] border border-[rgba(212,175,55,0.4)] rounded-lg py-3 md:py-3.5 px-4 md:px-5 text-[11px] md:text-sm text-gold text-center font-medium backdrop-blur-[10px] transition-all duration-300
                    hover:bg-[rgba(212,175,55,0.25)] hover:border-gold hover:shadow-[0_0_30px_rgba(212,175,55,0.5),0_0_60px_rgba(212,175,55,0.3),inset_0_0_25px_rgba(212,175,55,0.15)] hover:-translate-y-0.5"
              >
                <span className="text-gold font-bold mr-2">✓</span>
                {q}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Company Page
   ────────────────────────────────────────────── */
export default function CompanyClient() {
  return (
    <>
      <CompanyHero />
      <SystemSection />
      <CategorySection />
      <CeoSection />
      <ConsultCTA
        title="기업심사관전담팀과 시작하세요"
        subtitle="피에스킴컨설팅이 1:1 무료 자금심사로 함께합니다"
      />
    </>
  );
}

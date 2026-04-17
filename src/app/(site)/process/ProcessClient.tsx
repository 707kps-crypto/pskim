"use client";

import { useEffect, useRef, useState } from "react";
import ConsultCTA from "@/components/ConsultCTA";
import LocalVideoBackground from "@/components/LocalVideoBackground";
import CountUpNumber from "@/components/CountUpNumber";
import { HERO_VIDEOS } from "@/config/hero-videos";

/* ──────────────────────────────────────────────
   1. Hero Section
   ────────────────────────────────────────────── */
function ProcessHero() {
  return (
    <section className="relative pt-[130px] md:pt-[180px] pb-[35px] md:pb-[50px] lg:pb-[60px] px-5 overflow-hidden">
      <LocalVideoBackground src={HERO_VIDEOS.process} />
      <div className="max-w-[1200px] mx-auto relative z-[1]">
        <div className="text-center">
          <h2
            className="text-[26px] md:text-[40px] lg:text-[46px] font-bold text-light mb-4 md:mb-6 leading-[1.3] tracking-[-0.5px] break-keep"
            style={{
              textShadow:
                "2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.3)",
            }}
          >
            정책자금 경영컨설팅으로
            <br /> 만드는 확실한 자금조달
          </h2>
          <div className="block mx-auto w-fit bg-[rgba(212,175,55,0.12)] backdrop-blur-[10px] border border-[rgba(212,175,55,0.3)] rounded-2xl px-5 md:px-10 py-5 md:py-7 shadow-[0_0_40px_rgba(212,175,55,0.08)]">
            <p
              className="text-[15px] md:text-[20px] lg:text-[22px] text-white/90 leading-[1.6] md:leading-[1.6] break-keep"
              style={{
                textShadow:
                  "2px 2px 6px rgba(0,0,0,0.7), 0 0 10px rgba(212,175,55,0.2)",
              }}
            >
              <span className="text-white font-bold">성장 전문가</span>
              와 함께
              <br />
              정책자금 자금조달 전략으로 심사통과율 97% 달성
            </p>
          </div>
          <p
            className="text-[9px] md:text-[13px] text-body/70 mt-5 leading-[1.6]"
            style={{ textShadow: "2px 2px 6px rgba(0,0,0,0.7)" }}
          >
            ※ 피에스킴컨설팅은 정책자금 서류작성을 대행하지 않습니다.
            <br />※ 기업평가를 하지 않습니다.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   2. Service Features (6카드)
   ────────────────────────────────────────────── */
function ServiceFeatures() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const navLabels = [
    "역량 분석",
    "전문가 매칭",
    "신속 진단",
    "맞춤 전략",
    "전과정 지원",
    "사후 관리",
  ];

  const features = [
    {
      icon: (
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      ),
      title: "정밀한 역량 진단",
      desc: "경영컨설팅 전문가의 체계적 분석으로\n정책자금 심사통과 적합도 극대화",
      items: [
        "대표자 역량 정밀 분석",
        "재무 건전성 진단",
        "자금조달 가능성 분석",
      ],
    },
    {
      icon: (
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
      title: "전문가 매칭 시스템",
      desc: "업종별 경영컨설팅 전문가가\n직접 진행하는 자금조달 지원",
      items: ["업종별 맞춤 컨설턴트", "1:1 전담 지원", "실시간 진행 공유"],
    },
    {
      icon: (
        <svg
          width="36"
          height="36"
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
      title: "신속한 상담 분석",
      desc: "빠른 역량 진단으로\n적기 정책자금 조달 지원",
      items: ["신속한 상담 진행", "즉시 피드백 제공", "효율적 프로세스"],
    },
    {
      icon: (
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      title: "맞춤형 자금조달 전략",
      desc: "대표님 맞춤형\n정책자금 경영컨설팅 설계",
      items: [
        "업종별 정부지원 매칭",
        "정책자금 발굴 지원",
        "자금조달 한도 최적화",
      ],
    },
    {
      icon: (
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: "전과정 밀착 지원",
      desc: "정책자금 신청부터 심사통과까지\n전 과정 밀착 지원",
      items: ["서류 정보 완벽 제공", "사업계획 전략 설계", "심사 대비 코칭"],
    },
    {
      icon: (
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      title: "지속적 사후 관리",
      desc: "심사통과 후에도 이어지는\n자금조달 파트너십",
      items: [
        "추가 정책자금 연계",
        "정기 기업 성장 분석",
        "지속 자금조달 지원",
      ],
    },
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 데스크톱 마우스 추적
    if (window.innerWidth > 768) {
      const cards = gridRef.current?.querySelectorAll<HTMLElement>(".svc-card");
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

    // 모바일 스크롤
    const grid = gridRef.current;
    if (window.innerWidth <= 768 && grid) {
      const onScroll = () => {
        const cards = grid.querySelectorAll<HTMLElement>(".svc-card");
        const center = grid.scrollLeft + grid.offsetWidth / 2;
        let closest = 0;
        cards.forEach((card, idx) => {
          const cc = card.offsetLeft + card.offsetWidth / 2;
          if (
            Math.abs(cc - center) <
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
    const cards = grid?.querySelectorAll<HTMLElement>(".svc-card");
    if (!grid || !cards?.[index]) return;
    const card = cards[index];
    grid.scrollTo({
      left: card.offsetLeft - (grid.offsetWidth - card.offsetWidth) / 2,
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  return (
    <section className="relative w-full py-10 md:py-[50px] bg-navy overflow-hidden z-[2]">
      {/* 배경 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(212,175,55,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(212,175,55,0.06)_0%,transparent_50%),radial-gradient(circle_at_50%_20%,rgba(212,175,55,0.04)_0%,transparent_40%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(15,23,46,0.3)_100%)] pointer-events-none z-0" />

      <div className="relative z-[1] max-w-[1200px] mx-auto px-0 md:px-5">
        {/* 모바일 네비 */}
        <div className="grid grid-cols-3 gap-1.5 px-4 mb-6 md:hidden">
          {navLabels.map((label, i) => (
            <button
              key={i}
              onClick={() => scrollToCard(i)}
              className={`backdrop-blur-[10px] border rounded-[10px] py-2.5 px-1.5 text-center text-[11px] md:text-xs font-semibold transition-all duration-300
                ${
                  activeIndex === i
                    ? "bg-[rgba(212,175,55,0.15)] text-gold border-gold font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                    : "bg-[rgba(30,60,120,0.2)] text-body border-[rgba(212,175,55,0.3)]"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 카드 그리드 */}
        <div
          ref={gridRef}
          className="grid grid-cols-3 gap-[30px] px-5
            max-md:flex max-md:gap-3.5 max-md:px-4 max-md:pt-4 max-md:overflow-x-auto max-md:snap-x max-md:snap-mandatory max-md:scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              className={`svc-card relative bg-[rgba(30,60,120,0.15)] backdrop-blur-[20px] border border-[rgba(212,175,55,0.3)] rounded-2xl md:rounded-[16px] p-6 md:p-[35px_28px] text-center transition-all duration-300 overflow-hidden
                shadow-[0_8px_32px_rgba(139,111,63,0.3),0_0_60px_rgba(212,175,55,0.08)]
                hover:-translate-y-2 hover:border-[rgba(212,175,55,0.6)] hover:bg-[rgba(30,60,120,0.25)]
                hover:shadow-[0_0_50px_rgba(212,175,55,0.6),0_10px_30px_rgba(139,111,63,0.4)]
                max-md:flex-[0_0_calc(100vw-48px)] max-md:max-w-[320px] max-md:my-2 max-md:snap-center max-md:snap-stop-always`}
            >
              {/* 좌측 골드 바 (PC) */}
              <div className="hidden md:block absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gold-dark to-gold shadow-[0_0_10px_rgba(212,175,55,0.8)] transition-all duration-300 group-hover:w-2" />
              {/* 스포트라이트 */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_200px_at_var(--mx,50%)_var(--my,50%),rgba(232,212,168,0.4),rgba(212,175,55,0.3)_30%,rgba(180,135,63,0.15)_50%,transparent_100%)] opacity-0 hover:opacity-100 transition-opacity duration-400 pointer-events-none z-[1] blur-[8px]" />

              {/* 아이콘 */}
              <div className="w-[70px] h-[70px] mx-auto mb-5 bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.3)] rounded-full flex items-center justify-center text-gold transition-all duration-300 relative z-[2] shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                {f.icon}
              </div>
              <h3 className="text-[22px] font-semibold text-white mb-3.5 [text-shadow:0_2px_8px_rgba(0,0,0,0.3)] relative z-[2]">
                {f.title}
              </h3>
              <p className="text-base text-white/85 leading-[1.5] mb-4.5 relative z-[2]">
                {f.desc.split("\n").map((line, j) => (
                  <span key={j}>
                    {line}
                    {j === 0 && <br />}
                  </span>
                ))}
              </p>
              <ul className="inline-block text-left relative z-[2]">
                {f.items.map((item, j) => (
                  <li
                    key={j}
                    className="text-sm text-white/80 pl-6 relative mb-2 last:mb-0 leading-[1.4]"
                  >
                    <span className="absolute left-0 text-gold font-bold text-sm [text-shadow:0_0_5px_rgba(212,175,55,0.8)]">
                      ▸
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 모바일 인디케이터 */}
        <div className="flex md:hidden justify-center gap-1.5 mt-6">
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToCard(i)}
              className={`h-1.5 rounded transition-all duration-300
                ${
                  activeIndex === i
                    ? "w-5 bg-gradient-to-r from-gold-dark to-gold shadow-[0_0_10px_rgba(212,175,55,0.6)]"
                    : "w-1.5 bg-[rgba(212,175,55,0.2)]"
                }`}
              aria-label={`카드 ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   3. FAQ Section (6개 아코디언)
   ────────────────────────────────────────────── */
function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "피에스킴컨설팅만의 차별화된 경쟁력은 무엇인가요?",
      a: "정책자금 심사통과 프로세스를 완벽히 이해한 경영컨설팅 전문가들이 대표님 맞춤형 솔루션을 제공합니다. 단순 서류작업이 아닌, 기업의 숨은 가치를 발굴하고 자금조달 스토리를 설계하여 심사위원을 설득하는 전략적 접근법을 구사합니다. 대표님이 직접 진행하시기 전 사전 역량을 강화하여 심사통과율 97%의 높은 성공률을 달성하고 있습니다.",
    },
    {
      q: "정책자금 사전 준비 과정은 어떻게 진행되나요?",
      a: "단계별 맞춤 경영컨설팅 시스템을 운영합니다. 먼저 기업 현황 분석으로 자금조달 강점과 개선점을 파악합니다. 다음으로 최적의 정부지원 정책자금을 설계하여 제안드립니다. 이후 서류 정보 제공부터 심사통과 대비까지 세심한 코칭을 진행하며, 자금 확보 이후에도 연계 정부지원 사업과 성장전략을 함께 고민합니다.",
    },
    {
      q: "지원 가능한 정부지원사업 범위가 어떻게 되나요?",
      a: "정부 및 지자체가 운영하는 전 분야 정부지원 사업을 커버합니다. 중소기업 창업지원금, 운영자금, 시설투자, 기술개발(R&D), 해외진출, 각종 인증취득 등 기업 성장 단계 전반의 정책자금을 지원합니다. 특히 잘 알려지지 않은 틈새 정부지원 사업까지 발굴하여 자금조달 가능성을 극대화해드립니다.",
    },
    {
      q: "서비스 이용 비용 체계는 어떻게 구성되어 있나요?",
      a: "기초 상담과 역량 진단은 전액 무료로 진행됩니다. 본격적인 경영컨설팅 수수료는 자금조달 프로젝트의 성격과 난이도를 고려하여 산정되며, 직접 방문상담을 통해 맞춤형 견적을 제공해드립니다. 명확하고 공정한 가격 정책으로 예산 계획을 수립하실 수 있도록 돕겠습니다.",
    },
    {
      q: "접수부터 최종 지급까지 소요 기간은 어느 정도인가요?",
      a: "정책자금 유형별로 차이가 있으나 긴급운전자금은 3-4주 내, 일반 정책자금은 2-3개월 수준입니다. 피에스킴컨설팅은 빠른 처리보다 최대 자금조달 금액, 유리한 금리조건, 장기 상환조건 확보에 집중합니다. 철저한 심사통과 준비를 통해 대표님에게 실질적 도움이 되는 최상의 자금확보 결과를 만들어냅니다.",
    },
    {
      q: "자금 수령 이후에도 지속적인 관리를 받을 수 있나요?",
      a: "물론입니다. 피에스킴컨설팅은 장기적 자금조달 성장 파트너를 지향합니다. 정책자금 활용 모니터링, 후속 정부지원 사업 추천, 추가 자금조달 지원 등을 종합 제공합니다. 단발성 컨설팅이 아닌 지속가능한 기업 성장 기반을 함께 구축해나가겠습니다.",
    },
  ];

  return (
    <section className="relative w-full py-[25px] md:py-[30px] lg:py-10 bg-navy">
      <div className="max-w-[1000px] mx-auto px-4 md:px-5 relative z-[1]">
        {/* 헤더 */}
        <div className="text-center mb-6 md:mb-[30px]">
          <h2 className="text-[26px] md:text-[38px] font-bold text-light mb-4 relative inline-block">
            자주 묻는 질문
            <span className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-20 h-[3px] bg-[linear-gradient(90deg,transparent,#d4af37,transparent)] shadow-[0_0_10px_rgba(212,175,55,0.6)]" />
          </h2>
          <p className="text-[15px] md:text-lg text-body leading-[1.5] mt-4">
            피에스킴컨설팅의 정책자금 성장 지원 서비스에 관한 모든 궁금증을
            풀어드립니다
          </p>
          <p className="text-[9px] md:text-[13px] text-body/60 mt-4 leading-[1.6]">
            ※ 피에스킴컨설팅은 정책자금 서류작성을 대행하지 않습니다.
            <br className="md:hidden" /> ※ 기업평가를 하지 않습니다.
          </p>
        </div>

        {/* FAQ 리스트 */}
        <div className="flex flex-col gap-3 md:gap-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`bg-[rgba(30,60,120,0.15)] rounded-xl overflow-hidden transition-all duration-300 border relative
                  shadow-[0_1px_3px_rgba(0,0,0,0.3)]
                  ${
                    isOpen
                      ? "border-gold shadow-[0_10px_40px_rgba(212,175,55,0.25)] bg-[linear-gradient(135deg,rgba(30,60,120,0.15)_0%,rgba(212,175,55,0.05)_100%)]"
                      : "border-[rgba(212,175,55,0.2)] hover:shadow-[0_10px_30px_rgba(212,175,55,0.2)] hover:border-[rgba(212,175,55,0.4)]"
                  }`}
              >
                {/* 탑 골드 라인 */}
                <div
                  className={`absolute top-0 left-0 right-0 bg-[linear-gradient(90deg,transparent,#d4af37,transparent)] transition-all duration-300
                    ${isOpen ? "h-[3px] opacity-100 shadow-[0_0_10px_rgba(212,175,55,0.6)]" : "h-[2px] opacity-0 hover:opacity-100"}`}
                />

                {/* 질문 */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className={`w-full flex items-center justify-between px-4 md:px-[30px] py-5 md:py-[25px] cursor-pointer transition-all duration-300 text-left
                    ${isOpen ? "bg-[rgba(30,60,120,0.2)] border-b border-b-[rgba(212,175,55,0.3)]" : ""}`}
                >
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 md:w-9 md:h-9 rounded-full text-[13px] md:text-base font-bold text-light mr-3 md:mr-4.5 flex-shrink-0 transition-all duration-300
                        ${
                          isOpen
                            ? "bg-gradient-to-br from-gold to-gold-light shadow-[0_0_25px_rgba(212,175,55,0.6)] scale-110"
                            : "bg-gradient-to-br from-gold-dark to-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                        }`}
                    >
                      Q{i + 1}
                    </span>
                    <span className="text-[15px] md:text-lg font-semibold text-light leading-[1.4] pr-4 md:pr-5">
                      {faq.q}
                    </span>
                  </div>
                  {/* 토글 아이콘 */}
                  <div className="w-[18px] md:w-[22px] h-[18px] md:h-[22px] relative flex-shrink-0">
                    <span
                      className={`absolute top-1/2 left-0 w-full h-[2px] rounded-sm -translate-y-1/2 transition-all duration-300
                        ${isOpen ? "bg-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]" : "bg-body hover:bg-gold"}`}
                    />
                    <span
                      className={`absolute left-1/2 top-0 w-[2px] h-full rounded-sm -translate-x-1/2 transition-all duration-300
                        ${isOpen ? "opacity-0" : "bg-body hover:bg-gold"}`}
                    />
                  </div>
                </button>

                {/* 답변 */}
                <div
                  className="overflow-hidden transition-all duration-400"
                  style={{ maxHeight: isOpen ? "500px" : "0px" }}
                >
                  <div className="px-4 md:px-[30px] py-5 md:py-[25px] md:pl-[90px]">
                    <p className="text-[14px] md:text-base text-body leading-[1.7]">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   4. CTA Section
   ────────────────────────────────────────────── */
function CtaSection() {
  const govLogos = [
    {
      name: "서울신용보증재단",
      url: "https://www.seoulshinbo.co.kr",
      img: "https://pub-0e18ef29fe4a4730aadb9253775bd479.r2.dev/logos/seoul-shinbo.webp",
    },
    {
      name: "경기신용보증재단",
      url: "https://www.gcgf.or.kr",
      img: "https://pub-0e18ef29fe4a4730aadb9253775bd479.r2.dev/logos/gyeonggi-gcgf.webp",
    },
    {
      name: "중소벤처기업진흥공단",
      url: "https://www.kosmes.or.kr",
      img: "https://pub-0e18ef29fe4a4730aadb9253775bd479.r2.dev/logos/kosmes.webp",
    },
    {
      name: "신용보증기금",
      url: "https://www.kodit.co.kr",
      img: "https://pub-0e18ef29fe4a4730aadb9253775bd479.r2.dev/logos/kodit.webp",
    },
    {
      name: "기술보증기금",
      url: "https://www.kibo.or.kr",
      img: "https://pub-0e18ef29fe4a4730aadb9253775bd479.r2.dev/logos/kibo.webp",
    },
    {
      name: "소상공인진흥공단",
      url: "https://www.semas.or.kr",
      img: "https://pub-0e18ef29fe4a4730aadb9253775bd479.r2.dev/logos/semas.webp",
    },
  ];

  return (
    <section className="relative w-full py-10 md:py-[50px] bg-navy overflow-hidden">
      {/* 배경 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(212,175,55,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(212,175,55,0.06)_0%,transparent_50%),radial-gradient(circle_at_50%_20%,rgba(212,175,55,0.04)_0%,transparent_40%)] pointer-events-none z-0" />

      <div className="max-w-[1200px] mx-auto px-4 md:px-5 relative z-[1]">
        <div className="text-center text-white max-w-[800px] mx-auto">
          <h2
            className="text-[26px] md:text-[42px] font-bold mb-4 md:mb-4.5 leading-[1.2] md:leading-[1.2] text-light break-keep"
            style={{ textShadow: "0 0 30px rgba(212,175,55,0.2)" }}
          >
            오늘 시작하는{" "}
            <span
              className="text-gold"
              style={{
                textShadow:
                  "0 0 20px rgba(212,175,55,0.8), 0 0 40px rgba(139,111,63,0.5)",
              }}
            >
              정책자금 자금조달 준비
            </span>
            로
            <br /> 기업 성장을 앞당기세요
          </h2>
          <p
            className="text-[15px] md:text-xl text-body leading-[1.5] mb-6 md:mb-[30px] break-keep"
            style={{ textShadow: "0 0 10px rgba(0,0,0,0.3)" }}
          >
            검증된 경영컨설팅 노하우와
            <br className="md:hidden" /> 맞춤형 자금조달 솔루션
            <br /> 피에스킴컨설팅이 함께합니다
          </p>

          {/* 버튼 */}
          <div className="flex gap-3 md:gap-5 justify-center flex-wrap mb-6 md:mb-[30px]">
            <a
              href="#consult-form"
              className="inline-block gold-gradient-bg text-light font-extrabold py-4 px-9 md:py-4.5 md:px-[45px] text-[15px] md:text-lg rounded-lg no-underline transition-all duration-300 relative overflow-hidden
                shadow-[0_4px_20px_rgba(139,111,63,0.4),0_0_40px_rgba(212,175,55,0.3)]
                hover:bg-gradient-to-br hover:from-gold hover:to-gold-light hover:-translate-y-0.5
                hover:shadow-[0_8px_30px_rgba(212,175,55,0.6),0_0_50px_rgba(139,111,63,0.5)]
                [text-shadow:0_1px_2px_rgba(0,0,0,0.2)]"
            >
              무료 상담 신청
            </a>
            <a
              href="tel:010-8008-0186"
              className="inline-block bg-[rgba(30,60,120,0.15)] backdrop-blur-[10px] text-body border border-[rgba(212,175,55,0.3)] py-4 px-9 md:py-4.5 md:px-[45px] text-[15px] md:text-lg font-semibold rounded-lg no-underline transition-all duration-300
                shadow-[0_4px_20px_rgba(212,175,55,0.15)]
                hover:-translate-y-0.5 hover:bg-[rgba(30,60,120,0.25)] hover:border-[rgba(212,175,55,0.5)]
                hover:shadow-[0_8px_30px_rgba(212,175,55,0.3)]"
            >
              상담 전화 연결
            </a>
          </div>

          {/* 성공률 배지 */}
          <div
            className="inline-flex items-center justify-center bg-[rgba(30,60,120,0.15)] backdrop-blur-[15px] border border-[rgba(212,175,55,0.3)] text-body px-5 md:px-6 py-2.5 md:py-3 rounded-[30px] text-[14px] md:text-lg font-bold mt-5
            shadow-[0_0_30px_rgba(212,175,55,0.2),0_4px_20px_rgba(0,0,0,0.3)]
            transition-all duration-300 hover:bg-[rgba(30,60,120,0.25)] hover:border-[rgba(212,175,55,0.5)]
            hover:shadow-[0_0_40px_rgba(212,175,55,0.4),0_8px_25px_rgba(212,175,55,0.3)]"
          >
            <span>정책자금 심사통과 성공률</span>
            <span className="text-[18px] md:text-2xl mx-1 text-gold [text-shadow:0_0_15px_rgba(212,175,55,0.8)]">
              <CountUpNumber end={97} suffix="%" />
            </span>
          </div>
        </div>

        {/* 정부기관 롤링 */}
        <div className="mt-10 md:mt-10 pt-8 md:pt-[30px]">
          <h3 className="text-center text-[18px] md:text-2xl text-white font-semibold mb-6 md:mb-[30px] [text-shadow:0_0_15px_rgba(30,144,255,0.3)]">
            정책자금 정부기관
          </h3>
          <div className="relative overflow-hidden bg-[rgba(30,60,120,0.1)] backdrop-blur-[10px] py-5 md:py-[25px] border-y border-[rgba(212,175,55,0.2)]">
            <div className="flex gap-4 md:gap-[60px] px-5 md:px-[30px] animate-[infiniteRolling_60s_linear_infinite] hover:[animation-play-state:paused] w-[300%]">
              {[...govLogos, ...govLogos, ...govLogos].map((logo, i) => (
                <a
                  key={i}
                  href={logo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 w-[130px] h-[65px] md:w-[200px] md:h-[100px] flex items-center justify-center bg-white/95 rounded-lg p-3 md:p-5 transition-all duration-300
                    shadow-[0_2px_10px_rgba(212,175,55,0.2)] border border-[rgba(212,175,55,0.1)]
                    hover:scale-105 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:border-[rgba(212,175,55,0.3)] hover:bg-white"
                  title={logo.name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.img}
                    alt={logo.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Process Page
   ────────────────────────────────────────────── */
export default function ProcessClient() {
  return (
    <>
      <ProcessHero />
      <ServiceFeatures />
      <FaqSection />
      <CtaSection />
      <ConsultCTA
        title="체계적인 진행과정으로 자금을 확보하세요"
        subtitle="검증된 5단계 프로세스로 심사통과율 97%를 만들어냅니다"
      />
    </>
  );
}

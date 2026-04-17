"use client";

import { useEffect, useRef } from "react";
import CountUpNumber from "@/components/CountUpNumber";

const STEPS = [
  {
    num: "01",
    title: "역량 분석",
    desc: "대표자 역량과 자금조달 방향\n체계적 분석 및 전략 설계",
    icon: (
      <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
    ),
  },
  {
    num: "02",
    title: "조달 전략",
    desc: "정책자금·기업대출·보증서 등\n최적 자금조달 전략 수립",
    icon: (
      <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
    ),
  },
  {
    num: "03",
    title: "성공 지원",
    desc: "정책자금 신청부터 심사통과까지\n전문 컨설턴트 전담 지원",
    icon: <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />,
  },
];

export default function ProcessSection() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth <= 768) return;

    const cards =
      gridRef.current?.querySelectorAll<HTMLElement>(".process-card");
    if (!cards) return;

    const handlers = Array.from(cards).map((card) => {
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
      return { card, onMove, onLeave };
    });

    return () => {
      handlers.forEach(({ card, onMove, onLeave }) => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <section
      className="relative w-full py-12 md:py-16 lg:py-20 px-4 md:px-8 lg:px-10 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0f172e 0%, #1a2547 50%, #0f172e 100%)",
      }}
    >
      <div className="relative z-[1] max-w-wide mx-auto">
        {/* 섹션 헤더 */}
        <div className="text-center mb-7 md:mb-14 animate-fade-up">
          <h2 className="text-[26px] md:text-[44px] font-black text-light mb-2.5 uppercase tracking-wider leading-snug">
            정책자금 자금조달의
            <br />
            <span className="text-gold animate-[neonGlowPulse_3s_ease-in-out_infinite]">
              체계적 3단계 프로세스
            </span>
          </h2>
          <p className="text-sm md:text-xl text-body/90 font-medium tracking-wide leading-relaxed">
            정책자금 조달부터 기업 성장 전략까지 경영컨설팅 전문가와 함께
          </p>
        </div>

        {/* 프로세스 그리드 */}
        <div
          ref={gridRef}
          className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-8 lg:gap-11 my-7 md:my-11 relative
            md:before:content-[''] md:before:absolute md:before:top-1/2 md:before:left-[18%] md:before:right-[18%]
            md:before:h-0.5 md:before:bg-gradient-to-r md:before:from-gold/0 md:before:via-gold/70 md:before:to-gold/0
            md:before:z-0 md:before:animate-pulse-line"
        >
          {STEPS.map((step, i) => (
            <div key={step.num}>
              <div
                className="process-card glass rounded-[18px] relative overflow-visible transition-all duration-300
                  flex items-center gap-3 min-h-[68px] pl-14 pr-3.5 py-4
                  md:flex-col md:pt-[60px] md:px-8 md:pb-10 md:min-h-0 md:gap-4
                  border-l-[3px] md:border-l-[5px] border-l-gold
                  shadow-[0_0_30px_rgba(30,60,120,0.3),0_8px_32px_rgba(212,175,55,0.15)]
                  hover:md:-translate-y-2.5 hover:md:scale-[1.02] hover:md:bg-[rgba(30,60,120,0.3)]
                  hover:md:border-gold/60 hover:md:shadow-[0_0_60px_rgba(212,175,55,0.8)]"
                style={{ animationDelay: `${0.1 + i * 0.1}s` }}
              >
                {/* 스텝 넘버 */}
                <div
                  className="absolute left-4 top-1/2 -translate-y-1/2
                    md:left-auto md:top-[-29px] lg:top-[-31px] md:right-7 md:translate-y-0
                    w-8 h-8 md:w-[58px] md:h-[58px] lg:w-[62px] lg:h-[62px]
                    gold-gradient-bg rounded-full flex items-center justify-center
                    text-xs md:text-xl lg:text-[22px] font-extrabold text-white
                    shadow-[0_0_20px_rgba(212,175,55,0.5),0_8px_18px_rgba(30,60,120,0.4)]
                    md:animate-[float_3s_ease_infinite]"
                >
                  {step.num}
                </div>

                {/* 아이콘 + 텍스트 */}
                <div className="flex items-center gap-3 flex-1 md:flex-col md:gap-0 relative z-[2]">
                  <div
                    className="w-[26px] h-[26px] md:w-[74px] md:h-[74px] lg:w-[82px] lg:h-[82px] min-w-[26px]
                      flex items-center justify-center rounded-[10px] md:rounded-[20px] lg:rounded-[22px]
                      bg-gradient-to-br from-[rgba(30,60,120,0.3)] to-gold/20
                      border-2 border-gold/40 text-gold md:mb-4"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 md:w-9 md:h-9 lg:w-10 lg:h-10"
                    >
                      {step.icon}
                    </svg>
                  </div>
                  <div className="md:text-center">
                    <h3 className="text-lg md:text-[26px] lg:text-[28px] font-extrabold text-light mb-1 md:mb-3.5 tracking-wide">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-lg lg:text-[19px] text-body/85 font-semibold leading-snug whitespace-pre-line">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* 모바일 커넥터 */}
              {i < STEPS.length - 1 && (
                <div className="md:hidden w-0.5 h-[18px] mx-auto -my-1 bg-gradient-to-b from-gold/10 via-gold/50 to-gold/10" />
              )}
            </div>
          ))}
        </div>

        {/* 결과 박스 */}
        <div
          className="glass rounded-[18px] relative overflow-hidden pl-14 md:pl-0 pr-3.5 py-4 md:py-6 lg:py-7 md:px-8 lg:px-10 min-h-[68px] md:min-h-0
            border-l-[3px] md:border-l-[5px] border-l-gold md:text-center
            shadow-[0_0_40px_rgba(30,60,120,0.4),0_8px_32px_rgba(212,175,55,0.2)]
            before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px
            before:bg-gradient-to-r before:from-transparent before:via-gold/70 before:to-transparent before:animate-pulse-line"
        >
          {/* 아이콘 */}
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2
              md:static md:translate-y-0 md:mx-auto md:mb-3
              w-8 h-8 md:w-[38px] md:h-[38px] lg:w-[42px] lg:h-[42px]
              gold-gradient-bg rounded-full flex items-center justify-center
              shadow-[0_0_20px_rgba(212,175,55,0.6)]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="#0f172e"
              className="w-5 h-5 md:w-6 md:h-6"
            >
              <path d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2zm0 2c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm-1 13l-3.5-3.5 1.4-1.4L11 14.2l4.1-4.1 1.4 1.4L11 17z" />
            </svg>
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-[15px] md:text-xl lg:text-[22px] font-extrabold text-light tracking-wide">
              성공적인 정책자금 확보를 현실로!
            </h3>
            <p className="text-sm md:text-lg lg:text-xl text-body/90 font-semibold">
              자금조달 성공 기업{" "}
              <span className="text-gold font-black text-gold-glow">
                <CountUpNumber end={418} suffix="+" />
              </span>{" "}
              / 심사통과율{" "}
              <span className="text-gold font-black text-gold-glow">
                <CountUpNumber end={97} suffix="%" />
              </span>
            </p>
            <p className="text-[11px] md:text-xs lg:text-[13px] text-body/70 mt-1">
              *기업 규모와 업종에 따라 결과 및 기간은 차이가 있을 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

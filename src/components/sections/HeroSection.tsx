"use client";

import { useEffect, useRef } from "react";
import LocalVideoBackground from "@/components/LocalVideoBackground";
import CountUpNumber from "@/components/CountUpNumber";
import { HERO_VIDEOS } from "@/config/hero-videos";

export default function HeroSection() {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth <= 768) return;

    const cards =
      cardsRef.current?.querySelectorAll<HTMLElement>(".spotlight-card");
    if (!cards) return;

    const handlers = Array.from(cards).map((card) => {
      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        card.style.setProperty("--my", `${e.clientY - rect.top}px`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (e.clientY - rect.top - centerY) / 20;
        const rotateY = (centerX - (e.clientX - rect.left)) / 20;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
      };
      const onLeave = () => {
        card.style.transform = "";
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
    <section className="relative w-full pt-[130px] md:pt-[180px] pb-8 md:pb-12 px-3 md:px-8 overflow-hidden">
      <LocalVideoBackground src={HERO_VIDEOS.main} />
      <div className="relative z-[1] max-w-[1180px] mx-auto flex flex-col items-center gap-6">
        {/* 감정 메시지 */}
        <div className="text-center animate-fade-up glass rounded-3xl p-8 md:p-12 w-full shadow-[0_0_30px_rgba(30,60,120,0.4),0_8px_32px_rgba(212,175,55,0.2)]">
          <p className="text-xs md:text-base font-bold tracking-wider text-gold uppercase mb-2 text-gold-glow">
            정부 정책자금 전문 컨설턴트
          </p>
          <h1 className="text-[19px] md:text-[40px] font-extrabold leading-[1.4] md:leading-[1.3] text-light mb-2.5 md:mb-4 break-keep">
            정책자금{" "}
            <span className="highlight-text font-black">경영컨설팅</span>
            <br className="hidden md:block" /> 자금조달 어디서부터 시작하나요?
          </h1>
          <p className="text-[15px] md:text-[19px] text-body/85 leading-[1.7] break-keep">
            <span className="text-gold font-black text-gold-glow whitespace-nowrap">
              피에스킴컨설팅
            </span>
            의 자금조달 전문가가
            <br className="md:hidden" /> 대표님의 기업 성장을 지원합니다
            <br className="md:hidden" /> 체계적인 정책자금 전략이 성공적
            자금확보의 시작입니다
          </p>
          <small className="block mt-2.5 text-[13px] text-body/75">
            ※ 피에스킴컨설팅은 기업평가 및 정부정책 서류작성 대행을 하지
            않습니다.
          </small>
        </div>

        {/* 메인 컨텐츠: 금리 카드 + 정보 */}
        <div
          ref={cardsRef}
          className="w-full flex flex-col md:flex-row gap-6 md:gap-[60px] items-center md:items-start justify-center"
        >
          {/* 금리 비교 카드 */}
          <div
            className="spotlight-card w-full max-w-[380px] md:flex-shrink-0 md:max-w-[430px] glass rounded-[26px] p-6 md:p-8 relative transition-all duration-400 overflow-hidden
            shadow-[0_0_25px_rgba(30,60,120,0.3),0_8px_32px_rgba(212,175,55,0.15)]
            hover:translate-y-[-5px] hover:border-gold/80
            hover:shadow-[0_0_60px_rgba(212,175,55,0.8),0_0_100px_rgba(30,60,120,0.5)]"
          >
            <div className="spotlight-overlay" />
            <h3 className="text-[17px] md:text-lg font-bold text-light text-center mb-4 md:mb-5 break-keep relative z-[2]">
              정책자금 vs 시중은행
            </h3>

            {/* 모바일: 비교 카드 */}
            <div className="flex gap-3.5 md:hidden relative z-[2]">
              <div className="flex-1 p-4 rounded-[18px] bg-[rgba(30,60,120,0.15)] border border-gold/30 text-center shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <div className="text-xs font-semibold text-white mb-1.5">
                  정책자금
                </div>
                <div className="text-[22px] font-extrabold text-gold mb-1 text-gold-glow">
                  2~4.5%
                </div>
                <div className="text-[11px] font-semibold text-white">
                  최저금리
                </div>
              </div>
              <div className="flex-1 p-4 rounded-[18px] bg-body/5 border border-body/25 border-dashed text-center">
                <div className="text-xs font-semibold text-white mb-1.5">
                  시중은행
                </div>
                <div className="text-[22px] font-extrabold text-[#a0aec0] mb-1">
                  5.5~8.5%
                </div>
                <div className="text-[11px] font-semibold text-white">
                  부담금리
                </div>
              </div>
            </div>

            {/* 데스크톱: 그래프 */}
            <div className="hidden md:block relative h-[170px] mt-4 z-[2]">
              <div
                className="absolute bottom-0 left-[10%] w-[40%] h-[30%] rounded-t-[14px] bg-gradient-to-b from-gold to-gold-dark
                shadow-[0_0_40px_rgba(212,175,55,0.5),0_18px_45px_rgba(212,175,55,0.3)]
                flex flex-col items-center justify-end pb-3.5"
              >
                <span className="text-[30px] font-extrabold text-light [text-shadow:0_0_15px_rgba(212,175,55,0.6)]">
                  2~4.5%
                </span>
                <span className="mt-2 text-[13px] text-white font-semibold">
                  최저금리
                </span>
              </div>
              <div
                className="absolute bottom-0 right-[10%] w-[40%] h-[58%] rounded-t-[14px] bg-gradient-to-b from-[#a0aec0] to-[#64748b]
                shadow-[0_0_25px_rgba(160,174,192,0.2)]
                flex flex-col items-center justify-end pb-3.5"
              >
                <span className="text-2xl font-bold text-slate-100">
                  5.5~8.5%
                </span>
                <span className="mt-2 text-[13px] text-white font-semibold">
                  부담금리
                </span>
              </div>
            </div>
            <div className="hidden md:flex justify-around pt-3 border-t border-slate-400/30 text-white mt-3 relative z-[2]">
              <span>정책자금</span>
              <span>시중은행</span>
            </div>
          </div>

          {/* 정보 섹션 */}
          <div className="w-full max-w-[380px] md:flex-shrink-0 md:max-w-[520px] flex flex-col gap-4 md:gap-5">
            {/* 성공률 카드 */}
            <div
              className="spotlight-card glass rounded-[22px] p-4 md:p-6 border-l-[5px] md:border-l-[8px] border-l-gold
              flex items-center gap-4 transition-all duration-400 relative overflow-hidden
              shadow-[0_0_25px_rgba(30,60,120,0.3),0_8px_32px_rgba(212,175,55,0.15)]
              hover:translate-y-[-3px] hover:shadow-[0_0_50px_rgba(212,175,55,0.9)]"
            >
              <div className="spotlight-overlay" />
              <div
                className="hidden md:flex w-[52px] h-[52px] min-w-[52px] rounded-2xl items-center justify-center
                bg-gradient-to-br from-[rgba(30,60,120,0.3)] to-gold/20 text-gold shadow-[0_0_15px_rgba(212,175,55,0.3)] relative z-[2]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-[26px] h-[26px]"
                >
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                </svg>
              </div>
              <div className="relative z-[2] md:text-left text-center w-full">
                <h4 className="text-base md:text-2xl font-extrabold text-light mb-1 break-keep">
                  심사통과율 <CountUpNumber end={97} suffix="%" /> 검증된 실적
                </h4>
                <p className="text-[13px] md:text-lg text-body/80 leading-relaxed break-keep">
                  <span className="hidden md:inline">
                    자체 진행 시 <span className="text-red-500">▼</span>낮은
                    심사통과율
                    <br />
                    전문 자금조달 전략{" "}
                    <span className="text-emerald-500">▲</span>높은 성공률{" "}
                    <span className="text-emerald-500">▲</span>우수한 성과
                  </span>
                  {/* 모바일 테이블 */}
                  <span className="md:hidden block mt-2">
                    <span className="grid grid-cols-4 gap-1 text-[13px]">
                      <span className="text-gold font-bold text-left"></span>
                      <span className="text-gold font-bold text-center text-[10.5px]">
                        성공률
                      </span>
                      <span className="text-gold font-bold text-center text-[10.5px]">
                        전략
                      </span>
                      <span className="text-gold font-bold text-center text-[10.5px]">
                        성과
                      </span>
                    </span>
                    <span className="grid grid-cols-4 gap-1 text-[13px] mt-1">
                      <span className="text-light font-bold text-left text-[10.5px]">
                        자체진행
                      </span>
                      <span className="text-center text-red-500">▼</span>
                      <span className="text-center text-red-500">▼</span>
                      <span className="text-center text-red-500">▼</span>
                    </span>
                    <span className="grid grid-cols-4 gap-1 text-[13px] mt-1">
                      <span className="text-light font-bold text-left text-[10.5px]">
                        전문전략
                      </span>
                      <span className="text-center text-emerald-500">▲</span>
                      <span className="text-center text-emerald-500">▲</span>
                      <span className="text-center text-emerald-500">▲</span>
                    </span>
                  </span>
                </p>
              </div>
            </div>

            {/* 시스템 카드 */}
            <div
              className="spotlight-card glass rounded-[22px] p-4 md:p-6 border-l-[5px] md:border-l-[8px] border-l-gold
              flex items-center gap-4 transition-all duration-400 relative overflow-hidden
              shadow-[0_0_25px_rgba(30,60,120,0.3),0_8px_32px_rgba(212,175,55,0.15)]
              hover:translate-y-[-3px] hover:shadow-[0_0_50px_rgba(212,175,55,0.9)]"
            >
              <div className="spotlight-overlay" />
              <div
                className="hidden md:flex w-[52px] h-[52px] min-w-[52px] rounded-2xl items-center justify-center
                bg-gradient-to-br from-[rgba(30,60,120,0.3)] to-gold/20 text-gold shadow-[0_0_15px_rgba(212,175,55,0.3)] relative z-[2]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-[26px] h-[26px]"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div className="relative z-[2] md:text-left text-center w-full">
                <h4 className="text-base md:text-2xl font-extrabold text-light mb-1 break-keep">
                  정책자금 맞춤형 자금조달 시스템
                </h4>
                <p className="text-[13px] md:text-lg text-body/80 leading-relaxed break-keep">
                  정책자금 전문가 팀이
                  <br />
                  현황진단부터 자금조달 전략 실행까지 함께합니다
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA 버튼 */}
        <div className="mt-6 md:mt-8 text-center">
          <a
            href="/fund#consult-form"
            className="spotlight-card inline-block w-full md:w-auto gold-gradient-bg text-white py-4 px-8 md:py-[18px] md:px-12
              rounded-[28px] text-[17px] md:text-xl font-extrabold no-underline relative overflow-hidden cursor-pointer
              gold-glow transition-all duration-300
              hover:translate-y-[-3px] hover:scale-[1.02]
              hover:shadow-[0_0_70px_rgba(212,175,55,0.9),0_0_110px_rgba(255,255,255,0.6)]
              active:scale-[0.98]"
          >
            <span className="relative z-[1]">무료 상담신청</span>
          </a>
        </div>
      </div>
    </section>
  );
}

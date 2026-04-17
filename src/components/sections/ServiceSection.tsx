"use client";

import { useState } from "react";
import CountUpNumber from "@/components/CountUpNumber";

const TABS = [
  {
    id: "tab1",
    label: "역량 분석",
    title: "역량 분석",
    icon: (
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    ),
    pointPrefix: "정책자금 심사통과율 ",
    pointNumber: 97,
    pointSuffix: "% 달성",
    desc1:
      "418건 이상의 자금조달 성공 사례를 기반으로 대표자별 정책자금 적합도를 분석합니다.",
    desc2:
      "대표자 역량, 업종, 자금조달 목표를 정밀 분석하여 최적의 정부지원 정책자금을 추천합니다.\n\n정부 지원사업 공고와 정책자금 정보를 신속하게 반영하여 항상 최신 데이터에 기반한 분석을 제공합니다.",
  },
  {
    id: "tab2",
    label: "맞춤 전략",
    title: "맞춤 전략",
    icon: (
      <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
    ),
    pointPrefix: "평균 자금조달액 ",
    pointNumber: 2.8,
    pointSuffix: "억원 달성",
    pointDecimals: 1,
    desc1:
      "대표자 상황별 최적의 정책자금 전략을 수립하고 자금조달 계획을 설계합니다.",
    desc2:
      "기업의 자금 필요 시기와 규모를 정밀 분석하여 정책자금·기업대출·보증서 최적 조합 전략을 수립합니다.\n\n정부지원 정보 제공부터 정책자금 활용까지 성공적 자금조달을 위한 체계적 로드맵을 제시합니다.",
  },
  {
    id: "tab3",
    label: "심사 준비",
    title: "심사 준비",
    icon: (
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
    ),
    pointPrefix: "정책자금 재도전 승인률 ",
    pointNumber: 97,
    pointSuffix: "%",
    desc1:
      "정책자금 심사통과를 위한 서류 정보 및 증빙자료 안내를 완벽하게 지원합니다.",
    desc2:
      "서류 정보 제공, 재무제표 분석, 심사 핵심 포인트 설명 등 정부지원 심사기관의 기준을 정확히 안내합니다.\n\n자금조달 신청 이후에도 지속적 모니터링과 피드백으로 심사통과를 위한 완벽한 준비를 지원합니다.",
  },
  {
    id: "tab4",
    label: "전담 관리",
    title: "전담 관리",
    icon: (
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    ),
    pointPrefix: "고객 재의뢰율 ",
    pointNumber: 98,
    pointSuffix: "%+ 달성",
    desc1:
      "업종별 경영컨설팅 전문가가 정책자금 신청부터 정산까지 전체 과정을 관리합니다.",
    desc2:
      "현황진단부터 정책자금 신청, 심사승인, 정산까지 모든 단계를 전담팀이 직접 동행합니다.\n\n대표님은 본업에만 집중하시고 복잡한 정책자금 자금조달 여정은 피에스킴컨설팅이 완벽하게 안내합니다.",
  },
];

const TRUST_ITEMS = [
  { text: "윤리적 지원 원칙", iconType: "money" },
  { text: "정보 보안 철저", iconType: "person" },
  { text: "선의의 지원 추구", iconType: "product" },
];

export default function ServiceSection() {
  const [activeTab, setActiveTab] = useState("tab1");
  const current = TABS.find((t) => t.id === activeTab)!;

  return (
    <section
      className="relative w-full py-10 md:py-14 px-4 md:px-8 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0a1420 0%, #0f172e 50%, #0a1420 100%)",
      }}
    >
      <div className="relative z-[1] max-w-wide mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-6 md:mb-12 animate-fade-up">
          <h2 className="text-2xl md:text-[42px] lg:text-[48px] font-black text-light mb-2.5 uppercase tracking-wide leading-tight">
            정책자금 자금조달의{" "}
            <span className="text-gold animate-[neonGlowPulse_3s_ease-in-out_infinite]">
              전문 컨설팅
            </span>
          </h2>
          <p className="text-sm md:text-xl lg:text-[22px] text-body/90 font-medium tracking-wide">
            현황 진단과 맞춤 경영컨설팅으로 정책자금 심사승인을 만들다
          </p>
          <p className="text-[9px] md:text-xs text-body/70 mt-3 leading-relaxed">
            ※ 피에스킴컨설팅은 정책자금 서류작성을 대행하지 않습니다.
            <br />※ 기업평가를 하지 않습니다.
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="grid grid-cols-2 md:flex md:justify-center gap-2 md:gap-3 mb-5 md:mb-9">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 md:py-3 px-2 md:px-6 rounded-[10px] md:rounded-xl text-[13px] md:text-base font-semibold
                backdrop-blur-[10px] transition-all duration-300 border-[1.5px] cursor-pointer
                ${
                  activeTab === tab.id
                    ? "gold-gradient-bg border-transparent text-white shadow-[0_0_25px_rgba(255,255,255,0.15),0_0_35px_rgba(212,175,55,0.4)]"
                    : "bg-[rgba(30,60,120,0.2)] border-gold/30 text-body/90 hover:bg-[rgba(30,60,120,0.3)] hover:border-gold"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div className="mb-6 md:mb-10 animate-fade-up" key={activeTab}>
          <div
            className="glass rounded-2xl md:rounded-[20px] p-6 md:p-10 max-w-[1130px] mx-auto
            shadow-[0_0_35px_rgba(255,255,255,0.08),0_0_45px_rgba(30,60,120,0.3),0_4px_20px_rgba(0,0,0,0.4)]"
          >
            {/* 아이콘 */}
            <div
              className="w-14 h-14 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-2xl md:rounded-[20px] flex items-center justify-center
              bg-gradient-to-br from-[rgba(30,60,120,0.3)] to-gold/20 border-2 border-gold/40"
            >
              <svg
                viewBox="0 0 24 24"
                fill="#d4af37"
                className="w-7 h-7 md:w-10 md:h-10"
              >
                {current.icon}
              </svg>
            </div>

            <h3 className="text-xl md:text-[28px] font-extrabold text-light mb-3 md:mb-4 text-center">
              {current.title}
            </h3>
            <p className="text-sm md:text-lg text-body/85 leading-relaxed text-left md:text-center">
              {current.desc1}
            </p>

            {/* 모바일 포인트 박스 */}
            <div className="md:hidden my-4 bg-gradient-to-br from-[rgba(30,60,120,0.3)] to-gold/20 border-l-[3px] border-l-gold rounded-lg p-3">
              <p className="text-[13px] text-light font-semibold">
                <span className="text-gold font-bold text-gold-glow">
                  {current.pointPrefix}
                  <CountUpNumber
                    end={current.pointNumber}
                    decimals={current.pointDecimals || 0}
                  />
                  {current.pointSuffix}
                </span>
              </p>
            </div>

            <p className="text-sm md:text-lg text-body/85 leading-relaxed text-left md:text-center whitespace-pre-line">
              {current.desc2}
            </p>
          </div>
        </div>

        {/* 신뢰 배너 */}
        <div
          className="gold-gradient-bg rounded-xl md:rounded-[15px] p-4 md:py-5 md:px-8 mt-6 md:mt-10 relative overflow-hidden max-w-[1130px] mx-auto
          shadow-[0_0_45px_rgba(255,255,255,0.2),0_0_55px_rgba(212,175,55,0.4),0_4px_20px_rgba(30,60,120,0.3)]"
        >
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          <div className="relative z-[1] flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <svg
                viewBox="0 0 24 24"
                fill="white"
                className="w-5 h-5 md:w-7 md:h-7 drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
              >
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
              <span className="text-[15px] md:text-xl font-bold text-white uppercase tracking-wide">
                피에스킴컨설팅이 약속합니다
              </span>
            </div>
            <div className="flex flex-col md:flex-row gap-2.5 md:gap-9">
              {TRUST_ITEMS.map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 md:gap-2 p-2.5 md:p-0 bg-white/15 md:bg-transparent rounded-[10px] md:rounded-none backdrop-blur-sm md:backdrop-blur-none"
                >
                  <div className="relative w-8 h-8 md:w-9 md:h-9 flex-shrink-0">
                    <svg
                      viewBox="0 0 24 24"
                      fill="rgba(255,255,255,0.3)"
                      className="absolute top-[3px] left-[3px] w-[26px] h-[26px] md:w-7 md:h-7"
                    >
                      {item.iconType === "money" && (
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1.81.45 1.61 1.67 1.61 1.16 0 1.6-.64 1.6-1.36 0-.84-.68-1.3-2.07-1.73-1.54-.46-3.2-1.04-3.2-3.12 0-1.23.77-2.48 2.61-2.96V6h2.67v1.15c1.29.32 2.51 1.07 2.64 2.81h-1.94c-.05-.5-.38-1.26-1.36-1.26-1.08 0-1.54.67-1.54 1.25 0 .85.75 1.18 2.07 1.61 1.54.48 3.2 1.06 3.2 3.19.01 1.6-1.15 2.58-2.97 3.04z" />
                      )}
                      {item.iconType === "person" && (
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                      )}
                      {item.iconType === "product" && (
                        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                      )}
                    </svg>
                    <svg
                      viewBox="0 0 24 24"
                      fill="#ef4444"
                      className="absolute top-0 left-0 w-8 h-8 md:w-9 md:h-9 drop-shadow-[0_2px_4px_rgba(239,68,68,0.4)]"
                    >
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </div>
                  <p className="text-[13px] md:text-[15px] text-white font-medium">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

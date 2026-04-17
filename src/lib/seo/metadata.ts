import type { Metadata } from "next";

const SITE_URL = "https://pskim.biz";
const SITE_NAME = "피에스킴컨설팅";

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { telephone: true, email: true },
  robots: { index: true, follow: true },
};

export const pageMetadata: Record<string, Metadata> = {
  home: {
    title: "피에스킴컨설팅 | 정책자금 경영컨설팅 전문기업",
    description:
      "정책자금 심사 통과율 97%, 418건 이상 성장 지원 실적의 피에스킴컨설팅. 기업심사관 출신 전문가의 체계적 경영컨설팅을 제공합니다.",
    keywords:
      "정책자금, 경영컨설팅, 자금조달, 정부지원금, 창업자금, 운전자금, 시설자금, 피에스킴컨설팅, 심사통과, 자금전략, 김판수",
    openGraph: {
      title: "피에스킴컨설팅 | 정책자금 경영컨설팅 전문기업",
      description:
        "심사 통과율 97%, 418건+ 성장 지원 실적. 정책자금 전문 경영컨설팅.",
      url: SITE_URL,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "피에스킴컨설팅 | 정책자금 경영컨설팅",
      description:
        "심사 통과율 97%, 체계적 자금조달 전략. 무료 상담 신청하세요.",
    },
    alternates: { canonical: SITE_URL },
  },

  company: {
    title: "회사소개 | 피에스킴컨설팅 - 정책자금 성장 전문 파트너",
    description:
      "피에스킴컨설팅은 기업심사관 출신 전문가가 이끄는 성장 전문 파트너입니다. 전담 준비 지원, 체계적 프로세스, 투명한 운영으로 정책자금 심사 통과율 97%를 달성합니다.",
    openGraph: {
      title: "회사소개 | 피에스킴컨설팅",
      description:
        "기업심사관 출신 전문가의 성장 전문 파트너. 체계적 사전 준비 시스템 운영.",
      url: `${SITE_URL}/company`,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "회사소개 | 피에스킴컨설팅",
      description: "정책자금 성장 전문 파트너. 체계적 사전 준비 시스템.",
    },
    alternates: { canonical: `${SITE_URL}/company` },
  },

  process: {
    title: "진행과정 | 피에스킴컨설팅 - 정책자금 성장 지원 프로세스",
    description:
      "피에스킴컨설팅의 정책자금 성장 지원 6단계 프로세스. 정밀 역량 분석, 전문가 매칭, 맞춤형 자금 전략, 전과정 밀착 지원으로 심사 통과율 97%를 기록합니다.",
    openGraph: {
      title: "진행과정 | 피에스킴컨설팅",
      description: "6단계 체계적 프로세스로 정책자금 심사 통과율 97% 달성.",
      url: `${SITE_URL}/process`,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "진행과정 | 피에스킴컨설팅",
      description: "정책자금 심사 통과율 97%의 체계적 프로세스.",
    },
    alternates: { canonical: `${SITE_URL}/process` },
  },

  fund: {
    title: "자금상담 | 피에스킴컨설팅 - 정책자금·기업대출·보증서 전문",
    description:
      "정책자금 최대 10억, 기업대출 최대 30억, 보증서 최대 15억까지. 피에스킴컨설팅의 맞춤형 자금 전략으로 평균 조달액 2.8억, 심사 통과율 97%를 달성하세요.",
    openGraph: {
      title: "자금상담 | 피에스킴컨설팅",
      description: "정책자금·기업대출·보증서 맞춤 전략. 평균 조달액 2.8억.",
      url: `${SITE_URL}/fund`,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "자금상담 | 피에스킴컨설팅",
      description: "정책자금 최대 10억, 평균 조달액 2.8억. 무료 상담 신청.",
    },
    alternates: { canonical: `${SITE_URL}/fund` },
  },

  pro: {
    title: "전문서비스 | 피에스킴컨설팅 - 법무·세무·회계·노무 전문가 네트워크",
    description:
      "법무, 세무, 회계, 노무 전문가를 맞춤형으로 연결하는 피에스킴컨설팅. 418+ 성공 기업의 검증된 전문가 네트워크로 자금 조달 성공률을 높이세요.",
    openGraph: {
      title: "전문서비스 | 피에스킴컨설팅",
      description: "법무·세무·회계·노무 전문가 네트워크. 418+ 성공 기업 실적.",
      url: `${SITE_URL}/pro`,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "전문서비스 | 피에스킴컨설팅",
      description: "법무·세무·회계·노무 전문가 매칭 서비스.",
    },
    alternates: { canonical: `${SITE_URL}/pro` },
  },

  mkt: {
    title: "온라인마케팅 | 피에스킴컨설팅 - 데이터 기반 통합 마케팅",
    description:
      "홈페이지 제작, 검색광고, SNS 마케팅, 블로그 마케팅, AI 자동화, 퍼포먼스 마케팅까지. 데이터 기반 전략으로 평균 매출 상승률 250%를 달성하는 통합 마케팅 솔루션.",
    openGraph: {
      title: "온라인마케팅 | 피에스킴컨설팅",
      description: "데이터 기반 통합 마케팅. 평균 매출 상승률 250% 달성.",
      url: `${SITE_URL}/mkt`,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "온라인마케팅 | 피에스킴컨설팅",
      description: "홈페이지·검색광고·SNS·블로그 통합 마케팅 솔루션.",
    },
    alternates: { canonical: `${SITE_URL}/mkt` },
  },
};

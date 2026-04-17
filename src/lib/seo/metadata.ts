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
    title: { absolute: "피에스킴컨설팅 | 중소기업 정책자금 전담 컨설팅" },
    description:
      "정책자금 심사통과율 97%, 자금조달 성공 418건+ 실적. 피에스킴컨설팅은 기업심사관전담팀이 체계적 정책자금 설계부터 자금확보까지 동행하는 경영컨설팅 기업입니다.",
    keywords:
      "정책자금, 경영컨설팅, 자금조달, 자금확보, 정부지원금, 창업자금, 운전자금, 시설자금, 피에스킴컨설팅, 심사통과, 자금설계, 김판수, pskim",
    openGraph: {
      title: "피에스킴컨설팅 | 중소기업 정책자금 전담 컨설팅",
      description:
        "심사통과율 97%, 자금조달 성공 418건+ 실적. 정책자금 전담 경영컨설팅.",
      url: SITE_URL,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "피에스킴컨설팅 | 정책자금 전담 경영컨설팅",
      description:
        "심사통과율 97%, 체계적 자금조달 설계. 무료 자금진단 신청하세요.",
    },
    alternates: { canonical: SITE_URL },
  },

  company: {
    title: {
      absolute: "회사소개 | 피에스킴컨설팅 - 정책자금 경영컨설팅 전담 파트너",
    },
    description:
      "피에스킴컨설팅은 기업심사관전담팀이 이끄는 정책자금 경영컨설팅 기업입니다. 1:1 전담 컨설팅, 빈틈없는 심사 준비, 투명한 진행 프로세스로 심사통과율 97%를 확보합니다.",
    openGraph: {
      title: "회사소개 | 피에스킴컨설팅",
      description: "기업심사관전담 파트너. 체계적 사전 준비 프로세스 운영.",
      url: `${SITE_URL}/company`,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "회사소개 | 피에스킴컨설팅",
      description: "정책자금 전담 파트너. 체계적 사전 준비 프로세스.",
    },
    alternates: { canonical: `${SITE_URL}/company` },
  },

  process: {
    title: {
      absolute: "진행과정 | 피에스킴컨설팅 - 정책자금 자금확보 프로세스",
    },
    description:
      "피에스킴컨설팅의 정책자금 자금확보 4단계 프로세스. 역량 진단, 전담팀 매칭, 맞춤 설계, 전과정 동행으로 심사통과율 97%를 만들어냅니다.",
    openGraph: {
      title: "진행과정 | 피에스킴컨설팅",
      description: "4단계 체계적 프로세스로 정책자금 심사통과율 97% 확보.",
      url: `${SITE_URL}/process`,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "진행과정 | 피에스킴컨설팅",
      description: "정책자금 심사통과율 97%의 체계적 프로세스.",
    },
    alternates: { canonical: `${SITE_URL}/process` },
  },

  fund: {
    title: {
      absolute: "자금상담 | 피에스킴컨설팅 - 정책자금·기업대출·보증서 전담",
    },
    description:
      "정책자금 최대 30억, 기업대출 최대 50억, 보증서 최대 30억까지. 피에스킴컨설팅의 맞춤형 자금조달 설계로 평균 조달액 2.8억, 심사통과율 97%를 확보하세요.",
    openGraph: {
      title: "자금상담 | 피에스킴컨설팅",
      description: "정책자금·기업대출·보증서 맞춤 설계. 평균 조달액 2.8억.",
      url: `${SITE_URL}/fund`,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "자금상담 | 피에스킴컨설팅",
      description: "정책자금·기업대출·보증서 전담 컨설팅. 무료 자금진단.",
    },
    alternates: { canonical: `${SITE_URL}/fund` },
  },

  pro: {
    title: {
      absolute:
        "전문서비스 | 피에스킴컨설팅 - 법무·세무·회계·노무 전담팀 네트워크",
    },
    description:
      "법무·세무·회계·노무 전담팀을 맞춤형으로 매칭하는 피에스킴컨설팅. 418+ 자금조달 성공기업의 검증된 전담팀 네트워크로 정책자금 심사승인율을 높이세요.",
    openGraph: {
      title: "전문서비스 | 피에스킴컨설팅",
      description: "법무·세무·회계·노무 전담팀 네트워크. 418+ 성공기업 실적.",
      url: `${SITE_URL}/pro`,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "전문서비스 | 피에스킴컨설팅",
      description: "법무·세무·회계·노무 전담팀 매칭 서비스.",
    },
    alternates: { canonical: `${SITE_URL}/pro` },
  },

  mkt: {
    title: {
      absolute: "온라인마케팅 | 피에스킴컨설팅 - 데이터 기반 통합 마케팅",
    },
    description:
      "홈페이지 제작, 검색광고, SNS 마케팅, 블로그 마케팅, AI 자동화, 퍼포먼스 마케팅까지. 데이터 기반 설계로 평균 매출 증가율 250%를 만들어내는 통합 마케팅 솔루션.",
    openGraph: {
      title: "온라인마케팅 | 피에스킴컨설팅",
      description: "데이터 기반 통합 마케팅. 평균 매출 증가율 250%.",
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

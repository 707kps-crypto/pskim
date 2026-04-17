const SITE_URL = "https://pskim.biz";
const SITE_NAME = "피에스킴컨설팅";
const PHONE = "010-8008-0186";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: PHONE,
      contactType: "customer service",
      availableLanguage: "Korean",
      areaServed: "KR",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "KR",
      addressLocality: "인천",
    },
    sameAs: [SITE_URL],
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "FinancialService"],
    name: SITE_NAME,
    url: `${SITE_URL}/company`,
    telephone: PHONE,
    description:
      "피에스킴컨설팅은 정책자금 전문 경영컨설팅 기업입니다. 대표자 역량 분석부터 맞춤형 자금 전략 수립까지 체계적 지원을 제공합니다.",
    priceRange: "무료 상담",
    address: {
      "@type": "PostalAddress",
      addressCountry: "KR",
      addressLocality: "인천",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "418",
      bestRating: "5",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "18:00",
    },
  };
}

export function serviceSchema(page: "fund" | "pro" | "mkt") {
  const services = {
    fund: {
      name: "정책자금 자금상담 서비스",
      description:
        "정책자금, 기업대출, 보증서 발급 등 맞춤형 자금 전략을 수립하여 평균 조달액 2.8억, 심사 통과율 97%를 달성합니다.",
      serviceType: "Financial Consulting",
    },
    pro: {
      name: "전문서비스 (법무·세무·회계·노무)",
      description:
        "법무, 세무, 회계, 노무 분야 전문가를 맞춤형으로 연결하여 자금 조달 성공률을 높이는 전문가 네트워크 서비스입니다.",
      serviceType: "Professional Services",
    },
    mkt: {
      name: "온라인마케팅 솔루션",
      description:
        "홈페이지 제작, 검색광고, SNS 마케팅, 블로그 마케팅, AI 자동화 구축, 퍼포먼스 마케팅 등 데이터 기반 통합 마케팅 서비스입니다.",
      serviceType: "Digital Marketing",
    },
  };

  const svc = services[page];

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: svc.name,
    description: svc.description,
    serviceType: svc.serviceType,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    url: `${SITE_URL}/${page}`,
    areaServed: {
      "@type": "Country",
      name: "KR",
    },
  };
}

export function faqSchema() {
  const faqs = [
    {
      q: "피에스킴컨설팅만의 차별화된 경쟁력은 무엇인가요?",
      a: "정책자금 심사 프로세스를 완벽히 이해한 전문가들이 대표님 맞춤형 솔루션을 제공합니다. 대표님의 숨은 가치를 발굴하고 성장 스토리를 설계하여 심사위원을 설득하는 전략적 접근법을 구사합니다. 사전 역량을 강화하여 97%의 높은 성공률을 달성하고 있습니다.",
    },
    {
      q: "정책자금 사전 준비 과정은 어떻게 진행되나요?",
      a: "단계별 맞춤 지원 시스템을 운영합니다. 먼저 대표자 현황 분석으로 강점과 개선점을 파악합니다. 다음으로 최적의 정책자금을 설계하여 제안드립니다. 이후 서류 정보 제공부터 면접까지 세심한 코칭을 진행하며, 자금 확보 이후에도 연계 지원사업과 성장전략을 함께 고민합니다.",
    },
    {
      q: "지원 가능한 정부지원사업 범위가 어떻게 되나요?",
      a: "정부 및 지자체가 운영하는 전 분야 지원사업을 커버합니다. 창업지원금, 운영자금, 시설투자, 기술개발(R&D), 해외진출, 각종 인증취득 등 대표님의 라이프사이클 전반의 자금을 지원합니다.",
    },
    {
      q: "서비스 이용 비용 체계는 어떻게 구성되어 있나요?",
      a: "기초 상담과 역량 분석은 전액 무료로 진행됩니다. 본격적인 지원 수수료는 지원 프로젝트의 성격과 난이도를 고려하여 산정되며, 직접 방문상담을 통해 맞춤형 견적을 제공해드립니다.",
    },
    {
      q: "접수부터 최종 지급까지 소요 기간은 어느 정도인가요?",
      a: "사업 유형별로 차이가 있으나 긴급운전자금은 3-4주 내, 일반 정책자금은 2-3개월 수준입니다. 피에스킴컨설팅은 최대 지원금액, 유리한 금리조건, 장기 상환조건 확보에 집중합니다.",
    },
    {
      q: "자금 수령 이후에도 지속적인 관리를 받을 수 있나요?",
      a: "피에스킴컨설팅은 장기적 성장 파트너를 지향합니다. 자금 활용 모니터링, 후속 지원사업 추천, 추가 자금 조달 지원 등을 종합 제공합니다. 단발성 지원이 아닌 지속가능한 성장 기반을 함께 구축해나가겠습니다.",
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "ko",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

/** 게시글(Article) 구조화 데이터 - GEO/AEO: 검색엔진·AI가 콘텐츠를 정확히 이해 */
export function articleSchema(post: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    url: post.url,
    datePublished: post.datePublished,
    dateModified: post.datePublished,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": post.url,
    },
    ...(post.image ? { image: post.image } : {}),
  };
}

/** 진행과정 HowTo 구조화 데이터 - GEO/AEO: AI 어시스턴트가 단계별 안내 가능 */
export function howToSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "정책자금 성장 지원 진행과정",
    description:
      "피에스킴컨설팅의 정책자금 성장 지원 6단계 프로세스. 무료 상담 접수부터 사후 관리까지 체계적으로 진행됩니다.",
    totalTime: "P90D",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "무료 상담 접수",
        text: "전화(010-8008-0186) 또는 온라인으로 무료 상담을 접수합니다. 기업 현황과 필요 자금 규모를 간단히 알려주시면 됩니다.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "대표자 역량 분석",
        text: "전문 컨설턴트가 대표자의 역량, 사업 현황, 재무 상태를 정밀 분석하여 강점과 개선점을 도출합니다.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "맞춤형 자금 전략 수립",
        text: "분석 결과를 바탕으로 정책자금, 기업대출, 보증서 등 최적의 자금 조달 전략을 설계합니다.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "서류 준비 및 사전 역량 강화",
        text: "필요 서류를 체계적으로 준비하고, 심사 통과율을 높이기 위한 사전 역량 강화 코칭을 진행합니다.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "심사 대비 및 면접 코칭",
        text: "심사위원 설득 전략을 수립하고, 실전 면접 코칭으로 심사 통과율 97%를 달성합니다.",
      },
      {
        "@type": "HowToStep",
        position: 6,
        name: "자금 확보 및 사후 관리",
        text: "자금 확보 후에도 활용 모니터링, 후속 지원사업 추천, 추가 자금 조달 등 지속적 성장을 지원합니다.",
      },
    ],
  };
}

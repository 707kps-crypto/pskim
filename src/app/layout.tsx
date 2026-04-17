import type { Metadata } from "next";
import "./globals.css";
import { baseMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  ...baseMetadata,
  title: {
    default: "피에스킴컨설팅 | 중소기업 정책자금 전담 컨설팅",
    template: "%s | 피에스킴컨설팅",
  },
  description:
    "피에스킴컨설팅은 기업심사관 출신 전담팀이 이끄는 정책자금 경영컨설팅 기업입니다. 체계적인 설계로 정책자금 심사통과율 97%를 확보해드립니다.",
  keywords:
    "정책자금, 경영컨설팅, 자금상담, 자금진단, 자금조달, 창업자금, 운전자금, 시설자금, 피에스킴컨설팅, 김판수, pskim",
  openGraph: {
    title: "피에스킴컨설팅 | 중소기업 정책자금 전담 컨설팅",
    description:
      "기업심사관 출신 전담팀의 정책자금 경영컨설팅. 심사통과율 97% 확보.",
    url: "https://pskim.biz",
    siteName: "피에스킴컨설팅",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "피에스킴컨설팅 - 중소기업 정책자금 전담 컨설팅",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "피에스킴컨설팅 | 중소기업 정책자금 전담 컨설팅",
    description:
      "기업심사관 출신 전담팀 · 심사통과율 97% · 자금조달 성공 418+ 기업.",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    other: {
      "naver-site-verification": [
        process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || "",
      ],
    },
  },
  alternates: { canonical: "https://pskim.biz" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

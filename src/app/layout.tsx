import type { Metadata } from "next";
import "./globals.css";
import { baseMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  ...baseMetadata,
  title: "피에스킴컨설팅 | 정책자금 경영컨설팅",
  description:
    "피에스킴컨설팅은 기업심사관 출신 전문가가 이끄는 정책자금 전문 경영컨설팅 기업입니다. 체계적인 진단으로 정책자금 심사 통과율을 높여드립니다.",
  keywords:
    "정책자금, 경영컨설팅, 자금상담, 창업자금, 운전자금, 시설자금, 피에스킴컨설팅, 김판수",
  openGraph: {
    title: "피에스킴컨설팅 | 정책자금 경영컨설팅",
    description: "기업심사관 출신 전문가의 정책자금 전문 컨설팅",
    url: "https://pskim.biz",
    siteName: "피에스킴컨설팅",
    locale: "ko_KR",
    type: "website",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    other: {
      "naver-site-verification": [
        process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || "",
      ],
    },
  },
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

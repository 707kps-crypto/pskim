/**
 * 페이지별 히어로 배경영상 로컬 경로 매핑
 */
export const HERO_VIDEOS = {
  main: "/videos/home.mp4",
  about: "/videos/company.mp4",
  process: "/videos/process.mp4",
  funding: "/videos/fund.mp4",
  professional: "/videos/pro.mp4",
  marketing: "/videos/mkt.mp4",
} as const;

export type HeroVideoPage = keyof typeof HERO_VIDEOS;

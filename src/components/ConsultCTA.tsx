import Link from "next/link";

type Props = {
  title?: string;
  subtitle?: string;
  buttonText?: string;
};

export default function ConsultCTA({
  title = "지금 무료 자금심사를 시작하세요",
  subtitle = "기업심사관 출신 전담팀이 1:1로 분석해드립니다",
  buttonText = "자금상담 신청하기",
}: Props) {
  return (
    <section className="relative py-20 md:py-28 px-5 md:px-10 overflow-hidden bg-gradient-to-br from-navy-dark via-navy to-navy-dark">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(201,168,76,0.15)_0%,transparent_70%)] pointer-events-none" />
      <div className="relative max-w-content mx-auto text-center">
        <h2 className="text-[28px] md:text-[40px] lg:text-[48px] font-bold text-white mb-4 leading-tight">
          {title}
        </h2>
        <p className="text-[15px] md:text-[18px] text-body mb-10 md:mb-12 leading-relaxed">
          {subtitle}
        </p>
        <Link
          href="/fund#consult-form"
          className="group inline-flex items-center gap-3 px-8 md:px-12 py-4 md:py-5 rounded-full
            bg-gradient-to-br from-gold to-gold-dark text-white font-bold text-[16px] md:text-[18px]
            shadow-[0_8px_24px_rgba(201,168,76,0.4),0_0_40px_rgba(201,168,76,0.2)]
            hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(201,168,76,0.5),0_0_60px_rgba(201,168,76,0.3)]
            transition-all duration-300"
        >
          {buttonText}
          <span className="text-xl group-hover:translate-x-1 transition-transform">
            →
          </span>
        </Link>
        <p className="mt-6 text-[13px] md:text-[14px] text-body/70">
          무료 상담 · 비밀 보장 · 영업일 24시간 내 연락
        </p>
      </div>
    </section>
  );
}

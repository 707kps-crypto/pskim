"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { trackFormVisible, trackFormStart, trackFormSubmit } from "@/lib/gtag";

const FUND_TYPES = ["창업자금", "운전자금", "시설자금", "기타자금"];
const INDUSTRIES = [
  "제조업",
  "도소매업",
  "서비스업",
  "건설업",
  "IT/소프트웨어",
  "기타",
];
const CONSULT_TIMES = [
  "오전 10:00 - 11:00",
  "오전 11:00 - 12:00",
  "오후 14:00 - 15:00",
  "오후 15:00 - 16:00",
  "오후 16:00 - 17:00",
  "오후 17:00 - 18:00",
  "오후 18:00 - 19:00",
  "언제나 가능",
];
const AMOUNTS = [
  "5천만원 이하",
  "5천만원 ~ 1억원",
  "1억원 ~ 3억원",
  "3억원 ~ 5억원",
  "5억원 ~ 10억원",
  "10억원 이상",
];

export default function ConsultForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [selectedFundTypes, setSelectedFundTypes] = useState<string[]>([]);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const formStarted = useRef(false);

  // form_visible: IntersectionObserver
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let fired = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired) {
          fired = true;
          trackFormVisible(window.location.pathname);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // form_start: first field focus
  const handleFieldFocus = (fieldName: string) => {
    if (!formStarted.current) {
      formStarted.current = true;
      trackFormStart(window.location.pathname, fieldName);
    }
  };

  const toggleFundType = (type: string) => {
    setSelectedFundTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const formatBizNo = (value: string) => {
    const nums = value.replace(/[^0-9]/g, "");
    if (nums.length <= 3) return nums;
    if (nums.length <= 5) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 5)}-${nums.slice(5, 10)}`;
  };

  const formatPhone = (value: string) => {
    const nums = value.replace(/[^0-9]/g, "");
    if (nums.length <= 3) return nums;
    if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7, 11)}`;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    if (selectedFundTypes.length === 0) {
      alert("지원받고 싶은 자금 종류를 하나 이상 선택해주세요.");
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");

    try {
      const data = {
        company: formData.get("company") as string,
        bizno: formData.get("bizno") as string,
        name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string,
        industry: formData.get("industry") as string,
        founded: formData.get("founded") as string,
        consultTime: formData.get("consultTime") as string,
        amount: formData.get("amount") as string,
        fundType: selectedFundTypes.join(", "),
        message: formData.get("message") as string,
      };

      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Submit failed");

      trackFormSubmit(window.location.pathname);
      setStatus("success");
      form.reset();
      setSelectedFundTypes([]);
      formStarted.current = false;
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="consult-form"
      ref={sectionRef}
      className="section-dark section-padding"
    >
      <div className="max-w-content mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-[60px] items-start">
          {/* 좌측 정보 */}
          <div className="lg:sticky lg:top-[100px] flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="w-full max-w-[350px] lg:pl-7">
              <span className="inline-block gold-gradient-bg text-white px-4 py-1.5 rounded-full text-[13px] font-semibold mb-5">
                정책자금 경영컨설팅
              </span>
              <h2 className="text-[28px] md:text-[36px] font-bold text-white leading-tight mb-4">
                자금 조달의 든든한
                <br />
                <span className="font-extrabold text-white">무료 상담</span>
              </h2>
              <p className="text-lg md:text-[18px] text-white/95 leading-relaxed mb-8 md:mb-10">
                피에스킴컨설팅의 체계적인 진단으로
                <br />
                정책자금 심사 통과율을 높여드립니다
              </p>

              <ul className="list-none space-y-3 mb-8 md:mb-10 inline-block text-left">
                {[
                  "심사 통과율 향상",
                  "맞춤형 자금 확보 전략",
                  "정책자금 맞춤 상담",
                  "초기상담 무료",
                ].map((text) => (
                  <li key={text} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-gold/20 border-2 border-gold/40">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-3.5 h-3.5 fill-gold"
                        style={{
                          filter: "drop-shadow(0 0 4px rgba(212,175,55,0.6))",
                        }}
                      >
                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                      </svg>
                    </div>
                    <span className="text-sm md:text-base text-white/95 font-semibold">
                      {text}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="gold-gradient-bg rounded-xl p-6 text-center w-full gold-glow">
                <h3 className="text-xl font-bold text-white mb-4">
                  피에스킴컨설팅 상담센터
                </h3>
                <div className="space-y-3">
                  <p className="text-white text-base">
                    휴대전화: <strong className="text-lg">010-8008-0186</strong>
                  </p>
                  <p className="text-white text-base">
                    상담시간: 평일 10:00 ~ 18:00
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 우측 폼 */}
          <div className="glass-light rounded-2xl p-5 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent animate-pulse-line" />

            <div className="text-center mb-6 md:mb-10">
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
                정책자금 무료 상담 신청
              </h3>
              <p className="text-sm md:text-base text-slate-500">
                정보 입력 후 전문가 맞춤 상담을 받아보세요
              </p>
              <p className="text-[9px] md:text-xs text-slate-400 mt-2.5 leading-relaxed">
                <span className="block">
                  ※ 피에스킴컨설팅은 정책자금 서류작성을 대행하지 않습니다.
                </span>
                <span className="block">※ 기업평가를 하지 않습니다.</span>
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* 기본 정보 - 4열 */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-5 mb-3 md:mb-4">
                <FormField
                  label="기업명"
                  name="company"
                  required
                  onFocus={handleFieldFocus}
                />
                <FormField
                  label="사업자번호"
                  name="bizno"
                  placeholder="000-00-00000"
                  required
                  onFormat={formatBizNo}
                  onFocus={handleFieldFocus}
                />
                <FormField
                  label="대표자명"
                  name="name"
                  required
                  onFocus={handleFieldFocus}
                />
                <FormField
                  label="연락처"
                  name="phone"
                  type="tel"
                  placeholder="010-0000-0000"
                  required
                  onFormat={formatPhone}
                  onFocus={handleFieldFocus}
                />
              </div>

              {/* 연락 정보 - 4열 */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-5 mb-3 md:mb-4">
                <FormField
                  label="이메일"
                  name="email"
                  type="email"
                  required
                  onFocus={handleFieldFocus}
                />
                <SelectField
                  label="업종"
                  name="industry"
                  options={INDUSTRIES}
                  onFocus={handleFieldFocus}
                />
                <FormField
                  label="설립연도"
                  name="founded"
                  placeholder="2020"
                  onFocus={handleFieldFocus}
                />
                <SelectField
                  label="통화 가능 시간"
                  name="consultTime"
                  options={CONSULT_TIMES}
                  required
                  onFocus={handleFieldFocus}
                />
              </div>

              {/* 필요 자금 규모 - 1열 */}
              <div className="grid grid-cols-1 gap-2.5 md:gap-5 mb-3 md:mb-4">
                <SelectField
                  label="필요 자금 규모"
                  name="amount"
                  options={AMOUNTS}
                  onFocus={handleFieldFocus}
                />
              </div>

              {/* 자금 종류 선택 */}
              <div className="mb-3 md:mb-4">
                <label className="block text-xs md:text-sm font-semibold text-slate-800 mb-2 md:mb-3">
                  지원받고 싶은 자금 종류 (복수 선택 가능)
                </label>
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  {FUND_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleFundType(type)}
                      className={`py-2 md:py-3 px-3 md:px-4 rounded-lg text-xs md:text-sm font-medium text-center transition-all duration-300 border
                        ${
                          selectedFundTypes.includes(type)
                            ? "bg-gold/10 border-gold text-gold font-semibold"
                            : "bg-slate-50/90 border-slate-200 text-slate-800 hover:border-gold/50"
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* 문의사항 */}
              <div className="mb-3 md:mb-4">
                <label className="block text-xs md:text-sm font-semibold text-slate-800 mb-1 md:mb-2">
                  문의사항
                </label>
                <textarea
                  name="message"
                  placeholder="필요하신 자금의 용도나 현재 경영 상황 등을 간략히 적어주세요"
                  onFocus={() => handleFieldFocus("message")}
                  className="w-full h-[40px] md:h-[60px] px-3 md:px-4 py-2 text-sm md:text-[15px] text-slate-800 placeholder:text-[#8b7a50] border border-slate-200 rounded-lg bg-white/90 resize-y
                    focus:outline-none focus:border-gold focus:ring-[3px] focus:ring-gold/10 transition-all"
                />
              </div>

              {/* 개인정보 동의 */}
              <div className="my-3 md:my-5 p-3 md:p-4 bg-slate-50/80 rounded-lg">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="privacy"
                    name="privacy"
                    required
                    className="w-4 h-4 md:w-[18px] md:h-[18px] mt-0.5 flex-shrink-0 cursor-pointer accent-gold"
                  />
                  <label
                    htmlFor="privacy"
                    className="text-xs md:text-sm text-slate-800 cursor-pointer leading-snug"
                  >
                    개인정보 수집·이용에 동의합니다{" "}
                    <span className="text-red-500">*</span>
                    <button
                      type="button"
                      onClick={() => setShowPrivacy(!showPrivacy)}
                      className="text-gold underline text-[11px] md:text-[13px] ml-1 bg-transparent border-none cursor-pointer"
                    >
                      내용보기
                    </button>
                  </label>
                </div>
                {showPrivacy && (
                  <div className="mt-3 md:mt-4 p-2 md:p-3 bg-white/90 border border-slate-200 rounded text-[11px] md:text-[13px] text-slate-500 leading-relaxed max-h-[120px] md:max-h-[150px] overflow-y-auto">
                    <p>
                      1. 수집항목: 기업명, 사업자번호, 대표자명, 연락처, 이메일,
                      문의내용
                    </p>
                    <p>2. 수집목적: 정책자금 상담 및 지원 서비스 제공</p>
                    <p>3. 보유기간: 서비스 종료 후 3년</p>
                    <p>4. 동의 거부 시 서비스 이용이 제한될 수 있습니다.</p>
                  </div>
                )}
              </div>

              {/* 성공/실패 메시지 */}
              {status === "success" && (
                <div className="p-4 rounded-lg bg-green-100 text-green-800 border border-green-300 text-center mb-4">
                  컨설팅 신청이 성공적으로 완료되었습니다!
                </div>
              )}
              {status === "error" && (
                <div className="p-4 rounded-lg bg-red-100 text-red-800 border border-red-300 text-center mb-4">
                  신청 처리 중 문제가 발생했습니다. 다시 시도해주세요.
                </div>
              )}

              {/* 제출 버튼 */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto gold-gradient-bg text-white py-3 md:py-4 px-6 md:px-12 rounded-lg
                    text-[15px] md:text-lg font-semibold cursor-pointer transition-all duration-300 relative overflow-hidden
                    gold-glow hover:gold-glow-hover hover:-translate-y-0.5
                    disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "신청 중..." : "무료 상담 신청하기"}
                </button>
                <p className="text-[11px] md:text-[13px] text-slate-500 mt-2.5 md:mt-3">
                  신청 후 피에스킴컨설팅 전문가가 24시간 내 연락드립니다
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function FormField({
  label,
  name,
  type = "text",
  placeholder,
  required,
  onFormat,
  onFocus,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  onFormat?: (value: string) => string;
  onFocus?: (fieldName: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs md:text-sm font-semibold text-slate-800 mb-1 md:mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        onChange={
          onFormat
            ? (e) => {
                e.target.value = onFormat(e.target.value);
              }
            : undefined
        }
        onFocus={() => onFocus?.(name)}
        className="w-full h-[38px] md:h-[46px] px-3 md:px-4 text-sm md:text-[15px] text-slate-800 placeholder:text-[#8b7a50] border border-slate-200 rounded-lg bg-white/90
          focus:outline-none focus:border-gold focus:ring-[3px] focus:ring-gold/10 transition-all"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  required,
  onFocus,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  onFocus?: (fieldName: string) => void;
}) {
  const [hasValue, setHasValue] = useState(false);

  return (
    <div>
      <label className="block text-xs md:text-sm font-semibold text-slate-800 mb-1 md:mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        required={required}
        onChange={(e) => setHasValue(e.target.value !== "")}
        onFocus={() => onFocus?.(name)}
        className={`w-full h-[38px] md:h-[46px] px-3 md:px-4 text-sm md:text-[15px] border border-slate-200 rounded-lg bg-white/90
          cursor-pointer appearance-none bg-[length:20px] bg-no-repeat bg-[right_12px_center]
          focus:outline-none focus:border-gold focus:ring-[3px] focus:ring-gold/10 transition-all
          ${hasValue ? "text-slate-800" : "text-[#8b7a50]"}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2364748b'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
          paddingRight: "40px",
        }}
      >
        <option value="" className="text-[#8b7a50]">
          선택하세요
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-slate-800">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

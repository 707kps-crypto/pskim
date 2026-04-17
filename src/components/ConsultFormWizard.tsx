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

const STEP_LABELS = ["기업 정보", "자금 정보", "연락처·문의"];

export default function ConsultFormWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [selectedFundTypes, setSelectedFundTypes] = useState<string[]>([]);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    bizno: "",
    industry: "",
    founded: "",
    amount: "",
    name: "",
    phone: "",
    email: "",
    consultTime: "",
    message: "",
  });
  const sectionRef = useRef<HTMLElement>(null);
  const formStarted = useRef(false);
  const formLoadTs = useRef<number>(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);

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

  const handleFieldFocus = (fieldName: string) => {
    if (!formStarted.current) {
      formStarted.current = true;
      trackFormStart(window.location.pathname, fieldName);
    }
  };

  const formatBizNo = (v: string) => {
    const n = v.replace(/[^0-9]/g, "");
    if (n.length <= 3) return n;
    if (n.length <= 5) return `${n.slice(0, 3)}-${n.slice(3)}`;
    return `${n.slice(0, 3)}-${n.slice(3, 5)}-${n.slice(5, 10)}`;
  };

  const formatPhone = (v: string) => {
    const n = v.replace(/[^0-9]/g, "");
    if (n.length <= 3) return n;
    if (n.length <= 7) return `${n.slice(0, 3)}-${n.slice(3)}`;
    return `${n.slice(0, 3)}-${n.slice(3, 7)}-${n.slice(7, 11)}`;
  };

  const update = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleFundType = (type: string) => {
    setSelectedFundTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const validateStep = (step: number): string | null => {
    if (step === 1) {
      if (!formData.company.trim()) return "기업명을 입력해주세요.";
      if (!formData.bizno.trim()) return "사업자번호를 입력해주세요.";
    }
    if (step === 3) {
      if (!formData.name.trim()) return "대표자명을 입력해주세요.";
      if (!formData.phone.trim()) return "연락처를 입력해주세요.";
      if (!formData.email.trim()) return "이메일을 입력해주세요.";
      if (!formData.consultTime) return "통화 가능 시간을 선택해주세요.";
    }
    return null;
  };

  const goNext = () => {
    const err = validateStep(currentStep);
    if (err) {
      alert(err);
      return;
    }
    setCurrentStep((s) => Math.min(3, s + 1));
  };

  const goPrev = () => setCurrentStep((s) => Math.max(1, s - 1));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const err = validateStep(3);
    if (err) {
      alert(err);
      return;
    }
    if (selectedFundTypes.length === 0) {
      alert("지원받고 싶은 자금 종류를 하나 이상 선택해주세요.");
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");
    try {
      const data = {
        ...formData,
        fundType: selectedFundTypes.join(", "),
        _hp: honeypotRef.current?.value || "",
        _ts: formLoadTs.current,
      };
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Submit failed");

      trackFormSubmit(window.location.pathname);
      setStatus("success");
      setFormData({
        company: "",
        bizno: "",
        industry: "",
        founded: "",
        amount: "",
        name: "",
        phone: "",
        email: "",
        consultTime: "",
        message: "",
      });
      setSelectedFundTypes([]);
      setCurrentStep(1);
      formStarted.current = false;
      formLoadTs.current = Date.now();
      if (honeypotRef.current) honeypotRef.current.value = "";
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
      className="section-dark section-padding scroll-mt-24"
    >
      <div className="max-w-content mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8 lg:gap-[60px] items-start">
          {/* ───────── 좌측: 안내 + 상담센터 ───────── */}
          <div className="lg:sticky lg:top-[100px] flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="w-full max-w-[420px]">
              <span className="inline-block gold-gradient-bg text-white px-4 py-1.5 rounded-full text-[13px] font-semibold mb-5">
                정책자금 경영컨설팅
              </span>
              <h2 className="text-[28px] md:text-[36px] font-bold text-white leading-tight mb-4">
                정부정책자금
                <br />
                <span className="font-extrabold text-white">
                  무료 심사 접수
                </span>
              </h2>
              <p className="text-[15px] md:text-[17px] text-white/95 leading-relaxed mb-8">
                기업심사관전담팀이 1:1로 분석합니다.
                <br />
                심사 통과율 97%의 검증된 프로세스를 경험하세요.
              </p>

              <ul className="list-none space-y-3 mb-8 inline-block text-left">
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
                          filter: "drop-shadow(0 0 4px rgba(201,168,76,0.6))",
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
                <div className="space-y-2">
                  <p className="text-white text-base">
                    휴대전화: <strong className="text-lg">010-8008-0186</strong>
                  </p>
                  <p className="text-white text-base">
                    상담시간: 평일 10:00 ~ 18:00
                  </p>
                </div>
              </div>

              <p className="text-[12px] text-white/60 mt-5 leading-relaxed">
                ※ 피에스킴컨설팅은 정책자금 서류작성을 대행하지 않으며,
                <br className="hidden md:block" />
                기업평가를 하지 않습니다.
              </p>
            </div>
          </div>

          {/* ───────── 우측: Wizard 폼 ───────── */}
          <div className="glass-light rounded-2xl p-5 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent animate-pulse-line" />

            {/* 헤더 */}
            <div className="text-center mb-6 md:mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
                정책자금 무료 상담 신청
              </h3>
              <p className="text-sm md:text-base text-slate-500">
                기본 정보 입력 후 맞춤 상담을 신청하세요
              </p>
            </div>

            {/* Wizard Progress */}
            <div className="flex items-center justify-center mb-6 md:mb-8 px-2">
              {STEP_LABELS.map((label, i) => {
                const stepNum = i + 1;
                const isActive = currentStep === stepNum;
                const isDone = currentStep > stepNum;
                return (
                  <div
                    key={label}
                    className={`flex items-center ${
                      i < STEP_LABELS.length - 1 ? "flex-1" : ""
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                          ${
                            isActive
                              ? "bg-gradient-to-br from-gold to-gold-dark text-white shadow-[0_4px_12px_rgba(201,168,76,0.45)]"
                              : isDone
                                ? "bg-gold-dark text-white"
                                : "bg-slate-200 text-slate-400"
                          }`}
                      >
                        {isDone ? "✓" : stepNum}
                      </div>
                      <span
                        className={`text-[11px] md:text-xs font-medium whitespace-nowrap transition-colors
                          ${
                            isActive || isDone
                              ? "text-gold-dark font-semibold"
                              : "text-slate-400"
                          }`}
                      >
                        {label}
                      </span>
                    </div>
                    {i < STEP_LABELS.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 mb-5 transition-colors duration-300 ${
                          isDone ? "bg-gold-dark" : "bg-slate-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSubmit}>
              {/* 허니팟 봇 트랩 (_hp: 봇만 채움) */}
              <input
                ref={honeypotRef}
                type="text"
                name="_hp"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: "1px",
                  height: "1px",
                  opacity: 0,
                  pointerEvents: "none",
                }}
              />

              {/* ───── Step 1: 기업 정보 ───── */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field
                      label="기업명"
                      name="company"
                      required
                      value={formData.company}
                      onChange={(v) => update("company", v)}
                      onFocus={() => handleFieldFocus("company")}
                    />
                    <Field
                      label="사업자번호"
                      name="bizno"
                      placeholder="000-00-00000"
                      required
                      value={formData.bizno}
                      onChange={(v) => update("bizno", formatBizNo(v))}
                      onFocus={() => handleFieldFocus("bizno")}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="업종"
                      name="industry"
                      options={INDUSTRIES}
                      value={formData.industry}
                      onChange={(v) => update("industry", v)}
                      onFocus={() => handleFieldFocus("industry")}
                    />
                    <Field
                      label="설립연도"
                      name="founded"
                      placeholder="2020"
                      value={formData.founded}
                      onChange={(v) => update("founded", v)}
                      onFocus={() => handleFieldFocus("founded")}
                    />
                  </div>
                </div>
              )}

              {/* ───── Step 2: 자금 정보 ───── */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  <Select
                    label="필요 자금 규모"
                    name="amount"
                    options={AMOUNTS}
                    value={formData.amount}
                    onChange={(v) => update("amount", v)}
                    onFocus={() => handleFieldFocus("amount")}
                  />
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-slate-800 mb-2">
                      지원받고 싶은 자금 종류 (복수 선택 가능)
                    </label>
                    <div className="grid grid-cols-2 gap-2 md:gap-3">
                      {FUND_TYPES.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => toggleFundType(type)}
                          className={`py-2.5 md:py-3 px-3 md:px-4 rounded-lg text-xs md:text-sm font-medium text-center transition-all duration-300 border
                            ${
                              selectedFundTypes.includes(type)
                                ? "bg-gold/10 border-gold text-gold-dark font-semibold shadow-[0_2px_8px_rgba(201,168,76,0.2)]"
                                : "bg-slate-50/90 border-slate-200 text-slate-700 hover:border-gold/50"
                            }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ───── Step 3: 연락처·문의 ───── */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field
                      label="대표자명"
                      name="name"
                      required
                      value={formData.name}
                      onChange={(v) => update("name", v)}
                      onFocus={() => handleFieldFocus("name")}
                    />
                    <Field
                      label="연락처"
                      name="phone"
                      type="tel"
                      placeholder="010-0000-0000"
                      required
                      value={formData.phone}
                      onChange={(v) => update("phone", formatPhone(v))}
                      onFocus={() => handleFieldFocus("phone")}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field
                      label="이메일"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(v) => update("email", v)}
                      onFocus={() => handleFieldFocus("email")}
                    />
                    <Select
                      label="통화 가능 시간"
                      name="consultTime"
                      required
                      options={CONSULT_TIMES}
                      value={formData.consultTime}
                      onChange={(v) => update("consultTime", v)}
                      onFocus={() => handleFieldFocus("consultTime")}
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-slate-800 mb-1.5">
                      문의사항
                    </label>
                    <textarea
                      name="message"
                      placeholder="필요하신 자금의 용도나 현재 경영 상황을 간략히 적어주세요"
                      value={formData.message}
                      onChange={(e) => update("message", e.target.value)}
                      onFocus={() => handleFieldFocus("message")}
                      className="w-full h-[80px] px-3 md:px-4 py-2 text-sm md:text-[15px] text-slate-800 placeholder:text-slate-400 border border-slate-200 rounded-lg bg-white/90 resize-y
                        focus:outline-none focus:border-gold focus:ring-[3px] focus:ring-gold/10 transition-all"
                    />
                  </div>

                  {/* 개인정보 동의 */}
                  <div className="my-3 p-3 md:p-4 bg-slate-50/80 rounded-lg">
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
                          className="text-gold-dark underline text-[11px] md:text-[13px] ml-1 bg-transparent border-none cursor-pointer"
                        >
                          내용보기
                        </button>
                      </label>
                    </div>
                    {showPrivacy && (
                      <div className="mt-3 p-2 md:p-3 bg-white/90 border border-slate-200 rounded text-[11px] md:text-[13px] text-slate-500 leading-relaxed max-h-[150px] overflow-y-auto">
                        <p>
                          1. 수집항목: 기업명, 사업자번호, 대표자명, 연락처,
                          이메일, 문의내용
                        </p>
                        <p>2. 수집목적: 정책자금 상담 및 지원 서비스 제공</p>
                        <p>3. 보유기간: 서비스 종료 후 3년</p>
                        <p>4. 동의 거부 시 서비스 이용이 제한될 수 있습니다.</p>
                      </div>
                    )}
                  </div>

                  {/* 상태 메시지 */}
                  {status === "success" && (
                    <div className="p-4 rounded-lg bg-green-100 text-green-800 border border-green-300 text-center">
                      신청이 완료되었습니다! 24시간 내 연락드립니다.
                    </div>
                  )}
                  {status === "error" && (
                    <div className="p-4 rounded-lg bg-red-100 text-red-800 border border-red-300 text-center">
                      처리 중 문제가 발생했습니다. 다시 시도해주세요.
                    </div>
                  )}
                </div>
              )}

              {/* ───── Wizard 버튼 ───── */}
              <div className="flex flex-col-reverse md:flex-row gap-3 justify-end mt-6 md:mt-8">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={goPrev}
                    className="px-6 md:px-7 py-3 rounded-lg text-sm md:text-[15px] font-semibold border border-slate-300 bg-slate-50 text-slate-600
                      hover:bg-slate-100 hover:text-slate-800 transition-all"
                  >
                    ← 이전
                  </button>
                )}
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="px-6 md:px-7 py-3 rounded-lg text-sm md:text-[15px] font-semibold text-white
                      bg-gradient-to-br from-gold to-gold-dark
                      shadow-[0_4px_12px_rgba(201,168,76,0.35)]
                      hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(201,168,76,0.5)]
                      transition-all"
                  >
                    다음 →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-7 md:px-10 py-3 md:py-3.5 rounded-lg text-sm md:text-[15px] font-bold text-white
                      bg-gradient-to-br from-gold to-gold-dark
                      shadow-[0_4px_15px_rgba(201,168,76,0.45)]
                      hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(201,168,76,0.6)]
                      disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
                      transition-all"
                  >
                    {isSubmitting ? "신청 중..." : "무료 상담 신청하기"}
                  </button>
                )}
              </div>
              {currentStep === 3 && (
                <p className="text-center text-[11px] md:text-[13px] text-slate-500 mt-3">
                  신청 후 피에스킴컨설팅 전문가가 24시간 내 연락드립니다
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── Subcomponents ─────────── */

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  value,
  onChange,
  onFocus,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  onFocus?: () => void;
}) {
  return (
    <div>
      <label className="block text-xs md:text-sm font-semibold text-slate-800 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        className="w-full h-[42px] md:h-[46px] px-3 md:px-4 text-sm md:text-[15px] text-slate-800 placeholder:text-slate-400 border border-slate-200 rounded-lg bg-white/90
          focus:outline-none focus:border-gold focus:ring-[3px] focus:ring-gold/10 transition-all"
      />
    </div>
  );
}

function Select({
  label,
  name,
  options,
  required,
  value,
  onChange,
  onFocus,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  onFocus?: () => void;
}) {
  return (
    <div>
      <label className="block text-xs md:text-sm font-semibold text-slate-800 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        className={`w-full h-[42px] md:h-[46px] px-3 md:px-4 text-sm md:text-[15px] border border-slate-200 rounded-lg bg-white/90
          cursor-pointer appearance-none bg-no-repeat bg-[right_12px_center]
          focus:outline-none focus:border-gold focus:ring-[3px] focus:ring-gold/10 transition-all
          ${value ? "text-slate-800" : "text-slate-400"}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2364748b'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
          backgroundSize: "20px",
          paddingRight: "40px",
        }}
      >
        <option value="">선택하세요</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

import { Metadata } from "next";
import { PRIVACY_POLICY } from "@/config/legal-content";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 피에스킴컨설팅",
  description: "피에스킴컨설팅 개인정보처리방침",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {PRIVACY_POLICY.title}
        </h1>
        <p className="text-sm text-gray-500 mb-10">
          최종 수정일: {PRIVACY_POLICY.lastUpdated}
        </p>

        <div className="space-y-8">
          {PRIVACY_POLICY.sections.map((section, index) => (
            <section key={index}>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                {section.heading}
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
          © 피에스킴컨설팅
        </footer>
      </div>
    </main>
  );
}

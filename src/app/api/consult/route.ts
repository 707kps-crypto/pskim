import { NextRequest, NextResponse } from "next/server";
import Airtable from "airtable";

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || "";
const AIRTABLE_TABLE = process.env.AIRTABLE_CONSULT_TABLE || "고객접수";
const CACHE_TABLE = "analytics_cache"; // 재활용 (키-값 저장용)

// ───── 보안 상수 (barun 7-Layer Defense 참조) ─────
const MIN_SUBMIT_TIME_MS = 2500;
const RATE_LIMIT_PER_HOUR = 30;
const RATE_LIMIT_TTL_SEC = 3600;
const MAX_FIELD_LENGTH = 500;
const URL_PATTERN = /(https?:\/\/|www\.)/i;
const IP_PATTERN = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
const ALLOWED_ORIGINS = [
  "https://pskim.biz",
  "https://www.pskim.biz",
  "https://admin.pskim.biz",
  "http://localhost:3000",
];

interface ConsultData {
  company: string;
  bizno: string;
  name: string;
  phone: string;
  email: string;
  industry: string;
  founded: string;
  consultTime: string;
  amount: string;
  fundType: string;
  message: string;
}

// ───── 유틸 ─────
function escapeHtml(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

// ───── Rate limit (Airtable 기반, 기존 analytics_cache 재활용) ─────
async function checkRateLimit(
  ip: string,
): Promise<{ allowed: boolean; count: number }> {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!token || !baseId) return { allowed: true, count: 0 };
  const base = new Airtable({ apiKey: token }).base(baseId);
  const key = `rl:consult:${ip}`;
  try {
    const records = await base(CACHE_TABLE)
      .select({ filterByFormula: `{cache_key} = '${key}'`, maxRecords: 1 })
      .firstPage();
    const now = Date.now();
    if (records.length > 0) {
      const r = records[0];
      const updatedAt = r.get("updated_at") as string;
      const data = r.get("data") as string;
      const ttl = (r.get("ttl_seconds") as number) || RATE_LIMIT_TTL_SEC;
      const ageSec = (now - new Date(updatedAt).getTime()) / 1000;
      const count = parseInt(data || "0", 10);
      if (ageSec > ttl) {
        // 만료 → 리셋
        await base(CACHE_TABLE).update(r.id, {
          data: "1",
          updated_at: new Date().toISOString(),
          ttl_seconds: RATE_LIMIT_TTL_SEC,
        });
        return { allowed: true, count: 1 };
      }
      if (count >= RATE_LIMIT_PER_HOUR) {
        return { allowed: false, count };
      }
      const next = count + 1;
      await base(CACHE_TABLE).update(r.id, { data: String(next) });
      return { allowed: true, count: next };
    }
    // 신규
    await base(CACHE_TABLE).create({
      cache_key: key,
      data: "1",
      updated_at: new Date().toISOString(),
      ttl_seconds: RATE_LIMIT_TTL_SEC,
    });
    return { allowed: true, count: 1 };
  } catch {
    // Rate limit fail-open (장애 시 서비스 지속)
    return { allowed: true, count: 0 };
  }
}

// ───── 보안 알림 ─────
async function notifySecurityAlert(route: string, ip: string, reason: string) {
  try {
    const bot = process.env.TELEGRAM_BOT_TOKEN;
    const chat = process.env.TELEGRAM_CHAT_ID;
    if (!bot || !chat) return;
    const msg = `🛡️ [pskim/${route}] 보안 차단\nIP: ${ip}\n사유: ${reason}`;
    await fetch(`https://api.telegram.org/bot${bot}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text: msg }),
    });
  } catch {
    // silent
  }
}

async function notifyServerError(route: string, ip: string, err: unknown) {
  try {
    const bot = process.env.TELEGRAM_BOT_TOKEN;
    const chat = process.env.TELEGRAM_CHAT_ID;
    if (!bot || !chat) return;
    const detail = String((err as Error)?.message || err).slice(0, 200);
    const msg = `⚠️ [pskim/${route}] 500 에러\nIP: ${ip}\nerror: ${detail}`;
    await fetch(`https://api.telegram.org/bot${bot}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text: msg }),
    });
  } catch {
    // silent
  }
}

// ───── Airtable 저장 ─────
async function saveToAirtable(data: ConsultData) {
  const token = process.env.AIRTABLE_TOKEN;
  if (!token) throw new Error("AIRTABLE_TOKEN not configured");
  if (!AIRTABLE_BASE_ID) throw new Error("AIRTABLE_BASE_ID not configured");
  const base = new Airtable({ apiKey: token }).base(AIRTABLE_BASE_ID);
  await base(AIRTABLE_TABLE).create({
    기업명: data.company,
    사업자번호: data.bizno,
    대표자명: data.name,
    연락처: data.phone,
    이메일: data.email,
    업종: data.industry || "",
    설립연도: data.founded || "",
    통화가능시간: data.consultTime,
    자금규모: data.amount || "",
    자금종류: data.fundType,
    문의사항: data.message || "",
    접수일시: new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
  });
}

// ───── Worker 알림 ─────
async function triggerNotifyWorker(data: ConsultData) {
  const workerUrl = process.env.WORKER_URL;
  const secret = process.env.NOTIFY_SECRET;
  if (!workerUrl || !secret) {
    console.warn(
      "[PSKim] WORKER_URL or NOTIFY_SECRET not configured, skipping notifications",
    );
    return;
  }
  await fetch(workerUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Notify-Secret": secret,
    },
    body: JSON.stringify(data),
  });
}

// ───── POST (7-Layer Defense) ─────
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const ROUTE = "consult";

  // Layer 1: CORS Origin 화이트리스트
  const origin = request.headers.get("origin") || "";
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json(
      { success: false, error: "허용되지 않은 요청입니다." },
      { status: 403 },
    );
  }

  // Layer 2: Content-Type 검증
  const ct = request.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    return NextResponse.json(
      { success: false, error: "잘못된 요청 형식입니다." },
      { status: 415 },
    );
  }

  // Layer 3: JSON 파싱 안전
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "요청을 해석할 수 없습니다." },
      { status: 400 },
    );
  }

  // Layer 4: 허니팟 봇 트랩
  if (body._hp) {
    // fake 200 (봇 기만)
    return NextResponse.json({ success: true });
  }

  // Layer 4.5: Cloudflare Turnstile 검증 (있을 때만)
  const tsSecret = process.env.TURNSTILE_SECRET_KEY;
  const tsToken = String(body._turnstile || "");
  if (tsSecret) {
    if (!tsToken) {
      void notifySecurityAlert(ROUTE, ip, "Turnstile 토큰 누락");
      return NextResponse.json(
        { success: false, error: "봇 방지 확인을 완료해주세요." },
        { status: 400 },
      );
    }
    try {
      const verifyRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: tsSecret,
            response: tsToken,
            remoteip: ip,
          }),
        },
      );
      const verifyData = (await verifyRes.json()) as { success: boolean };
      if (!verifyData.success) {
        void notifySecurityAlert(ROUTE, ip, "Turnstile 검증 실패 (봇 의심)");
        return NextResponse.json(
          { success: false, error: "봇 방지 확인이 실패했습니다." },
          { status: 400 },
        );
      }
    } catch {
      // 검증 API 실패 — fail-open은 하지 않고 차단
      return NextResponse.json(
        { success: false, error: "봇 방지 확인 중 오류가 발생했습니다." },
        { status: 503 },
      );
    }
  }

  // Layer 5: 타임스탬프 봇 감지
  const ts = Number(body._ts);
  if (ts && Date.now() - ts < MIN_SUBMIT_TIME_MS) {
    void notifySecurityAlert(ROUTE, ip, "타임스탬프 < 2.5초 (봇 의심)");
    return NextResponse.json(
      { success: false, error: "잠시 후 다시 시도해주세요." },
      { status: 429 },
    );
  }

  // Layer 7: IP Rate Limit (시간당 30건)
  const rl = await checkRateLimit(ip);
  if (!rl.allowed) {
    void notifySecurityAlert(ROUTE, ip, `Rate limit 초과 (${rl.count}/시간)`);
    return NextResponse.json(
      { success: false, error: "요청 빈도가 너무 높습니다." },
      { status: 429 },
    );
  }

  // Layer 6: 필수 필드 + 길이 + URL/IP 패턴 검증
  const data = body as unknown as ConsultData;
  if (
    !data.company ||
    !data.name ||
    !data.phone ||
    !data.email ||
    !data.consultTime
  ) {
    return NextResponse.json(
      { success: false, error: "필수 항목을 입력해주세요." },
      { status: 400 },
    );
  }
  const fieldsToCheck = [
    "company",
    "bizno",
    "name",
    "phone",
    "email",
    "industry",
    "founded",
    "consultTime",
    "amount",
    "fundType",
    "message",
  ] as const;
  for (const key of fieldsToCheck) {
    const val = String(data[key] || "");
    if (val.length > MAX_FIELD_LENGTH) {
      return NextResponse.json(
        { success: false, error: "입력값이 너무 깁니다." },
        { status: 400 },
      );
    }
  }
  // URL/IP 감지 (message 중심)
  if (URL_PATTERN.test(data.message) || IP_PATTERN.test(data.message)) {
    void notifySecurityAlert(ROUTE, ip, "URL/IP 패턴 감지 (스팸 의심)");
    return NextResponse.json(
      { success: false, error: "문의사항에 링크를 포함할 수 없습니다." },
      { status: 400 },
    );
  }

  // 저장 + 알림 (escapeHtml은 Worker에서 이미 처리)
  try {
    // XSS 방어: Airtable 저장 전 escape
    const safe: ConsultData = {
      company: escapeHtml(data.company),
      bizno: escapeHtml(data.bizno),
      name: escapeHtml(data.name),
      phone: escapeHtml(data.phone),
      email: escapeHtml(data.email),
      industry: escapeHtml(data.industry),
      founded: escapeHtml(data.founded),
      consultTime: escapeHtml(data.consultTime),
      amount: escapeHtml(data.amount),
      fundType: escapeHtml(data.fundType),
      message: escapeHtml(data.message),
    };
    await saveToAirtable(safe);
    try {
      await triggerNotifyWorker(safe);
    } catch (err) {
      console.error("[PSKim] Notify worker failed:", err);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PSKim] Consult API error:", error);
    void notifyServerError(ROUTE, ip, error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

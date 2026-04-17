interface Env {
  NOTIFY_SECRET: string;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
  GMAIL_CLIENT_ID: string;
  GMAIL_CLIENT_SECRET: string;
  GMAIL_REFRESH_TOKEN: string;
  GMAIL_USER: string;
}

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

interface MetaLeadData {
  접수일시: string;
  광고: string;
  이름: string;
  연락처: string;
  사업자종류: string;
  지역: string;
  업종: string;
  상호명: string;
  직전년도매출: string;
  회생파산불가안내: string;
}

// ─── Gmail API (OAuth2 REST) ───

async function refreshAccessToken(env: Env): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GMAIL_CLIENT_ID,
      client_secret: env.GMAIL_CLIENT_SECRET,
      refresh_token: env.GMAIL_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });
  const data = (await res.json()) as { access_token?: string; error?: string };
  if (!data.access_token)
    throw new Error(`Token refresh failed: ${data.error || "unknown"}`);
  return data.access_token;
}

function toBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function encodeMimeWord(text: string): string {
  return (
    "=?UTF-8?B?" +
    btoa(String.fromCharCode(...new TextEncoder().encode(text))) +
    "?="
  );
}

async function sendGmail(env: Env, to: string, subject: string, html: string) {
  const accessToken = await refreshAccessToken(env);

  const raw = [
    `From: "${encodeMimeWord("제이앤아이 파트너스")}" <${env.GMAIL_USER}>`,
    `To: ${to}`,
    `Subject: ${encodeMimeWord(subject)}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    btoa(String.fromCharCode(...new TextEncoder().encode(html))),
  ].join("\r\n");

  const res = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: toBase64Url(raw) }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gmail send failed: ${res.status} ${err}`);
  }
}

// ─── Telegram ───

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildTelegramMessage(data: ConsultData, now: string): string {
  let msg = "🔔 <b>JNI 신규 상담 접수</b>\n\n";
  msg += "👤 <b>고객정보</b>\n";
  msg += "├ 기업명: <b>" + escapeHtml(data.company) + "</b>\n";
  msg += "├ 사업자번호: " + escapeHtml(data.bizno) + "\n";
  msg += "├ 대표자명: <b>" + escapeHtml(data.name) + "</b>\n";
  msg += "├ 연락처: <code>" + escapeHtml(data.phone) + "</code>\n";
  msg += "├ 이메일: " + escapeHtml(data.email) + "\n";
  msg += "├ 업종: " + escapeHtml(data.industry || "-") + "\n";
  msg += "└ 설립연도: " + escapeHtml(data.founded || "-") + "\n\n";
  msg += "💰 <b>자금정보</b>\n";
  msg += "├ 통화가능: <b>" + escapeHtml(data.consultTime) + "</b>\n";
  msg += "├ 규모: " + escapeHtml(data.amount || "-") + "\n";
  msg += "└ 종류: " + escapeHtml(data.fundType || "-") + "\n";
  if (data.message && data.message !== "-") {
    msg += "\n💬 <b>문의</b>\n" + escapeHtml(data.message) + "\n";
  }
  msg += "\n📅 " + now;
  msg +=
    '\n\n📊 <a href="https://jnipartners.co.kr/dashboard/leads">접수관리 바로가기</a>';
  return msg;
}

async function sendTelegram(env: Env, data: ConsultData, now: string) {
  const res = await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text: buildTelegramMessage(data, now),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    },
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Telegram send failed: ${res.status} ${err}`);
  }
}

// ─── 고객 확인 이메일 HTML ───

function buildCustomerEmailHtml(data: ConsultData, now: string): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>상담 접수 확인</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,'Apple SD Gothic Neo','Noto Sans KR',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f4f6;padding:24px 0;">
  <tr><td align="center">
    <table width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;background:#ffffff;">

      <!-- Header -->
      <tr>
        <td style="background:#0f172e;padding:18px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="color:#d4af37;font-size:15px;font-weight:300;letter-spacing:5px;text-transform:uppercase;">JNI PARTNERS</td>
              <td align="right" style="color:rgba(255,255,255,0.5);font-size:10px;letter-spacing:2px;text-transform:uppercase;">Consultation Confirmed</td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Notice Banner -->
      <tr>
        <td style="background:#fefce8;border-left:3px solid #d4af37;padding:9px 24px;font-size:12px;color:#92400e;letter-spacing:0.3px;">
          상담 접수가 정상적으로 완료되었습니다 — 담당 전문가가 연락드리겠습니다.
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:24px 28px 20px;">

          <!-- Section: 접수 확인 -->
          <p style="font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#777;margin:0 0 10px 0;padding-bottom:7px;border-bottom:1px solid #f0f0f0;">접수 확인</p>

          <!-- Client Row -->
          <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:18px;">
            <tr>
              <td style="font-size:20px;font-weight:400;color:#1a1a1a;letter-spacing:0.5px;padding-right:16px;">${data.name} 대표님</td>
              <td style="font-size:14px;color:#d4af37;font-weight:500;letter-spacing:0.5px;">${data.company}</td>
            </tr>
          </table>

          <!-- Section: 접수 내용 -->
          <p style="font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#777;margin:0 0 10px 0;padding-bottom:7px;border-bottom:1px solid #f0f0f0;">접수 내용</p>

          <!-- 3-col Info Grid -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border:1px solid #f0f0f0;margin-bottom:16px;">
            <tr>
              <td width="33%" style="background:#ffffff;padding:10px 14px;border-right:1px solid #f0f0f0;">
                <p style="font-size:9px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#888;margin:0 0 3px 0;">자금종류</p>
                <p style="font-size:13px;color:#1a1a1a;margin:0;">${data.fundType || "-"}</p>
              </td>
              <td width="33%" style="background:#ffffff;padding:10px 14px;border-right:1px solid #f0f0f0;">
                <p style="font-size:9px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#888;margin:0 0 3px 0;">자금규모</p>
                <p style="font-size:13px;color:#d4af37;font-weight:500;margin:0;">${data.amount || "-"}</p>
              </td>
              <td width="34%" style="background:#ffffff;padding:10px 14px;">
                <p style="font-size:9px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#888;margin:0 0 3px 0;">통화시간</p>
                <p style="font-size:13px;color:#1a1a1a;margin:0;">${data.consultTime}</p>
              </td>
            </tr>
          </table>

          <!-- Bottom Row -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fafafa;padding:10px 14px;">
            <tr>
              <td>
                <table cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size:9px;letter-spacing:1px;color:#888;text-transform:uppercase;padding-right:6px;">접수일시</td>
                    <td style="font-size:12px;color:#333;">${now}</td>
                  </tr>
                </table>
              </td>
              <td align="right">
                <a href="tel:15339018" style="display:inline-block;background:#0f172e;color:#d4af37;text-decoration:none;padding:8px 18px;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;font-weight:500;">&#128222; 1533-9018</a>
              </td>
            </tr>
          </table>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#fafafa;border-top:1px solid #f0f0f0;padding:12px 28px;text-align:center;">
          <p style="font-size:10px;color:#888;margin:0;line-height:1.6;letter-spacing:0.3px;">제이앤아이 파트너스 자동 알림 &middot; 서울특별시 강남구 &middot; 1533-9018</p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// ─── 사내 알림 이메일 HTML ───

function buildStaffEmailHtml(data: ConsultData, now: string): string {
  const messageBlock =
    data.message && data.message !== "-"
      ? `<tr><td style="padding:0 28px 16px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fafafa;padding:12px 14px;">
            <tr><td>
              <p style="font-size:9px;letter-spacing:1px;color:#888;text-transform:uppercase;margin:0 0 4px 0;">Message</p>
              <p style="font-size:12px;color:#333;line-height:1.6;margin:0;white-space:pre-wrap;">${data.message}</p>
            </td></tr>
          </table>
        </td></tr>`
      : "";

  const founded2col = data.founded
    ? `<tr><td style="padding:0 28px 16px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border:1px solid #f0f0f0;margin-top:1px;">
            <tr>
              <td width="50%" style="background:#ffffff;padding:10px 14px;border-right:1px solid #f0f0f0;">
                <p style="font-size:9px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#888;margin:0 0 3px 0;">설립연도</p>
                <p style="font-size:13px;color:#1a1a1a;margin:0;">${data.founded}</p>
              </td>
              <td width="50%" style="background:#ffffff;padding:10px 14px;">
                <p style="font-size:9px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#888;margin:0 0 3px 0;">전년도매출</p>
                <p style="font-size:13px;color:#1a1a1a;margin:0;">-</p>
              </td>
            </tr>
          </table>
        </td></tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>상담 접수 알림</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,'Apple SD Gothic Neo','Noto Sans KR',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f4f6;padding:24px 0;">
  <tr><td align="center">
    <table width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;background:#ffffff;">

      <!-- Header -->
      <tr>
        <td style="background:#0f172e;padding:18px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="color:#d4af37;font-size:15px;font-weight:300;letter-spacing:5px;text-transform:uppercase;">JNI PARTNERS</td>
              <td align="right" style="color:rgba(255,255,255,0.5);font-size:10px;letter-spacing:2px;text-transform:uppercase;">Consultation Alert</td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Notice Banner -->
      <tr>
        <td style="background:#fefce8;border-left:3px solid #d4af37;padding:9px 24px;font-size:12px;color:#92400e;letter-spacing:0.3px;">
          새로운 상담 신청이 접수되었습니다 &mdash; ${now}
        </td>
      </tr>

      <!-- Body -->
      <tr><td style="padding:24px 28px 4px;">

        <!-- Section: CLIENT -->
        <p style="font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#777;margin:0 0 10px 0;padding-bottom:7px;border-bottom:1px solid #f0f0f0;">Client</p>

        <!-- Client Row -->
        <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:18px;">
          <tr>
            <td style="font-size:20px;font-weight:400;color:#1a1a1a;letter-spacing:0.5px;padding-right:16px;">${data.name}</td>
            <td style="font-size:14px;color:#d4af37;font-weight:500;letter-spacing:0.5px;padding-right:16px;">${data.phone}</td>
            <td style="font-size:12px;color:#666;letter-spacing:0.3px;">${data.email}</td>
          </tr>
        </table>

        <!-- Section: 기업 정보 -->
        <p style="font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#777;margin:0 0 10px 0;padding-bottom:7px;border-bottom:1px solid #f0f0f0;">기업 정보</p>

      </td></tr>

      <!-- 기업 정보 3-col Grid -->
      <tr>
        <td style="padding:0 28px 16px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border:1px solid #f0f0f0;">
            <tr>
              <td width="33%" style="background:#ffffff;padding:10px 14px;border-right:1px solid #f0f0f0;">
                <p style="font-size:9px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#888;margin:0 0 3px 0;">기업명</p>
                <p style="font-size:13px;color:#1a1a1a;font-weight:600;margin:0;">${data.company}</p>
              </td>
              <td width="33%" style="background:#ffffff;padding:10px 14px;border-right:1px solid #f0f0f0;">
                <p style="font-size:9px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#888;margin:0 0 3px 0;">사업자번호</p>
                <p style="font-size:13px;color:#1a1a1a;margin:0;">${data.bizno || "-"}</p>
              </td>
              <td width="34%" style="background:#ffffff;padding:10px 14px;">
                <p style="font-size:9px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#888;margin:0 0 3px 0;">업종</p>
                <p style="font-size:13px;color:#1a1a1a;margin:0;">${data.industry || "-"}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Section: 자금 정보 label -->
      <tr>
        <td style="padding:0 28px 10px;">
          <p style="font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#777;margin:0;padding-bottom:7px;border-bottom:1px solid #f0f0f0;">자금 정보</p>
        </td>
      </tr>

      <!-- 자금 정보 3-col Grid -->
      <tr>
        <td style="padding:0 28px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border:1px solid #f0f0f0;">
            <tr>
              <td width="33%" style="background:#ffffff;padding:10px 14px;border-right:1px solid #f0f0f0;">
                <p style="font-size:9px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#888;margin:0 0 3px 0;">자금규모</p>
                <p style="font-size:13px;color:#d4af37;font-weight:500;margin:0;">${data.amount || "-"}</p>
              </td>
              <td width="33%" style="background:#ffffff;padding:10px 14px;border-right:1px solid #f0f0f0;">
                <p style="font-size:9px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#888;margin:0 0 3px 0;">자금종류</p>
                <p style="font-size:13px;color:#1a1a1a;margin:0;">${data.fundType || "-"}</p>
              </td>
              <td width="34%" style="background:#ffffff;padding:10px 14px;">
                <p style="font-size:9px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#888;margin:0 0 3px 0;">통화시간</p>
                <p style="font-size:13px;color:#d4af37;font-weight:500;margin:0;">${data.consultTime}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- 설립연도 2-col (조건부) -->
      ${founded2col}

      <!-- Message (조건부) -->
      ${messageBlock}

      <!-- Bottom Row -->
      <tr>
        <td style="padding:0 28px 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fafafa;padding:10px 14px;margin-top:16px;">
            <tr>
              <td>
                <table cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size:9px;letter-spacing:1px;color:#888;text-transform:uppercase;padding-right:6px;">접수</td>
                    <td style="font-size:12px;color:#333;padding-right:16px;">홈페이지</td>
                    <td style="font-size:9px;letter-spacing:1px;color:#888;text-transform:uppercase;padding-right:6px;">접수일시</td>
                    <td style="font-size:12px;color:#333;">${now}</td>
                  </tr>
                </table>
              </td>
              <td align="right">
                <a href="tel:${data.phone.replace(/-/g, "")}" style="display:inline-block;background:#0f172e;color:#d4af37;text-decoration:none;padding:8px 18px;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;font-weight:500;">&#128222; 바로 전화</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#fafafa;border-top:1px solid #f0f0f0;padding:12px 28px;text-align:center;">
          <p style="font-size:10px;color:#888;margin:0;line-height:1.6;letter-spacing:0.3px;">제이앤아이 파트너스 자동 알림 &middot; whddlr2006@gmail.com</p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// ─── Meta 리드 텔레그램 메시지 ───

function buildMetaTelegramMessage(data: MetaLeadData): string {
  let msg = "📢 <b>META 광고 신규 접수</b>\n\n";
  msg += "👤 <b>고객정보</b>\n";
  msg += "├ 이름: <b>" + escapeHtml(data.이름) + "</b>\n";
  msg += "├ 연락처: <code>" + escapeHtml(data.연락처) + "</code>\n";
  msg += "├ 상호명: " + escapeHtml(data.상호명 || "-") + "\n";
  msg += "├ 사업자종류: " + escapeHtml(data.사업자종류 || "-") + "\n";
  msg += "├ 업종: " + escapeHtml(data.업종 || "-") + "\n";
  msg += "├ 지역: " + escapeHtml(data.지역 || "-") + "\n";
  msg += "├ 직전년도매출: " + escapeHtml(data.직전년도매출 || "-") + "\n";
  msg += "└ 회생/파산: " + escapeHtml(data.회생파산불가안내 || "-") + "\n\n";
  msg += "📣 광고: " + escapeHtml(data.광고 || "-") + "\n";
  msg +=
    "📅 " +
    escapeHtml(
      data.접수일시 ||
        new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
    );
  msg +=
    '\n\n📊 <a href="https://jnipartners.co.kr/dashboard/leads">접수관리 바로가기</a>';
  return msg;
}

async function sendMetaTelegram(env: Env, data: MetaLeadData) {
  const res = await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text: buildMetaTelegramMessage(data),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    },
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Telegram send failed: ${res.status} ${err}`);
  }
}

// ─── Meta 리드 사내 이메일 HTML ───

function buildMetaStaffEmailHtml(data: MetaLeadData): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>META 광고 접수 알림</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,'Apple SD Gothic Neo','Noto Sans KR',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f4f6;padding:24px 0;">
  <tr><td align="center">
    <table width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;background:#ffffff;">

      <!-- Header -->
      <tr>
        <td style="background:#0f172e;padding:18px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="color:#d4af37;font-size:15px;font-weight:300;letter-spacing:5px;text-transform:uppercase;">JNI PARTNERS</td>
              <td align="right" style="color:rgba(255,255,255,0.5);font-size:10px;letter-spacing:2px;text-transform:uppercase;">Meta Lead Alert</td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Notice Banner -->
      <tr>
        <td style="background:#eef2ff;border-left:3px solid #6366f1;padding:9px 24px;font-size:12px;color:#3730a3;letter-spacing:0.3px;">
          META 광고를 통한 새로운 접수입니다 &mdash; ${escapeHtml(data.접수일시 || "")}
        </td>
      </tr>

      <!-- Body -->
      <tr><td style="padding:24px 28px 4px;">
        <p style="font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#777;margin:0 0 10px 0;padding-bottom:7px;border-bottom:1px solid #f0f0f0;">Client</p>
        <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:18px;">
          <tr>
            <td style="font-size:20px;font-weight:400;color:#1a1a1a;letter-spacing:0.5px;padding-right:16px;">${escapeHtml(data.이름)}</td>
            <td style="font-size:14px;color:#d4af37;font-weight:500;letter-spacing:0.5px;">${escapeHtml(data.연락처)}</td>
          </tr>
        </table>
        <p style="font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#777;margin:0 0 10px 0;padding-bottom:7px;border-bottom:1px solid #f0f0f0;">기업 정보</p>
      </td></tr>

      <!-- 기업 정보 Grid -->
      <tr><td style="padding:0 28px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border:1px solid #f0f0f0;">
          <tr>
            <td width="33%" style="background:#fff;padding:10px 14px;border-right:1px solid #f0f0f0;">
              <p style="font-size:9px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#888;margin:0 0 3px 0;">상호명</p>
              <p style="font-size:13px;color:#1a1a1a;font-weight:600;margin:0;">${escapeHtml(data.상호명 || "-")}</p>
            </td>
            <td width="33%" style="background:#fff;padding:10px 14px;border-right:1px solid #f0f0f0;">
              <p style="font-size:9px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#888;margin:0 0 3px 0;">사업자종류</p>
              <p style="font-size:13px;color:#1a1a1a;margin:0;">${escapeHtml(data.사업자종류 || "-")}</p>
            </td>
            <td width="34%" style="background:#fff;padding:10px 14px;">
              <p style="font-size:9px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#888;margin:0 0 3px 0;">업종</p>
              <p style="font-size:13px;color:#1a1a1a;margin:0;">${escapeHtml(data.업종 || "-")}</p>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- 추가 정보 Grid -->
      <tr><td style="padding:0 28px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border:1px solid #f0f0f0;">
          <tr>
            <td width="33%" style="background:#fff;padding:10px 14px;border-right:1px solid #f0f0f0;">
              <p style="font-size:9px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#888;margin:0 0 3px 0;">지역</p>
              <p style="font-size:13px;color:#1a1a1a;margin:0;">${escapeHtml(data.지역 || "-")}</p>
            </td>
            <td width="33%" style="background:#fff;padding:10px 14px;border-right:1px solid #f0f0f0;">
              <p style="font-size:9px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#888;margin:0 0 3px 0;">직전년도매출</p>
              <p style="font-size:13px;color:#d4af37;font-weight:500;margin:0;">${escapeHtml(data.직전년도매출 || "-")}</p>
            </td>
            <td width="34%" style="background:#fff;padding:10px 14px;">
              <p style="font-size:9px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#888;margin:0 0 3px 0;">회생/파산</p>
              <p style="font-size:13px;color:#1a1a1a;margin:0;">${escapeHtml(data.회생파산불가안내 || "-")}</p>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- Bottom Row -->
      <tr><td style="padding:0 28px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fafafa;padding:10px 14px;">
          <tr>
            <td>
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size:9px;letter-spacing:1px;color:#888;text-transform:uppercase;padding-right:6px;">접수</td>
                  <td style="font-size:12px;color:#6366f1;font-weight:500;padding-right:16px;">META 광고</td>
                  <td style="font-size:9px;letter-spacing:1px;color:#888;text-transform:uppercase;padding-right:6px;">광고명</td>
                  <td style="font-size:12px;color:#333;">${escapeHtml(data.광고 || "-")}</td>
                </tr>
              </table>
            </td>
            <td align="right">
              <a href="tel:${(data.연락처 || "").replace(/-/g, "")}" style="display:inline-block;background:#0f172e;color:#d4af37;text-decoration:none;padding:8px 18px;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;font-weight:500;">&#128222; 바로 전화</a>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- Footer -->
      <tr>
        <td style="background:#fafafa;border-top:1px solid #f0f0f0;padding:12px 28px;text-align:center;">
          <p style="font-size:10px;color:#888;margin:0;line-height:1.6;letter-spacing:0.3px;">제이앤아이 파트너스 자동 알림 &middot; whddlr2006@gmail.com</p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// ─── Worker Entry ───

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, X-Notify-Secret",
        },
      });
    }

    if (request.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    // 인증 확인
    const secret = request.headers.get("X-Notify-Secret");
    if (!secret || secret !== env.NOTIFY_SECRET) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // ─── META 리드 접수 ───
    if (path === "/meta") {
      const data: MetaLeadData = await request.json();

      const results = await Promise.allSettled([
        // 1. 텔레그램 알림
        sendMetaTelegram(env, data),
        // 2. 사내 알림 이메일
        sendGmail(
          env,
          `${env.GMAIL_USER}, mkt@polarad.co.kr`,
          `[META접수] ${data.상호명 || data.이름} - ${data.이름}`,
          buildMetaStaffEmailHtml(data),
        ),
      ]);

      const errors = results
        .map((r, i) =>
          r.status === "rejected"
            ? { index: i, reason: String((r as PromiseRejectedResult).reason) }
            : null,
        )
        .filter(Boolean);

      return Response.json({
        success: errors.length === 0,
        source: "meta",
        sent: {
          telegram: results[0].status === "fulfilled",
          staffEmail: results[1].status === "fulfilled",
        },
        errors: errors.length > 0 ? errors : undefined,
      });
    }

    // ─── 홈페이지 상담 접수 (기존) ───
    const data: ConsultData = await request.json();
    const now = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

    const results = await Promise.allSettled([
      // 1. 텔레그램 알림 (사내)
      sendTelegram(env, data, now),
      // 2. 사내 알림 이메일
      sendGmail(
        env,
        `${env.GMAIL_USER}, mkt@polarad.co.kr`,
        `[상담신청] ${data.company} - ${data.name} 대표`,
        buildStaffEmailHtml(data, now),
      ),
      // 3. 고객 확인 이메일
      sendGmail(
        env,
        data.email,
        `[제이앤아이 파트너스] 상담 접수가 완료되었습니다`,
        buildCustomerEmailHtml(data, now),
      ),
    ]);

    const errors = results
      .map((r, i) =>
        r.status === "rejected"
          ? { index: i, reason: String((r as PromiseRejectedResult).reason) }
          : null,
      )
      .filter(Boolean);

    return Response.json({
      success: errors.length === 0,
      sent: {
        telegram: results[0].status === "fulfilled",
        staffEmail: results[1].status === "fulfilled",
        customerEmail: results[2].status === "fulfilled",
      },
      errors: errors.length > 0 ? errors : undefined,
    });
  },
};

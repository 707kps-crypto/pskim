import { NextRequest, NextResponse } from "next/server";

// 인메모리 인증번호 저장 (서버리스 환경에서는 동일 인스턴스 내에서만 유효)
const codeStore = new Map<string, { code: string; expiresAt: number }>();

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendTelegramMessage(text: string): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) return false;

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
        }),
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}

// 인증번호 요청
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, code: inputCode } = body;

    // 인증번호 발송
    if (action === "send-code") {
      const code = generateCode();
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5분

      // 기존 코드 정리
      Array.from(codeStore.entries()).forEach(([key, val]) => {
        if (val.expiresAt < Date.now()) codeStore.delete(key);
      });

      codeStore.set("admin", { code, expiresAt });

      const sent = await sendTelegramMessage(
        `🔐 <b>JNI Partners 관리자 인증번호</b>\n\n인증번호: <code>${code}</code>\n유효시간: 5분`,
      );

      if (!sent) {
        return NextResponse.json(
          { success: false, error: "텔레그램 전송에 실패했습니다." },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "인증번호가 전송되었습니다.",
      });
    }

    // 인증번호 검증
    if (action === "verify-code") {
      const stored = codeStore.get("admin");

      if (!stored) {
        return NextResponse.json(
          { success: false, error: "인증번호를 먼저 요청해주세요." },
          { status: 400 },
        );
      }

      if (stored.expiresAt < Date.now()) {
        codeStore.delete("admin");
        return NextResponse.json(
          {
            success: false,
            error: "인증번호가 만료되었습니다. 다시 요청해주세요.",
          },
          { status: 401 },
        );
      }

      if (stored.code !== inputCode) {
        return NextResponse.json(
          { success: false, error: "인증번호가 올바르지 않습니다." },
          { status: 401 },
        );
      }

      // 인증 성공 - 코드 삭제 후 쿠키 설정
      codeStore.delete("admin");

      const response = NextResponse.json({ success: true });
      response.cookies.set("admin_auth", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7일
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: "잘못된 요청입니다." },
      { status: 400 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "서버 오류" },
      { status: 500 },
    );
  }
}

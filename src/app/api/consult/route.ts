import { NextRequest, NextResponse } from "next/server";
import Airtable from "airtable";

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || "";
const AIRTABLE_TABLE = process.env.AIRTABLE_CONSULT_TABLE || "고객접수";

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

export async function POST(request: NextRequest) {
  try {
    const data: ConsultData = await request.json();

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

    await saveToAirtable(data);

    try {
      await triggerNotifyWorker(data);
    } catch (err) {
      console.error("[PSKim] Notify worker failed:", err);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PSKim] Consult API error:", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

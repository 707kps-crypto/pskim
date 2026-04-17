import { NextRequest, NextResponse } from "next/server";
import Airtable from "airtable";

const AIRTABLE_BASE_ID = "appxU3n3KqoUr3l9e";
const AIRTABLE_TABLE = "고객접수";
const META_TABLE = "tbl7hadkFGFGzkc0x";

function getBase() {
  const token = process.env.AIRTABLE_TOKEN;
  if (!token) throw new Error("AIRTABLE_TOKEN not configured");
  return new Airtable({ apiKey: token }).base(AIRTABLE_BASE_ID);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const base = getBase();
    const records: Record<string, unknown>[] = [];
    const source = searchParams.get("source");

    // 홈페이지 접수 조회
    if (!source || source === "homepage" || source === "all") {
      await new Promise<void>((resolve, reject) => {
        const queryOptions: Record<string, unknown> = {
          maxRecords: 200,
          sort: [{ field: "접수일시", direction: "desc" }],
        };

        if (status && status !== "전체") {
          queryOptions.filterByFormula = `{상태} = '${status}'`;
        }

        base(AIRTABLE_TABLE)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .select(queryOptions as any)
          .eachPage(
            (pageRecords, fetchNextPage) => {
              pageRecords.forEach((record) => {
                records.push({
                  id: record.id,
                  기업명: record.get("기업명") || "",
                  사업자번호: record.get("사업자번호") || "",
                  대표자명: record.get("대표자명") || "",
                  연락처: record.get("연락처") || "",
                  이메일: record.get("이메일") || "",
                  업종: record.get("업종") || "",
                  설립연도: record.get("설립연도") || "",
                  통화가능시간: record.get("통화가능시간") || "",
                  자금규모: record.get("자금규모") || "",
                  자금종류: record.get("자금종류") || "",
                  문의사항: record.get("문의사항") || "",
                  접수일시: record.get("접수일시") || "",
                  상태: record.get("상태") || "신규",
                  메모: record.get("메모") || "",
                  유입경로: "홈페이지",
                  _table: AIRTABLE_TABLE,
                });
              });
              fetchNextPage();
            },
            (err) => {
              if (err) reject(err);
              else resolve();
            },
          );
      });
    }

    // META 접수 조회
    if (!source || source === "meta" || source === "all") {
      await new Promise<void>((resolve, reject) => {
        const queryOptions: Record<string, unknown> = {
          maxRecords: 200,
          sort: [{ field: "접수일시", direction: "desc" }],
        };

        base(META_TABLE)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .select(queryOptions as any)
          .eachPage(
            (pageRecords, fetchNextPage) => {
              pageRecords.forEach((record) => {
                records.push({
                  id: record.id,
                  기업명: record.get("상호명") || "",
                  사업자번호: "",
                  대표자명: record.get("이름") || "",
                  연락처: record.get("연락처") || "",
                  이메일: "",
                  업종: record.get("업종") || "",
                  설립연도: "",
                  통화가능시간: "",
                  자금규모: record.get("직전년도 매출") || "",
                  자금종류: "",
                  문의사항: record.get("회생 파산 불가안내") || "",
                  접수일시: record.get("접수일시") || "",
                  상태: record.get("상태") || "신규",
                  메모: record.get("메모") || "",
                  유입경로: `META(${record.get("광고") || ""})`,
                  _table: META_TABLE,
                  사업자종류: record.get("사업자종류") || "",
                  지역: record.get("지역") || "",
                });
              });
              fetchNextPage();
            },
            (err) => {
              if (err) reject(err);
              else resolve();
            },
          );
      });
    }

    // 접수일시 기준 정렬
    records.sort((a, b) => {
      const dateA = String(a.접수일시 || "");
      const dateB = String(b.접수일시 || "");
      return dateB.localeCompare(dateA);
    });

    // 통계 계산
    const stats = {
      total: records.length,
      신규: records.filter((r) => r.상태 === "신규").length,
      대기: records.filter((r) => r.상태 === "대기").length,
      상담중: records.filter((r) => r.상태 === "상담중").length,
      진행중: records.filter((r) => r.상태 === "진행중").length,
      완료: records.filter((r) => r.상태 === "완료").length,
      블랙리스트: records.filter((r) => r.상태 === "블랙리스트").length,
    };

    return NextResponse.json({ success: true, leads: records, stats });
  } catch (error) {
    console.error("[JNI] Leads API error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status: newStatus, memo, _table } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID가 필요합니다." },
        { status: 400 },
      );
    }

    const base = getBase();
    const tableName = _table === META_TABLE ? META_TABLE : AIRTABLE_TABLE;
    const updateFields: Record<string, string> = {};

    if (newStatus) updateFields["상태"] = newStatus;
    if (memo !== undefined) updateFields["메모"] = memo;

    await base(tableName).update(id, updateFields);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[JNI] Leads PATCH error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const table = searchParams.get("table");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID가 필요합니다." },
        { status: 400 },
      );
    }

    const base = getBase();
    const tableName = table === META_TABLE ? META_TABLE : AIRTABLE_TABLE;
    await base(tableName).destroy(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[JNI] Leads DELETE error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}

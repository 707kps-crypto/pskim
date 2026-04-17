import type { MetadataRoute } from "next";

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || "";
const BOARD_TABLE_ID = process.env.AIRTABLE_BOARD_TABLE_ID || "";

const FIELD_IDS = {
  공개여부: "fldm8h6kOZgm5m3RI",
  작성일: "fldSbr9C2GwynTPzZ",
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://pskim.biz";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/company`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/process`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/fund`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pro`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/mkt`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // 동적 게시글 URL 추가
  let boardPages: MetadataRoute.Sitemap = [];
  try {
    if (AIRTABLE_TOKEN) {
      const params = new URLSearchParams({
        maxRecords: "100",
        returnFieldsByFieldId: "true",
      });
      const res = await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${BOARD_TABLE_ID}?${params}`,
        {
          headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
          next: { revalidate: 3600 },
        },
      );
      if (res.ok) {
        const data = await res.json();
        boardPages = data.records
          .filter(
            (r: { fields: Record<string, unknown> }) =>
              r.fields[FIELD_IDS.공개여부] !== false,
          )
          .map(
            (r: {
              id: string;
              fields: Record<string, unknown>;
              createdTime: string;
            }) => ({
              url: `${baseUrl}/board/${r.id}`,
              lastModified: r.fields[FIELD_IDS.작성일]
                ? new Date(r.fields[FIELD_IDS.작성일] as string)
                : new Date(r.createdTime),
              changeFrequency: "monthly" as const,
              priority: 0.6,
            }),
          );
      }
    }
  } catch {
    // 게시글 fetch 실패 시 정적 페이지만 반환
  }

  return [...staticPages, ...boardPages];
}

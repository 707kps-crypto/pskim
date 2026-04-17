import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "피에스킴컨설팅 - 정책자금 경영컨설팅 전문기업";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  let fontData: ArrayBuffer | undefined;
  try {
    const fontRes = await fetch(
      "https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-kr@5.1.0/files/noto-sans-kr-korean-700-normal.woff",
    );
    if (fontRes.ok) fontData = await fontRes.arrayBuffer();
  } catch {
    // fallback without Korean font
  }

  const fontFamily = fontData ? '"Noto Sans KR"' : "sans-serif";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(160deg, #080e1a 0%, #0d1829 30%, #131d30 60%, #0d1829 100%)",
        fontFamily,
        position: "relative",
      }}
    >
      {/* Top gold accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background:
            "linear-gradient(90deg, transparent 5%, #d4af37 50%, transparent 95%)",
        }}
      />

      {/* Logo from public URL */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://pskim.biz/images/logo.png"
        width={110}
        height={110}
        style={{ marginBottom: 28 }}
        alt=""
      />

      {/* Company name */}
      <div
        style={{
          fontSize: 52,
          fontWeight: 700,
          color: "#ffffff",
          marginBottom: 14,
          letterSpacing: "-0.02em",
        }}
      >
        피에스킴컨설팅
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: "#d4af37",
          marginBottom: 40,
        }}
      >
        정책자금 경영컨설팅 전문기업
      </div>

      {/* Key stats */}
      <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 34, fontWeight: 700, color: "#d4af37" }}>
            97%
          </div>
          <div style={{ fontSize: 15, color: "#94a3b8", marginTop: 6 }}>
            심사 통과율
          </div>
        </div>

        <div style={{ width: 1, height: 44, background: "#334155" }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 34, fontWeight: 700, color: "#d4af37" }}>
            418건+
          </div>
          <div style={{ fontSize: 15, color: "#94a3b8", marginTop: 6 }}>
            성공 실적
          </div>
        </div>

        <div style={{ width: 1, height: 44, background: "#334155" }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 34, fontWeight: 700, color: "#d4af37" }}>
            2.8억
          </div>
          <div style={{ fontSize: 15, color: "#94a3b8", marginTop: 6 }}>
            평균 조달액
          </div>
        </div>
      </div>

      {/* URL */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          fontSize: 16,
          color: "#475569",
          letterSpacing: "0.06em",
        }}
      >
        pskim.biz
      </div>

      {/* Bottom gold accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background:
            "linear-gradient(90deg, transparent 5%, #d4af37 50%, transparent 95%)",
        }}
      />
    </div>,
    {
      ...size,
      ...(fontData
        ? {
            fonts: [
              {
                name: "Noto Sans KR",
                data: fontData,
                weight: 700 as const,
                style: "normal" as const,
              },
            ],
          }
        : {}),
    },
  );
}

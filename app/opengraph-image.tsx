import fs from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { TAGLINE } from "@/lib/site";
import { WORDMARK_PATH, WORDMARK_WIDTH } from "@/lib/wordmark-path";

export const alt = `Velyr. ${TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default async function OpengraphImage() {
  // Static Archivo 500 subset (OFL), so the tagline renders in the brand face.
  const font = await fs.readFile(path.join(process.cwd(), "assets/archivo-500.ttf"));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0E0F0C",
          color: "#F2F0E9",
          fontFamily: "Archivo",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <svg width="168" height="168" viewBox="0 0 64 64">
            <path d="M4 8h13l13 48H17z" fill="#F2F0E9" />
            <path d="M60 8H47L34 56h13z" fill="#F2F0E9" />
            <rect x="28" y="30" width="8" height="8" fill="#C6F432" />
          </svg>
          <svg width={WORDMARK_WIDTH * 3} height={52 * 3} viewBox={`0 -38 ${WORDMARK_WIDTH} 52`}>
            <path d={WORDMARK_PATH} fill="#F2F0E9" />
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 60, letterSpacing: -1.5, lineHeight: 1.1 }}>{TAGLINE}</div>
          <div style={{ fontSize: 28, color: "#A6A99E" }}>A JavaScript & TypeScript runtime written in Rust.</div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Archivo", data: font, weight: 500, style: "normal" }] },
  );
}

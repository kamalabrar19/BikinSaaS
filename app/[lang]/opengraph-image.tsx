import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getContent } from "@/content";
import { isLocale } from "@/lib/locale";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateImageMetadata({ params }: { params: { lang: string } }) {
  const lang = isLocale(params.lang) ? params.lang : "id";
  return [{ id: lang, size, contentType, alt: getContent(lang).ui.meta.ogImageAlt }];
}

/**
 * next/og needs a font as raw bytes and next/font does not expose the files it
 * downloads, so a single Fraunces weight is vendored under assets/fonts for
 * this image alone. It is 70 KB, it never reaches the browser, and without it
 * the share card would be set in a system sans while the page is a serif.
 */
export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "id";
  const { ui } = getContent(locale);

  const display = await readFile(join(process.cwd(), "assets/fonts/Fraunces-SemiBold.ttf"));
  const logo = await readFile(join(process.cwd(), "public/brand/logo-green.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#E6E5E0",
          color: "#17181A",
          padding: "72px",
          fontFamily: "Fraunces",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34 }}>
          <img src={logoSrc} width={64} height={64} alt="" />
          BikinSaaS
        </div>
        <div style={{ display: "flex", fontSize: 104, lineHeight: 1.02, letterSpacing: "-0.03em" }}>
          {ui.hero.statement}
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#0E6E3F" }}>{ui.hero.support}</div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Fraunces", data: display, style: "normal", weight: 600 }],
    },
  );
}

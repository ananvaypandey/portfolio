import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

const patrickHand = await readFile(
  join(process.cwd(), "assets/fonts/PatrickHand-Regular.ttf")
);

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#f6f1e3",
          color: "#211f1a",
          fontFamily: "Patrick Hand",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent, transparent 34px, rgba(60,55,45,0.08) 34px, rgba(60,55,45,0.08) 35px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(207,74,51,0.1) 1px, transparent 1px)",
            backgroundPosition: "54px 0",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 34,
            left: 56,
            right: 56,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 30,
              color: "#5b574b",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                border: "2px solid rgba(43,40,34,0.22)",
                background: "#fdfaf0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                transform: "rotate(-3deg)",
                color: "#3151c2",
              }}
            >
              AP
            </div>
            <span>notebook · portfolio</span>
          </div>
          <div
            style={{
              padding: "10px 22px",
              borderRadius: 999,
              border: "2px dashed rgba(43,40,34,0.25)",
              background: "#fdfaf0",
              fontSize: 26,
              color: "#9a9281",
              transform: "rotate(2deg)",
              display: "flex",
            }}
          >
            est. 2026
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 96px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 30,
              color: "#cf4a33",
            }}
          >
            <span>hello, i&apos;m</span>
            <span
              style={{
                width: 56,
                height: 4,
                background: "rgba(207,74,51,0.5)",
                borderRadius: 2,
              }}
            />
          </div>
<div
          style={{
            fontFamily: "Caveat",
            fontSize: 88,
            fontWeight: 700,
            lineHeight: 1.05,
            color: "#211f1a",
            display: "flex",
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#3151c2",
            marginTop: 4,
            display: "flex",
          }}
        >
          {site.role}
        </div>
        <div
          style={{
            marginTop: 26,
            maxWidth: 720,
            fontSize: 32,
            lineHeight: 1.45,
            color: "#5b574b",
            display: "flex",
          }}
        >
          {site.tagline}
        </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: 70,
            bottom: 84,
            transform: "rotate(-4deg)",
            display: "flex",
          }}
        >
          <svg
            width="210"
            height="170"
            viewBox="0 0 100 100"
            fill="none"
            stroke="#cf4a33"
            strokeWidth="1.5"
          >
            <circle cx="50" cy="50" r="46" strokeDasharray="6 7" />
            <circle cx="50" cy="50" r="33" strokeDasharray="6 7" />
            <path d="M50 12c7 15-8 26 1 42s13 25-8 40" strokeDasharray="4 6" />
          </svg>
        </div>

        <div
          style={{
            position: "absolute",
            left: 56,
            bottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 28,
            color: "#9a9281",
          }}
        >
          <span
            style={{
              padding: "8px 18px",
              borderRadius: 12,
              border: "2px solid rgba(49,81,194,0.35)",
              background: "rgba(49,81,194,0.08)",
              color: "#203aa0",
            }}
          >
            AI × Software × Hardware
          </span>
          <span>ideas · code · prototypes</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Caveat",
          data: patrickHand,
          weight: 700,
          style: "normal",
        },
        {
          name: "Patrick Hand",
          data: patrickHand,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );
}
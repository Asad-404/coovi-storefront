import { ImageResponse } from "next/og";
import { BRAND_CYAN, BRAND_NAVY, SITE_TAGLINE } from "./site";

export const ogSize = { width: 1200, height: 630 };

// Default 1200x630 share card used for every page that has no photo of its own
export function renderShareCard() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${BRAND_NAVY} 0%, #123a78 100%)`,
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <div style={{ fontSize: 220, fontWeight: 900, letterSpacing: -6, lineHeight: 1, display: "flex" }}>Coov</div>
          <div style={{ fontSize: 220, fontWeight: 900, lineHeight: 1, display: "flex", position: "relative" }}>
            {"ı"}
            <div
              style={{
                position: "absolute",
                top: 6,
                left: 8,
                width: 44,
                height: 44,
                borderRadius: 44,
                background: BRAND_CYAN,
              }}
            />
          </div>
        </div>
        <div style={{ fontSize: 42, marginTop: 36, opacity: 0.9, display: "flex" }}>{SITE_TAGLINE}</div>
        <div style={{ fontSize: 30, marginTop: 20, color: BRAND_CYAN, display: "flex" }}>Cash on delivery</div>
      </div>
    ),
    ogSize
  );
}

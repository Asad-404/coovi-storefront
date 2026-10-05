import { ImageResponse } from "next/og";
import { BRAND_CYAN, BRAND_NAVY } from "@/lib/site";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "white",
          color: BRAND_NAVY,
          fontSize: 150,
          fontWeight: 900,
          fontFamily: "sans-serif",
        }}
      >
        C
        <div style={{ width: 26, height: 26, borderRadius: 26, background: BRAND_CYAN, marginTop: 70, marginLeft: 6 }} />
      </div>
    ),
    size
  );
}

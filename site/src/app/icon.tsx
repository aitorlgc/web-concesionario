import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#15392f",
          borderRadius: 14,
          color: "#f2eee8",
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: -1,
        }}
      >
        HC
        <div style={{ position: "absolute", bottom: 12, left: 16, right: 16, height: 4, background: "#ff6b1a", borderRadius: 2 }} />
      </div>
    ),
    size
  );
}

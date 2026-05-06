import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #09090b 0%, #18181b 100%)",
          color: "#fafafa",
          fontSize: 80,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          fontFamily: "Arial, sans-serif",
          borderRadius: 36,
        }}
      >
        AK
      </div>
    ),
    { ...size }
  );
}

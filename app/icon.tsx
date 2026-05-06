import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 220,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          fontFamily: "Arial, sans-serif",
        }}
      >
        AK
      </div>
    ),
    { ...size }
  );
}

import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "MindRich — Mude sua mentalidade, mude seus resultados";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "0 96px",
          background: "linear-gradient(135deg, #1A1A2E 0%, #23233F 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 88,
              height: 88,
              borderRadius: 24,
              background: "#D4AF37",
              color: "#1A1A2E",
              fontSize: 60,
              fontWeight: 800,
            }}
          >
            M
          </div>
          <div style={{ fontSize: 60, fontWeight: 700, color: "#F5F5F7" }}>MindRich</div>
        </div>

        <div
          style={{
            marginTop: 40,
            fontSize: 64,
            lineHeight: 1.15,
            color: "#F5F5F7",
            maxWidth: 900,
          }}
        >
          Mude sua mentalidade.
        </div>
        <div style={{ fontSize: 64, lineHeight: 1.15, color: "#D4AF37", fontWeight: 700 }}>
          Mude seus resultados.
        </div>

        <div style={{ marginTop: 40, fontSize: 30, color: "#A0A0B0", maxWidth: 900 }}>
          Prática guiada pelos 13 princípios — para qualquer pessoa.
        </div>
      </div>
    ),
    size,
  );
}

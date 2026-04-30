import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "J'MTD — Société de services sur mesure en Martinique";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const T = "#0DA9A4";
const P = "#D4197A";
const TEXT = "#1A2D3D";
const MUTED = "#64748B";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, Helvetica, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Orbes décoratifs */}
        <div style={{
          position: "absolute", top: -120, right: -80,
          width: 560, height: 560, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(13,169,164,0.18) 0%, transparent 70%)",
          display: "flex",
        }} />
        <div style={{
          position: "absolute", bottom: -100, left: -80,
          width: 460, height: 460, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,25,122,0.12) 0%, transparent 70%)",
          display: "flex",
        }} />
        <div style={{
          position: "absolute", top: "35%", left: "38%",
          width: 340, height: 340, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(13,169,164,0.08) 0%, transparent 70%)",
          display: "flex",
        }} />

        {/* Contenu centré */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1, padding: "0 80px" }}>

          {/* Logo reconstruit (texte) */}
          <div style={{ display: "flex", alignItems: "flex-end", marginBottom: 36, gap: 0 }}>
            <span style={{
              fontSize: 96, fontWeight: 900, color: P,
              fontStyle: "italic", lineHeight: 1, letterSpacing: -2,
            }}>J&apos;m</span>
            <span style={{
              fontSize: 128, fontWeight: 900, color: T,
              lineHeight: 1, letterSpacing: -6, marginBottom: -4,
            }}>TD</span>
          </div>

          {/* Badge agrément */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "rgba(13,169,164,0.1)",
            border: "1.5px solid rgba(13,169,164,0.3)",
            borderRadius: 40, padding: "10px 24px", marginBottom: 28,
          }}>
            <div style={{
              width: 10, height: 10, borderRadius: "50%",
              background: T, display: "flex", flexShrink: 0,
            }} />
            <span style={{ fontSize: 20, fontWeight: 700, color: T, letterSpacing: 1.5 }}>
              Agréé Services à la Personne · SAP
            </span>
          </div>

          {/* Titre */}
          <div style={{
            fontSize: 44, fontWeight: 800, color: TEXT,
            textAlign: "center", lineHeight: 1.2, marginBottom: 18,
            display: "flex",
          }}>
            Société de services sur mesure
          </div>

          {/* Sous-titre */}
          <div style={{
            fontSize: 24, color: MUTED, textAlign: "center",
            marginBottom: 44, display: "flex",
          }}>
            Ménage · Repas · Courses · Coach rangement · Toute la Martinique
          </div>

          {/* Badges de confiance */}
          <div style={{ display: "flex", gap: 18 }}>
            {[
              { icon: "⭐", text: "5 / 5 Google" },
              { icon: "💳", text: "50% crédit d'impôt" },
              { icon: "📍", text: "Toute la Martinique" },
            ].map((b) => (
              <div
                key={b.text}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "rgba(13,169,164,0.07)",
                  border: "1px solid rgba(13,169,164,0.2)",
                  borderRadius: 24, padding: "12px 22px",
                  fontSize: 20, color: TEXT, fontWeight: 600,
                }}
              >
                <span>{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* URL en bas */}
        <div style={{
          position: "absolute", bottom: 28, right: 40,
          fontSize: 18, color: "#CBD5E1", fontWeight: 500,
          display: "flex",
        }}>
          jmtd.fr
        </div>
      </div>
    ),
    { ...size }
  );
}

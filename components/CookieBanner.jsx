"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const T = "#0DA9A4";
const P = "#D4197A";
const STORAGE_KEY = "jmtd_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      // Léger délai pour ne pas bloquer le premier rendu
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ accepted: true, date: new Date().toISOString() }));
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ accepted: false, date: new Date().toISOString() }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes slideUpCookie {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: none; }
        }
        @media (max-width: 640px) {
          .cookie-box { flex-direction: column !important; gap: 16px !important; padding: 20px 18px !important; border-radius: 20px 20px 0 0 !important; bottom: 0 !important; left: 0 !important; right: 0 !important; max-width: 100% !important; }
          .cookie-btns { flex-direction: row !important; width: 100%; }
          .cookie-btns button { flex: 1 !important; }
        }
      `}</style>

      <div
        className="cookie-box"
        style={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9000,
          background: "#fff",
          border: `1px solid rgba(13,169,164,0.2)`,
          borderRadius: 20,
          boxShadow: "0 16px 60px rgba(0,0,0,0.14), 0 4px 20px rgba(13,169,164,0.12)",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          maxWidth: 680,
          width: "calc(100% - 32px)",
          animation: "slideUpCookie 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Icon */}
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${T}12`, border: `1px solid ${T}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
          🍪
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1A2D3D", marginBottom: 4 }}>
            Ce site utilise des cookies
          </div>
          <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6 }}>
            Nous utilisons des cookies pour améliorer votre expérience.{" "}
            <Link href="/politique-confidentialite" style={{ color: T, textDecoration: "underline" }}>
              En savoir plus
            </Link>
          </div>
        </div>

        {/* Buttons */}
        <div className="cookie-btns" style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <button
            onClick={decline}
            style={{ padding: "9px 18px", borderRadius: 30, border: `1.5px solid rgba(100,116,139,0.3)`, background: "transparent", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#64748B"; e.currentTarget.style.color = "#1A2D3D"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(100,116,139,0.3)"; e.currentTarget.style.color = "#64748B"; }}
          >
            Refuser
          </button>
          <button
            onClick={accept}
            style={{ padding: "9px 20px", borderRadius: 30, border: "none", background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", boxShadow: `0 4px 16px ${T}40`, transition: "transform 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
            onMouseLeave={e => e.currentTarget.style.transform = "none"}
          >
            Accepter
          </button>
        </div>
      </div>
    </>
  );
}

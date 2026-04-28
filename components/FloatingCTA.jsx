"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { PHONE_HREF, WHATSAPP, AMBER, PINK } from "../lib/data";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        @keyframes waPulse {
          0%,100% { box-shadow: 0 4px 20px rgba(37,211,102,0.4); }
          50% { box-shadow: 0 4px 32px rgba(37,211,102,0.7), 0 0 0 8px rgba(37,211,102,0.08); }
        }
        @keyframes floatBtn {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .fcta-label {
          position: absolute; right: 62px; top: 50%; transform: translateY(-50%);
          background: #1A2D3D; color: #fff; padding: 6px 14px; border-radius: 20px;
          font-size: 12px; font-weight: 600; white-space: nowrap;
          opacity: 0; pointer-events: none; transition: opacity 0.2s;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        .fcta-btn:hover .fcta-label { opacity: 1; }
      `}</style>

      {/* Stack de boutons flottants */}
      <div style={{
        position: "fixed", bottom: 24, right: 20, zIndex: 500,
        display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end",
        transform: visible ? "translateY(0)" : "translateY(120px)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease",
      }}>

        {/* WhatsApp */}
        <div className="fcta-btn" style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <span className="fcta-label">WhatsApp</span>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
            style={{ width: 54, height: 54, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, textDecoration: "none", animation: "waPulse 2.5s infinite", transition: "transform 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.12)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.518 3.659 1.419 5.185L2 22l4.946-1.397A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.243-1.224l-.305-.18-3.155.892.892-3.077-.2-.318A7.96 7.96 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z"/>
            </svg>
          </a>
        </div>

        {/* Téléphone */}
        <div className="fcta-btn" style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <span className="fcta-label">Appeler</span>
          <a href={PHONE_HREF} aria-label="Appeler J'MTD"
            style={{ width: 54, height: 54, borderRadius: "50%", background: `linear-gradient(135deg, ${AMBER}, ${PINK})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, textDecoration: "none", boxShadow: `0 6px 24px rgba(13,169,164,0.45)`, animation: "floatBtn 3s ease-in-out infinite", transition: "transform 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.12)"; e.currentTarget.style.animation = "none"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.animation = "floatBtn 3s ease-in-out infinite"; }}>
            📞
          </a>
        </div>

        {/* Devis rapide */}
        <div className="fcta-btn" style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <span className="fcta-label">Devis gratuit</span>
          <Link href="/contact" aria-label="Devis gratuit"
            style={{ width: 54, height: 54, borderRadius: "50%", background: "#1A2D3D", border: `2px solid ${AMBER}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.2)", transition: "transform 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.12)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
            ✉️
          </Link>
        </div>
      </div>
    </>
  );
}

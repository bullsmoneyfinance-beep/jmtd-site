"use client";
import { useState, useEffect } from "react";
import { PHONE_HREF, AMBER, NAVY } from "../lib/data";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div style={{ position: "fixed", bottom: 90, right: 20, zIndex: 200, display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
      {/* WhatsApp */}
      <a href="https://wa.me/596696000000" target="_blank" rel="noopener noreferrer"
        aria-label="Contacter par WhatsApp"
        style={{ width: 52, height: 52, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 4px 20px rgba(37,211,102,0.4)", transition: "transform 0.2s", textDecoration: "none" }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
        💬
      </a>
      {/* Phone */}
      <a href={PHONE_HREF} aria-label="Appeler J'MTD"
        style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${AMBER}, #D97706)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 4px 20px rgba(245,158,11,0.4)", transition: "transform 0.2s", textDecoration: "none", animation: "glow 3s infinite" }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
        📞
      </a>
    </div>
  );
}

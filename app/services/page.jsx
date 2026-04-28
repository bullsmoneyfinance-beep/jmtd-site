"use client";
import { useEffect } from "react";
import Link from "next/link";
import { SERVICES, PHONE, PHONE_HREF } from "../../lib/data";

const T = "#0DA9A4";
const P = "#D4197A";
const TEXT = "#1A2D3D";
const MUTED = "#64748B";

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

export default function ServicesPage() {
  useReveal();

  return (
    <>
      {/* Hero */}
      <section style={{ background: "#fff", padding: "88px 24px 64px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: "8%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${T}14, transparent 70%)`, filter: "blur(60px)", animation: "floatOrb 14s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: "5%", width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${P}10, transparent 70%)`, filter: "blur(60px)", animation: "floatOrbSlow 16s ease-in-out infinite", pointerEvents: "none" }} />

        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${T}10`, border: `1px solid ${T}28`, borderRadius: 30, padding: "6px 16px", marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 1.5 }}>Nos prestations</span>
          </div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: TEXT, marginBottom: 20, lineHeight: 1.2 }}>
            Des services à la personne{" "}
            <span style={{ color: T }}>complets en Martinique</span>
          </h1>
          <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.8, marginBottom: 36 }}>
            De l&apos;entretien de votre domicile à la préparation de vos repas, en passant par la livraison de courses et le coach en rangement.{" "}
            <strong style={{ color: TEXT }}>50% remboursé</strong> par crédit d&apos;impôt.
          </p>
          <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 32px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none", boxShadow: `0 8px 32px ${T}40`, transition: "transform 0.2s, box-shadow 0.2s" }}>
            Demander un devis gratuit →
          </Link>
        </div>
      </section>

      {/* Services list */}
      <section style={{ background: "#F8FAFB", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 80 }}>
          {SERVICES.map((s, i) => (
            <div key={s.id} id={s.id} className="reveal"
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 56, alignItems: "center", direction: i % 2 === 0 ? "ltr" : "rtl" }}>
              {/* Image placeholder with gradient */}
              <div style={{ direction: "ltr", position: "relative" }}>
                {s.img ? (
                  <img src={s.img} alt={s.title}
                    style={{ width: "100%", height: 320, objectFit: "cover", borderRadius: 24, boxShadow: `0 16px 64px ${T}18` }}
                    loading="lazy" />
                ) : (
                  <div style={{ width: "100%", height: 320, borderRadius: 24, background: `linear-gradient(135deg, ${T}15, ${P}10)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, boxShadow: `0 16px 64px ${T}14` }}>
                    {s.icon}
                  </div>
                )}
                {s.special && (
                  <div style={{ position: "absolute", top: 16, left: 16, display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.95)", border: `1px solid ${T}30`, borderRadius: 30, padding: "5px 14px", fontSize: 12, color: T, fontWeight: 700, backdropFilter: "blur(8px)" }}>
                    ⭐ Spécialité J&apos;MTD
                  </div>
                )}
              </div>

              <div style={{ direction: "ltr" }}>
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 16, background: `${T}12`, marginBottom: 16, fontSize: 28 }}>
                  {s.icon}
                </div>
                <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 28, fontWeight: 700, color: TEXT, marginBottom: 8 }}>{s.title}</h2>
                <p style={{ fontSize: 15, fontWeight: 600, color: T, marginBottom: 16 }}>{s.headline}</p>
                <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.8, marginBottom: 24 }}>{s.desc}</p>
                <ul style={{ listStyle: "none", marginBottom: 32 }}>
                  {s.details.map(d => (
                    <li key={d} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: MUTED, marginBottom: 10 }}>
                      <span style={{ color: T, fontSize: 14, flexShrink: 0, marginTop: 2 }}>✓</span> {d}
                    </li>
                  ))}
                </ul>
                <Link href={s.id === "rangement" ? "/coach" : "/contact"}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none", boxShadow: `0 6px 24px ${T}35` }}>
                  {s.id === "rangement" ? "Voir les formules →" : "Demander un devis →"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Crédit impôt banner */}
      <section style={{ background: "#fff", padding: "72px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div className="reveal" style={{ background: `linear-gradient(135deg, ${T}10, ${P}08)`, border: `1px solid ${T}22`, borderRadius: 28, padding: "48px 40px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💳</div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, color: TEXT, marginBottom: 12 }}>
              50% de vos dépenses remboursées
            </h2>
            <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.8, marginBottom: 32, maxWidth: 560, margin: "0 auto 32px" }}>
              Toutes nos prestations ouvrent droit au crédit d&apos;impôt services à la personne (art. 199 sexdecies du CGI). Une attestation fiscale vous est remise chaque année.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/contact" style={{ padding: "14px 28px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, textDecoration: "none", fontSize: 15, boxShadow: `0 6px 24px ${T}35` }}>
                Obtenir un devis gratuit
              </Link>
              <a href={PHONE_HREF} style={{ padding: "14px 28px", borderRadius: 30, border: `2px solid ${T}44`, color: T, fontWeight: 700, textDecoration: "none", fontSize: 15 }}>
                📞 {PHONE}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SERVICES, PHONE, PHONE_HREF, AMBER, NAVY, EMERALD } from "../../lib/data";

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
  const [active, setActive] = useState(null);

  return (
    <>
      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg, #0D1B2A 0%, #1a2d4a 100%)", padding: "80px 24px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: AMBER, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Nos prestations</div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, color: "#F8FAFC", marginBottom: 20 }}>
            Des services à la personne complets en Martinique
          </h1>
          <p style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.7, marginBottom: 32 }}>
            De l&apos;entretien de votre domicile à la préparation de vos repas, en passant par la livraison de courses et le coach en rangement. <strong style={{ color: "#F8FAFC" }}>50% remboursé</strong> par crédit d&apos;impôt.
          </p>
          <Link href="/contact" className="btn-amber" style={{ padding: "16px 32px", borderRadius: 30, fontSize: 16, textDecoration: "none", display: "inline-block" }}>
            Demander un devis gratuit →
          </Link>
        </div>
      </section>

      {/* Services list */}
      <section style={{ background: "#0D1B2A", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 80 }}>
          {SERVICES.map((s, i) => (
            <div key={s.id} id={s.id} className="reveal"
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 48, alignItems: "center", direction: i % 2 === 0 ? "ltr" : "rtl" }}>
              <img src={s.img} alt={s.title}
                style={{ width: "100%", height: 320, objectFit: "cover", borderRadius: 20, direction: "ltr" }}
                loading="lazy" />
              <div style={{ direction: "ltr" }}>
                {s.special && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 30, padding: "4px 12px", marginBottom: 16, fontSize: 12, color: AMBER, fontWeight: 600 }}>
                    ⭐ Spécialité J&apos;MTD
                  </div>
                )}
                <div style={{ fontSize: 36, marginBottom: 12 }}>{s.icon}</div>
                <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 28, fontWeight: 800, color: "#F8FAFC", marginBottom: 8 }}>{s.title}</h2>
                <p style={{ fontSize: 15, color: AMBER, fontWeight: 600, marginBottom: 16 }}>{s.headline}</p>
                <p style={{ fontSize: 15, color: "#94A3B8", lineHeight: 1.7, marginBottom: 24 }}>{s.desc}</p>
                <ul style={{ listStyle: "none", marginBottom: 28 }}>
                  {s.details.map(d => (
                    <li key={d} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#94A3B8", marginBottom: 10 }}>
                      <span style={{ color: EMERALD, fontSize: 16, flexShrink: 0 }}>✓</span> {d}
                    </li>
                  ))}
                </ul>
                <Link href={s.id === "rangement" ? "/coach" : "/contact"}
                  className="btn-amber"
                  style={{ padding: "14px 28px", borderRadius: 30, fontSize: 15, textDecoration: "none", display: "inline-block" }}>
                  {s.id === "rangement" ? "Voir les formules →" : "Demander un devis →"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Credit impot banner */}
      <section style={{ background: `linear-gradient(135deg, ${AMBER}, #D97706)`, padding: "48px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 28, fontWeight: 800, color: NAVY, marginBottom: 12 }}>
            💳 Crédit d&apos;impôt : 50% remboursé
          </h2>
          <p style={{ fontSize: 16, color: "rgba(13,27,42,0.8)", marginBottom: 24 }}>
            Toutes nos prestations ouvrent droit au crédit d&apos;impôt services à la personne (art. 199 sexdecies du CGI). Une attestation fiscale vous est remise chaque année.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" style={{ padding: "14px 28px", borderRadius: 30, background: NAVY, color: "#F8FAFC", fontWeight: 700, textDecoration: "none", fontSize: 15 }}>
              Obtenir un devis gratuit
            </Link>
            <a href={PHONE_HREF} style={{ padding: "14px 28px", borderRadius: 30, border: `2px solid ${NAVY}`, color: NAVY, fontWeight: 700, textDecoration: "none", fontSize: 15 }}>
              📞 {PHONE}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

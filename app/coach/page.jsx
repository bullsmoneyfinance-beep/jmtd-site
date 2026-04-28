"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PHONE_HREF, PHONE, AMBER, PINK, NAVY, EMERALD } from "../../lib/data";

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

const FORMULES = [
  {
    id: "diagnostic",
    name: "Diagnostic",
    price: "Offert",
    priceNote: "Premier rendez-vous gratuit",
    color: EMERALD,
    badge: null,
    features: [
      "Visite de votre domicile (1h–1h30)",
      "Analyse de vos habitudes et besoins",
      "Recommandations personnalisées",
      "Présentation du plan d'action",
      "Sans engagement",
    ],
    cta: "Réserver mon diagnostic",
  },
  {
    id: "accompagnement",
    name: "Accompagnement",
    price: "Sur devis",
    priceNote: "Séances individuelles",
    color: AMBER,
    badge: "Le plus choisi",
    features: [
      "Séances de coaching personnalisées",
      "Accompagnement pièce par pièce",
      "Méthode Marie Kondo adaptée à vous",
      "Conseils organisation & rangement",
      "Suivi et ajustements inclus",
    ],
    cta: "Demander un devis",
  },
  {
    id: "integral",
    name: "Rangement intégral",
    price: "Sur devis",
    priceNote: "Prestation complète",
    color: "#8B5CF6",
    badge: "Formule complète",
    features: [
      "Prise en charge complète de votre intérieur",
      "Tri, désencombrement, rangement",
      "Réorganisation de chaque pièce",
      "Conseils pour maintenir l'ordre",
      "Rapport et recommandations finaux",
    ],
    cta: "Demander un devis",
  },
];

export default function CoachPage() {
  useReveal();

  return (
    <>
      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg, #0D1B2A 0%, #1a2d4a 100%)", padding: "80px 24px 60px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 60, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 30, padding: "6px 14px", marginBottom: 24 }}>
              <span style={{ fontSize: 12, color: AMBER, fontWeight: 600 }}>⭐ Spécialité J&apos;MTD</span>
            </div>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, color: "#F8FAFC", lineHeight: 1.1, marginBottom: 20 }}>
              Coach en rangement <span style={{ background: `linear-gradient(135deg, ${AMBER}, ${PINK})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>méthode Marie Kondo</span>
            </h1>
            <p style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.7, marginBottom: 32 }}>
              Fan absolue de Marie Kondo, notre coach du rangement étudie vos besoins, vos habitudes de vie et vos attentes. Un diagnostic initial nous permettra de vous présenter le travail à réaliser et de vous proposer la formule la plus adaptée.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/contact" className="btn-amber" style={{ padding: "16px 28px", borderRadius: 30, fontSize: 16, textDecoration: "none", display: "inline-block" }}>
                Réserver mon diagnostic gratuit →
              </Link>
              <a href={PHONE_HREF} style={{ padding: "16px 28px", borderRadius: 30, border: "2px solid rgba(245,158,11,0.3)", color: AMBER, textDecoration: "none", fontSize: 16, display: "inline-block" }}>
                📞 {PHONE}
              </a>
            </div>
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=450&fit=crop&auto=format"
              alt="Coach rangement méthode Marie Kondo Martinique"
              style={{ width: "100%", borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }} />
          </div>
        </div>
      </section>

      {/* Méthode */}
      <section style={{ background: "#0D1B2A", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: AMBER, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>La méthode</div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#F8FAFC", marginBottom: 16 }}>
              Un intérieur ordonné transforme votre vie
            </h2>
            <p style={{ fontSize: 16, color: "#94A3B8", maxWidth: 600, margin: "0 auto" }}>
              La méthode KonMari ne se résume pas à ranger. C&apos;est une transformation profonde de votre rapport aux objets et à votre espace de vie.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {[
              { step: "01", icon: "🔍", title: "Diagnostic", text: "Visite de votre domicile, analyse de vos habitudes et définition de vos objectifs." },
              { step: "02", icon: "✂️", title: "Désencombrement", text: "Tri de vos objets par catégorie : gardez ce qui vous apporte de la joie." },
              { step: "03", icon: "🗂️", title: "Organisation", text: "Chaque objet trouve sa place idéale, accessible et logique au quotidien." },
              { step: "04", icon: "✨", title: "Transformation", text: "Votre intérieur est ordonné, serein. Vous gagnez en bien-être et en efficacité." },
            ].map((s, i) => (
              <div key={s.step} className={`reveal reveal-delay-${i + 1}`}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "28px 24px" }}>
                <div style={{ fontSize: 12, color: AMBER, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>ÉTAPE {s.step}</div>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.7 }}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formules */}
      <section style={{ background: "#060E18", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: AMBER, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Nos formules</div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#F8FAFC" }}>
              Choisissez votre formule
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {FORMULES.map((f, i) => (
              <div key={f.id} className={`reveal reveal-delay-${i + 1}`}
                style={{ position: "relative", background: "rgba(255,255,255,0.04)", border: `1px solid ${f.badge ? `${f.color}44` : "rgba(255,255,255,0.06)"}`, borderRadius: 24, padding: "32px 24px", display: "flex", flexDirection: "column" }}>
                {f.badge && (
                  <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: f.color, color: NAVY, fontSize: 12, fontWeight: 700, padding: "4px 16px", borderRadius: 30, whiteSpace: "nowrap" }}>
                    {f.badge}
                  </div>
                )}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: f.color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{f.name}</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: "#F8FAFC", fontFamily: "Syne, sans-serif" }}>{f.price}</div>
                  <div style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>{f.priceNote}</div>
                </div>
                <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.06)", margin: "20px 0" }} />
                <ul style={{ listStyle: "none", flex: 1, marginBottom: 28 }}>
                  {f.features.map(feat => (
                    <li key={feat} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "#94A3B8", marginBottom: 12 }}>
                      <span style={{ color: f.color, fontSize: 14, flexShrink: 0, marginTop: 2 }}>✓</span> {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/contact"
                  style={{ display: "block", textAlign: "center", padding: "14px", borderRadius: 30, background: f.badge ? `linear-gradient(135deg, ${f.color}, ${f.color}cc)` : "transparent", border: `2px solid ${f.color}66`, color: f.badge ? NAVY : f.color, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
                  {f.cta} →
                </Link>
              </div>
            ))}
          </div>
          <p className="reveal" style={{ textAlign: "center", marginTop: 32, fontSize: 13, color: "#475569" }}>
            💡 Toutes les formules ouvrent droit au crédit d&apos;impôt (50% remboursé). Attestation fiscale fournie.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: `linear-gradient(135deg, ${AMBER}, ${PINK})`, padding: "60px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 32, fontWeight: 800, color: NAVY, marginBottom: 12 }}>
            Commencez par le diagnostic gratuit
          </h2>
          <p style={{ fontSize: 16, color: "rgba(13,27,42,0.8)", marginBottom: 28 }}>
            Sans engagement, sans surprise. Prenez rendez-vous et découvrez comment transformer votre intérieur.
          </p>
          <Link href="/contact" style={{ display: "inline-block", padding: "16px 32px", borderRadius: 30, background: NAVY, color: "#F8FAFC", fontWeight: 700, fontSize: 16, textDecoration: "none" }}>
            Réserver mon diagnostic gratuit →
          </Link>
        </div>
      </section>
    </>
  );
}

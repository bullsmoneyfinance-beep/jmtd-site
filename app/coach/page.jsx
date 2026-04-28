"use client";
import { useEffect } from "react";
import Link from "next/link";
import { PHONE_HREF, PHONE } from "../../lib/data";

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

const FORMULES = [
  {
    id: "diagnostic",
    name: "Diagnostic",
    price: "Offert",
    priceNote: "Premier rendez-vous gratuit",
    color: T,
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
    color: P,
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

const ETAPES = [
  { step: "01", icon: "🔍", title: "Diagnostic", text: "Visite de votre domicile, analyse de vos habitudes et définition de vos objectifs." },
  { step: "02", icon: "✂️", title: "Désencombrement", text: "Tri de vos objets par catégorie : gardez ce qui vous apporte de la joie." },
  { step: "03", icon: "🗂️", title: "Organisation", text: "Chaque objet trouve sa place idéale, accessible et logique au quotidien." },
  { step: "04", icon: "✨", title: "Transformation", text: "Votre intérieur est ordonné, serein. Vous gagnez en bien-être et en efficacité." },
];

export default function CoachPage() {
  useReveal();

  return (
    <>
      {/* Hero */}
      <section style={{ background: "#fff", padding: "88px 24px 72px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: "5%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${T}14, transparent 70%)`, filter: "blur(60px)", animation: "floatOrb 14s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: "8%", width: 350, height: 350, borderRadius: "50%", background: `radial-gradient(circle, ${P}10, transparent 70%)`, filter: "blur(60px)", animation: "floatOrbSlow 18s ease-in-out infinite", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 64, alignItems: "center", position: "relative" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${T}10`, border: `1px solid ${T}28`, borderRadius: 30, padding: "6px 16px", marginBottom: 24 }}>
              <span style={{ fontSize: 12, color: T, fontWeight: 700 }}>⭐ Spécialité J&apos;MTD</span>
            </div>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: TEXT, lineHeight: 1.2, marginBottom: 20 }}>
              Coach en rangement{" "}
              <span style={{ color: P }}>méthode Marie Kondo</span>
            </h1>
            <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.8, marginBottom: 36 }}>
              Fan absolue de Marie Kondo, notre coach étudie vos besoins, vos habitudes de vie et vos attentes. Un diagnostic initial nous permettra de vous présenter le travail à réaliser et de vous proposer la formule la plus adaptée.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 28px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none", boxShadow: `0 8px 32px ${T}40` }}>
                Réserver mon diagnostic gratuit →
              </Link>
              <a href={PHONE_HREF} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 28px", borderRadius: 30, border: `2px solid ${T}40`, color: T, textDecoration: "none", fontSize: 16, fontWeight: 600 }}>
                📞 {PHONE}
              </a>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=450&fit=crop&auto=format"
              alt="Coach rangement méthode Marie Kondo Martinique"
              style={{ width: "100%", borderRadius: 24, boxShadow: `0 24px 80px ${T}20` }} />
            {/* Floating badge */}
            <div style={{ position: "absolute", bottom: 24, left: -16, background: "#fff", border: `1px solid ${T}20`, borderRadius: 16, padding: "12px 18px", boxShadow: `0 8px 32px ${T}18`, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>🗂️</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>Diagnostic gratuit</div>
                <div style={{ fontSize: 11, color: MUTED }}>Sans engagement</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Méthode */}
      <section style={{ background: "#F8FAFB", padding: "88px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${T}10`, border: `1px solid ${T}28`, borderRadius: 30, padding: "6px 16px", marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 1.5 }}>La méthode</span>
            </div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, color: TEXT, marginBottom: 16 }}>
              Un intérieur ordonné transforme votre vie
            </h2>
            <p style={{ fontSize: 16, color: MUTED, maxWidth: 580, margin: "0 auto", lineHeight: 1.8 }}>
              La méthode KonMari ne se résume pas à ranger. C&apos;est une transformation profonde de votre rapport aux objets et à votre espace de vie.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {ETAPES.map((s, i) => (
              <div key={s.step} className={`reveal reveal-delay-${i + 1} card-zen`}
                style={{ padding: "28px 24px" }}>
                <div style={{ fontSize: 11, color: T, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>ÉTAPE {s.step}</div>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{s.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.7 }}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formules */}
      <section style={{ background: "#fff", padding: "88px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${T}10`, border: `1px solid ${T}28`, borderRadius: 30, padding: "6px 16px", marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 1.5 }}>Nos formules</span>
            </div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, color: TEXT }}>
              Choisissez votre formule
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {FORMULES.map((f, i) => (
              <div key={f.id} className={`reveal reveal-delay-${i + 1}`}
                style={{ position: "relative", background: "#fff", border: `1.5px solid ${f.badge ? `${f.color}35` : "rgba(13,169,164,0.1)"}`, borderRadius: 24, padding: "36px 28px", display: "flex", flexDirection: "column", boxShadow: f.badge ? `0 8px 40px ${f.color}15` : `0 4px 24px rgba(13,169,164,0.06)`, transition: "transform 0.3s ease, box-shadow 0.3s ease" }}>
                {f.badge && (
                  <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg, ${f.color}, ${f.color}cc)`, color: "#fff", fontSize: 11, fontWeight: 700, padding: "5px 18px", borderRadius: 30, whiteSpace: "nowrap" }}>
                    {f.badge}
                  </div>
                )}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: f.color, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10 }}>{f.name}</div>
                  <div style={{ fontSize: 34, fontWeight: 700, color: TEXT, fontFamily: "Syne, sans-serif" }}>{f.price}</div>
                  <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{f.priceNote}</div>
                </div>
                <hr style={{ border: "none", borderTop: `1px solid ${f.color}20`, margin: "20px 0" }} />
                <ul style={{ listStyle: "none", flex: 1, marginBottom: 28 }}>
                  {f.features.map(feat => (
                    <li key={feat} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: MUTED, marginBottom: 12 }}>
                      <span style={{ color: f.color, fontSize: 14, flexShrink: 0, marginTop: 2 }}>✓</span> {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/contact"
                  style={{ display: "block", textAlign: "center", padding: "14px", borderRadius: 30, background: f.badge ? `linear-gradient(135deg, ${f.color}, ${f.color}bb)` : "transparent", border: `2px solid ${f.color}50`, color: f.badge ? "#fff" : f.color, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
                  {f.cta} →
                </Link>
              </div>
            ))}
          </div>
          <p className="reveal" style={{ textAlign: "center", marginTop: 32, fontSize: 13, color: MUTED }}>
            💡 Toutes les formules ouvrent droit au crédit d&apos;impôt (50% remboursé). Attestation fiscale fournie.
          </p>
        </div>
      </section>

      {/* CTA final */}
      <section style={{ background: "#F8FAFB", padding: "72px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div className="reveal" style={{ background: `linear-gradient(135deg, ${T}10, ${P}08)`, border: `1px solid ${T}22`, borderRadius: 28, padding: "52px 40px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🗂️</div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 32, fontWeight: 700, color: TEXT, marginBottom: 12 }}>
              Commencez par le diagnostic gratuit
            </h2>
            <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.8, marginBottom: 32 }}>
              Sans engagement, sans surprise. Prenez rendez-vous et découvrez comment transformer votre intérieur.
            </p>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 32px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none", boxShadow: `0 8px 32px ${T}40` }}>
              Réserver mon diagnostic gratuit →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

"use client";
import { useEffect } from "react";
import Link from "next/link";
import Reveal from "../../components/Reveal";
import Icon, { IconTile } from "../../components/Icon";
import { PHONE_HREF, PHONE } from "../../lib/data";

const T = "#0DA9A4";
const P = "#D4197A";
const OCEAN = "#12B5B0";
const TEXT = "#1A2D3D";
const MUTED = "#64748B";
const WARM = "#FFF8F4";

/* ── Imagerie Martinique / tropical-premium (Unsplash) ── */
const IMG = {
  heroBg:   "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1600&h=1000&fit=crop&auto=format&q=80", // mer turquoise vue du ciel
  palmLeaf: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=900&h=1100&fit=crop&auto=format&q=80",  // feuillage vert rétroéclairé
  coach:    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=640&h=520&fit=crop&auto=format&q=80",     // intérieur clair, lumineux et ordonné
};

/* Parallax générique — piloté par [data-parallax] (voir globals.css .parallax) */
function useParallax() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layers = Array.from(document.querySelectorAll("[data-parallax]"));
    if (!layers.length) return;
    let raf = null;
    const update = () => {
      const vh = window.innerHeight;
      layers.forEach(el => {
        const speed = parseFloat(el.getAttribute("data-parallax")) || 0.12;
        const r = el.getBoundingClientRect();
        const offset = r.top + r.height / 2 - vh / 2;
        el.style.transform = `translate3d(0, ${(-offset * speed).toFixed(1)}px, 0)`;
      });
      raf = null;
    };
    const onScroll = () => { if (raf == null) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
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
  { step: "01", icon: "search",    title: "Diagnostic", text: "Visite de votre domicile, analyse de vos habitudes et définition de vos objectifs." },
  { step: "02", icon: "scissors",  title: "Désencombrement", text: "Tri de vos objets par catégorie : gardez ce qui vous apporte de la joie." },
  { step: "03", icon: "rangement", title: "Organisation", text: "Chaque objet trouve sa place idéale, accessible et logique au quotidien." },
  { step: "04", icon: "sparkles",  title: "Transformation", text: "Votre intérieur est ordonné, serein. Vous gagnez en bien-être et en efficacité." },
];

export default function CoachPage() {
  useParallax();

  return (
    <div style={{ background: "#fff", overflowX: "hidden" }}>
      {/* ════════════════════════════════
          HERO — immersif, touche tropicale
          ════════════════════════════════ */}
      <section className="inner-hero" style={{ position: "relative", overflow: "hidden", background: `linear-gradient(160deg, ${WARM} 0%, #EAF7F6 100%)`, padding: "clamp(88px, 11vw, 120px) 24px clamp(76px, 9vw, 96px)" }}>
        {/* Calque photo tropical (parallax profond) */}
        <div aria-hidden data-parallax="0.16" className="parallax" style={{ position: "absolute", top: "-22%", left: 0, right: 0, height: "144%", zIndex: 0 }}>
          <img src={IMG.heroBg} alt="" width={1600} height={1000} loading="eager"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.20 }} />
        </div>
        {/* Feuillage — profondeur */}
        <div aria-hidden data-parallax="0.06" className="parallax hide-mobile" style={{ position: "absolute", top: "-10%", right: "-6%", width: "clamp(240px, 30vw, 480px)", height: "120%", zIndex: 0, pointerEvents: "none" }}>
          <img src={IMG.palmLeaf} alt="" width={900} height={1100} loading="eager"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.13, mixBlendMode: "multiply", maskImage: "linear-gradient(to left, #000 30%, transparent 92%)", WebkitMaskImage: "linear-gradient(to left, #000 30%, transparent 92%)" }} />
        </div>
        {/* Voile dégradé — lisibilité à gauche */}
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(105deg, rgba(255,248,244,0.95) 0%, rgba(245,250,247,0.88) 42%, rgba(234,247,246,0.68) 100%)" }} />
        <div aria-hidden style={{ position: "absolute", top: -80, right: "5%", width: 460, height: 460, borderRadius: "50%", background: `radial-gradient(circle, ${T}12, transparent 70%)`, animation: "floatOrb 14s ease-in-out infinite", pointerEvents: "none", zIndex: 1 }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 64, alignItems: "center", position: "relative", zIndex: 2 }}>
          <Reveal>
            <div className="eyebrow" style={{ color: P, display: "inline-flex", alignItems: "center", gap: 7 }}><Icon name="star" size={15} color={P} strokeWidth={2.2} /> Spécialité J&apos;MTD</div>
            <h1 className="display" style={{ fontSize: "clamp(32px, 4.6vw, 56px)", lineHeight: 1.12, marginBottom: 20, letterSpacing: -1 }}>
              Coach en rangement{" "}
              <span style={{ background: `linear-gradient(120deg, ${P}, ${OCEAN})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>méthode Marie Kondo</span>
            </h1>
            <p style={{ fontSize: 16.5, color: MUTED, lineHeight: 1.8, marginBottom: 36, maxWidth: 500 }}>
              Fan absolue de Marie Kondo, notre coach étudie vos besoins, vos habitudes de vie et vos attentes. Un diagnostic initial nous permettra de vous présenter le travail à réaliser et de vous proposer la formule la plus adaptée.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/contact" className="btn-gradient" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 30px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none", boxShadow: `0 10px 34px ${T}44`, border: "none" }}>
                Réserver mon diagnostic gratuit →
              </Link>
              <a href={PHONE_HREF} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 28px", borderRadius: 30, border: `2px solid ${T}40`, color: T, textDecoration: "none", fontSize: 16, fontWeight: 600, background: "rgba(255,255,255,0.85)" }}>
                <Icon name="phone" size={17} color={T} /> {PHONE}
              </a>
            </div>
          </Reveal>

          <Reveal delay={140} style={{ position: "relative" }}>
            <div className="img-zoom-wrap lift" style={{ borderRadius: 24, boxShadow: `0 30px 80px ${T}22, 0 8px 24px rgba(13,27,42,0.10)`, border: "1px solid rgba(255,255,255,0.6)" }}>
              <img src={IMG.coach} alt="Coach rangement méthode Marie Kondo Martinique" width={640} height={520} loading="eager" className="img-zoom"
                style={{ width: "100%", height: 440, objectFit: "cover", display: "block", borderRadius: 24 }} />
              <div aria-hidden style={{ position: "absolute", inset: 0, borderRadius: 24, background: "linear-gradient(to top, rgba(13,27,42,0.24), transparent 46%)", pointerEvents: "none" }} />
            </div>
            {/* Floating badge */}
            <div className="coach-float-badge" style={{ position: "absolute", bottom: 24, left: -16, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", border: `1px solid ${T}20`, borderRadius: 16, padding: "12px 18px", boxShadow: `0 12px 34px ${T}20`, display: "flex", alignItems: "center", gap: 12, zIndex: 2 }}>
              <IconTile name="rangement" size={38} icon={20} from={T} to={OCEAN} radius={11} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>Diagnostic gratuit</div>
                <div style={{ fontSize: 11, color: MUTED }}>Sans engagement</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          MÉTHODE
          ════════════════════════════════ */}
      <section className="main-section" style={{ background: "#F8FAFB", padding: "88px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="eyebrow" style={{ justifyContent: "center" }}>La méthode</div>
            <h2 className="display" style={{ fontSize: "clamp(28px, 4vw, 44px)", marginBottom: 16 }}>
              Un intérieur ordonné transforme votre vie
            </h2>
            <p style={{ fontSize: 16, color: MUTED, maxWidth: 580, margin: "0 auto", lineHeight: 1.8 }}>
              La méthode KonMari ne se résume pas à ranger. C&apos;est une transformation profonde de votre rapport aux objets et à votre espace de vie.
            </p>
          </Reveal>
          <div className="why-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: 20 }}>
            {ETAPES.map((s, i) => (
              <Reveal key={s.step} delay={i * 100} className="lift card-zen"
                style={{ padding: "30px 26px", background: "#fff", borderRadius: 20, boxShadow: "0 4px 28px rgba(13,169,164,0.07)", borderTop: `4px solid ${T}` }}>
                <div style={{ fontSize: 11, color: T, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>ÉTAPE {s.step}</div>
                <IconTile name={s.icon} size={54} icon={26} from={T} to={OCEAN} radius={16} style={{ marginBottom: 14 }} />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.7 }}>{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          FORMULES
          ════════════════════════════════ */}
      <section className="main-section" style={{ background: "#fff", padding: "88px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="eyebrow" style={{ justifyContent: "center" }}>Nos formules</div>
            <h2 className="display" style={{ fontSize: "clamp(28px, 4vw, 44px)" }}>
              Choisissez votre formule
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 24 }}>
            {FORMULES.map((f, i) => (
              <Reveal key={f.id} delay={i * 110} className="lift"
                style={{ position: "relative", background: "#fff", border: `1.5px solid ${f.badge ? `${f.color}35` : "rgba(13,169,164,0.1)"}`, borderRadius: 24, padding: "36px 28px", display: "flex", flexDirection: "column", boxShadow: f.badge ? `0 12px 46px ${f.color}18` : `0 4px 24px rgba(13,169,164,0.06)` }}>
                {f.badge && (
                  <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg, ${f.color}, ${f.color}cc)`, color: "#fff", fontSize: 11, fontWeight: 700, padding: "5px 18px", borderRadius: 30, whiteSpace: "nowrap" }}>
                    {f.badge}
                  </div>
                )}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: f.color, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10 }}>{f.name}</div>
                  <div style={{ fontSize: 34, fontWeight: 700, color: TEXT, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{f.price}</div>
                  <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{f.priceNote}</div>
                </div>
                <hr style={{ border: "none", borderTop: `1px solid ${f.color}20`, margin: "20px 0" }} />
                <ul style={{ listStyle: "none", flex: 1, marginBottom: 28 }}>
                  {f.features.map(feat => (
                    <li key={feat} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: MUTED, marginBottom: 12 }}>
                      <span style={{ flexShrink: 0, marginTop: 2 }}><Icon name="check" size={15} color={f.color} strokeWidth={2.5} /></span> {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/contact"
                  style={{ display: "block", textAlign: "center", padding: "14px", borderRadius: 30, background: f.badge ? `linear-gradient(135deg, ${f.color}, ${f.color}bb)` : "transparent", border: `2px solid ${f.color}50`, color: f.badge ? "#fff" : f.color, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
                  {f.cta} →
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal style={{ textAlign: "center", marginTop: 32 }}>
            <p style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, color: MUTED }}>
              <Icon name="conseils" size={15} color={T} /> Toutes les formules ouvrent droit au crédit d&apos;impôt (50% remboursé). Attestation fiscale fournie.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          CTA FINAL
          ════════════════════════════════ */}
      <section style={{ background: "#F8FAFB", padding: "80px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <Reveal className="coach-cta-inner lift" style={{ background: `linear-gradient(135deg, ${T}10, ${P}08)`, border: `1px solid ${T}22`, borderRadius: 28, padding: "56px 40px", textAlign: "center", boxShadow: "0 20px 60px rgba(13,169,164,0.10)" }}>
            <IconTile name="rangement" size={64} icon={32} from={T} to={P} radius={20} style={{ margin: "0 auto 20px" }} />
            <h2 className="display" style={{ fontSize: "clamp(26px, 3.4vw, 38px)", marginBottom: 12 }}>
              Commencez par le diagnostic gratuit
            </h2>
            <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.8, marginBottom: 32 }}>
              Sans engagement, sans surprise. Prenez rendez-vous et découvrez comment transformer votre intérieur.
            </p>
            <Link href="/contact" className="btn-gradient" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 34px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none", boxShadow: `0 10px 34px ${T}44`, border: "none" }}>
              Réserver mon diagnostic gratuit →
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

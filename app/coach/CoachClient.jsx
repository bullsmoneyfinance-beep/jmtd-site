"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Reveal from "../../components/Reveal";
import PinnedFeatureList from "../../components/PinnedFeatureList";
import Icon, { IconTile } from "../../components/Icon";
import { PHONE_HREF, PHONE, TEAL_TEXT } from "../../lib/data";
import useParallax from "../../lib/useParallax";

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


/* Focus rack — la carte la plus proche du centre du viewport devient nette et
   pleine échelle ; les autres sont floutées/atténuées. Proximité continue via
   --proximity (un seul écouteur rAF). AUCUNE transition CSS sur ces propriétés
   pilotées image par image. No-op sous prefers-reduced-motion. */
function useFocusRack() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) { setReduced(true); return; }
    // Mobile (<900px) : effets focus-rack neutralisés en CSS — inutile d'écrire --proximity à chaque frame
    if (window.matchMedia("(max-width: 899px)").matches) return;
    const items = Array.from(document.querySelectorAll("[data-focus]"));
    if (!items.length) return;
    let raf = null;
    const update = () => {
      const vh = window.innerHeight;
      const center = vh * 0.5;
      items.forEach(el => {
        const r = el.getBoundingClientRect();
        const elCenter = r.top + r.height / 2;
        const dist = Math.abs(elCenter - center);
        const proximity = Math.max(0, 1 - dist / (vh * 0.62));
        el.style.setProperty("--proximity", proximity.toFixed(3));
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
  return reduced;
}

/* Style d'une carte "focus rack" — défaut --proximity=1 (nette) pour éviter tout
   flash de flou avant le premier rAF. Retourne null quand reduced (statique). */
const focusCard = (reduced) => reduced ? null : {
  filter: "blur(calc((1 - var(--proximity, 1)) * 3px)) saturate(calc(0.65 + var(--proximity, 1) * 0.35))",
  transform: "scale(calc(0.95 + var(--proximity, 1) * 0.05))",
  opacity: "calc(0.62 + var(--proximity, 1) * 0.38)",
  willChange: "transform, opacity, filter",
};

const FORMULES = [
  {
    id: "diagnostic",
    name: "Diagnostic",
    price: "Offert",
    priceNote: "Premier rendez-vous gratuit",
    color: TEAL_TEXT,
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
    price: "42€/h",
    priceNote: "+ 15€ de frais de déplacement",
    color: P,
    badge: "Le plus choisi",
    features: [
      "Rangement guidé, pièce par pièce",
      "Méthode Marie Kondo adaptée à vous",
      "Conseils organisation & rangement",
      "Tri, désencombrement, mise en ordre",
      "Facturation à l'heure, sans forfait imposé",
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
  { step: "01", icon: "search",    title: "Diagnostic", text: "Visite de votre domicile, analyse de vos habitudes et définition de vos objectifs.", color: T, to: OCEAN },
  { step: "02", icon: "scissors",  title: "Désencombrement", text: "Tri de vos objets par catégorie : gardez ce qui vous apporte de la joie.", color: P, to: "#E0559E" },
  { step: "03", icon: "rangement", title: "Organisation", text: "Chaque objet trouve sa place idéale, accessible et logique au quotidien.", color: T, to: OCEAN },
  { step: "04", icon: "sparkles",  title: "Transformation", text: "Votre intérieur est ordonné, serein. Vous gagnez en bien-être et en efficacité.", color: "#8B5CF6", to: "#A78BFA" },
];

export default function CoachPage() {
  useParallax();
  const reduced = useFocusRack();

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
          <img src={IMG.palmLeaf} alt="" width={900} height={1100} loading="lazy"
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
              <a href={PHONE_HREF} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 28px", borderRadius: 30, border: `2px solid ${T}40`, color: TEAL_TEXT, textDecoration: "none", fontSize: 16, fontWeight: 600, background: "rgba(255,255,255,0.85)" }}>
                <Icon name="phone" size={17} color={TEAL_TEXT} /> {PHONE}
              </a>
            </div>
          </Reveal>

          <Reveal delay={140} style={{ position: "relative" }}>
            <div className="img-zoom-wrap lift" style={{ borderRadius: 24, boxShadow: `0 30px 80px ${T}22, 0 8px 24px rgba(13,27,42,0.10)`, border: "1px solid rgba(255,255,255,0.6)" }}>
              <Image src={IMG.coach} alt="Coach rangement méthode Marie Kondo Martinique" width={640} height={520} priority className="img-zoom"
                sizes="(max-width: 900px) 100vw, 520px"
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
          <PinnedFeatureList
            eyebrow="La méthode"
            title="Un intérieur ordonné transforme votre vie"
            intro="La méthode KonMari ne se résume pas à ranger : c'est une transformation profonde de votre rapport aux objets et à votre espace de vie."
            items={ETAPES}
          />
        </div>
      </section>

      {/* ════════════════════════════════
          FORMULES
          ════════════════════════════════ */}
      <section className="main-section" style={{ background: "#fff", padding: "88px 24px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden className="co-orb co-orb-a" />
        <div aria-hidden className="co-orb co-orb-b" />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal scaleIn style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="eyebrow" style={{ justifyContent: "center" }}>Nos formules</div>
            <h2 className="display" style={{ fontSize: "clamp(28px, 4vw, 44px)" }}>
              Choisissez votre formule
            </h2>
          </Reveal>
          <Reveal scaleIn style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 24 }}>
            {FORMULES.map((f, i) => (
              <div key={f.id} data-focus
                style={{ ...focusCard(reduced), position: "relative", background: "#fff", border: `1.5px solid ${f.badge ? `${f.color}35` : "rgba(13,169,164,0.1)"}`, borderRadius: 24, padding: "36px 28px", display: "flex", flexDirection: "column", boxShadow: f.badge ? `0 12px 46px ${f.color}18` : `0 4px 24px rgba(13,169,164,0.06)` }}>
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
              </div>
            ))}
          </Reveal>
          <Reveal scaleIn style={{ textAlign: "center", marginTop: 32 }}>
            <p style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, color: MUTED }}>
              <Icon name="conseils" size={15} color={TEAL_TEXT} /> Toutes les formules ouvrent droit au crédit d&apos;impôt (50% remboursé). Attestation fiscale fournie.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          CTA FINAL
          ════════════════════════════════ */}
      <section style={{ background: "#F8FAFB", padding: "80px 24px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden className="co-orb co-orb-a" style={{ top: -70, left: "-4%" }} />
        <div aria-hidden className="co-orb co-orb-b" style={{ bottom: -80, right: "-2%" }} />
        <div style={{ maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal scaleIn className="coach-cta-inner lift" style={{ background: `linear-gradient(135deg, ${T}10, ${P}08)`, border: `1px solid ${T}22`, borderRadius: 28, padding: "56px 40px", textAlign: "center", boxShadow: "0 20px 60px rgba(13,169,164,0.10)" }}>
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

      {/* ── Halos de couleur ambiants + sécurité mobile ── */}
      <style>{`
        @keyframes coDrift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-18px, 20px); } }
        .co-orb { position: absolute; border-radius: 50%; filter: blur(55px); pointer-events: none; z-index: 0; animation: coDrift 17s ease-in-out infinite; }
        .co-orb-a { width: 340px; height: 340px; top: -90px; left: -70px; background: radial-gradient(circle, ${T}18, transparent 70%); }
        .co-orb-b { width: 280px; height: 280px; bottom: -80px; right: 2%; background: radial-gradient(circle, ${P}14, transparent 70%); animation-duration: 14s; animation-delay: -5s; }

        @media (max-width: 768px) {
          .co-orb { display: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .co-orb { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

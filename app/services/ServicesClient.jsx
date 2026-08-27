"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Reveal from "../../components/Reveal";
import PinnedFeatureList from "../../components/PinnedFeatureList";
import Icon, { IconTile } from "../../components/Icon";
import { SERVICES, PHONE, PHONE_HREF, TEAL_TEXT } from "../../lib/data";
import useParallax from "../../lib/useParallax";

const T = "#0DA9A4";
const P = "#D4197A";
const OCEAN = "#12B5B0";
const TEXT = "#1A2D3D";
const MUTED = "#64748B";
const WARM = "#FFF8F4";

/* ── Imagerie Martinique / tropical-premium (Unsplash) ── */
const IMG = {
  heroBg:   "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&h=1100&fit=crop&auto=format&q=80", // lagon turquoise
  palmLeaf: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=900&h=1100&fit=crop&auto=format&q=80",  // frondes de palmier
};


/* ────────────────────────────────────────
   Focus-rack — effet de MISE AU POINT continue.
   La prestation la plus proche du centre du viewport est nette & pleine échelle ;
   les autres sont floues, atténuées, désaturées. Un seul écouteur scroll (rAF)
   recalcule --proximity par item via getBoundingClientRect.
   No-op complet sous prefers-reduced-motion.
   (Motif adapté de components/PinnedFeatureList.jsx.)
   IMPORTANT : aucune transition CSS sur filter/transform/opacity — ces propriétés
   sont pilotées image par image via --proximity (voir style inline plus bas).
──────────────────────────────────────── */
function useFocusRack() {
  const itemRefs = useRef([]);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    if (mq.matches) return;
    // Mobile (<900px) : effets focus-rack neutralisés en CSS — inutile d'écrire --proximity à chaque frame
    if (window.matchMedia("(max-width: 899px)").matches) return;

    let raf = null;
    const update = () => {
      const vh = window.innerHeight;
      const center = vh * 0.5;
      const reach = vh * 0.62; // distance à laquelle la proximité retombe à 0
      itemRefs.current.forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const elCenter = r.top + r.height / 2;
        const dist = Math.abs(elCenter - center);
        const proximity = Math.max(0, 1 - dist / reach);
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

  return { itemRefs, reduced };
}

export default function ServicesPage() {
  useParallax();
  const { itemRefs, reduced } = useFocusRack();

  return (
    <div style={{ background: "#fff", overflowX: "hidden" }}>
      {/* ════════════════════════════════
          HERO — immersif, clair & aéré, touche tropicale
          ════════════════════════════════ */}
      <section className="inner-hero" style={{ position: "relative", overflow: "hidden", background: `linear-gradient(160deg, ${WARM} 0%, #EAF7F6 100%)`, padding: "clamp(88px, 12vw, 130px) 24px clamp(72px, 9vw, 100px)", textAlign: "center" }}>
        {/* Calque photo tropical (parallax profond — lagon turquoise) */}
        <div aria-hidden data-parallax="0.16" className="parallax" style={{ position: "absolute", top: "-22%", left: 0, right: 0, height: "144%", zIndex: 0 }}>
          <img src={IMG.heroBg} alt="" width={1600} height={1100} loading="eager"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.24 }} />
        </div>
        {/* Frondes de palmier — profondeur (parallax plus lent) */}
        <div aria-hidden data-parallax="0.06" className="parallax hide-mobile" style={{ position: "absolute", top: "-10%", right: "-6%", width: "clamp(240px, 32vw, 520px)", height: "120%", zIndex: 0, pointerEvents: "none" }}>
          <img src={IMG.palmLeaf} alt="" width={900} height={1100} loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.14, mixBlendMode: "multiply", maskImage: "linear-gradient(to left, #000 30%, transparent 92%)", WebkitMaskImage: "linear-gradient(to left, #000 30%, transparent 92%)" }} />
        </div>
        {/* Voile dégradé — lisibilité */}
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(180deg, rgba(255,248,244,0.90) 0%, rgba(240,249,247,0.80) 55%, rgba(234,247,246,0.70) 100%)" }} />
        {/* Orbes doux */}
        <div aria-hidden style={{ position: "absolute", top: -80, right: "8%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${T}14, transparent 70%)`, animation: "floatOrb 14s ease-in-out infinite", pointerEvents: "none", zIndex: 1 }} />
        <div aria-hidden style={{ position: "absolute", bottom: -60, left: "5%", width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${P}0c, transparent 70%)`, animation: "floatOrb 18s ease-in-out infinite reverse", pointerEvents: "none", zIndex: 1 }} />

        <Reveal scaleIn style={{ maxWidth: 760, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div className="eyebrow" style={{ justifyContent: "center" }}>Nos prestations</div>
          <h1 className="display" style={{ fontSize: "clamp(34px, 5vw, 60px)", marginBottom: 22, letterSpacing: -1.2, lineHeight: 1.1 }}>
            Des services à la personne{" "}
            <span style={{ background: `linear-gradient(120deg, ${T}, ${OCEAN} 45%, ${P})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>complets en Martinique</span>
          </h1>
          <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.8, marginBottom: 36, maxWidth: 620, margin: "0 auto 36px" }}>
            De l&apos;entretien de votre domicile à la préparation de vos repas, en passant par la livraison de courses et le coach en rangement.{" "}
            <strong style={{ color: TEXT }}>50% remboursé</strong> par crédit d&apos;impôt.
          </p>
          <Link href="/contact" className="btn-gradient" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 34px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none", boxShadow: `0 10px 34px ${T}44`, border: "none" }}>
            Demander un devis gratuit →
          </Link>
        </Reveal>
      </section>

      {/* ════════════════════════════════
          POURQUOI J'MTD — moment signature cinématique (texte épinglé + scène vivante)
          Réutilise PinnedFeatureList (identique au niveau de la page d'accueil).
          ════════════════════════════════ */}
      <section style={{ background: WARM, padding: "clamp(72px, 9vw, 96px) 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <PinnedFeatureList
            eyebrow="Pourquoi J'MTD"
            title={<>Des prestations,<br />une vraie tranquillité</>}
            intro="Chaque service est pensé pour vous simplifier la vie — avec des intervenantes de confiance et 50% remboursés par l'État."
            items={[
              { icon: "lock",     title: "Des intervenantes de confiance", text: "Sélectionnées, formées et discrètes, nos intervenantes prennent soin de votre intérieur comme du leur — sérieux, ponctualité et sourire à chaque passage.", color: T, to: OCEAN },
              { icon: "credit",   title: "50% remboursé par crédit d'impôt", text: "Toutes nos prestations à domicile ouvrent droit au crédit d'impôt services à la personne. Nous vous remettons une attestation fiscale chaque année.", color: P, to: "#E0559E" },
              { icon: "calendar", title: "Un accompagnement sur-mesure", text: "Ménage, repas, courses, administratif ou coach rangement : nous adaptons chaque prestation à votre rythme, dans le Centre et le Sud de la Martinique.", color: T, to: OCEAN },
            ]}
          />
        </div>
      </section>

      {/* ════════════════════════════════
          SERVICES — présentation éditoriale alternée + effet de mise au point
          ════════════════════════════════ */}
      <section className="main-section" style={{ background: "#F8FAFB", padding: "88px 24px", position: "relative", overflow: "hidden" }}>
        {/* Halos de couleur flottants — ambiance de section */}
        <div aria-hidden className="svc-orb svc-orb-a" />
        <div aria-hidden className="svc-orb svc-orb-b" />

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 80 }}>
          <Reveal scaleIn style={{ textAlign: "center" }}>
            <div className="eyebrow" style={{ justifyContent: "center" }}>En détail</div>
            <h2 className="display" style={{ fontSize: "clamp(28px, 3.6vw, 44px)" }}>Chaque prestation, en détail</h2>
          </Reveal>

          {SERVICES.map((s, i) => (
            <div key={s.id} id={s.id} ref={(el) => (itemRefs.current[i] = el)} className="svc-item"
              style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 56, alignItems: "center",
                direction: i % 2 === 0 ? "ltr" : "rtl",
                scrollMarginTop: 100,
                filter: reduced ? "none" : "blur(calc((1 - var(--proximity, 0)) * 3px)) saturate(calc(0.55 + var(--proximity, 0) * 0.45))",
                transform: reduced ? "none" : "scale(calc(0.955 + var(--proximity, 0) * 0.045))",
                opacity: reduced ? 1 : "calc(0.5 + var(--proximity, 0) * 0.5)",
                transformOrigin: "center",
                willChange: reduced ? "auto" : "transform, opacity, filter",
              }}>
              {/* Image */}
              <div style={{ direction: "ltr", position: "relative" }}>
                {s.img ? (
                  <div className="img-zoom-wrap lift" style={{ borderRadius: 24, boxShadow: `0 20px 64px ${T}1e`, border: "1px solid rgba(255,255,255,0.6)" }}>
                    <Image src={s.img} alt={s.title} width={560} height={320} loading="lazy" className="img-zoom"
                      sizes="(max-width: 900px) 100vw, 480px"
                      style={{ width: "100%", height: 320, objectFit: "cover", display: "block", borderRadius: 24 }} />
                    <div aria-hidden style={{ position: "absolute", inset: 0, borderRadius: 24, background: "linear-gradient(to top, rgba(13,27,42,0.18), transparent 45%)", pointerEvents: "none" }} />
                  </div>
                ) : (
                  <div style={{ width: "100%", height: 320, borderRadius: 24, background: `linear-gradient(135deg, ${T}15, ${P}10)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 16px 64px ${T}14` }}>
                    <Icon name={s.id} size={80} color={TEAL_TEXT} strokeWidth={1.5} />
                  </div>
                )}
                {s.special && (
                  <div style={{ position: "absolute", top: 16, left: 16, display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.95)", border: `1px solid ${T}30`, borderRadius: 30, padding: "5px 14px", fontSize: 12, color: TEAL_TEXT, fontWeight: 700, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", zIndex: 2 }}>
                    <Icon name="star" size={13} color={TEAL_TEXT} strokeWidth={2.2} /> Spécialité J&apos;MTD
                  </div>
                )}
              </div>

              <div style={{ direction: "ltr" }}>
                <IconTile name={s.id} size={56} icon={26} from={s.special ? P : T} to={s.special ? "#E0559E" : OCEAN} radius={16} style={{ marginBottom: 16 }} />
                <h2 className="display" style={{ fontSize: 30, marginBottom: 8 }}>{s.title}</h2>
                <p style={{ fontSize: 15, fontWeight: 600, color: TEAL_TEXT, marginBottom: 16 }}>{s.headline}</p>
                <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.8, marginBottom: 24 }}>{s.desc}</p>
                <ul style={{ listStyle: "none", marginBottom: 32 }}>
                  {s.details.map(d => (
                    <li key={d} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: MUTED, marginBottom: 10 }}>
                      <span style={{ flexShrink: 0, marginTop: 2 }}><Icon name="check" size={15} color={TEAL_TEXT} strokeWidth={2.5} /></span> {d}
                    </li>
                  ))}
                </ul>
                <Link href={s.id === "rangement" ? "/coach" : `/contact?service=${s.id}`} className="btn-gradient"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none", boxShadow: `0 6px 24px ${T}35`, border: "none" }}>
                  {s.id === "rangement" ? "Voir les formules →" : "Demander un devis →"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════
          CRÉDIT IMPÔT — bannière
          ════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "80px 24px", position: "relative", overflow: "hidden" }}>
        {/* Halos de couleur flottants — ambiance de section */}
        <div aria-hidden className="svc-orb svc-orb-a" />
        <div aria-hidden className="svc-orb svc-orb-b" />

        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal scaleIn className="lift" style={{ background: `linear-gradient(135deg, ${T}10, ${P}08)`, border: `1px solid ${T}22`, borderRadius: 28, padding: "52px 40px", textAlign: "center", boxShadow: "0 20px 60px rgba(13,169,164,0.10)" }}>
            <IconTile name="credit" size={66} icon={32} from={T} to={P} radius={20} style={{ margin: "0 auto 20px" }} />
            <h2 className="display" style={{ fontSize: "clamp(26px, 3.4vw, 40px)", marginBottom: 12 }}>
              50% de vos dépenses remboursées
            </h2>
            <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.8, marginBottom: 32, maxWidth: 560, margin: "0 auto 32px" }}>
              Toutes nos prestations ouvrent droit au crédit d&apos;impôt services à la personne (art. 199 sexdecies du CGI). Une attestation fiscale vous est remise chaque année.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/contact" className="btn-gradient" style={{ padding: "14px 28px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, textDecoration: "none", fontSize: 15, boxShadow: `0 6px 24px ${T}35`, border: "none" }}>
                Obtenir un devis gratuit
              </Link>
              <a href={PHONE_HREF} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 30, border: `2px solid ${T}44`, color: TEAL_TEXT, fontWeight: 700, textDecoration: "none", fontSize: 15 }}>
                <Icon name="phone" size={16} color={TEAL_TEXT} /> {PHONE}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Ambiance & sécurité responsive (scopé .svc-*) ── */}
      <style>{`
        @keyframes svcDrift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-18px, 22px); } }
        .svc-orb { position: absolute; border-radius: 50%; filter: blur(55px); pointer-events: none; z-index: 0; animation: svcDrift 17s ease-in-out infinite; }
        .svc-orb-a { width: 340px; height: 340px; top: -90px; left: -70px; background: radial-gradient(circle, ${T}1f, transparent 70%); }
        .svc-orb-b { width: 280px; height: 280px; bottom: -80px; right: 3%; background: radial-gradient(circle, ${P}18, transparent 70%); animation-duration: 14s; animation-delay: -5s; }

        @media (max-width: 900px) {
          .svc-item { gap: 32px !important; }
        }
        @media (max-width: 600px) {
          .svc-orb { display: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .svc-orb { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

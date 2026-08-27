"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { PHONE_HREF, WHATSAPP, SERVICES, TEAL_TEXT } from "../../lib/data";
import SapBadge from "../../components/SapBadge";
import Reveal from "../../components/Reveal";
import PinnedFeatureList from "../../components/PinnedFeatureList";
import Icon, { IconTile } from "../../components/Icon";
import useParallax from "../../lib/useParallax";

const T = "#0DA9A4";
const P = "#D4197A";
const OCEAN = "#12B5B0";
const TEXT = "#1A2D3D";
const MUTED = "#64748B";
const WARM = "#FFF8F4";

/* ── Imagerie Martinique / tropical-premium (Unsplash) ── */
const IMG = {
  sea:  "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1600&h=1000&fit=crop&auto=format&q=80", // mer turquoise vue du ciel
  palm: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=900&h=1100&fit=crop&auto=format&q=80",  // frondes de palmier, lumière douce
  greenery: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1600&h=900&fit=crop&auto=format&q=80", // feuillage vert rétroéclairé
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

// Prix net après crédit d'impôt 50 % — formatage FR (virgule décimale)
const net = (v) => (v / 2).toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

// Formules d'abonnement ménage — dégressif selon la durée d'engagement (grille officielle : 30/28/27/26 €/h)
const ABONNEMENTS = [
  { key: "ponctuel", label: "Ponctuel", tag: "Sans engagement", taux: 30, desc: "À la demande, quand vous voulez", features: ["Intervention à la carte", "Minimum 2h par semaine", "Idéal pour un grand ménage"] },
  { key: "mensuel", label: "Mensuel", tag: "Engagement 1 mois", taux: 28, desc: "Le rythme confort pour un intérieur toujours net", features: ["Intervenante attitrée", "Créneau fixe réservé", "Produits fournis"] },
  { key: "trimestriel", label: "Trimestriel", tag: "Engagement 3 mois", taux: 27, popular: true, desc: "Notre formule la plus choisie", features: ["Intervenante attitrée", "Priorité sur le planning", "Suivi qualité"] },
  { key: "annuel", label: "Annuel", tag: "Engagement 1 an", taux: 26, desc: "Le meilleur tarif, prise en charge complète", features: ["Référent dédié", "Planning sur-mesure", "Remplacement garanti", "Bilan régulier"] },
];

const TARIFS = [
  {
    id: "entretien",
    icon: "entretien",
    title: "Entretien & Ménage",
    from: 26,
    unit: "h",
    popular: true,
    desc: "Ménage complet, vitres et surfaces, désinfection. Intervenante attitrée, produits professionnels fournis.",
    includes: ["Ménage complet du domicile", "Nettoyage vitres & surfaces", "Sols : aspiration + lavage", "Désinfection pièces humides", "Minimum 2h par semaine"],
    color: TEAL_TEXT,
    note: "Formules d'abonnement dégressives ci-dessous",
  },
  {
    id: "repas",
    icon: "repas",
    title: "Préparation des repas",
    from: 30,
    unit: "h",
    popular: false,
    desc: "Cuisine faite maison à votre domicile, temps de courses et commissions inclus, selon vos goûts et régimes.",
    includes: ["Repas équilibrés & savoureux", "Temps de courses / commissions inclus", "Respect des régimes alimentaires", "Rangement & nettoyage après cuisson"],
    color: P,
  },
  {
    id: "courses",
    icon: "courses",
    title: "Livraison de courses",
    from: 26,
    unit: "h",
    popular: false,
    desc: "Vos commissions faites selon votre liste et livrées chez vous, dans le Centre et le Sud de la Martinique.",
    includes: ["Courses sur liste personnalisée", "Livraison à domicile", "Gestion produits frais & surgelés", "Rangement des courses à domicile"],
    color: "#10B981",
  },
  {
    id: "bureaux",
    icon: "entretien",
    title: "Nettoyage locaux & bureaux",
    from: 29,
    unit: "h",
    popular: false,
    desc: "Entretien professionnel de vos locaux et bureaux. Tarif dégressif selon la fréquence d'intervention.",
    includes: ["Nettoyage complet des locaux", "Sanitaires & parties communes", "Sols & surfaces de travail", "Fréquence adaptée à votre activité"],
    color: "#0EA5E9",
  },
  {
    id: "assistance",
    icon: "assistance",
    title: "Assistance administrative",
    from: 34,
    unit: "h",
    popular: false,
    desc: "Tri du courrier, démarches en ligne, saisie informatique, classement et archivage.",
    includes: ["Tri & classement du courrier", "Aide à la saisie informatique", "Accompagnement démarches en ligne", "Archivage de documents"],
    color: "#F59E0B",
  },
  {
    id: "rangement",
    icon: "rangement",
    title: "Coach en rangement",
    from: 42,
    unit: "h",
    popular: false,
    desc: "Rangement guidé et organisation de votre intérieur, pièce par pièce. Diagnostic-conseil offert avant toute prestation.",
    includes: ["Rangement guidé pièce par pièce", "Tri & désencombrement", "Méthode d'organisation durable", "+ 15€ de frais de déplacement"],
    color: P,
  },
  {
    id: "repassage",
    icon: "entretien",
    title: "Repassage à la pièce",
    from: null,
    unit: "pièce",
    priceLabel: "À la pièce",
    popular: false,
    desc: "Repassage soigné, facturé à la pièce. Disponible à Rivière-Salée uniquement.",
    color: "#8B5CF6",
    formules: [
      { label: "Linge délicat", price: "4,50€ / pièce", desc: "Chemises, chemisiers, blouses, jupes plissées, robes, draps" },
      { label: "Vêtements du quotidien", price: "2,60€ / pièce", desc: "Tarif unique à la pièce, non dégressif" },
    ],
  },
  {
    id: "jardinage",
    icon: "jardinage",
    title: "Entretien extérieur & jardinage",
    from: null,
    unit: null,
    priceLabel: "Sur devis",
    popular: false,
    desc: "Petits travaux de jardinage et entretien des extérieurs de votre domicile — sur devis personnalisé.",
    includes: ["Tonte, taille & désherbage", "Entretien des massifs & terrasses", "Ramassage & évacuation des déchets verts", "Nettoyage des abords"],
    color: "#16A34A",
  },
];

function SimulateurCredit() {
  const [tauxH, setTauxH] = useState(30);
  const [heures, setHeures] = useState(8);
  const brut = tauxH * heures;
  const credit = Math.round(brut * 0.5);
  const net = brut - credit;

  return (
    <div style={{ background: `linear-gradient(135deg, ${T}10, ${P}08)`, border: `1px solid ${T}25`, borderRadius: 24, padding: "32px 28px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <Icon name="calc" size={26} color={TEAL_TEXT} strokeWidth={2} />
        <h3 style={{ fontSize: 20, fontWeight: 700, color: TEXT, margin: 0 }}>Simulateur crédit d'impôt</h3>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }} className="simu-grid">
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 8 }}>
            Taux horaire (€/h)
          </label>
          <input type="range" min="24" max="42" value={tauxH} onChange={e => setTauxH(+e.target.value)}
            style={{ width: "100%", accentColor: T, cursor: "pointer" }} />
          <div style={{ textAlign: "center", fontSize: 22, fontWeight: 800, color: TEAL_TEXT, marginTop: 6 }}>{tauxH}€/h</div>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 8 }}>
            Heures par mois
          </label>
          <input type="range" min="1" max="20" value={heures} onChange={e => setHeures(+e.target.value)}
            style={{ width: "100%", accentColor: T, cursor: "pointer" }} />
          <div style={{ textAlign: "center", fontSize: 22, fontWeight: 800, color: TEAL_TEXT, marginTop: 6 }}>{heures}h/mois</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }} className="simu-results">
        <div style={{ textAlign: "center", padding: "16px 12px", background: "rgba(255,255,255,0.7)", borderRadius: 16, border: "1px solid rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>Coût brut</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: TEXT }}>{brut}€</div>
          <div style={{ fontSize: 11, color: MUTED }}>par mois</div>
        </div>
        <div style={{ textAlign: "center", padding: "16px 12px", background: `linear-gradient(135deg, ${P}15, ${P}08)`, borderRadius: 16, border: `1px solid ${P}30` }}>
          <div style={{ fontSize: 11, color: P, fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>Crédit d'impôt</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: P }}>−{credit}€</div>
          <div style={{ fontSize: 11, color: MUTED }}>remboursé</div>
        </div>
        <div style={{ textAlign: "center", padding: "16px 12px", background: `linear-gradient(135deg, ${T}15, ${T}08)`, borderRadius: 16, border: `1px solid ${T}30` }}>
          <div style={{ fontSize: 11, color: TEAL_TEXT, fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>Coût réel</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: T }}>{net}€</div>
          <div style={{ fontSize: 11, color: MUTED }}>par mois</div>
        </div>
      </div>

      <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 16, textAlign: "center" }}>
        * Simulation indicative. Crédit d'impôt applicable aux particuliers. Sous réserve de conditions fiscales.
      </p>
    </div>
  );
}

export default function TarifsPage() {
  const [open, setOpen] = useState(null);
  useParallax();
  const reduced = useFocusRack();

  return (
    <>
      <style>{`
        @keyframes floatOrb { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }

        /* ── Halos de couleur ambiants (mêmes codes que la home) ── */
        @keyframes tfDrift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-18px, 20px); } }
        .tf-orb { position: absolute; border-radius: 50%; filter: blur(55px); pointer-events: none; z-index: 0; animation: tfDrift 17s ease-in-out infinite; }
        .tf-orb-a { width: 340px; height: 340px; top: -90px; left: -70px; background: radial-gradient(circle, ${T}18, transparent 70%); }
        .tf-orb-b { width: 280px; height: 280px; bottom: -80px; right: 2%; background: radial-gradient(circle, ${P}14, transparent 70%); animation-duration: 14s; animation-delay: -5s; }

        @media (max-width: 768px) {
          .tarifs-hero { padding: 44px 16px 36px !important; }
          .hero-palm { opacity: 0.5 !important; }
          .tarifs-section { padding: 32px 16px 80px !important; }
          .tarifs-grid { grid-template-columns: 1fr !important; }
          .abo-grid { grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
          .abo-grid > div { transform: none !important; }
          .abo-section { padding: 48px 16px 64px !important; }
          .simu-grid { grid-template-columns: 1fr !important; }
          .simu-results { grid-template-columns: 1fr !important; }
          .credit-explainer { grid-template-columns: 1fr !important; gap: 16px !important; }
          .tarifs-card-pad { padding: 20px 18px !important; }
          .tf-orb { display: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .tf-orb { animation: none !important; }
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="tarifs-hero" style={{ background: `linear-gradient(160deg, ${WARM} 0%, #EAF7F6 100%)`, padding: "88px 24px 64px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Calque mer turquoise (parallax profond) */}
        <div aria-hidden data-parallax="0.16" className="parallax" style={{ position: "absolute", top: "-24%", left: 0, right: 0, height: "148%", zIndex: 0 }}>
          <img src={IMG.sea} alt="" width={1600} height={1000} loading="eager"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.20 }} />
        </div>
        {/* Frondes de palmier — accent tropical (droite) */}
        <div aria-hidden data-parallax="0.06" className="parallax hero-palm" style={{ position: "absolute", top: "-8%", right: "-6%", width: "clamp(200px, 30vw, 440px)", height: "116%", zIndex: 0, pointerEvents: "none" }}>
          <img src={IMG.palm} alt="" width={900} height={1100} loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.13, mixBlendMode: "multiply", maskImage: "linear-gradient(to left, #000 18%, transparent 90%)", WebkitMaskImage: "linear-gradient(to left, #000 18%, transparent 90%)" }} />
        </div>
        {/* Voile clair pour lisibilité */}
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(180deg, rgba(255,248,244,0.90) 0%, rgba(248,250,247,0.82) 46%, rgba(234,247,246,0.74) 100%)" }} />
        <div style={{ position: "absolute", top: -80, right: "8%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${T}14, transparent 70%)`, filter: "blur(50px)", animation: "floatOrb 14s ease-in-out infinite", pointerEvents: "none", zIndex: 1 }} />
        <div style={{ position: "absolute", bottom: -60, left: "5%", width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${P}10, transparent 70%)`, filter: "blur(50px)", animation: "floatOrb 18s ease-in-out infinite", pointerEvents: "none", zIndex: 1 }} />
        <div style={{ maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: `1.5px solid ${T}28`, borderRadius: 30, padding: "7px 18px", marginBottom: 20, boxShadow: "0 2px 14px rgba(13,169,164,0.12)" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: T, display: "inline-block" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: TEAL_TEXT, textTransform: "uppercase", letterSpacing: 1.5 }}>Tarifs & Devis</span>
          </div>
          <h1 className="display" style={{ fontSize: "clamp(30px, 5vw, 52px)", color: TEXT, lineHeight: 1.15, marginBottom: 18 }}>
            Des tarifs clairs,{" "}
            <span style={{ background: `linear-gradient(135deg, ${T}, ${P})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              remboursés à 50%
            </span>
          </h1>
          <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.8, maxWidth: 540, margin: "0 auto 36px" }}>
            Toutes nos prestations ouvrent droit au <strong style={{ color: TEXT }}>crédit d'impôt SAP de 50%</strong>. Ce qui coûte 20€ ne vous revient qu'à 10€.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none", boxShadow: `0 8px 28px ${T}40` }}>
              Devis gratuit →
            </Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 30, background: "#25D366", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
              <Icon name="chat" size={17} color="#fff" /> WhatsApp rapide
            </a>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
            <SapBadge variant="inline" />
          </div>
        </div>
      </section>

      {/* ── Crédit d'impôt : moment signature épinglé (mise au point au scroll) ── */}
      <section style={{ background: "#F8FAFB", padding: "88px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <PinnedFeatureList
            eyebrow="Crédit d'impôt SAP"
            title="Comment fonctionne le crédit d'impôt ?"
            intro="L'État rembourse 50% de vos dépenses en services à la personne — automatiquement, sur votre déclaration d'impôts."
            items={[
              { icon: "assistance", title: "Vous commandez votre prestation", text: "Choisissez la prestation et la fréquence qui vous conviennent. Un devis gratuit et sans engagement précède toujours la première intervention.", color: T, to: OCEAN },
              { icon: "home", title: "Nous intervenons chez vous", text: "Votre intervenante attitrée se déplace aux créneaux convenus, avec ses produits professionnels fournis.", color: P, to: "#E0559E" },
              { icon: "sap", title: "Vous recevez votre attestation fiscale", text: "Chaque année en janvier, nous vous remettons l'attestation qui récapitule vos dépenses en services à la personne.", color: T, to: OCEAN },
              { icon: "credit", title: "50 % vous sont remboursés", text: "Le crédit d'impôt s'applique sur votre déclaration — et vous êtes remboursé même si vous n'êtes pas imposable.", color: P, to: "#E0559E" },
            ]}
          />

          <Reveal scaleIn delay={120} style={{ marginTop: 64 }}><SimulateurCredit /></Reveal>
        </div>
      </section>

      {/* ── Grille tarifs — effet "mise au point" au scroll ── */}
      <section className="tarifs-section" style={{ background: "#fff", padding: "72px 24px 80px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden className="tf-orb tf-orb-a" />
        <div aria-hidden className="tf-orb tf-orb-b" />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal scaleIn style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="eyebrow" style={{ justifyContent: "center" }}>Nos prestations</div>
            <h2 className="display" style={{ fontSize: "clamp(24px, 3.5vw, 40px)", color: TEXT, marginBottom: 12 }}>
              Nos prestations & tarifs indicatifs
            </h2>
            <p style={{ fontSize: 15, color: MUTED, maxWidth: 520, margin: "0 auto" }}>
              Devis précis et personnalisé gratuit sur demande. Tarifs avant crédit d'impôt.
            </p>
          </Reveal>

          <Reveal scaleIn className="tarifs-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {TARIFS.map((t, i) => (
              <div key={t.id} data-focus
                style={{ ...focusCard(reduced), background: "#fff", borderRadius: 22, border: t.popular ? `2px solid ${P}` : `1px solid rgba(13,169,164,0.12)`, boxShadow: t.popular ? `0 8px 40px ${P}18` : "0 4px 24px rgba(13,169,164,0.06)", padding: "28px 26px", position: "relative", display: "flex", flexDirection: "column", gap: 16 }}
                className="tarifs-card-pad">
                {t.popular && (
                  <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg, ${P}, ${T})`, color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 18px", borderRadius: 20, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: 0.8, display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <Icon name="star" size={12} color="#fff" strokeWidth={2.5} /> Le plus demandé
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <IconTile name={t.icon} size={52} icon={25} from={t.color} to={t.color} radius={14} />

                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: TEXT, margin: 0, lineHeight: 1.3 }}>{t.title}</h3>
                    {t.from ? (
                      <div style={{ marginTop: 4 }}>
                        <span style={{ fontSize: 22, fontWeight: 800, color: t.color }}>À partir de {t.from}€</span>
                        <span style={{ fontSize: 13, color: MUTED }}>/{t.unit}</span>
                        <div style={{ fontSize: 11, color: TEAL_TEXT, fontWeight: 600, marginTop: 1 }}>→ {Math.round(t.from / 2)}€/{t.unit} après crédit d'impôt</div>
                      </div>
                    ) : (
                      <div style={{ marginTop: 4, fontSize: 18, fontWeight: 800, color: t.color }}>{t.priceLabel || "Sur devis"}</div>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.7, margin: 0 }}>{t.desc}</p>

                {t.cap && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "#16A34A", background: "#16A34A12", border: "1px solid #16A34A28", borderRadius: 20, padding: "4px 11px", alignSelf: "flex-start" }}>
                    ⓘ {t.cap}
                  </div>
                )}
                {t.note && (
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: TEAL_TEXT, marginTop: -4 }}>↓ {t.note}</div>
                )}

                {t.formules ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {t.formules.map(f => (
                      <div key={f.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: `${t.color}08`, border: `1px solid ${t.color}18`, borderRadius: 12 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>{f.label}</div>
                          <div style={{ fontSize: 11, color: MUTED }}>{f.desc}</div>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: t.color, whiteSpace: "nowrap" }}>{f.price}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
                    {t.includes.map(item => (
                      <li key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: MUTED }}>
                        <Icon name="check" size={16} color={t.color} strokeWidth={2.6} /> {item}
                      </li>
                    ))}
                  </ul>
                )}

                <Link href={`/contact?service=${t.id}`}
                  style={{ display: "block", textAlign: "center", padding: "12px", borderRadius: 30, background: t.popular ? `linear-gradient(135deg, ${P}, ${T})` : `${t.color}12`, border: t.popular ? "none" : `1px solid ${t.color}30`, color: t.popular ? "#fff" : t.color, fontWeight: 700, fontSize: 14, textDecoration: "none", marginTop: "auto", transition: "all 0.2s" }}>
                  Demander un devis →
                </Link>
              </div>
            ))}
          </Reveal>

          <div style={{ textAlign: "center", marginTop: 36, padding: "20px 24px", background: `${T}08`, border: `1px solid ${T}20`, borderRadius: 18 }}>
            <p style={{ fontSize: 14, color: MUTED, margin: 0 }}>
              <Icon name="conseils" size={16} color={TEAL_TEXT} style={{ display: "inline-block", verticalAlign: "-3px", marginRight: 4 }} /> <strong style={{ color: TEXT }}>Devis gratuit et sans engagement</strong> — Nous nous déplaçons pour évaluer vos besoins avant tout engagement.{" "}
              <Link href="/contact" style={{ color: TEAL_TEXT, fontWeight: 700 }}>Prendre rendez-vous →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── Formules d'abonnement ménage ── */}
      <section className="abo-section" style={{ background: `linear-gradient(180deg, #F8FAFB, #fff)`, padding: "72px 24px 80px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden className="tf-orb tf-orb-b" style={{ top: -80, left: "-6%", right: "auto", bottom: "auto" }} />
        <div aria-hidden className="tf-orb tf-orb-a" style={{ top: "auto", left: "auto", bottom: -90, right: "-4%", background: `radial-gradient(circle, ${P}12, transparent 70%)` }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal scaleIn style={{ textAlign: "center" }}>
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${P}10`, border: `1px solid ${P}28`, borderRadius: 30, padding: "6px 16px", marginBottom: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: P, textTransform: "uppercase", letterSpacing: 1.2 }}>Ménage régulier · plus vous confiez, moins c'est cher</span>
              </div>
            </div>
            <h2 className="display" style={{ fontSize: "clamp(24px, 3.5vw, 40px)", color: TEXT, textAlign: "center", marginBottom: 12 }}>
              Formules d'abonnement
            </h2>
            <p style={{ fontSize: 15, color: MUTED, maxWidth: 560, margin: "0 auto 44px", textAlign: "center" }}>
              Un tarif dégressif selon votre durée d'engagement. Intervenante attitrée et créneau réservé dès la formule mensuelle.
            </p>
          </Reveal>

          <div className="abo-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, alignItems: "stretch" }}>
            {ABONNEMENTS.map((a, i) => (
              <Reveal key={a.key} delay={i * 90} className={a.popular ? "" : "lift"} style={{
                background: "#fff", borderRadius: 22, padding: "26px 22px", position: "relative",
                border: a.popular ? `2px solid ${P}` : "1px solid rgba(13,169,164,0.14)",
                boxShadow: a.popular ? `0 12px 44px ${P}20` : "0 4px 22px rgba(13,169,164,0.07)",
                display: "flex", flexDirection: "column", gap: 14,
                zIndex: a.popular ? 2 : 1, ...(a.popular ? { transform: "scale(1.03)" } : {}),
              }}>
                {a.popular && (
                  <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg, ${P}, ${T})`, color: "#fff", fontSize: 10.5, fontWeight: 800, padding: "4px 16px", borderRadius: 20, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: 0.8, display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <Icon name="star" size={12} color="#fff" strokeWidth={2.5} /> Le plus choisi
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: TEXT }}>{a.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: a.popular ? P : T, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>{a.tag}</div>
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontSize: 34, fontWeight: 900, color: TEXT, lineHeight: 1 }}>{a.taux}€</span>
                    <span style={{ fontSize: 14, color: MUTED, fontWeight: 600 }}>/heure</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: TEAL_TEXT, marginTop: 6, background: `${T}10`, borderRadius: 10, padding: "6px 10px", display: "inline-block" }}>
                    soit {net(a.taux)}€/h après crédit d'impôt
                  </div>
                </div>
                <p style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.6, margin: 0 }}>{a.desc}</p>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  {a.features.map(f => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12.5, color: TEXT }}>
                      <Icon name="check" size={15} color={a.popular ? P : T} strokeWidth={2.6} style={{ marginTop: 2 }} /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" style={{
                  display: "block", textAlign: "center", padding: "12px", borderRadius: 30, marginTop: "auto",
                  background: a.popular ? `linear-gradient(135deg, ${P}, ${T})` : `${T}12`,
                  border: a.popular ? "none" : `1px solid ${T}30`,
                  color: a.popular ? "#fff" : T, fontWeight: 700, fontSize: 13.5, textDecoration: "none",
                }}>
                  Choisir cette formule →
                </Link>
              </Reveal>
            ))}
          </div>

          <p style={{ fontSize: 12.5, color: "#94A3B8", textAlign: "center", marginTop: 24 }}>
            Repas, courses, administratif et jardinage peuvent être ajoutés à toute formule. Tarifs indicatifs avant crédit d'impôt · engagement mensuel, résiliable avec préavis.
          </p>
        </div>
      </section>

      {/* ── Bande immersive tropicale ── */}
      <section style={{ position: "relative", overflow: "hidden", height: "clamp(260px, 38vw, 400px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div aria-hidden data-parallax="0.14" className="parallax" style={{ position: "absolute", top: "-18%", left: 0, right: 0, height: "136%", zIndex: 0 }}>
          <img src={IMG.greenery} alt="" width={1600} height={900} loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(120deg, rgba(10,40,40,0.80), rgba(13,27,42,0.66))" }} />
        <Reveal y={30} style={{ position: "relative", zIndex: 2, maxWidth: 820, padding: "0 28px", textAlign: "center" }}>
          <Icon name="jardinage" size={32} color="#fff" style={{ margin: "0 auto 16px" }} />
          <p className="display" style={{ fontSize: "clamp(22px, 3.2vw, 36px)", color: "#fff", lineHeight: 1.3, fontWeight: 600 }}>
            « Un intérieur toujours net,<br />sans y penser. »
          </p>
          <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.72)", marginTop: 16, letterSpacing: 0.5 }}>
            Un tarif dégressif, un confort durable · J&apos;MTD Martinique
          </div>
        </Reveal>
      </section>

      {/* ── FAQ mini ── */}
      <section style={{ background: "#F8FAFB", padding: "56px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Reveal scaleIn>
            <h2 className="display" style={{ fontSize: "clamp(22px, 3vw, 32px)", color: TEXT, textAlign: "center", marginBottom: 32 }}>
              Questions fréquentes sur les tarifs
            </h2>
          </Reveal>
          {[
            { q: "Le crédit d'impôt, c'est pour tout le monde ?", a: "Oui, pour tous les foyers fiscaux français (résidents en Martinique inclus), qu'ils soient imposables ou non. Si vous ne payez pas d'impôts, le crédit devient un remboursement direct." },
            { q: "Comment se passe le paiement ?", a: "Paiement par virement, chèque ou espèces après chaque intervention. Nous remettons une facture détaillée qui sert de justificatif pour votre déclaration d'impôts." },
            { q: "Y a-t-il un minimum d'heures à commander ?", a: "Oui, nous intervenons à partir de 2h minimum par passage pour garantir un travail de qualité. Pour les abonnements hebdomadaires ou mensuels, des forfaits avantageux sont disponibles." },
            { q: "Les tarifs changent-ils selon la distance ?", a: "Nos tarifs de base sont les mêmes dans tout notre secteur d'intervention (Centre et Sud de la Martinique). Des frais de déplacement peuvent s'appliquer pour les communes plus éloignées — précisez votre commune dans le devis." },
          ].map((item, i) => (
            <div key={i} style={{ borderBottom: "1px solid rgba(13,169,164,0.1)" }}>
              <button type="button" onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i} aria-controls={`tarifs-faq-${i}`}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "18px 0", gap: 16, background: "none", border: "none", cursor: "pointer", textAlign: "left", font: "inherit" }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>{item.q}</span>
                <span aria-hidden style={{ color: TEAL_TEXT, fontSize: 20, flexShrink: 0, transition: "transform 0.2s", transform: open === i ? "rotate(45deg)" : "none" }}>+</span>
              </button>
              {open === i && (
                <div id={`tarifs-faq-${i}`} style={{ padding: "0 0 18px", fontSize: 14, color: MUTED, lineHeight: 1.8 }}>{item.a}</div>
              )}
            </div>
          ))}
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link href="/faq" style={{ fontSize: 14, color: TEAL_TEXT, fontWeight: 700, textDecoration: "none" }}>
              Voir toutes les questions fréquentes →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <Reveal scaleIn style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <h2 className="display" style={{ fontSize: "clamp(22px, 3.5vw, 36px)", color: TEXT, marginBottom: 16 }}>
            Prêt à nous confier votre domicile ?
          </h2>
          <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.8, marginBottom: 32 }}>
            Devis gratuit, réponse sous 24h. Aucun engagement avant validation.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 32px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none", boxShadow: `0 8px 32px ${T}40` }}>
              Devis gratuit →
            </Link>
            <a href={PHONE_HREF} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 24px", borderRadius: 30, border: `1.5px solid ${T}40`, color: TEAL_TEXT, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
              <Icon name="phone" size={17} color={TEAL_TEXT} /> Appeler directement
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import { PHONE, PHONE_HREF, WHATSAPP } from "../../lib/data";

const T = "#0DA9A4";
const P = "#D4197A";
const NAVY = "#0D1B2A";
const NAVY2 = "#12304A";
const GOLD = "#C9A24B";
const TEXT = "#1A2D3D";
const MUTED = "#64748B";

// ── Services conciergerie (à la carte) ──
const SERVICES_CONCIERGE = [
  { icon: "🧹", title: "Ménage entre séjours", desc: "Remise en état complète du bien après chaque départ : sols, sanitaires, cuisine, poussières, aération.", color: T },
  { icon: "🛏️", title: "Blanchisserie & linge hôtelier", desc: "Fourniture, lavage et mise en place du linge de lit et de toilette, pliage soigné façon hôtel.", color: P },
  { icon: "🔑", title: "Accueil & remise des clés", desc: "Check-in / check-out des voyageurs, remise des clés, présentation du logement et des consignes.", color: "#0EA5A0" },
  { icon: "📋", title: "États des lieux", desc: "Inventaire photographique à l'entrée et à la sortie, signalement immédiat de tout dégât.", color: "#F59E0B" },
  { icon: "🌿", title: "Entretien extérieur", desc: "Jardin, terrasse, piscine, abords : votre bien reste impeccable à chaque arrivée.", color: "#16A34A" },
  { icon: "🔧", title: "Maintenance & petits travaux", desc: "Coordination des interventions (plomberie, électricité, électroménager) et petits dépannages.", color: "#6366F1" },
  { icon: "📅", title: "Gestion des annonces", desc: "Multi-plateformes (Airbnb, Booking, Abritel), calendrier synchronisé et messagerie voyageurs.", color: "#0284C7" },
  { icon: "💬", title: "Relation voyageurs", desc: "Réponses rapides, gestion des avis et des demandes pendant le séjour, disponibilité 7j/7.", color: P },
];

// ── Formules clés en main ──
const FORMULES = [
  {
    key: "essentiel", label: "Essentiel", tag: "À la rotation", price: "dès 55€", unit: "/ rotation",
    desc: "Vous gérez les réservations, on prépare le bien entre chaque voyageur.",
    features: ["Ménage complet entre séjours", "Mise en place du linge", "Produits & consommables fournis", "Contrôle qualité photo"],
    highlight: false,
  },
  {
    key: "serenite", label: "Sérénité", tag: "Gestion opérationnelle", price: "20%", unit: "du CA locatif",
    desc: "On s'occupe de tout l'opérationnel, vous gardez la main sur vos annonces.",
    features: ["Tout Essentiel inclus", "Accueil & remise des clés", "États des lieux entrée / sortie", "Maintenance coordonnée", "Astreinte voyageurs 7j/7"],
    highlight: true,
  },
  {
    key: "full", label: "Full Management", tag: "Clés en main total", price: "25%", unit: "du CA locatif",
    desc: "Vous n'avez plus rien à faire : on optimise et on maximise vos revenus.",
    features: ["Tout Sérénité inclus", "Gestion multi-plateformes", "Tarification dynamique", "Optimisation des annonces & photos", "Reporting mensuel des revenus"],
    highlight: false,
  },
];

// ── Forfaits ménage par surface ──
const FORFAITS_MENAGE = [
  { type: "Studio / T1", surface: "jusqu'à 30 m²", prix: "55€" },
  { type: "T2", surface: "30 à 50 m²", prix: "75€" },
  { type: "T3", surface: "50 à 75 m²", prix: "95€" },
  { type: "T4 / Villa", surface: "75 m² et +", prix: "dès 130€" },
];

// ── À la carte (compléments) ──
const A_LA_CARTE = [
  { label: "Blanchisserie (parure complète draps + serviettes)", prix: "18€ / parure" },
  { label: "Accueil voyageur & remise des clés", prix: "35€ / arrivée" },
  { label: "État des lieux entrée ou sortie", prix: "45€" },
  { label: "Entretien jardin / extérieur", prix: "40€ / h" },
  { label: "Entretien piscine (forfait mensuel)", prix: "dès 120€ / mois" },
];

// ── Étapes accompagnement lancement ──
const LANCEMENT = [
  { n: "1", icon: "🔍", title: "Audit du bien", desc: "Visite, estimation du potentiel locatif et des travaux éventuels." },
  { n: "2", icon: "📸", title: "Mise en valeur", desc: "Home-staging léger, photos professionnelles, rédaction des annonces." },
  { n: "3", icon: "🚀", title: "Mise en ligne", desc: "Création et paramétrage des annonces sur les plateformes, tarification." },
  { n: "4", icon: "📈", title: "Pilotage", desc: "Suivi des performances, ajustement des prix, optimisation continue." },
];

export default function ConciergeriePage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      <style>{`
        @keyframes floatOrb { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        .cg-wrap { overflow-x: hidden; }
        .cg-hero-grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 48px; align-items: center; }
        .cg-services-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
        .cg-formules-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; align-items: stretch; }
        .cg-forfaits-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .cg-lancement-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .cg-two { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start; }
        @media (max-width: 900px) {
          .cg-hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .cg-services-grid { grid-template-columns: 1fr 1fr !important; }
          .cg-formules-grid { grid-template-columns: 1fr !important; }
          .cg-forfaits-grid { grid-template-columns: 1fr 1fr !important; }
          .cg-lancement-grid { grid-template-columns: 1fr 1fr !important; }
          .cg-two { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
        @media (max-width: 560px) {
          .cg-services-grid { grid-template-columns: 1fr !important; }
          .cg-forfaits-grid { grid-template-columns: 1fr 1fr !important; }
          .cg-lancement-grid { grid-template-columns: 1fr !important; }
          .cg-hero { padding: 48px 16px 40px !important; }
          .cg-section { padding: 48px 16px !important; }
        }
      `}</style>

      <div className="cg-wrap">
        {/* ── Hero ── */}
        <section className="cg-hero" style={{ background: `linear-gradient(160deg, ${NAVY} 0%, ${NAVY2} 100%)`, padding: "80px 24px 72px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -80, right: "6%", width: 380, height: 380, borderRadius: "50%", background: `radial-gradient(circle, ${T}30, transparent 70%)`, filter: "blur(60px)", animation: "floatOrb 16s ease-in-out infinite", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -100, left: "2%", width: 340, height: 340, borderRadius: "50%", background: `radial-gradient(circle, ${GOLD}22, transparent 70%)`, filter: "blur(60px)", animation: "floatOrb 20s ease-in-out infinite", pointerEvents: "none" }} />

          <div className="cg-hero-grid" style={{ maxWidth: 1140, margin: "0 auto", position: "relative" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", border: `1px solid ${GOLD}55`, borderRadius: 30, padding: "6px 16px", marginBottom: 22 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: GOLD, textTransform: "uppercase", letterSpacing: 1.4 }}>Conciergerie locative · Martinique</span>
              </div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(30px, 5.5vw, 58px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 20 }}>
                Votre bien locatif géré{" "}
                <span style={{ color: GOLD }}>de A à Z.</span><br />Vous encaissez.
              </h1>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,0.82)", lineHeight: 1.75, maxWidth: 520, marginBottom: 32 }}>
                Ménage, blanchisserie, accueil des voyageurs, entretien, gestion des annonces : J'MTD prend en charge toute la logistique de votre location saisonnière ou meublé de tourisme. Vous profitez des revenus, sans la charge mentale.
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 30px", borderRadius: 30, background: `linear-gradient(135deg, ${GOLD}, #E0BC6A)`, color: NAVY, fontWeight: 800, fontSize: 15, textDecoration: "none", boxShadow: `0 10px 34px ${GOLD}44` }}>
                  Estimer mes revenus →
                </Link>
                <a href={PHONE_HREF} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 26px", borderRadius: 30, background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.25)", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
                  📞 {PHONE}
                </a>
              </div>
              <div style={{ display: "flex", gap: 22, marginTop: 34, flexWrap: "wrap" }}>
                {[["A→Z", "Gestion complète"], ["7j/7", "Astreinte voyageurs"], ["100%", "Local & réactif"]].map(([n, l]) => (
                  <div key={l}>
                    <div style={{ fontSize: 24, fontWeight: 900, color: GOLD }}>{n}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carte flottante */}
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 24, padding: "28px 26px", backdropFilter: "blur(12px)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: GOLD, textTransform: "uppercase", letterSpacing: 1, marginBottom: 18 }}>Ce qu'on gère pour vous</div>
              {[
                ["🧹", "Ménage & remise en état entre chaque séjour"],
                ["🛏️", "Linge hôtelier fourni, lavé, mis en place"],
                ["🔑", "Accueil des voyageurs & remise des clés"],
                ["🌿", "Entretien extérieur, jardin & piscine"],
                ["📅", "Annonces, calendrier & optimisation des prix"],
              ].map(([ic, txt]) => (
                <div key={txt} style={{ display: "flex", alignItems: "center", gap: 13, padding: "11px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <span style={{ fontSize: 20, width: 26, textAlign: "center", flexShrink: 0 }}>{ic}</span>
                  <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.9)", lineHeight: 1.4 }}>{txt}</span>
                </div>
              ))}
              <div style={{ marginTop: 18, fontSize: 11.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
                Prestation professionnelle pour propriétaires-loueurs — charges déductibles de vos revenus locatifs.
              </div>
            </div>
          </div>
        </section>

        {/* ── Services à la carte ── */}
        <section className="cg-section" style={{ background: "#fff", padding: "76px 24px" }}>
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: TEXT, marginBottom: 12 }}>
                Une conciergerie complète
              </h2>
              <p style={{ fontSize: 15, color: MUTED, maxWidth: 560, margin: "0 auto" }}>
                Chaque prestation disponible seule ou intégrée à une formule clés en main.
              </p>
            </div>
            <div className="cg-services-grid">
              {SERVICES_CONCIERGE.map(s => (
                <div key={s.title} style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(13,169,164,0.12)", borderTop: `3px solid ${s.color}`, padding: "24px 20px", boxShadow: "0 4px 20px rgba(13,169,164,0.06)" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 13, background: `${s.color}14`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 14 }}>{s.icon}</div>
                  <h3 style={{ fontSize: 15.5, fontWeight: 800, color: TEXT, margin: "0 0 8px" }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Formules clés en main ── */}
        <section className="cg-section" style={{ background: `linear-gradient(180deg, #F8FAFB, #fff)`, padding: "76px 24px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 46 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${GOLD}18`, border: `1px solid ${GOLD}55`, borderRadius: 30, padding: "6px 16px", marginBottom: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#9A7B2E", textTransform: "uppercase", letterSpacing: 1.2 }}>3 niveaux d'accompagnement</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: TEXT, marginBottom: 12 }}>
                Choisissez votre formule
              </h2>
              <p style={{ fontSize: 15, color: MUTED, maxWidth: 540, margin: "0 auto" }}>
                Du simple ménage entre séjours à la gestion totale de votre bien.
              </p>
            </div>

            <div className="cg-formules-grid">
              {FORMULES.map(f => (
                <div key={f.key} style={{
                  background: f.highlight ? NAVY : "#fff", borderRadius: 22, padding: "30px 26px", position: "relative",
                  border: f.highlight ? `2px solid ${GOLD}` : "1px solid rgba(13,169,164,0.14)",
                  boxShadow: f.highlight ? `0 16px 50px ${NAVY}33` : "0 4px 22px rgba(13,169,164,0.07)",
                  display: "flex", flexDirection: "column", gap: 16,
                }}>
                  {f.highlight && (
                    <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg, ${GOLD}, #E0BC6A)`, color: NAVY, fontSize: 10.5, fontWeight: 800, padding: "4px 16px", borderRadius: 20, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: 0.8 }}>
                      ⭐ Le plus populaire
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: f.highlight ? "#fff" : TEXT }}>{f.label}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: f.highlight ? GOLD : T, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 3 }}>{f.tag}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: 36, fontWeight: 900, color: f.highlight ? GOLD : NAVY, lineHeight: 1 }}>{f.price}</span>
                    <span style={{ fontSize: 13, color: f.highlight ? "rgba(255,255,255,0.6)" : MUTED, fontWeight: 600 }}>{f.unit}</span>
                  </div>
                  <p style={{ fontSize: 13, color: f.highlight ? "rgba(255,255,255,0.75)" : MUTED, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
                    {f.features.map(feat => (
                      <li key={feat} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13, color: f.highlight ? "rgba(255,255,255,0.9)" : TEXT }}>
                        <span style={{ color: f.highlight ? GOLD : T, fontWeight: 900, flexShrink: 0 }}>✓</span> {feat}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" style={{
                    display: "block", textAlign: "center", padding: "13px", borderRadius: 30, marginTop: "auto",
                    background: f.highlight ? `linear-gradient(135deg, ${GOLD}, #E0BC6A)` : `${T}12`,
                    border: f.highlight ? "none" : `1px solid ${T}30`,
                    color: f.highlight ? NAVY : T, fontWeight: 800, fontSize: 14, textDecoration: "none",
                  }}>
                    Demander un devis →
                  </Link>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12.5, color: "#94A3B8", textAlign: "center", marginTop: 24 }}>
              Le % s'applique au chiffre d'affaires locatif encaissé. Sans abonnement fixe : nous sommes rémunérés quand votre bien rapporte.
            </p>
          </div>
        </section>

        {/* ── Forfaits ménage + à la carte ── */}
        <section className="cg-section" style={{ background: "#fff", padding: "76px 24px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div className="cg-two">
              {/* Forfaits ménage par surface */}
              <div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, color: TEXT, marginBottom: 8 }}>
                  Forfaits ménage par rotation
                </h2>
                <p style={{ fontSize: 14, color: MUTED, marginBottom: 24, lineHeight: 1.6 }}>
                  Prix par passage, produits et consommables inclus. Le linge se règle en complément.
                </p>
                <div className="cg-forfaits-grid">
                  {FORFAITS_MENAGE.map(fo => (
                    <div key={fo.type} style={{ background: `${T}07`, border: `1px solid ${T}20`, borderRadius: 16, padding: "20px 16px", textAlign: "center" }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: TEXT, marginBottom: 4 }}>{fo.type}</div>
                      <div style={{ fontSize: 11.5, color: MUTED, marginBottom: 12 }}>{fo.surface}</div>
                      <div style={{ fontSize: 24, fontWeight: 900, color: T }}>{fo.prix}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* À la carte */}
              <div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, color: TEXT, marginBottom: 8 }}>
                  Prestations à la carte
                </h2>
                <p style={{ fontSize: 14, color: MUTED, marginBottom: 24, lineHeight: 1.6 }}>
                  À ajouter à un forfait ou à commander ponctuellement.
                </p>
                <div style={{ background: "#fff", border: "1px solid rgba(13,169,164,0.14)", borderRadius: 18, overflow: "hidden" }}>
                  {A_LA_CARTE.map((item, i) => (
                    <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, padding: "15px 18px", borderBottom: i < A_LA_CARTE.length - 1 ? "1px solid rgba(13,169,164,0.08)" : "none" }}>
                      <span style={{ fontSize: 13.5, color: TEXT, lineHeight: 1.4 }}>{item.label}</span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: P, whiteSpace: "nowrap" }}>{item.prix}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Accompagnement lancement business locatif ── */}
        <section className="cg-section" style={{ background: `linear-gradient(160deg, ${NAVY}, ${NAVY2})`, padding: "76px 24px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, left: "8%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${GOLD}1e, transparent 70%)`, filter: "blur(50px)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
            <div style={{ textAlign: "center", marginBottom: 46 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", border: `1px solid ${GOLD}55`, borderRadius: 30, padding: "6px 16px", marginBottom: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: GOLD, textTransform: "uppercase", letterSpacing: 1.2 }}>Vous débutez ?</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: "#fff", marginBottom: 12 }}>
                On lance votre business locatif
              </h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", maxWidth: 600, margin: "0 auto" }}>
                Vous avez un bien mais ne savez pas par où commencer ? On vous accompagne du diagnostic à la première réservation.
              </p>
            </div>
            <div className="cg-lancement-grid">
              {LANCEMENT.map(s => (
                <div key={s.n} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18, padding: "24px 20px", textAlign: "center" }}>
                  <div style={{ width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg, ${GOLD}, #E0BC6A)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: NAVY, fontWeight: 900, fontSize: 18 }}>{s.n}</div>
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 6 }}>{s.title}</div>
                  <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 36 }}>
              <div style={{ display: "inline-block", background: "rgba(255,255,255,0.06)", border: `1px solid ${GOLD}40`, borderRadius: 16, padding: "16px 26px" }}>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.85)" }}>Audit + plan de mise en location : </span>
                <span style={{ fontSize: 16, fontWeight: 800, color: GOLD }}>dès 350€</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}> — déduit de votre 1er mois de gestion</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="cg-section" style={{ background: "#fff", padding: "72px 24px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, color: TEXT, textAlign: "center", marginBottom: 32 }}>
              Questions fréquentes
            </h2>
            {[
              { q: "La conciergerie ouvre-t-elle droit au crédit d'impôt ?", a: "Non. La gestion d'un bien mis en location est une activité professionnelle : elle ne relève pas du crédit d'impôt Services à la Personne (réservé à l'entretien de votre résidence principale). En revanche, nos honoraires sont des charges déductibles de vos revenus locatifs." },
              { q: "Le linge est-il fourni ?", a: "Oui, nous pouvons fournir un linge hôtelier de qualité (draps, serviettes), le laver et le mettre en place à chaque rotation. C'est en option dans la formule Essentiel et inclus dans les formules Sérénité et Full Management." },
              { q: "Intervenez-vous partout en Martinique ?", a: "Nous couvrons le Centre et le Sud en priorité (Rivière-Salée, Diamant, Sainte-Luce, Trois-Îlets…). Pour les autres zones, contactez-nous : nous étudions chaque demande selon la distance et le volume." },
              { q: "Comment êtes-vous rémunérés sur les formules au pourcentage ?", a: "Le pourcentage s'applique au chiffre d'affaires locatif réellement encaissé. Pas de réservation, pas de commission : nos intérêts sont alignés avec les vôtres — plus votre bien performe, mieux nous travaillons ensemble." },
            ].map((item, i) => (
              <div key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ borderBottom: "1px solid rgba(13,169,164,0.1)", cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", gap: 16 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>{item.q}</span>
                  <span style={{ color: T, fontSize: 20, flexShrink: 0, transition: "transform 0.2s", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                </div>
                {openFaq === i && <div style={{ padding: "0 0 18px", fontSize: 14, color: MUTED, lineHeight: 1.8 }}>{item.a}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA final ── */}
        <section style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY2})`, padding: "72px 24px" }}>
          <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 700, color: "#fff", marginBottom: 16 }}>
              Votre bien mérite mieux que votre temps libre.
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", lineHeight: 1.8, marginBottom: 34 }}>
              Parlons de votre projet locatif. Estimation et devis gratuits, sans engagement.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 34px", borderRadius: 30, background: `linear-gradient(135deg, ${GOLD}, #E0BC6A)`, color: NAVY, fontWeight: 800, fontSize: 16, textDecoration: "none", boxShadow: `0 10px 34px ${GOLD}44` }}>
                Estimer mes revenus →
              </Link>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 28px", borderRadius: 30, background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.25)", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
                💬 WhatsApp
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

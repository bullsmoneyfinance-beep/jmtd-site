"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Reveal from "../../components/Reveal";
import PinnedFeatureList from "../../components/PinnedFeatureList";
import Icon, { IconTile } from "../../components/Icon";
import { PHONE, PHONE_HREF, WHATSAPP, TEAL_TEXT } from "../../lib/data";
import useParallax from "../../lib/useParallax";


const T = "#0DA9A4";
const P = "#D4197A";
const NAVY = "#0D1B2A";
const NAVY2 = "#12304A";
const GOLD = "#C9A24B";
const GOLD2 = "#E0BC6A";
const TEXT = "#1A2D3D";
const MUTED = "#64748B";

const IMG = (id, w = 800, h = 600) => `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

// ── Opportunité marché ──
const MARCHE = [
  { n: "+1 M", l: "de touristes par an en Martinique", ic: "plane" },
  { n: "×3", l: "de meublés de tourisme en 5 ans", ic: "trending" },
  { n: "70 %+", l: "de taux d'occupation en haute saison", ic: "annonces" },
  { n: "24/7", l: "de demande voyageurs à gérer", ic: "moon" },
];

// ── Services conciergerie ──
const SERVICES_CONCIERGE = [
  { icon: "menage", title: "Ménage entre séjours", desc: "Remise en état hôtelière après chaque départ : sols, sanitaires, cuisine, poussières, aération.", color: T },
  { icon: "linge", title: "Blanchisserie & linge hôtelier", desc: "Fourniture, lavage et mise en place du linge de lit et de toilette, pliage soigné façon hôtel.", color: P },
  { icon: "cle", title: "Accueil & remise des clés", desc: "Check-in / check-out des voyageurs, remise des clés, présentation du logement et des consignes.", color: "#0EA5A0" },
  { icon: "etatdeslieux", title: "États des lieux", desc: "Inventaire photographique à l'entrée et à la sortie, signalement immédiat de tout dégât.", color: "#F59E0B" },
  { icon: "exterieur", title: "Entretien extérieur & piscine", desc: "Jardin, terrasse, piscine, abords : votre bien reste impeccable à chaque arrivée.", color: "#16A34A" },
  { icon: "maintenance", title: "Maintenance & petits travaux", desc: "Coordination des interventions (plomberie, électricité, électroménager) et petits dépannages.", color: "#6366F1" },
  { icon: "annonces", title: "Gestion des annonces", desc: "Multi-plateformes (Airbnb, Booking, Abritel), calendrier synchronisé et messagerie voyageurs.", color: "#0284C7" },
  { icon: "chat", title: "Relation voyageurs 7j/7", desc: "Réponses rapides, gestion des avis et des demandes pendant le séjour, disponibilité continue.", color: P },
];

// ── Rotation opérationnelle ──
const ROTATION = [
  { n: "1", ic: "cle", t: "Départ voyageur", d: "Check-out et récupération des clés, premier contrôle du logement." },
  { n: "2", ic: "menage", t: "Ménage & linge", d: "Nettoyage complet, linge hôtelier frais, réassort des consommables." },
  { n: "3", ic: "search", t: "Contrôle qualité", d: "Inspection photo, signalement d'incident, mise en scène du logement." },
  { n: "4", ic: "sparkles", t: "Prêt à accueillir", d: "Logement irréprochable, accueil du prochain voyageur assuré." },
];

// ── Formules ──
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

const FORFAITS_MENAGE = [
  { type: "Studio / T1", surface: "jusqu'à 30 m²", prix: "55€" },
  { type: "T2", surface: "30 à 50 m²", prix: "75€" },
  { type: "T3", surface: "50 à 75 m²", prix: "95€" },
  { type: "T4 / Villa", surface: "75 m² et +", prix: "dès 130€" },
];

const A_LA_CARTE = [
  { label: "Blanchisserie (parure complète draps + serviettes)", prix: "18€ / parure" },
  { label: "Accueil voyageur & remise des clés", prix: "35€ / arrivée" },
  { label: "État des lieux entrée ou sortie", prix: "45€" },
  { label: "Entretien jardin / extérieur", prix: "40€ / h" },
  { label: "Entretien piscine (forfait mensuel)", prix: "dès 120€ / mois" },
];

const BIENS = [
  { img: "photo-1512917774080-9991f1c4c750", label: "Villas avec piscine", sub: "Le Diamant · Trois-Îlets" },
  { img: "photo-1502672260266-1c1ef2d93688", label: "Appartements vue mer", sub: "Sainte-Luce · Le Marin" },
  { img: "photo-1560448204-e02f11c3d0e2", label: "Studios & T2 citadins", sub: "Fort-de-France · Lamentin" },
  { img: "photo-1613490493576-7fde63acd811", label: "Bungalows & lodges", sub: "Rivière-Salée · Saint-Esprit" },
];

const TEMOIGNAGES = [
  { txt: "Je vis en métropole et je loue ma villa au Diamant. J'MTD gère tout : je n'ai jamais eu un seul retour négatif de voyageur, et mon taux d'occupation a grimpé.", nom: "Philippe R.", loc: "Propriétaire · Le Diamant" },
  { txt: "Le ménage est irréprochable et le linge digne d'un hôtel. Mes notes Airbnb sont passées à 4,9. Un vrai partenaire local de confiance.", nom: "Sandra M.", loc: "Propriétaire · Sainte-Luce" },
  { txt: "Ils ont lancé ma location de A à Z : photos, annonce, tarifs. Première réservation en une semaine. Je recommande à 100%.", nom: "Karl D.", loc: "Propriétaire · Trois-Îlets" },
];

// ── Simulateur de revenus ──
function SimulateurRevenus() {
  const [prixNuit, setPrixNuit] = useState(130);
  const [nuits, setNuits] = useState(16);
  const caMois = prixNuit * nuits;
  const commission = Math.round(caMois * 0.2);
  const net = caMois - commission;
  const netAn = net * 12;

  const slider = { width: "100%", accentColor: GOLD, cursor: "pointer" };
  const lab = { fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 10 };

  return (
    <div style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${GOLD}44`, borderRadius: 24, padding: "34px 30px", backdropFilter: "blur(10px)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 26 }}>
        <Icon name="trending" size={24} color={GOLD} strokeWidth={2} />
        <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: 0 }}>Estimez vos revenus locatifs</h3>
      </div>
      <div className="cg-simu-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26, marginBottom: 30 }}>
        <div>
          <label style={lab}>Prix par nuit</label>
          <input type="range" min="50" max="400" step="5" value={prixNuit} onChange={e => setPrixNuit(+e.target.value)} style={slider} />
          <div style={{ textAlign: "center", fontSize: 24, fontWeight: 900, color: GOLD, marginTop: 8 }}>{prixNuit}€</div>
        </div>
        <div>
          <label style={lab}>Nuits réservées / mois</label>
          <input type="range" min="0" max="30" value={nuits} onChange={e => setNuits(+e.target.value)} style={slider} />
          <div style={{ textAlign: "center", fontSize: 24, fontWeight: 900, color: GOLD, marginTop: 8 }}>{nuits} nuits</div>
        </div>
      </div>
      <div className="cg-simu-res" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        <ResCard label="CA brut / mois" value={`${caMois.toLocaleString("fr-FR")}€`} color="#fff" />
        <ResCard label="Notre commission (20%)" value={`−${commission.toLocaleString("fr-FR")}€`} color={GOLD} />
        <ResCard label="Votre net / mois" value={`${net.toLocaleString("fr-FR")}€`} color="#5EEAD4" big />
      </div>
      <div style={{ textAlign: "center", marginTop: 18, fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
        Soit <strong style={{ color: GOLD, fontSize: 18 }}>{netAn.toLocaleString("fr-FR")}€</strong> nets estimés sur l'année — sans lever le petit doigt.
      </div>
      <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.45)", textAlign: "center", marginTop: 14 }}>
        Estimation indicative sur la base de la formule Sérénité (20%). Hors charges plateformes et fiscalité.
      </p>
    </div>
  );
}

function ResCard({ label, value, color, big }) {
  return (
    <div style={{ textAlign: "center", padding: "16px 10px", background: "rgba(255,255,255,0.06)", borderRadius: 16, border: big ? `1px solid ${GOLD}55` : "1px solid rgba(255,255,255,0.1)" }}>
      <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.6)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: big ? 26 : 21, fontWeight: 900, color }}>{value}</div>
    </div>
  );
}

export default function ConciergeriePage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [reduced, setReduced] = useState(false);
  useParallax();

  // ── Focus rack : la carte la plus proche du centre du viewport devient nette,
  //    les autres se floutent/se désaturent/se réduisent en continu (piloté par --proximity).
  //    Un seul écouteur rAF. Aucune transition CSS sur ces propriétés (voir style bloc). ──
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    if (mq.matches) return;
    const cards = Array.from(document.querySelectorAll(".cg-focus"));
    if (!cards.length) return;
    let raf = null;
    const update = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const center = vh * 0.5;
      cards.forEach(el => {
        const r = el.getBoundingClientRect();
        const elCenter = r.top + r.height / 2;
        const vert = Math.max(0, 1 - Math.abs(elCenter - center) / (vh * 0.6));
        const dxNorm = Math.min(1, Math.abs((r.left + r.width / 2) - vw / 2) / (vw / 2));
        const horiz = 1 - dxNorm * 0.35;
        el.style.setProperty("--proximity", (vert * horiz).toFixed(3));
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

  return (
    <>
      <style>{`
        @keyframes floatOrb { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes cgFade { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        .cg-wrap { overflow-x: hidden; }
        .cg-reveal { animation: cgFade 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .cg-hero-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 48px; align-items: center; }
        .cg-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
        .cg-services-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
        .cg-rotation { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
        .cg-formules-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; align-items: stretch; }
        .cg-forfaits-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .cg-lancement-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .cg-two { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start; }
        .cg-biens { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .cg-temoins { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .cg-marche-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 48px; align-items: center; }
        .cg-simu-wrap { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 44px; align-items: center; }
        @media (max-width: 960px) {
          .cg-hero-grid, .cg-marche-grid, .cg-simu-wrap { grid-template-columns: 1fr !important; gap: 32px !important; }
          .cg-services-grid, .cg-rotation, .cg-lancement-grid, .cg-biens { grid-template-columns: 1fr 1fr !important; }
          .cg-formules-grid, .cg-temoins { grid-template-columns: 1fr !important; }
          .cg-forfaits-grid { grid-template-columns: 1fr 1fr !important; }
          .cg-two { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
        @media (max-width: 560px) {
          .cg-services-grid, .cg-rotation, .cg-lancement-grid, .cg-biens, .cg-stats { grid-template-columns: 1fr !important; }
          .cg-simu-grid, .cg-simu-res { grid-template-columns: 1fr !important; }
          .cg-hero { padding: 44px 16px 40px !important; }
          .cg-section { padding: 48px 16px !important; }
        }

        /* Halos ambiants or/navy, motif zones-orb repris de la page d accueil */
        @keyframes cgDrift { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-16px,20px)} }
        .cg-orb { position:absolute; border-radius:50%; filter:blur(58px); pointer-events:none; z-index:0; animation:cgDrift 18s ease-in-out infinite; }
        .cg-orb-a { width:340px; height:340px; top:-90px; left:-70px; background:radial-gradient(circle, ${GOLD}26, transparent 70%); }
        .cg-orb-b { width:280px; height:280px; bottom:-80px; right:5%; background:radial-gradient(circle, ${NAVY2}1a, transparent 70%); animation-duration:14s; animation-delay:-5s; }

        /* Focus rack: --proximity est mis a jour a chaque frame de scroll (JS).
           AUCUNE transition ici, sinon la valeur poursuit une cible mouvante. */
        .cg-focus { will-change: transform, opacity, filter; }

        @media (prefers-reduced-motion: reduce) {
          .cg-orb { animation: none !important; }
        }
      `}</style>

      <div className="cg-wrap">
        {/* ── Hero ── */}
        <section className="cg-hero" style={{ background: `linear-gradient(155deg, ${NAVY} 0%, ${NAVY2} 100%)`, padding: "78px 24px 72px", position: "relative", overflow: "hidden" }}>
          {/* Calque photo tropical (parallax profond — mer turquoise, fondu dans le navy) */}
          <div aria-hidden data-parallax="0.14" className="parallax" style={{ position: "absolute", top: "-20%", left: 0, right: 0, height: "140%", zIndex: 0 }}>
            <img src={IMG("photo-1505142468610-359e7d316be0", 1600, 900)} alt="" width={1600} height={900} loading="eager"
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.14 }} />
          </div>
          <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, background: `linear-gradient(155deg, ${NAVY}e6 0%, ${NAVY2}e0 100%)` }} />
          <div style={{ position: "absolute", top: -80, right: "4%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${T}30, transparent 70%)`, filter: "blur(60px)", animation: "floatOrb 16s ease-in-out infinite", pointerEvents: "none", zIndex: 1 }} />
          <div style={{ position: "absolute", bottom: -100, left: "0%", width: 360, height: 360, borderRadius: "50%", background: `radial-gradient(circle, ${GOLD}26, transparent 70%)`, filter: "blur(60px)", animation: "floatOrb 20s ease-in-out infinite", pointerEvents: "none" }} />

          <div className="cg-hero-grid cg-reveal" style={{ maxWidth: 1160, margin: "0 auto", position: "relative", zIndex: 2 }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", border: `1px solid ${GOLD}55`, borderRadius: 30, padding: "6px 16px", marginBottom: 22 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: GOLD }} />
                <span style={{ fontSize: 12, fontWeight: 800, color: GOLD, textTransform: "uppercase", letterSpacing: 1.4 }}>Conciergerie locative · Martinique</span>
              </div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(32px, 5.5vw, 60px)", fontWeight: 700, color: "#fff", lineHeight: 1.08, marginBottom: 20 }}>
                Votre bien locatif géré{" "}
                <span style={{ color: GOLD }}>de A à Z.</span><br />Vous encaissez.
              </h1>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,0.82)", lineHeight: 1.75, maxWidth: 520, marginBottom: 32 }}>
                Ménage hôtelier, blanchisserie, accueil des voyageurs, entretien, gestion des annonces : J'MTD prend en charge toute la logistique de votre location saisonnière. Vous profitez des revenus, sans la charge mentale.
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Link href="#simulateur" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 30px", borderRadius: 30, background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`, color: NAVY, fontWeight: 800, fontSize: 15, textDecoration: "none", boxShadow: `0 10px 34px ${GOLD}44` }}>
                  Estimer mes revenus →
                </Link>
                <a href={PHONE_HREF} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 26px", borderRadius: 30, background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.25)", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
                  <Icon name="phone" size={17} color="#fff" /> {PHONE}
                </a>
              </div>
              <div style={{ display: "flex", gap: 22, marginTop: 34, flexWrap: "wrap" }}>
                {[["A→Z", "Gestion complète"], ["7j/7", "Astreinte voyageurs"], ["4,9★", "Note voyageurs visée"]].map(([n, l]) => (
                  <div key={l}>
                    <div style={{ fontSize: 24, fontWeight: 900, color: GOLD }}>{n}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image hero */}
            <div style={{ position: "relative" }}>
              <div className="img-zoom-wrap lift" style={{ borderRadius: 24, boxShadow: "0 30px 80px rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.12)" }}>
                <img src={IMG("photo-1512917774080-9991f1c4c750", 720, 560)} alt="Villa avec piscine en location en Martinique" width={720} height={560} loading="eager" className="img-zoom"
                  style={{ width: "100%", height: 420, objectFit: "cover", display: "block", borderRadius: 24 }} />
              </div>
              <div style={{ position: "absolute", bottom: -22, left: -18, background: "#fff", borderRadius: 16, padding: "14px 18px", boxShadow: "0 16px 40px rgba(0,0,0,0.25)", display: "flex", alignItems: "center", gap: 12 }}>
                <IconTile name="wallet" size={44} icon={22} from={GOLD} to={GOLD2} radius={12} color={NAVY} />
                <div>
                  <div style={{ fontSize: 12, color: MUTED, fontWeight: 600 }}>Revenus optimisés</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: NAVY }}>+ de réservations, 0 tracas</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Opportunité marché Martinique ── */}
        <section className="cg-section" style={{ background: "#fff", padding: "76px 24px" }}>
          <Reveal scaleIn className="cg-marche-grid" style={{ maxWidth: 1140, margin: "0 auto" }}>
            <div className="img-zoom-wrap lift" style={{ borderRadius: 24, boxShadow: "0 20px 60px rgba(13,169,164,0.14)" }}>
              <img src={IMG("photo-1507525428034-b723cf961d3e", 700, 620)} alt="Plage de Martinique, destination touristique" width={700} height={620} loading="lazy" className="img-zoom"
                style={{ width: "100%", height: 440, objectFit: "cover", display: "block", borderRadius: 24 }} />
            </div>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${T}10`, border: `1px solid ${T}28`, borderRadius: 30, padding: "6px 16px", marginBottom: 18 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: TEAL_TEXT, textTransform: "uppercase", letterSpacing: 1.2 }}>Un marché en plein essor</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: TEXT, marginBottom: 16, lineHeight: 1.15 }}>
                La Martinique, terre de<br />location courte durée
              </h2>
              <p style={{ fontSize: 15.5, color: MUTED, lineHeight: 1.8, marginBottom: 28 }}>
                Le tourisme explose et la demande de meublés de qualité dépasse l'offre. Mais gérer une location à distance — ou en plus d'un emploi — épuise. La conciergerie professionnelle est la clé pour <strong style={{ color: TEXT }}>rentabiliser son bien sans y laisser son temps ni sa sérénité</strong>.
              </p>
              <div className="cg-stats">
                {MARCHE.map(m => (
                  <div key={m.l} style={{ background: "#F8FAFB", border: "1px solid rgba(13,169,164,0.12)", borderRadius: 16, padding: "18px 16px", textAlign: "center" }}>
                    <Icon name={m.ic} size={24} color={TEAL_TEXT} style={{ margin: "0 auto 8px" }} />
                    <div style={{ fontSize: 22, fontWeight: 900, color: T }}>{m.n}</div>
                    <div style={{ fontSize: 11.5, color: MUTED, lineHeight: 1.4, marginTop: 4 }}>{m.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── Services à la carte ── */}
        <section className="cg-section" style={{ background: `linear-gradient(180deg, #F8FAFB, #fff)`, padding: "76px 24px", position: "relative", overflow: "hidden" }}>
          <div aria-hidden className="cg-orb cg-orb-a" />
          <div aria-hidden className="cg-orb cg-orb-b" />
          <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: TEXT, marginBottom: 12 }}>
                Une conciergerie complète
              </h2>
              <p style={{ fontSize: 15, color: MUTED, maxWidth: 560, margin: "0 auto" }}>
                Le même soin et le même professionnalisme que nos prestations à domicile — au service de votre rentabilité.
              </p>
            </div>
            <div className="cg-services-grid">
              {SERVICES_CONCIERGE.map((s, i) => (
                <Reveal key={s.title} scaleIn delay={(i % 4) * 70} className="lift"
                  style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(13,169,164,0.12)", borderTop: `3px solid ${s.color}`, padding: "24px 20px", boxShadow: "0 4px 20px rgba(13,169,164,0.06)" }}>
                  <IconTile name={s.icon} size={52} icon={25} from={s.color} to={s.color} radius={14} style={{ marginBottom: 14 }} />
                  <h3 style={{ fontSize: 15.5, fontWeight: 800, color: TEXT, margin: "0 0 8px" }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Rotation opérationnelle — moment signature épinglé (identité navy/or) ── */}
        <section className="cg-section" style={{ background: "#fff", padding: "88px 24px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <PinnedFeatureList
              eyebrow="Rotation opérationnelle"
              title={<>Entre chaque voyageur,<br />une rotation millimétrée</>}
              intro="Un logement toujours prêt, propre et accueillant — sans que vous ayez à y penser. Chaque étape est net et sous contrôle."
              items={ROTATION.map((r, i) => ({
                icon: r.ic,
                title: r.t,
                text: r.d,
                color: i % 2 === 0 ? GOLD : NAVY2,
                to: i % 2 === 0 ? GOLD2 : "#1C4468",
              }))}
            />
          </div>
        </section>

        {/* ── Simulateur de revenus ── */}
        <section id="simulateur" className="cg-section" style={{ background: `linear-gradient(160deg, ${NAVY}, ${NAVY2})`, padding: "78px 24px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "20%", right: "-4%", width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${GOLD}1c, transparent 70%)`, filter: "blur(55px)", pointerEvents: "none" }} />
          <div className="cg-simu-wrap" style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
            <Reveal>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", border: `1px solid ${GOLD}55`, borderRadius: 30, padding: "6px 16px", marginBottom: 18 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: GOLD, textTransform: "uppercase", letterSpacing: 1.2 }}>Combien pouvez-vous gagner ?</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: "#fff", marginBottom: 16, lineHeight: 1.15 }}>
                Votre bien peut rapporter<br />plus que vous ne l'imaginez
              </h2>
              <p style={{ fontSize: 15.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.8 }}>
                Ajustez le curseur selon votre bien et découvrez vos revenus nets estimés. Notre rémunération est indexée sur vos résultats : <strong style={{ color: GOLD }}>on ne gagne que si vous gagnez</strong>.
              </p>
            </Reveal>
            <Reveal scaleIn delay={140}><SimulateurRevenus /></Reveal>
          </div>
        </section>

        {/* ── Formules ── */}
        <section className="cg-section" style={{ background: "#fff", padding: "76px 24px" }}>
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

            <Reveal scaleIn className="cg-formules-grid">
              {FORMULES.map(f => (
                <div key={f.key} className={f.highlight ? undefined : "lift"} style={{
                  background: f.highlight ? NAVY : "#fff", borderRadius: 22, padding: "30px 26px", position: "relative",
                  border: f.highlight ? `2px solid ${GOLD}` : "1px solid rgba(13,169,164,0.14)",
                  boxShadow: f.highlight ? `0 16px 50px ${NAVY}33` : "0 4px 22px rgba(13,169,164,0.07)",
                  display: "flex", flexDirection: "column", gap: 16,
                  transform: f.highlight ? "scale(1.03)" : "none",
                }}>
                  {f.highlight && (
                    <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`, color: NAVY, fontSize: 10.5, fontWeight: 800, padding: "4px 16px", borderRadius: 20, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: 0.8, display: "inline-flex", alignItems: "center", gap: 5 }}>
                      <Icon name="star" size={12} color={NAVY} strokeWidth={2.5} /> Le plus populaire
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
                        <Icon name="check" size={16} color={f.highlight ? GOLD : T} strokeWidth={2.6} style={{ marginTop: 2 }} /> {feat}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" style={{
                    display: "block", textAlign: "center", padding: "13px", borderRadius: 30, marginTop: "auto",
                    background: f.highlight ? `linear-gradient(135deg, ${GOLD}, ${GOLD2})` : `${T}12`,
                    border: f.highlight ? "none" : `1px solid ${T}30`,
                    color: f.highlight ? NAVY : T, fontWeight: 800, fontSize: 14, textDecoration: "none",
                  }}>
                    Demander un devis →
                  </Link>
                </div>
              ))}
            </Reveal>
            <p style={{ fontSize: 12.5, color: "#64748B", textAlign: "center", marginTop: 24 }}>
              Le % s'applique au chiffre d'affaires locatif encaissé. Sans abonnement fixe : nous sommes rémunérés quand votre bien rapporte.
            </p>
          </div>
        </section>

        {/* ── Types de biens (galerie) ── */}
        <section className="cg-section" style={{ background: "#F8FAFB", padding: "72px 24px", position: "relative", overflow: "hidden" }}>
          <div aria-hidden className="cg-orb cg-orb-a" />
          <div aria-hidden className="cg-orb cg-orb-b" />
          <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ textAlign: "center", marginBottom: 44 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(24px, 3.2vw, 38px)", fontWeight: 700, color: TEXT, marginBottom: 12 }}>
                Vos biens, dans le Centre et le Sud de la Martinique
              </h2>
              <p style={{ fontSize: 15, color: MUTED }}>Villa, appartement, studio ou bungalow — on s'adapte à votre patrimoine.</p>
            </div>
            <div className="cg-biens">
              {BIENS.map((b, i) => (
                <Reveal key={b.label} scaleIn delay={(i % 4) * 80}>
                  <div className="img-zoom-wrap cg-focus" style={{
                    position: "relative", borderRadius: 18, boxShadow: "0 8px 28px rgba(13,27,42,0.12)", cursor: "default",
                    transform: reduced ? undefined : "scale(calc(0.94 + var(--proximity, 1) * 0.06))",
                    filter: reduced ? undefined : "blur(calc((1 - var(--proximity, 1)) * 2.4px)) saturate(calc(0.72 + var(--proximity, 1) * 0.28))",
                    opacity: reduced ? undefined : "calc(0.62 + var(--proximity, 1) * 0.38)",
                  }}>
                    <Image src={IMG(b.img, 500, 420)} alt={b.label} width={500} height={420} loading="lazy" className="img-zoom"
                      sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 260px"
                      style={{ width: "100%", height: 240, objectFit: "cover", display: "block", borderRadius: 18 }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,27,42,0.85) 0%, transparent 55%)", pointerEvents: "none" }} />
                    <div style={{ position: "absolute", bottom: 16, left: 16, right: 16, pointerEvents: "none" }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>{b.label}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>{b.sub}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Forfaits ménage + à la carte ── */}
        <section className="cg-section" style={{ background: "#fff", padding: "72px 24px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div className="cg-two">
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

        {/* ── Témoignages propriétaires ── */}
        <section className="cg-section" style={{ background: "#F8FAFB", padding: "72px 24px" }}>
          <div style={{ maxWidth: 1120, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 44 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(24px, 3.2vw, 38px)", fontWeight: 700, color: TEXT, marginBottom: 12 }}>
                Ils nous confient leur bien
              </h2>
              <p style={{ fontSize: 15, color: MUTED }}>Des propriétaires sereins, des voyageurs conquis.</p>
            </div>
            <div className="cg-temoins">
              {TEMOIGNAGES.map((t, i) => (
                <Reveal key={t.nom} scaleIn delay={i * 90} className="lift" style={{ background: "#fff", borderRadius: 20, padding: "28px 26px", border: "1px solid rgba(13,169,164,0.1)", boxShadow: "0 6px 26px rgba(13,169,164,0.07)", position: "relative" }}>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: 60, color: `${GOLD}44`, lineHeight: 0.6, height: 26 }}>“</div>
                  <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>{"★★★★★".split("").map((s, j) => <span key={j} style={{ color: GOLD, fontSize: 15 }}>{s}</span>)}</div>
                  <p style={{ fontSize: 14.5, color: "#374151", lineHeight: 1.8, marginBottom: 18 }}>{t.txt}</p>
                  <div style={{ fontSize: 14, fontWeight: 800, color: TEXT }}>{t.nom}</div>
                  <div style={{ fontSize: 12.5, color: MUTED }}>{t.loc}</div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Accompagnement lancement ── */}
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
                Un bien mais aucune idée de par où commencer ? On vous accompagne du diagnostic à la première réservation.
              </p>
            </div>
            <div className="cg-lancement-grid">
              {[
                { n: "1", icon: "search", title: "Audit du bien", desc: "Visite, estimation du potentiel locatif et des travaux éventuels." },
                { n: "2", icon: "camera", title: "Mise en valeur", desc: "Home-staging léger, photos professionnelles, rédaction des annonces." },
                { n: "3", icon: "rocket", title: "Mise en ligne", desc: "Création et paramétrage des annonces, tarification optimisée." },
                { n: "4", icon: "trending", title: "Pilotage", desc: "Suivi des performances, ajustement des prix, optimisation continue." },
              ].map((s, i) => (
                <Reveal key={s.n} scaleIn delay={i * 80} className="lift" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18, padding: "24px 20px", textAlign: "center" }}>
                  <div style={{ width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: NAVY, fontWeight: 900, fontSize: 18 }}>{s.n}</div>
                  <Icon name={s.icon} size={26} color={GOLD} style={{ margin: "0 auto 8px" }} />
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 6 }}>{s.title}</div>
                  <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{s.desc}</div>
                </Reveal>
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
              { q: "Je vis en métropole, est-ce un problème ?", a: "Au contraire, c'est là que la conciergerie prend tout son sens. Nous sommes vos yeux et vos mains sur place : vous pilotez à distance, nous gérons le concret. Reporting régulier à l'appui." },
            ].map((item, i) => (
              <div key={i} style={{ borderBottom: "1px solid rgba(13,169,164,0.1)" }}>
                <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i} aria-controls={`cg-faq-${i}`}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "18px 0", gap: 16, background: "none", border: "none", cursor: "pointer", textAlign: "left", font: "inherit" }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>{item.q}</span>
                  <span aria-hidden style={{ color: TEAL_TEXT, fontSize: 20, flexShrink: 0, transition: "transform 0.2s", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                </button>
                {openFaq === i && <div id={`cg-faq-${i}`} style={{ padding: "0 0 18px", fontSize: 14, color: MUTED, lineHeight: 1.8 }}>{item.a}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA final ── */}
        <section style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY2})`, padding: "76px 24px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "10%", right: "6%", width: 260, height: 260, borderRadius: "50%", background: `radial-gradient(circle, ${GOLD}20, transparent 70%)`, filter: "blur(50px)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(26px, 3.8vw, 44px)", fontWeight: 700, color: "#fff", marginBottom: 16 }}>
              Votre bien mérite mieux que votre temps libre.
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.78)", lineHeight: 1.8, marginBottom: 34 }}>
              Parlons de votre projet locatif. Estimation et devis gratuits, sans engagement.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 34px", borderRadius: 30, background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`, color: NAVY, fontWeight: 800, fontSize: 16, textDecoration: "none", boxShadow: `0 10px 34px ${GOLD}44` }}>
                Être rappelé →
              </Link>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 28px", borderRadius: 30, background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.25)", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
                <Icon name="chat" size={18} color="#fff" /> WhatsApp
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

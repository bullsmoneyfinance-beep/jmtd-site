"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { YOUTUBE, PHONE_HREF, WHATSAPP } from "../../lib/data";

const T = "#0DA9A4";
const P = "#D4197A";
const TEXT  = "#1A2D3D";
const MUTED = "#64748B";

/* ── Reveal scroll ── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }),
      { threshold: 0.08 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ── Catégories ── */
const CATS = [
  { id: "all",          icon: "✨", label: "Tout voir"         },
  { id: "menage",       icon: "🧹", label: "Ménage"            },
  { id: "rangement",    icon: "📦", label: "Rangement"         },
  { id: "produits",     icon: "🧴", label: "Produits & Recettes" },
  { id: "comparatifs",  icon: "⚖️", label: "Comparatifs"       },
  { id: "temps",        icon: "⏱️", label: "Gain de temps"     },
];

/* ── Articles conseils ── */
const ARTICLES = [
  {
    id: 1, cat: "menage", icon: "🧹",
    tag: "Ménage", color: T,
    title: "Les 5 erreurs que tout le monde fait en faisant le ménage",
    desc: "Commencer par les sols avant les surfaces, oublier les interrupteurs, utiliser trop de produit… On vous explique comment éviter ces pièges pour un résultat impeccable en moins de temps.",
    duration: "3 min",
    tips: [
      "Toujours commencer par le haut (plafond, étagères) et finir par les sols",
      "Nettoyer les interrupteurs et poignées de porte — zones les plus touchées",
      "Moins de produit = meilleur résultat (réduit les résidus sur les surfaces)",
      "Laisser agir le produit 2 à 3 minutes avant d'essuyer",
      "Utiliser des chiffons microfibre plutôt que du papier essuie-tout",
    ],
  },
  {
    id: 2, cat: "rangement", icon: "📦",
    tag: "Rangement", color: P,
    title: "La méthode KonMari expliquée simplement",
    desc: "Marie Kondo a révolutionné l'art du rangement. Découvrez comment appliquer sa méthode chez vous, pièce par pièce, pour ne garder que ce qui vous apporte de la joie.",
    duration: "5 min",
    tips: [
      "Trier par catégorie, pas par pièce (ex : tous les vêtements ensemble)",
      "Se poser la question : 'Est-ce que cet objet me procure de la joie ?'",
      "Ranger verticalement les vêtements pliés pour tout voir d'un coup",
      "Commencer par les vêtements, finir par les souvenirs (le plus difficile)",
      "Garder chaque objet à une place fixe — chaque chose a sa maison",
    ],
  },
  {
    id: 3, cat: "produits", icon: "🍋",
    tag: "Produits naturels", color: "#10B981",
    title: "Bicarbonate + vinaigre blanc : le duo miracle pour votre maison",
    desc: "Ces deux ingrédients du placard remplacent des dizaines de produits chimiques coûteux. On vous dévoile toutes les astuces et les dosages exacts pour chaque surface.",
    duration: "4 min",
    tips: [
      "Bicarbonate seul : dégraisse, désodorise, nettoie l'évier et les casseroles",
      "Vinaigre blanc : détartre robinets, douche, machine à laver (bac assouplissant)",
      "Ne pas mélanger les deux ensemble — ils s'annulent (CO₂ neutre)",
      "Citron + gros sel : nettoie les planches à découper en bois",
      "Bicarbonate dans le bac réfrigérateur : absorbe les mauvaises odeurs",
    ],
  },
  {
    id: 4, cat: "temps", icon: "⏱️",
    tag: "Gain de temps", color: "#F59E0B",
    title: "Le ménage express : faites le tour de votre maison en 30 minutes",
    desc: "Une routine en 7 étapes chronométrées pour avoir un intérieur propre et présentable rapidement. Idéal pour les visites impromptues ou les semaines chargées.",
    duration: "3 min",
    tips: [
      "5 min : ramasser et ranger ce qui traîne dans toutes les pièces",
      "5 min : nettoyer les surfaces visibles (tables, plan de travail, évier)",
      "5 min : nettoyer les toilettes et lavabo",
      "5 min : passer l'aspirateur dans les pièces principales",
      "5 min : essuyer les miroirs et vitres en façade + vider poubelles",
      "5 min : passer la serpillière cuisine et salle de bain",
    ],
  },
  {
    id: 5, cat: "comparatifs", icon: "⚖️",
    tag: "Comparatif", color: "#8B5CF6",
    title: "Aspirateur balai vs aspirateur robot : lequel choisir en Martinique ?",
    desc: "Humidité, poils d'animaux, sol en carrelage ou parquet… On passe en revue les critères spécifiques à nos intérieurs antillais pour vous aider à choisir le bon appareil.",
    duration: "6 min",
    tips: [
      "Robot : idéal pour l'entretien quotidien sans effort (programme automatique)",
      "Balai : indispensable pour les coins, les bords et le nettoyage en profondeur",
      "En Martinique : l'humidité abîme les capteurs des robots bas de gamme — misez sur une marque reconnue",
      "Poils d'animaux : préférez un balai avec brosse anti-poils intégrée",
      "Solution idéale : un robot pour le quotidien + un balai pour le hebdomadaire",
    ],
  },
  {
    id: 6, cat: "rangement", icon: "🚪",
    tag: "Rangement", color: P,
    title: "Organiser ses placards de cuisine : les secrets des pros",
    desc: "Zones de travail, rangement vertical, étiquetage, boîtes hermétiques… Adoptez les techniques des cuisines professionnelles pour ne plus rien chercher.",
    duration: "4 min",
    tips: [
      "Créer 3 zones : préparation (plan de travail), cuisson (près de la gazinière), vaisselle (près de l'évier)",
      "Ranger les épices verticalement avec étiquettes lisibles sur le dessus",
      "Boîtes hermétiques uniformes : gain de place énorme dans les placards",
      "Tiroir à fond de tiroir : poser le couvercle à côté de la boîte (pas empilé)",
      "Ce que vous utilisez le plus → hauteur des yeux ou des mains",
    ],
  },
  {
    id: 7, cat: "produits", icon: "🧴",
    tag: "Produits", color: "#10B981",
    title: "Les 6 produits ménagers indispensables (et les 10 inutiles)",
    desc: "Le marketing nous pousse à acheter des dizaines de produits spécialisés. En réalité, 6 produits suffisent à nettoyer toute votre maison. On fait le tri ensemble.",
    duration: "5 min",
    tips: [
      "✅ Les 6 essentiels : liquide vaisselle, bicarbonate, vinaigre blanc, savon de Marseille, alcool ménager, eau de Javel diluée",
      "❌ Inutile : produit spécial salle de bain, spray vitres, nettoyant WC (le vinaigre fait tout)",
      "❌ Inutile : lingettes désinfectantes individuelles (coûteuses et polluantes)",
      "Le liquide vaisselle dilué remplace 90% des nettoyants multi-surfaces",
      "Alcool ménager à 70° : désinfecte, nettoie les vitres, enlève les traces",
    ],
  },
  {
    id: 8, cat: "menage", icon: "🪟",
    tag: "Ménage", color: T,
    title: "Vitres sans traces : la technique que les professionnels utilisent",
    desc: "Eau démagnétisée, microfibres, mouvement en Z, bon timing selon la chaleur… La méthode complète pour des vitres parfaitement transparentes, même sous le soleil antillais.",
    duration: "3 min",
    tips: [
      "Ne jamais nettoyer en plein soleil (sèche trop vite et laisse des traces)",
      "Mouvement en S ou en Z de haut en bas — jamais de cercles",
      "Deux chiffons : un humide pour nettoyer, un sec pour polir",
      "Eau + une goutte de liquide vaisselle : solution parfaite et économique",
      "Journaux froissés : alternative efficace aux chiffons pour un fini brillant",
    ],
  },
  {
    id: 9, cat: "temps", icon: "📅",
    tag: "Organisation", color: "#F59E0B",
    title: "Créez un planning ménager hebdomadaire qui fonctionne vraiment",
    desc: "Finissez avec le ménage du samedi en bloc ! Répartissez les tâches sur la semaine selon une logique intelligente et gagnez vos week-ends.",
    duration: "4 min",
    tips: [
      "Lundi : cuisine (surfaces, évier, sol) — 15 min",
      "Mardi : salle de bain + WC — 15 min",
      "Mercredi : dépoussiérer salon + chambre — 15 min",
      "Jeudi : aspiration de toute la maison — 20 min",
      "Vendredi : sols + linge — 20 min + machine",
      "Week-end : libre ou grand ménage mensuel si nécessaire",
    ],
  },
  {
    id: 10, cat: "comparatifs", icon: "🧽",
    tag: "Comparatif", color: "#8B5CF6",
    title: "Serpillière classique, microfibre ou vapeur : le comparatif honnête",
    desc: "Test, efficacité, coût, entretien… On compare les 3 méthodes de lavage des sols pour vous dire laquelle vaut vraiment l'investissement selon votre type de sol.",
    duration: "5 min",
    tips: [
      "Serpillière classique : efficace mais difficile à essorer + sèche lentement (moisissures en zone humide)",
      "Microfibre plate : légère, sèche vite, lave à 60°C, idéale pour carrelage Martinique",
      "Vapeur : désinfecte sans produit chimique, parfaite pour allergiques — coût initial plus élevé",
      "Notre recommandation Martinique : microfibre plate pour quotidien + vapeur mensuel",
      "Éviter : le seau unique (repose les saletés) — utiliser deux seaux eau propre / eau sale",
    ],
  },
  {
    id: 11, cat: "rangement", icon: "🛏️",
    tag: "Rangement", color: P,
    title: "Désencombrer sa chambre en une heure : le guide étape par étape",
    desc: "Garde-robe, tables de nuit, sous le lit… Une checklist actionnable pour vider, trier et réorganiser votre chambre dans le bon ordre, sans vous épuiser.",
    duration: "6 min",
    tips: [
      "Commencer par vider complètement le dessus des meubles (tables de nuit, commode)",
      "Sous le lit : tout sortir, trier par catégorie, ne remettre que ce qui est utile",
      "Garde-robe : méthode des 3 piles (garder / donner / jeter) en 30 secondes par vêtement",
      "Règle : si vous ne l'avez pas porté depuis 12 mois en Martinique, c'est non",
      "Finir par ranger l'électronique (câbles, chargeurs) dans une boîte dédiée",
    ],
  },
  {
    id: 12, cat: "produits", icon: "🌿",
    tag: "Produits naturels", color: "#10B981",
    title: "Huiles essentielles et ménage : lesquelles utiliser et comment ?",
    desc: "Tea tree, lavande, eucalyptus, citron… Ces huiles naturelles ont des propriétés antibactériennes puissantes. On vous explique comment les intégrer à votre routine.",
    duration: "4 min",
    tips: [
      "Tea tree (arbre à thé) : antibactérien puissant — 10 gouttes dans l'eau de lavage des sols",
      "Lavande : désodorisante et antiseptique — quelques gouttes sur le filtre de l'aspirateur",
      "Citron : dégraissant naturel + odeur fraîche — dans le produit vaisselle",
      "Eucalyptus : anti-acariens — 5 gouttes dans la lessive pour literie",
      "⚠️ Toujours diluer les HE — ne jamais utiliser pures sur les surfaces",
    ],
  },
];

/* ── Card Conseil ── */
function ConseilCard({ article, onClick }) {
  return (
    <div
      onClick={() => onClick(article)}
      style={{
        background: "#fff", borderRadius: 20,
        border: "1px solid rgba(13,169,164,0.1)",
        boxShadow: "0 4px 24px rgba(13,169,164,0.06)",
        padding: "26px 24px", cursor: "pointer",
        transition: "all 0.3s ease", display: "flex",
        flexDirection: "column", gap: 14,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 12px 48px rgba(13,169,164,0.14)";
        e.currentTarget.style.borderColor = "rgba(13,169,164,0.25)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "0 4px 24px rgba(13,169,164,0.06)";
        e.currentTarget.style.borderColor = "rgba(13,169,164,0.1)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 32 }}>{article.icon}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: article.color, background: article.color + "14", border: `1px solid ${article.color}28`, borderRadius: 20, padding: "4px 12px", textTransform: "uppercase", letterSpacing: 0.8 }}>
          {article.tag}
        </span>
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, lineHeight: 1.4, margin: 0 }}>
        {article.title}
      </h3>
      <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.7, margin: 0, flex: 1 }}>
        {article.desc}
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid rgba(13,169,164,0.08)" }}>
        <span style={{ fontSize: 12, color: "#94A3B8" }}>⏱ {article.duration} de lecture</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: article.color }}>Lire →</span>
      </div>
    </div>
  );
}

/* ── Modal article ── */
function ArticleModal({ article, onClose }) {
  useEffect(() => {
    const esc = e => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <>
      <style>{`
        @keyframes fadeInOverlay { from{opacity:0} to{opacity:1} }
        @keyframes slideUpModal  { from{opacity:0;transform:translateY(32px) scale(0.98)} to{opacity:1;transform:none} }
        .modal-scroll::-webkit-scrollbar { width: 4px; }
        .modal-scroll::-webkit-scrollbar-track { background: transparent; }
        .modal-scroll::-webkit-scrollbar-thumb { background: rgba(13,169,164,0.25); border-radius: 4px; }
        @media (max-width: 640px) {
          .modal-box {
            border-radius: 28px 28px 0 0 !important;
            max-height: 92dvh !important;
            width: 100% !important;
            margin: 0 !important;
          }
          .modal-wrap {
            align-items: flex-end !important;
            padding: 0 !important;
          }
        }
      `}</style>

      {/* Overlay */}
      <div
        className="modal-wrap"
        onClick={e => e.target === e.currentTarget && onClose()}
        style={{
          position: "fixed", inset: 0, zIndex: 999,
          background: "rgba(10,24,32,0.6)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "24px 16px",
          animation: "fadeInOverlay 0.2s ease",
        }}
      >
        {/* Box */}
        <div
          className="modal-box modal-scroll"
          style={{
            background: "#fff",
            borderRadius: 24,
            width: "100%",
            maxWidth: 660,
            maxHeight: "88dvh",
            overflowY: "auto",
            animation: "slideUpModal 0.28s cubic-bezier(0.16,1,0.3,1)",
            position: "relative",
          }}
        >
          {/* ── Header coloré ── */}
          <div style={{
            background: `linear-gradient(135deg, ${article.color}18, ${article.color}08)`,
            borderBottom: `1px solid ${article.color}20`,
            padding: "22px 24px 20px",
            borderRadius: "24px 24px 0 0",
            display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: article.color + "20", border: `2px solid ${article.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
                {article.icon}
              </div>
              <div>
                <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: article.color, background: article.color + "18", border: `1px solid ${article.color}30`, borderRadius: 20, padding: "3px 12px", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>
                  {article.tag}
                </span>
                <div style={{ fontSize: 12, color: "#94A3B8" }}>⏱ {article.duration} de lecture</div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ background: "rgba(0,0,0,0.06)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 18, color: MUTED, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.12)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.06)"}
            >✕</button>
          </div>

          {/* ── Corps ── */}
          <div style={{ padding: "28px 28px 32px" }}>

            {/* Titre */}
            <h2 style={{ fontSize: "clamp(18px, 2.8vw, 24px)", fontWeight: 800, color: TEXT, lineHeight: 1.3, marginBottom: 14 }}>
              {article.title}
            </h2>

            {/* Intro */}
            <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.85, marginBottom: 28, borderLeft: `3px solid ${article.color}`, paddingLeft: 16 }}>
              {article.desc}
            </p>

            {/* Points clés */}
            {article.tips && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: article.color, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff" }}>✓</span>
                  Points clés à retenir
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {article.tips.map((tip, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", background: article.color + "08", borderRadius: 12, border: `1px solid ${article.color}14` }}>
                      <span style={{ width: 22, height: 22, borderRadius: "50%", background: article.color + "22", border: `1.5px solid ${article.color}40`, color: article.color, fontWeight: 800, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        {i + 1}
                      </span>
                      <span style={{ fontSize: 14, color: TEXT, lineHeight: 1.6 }}>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* YouTube CTA */}
            <div style={{ background: "linear-gradient(135deg, #1a0000, #2a0000)", borderRadius: 18, padding: "20px 22px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "#FF0000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, boxShadow: "0 4px 16px rgba(255,0,0,0.4)" }}>▶</div>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontWeight: 700, color: "#fff", fontSize: 15, marginBottom: 3 }}>Retrouvez ce conseil en vidéo</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Plus de détails et démos sur notre chaîne YouTube J&apos;MTD</div>
              </div>
              <a href={YOUTUBE} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 30, background: "#FF0000", color: "#fff", fontWeight: 800, fontSize: 13, textDecoration: "none", boxShadow: "0 4px 14px rgba(255,0,0,0.4)", flexShrink: 0, whiteSpace: "nowrap" }}>
                ▶ Voir la vidéo
              </a>
            </div>

            {/* Contact CTA */}
            <div style={{ padding: "16px 20px", background: `${T}08`, border: `1px solid ${T}20`, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 700, color: TEXT, marginBottom: 3, fontSize: 14 }}>Vous préférez qu&apos;on s&apos;en occupe pour vous ?</div>
                <div style={{ fontSize: 12, color: MUTED }}>J&apos;MTD intervient chez vous en Martinique · 50% crédit d&apos;impôt</div>
              </div>
              <Link href="/contact" onClick={onClose}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none", flexShrink: 0, whiteSpace: "nowrap" }}>
                Devis gratuit →
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function ConseilsPage() {
  useReveal();
  const [activeCat, setActiveCat] = useState("all");
  const [openArticle, setOpenArticle] = useState(null);

  const filtered = activeCat === "all" ? ARTICLES : ARTICLES.filter(a => a.cat === activeCat);

  return (
    <>
      {/* ── Hero ── */}
      <section style={{ background: "#fff", padding: "88px 24px 72px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, right: "5%",  width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${T}12, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: "3%", width: 380, height: 380, borderRadius: "50%", background: `radial-gradient(circle, ${P}0e, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${T}10`, border: `1px solid ${T}28`, borderRadius: 30, padding: "6px 18px", marginBottom: 20 }}>
            <span style={{ fontSize: 14 }}>✨</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 1.5 }}>Conseils & Astuces J&apos;MTD</span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(30px, 5vw, 54px)", fontWeight: 700, color: TEXT, lineHeight: 1.15, marginBottom: 20 }}>
            Tout savoir sur{" "}
            <span style={{ background: `linear-gradient(135deg, ${T}, ${P})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              le ménage & le rangement
            </span>
          </h1>
          <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.8, marginBottom: 40, maxWidth: 580, margin: "0 auto 40px" }}>
            Astuces pro, comparatifs produits, méthodes de rangement, routines gain de temps…{" "}
            Des conseils concrets pour un intérieur impeccable, même sans nous !
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={YOUTUBE} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 28px", borderRadius: 30, background: "#FF0000", color: "#fff", fontWeight: 800, fontSize: 15, textDecoration: "none", boxShadow: "0 8px 28px rgba(255,0,0,0.3)", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(255,0,0,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(255,0,0,0.3)"; }}>
              ▶ Notre chaîne YouTube
            </a>
            <a href="#conseils"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 30, background: `${T}10`, border: `1.5px solid ${T}30`, color: T, fontWeight: 700, fontSize: 15, textDecoration: "none", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = `${T}18`; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${T}10`; }}>
              Lire les articles ↓
            </a>
          </div>
        </div>
      </section>

      {/* ── YouTube Banner ── */}
      <section style={{ background: "#F8FAFB", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal yt-banner-grid" style={{ background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)", borderRadius: 28, overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 300 }}>
            <div style={{ padding: "48px 48px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 20 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, width: "fit-content" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FF0000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>▶</div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#FF6B6B", textTransform: "uppercase", letterSpacing: 1.5 }}>Chaîne YouTube J&apos;MTD</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 700, color: "#F8FAFC", lineHeight: 1.25, margin: 0 }}>
                Des vidéos conseils{" "}
                <span style={{ color: "#FF6B6B" }}>chaque semaine</span>
              </h2>
              <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.8, margin: 0 }}>
                Tutoriels ménage, astuces rangement, comparatifs produits… On partage tout ce que nos professionnelles ont appris en des années d&apos;expérience.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href={YOUTUBE} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 30, background: "#FF0000", color: "#fff", fontWeight: 800, fontSize: 14, textDecoration: "none" }}>
                  ▶ S&apos;abonner gratuitement
                </a>
              </div>
            </div>
            <div className="yt-banner-right" style={{ background: "linear-gradient(135deg, #1a0000 0%, #2d0000 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", minHeight: 240 }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 60% 40%, rgba(255,0,0,0.15), transparent 70%)" }} />
              <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                <div style={{ width: 96, height: 96, borderRadius: "50%", background: "rgba(255,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 0 60px rgba(255,0,0,0.4)", animation: "glowRed 3s ease-in-out infinite" }}>
                  <span style={{ fontSize: 36, marginLeft: 6 }}>▶</span>
                </div>
                <div style={{ fontSize: 13, color: "#94A3B8" }}>Cliquez pour voir nos vidéos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Articles ── */}
      <section id="conseils" style={{ background: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="section-divider" style={{ margin: "0 auto 16px" }} />
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, color: TEXT, marginBottom: 12 }}>
              Nos articles & conseils
            </h2>
            <p style={{ fontSize: 16, color: MUTED, maxWidth: 520, margin: "0 auto" }}>
              Des conseils concrets rédigés par nos professionnelles du ménage et du rangement.
            </p>
          </div>

          {/* Filtres */}
          <div className="reveal" style={{ display: "flex", gap: 10, marginBottom: 40, flexWrap: "wrap", justifyContent: "center" }}>
            {CATS.map(cat => (
              <button key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 30, border: activeCat === cat.id ? `1.5px solid ${T}` : "1.5px solid rgba(13,169,164,0.2)", background: activeCat === cat.id ? `${T}14` : "transparent", color: activeCat === cat.id ? T : MUTED, fontWeight: activeCat === cat.id ? 700 : 500, fontSize: 13, cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap" }}>
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {activeCat === cat.id && cat.id !== "all" && (
                  <span style={{ background: T, color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>
                    {filtered.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Grille */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {filtered.map((article, i) => (
              <div key={article.id} className="reveal" style={{ animationDelay: `${i * 0.06}s` }}>
                <ConseilCard article={article} onClick={setOpenArticle} />
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 24px", color: MUTED }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              <p style={{ fontSize: 16 }}>Aucun article dans cette catégorie pour l&apos;instant.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA YouTube final ── */}
      <section style={{ background: "#F8FAFB", padding: "72px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <div className="reveal">
            <div style={{ fontSize: 56, marginBottom: 20 }}>📺</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 700, color: TEXT, marginBottom: 16 }}>
              Abonnez-vous pour ne rien rater
            </h2>
            <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.8, marginBottom: 36, maxWidth: 520, margin: "0 auto 36px" }}>
              Chaque semaine, une nouvelle vidéo avec des astuces exclusives de nos professionnelles. C&apos;est gratuit, en français, depuis la Martinique.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <a href={YOUTUBE} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 32px", borderRadius: 30, background: "#FF0000", color: "#fff", fontWeight: 800, fontSize: 16, textDecoration: "none", boxShadow: "0 8px 32px rgba(255,0,0,0.3)" }}>
                ▶ Voir la chaîne YouTube
              </a>
              <Link href="/contact"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 28px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none", boxShadow: `0 8px 28px ${T}40` }}>
                Demander un devis →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Modal ── */}
      {openArticle && <ArticleModal article={openArticle} onClose={() => setOpenArticle(null)} />}

      <style>{`
        @keyframes glowRed {
          0%,100% { box-shadow: 0 0 40px rgba(255,0,0,0.35); }
          50%      { box-shadow: 0 0 70px rgba(255,0,0,0.6), 0 0 120px rgba(255,0,0,0.25); }
        }
        @media (max-width: 768px) {
          .yt-banner-grid { grid-template-columns: 1fr !important; }
          .yt-banner-right { min-height: 180px !important; }
        }
      `}</style>
    </>
  );
}

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
    tag: "Ménage",
    title: "Les 5 erreurs que tout le monde fait en faisant le ménage",
    desc: "Commencer par les sols avant les surfaces, oublier les interrupteurs, utiliser trop de produit… On vous explique comment éviter ces pièges pour un résultat impeccable en moins de temps.",
    duration: "3 min",
    color: T,
  },
  {
    id: 2, cat: "rangement", icon: "📦",
    tag: "Rangement",
    title: "La méthode KonMari expliquée simplement",
    desc: "Marie Kondo a révolutionné l'art du rangement. Découvrez comment appliquer sa méthode chez vous, pièce par pièce, pour ne garder que ce qui vous apporte de la joie.",
    duration: "5 min",
    color: P,
  },
  {
    id: 3, cat: "produits", icon: "🍋",
    tag: "Produits naturels",
    title: "Bicarbonate + vinaigre blanc : le duo miracle pour votre maison",
    desc: "Ces deux ingrédients du placard remplacent des dizaines de produits chimiques coûteux. On vous dévoile toutes les astuces et les dosages exacts pour chaque surface.",
    duration: "4 min",
    color: "#10B981",
  },
  {
    id: 4, cat: "temps", icon: "⏱️",
    tag: "Gain de temps",
    title: "Le ménage express : faites le tour de votre maison en 30 minutes",
    desc: "Une routine en 7 étapes chronométrées pour avoir un intérieur propre et présentable rapidement. Idéal pour les visites impromptues ou les semaines chargées.",
    duration: "3 min",
    color: "#F59E0B",
  },
  {
    id: 5, cat: "comparatifs", icon: "⚖️",
    tag: "Comparatif",
    title: "Aspirateur balai vs aspirateur robot : lequel choisir en Martinique ?",
    desc: "Humidité, poils d'animaux, sol en carrelage ou parquet… On passe en revue les critères spécifiques à nos intérieurs antillais pour vous aider à choisir le bon appareil.",
    duration: "6 min",
    color: "#8B5CF6",
  },
  {
    id: 6, cat: "rangement", icon: "🚪",
    tag: "Rangement",
    title: "Organiser ses placards de cuisine : les secrets des pros",
    desc: "Zones de travail, rangement vertical, étiquetage, boîtes hermétiques… Adoptez les techniques des cuisines professionnelles pour ne plus rien chercher.",
    duration: "4 min",
    color: P,
  },
  {
    id: 7, cat: "produits", icon: "🧴",
    tag: "Produits",
    title: "Les 6 produits ménagers indispensables (et les 10 inutiles)",
    desc: "Le marketing nous pousse à acheter des dizaines de produits spécialisés. En réalité, 6 produits suffisent à nettoyer toute votre maison. On fait le tri ensemble.",
    duration: "5 min",
    color: "#10B981",
  },
  {
    id: 8, cat: "menage", icon: "🪟",
    tag: "Ménage",
    title: "Vitres sans traces : la technique que les professionnels utilisent",
    desc: "Eau démagnétisée, microfibres, mouvement en Z, bon timing selon la chaleur… La méthode complète pour des vitres parfaitement transparentes, même sous le soleil antillais.",
    duration: "3 min",
    color: T,
  },
  {
    id: 9, cat: "temps", icon: "📅",
    tag: "Organisation",
    title: "Créez un planning ménager hebdomadaire qui fonctionne vraiment",
    desc: "Finissez avec le ménage du samedi en bloc ! Répartissez les tâches sur la semaine selon une logique intelligente et gagnez vos week-ends.",
    duration: "4 min",
    color: "#F59E0B",
  },
  {
    id: 10, cat: "comparatifs", icon: "🧽",
    tag: "Comparatif",
    title: "Serpillière classique, microfibre ou vapeur : le comparatif honnête",
    desc: "Test, efficacité, coût, entretien… On compare les 3 méthodes de lavage des sols pour vous dire laquelle vaut vraiment l'investissement selon votre type de sol.",
    duration: "5 min",
    color: "#8B5CF6",
  },
  {
    id: 11, cat: "rangement", icon: "🛏️",
    tag: "Rangement",
    title: "Désencombrer sa chambre en une heure : le guide étape par étape",
    desc: "Garde-robe, tables de nuit, sous le lit… Une checklist actionnable pour vider, trier et réorganiser votre chambre dans le bon ordre, sans vous épuiser.",
    duration: "6 min",
    color: P,
  },
  {
    id: 12, cat: "produits", icon: "🌿",
    tag: "Produits naturels",
    title: "Huiles essentielles et ménage : lesquelles utiliser et comment ?",
    desc: "Tea tree, lavande, eucalyptus, citron… Ces huiles naturelles ont des propriétés antibactériennes puissantes. On vous explique comment les intégrer à votre routine.",
    duration: "4 min",
    color: "#10B981",
  },
];

/* ── Card Conseil ── */
function ConseilCard({ article, onClick }) {
  return (
    <div
      onClick={() => onClick(article)}
      style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(13,169,164,0.1)", boxShadow: "0 4px 24px rgba(13,169,164,0.06)", padding: "26px 24px", cursor: "pointer", transition: "all 0.3s ease", display: "flex", flexDirection: "column", gap: 14 }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 12px 48px rgba(13,169,164,0.14)"; e.currentTarget.style.borderColor = "rgba(13,169,164,0.25)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(13,169,164,0.06)"; e.currentTarget.style.borderColor = "rgba(13,169,164,0.1)"; }}
    >
      {/* Icon + tag */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 32 }}>{article.icon}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: article.color, background: article.color + "14", border: `1px solid ${article.color}28`, borderRadius: 20, padding: "4px 12px", textTransform: "uppercase", letterSpacing: 0.8 }}>
          {article.tag}
        </span>
      </div>

      {/* Title */}
      <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, lineHeight: 1.4, margin: 0 }}>
        {article.title}
      </h3>

      {/* Desc */}
      <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.7, margin: 0, flex: 1 }}>
        {article.desc}
      </p>

      {/* Footer */}
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
    return () => { document.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(10,28,28,0.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: "#fff", borderRadius: "28px 28px 0 0", width: "100%", maxWidth: 720, maxHeight: "90dvh", overflowY: "auto", padding: "32px 28px 48px", animation: "slideUpModal 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
        <style>{`@keyframes slideUpModal { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:none} }`}</style>

        {/* Handle + close */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(13,169,164,0.2)", margin: "0 auto" }} />
          <button onClick={onClose} style={{ background: "rgba(13,169,164,0.08)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 16, color: MUTED, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        {/* Tag + icon */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 40 }}>{article.icon}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: article.color, background: article.color + "14", border: `1px solid ${article.color}28`, borderRadius: 20, padding: "5px 14px", textTransform: "uppercase", letterSpacing: 0.8 }}>
            {article.tag}
          </span>
        </div>

        <h2 style={{ fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 800, color: TEXT, lineHeight: 1.3, marginBottom: 16 }}>
          {article.title}
        </h2>

        <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 24 }}>⏱ {article.duration} de lecture</div>

        <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.85, marginBottom: 28 }}>
          {article.desc}
        </p>

        {/* YouTube CTA */}
        <div style={{ background: `linear-gradient(135deg, #FF0000 0%, #CC0000 100%)`, borderRadius: 18, padding: "22px 24px", display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>▶️</div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontWeight: 700, color: "#fff", fontSize: 16, marginBottom: 4 }}>Retrouvez ce conseil en vidéo</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>On détaille tout ça (et bien plus !) sur notre chaîne YouTube J'MTD.</div>
          </div>
          <a href={YOUTUBE} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 30, background: "#fff", color: "#CC0000", fontWeight: 800, fontSize: 14, textDecoration: "none", flexShrink: 0 }}>
            ▶ Voir la vidéo
          </a>
        </div>

        {/* Contact CTA */}
        <div style={{ marginTop: 20, padding: "18px 20px", background: `${T}08`, border: `1px solid ${T}20`, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
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
      <section className="inner-hero" style={{ background: "#fff", padding: "88px 24px 72px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, right: "5%",  width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${T}12, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none", animation: "floatOrb 14s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: -80, left: "3%", width: 380, height: 380, borderRadius: "50%", background: `radial-gradient(circle, ${P}0e, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none", animation: "floatOrbSlow 18s ease-in-out infinite" }} />

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
      <section className="main-section" style={{ background: "#F8FAFB", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal" style={{ background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)", borderRadius: 28, padding: "0", overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 320 }}>

            {/* Left — texte */}
            <div style={{ padding: "48px 48px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 20 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, width: "fit-content" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FF0000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>▶</div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#FF6B6B", textTransform: "uppercase", letterSpacing: 1.5 }}>Chaîne YouTube J&apos;MTD</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, color: "#F8FAFC", lineHeight: 1.25, margin: 0 }}>
                Des vidéos conseils{" "}
                <span style={{ color: "#FF6B6B" }}>chaque semaine</span>
              </h2>
              <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.8, margin: 0 }}>
                Tutoriels ménage, astuces rangement, comparatifs produits, routines maison… On partage tout ce que nos professionnelles ont appris en des années d&apos;expérience.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href={YOUTUBE} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 30, background: "#FF0000", color: "#fff", fontWeight: 800, fontSize: 14, textDecoration: "none", transition: "transform 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                  ▶ S&apos;abonner gratuitement
                </a>
                <a href={YOUTUBE} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 30, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#94A3B8", fontWeight: 600, fontSize: 13, textDecoration: "none" }}>
                  🔔 Activer les notifications
                </a>
              </div>
            </div>

            {/* Right — illustration vidéo */}
            <div style={{ background: "linear-gradient(135deg, #1a0000 0%, #2d0000 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", minHeight: 280 }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 60% 40%, rgba(255,0,0,0.15), transparent 70%)" }} />

              {/* Play button animé */}
              <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                <div style={{ width: 96, height: 96, borderRadius: "50%", background: "rgba(255,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 0 60px rgba(255,0,0,0.4)", animation: "glowRed 3s ease-in-out infinite" }}>
                  <span style={{ fontSize: 36, marginLeft: 6 }}>▶</span>
                </div>
                <div style={{ fontSize: 14, color: "#94A3B8", fontWeight: 500 }}>Cliquez pour voir nos vidéos</div>
                <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                  {["🧹 Ménage", "📦 Rangement", "🧴 Produits", "⏱️ Astuces"].map(t => (
                    <span key={t} style={{ fontSize: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "#64748B", borderRadius: 20, padding: "4px 12px" }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Articles ── */}
      <section id="conseils" className="main-section" style={{ background: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Header section */}
          <div className="reveal" style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="section-divider" style={{ margin: "0 auto 16px" }} />
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, color: TEXT, marginBottom: 12 }}>
              Nos articles & conseils
            </h2>
            <p style={{ fontSize: 16, color: MUTED, maxWidth: 520, margin: "0 auto" }}>
              Des conseils concrets rédigés par nos professionnelles du ménage et du rangement.
            </p>
          </div>

          {/* Filtres catégories */}
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

          {/* Grille articles */}
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
      <section className="main-section" style={{ background: "#F8FAFB", padding: "72px 24px" }}>
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
                style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 32px", borderRadius: 30, background: "#FF0000", color: "#fff", fontWeight: 800, fontSize: 16, textDecoration: "none", boxShadow: "0 8px 32px rgba(255,0,0,0.3)", transition: "transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(255,0,0,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,0,0,0.3)"; }}>
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
          .yt-banner-right { min-height: 200px !important; }
        }
      `}</style>
    </>
  );
}

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Icon, { IconTile } from "../../components/Icon";
import { YOUTUBE, PHONE_HREF, WHATSAPP, TEAL_TEXT } from "../../lib/data";
import { ARTICLES } from "./articlesData";
import useParallax from "../../lib/useParallax";

const T = "#0DA9A4";
const P = "#D4197A";
const OCEAN = "#12B5B0";
const TEXT  = "#1A2D3D";
const MUTED = "#64748B";
const WARM  = "#FFF8F4";

/* ── Imagerie Martinique / tropical-premium (Unsplash) ── */
const IMG = {
  greenery: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1600&h=900&fit=crop&auto=format&q=80", // feuillage vert rétroéclairé
  palm:     "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=900&h=1100&fit=crop&auto=format&q=80",  // frondes de palmier
  sea:      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1600&h=1000&fit=crop&auto=format&q=80", // mer turquoise
};


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
  { id: "all",          icon: "sparkles",  label: "Tout voir"         },
  { id: "menage",       icon: "menage",    label: "Ménage"            },
  { id: "rangement",    icon: "rangement", label: "Rangement"         },
  { id: "produits",     icon: "sparkles",  label: "Produits & Recettes" },
  { id: "comparatifs",  icon: "search",    label: "Comparatifs"       },
  { id: "temps",        icon: "clock",     label: "Gain de temps"     },
];

/* ── Card Conseil ── */
function ConseilCard({ article, onClick }) {
  return (
    <div
      onClick={() => onClick(article)}
      role="button" tabIndex={0}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(article); } }}
      aria-label={`Aperçu de l'article : ${article.title}`}
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
        <IconTile name={article.icon} size={48} icon={24} from={article.color} to={article.color} radius={14} />
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
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "#64748B" }}><Icon name="clock" size={13} color="#64748B" /> {article.duration} de lecture</span>
        <Link
          href={`/conseils/${article.slug}`}
          onClick={e => e.stopPropagation()}
          aria-label={`Lire l'article complet : ${article.title}`}
          style={{ fontSize: 13, fontWeight: 700, color: article.color, textDecoration: "none", whiteSpace: "nowrap" }}
        >
          Lire l&apos;article complet →
        </Link>
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
              <IconTile name={article.icon} size={56} icon={28} from={article.color} to={article.color} radius={16} />
              <div>
                <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: article.color, background: article.color + "18", border: `1px solid ${article.color}30`, borderRadius: 20, padding: "3px 12px", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>
                  {article.tag}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#64748B" }}><Icon name="clock" size={13} color="#64748B" /> {article.duration} de lecture</div>
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
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: article.color, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><Icon name="check" size={13} color="#fff" strokeWidth={3} /></span>
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
  useParallax();
  const [activeCat, setActiveCat] = useState("all");
  const [openArticle, setOpenArticle] = useState(null);

  const filtered = activeCat === "all" ? ARTICLES : ARTICLES.filter(a => a.cat === activeCat);

  return (
    <>
      {/* ── Hero ── */}
      <section style={{ background: `linear-gradient(160deg, ${WARM} 0%, #EAF7F6 100%)`, padding: "96px 24px 76px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Calque feuillage tropical (parallax profond) */}
        <div aria-hidden data-parallax="0.16" className="parallax" style={{ position: "absolute", top: "-24%", left: 0, right: 0, height: "148%", zIndex: 0 }}>
          <img src={IMG.greenery} alt="" width={1600} height={900} loading="eager"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.18 }} />
        </div>
        {/* Frondes de palmier — accent tropical (droite) */}
        <div aria-hidden data-parallax="0.06" className="parallax hero-palm" style={{ position: "absolute", top: "-8%", right: "-6%", width: "clamp(200px, 30vw, 440px)", height: "116%", zIndex: 0, pointerEvents: "none" }}>
          <img src={IMG.palm} alt="" width={900} height={1100} loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.13, mixBlendMode: "multiply", maskImage: "linear-gradient(to left, #000 18%, transparent 90%)", WebkitMaskImage: "linear-gradient(to left, #000 18%, transparent 90%)" }} />
        </div>
        {/* Voile clair pour lisibilité */}
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(180deg, rgba(255,248,244,0.90) 0%, rgba(248,250,247,0.82) 46%, rgba(234,247,246,0.72) 100%)" }} />
        <div style={{ position: "absolute", top: -100, right: "5%",  width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${T}12, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none", zIndex: 1 }} />
        <div style={{ position: "absolute", bottom: -80, left: "3%", width: 380, height: 380, borderRadius: "50%", background: `radial-gradient(circle, ${P}0e, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none", zIndex: 1 }} />

        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: `1.5px solid ${T}28`, borderRadius: 30, padding: "7px 18px", marginBottom: 20, boxShadow: "0 2px 14px rgba(13,169,164,0.12)" }}>
            <Icon name="sparkles" size={15} color={TEAL_TEXT} />
            <span style={{ fontSize: 12, fontWeight: 700, color: TEAL_TEXT, textTransform: "uppercase", letterSpacing: 1.5 }}>Conseils & Astuces J&apos;MTD</span>
          </div>
          <h1 className="display" style={{ fontSize: "clamp(30px, 5vw, 54px)", color: TEXT, lineHeight: 1.15, marginBottom: 20 }}>
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
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 30, background: `${T}10`, border: `1.5px solid ${T}30`, color: TEAL_TEXT, fontWeight: 700, fontSize: 15, textDecoration: "none", transition: "all 0.2s" }}
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
              <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.8, margin: 0 }}>
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
                <div style={{ fontSize: 13, color: "#64748B" }}>Cliquez pour voir nos vidéos</div>
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
                <Icon name={cat.icon} size={15} />
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
              <Icon name="search" size={46} color={MUTED} style={{ margin: "0 auto 12px" }} />
              <p style={{ fontSize: 16 }}>Aucun article dans cette catégorie pour l&apos;instant.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Bande immersive tropicale ── */}
      <section style={{ position: "relative", overflow: "hidden", height: "clamp(240px, 34vw, 380px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div aria-hidden data-parallax="0.14" className="parallax" style={{ position: "absolute", top: "-18%", left: 0, right: 0, height: "136%", zIndex: 0 }}>
          <img src={IMG.sea} alt="" width={1600} height={1000} loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(120deg, rgba(9,58,58,0.74), rgba(13,27,42,0.60))" }} />
        <div className="reveal" style={{ position: "relative", zIndex: 2, maxWidth: 780, padding: "0 28px", textAlign: "center" }}>
          <Icon name="piscine" size={32} color="#fff" style={{ margin: "0 auto 16px" }} />
          <p className="display" style={{ fontSize: "clamp(22px, 3.2vw, 34px)", color: "#fff", lineHeight: 1.3, fontWeight: 600 }}>
            « Un intérieur qui respire,<br />à l&apos;image de la Martinique. »
          </p>
          <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.72)", marginTop: 16, letterSpacing: 0.5 }}>
            Nos astuces, votre sérénité · J&apos;MTD
          </div>
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
          .hero-palm { opacity: 0.5 !important; }
        }
      `}</style>
    </>
  );
}

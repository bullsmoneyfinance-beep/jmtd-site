"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";
import Icon, { IconTile } from "../components/Icon";
import SapOfficiel from "../components/SapOfficiel";
import { PHONE, PHONE_HREF, WHATSAPP, SERVICES, TESTIMONIALS, DECLARATION_SAP, TEAL_TEXT } from "../lib/data";

const WA_SVG = (<svg width="18" height="18" viewBox="0 0 32 32" fill="none" style={{display:"block",flexShrink:0}}><circle cx="16" cy="16" r="16" fill="#25D366"/><path d="M23.5 8.5A10.4 10.4 0 0 0 16 5.5C10.2 5.5 5.5 10.2 5.5 16c0 1.85.48 3.65 1.4 5.25L5.5 26.5l5.4-1.4A10.4 10.4 0 0 0 16 26.5c5.8 0 10.5-4.7 10.5-10.5 0-2.8-1.1-5.43-3-7.5zm-7.5 16.1a8.6 8.6 0 0 1-4.4-1.2l-.3-.2-3.2.84.86-3.1-.2-.33A8.6 8.6 0 1 1 16 24.6zm4.7-6.4c-.26-.13-1.53-.75-1.77-.84-.23-.08-.4-.13-.56.13-.17.26-.64.84-.79 1.01-.14.17-.29.19-.54.06-.26-.13-1.08-.4-2.06-1.27-.76-.68-1.28-1.52-1.43-1.77-.15-.26-.01-.4.11-.52.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.32-.23.26-.87.85-.87 2.07s.89 2.4 1.01 2.57c.13.17 1.75 2.67 4.24 3.75.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.53-.63 1.74-1.23.22-.6.22-1.12.15-1.23-.06-.12-.23-.19-.49-.31z" fill="#fff"/></svg>);

const T = "#0DA9A4";       // teal — FONDS / dégradés / IconTile uniquement
const TT = TEAL_TEXT;      // teal accessible (#0B7C78) — TEXTE / liens / petites icônes sur fond clair
const P = "#D4197A";       // rose/magenta
const OCEAN = "#12B5B0";   // turquoise océan (accent tropical discret)
const TEXT = "#1A2D3D";
const TEXT2 = "#64748B";

/* Tarifs réels par prestation (source /tarifs) — €/h avant crédit d'impôt */
const PRICES = { entretien: 32, repas: 32, courses: 28, assistance: 34, jardinage: 36 };

/* Couleurs chaudes services à la personne */
const WARM = "#FFF8F4";
const WARM_SHADOW = "0 4px 28px rgba(0,0,0,0.06)";

/* ── Imagerie Martinique / tropical-premium (Unsplash) ── */
const IMG = {
  heroBg:   "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&h=1200&fit=crop&auto=format&q=80", // lagon turquoise, lumière claire
  heroCard: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=1100&fit=crop&auto=format&q=80",  // intérieur lumineux & aéré
  greenery: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1600&h=900&fit=crop&auto=format&q=80",  // feuillage vert rétroéclairé
  palmLeaf: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=900&h=1100&fit=crop&auto=format&q=80",  // frondes de palmier, lumière douce (accent)
  seaLight: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1600&h=1000&fit=crop&auto=format&q=80", // mer turquoise vue du ciel (plein cadre)
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

const TICKS = [
  "✦ Déclaré SAP officiel","✦ Recommandé par nos clients","✦ +200 foyers","✦ Méthode Marie Kondo",
  "✦ 50% crédit d'impôt","✦ Toute la Martinique","✦ Réponse en 24h","✦ Devis gratuit",
];

// Tarifs réels par prestation (cohérents avec /tarifs) — pas de "18€" trompeur
const PRIX = { entretien: 32, repas: 32, courses: 28, assistance: 34, jardinage: 36 };

function Calculator() {
  const [h, setH] = useState(8);
  const gross = h * 30;
  const net = Math.ceil(gross * 0.5);
  return (
    <div style={{ background: "#fff", borderRadius: 24, border: `1.5px solid rgba(13,169,164,0.15)`, boxShadow: "0 22px 60px rgba(13,27,42,0.10)", padding: "36px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <IconTile name="credit" size={40} icon={20} from={T} to={P} radius={10} />
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: TT, textTransform: "uppercase", letterSpacing: 1 }}>Simulateur</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>Crédit d&apos;impôt</div>
        </div>
      </div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 14, color: TEXT2 }}>Heures / mois</span>
          <span style={{ fontSize: 22, fontWeight: 800, color: T }}>{h}h</span>
        </div>
        <input type="range" min={1} max={40} value={h} onChange={e => setH(+e.target.value)}
          style={{ width: "100%", accentColor: T, cursor: "pointer", height: 4 }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#CBD5E1", marginTop: 6 }}>
          <span>1h</span><span>40h</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
        <div style={{ background: WARM, borderRadius: 14, padding: "18px 14px", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 6 }}>Coût brut</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: TEXT }}>{gross}€</div>
        </div>
        <div style={{ background: `${T}0d`, border: `1.5px solid ${T}33`, borderRadius: 14, padding: "18px 14px", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: T, fontWeight: 600, marginBottom: 6 }}>Votre coût réel</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: T }}>{net}€</div>
        </div>
      </div>
      <p style={{ fontSize: 12, color: "#94A3B8", textAlign: "center", marginBottom: 20, lineHeight: 1.6 }}>
        L&apos;État rembourse <strong style={{ color: TEXT2 }}>50% de vos dépenses</strong> via votre déclaration d&apos;impôt
      </p>
      <Link href="/contact" className="btn-gradient" style={{ display: "block", textAlign: "center", background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", padding: 15, borderRadius: 30, fontWeight: 700, fontSize: 15, textDecoration: "none", boxShadow: `0 6px 24px ${T}44`, border: "none" }}>
        Obtenir mon devis gratuit →
      </Link>
    </div>
  );
}

function QuickForm() {
  const [form, setForm] = useState({ nom: "", tel: "", service: "", rgpd: false });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const submit = async e => {
    e.preventDefault();
    if (!form.rgpd) { alert("Veuillez accepter la politique de confidentialité."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prenom: "", nom: form.nom, tel: form.tel, email: "", service: form.service, zone: "", message: "Demande rapide (accueil)" }),
      });
      if (!res.ok) throw new Error("api");
      setSent(true);
    } catch {
      // Fallback local si l'API échoue — le lead n'est jamais perdu silencieusement
      try {
        const { load, save } = await import("../lib/storage");
        const existing = await load("jmtd_quotes", []);
        await save("jmtd_quotes", [{ id: `q${Date.now()}`, date: Date.now(), status: "nouveau", name: form.nom, phone: form.tel, email: "", service: form.service, zone: "", message: "Demande rapide (accueil)" }, ...existing]);
        setSent(true);
      } catch {
        setError("Envoi impossible pour le moment. Appelez-nous ou réessayez.");
      }
    }
    setLoading(false);
  };

  if (sent) return (
    <div style={{ textAlign: "center", padding: "56px 24px", background: "#fff", border: `1.5px solid rgba(13,169,164,0.2)`, borderRadius: 26, boxShadow: "0 30px 70px rgba(13,27,42,0.22)" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><Icon name="checkCircle" size={52} color="#16A34A" strokeWidth={1.8} /></div>
      <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 700, color: TEXT, marginBottom: 8 }}>Demande envoyée !</h3>
      <p style={{ color: TEXT2 }}>Nous vous rappelons sous 24h ouvrées.</p>
    </div>
  );

  return (
    <form onSubmit={submit} style={{ background: "#fff", border: `1px solid rgba(13,169,164,0.12)`, borderRadius: 26, padding: "38px 34px", boxShadow: "0 30px 70px rgba(13,27,42,0.22)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 26 }}>
        <IconTile name="mail" size={44} icon={21} from={T} to={P} radius={12} />
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 1.5 }}>Devis gratuit</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: TEXT }}>Parlez-nous de vos besoins</div>
        </div>
      </div>
      <div className="quick-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Nom *</label>
          <input className="form-input" placeholder="Marie Dupont" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} required />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Téléphone *</label>
          <input className="form-input" placeholder="05 96 XX XX XX" type="tel" value={form.tel} onChange={e => setForm(f => ({ ...f, tel: e.target.value }))} required />
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Prestation souhaitée *</label>
        <select className="form-input" value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} required
          style={{ color: form.service ? TEXT : "#94A3B8", background: "#FAFBFC" }}>
          <option value="" style={{ color: "#94A3B8" }}>Choisir une prestation…</option>
          {SERVICES.map(s => <option key={s.id} value={s.id} style={{ color: TEXT }}>{s.title}</option>)}
        </select>
      </div>
      <label style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 24, cursor: "pointer" }}>
        <input type="checkbox" checked={form.rgpd} onChange={e => setForm(f => ({ ...f, rgpd: e.target.checked }))}
          style={{ marginTop: 3, accentColor: T, flexShrink: 0, width: 16, height: 16 }} required />
        <span style={{ fontSize: 12, color: TEXT2, lineHeight: 1.7 }}>
          J&apos;accepte que mes données soient utilisées pour traiter ma demande —{" "}
          <Link href="/politique-confidentialite" style={{ color: T, textDecoration: "underline" }}>politique de confidentialité</Link>.
        </span>
      </label>
      {error && (
        <div role="alert" style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", borderRadius: 12, padding: "10px 14px", fontSize: 13, marginBottom: 14, lineHeight: 1.5 }}>{error}</div>
      )}
      <button type="submit" disabled={loading} className="btn-amber btn-gradient"
        style={{ width: "100%", padding: "16px", borderRadius: 30, fontSize: 16, cursor: loading ? "wait" : "pointer", border: "none" }}>
        {loading ? (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="3"/>
              <path d="M12 2a10 10 0 0 1 10 10" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            Envoi en cours…
          </span>
        ) : "Envoyer ma demande de devis →"}
      </button>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 20px", marginTop: 18 }}>
        {["Rappel sous 24h", "Sans engagement", "100% gratuit"].map(t => (
          <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: TEXT2, fontWeight: 600 }}><Icon name="check" size={14} color={T} strokeWidth={2.5} /> {t}</span>
        ))}
      </div>
    </form>
  );
}

const FAQ_ITEMS = [
  { q: "Êtes-vous déclarés Services à la Personne ?", a: "Oui, J'MTD est officiellement déclaré SAP (N° " + DECLARATION_SAP + "). Cette déclaration vous donne droit au crédit d'impôt de 50% sur toutes nos prestations à domicile." },
  { q: "Comment fonctionne le crédit d'impôt ?", a: "L'État rembourse 50% de vos dépenses SAP via votre déclaration d'impôts. Nous vous fournissons une attestation fiscale annuelle. Applicable même si vous n'êtes pas imposable." },
  { q: "Dans quelles communes intervenez-vous ?", a: "J'MTD intervient partout en Martinique : Rivière-Salée (siège), Le Lamentin, Le Diamant, Saint-Esprit, Fort-de-France, Le Vauclin, Sainte-Anne, Le François et toutes les communes environnantes." },
  { q: "Comment se passe le premier contact ?", a: "Remplissez le formulaire ou appelez-nous. Nous vous rappelons sous 24h pour comprendre vos besoins, puis établissons un devis gratuit et sans engagement." },
  { q: "Le coaching rangement, comment ça marche ?", a: "Inspirée de la méthode Marie Kondo, notre coach commence par un diagnostic gratuit. Ensemble, on définit un plan d'action selon vos envies." },
  { q: "Puis-je choisir mes jours et horaires ?", a: "Absolument. Nos interventions sont planifiées selon vos disponibilités, du lundi au vendredi de 8h à 18h." },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ maxWidth: 780, margin: "0 auto" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} className="faq-item">
          <button className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
            <span>{item.q}</span>
            <span style={{ fontSize: 20, color: T, flexShrink: 0, transform: open === i ? "rotate(45deg)" : "none", transition: "transform 0.3s ease" }}>+</span>
          </button>
          <div className={`faq-answer ${open === i ? "open" : ""}`}>{item.a}</div>
        </div>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────
   PAGE PRINCIPALE
──────────────────────────────────────── */
export default function HomePage() {
  useParallax();

  return (
    <div style={{ background: "#fff", overflowX: "hidden" }}>

      {/* ════════════════════════════════
          HERO — immersif, clair & aéré, touche tropicale
          ════════════════════════════════ */}
      <section className="hero-section" style={{ position: "relative", overflow: "hidden", background: `linear-gradient(160deg, ${WARM} 0%, #EAF7F6 100%)`, paddingBottom: 96, minHeight: "clamp(640px, 92vh, 940px)", display: "flex", alignItems: "center" }}>

        {/* Calque photo tropical (parallax profond — lagon turquoise, atmosphère cinématique) */}
        <div aria-hidden data-parallax="0.18" className="parallax" style={{ position: "absolute", top: "-22%", left: 0, right: 0, height: "144%", zIndex: 0 }}>
          <img src={IMG.heroBg} alt="" width={1600} height={1200} loading="eager"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.26 }} />
        </div>
        {/* Frondes de palmier — second calque de profondeur (parallax plus lent) */}
        <div aria-hidden data-parallax="0.06" className="parallax hero-palm" style={{ position: "absolute", top: "-10%", right: "-6%", width: "clamp(280px, 38vw, 640px)", height: "120%", zIndex: 0, pointerEvents: "none" }}>
          <img src={IMG.palmLeaf} alt="" width={900} height={1100} loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.16, mixBlendMode: "multiply", maskImage: "linear-gradient(to left, #000 30%, transparent 92%)", WebkitMaskImage: "linear-gradient(to left, #000 30%, transparent 92%)" }} />
        </div>
        {/* Voile — dégradé travaillé : dense à gauche (lisibilité du texte), plus aéré à droite */}
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(105deg, rgba(255,248,244,0.96) 0%, rgba(248,250,247,0.90) 38%, rgba(236,247,246,0.72) 66%, rgba(224,244,242,0.52) 100%)" }} />
        {/* Halo lumineux bas — ancre la scène */}
        <div aria-hidden style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "34%", zIndex: 1, background: `linear-gradient(to top, ${WARM} 4%, rgba(255,248,244,0.0) 100%)`, pointerEvents: "none" }} />
        {/* Orbes doux */}
        <div aria-hidden style={{ position: "absolute", top: -100, right: -60, width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, ${T}14 0%, transparent 70%)`, animation: "floatOrb 14s ease-in-out infinite", pointerEvents: "none", zIndex: 1 }} />
        <div aria-hidden style={{ position: "absolute", bottom: -60, left: -40, width: 360, height: 360, borderRadius: "50%", background: `radial-gradient(circle, ${P}0c 0%, transparent 70%)`, animation: "floatOrb 18s ease-in-out infinite reverse", pointerEvents: "none", zIndex: 1 }} />

        <div className="hero-grid" style={{ maxWidth: 1160, margin: "0 auto", padding: "40px 24px 0", width: "100%", display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 64, alignItems: "center", position: "relative", zIndex: 2 }}>

          {/* ── Gauche — proposition de valeur ── */}
          <div>
            <div className="anim-fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: `1.5px solid ${T}30`, borderRadius: 30, padding: "8px 18px", marginBottom: 30, boxShadow: "0 2px 14px rgba(13,169,164,0.12)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: T, display: "inline-block", animation: "softPulse 2.5s infinite" }} />
              <span style={{ fontSize: 13, color: TEAL_TEXT, fontWeight: 700 }}>Déclaré Services à la Personne · N° {DECLARATION_SAP}</span>
            </div>

            <h1 className="anim-fade-up delay-1 display" style={{ fontSize: "clamp(40px, 5.4vw, 72px)", marginBottom: 26, letterSpacing: -1.8 }}>
              Confiez votre quotidien,<br />
              profitez de{" "}
              <span style={{ background: `linear-gradient(120deg, ${T}, ${OCEAN} 45%, ${P})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>votre vie.</span>
            </h1>

            <p className="anim-fade-up delay-2" style={{ fontSize: 18, color: TEXT2, lineHeight: 1.75, marginBottom: 14, maxWidth: 480 }}>
              Ménage, repas, courses, coach rangement. Nos intervenantes <strong style={{ color: TEXT }}>sélectionnées, formées et discrètes</strong> s&apos;occupent de votre maison — vous récupérez du temps pour votre famille et vos loisirs, partout en Martinique.
            </p>
            <p className="anim-fade-up delay-2" style={{ marginBottom: 38 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 15, color: TEAL_TEXT, fontWeight: 700, background: `${T}14`, borderRadius: 20, padding: "5px 14px" }}><Icon name="credit" size={16} color={TEAL_TEXT} /> 50% remboursé par crédit d&apos;impôt SAP</span>
            </p>

            <div className="anim-fade-up delay-3" style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 46 }}>
              <Link href="/contact" className="btn-amber btn-gradient"
                style={{ padding: "17px 34px", borderRadius: 30, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, border: "none", fontWeight: 700 }}>
                Devis gratuit →
              </Link>
              <a href={PHONE_HREF}
                style={{ padding: "17px 28px", borderRadius: 30, border: `2px solid ${T}40`, color: TEXT, fontSize: 15, fontWeight: 700, textDecoration: "none", background: "rgba(255,255,255,0.9)", display: "inline-flex", alignItems: "center", gap: 10, transition: "all 0.2s", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${T}40`; e.currentTarget.style.transform = "none"; }}>
                <Icon name="phone" size={17} color={T} /> {PHONE}
              </a>
            </div>

            <div className="anim-fade-up delay-4" style={{ display: "flex", gap: 34, paddingTop: 30, borderTop: "1px solid rgba(13,169,164,0.14)" }}>
              {[
                { value: 200, suffix: "+", label: "Foyers accompagnés", color: T },
                { value: 5, suffix: "★", label: "Note Google", color: "#F59E0B" },
                { value: 50, suffix: "%", label: "Crédit d'impôt", color: P },
              ].map((s) => (
                <div key={s.label}>
                  <div className="display" style={{ fontSize: 32, fontWeight: 800, color: s.color, lineHeight: 1 }}>
                    <CountUp value={s.value} suffix={s.suffix} duration={1300} />
                  </div>
                  <div style={{ fontSize: 12.5, color: TEXT2, marginTop: 5, lineHeight: 1.4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Droite — photographie + preuves flottantes (profondeur) ── */}
          <div className="hero-visual anim-scale-in delay-2" style={{ position: "relative" }}>
            <div className="img-zoom-wrap" style={{ borderRadius: 30, position: "relative", boxShadow: "0 40px 90px rgba(13,27,42,0.22), 0 8px 24px rgba(13,27,42,0.10)", border: "1px solid rgba(255,255,255,0.6)" }}>
              <Image src={IMG.heroCard} alt="Un intérieur lumineux et impeccable en Martinique" width={560} height={640} priority sizes="(max-width: 900px) 100vw, 560px" className="img-zoom hero-photo"
                style={{ width: "100%", height: 520, objectFit: "cover", display: "block", borderRadius: 30 }} />
              {/* dégradé bas pour ancrer la puce */}
              <div aria-hidden style={{ position: "absolute", inset: 0, borderRadius: 30, background: "linear-gradient(to top, rgba(13,27,42,0.28), transparent 42%)", pointerEvents: "none" }} />

              {/* Puce note (bas-gauche, chevauchante) */}
              <div style={{ position: "absolute", left: 18, bottom: 18, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", borderRadius: 18, padding: "13px 16px", boxShadow: "0 10px 30px rgba(13,27,42,0.18)", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", gap: 1 }}>
                    {"★★★★★".split("").map((s, j) => <span key={j} style={{ color: "#F59E0B", fontSize: 14 }}>{s}</span>)}
                  </div>
                  <div style={{ fontSize: 12, color: TEXT2, marginTop: 2, fontWeight: 600 }}>5/5 · +200 familles</div>
                </div>
              </div>

              {/* Puce SAP (haut-droite) */}
              <div style={{ position: "absolute", top: 18, right: 18, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", borderRadius: 14, padding: "9px 14px", boxShadow: "0 10px 30px rgba(13,27,42,0.16)", display: "inline-flex", alignItems: "center", gap: 7 }}>
                <Icon name="sap" size={17} color={T} />
                <span style={{ fontSize: 12.5, fontWeight: 700, color: TEXT }}>Déclaré SAP</span>
              </div>
            </div>

            {/* Badges confiance */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
              {[
                { icon: "lock", iconColor: T, title: "Personnel vérifié", sub: "Sélection & formation", bg: `${T}0d`, border: `${T}22` },
                { icon: "home", iconColor: P, title: "Toute la Martinique", sub: "Déplacement inclus", bg: `${P}08`, border: `${P}20` },
              ].map(item => (
                <div key={item.title} style={{ background: item.bg, border: `1px solid ${item.border}`, borderRadius: 16, padding: "14px 16px" }}>
                  <div style={{ marginBottom: 8 }}><Icon name={item.icon} size={20} color={item.iconColor} /></div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, lineHeight: 1.3 }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: TEXT2, marginTop: 2 }}>{item.sub}</div>
                </div>
              ))}
            </div>

            {/* WhatsApp */}
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              style={{ marginTop: 12, padding: "15px 20px", borderRadius: 16, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.92)", border: "1.5px solid #25D36630", fontSize: 15, fontWeight: 600, color: "#0d6e5c", transition: "all 0.2s", boxShadow: "0 2px 12px rgba(37,211,102,0.1)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#f0fff4"; e.currentTarget.style.borderColor = "#25D36650"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.92)"; e.currentTarget.style.borderColor = "#25D36630"; }}>
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>{WA_SVG} Écrire sur WhatsApp</span>
              <span style={{ fontSize: 18, color: "#25D366" }}>›</span>
            </a>
          </div>
        </div>
      </section>

      {/* ══ TICKER ══ */}
      <div style={{ background: `linear-gradient(135deg, ${T}, ${P})`, overflow: "hidden", padding: "11px 0" }}>
        <div className="ticker-inner">
          {[...TICKS, ...TICKS].map((t, i) => (
            <span key={i} style={{ whiteSpace: "nowrap", padding: "0 28px", fontSize: 12, fontWeight: 600, color: "#fff", opacity: 0.9 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════
          STATUT OFFICIEL — logo Services à la Personne
          ════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "52px 24px", borderBottom: "1px solid rgba(13,169,164,0.08)" }}>
        <Reveal style={{ maxWidth: 920, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
          <SapOfficiel height={112} variant="logo" />
          <div style={{ maxWidth: 440 }}>
            <div className="eyebrow">Statut officiel</div>
            <h3 className="display" style={{ fontSize: "clamp(21px, 2.5vw, 30px)", marginBottom: 10 }}>
              Organisme déclaré Services à la Personne
            </h3>
            <p style={{ fontSize: 15, color: TEXT2, lineHeight: 1.75 }}>
              Déclaration N° <strong style={{ color: TEXT }}>{DECLARATION_SAP}</strong> auprès de la DEETS Martinique. Toutes nos prestations à domicile ouvrent droit au <strong style={{ color: T }}>crédit d&apos;impôt de 50 %</strong>.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ════════════════════════════════
          POURQUOI J'MTD — moment signature : texte épinglé, cartes qui défilent
          ════════════════════════════════ */}
      <section style={{ background: WARM, padding: "96px 24px" }}>
        <div className="why-pin-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 56, alignItems: "start" }}>
          <Reveal className="why-pin-intro" style={{ position: "sticky", top: 110 }}>
            <div className="eyebrow">Pourquoi nous choisir</div>
            <h2 className="display" style={{ fontSize: "clamp(28px, 3.6vw, 44px)", marginBottom: 16 }}>
              Votre confiance,<br />notre priorité
            </h2>
            <p style={{ fontSize: 16.5, color: TEXT2, maxWidth: 400, lineHeight: 1.8 }}>
              Vous nous invitez chez vous. C&apos;est une responsabilité que nous prenons très au sérieux.
            </p>
          </Reveal>

          <div className="why-pin-cards" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[
              { icon: "lock",   title: "Personnel rigoureusement sélectionné", text: "Chaque intervenante passe par un entretien approfondi, une vérification des références et une formation aux standards J'MTD avant sa première intervention.", color: T, to: OCEAN },
              { icon: "clock",  title: "Vous récupérez votre temps", text: "Ménage, repas, courses… Confiez-nous les tâches qui vous pèsent et retrouvez du temps pour ce qui compte vraiment : votre famille, vos loisirs, vous-même.", color: P, to: "#E0559E" },
              { icon: "credit", title: "50% remboursé par l'État", text: "Notre déclaration SAP vous permet de récupérer la moitié de vos dépenses via le crédit d'impôt. Nous vous remettons une attestation fiscale chaque année.", color: T, to: OCEAN },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 90} scaleIn y={44} className="lift"
                style={{ padding: "38px 32px", background: "#fff", borderRadius: 24, boxShadow: WARM_SHADOW, borderTop: `4px solid ${c.color}` }}>
                <IconTile name={c.icon} size={60} icon={28} from={c.color} to={c.to} radius={18} style={{ marginBottom: 20 }} />
                <h3 style={{ fontSize: 18, fontWeight: 700, color: TEXT, marginBottom: 12, lineHeight: 1.4 }}>{c.title}</h3>
                <p style={{ fontSize: 14.5, color: TEXT2, lineHeight: 1.85 }}>{c.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          NOS SERVICES — cartes visuelles
          ════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "96px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="eyebrow" style={{ justifyContent: "center" }}>Nos prestations</div>
            <h2 className="display" style={{ fontSize: "clamp(30px, 3.8vw, 48px)" }}>
              Tout ce dont vous avez besoin
            </h2>
            <p style={{ fontSize: 15.5, color: TEXT2, maxWidth: 480, margin: "14px auto 0", lineHeight: 1.7 }}>
              Des prestations certifiées SAP — éligibles au crédit d&apos;impôt de 50%.
            </p>
          </Reveal>

          <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {SERVICES.map((s, i) => (
              <Reveal key={s.id} as={Link} href={s.id === "rangement" ? "/coach" : `/services#${s.id}`}
                delay={(i % 3) * 100} className="lift img-zoom-wrap"
                style={{ textDecoration: "none", display: "block", borderRadius: 24, background: "#fff", boxShadow: WARM_SHADOW, border: "1px solid rgba(0,0,0,0.05)", borderTop: `3px solid ${s.special ? P : T}` }}>
                {/* Photo */}
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <Image src={s.img} alt={s.title} width={500} height={210} loading="lazy" className="img-zoom"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                    style={{ width: "100%", height: 214, objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)", borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 700, color: s.special ? P : T, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
                    {s.id === "rangement" ? "Sur devis" : `À partir de ${PRIX[s.id] || 32}€/h`}
                  </div>
                  {s.special && (
                    <div style={{ position: "absolute", top: 14, left: 14, display: "inline-flex", alignItems: "center", gap: 5, background: P, color: "#fff", fontSize: 11, fontWeight: 700, padding: "5px 14px", borderRadius: 20 }}><Icon name="star" size={13} color="#fff" strokeWidth={2.2} /> Spécialité</div>
                  )}
                </div>
                {/* Contenu */}
                <div style={{ padding: "22px 24px 26px" }}>
                  <IconTile name={s.id} size={50} icon={24} from={s.special ? P : T} to={s.special ? "#E0559E" : OCEAN} radius={15} style={{ marginTop: -46, marginBottom: 12, position: "relative", boxShadow: `0 10px 24px ${s.special ? P : T}40, inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -3px 8px rgba(0,0,0,0.14)`, border: "2px solid #fff" }} />
                  <h3 style={{ fontSize: 17.5, fontWeight: 700, color: TEXT, marginBottom: 8, lineHeight: 1.3 }}>{s.title}</h3>
                  <p style={{ fontSize: 13.5, color: TEXT2, lineHeight: 1.7, marginBottom: 16 }}>{s.short}</p>
                  <span style={{ fontSize: 13, color: s.special ? P : T, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                    Découvrir <span>→</span>
                  </span>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal style={{ textAlign: "center", marginTop: 50 }}>
            <Link href="/services"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 30, border: `2px solid ${T}40`, color: T, fontWeight: 700, fontSize: 15, textDecoration: "none", background: "#fff", boxShadow: "0 2px 12px rgba(13,169,164,0.1)", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = `${T}08`; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}>
              Voir toutes nos prestations →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          BANDE IMMERSIVE — feuillage + citation (parallax)
          ════════════════════════════════ */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: "clamp(340px, 46vw, 520px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div aria-hidden data-parallax="0.18" className="parallax" style={{ position: "absolute", top: "-22%", left: 0, right: 0, height: "144%", zIndex: 0 }}>
          <img src={IMG.greenery} alt="" width={1600} height={900} loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(120deg, rgba(10,40,40,0.80), rgba(13,27,42,0.64))" }} />
        {/* Vignette douce — concentre le regard sur la citation */}
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, background: "radial-gradient(120% 90% at 50% 50%, transparent 40%, rgba(6,20,24,0.45) 100%)", pointerEvents: "none" }} />
        <div className="band-quote" style={{ position: "relative", zIndex: 2, maxWidth: 840, padding: "56px 28px", textAlign: "center" }}>
          <Reveal y={20} style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}><Icon name="jardinage" size={38} color="rgba(255,255,255,0.92)" strokeWidth={1.6} /></Reveal>
          <Reveal delay={120} y={34}>
            <p className="display" style={{ fontSize: "clamp(24px, 3.4vw, 42px)", color: "#fff", lineHeight: 1.28, fontWeight: 600, textShadow: "0 2px 24px rgba(0,0,0,0.28)" }}>
              « Prendre soin de votre maison,<br />comme si c&apos;était la nôtre. »
            </p>
          </Reveal>
          <Reveal delay={260} style={{ fontSize: 14, color: "rgba(255,255,255,0.74)", marginTop: 20, letterSpacing: 0.5 }}>
            Myriam Rovela · Fondatrice de J&apos;MTD
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          COMMENT ÇA MARCHE
          ════════════════════════════════ */}
      <section style={{ background: WARM, padding: "96px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="eyebrow" style={{ justifyContent: "center" }}>Simple & rapide</div>
            <h2 className="display" style={{ fontSize: "clamp(30px, 3.8vw, 48px)" }}>
              Comment ça marche ?
            </h2>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, textAlign: "center" }} className="why-grid">
            {[
              { n: "01", icon: "phone",      title: "Vous contactez", text: "Par téléphone, WhatsApp ou formulaire. Réponse sous 24h.", color: T, to: OCEAN },
              { n: "02", icon: "assistance", title: "Devis gratuit", text: "Nous analysons vos besoins et vous proposons une formule.", color: P, to: "#E0559E" },
              { n: "03", icon: "home",       title: "On intervient", text: "Votre intervenante J'MTD vient chez vous aux horaires convenus.", color: T, to: OCEAN },
              { n: "04", icon: "credit",     title: "50% remboursé", text: "Attestation fiscale fournie chaque année pour votre déclaration.", color: P, to: "#E0559E" },
            ].map((step, i) => (
              <Reveal key={step.n} delay={i * 90} style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                {i < 3 && <div className="hide-mobile" style={{ position: "absolute", top: 28, left: "62%", width: "76%", height: 2, background: `linear-gradient(90deg, ${step.color}40, transparent)` }} />}
                <IconTile name={step.icon} size={58} icon={25} from={step.color} to={step.to} radius={29} style={{ marginBottom: 14 }} />

                <div style={{ fontSize: 11, fontWeight: 800, color: step.color, letterSpacing: 1, marginBottom: 6 }}>ÉTAPE {step.n}</div>
                <h3 style={{ fontSize: 15.5, fontWeight: 700, color: TEXT, marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: TEXT2, lineHeight: 1.7 }}>{step.text}</p>
              </Reveal>
            ))}
          </div>

          <Reveal style={{ textAlign: "center", marginTop: 56 }}>
            <a href={PHONE_HREF} className="btn-gradient" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 34px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none", boxShadow: `0 8px 28px ${T}44` }}>
              <Icon name="phone" size={18} color="#fff" /> Commencer — Appel gratuit
            </a>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          MOMENT CINÉMATIQUE PLEIN CADRE — mer turquoise + statement (parallax)
          ════════════════════════════════ */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: "clamp(420px, 56vw, 620px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Calque mer (parallax profond) — surdimensionné pour ne jamais laisser de vide */}
        <div aria-hidden data-parallax="0.22" className="parallax" style={{ position: "absolute", top: "-24%", left: 0, right: 0, height: "148%", zIndex: 0 }}>
          <img src={IMG.seaLight} alt="" width={1600} height={1000} loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        {/* Scrim navy/teal — profondeur & lisibilité */}
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(160deg, rgba(9,32,38,0.62) 0%, rgba(11,40,44,0.50) 50%, rgba(13,27,42,0.68) 100%)" }} />
        {/* Voile teal subtil pour la teinte tropicale */}
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, background: `radial-gradient(120% 80% at 50% 40%, ${OCEAN}18 0%, transparent 60%)`, mixBlendMode: "screen", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 940, padding: "72px 28px", textAlign: "center", width: "100%" }}>
          <Reveal>
            <div className="eyebrow" style={{ justifyContent: "center", color: "rgba(255,255,255,0.85)" }}>Enracinés en Martinique</div>
          </Reveal>
          <Reveal scrub y={46}>
            <p className="display" style={{ fontSize: "clamp(28px, 4vw, 52px)", color: "#fff", lineHeight: 1.22, fontWeight: 600, marginBottom: 14, textShadow: "0 2px 24px rgba(0,0,0,0.25)" }}>
              Une île, une exigence :<br />prendre soin des foyers d&apos;ici.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <p style={{ fontSize: "clamp(15px, 1.6vw, 18px)", color: "rgba(255,255,255,0.82)", lineHeight: 1.75, maxWidth: 560, margin: "0 auto 44px" }}>
              De Rivière-Salée à Fort-de-France, nos intervenantes connaissent la Martinique — et vos attentes.
            </p>
          </Reveal>

          <div className="sea-stats" style={{ display: "flex", alignItems: "stretch", justifyContent: "center", gap: 0, flexWrap: "wrap" }}>
            {[
              { value: 200, suffix: "+", label: "Foyers accompagnés" },
              { value: 11, suffix: "", label: "Communes desservies" },
              { value: 24, suffix: "h", label: "Délai de réponse" },
              { value: 50, suffix: "%", label: "Crédit d'impôt" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={300 + i * 90} y={24}
                style={{ padding: "0 clamp(18px, 3vw, 40px)", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: 130 }}>
                {i > 0 && <span aria-hidden className="sea-stat-div" style={{ position: "absolute", left: 0, top: "18%", bottom: "18%", width: 1, background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.35), transparent)" }} />}
                <div className="display" style={{ fontSize: "clamp(34px, 4.6vw, 56px)", fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                  <CountUp value={s.value} suffix={s.suffix} duration={1400} />
                </div>
                <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.72)", marginTop: 8, letterSpacing: 0.4 }}>{s.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          CRÉDIT D'IMPÔT + SIMULATEUR
          ════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "96px 24px" }}>
        <div className="calc-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 64, alignItems: "center" }}>
          <Reveal>
            <div className="eyebrow">Crédit d&apos;impôt SAP</div>
            <h2 className="display" style={{ fontSize: "clamp(30px, 3.8vw, 48px)", marginBottom: 22 }}>
              Moins cher<br />que vous<br />ne le pensez
            </h2>
            <p style={{ fontSize: 16.5, color: TEXT2, lineHeight: 1.8, marginBottom: 32, maxWidth: 440 }}>
              L&apos;État finance <strong style={{ color: TEXT }}>50% de vos dépenses</strong> de services à la personne. Ce qui coûte 100€ ne vous revient qu&apos;à 50€.
            </p>
            {["Valable pour tous les foyers", "Sur toutes nos prestations", "Attestation fiscale incluse"].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15, color: TEXT2, marginBottom: 14 }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", background: `${T}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="check" size={14} color={T} strokeWidth={2.5} /></span>
                {t}
              </div>
            ))}
          </Reveal>
          <Reveal delay={140}><Calculator /></Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          TÉMOIGNAGES
          ════════════════════════════════ */}
      <section style={{ background: WARM, padding: "96px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="eyebrow" style={{ justifyContent: "center" }}>Ils nous font confiance</div>
            <h2 className="display" style={{ fontSize: "clamp(30px, 3.8vw, 48px)" }}>
              Ce que disent nos clients
            </h2>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 16 }}>
              {"★★★★★".split("").map((s, i) => <span key={i} style={{ color: "#F59E0B", fontSize: 22 }}>{s}</span>)}
              <span style={{ fontSize: 14, color: TEXT2, marginLeft: 10, fontWeight: 500 }}>+200 foyers &amp; entreprises accompagnés en Martinique</span>
            </div>
          </Reveal>

          <div className="testimonials-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 110} className="lift"
                style={{ padding: "34px 30px", background: "#fff", borderRadius: 24, boxShadow: WARM_SHADOW, border: "1px solid rgba(0,0,0,0.04)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 10, right: 20, fontFamily: "Georgia, serif", fontSize: 100, color: `${T}09`, lineHeight: 1 }}>&ldquo;</div>
                <div style={{ display: "flex", gap: 3, marginBottom: 18 }}>
                  {"★★★★★".split("").map((s, j) => <span key={j} style={{ color: "#F59E0B", fontSize: 15 }}>{s}</span>)}
                </div>
                <p style={{ fontSize: 15, color: TEXT, lineHeight: 1.9, marginBottom: 28, fontStyle: "italic", fontWeight: 500, position: "relative" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 14, paddingTop: 20, borderTop: "1px solid #F1F5F9" }}>
                  <div style={{ width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 800, fontSize: 15, letterSpacing: 0.5, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {t.name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>{t.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: TEXT2, marginTop: 2 }}><Icon name="pin" size={12} color={TEXT2} /> {t.city} · {t.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          ZONES D'INTERVENTION
          ════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 44 }}>
            <div className="eyebrow" style={{ justifyContent: "center" }}>Toute la Martinique</div>
            <h2 className="display" style={{ fontSize: "clamp(26px, 3.2vw, 40px)", marginBottom: 10 }}>
              Zones d&apos;intervention
            </h2>
            <p style={{ fontSize: 15, color: TEXT2 }}>Basée à Rivière-Salée · Nous nous déplaçons partout en Martinique</p>
          </Reveal>
          <Reveal delay={90} style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {[
              "Rivière-Salée","Le Lamentin","Le Diamant","Saint-Esprit",
              "Fort-de-France","Le Vauclin","Sainte-Anne","Le François",
              "Sainte-Luce","Le Marin","Trois-Îlets","et toute la Martinique"
            ].map(z => (
              <span key={z} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: WARM, border: `1.5px solid ${T}20`, borderRadius: 30, fontSize: 13, color: TEXT2, fontWeight: 500, transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T; e.currentTarget.style.color = T; e.currentTarget.style.background = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${T}20`; e.currentTarget.style.color = TEXT2; e.currentTarget.style.background = WARM; }}>
                <Icon name="pin" size={13} color="currentColor" /> {z}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          FAQ
          ════════════════════════════════ */}
      <section style={{ background: WARM, padding: "96px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="eyebrow" style={{ justifyContent: "center" }}>Questions fréquentes</div>
            <h2 className="display" style={{ fontSize: "clamp(30px, 3.8vw, 48px)" }}>
              Tout ce que vous voulez savoir
            </h2>
          </Reveal>
          <Reveal delay={90}><FAQ /></Reveal>
          <Reveal style={{ textAlign: "center", marginTop: 44 }}>
            <p style={{ fontSize: 15, color: TEXT2, marginBottom: 20 }}>Une autre question ? On vous répond en 2 min.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href={PHONE_HREF} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 26px", borderRadius: 30, border: `2px solid ${T}40`, color: T, fontWeight: 700, fontSize: 14, textDecoration: "none", background: "#fff" }}>
                <Icon name="phone" size={16} color={T} /> Appeler
              </a>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 26px", borderRadius: 30, background: "#25D366", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none", boxShadow: "0 4px 16px rgba(37,211,102,0.3)" }}>
                <Icon name="chat" size={16} color="#fff" /> WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          CTA FINAL — sombre, rassurant
          ════════════════════════════════ */}
      <section style={{ background: `linear-gradient(135deg, #0D1B2A 0%, #1A2D3D 100%)`, padding: "96px 24px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -100, right: -80, width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${T}16, transparent 70%)`, pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", bottom: -80, left: -60, width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${P}12, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="eyebrow" style={{ justifyContent: "center", color: OCEAN }}>Commencez maintenant</div>
            <h2 className="display" style={{ fontSize: "clamp(32px, 4.2vw, 54px)", color: "#F8FAFC", marginBottom: 16, lineHeight: 1.12 }}>
              Prêt à déléguer votre quotidien ?
            </h2>
            <p style={{ fontSize: 16.5, color: "rgba(248,250,252,0.68)", lineHeight: 1.8 }}>Devis gratuit · Rappel sous 24h · Sans engagement · 50% remboursé</p>
          </Reveal>

          <Reveal style={{ textAlign: "center", marginBottom: 40 }}>
            <a href={PHONE_HREF} className="btn-gradient" style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "20px 42px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 800, fontSize: 20, textDecoration: "none", boxShadow: `0 12px 40px ${T}55`, letterSpacing: -0.3, border: "none" }}>
              <Icon name="phone" size={22} color="#fff" /> {PHONE}
            </a>
            <div style={{ fontSize: 13, color: "rgba(248,250,252,0.4)", marginTop: 12 }}>Lun–Ven · 8h–18h · Appel gratuit</div>
          </Reveal>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36, color: "rgba(248,250,252,0.3)", fontSize: 13, justifyContent: "center" }}>
            <div style={{ flex: 1, maxWidth: 120, height: 1, background: "rgba(255,255,255,0.12)" }} />
            ou remplissez le formulaire ci-dessous
            <div style={{ flex: 1, maxWidth: 120, height: 1, background: "rgba(255,255,255,0.12)" }} />
          </div>

          <Reveal delay={120}><QuickForm /></Reveal>
        </div>
      </section>

      {/* ── Responsive homepage (mobile safety) ── */}
      <style>{`
        @media (max-width: 900px) {
          .hero-section { min-height: auto !important; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; padding-top: 52px !important; padding-bottom: 8px !important; }
          .hero-visual { max-width: 480px; margin: 0 auto; width: 100%; }
          /* Frondes : réduites & discrètes derrière le contenu empilé */
          .hero-palm { width: 62vw !important; opacity: 0.85; }
        }
        @media (max-width: 900px) {
          .why-pin-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          .why-pin-intro { position: static !important; top: auto !important; text-align: center; }
          .why-pin-intro p { margin-left: auto; margin-right: auto; }
        }
        @media (max-width: 768px) {
          .why-grid { grid-template-columns: 1fr !important; }
          .hero-photo { height: 340px !important; }
          .band-quote p { font-size: clamp(22px, 6vw, 30px) !important; }
          /* Stats du moment plein cadre : grille 2×2 lisible, sans séparateurs verticaux */
          .sea-stats { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 28px 0 !important; max-width: 360px; margin: 0 auto; }
          .sea-stat-div { display: none !important; }
        }
        @media (max-width: 420px) {
          .hero-photo { height: 300px !important; }
          .hero-palm { display: none !important; }
        }
      `}</style>

    </div>
  );
}

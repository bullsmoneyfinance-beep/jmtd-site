"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { PHONE, PHONE_HREF, WHATSAPP, SERVICES, TESTIMONIALS, ZONES } from "../lib/data";

const WA_SVG = (<svg width="18" height="18" viewBox="0 0 32 32" fill="none" style={{display:"block",flexShrink:0}}><circle cx="16" cy="16" r="16" fill="#25D366"/><path d="M23.5 8.5A10.4 10.4 0 0 0 16 5.5C10.2 5.5 5.5 10.2 5.5 16c0 1.85.48 3.65 1.4 5.25L5.5 26.5l5.4-1.4A10.4 10.4 0 0 0 16 26.5c5.8 0 10.5-4.7 10.5-10.5 0-2.8-1.1-5.43-3-7.5zm-7.5 16.1a8.6 8.6 0 0 1-4.4-1.2l-.3-.2-3.2.84.86-3.1-.2-.33A8.6 8.6 0 1 1 16 24.6zm4.7-6.4c-.26-.13-1.53-.75-1.77-.84-.23-.08-.4-.13-.56.13-.17.26-.64.84-.79 1.01-.14.17-.29.19-.54.06-.26-.13-1.08-.4-2.06-1.27-.76-.68-1.28-1.52-1.43-1.77-.15-.26-.01-.4.11-.52.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.32-.23.26-.87.85-.87 2.07s.89 2.4 1.01 2.57c.13.17 1.75 2.67 4.24 3.75.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.53-.63 1.74-1.23.22-.6.22-1.12.15-1.23-.06-.12-.23-.19-.49-.31z" fill="#fff"/></svg>);

const T = "#0DA9A4";
const P = "#D4197A";
const TEXT = "#1A2D3D";
const TEXT2 = "#64748B";

/* Couleurs chaudes services à la personne */
const WARM = "#FFF8F4";
const WARM2 = "#FFF4EE";
const WARM_SHADOW = "0 4px 28px rgba(0,0,0,0.06)";

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

const TICKS = [
  "✦ Agrément SAP officiel","✦ 5/5 Google","✦ +200 foyers","✦ Méthode Marie Kondo",
  "✦ 50% crédit d'impôt","✦ Toute la Martinique","✦ Réponse en 24h","✦ Devis gratuit",
];

function Calculator() {
  const [h, setH] = useState(8);
  const gross = h * 18;
  const net = Math.ceil(gross * 0.5);
  return (
    <div style={{ background: "#fff", borderRadius: 24, border: `1.5px solid rgba(13,169,164,0.15)`, boxShadow: WARM_SHADOW, padding: "36px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${T}, ${P})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💳</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 1 }}>Simulateur</div>
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
      <Link href="/contact" style={{ display: "block", textAlign: "center", background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", padding: 15, borderRadius: 30, fontWeight: 700, fontSize: 15, textDecoration: "none", boxShadow: `0 6px 24px ${T}44` }}>
        Obtenir mon devis gratuit →
      </Link>
    </div>
  );
}

function QuickForm() {
  const [form, setForm] = useState({ nom: "", tel: "", service: "", rgpd: false });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    if (!form.rgpd) { alert("Veuillez accepter la politique de confidentialité."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false); setSent(true);
  };

  if (sent) return (
    <div style={{ textAlign: "center", padding: "56px 24px", background: "#F0FDFB", border: `1.5px solid rgba(13,169,164,0.2)`, borderRadius: 24 }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
      <h3 style={{ fontSize: 22, fontWeight: 700, color: TEXT, marginBottom: 8 }}>Demande envoyée !</h3>
      <p style={{ color: TEXT2 }}>Nous vous rappelons sous 24h ouvrées.</p>
    </div>
  );

  return (
    <form onSubmit={submit} style={{ background: "#fff", border: `1.5px solid rgba(13,169,164,0.12)`, borderRadius: 24, padding: "36px 32px", boxShadow: WARM_SHADOW }}>
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
          {SERVICES.map(s => <option key={s.id} value={s.id} style={{ color: TEXT }}>{s.icon} {s.title}</option>)}
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
      <button type="submit" disabled={loading} className="btn-amber"
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
    </form>
  );
}

const FAQ_ITEMS = [
  { q: "Êtes-vous agréés Services à la Personne ?", a: "Oui, J'MTD est officiellement agréé SAP. Cet agrément vous donne droit au crédit d'impôt de 50% sur toutes nos prestations." },
  { q: "Comment fonctionne le crédit d'impôt ?", a: "L'État rembourse 50% de vos dépenses SAP via votre déclaration d'impôts. Nous vous fournissons une attestation fiscale annuelle. Applicable même si vous n'êtes pas imposable." },
  { q: "Dans quelles communes intervenez-vous ?", a: "J'MTD intervient partout en Martinique : Rivière-Salée (siège), Le Lamentin, Le Diamant, Saint-Esprit, Fort-de-France, Le Vauclin, Sainte-Anne, Le François et toutes les communes environnantes." },
  { q: "Comment se passe le premier contact ?", a: "Remplissez le formulaire ou appelez-nous. Nous vous rappelons sous 24h pour comprendre vos besoins, puis établissons un devis gratuit et sans engagement." },
  { q: "Le coaching rangement, comment ça marche ?", a: "Inspirée de la méthode Marie Kondo, notre coach commence par un diagnostic gratuit. Ensemble, on définit un plan d'action selon vos envies." },
  { q: "Puis-je choisir mes jours et horaires ?", a: "Absolument. Nos interventions sont planifiées selon vos disponibilités, du lundi au vendredi de 8h à 18h." },
];

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ maxWidth: 780, margin: "0 auto" }}>
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
  useReveal();

  return (
    <div style={{ background: "#fff" }}>

      {/* ════════════════════════════════
          HERO — chaud, humain, rassurant
          ════════════════════════════════ */}
      <section style={{ position: "relative", overflow: "hidden", background: `linear-gradient(160deg, ${WARM} 0%, #EFF9F8 100%)`, paddingBottom: 80 }}>
        {/* Orbes doux */}
        <div style={{ position: "absolute", top: -100, right: -60, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${T}12 0%, transparent 70%)`, animation: "floatOrb 14s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -40, width: 360, height: 360, borderRadius: "50%", background: `radial-gradient(circle, ${P}0c 0%, transparent 70%)`, animation: "floatOrb 18s ease-in-out infinite reverse", pointerEvents: "none" }} />

        <div className="hero-grid" style={{ maxWidth: 1140, margin: "0 auto", padding: "64px 24px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", position: "relative" }}>

          {/* ── Gauche — proposition de valeur ── */}
          <div>
            {/* Badge SAP */}
            <div className="anim-fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: `1.5px solid ${T}30`, borderRadius: 30, padding: "8px 18px", marginBottom: 32, boxShadow: "0 2px 12px rgba(13,169,164,0.1)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: T, display: "inline-block", animation: "softPulse 2.5s infinite" }} />
              <span style={{ fontSize: 13, color: T, fontWeight: 700 }}>Agréé Services à la Personne · SAP</span>
            </div>

            {/* H1 */}
            <h1 className="anim-fade-up delay-1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(36px, 4.8vw, 62px)", fontWeight: 700, lineHeight: 1.1, color: TEXT, marginBottom: 24, letterSpacing: -1.5 }}>
              Votre maison<br />
              entre de bonnes{" "}
              <span style={{ background: `linear-gradient(135deg, ${T}, ${P})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>mains.</span>
            </h1>

            {/* Description */}
            <p className="anim-fade-up delay-2" style={{ fontSize: 17, color: TEXT2, lineHeight: 1.8, marginBottom: 12, maxWidth: 460 }}>
              Ménage, repas, courses, coach rangement — des intervenantes <strong style={{ color: TEXT }}>sélectionnées, formées et discrètes</strong> pour prendre soin de votre quotidien.
            </p>
            <p className="anim-fade-up delay-2" style={{ fontSize: 15, color: T, fontWeight: 600, marginBottom: 36, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ background: `${T}15`, borderRadius: 20, padding: "3px 12px" }}>💳 50% remboursé par crédit d&apos;impôt SAP</span>
            </p>

            {/* CTAs */}
            <div className="anim-fade-up delay-3" style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
              <Link href="/contact" className="btn-amber btn-gradient"
                style={{ padding: "16px 32px", borderRadius: 30, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, border: "none", fontWeight: 700 }}>
                Devis gratuit →
              </Link>
              <a href={PHONE_HREF}
                style={{ padding: "16px 28px", borderRadius: 30, border: `2px solid ${T}40`, color: TEXT, fontSize: 15, fontWeight: 700, textDecoration: "none", background: "#fff", display: "inline-flex", alignItems: "center", gap: 10, transition: "all 0.2s", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                📞 {PHONE}
              </a>
            </div>

            {/* Stats */}
            <div className="anim-fade-up delay-4" style={{ display: "flex", gap: 32, paddingTop: 28, borderTop: "1px solid rgba(13,169,164,0.12)" }}>
              {[["200+", "Foyers accompagnés", T], ["5★", "Note Google", "#F59E0B"], ["50%", "Crédit d'impôt", P]].map(([n, l, c]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 800, color: c, lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: 12, color: TEXT2, marginTop: 4, lineHeight: 1.4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Droite — preuves sociales ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Témoignage featured */}
            <div style={{ background: "#fff", borderRadius: 22, padding: "28px 26px", boxShadow: "0 8px 48px rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.04)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 12, right: 18, fontFamily: "Georgia", fontSize: 80, color: `${T}0a`, lineHeight: 1 }}>&ldquo;</div>
              <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                {"★★★★★".split("").map((s, j) => <span key={j} style={{ color: "#F59E0B", fontSize: 16 }}>{s}</span>)}
              </div>
              <p style={{ fontSize: 15, color: TEXT, lineHeight: 1.8, fontStyle: "italic", marginBottom: 18, fontWeight: 500 }}>
                &ldquo;Myriam et son équipe sont d&apos;une discrétion et d&apos;un professionnalisme exemplaires. Ma maison n&apos;a jamais été aussi bien tenue.&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16, borderTop: "1px solid #F1F5F9" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${T}30, ${P}20)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👤</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>Sandrine M.</div>
                  <div style={{ fontSize: 12, color: TEXT2 }}>📍 Le Lamentin · Cliente depuis 2 ans</div>
                </div>
              </div>
            </div>

            {/* Badges confiance */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { icon: "🏅", title: "Agréé SAP", sub: "Crédit impôt 50%", bg: `${T}10`, border: `${T}22` },
                { icon: "⭐", title: "5/5 Google", sub: "Avis vérifiés", bg: "#FFF9F0", border: "#F59E0B33" },
                { icon: "🏠", title: "Toute la Martinique", sub: "Déplacement inclus", bg: `${P}08`, border: `${P}20` },
                { icon: "⏰", title: "Réponse 24h", sub: "Lun–Ven 8h–18h", bg: WARM, border: `${T}15` },
              ].map(item => (
                <div key={item.title} style={{ background: item.bg, border: `1px solid ${item.border}`, borderRadius: 16, padding: "16px 14px" }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, lineHeight: 1.3 }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: TEXT2, marginTop: 2 }}>{item.sub}</div>
                </div>
              ))}
            </div>

            {/* WhatsApp */}
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              style={{ padding: "16px 20px", borderRadius: 16, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: "1.5px solid #25D36630", fontSize: 15, fontWeight: 600, color: "#0d6e5c", transition: "all 0.2s", boxShadow: "0 2px 12px rgba(37,211,102,0.08)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#f0fff4"; e.currentTarget.style.borderColor = "#25D36650"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#25D36630"; }}>
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>{WA_SVG} Écrire sur WhatsApp — réponse rapide</span>
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
          POURQUOI J'MTD — valeurs chaleureuses
          ════════════════════════════════ */}
      <section style={{ background: WARM, padding: "88px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 14 }}>Pourquoi nous choisir</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, color: TEXT, marginBottom: 16, letterSpacing: -0.5 }}>
              Votre confiance, notre priorité
            </h2>
            <p style={{ fontSize: 16, color: TEXT2, maxWidth: 520, margin: "0 auto", lineHeight: 1.8 }}>
              Vous nous invitez chez vous. C&apos;est une responsabilité que nous prenons très au sérieux.
            </p>
          </div>

          <div className="why-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {[
              { icon: "🔒", title: "Personnel rigoureusement sélectionné", text: "Chaque intervenante passe par un entretien approfondi, une vérification des références et une formation aux standards J'MTD avant sa première intervention.", color: T },
              { icon: "🕐", title: "Vous récupérez votre temps", text: "Ménage, repas, courses… Confiez-nous les tâches qui vous pèsent et retrouvez du temps pour ce qui compte vraiment : votre famille, vos loisirs, vous-même.", color: P },
              { icon: "💳", title: "50% remboursé par l'État", text: "L'agrément SAP vous permet de récupérer la moitié de vos dépenses via le crédit d'impôt. Nous vous remettons une attestation fiscale chaque année.", color: T },
            ].map((c, i) => (
              <div key={c.title} className={`reveal reveal-delay-${i + 1}`}
                style={{ padding: "36px 30px", background: "#fff", borderRadius: 22, boxShadow: WARM_SHADOW, borderLeft: `4px solid ${c.color}`, transition: "transform 0.25s, box-shadow 0.25s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 48px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = WARM_SHADOW; }}>
                <div style={{ fontSize: 40, marginBottom: 20, lineHeight: 1 }}>{c.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: TEXT, marginBottom: 12, lineHeight: 1.4 }}>{c.title}</h3>
                <p style={{ fontSize: 14, color: TEXT2, lineHeight: 1.85 }}>{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          NOS SERVICES — cartes visuelles
          ════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "88px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 14 }}>Nos prestations</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, color: TEXT, letterSpacing: -0.5 }}>
              Tout ce dont vous avez besoin
            </h2>
            <p style={{ fontSize: 15, color: TEXT2, marginTop: 14, maxWidth: 480, margin: "14px auto 0" }}>
              Des prestations certifiées SAP — éligibles au crédit d&apos;impôt de 50%.
            </p>
          </div>

          <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 22 }}>
            {SERVICES.map((s, i) => (
              <Link key={s.id} href={s.id === "rangement" ? "/coach" : `/services#${s.id}`}
                className={`reveal reveal-delay-${(i % 3) + 1}`}
                style={{ textDecoration: "none", display: "block", overflow: "hidden", borderRadius: 22, background: "#fff", boxShadow: WARM_SHADOW, border: "1px solid rgba(0,0,0,0.05)", transition: "transform 0.25s, box-shadow 0.25s", borderTop: `3px solid ${s.special ? P : T}` }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 16px 56px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = WARM_SHADOW; }}>
                {/* Photo */}
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img src={s.img} alt={s.title} style={{ width: "100%", height: 210, objectFit: "cover", display: "block", transition: "transform 0.55s ease" }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.06)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"}
                    loading="lazy" />
                  {/* Prix badge */}
                  <div style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)", borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 700, color: s.special ? P : T, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
                    {s.id === "rangement" ? "Sur devis" : "À partir de 18€/h"}
                  </div>
                  {s.special && (
                    <div style={{ position: "absolute", top: 14, left: 14, background: P, color: "#fff", fontSize: 11, fontWeight: 700, padding: "5px 14px", borderRadius: 20 }}>⭐ Spécialité</div>
                  )}
                </div>
                {/* Contenu */}
                <div style={{ padding: "22px 24px 26px" }}>
                  <div style={{ fontSize: 26, marginBottom: 10 }}>{s.icon}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: TEXT, marginBottom: 8, lineHeight: 1.3 }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: TEXT2, lineHeight: 1.7, marginBottom: 16 }}>{s.short}</p>
                  <span style={{ fontSize: 13, color: s.special ? P : T, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                    Découvrir <span>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="reveal" style={{ textAlign: "center", marginTop: 48 }}>
            <Link href="/services"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 30, border: `2px solid ${T}40`, color: T, fontWeight: 700, fontSize: 15, textDecoration: "none", background: "#fff", boxShadow: "0 2px 12px rgba(13,169,164,0.1)", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = `${T}08`; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}>
              Voir toutes nos prestations →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          COMMENT ÇA MARCHE
          ════════════════════════════════ */}
      <section style={{ background: WARM, padding: "88px 24px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 14 }}>Simple & rapide</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, color: TEXT, letterSpacing: -0.5 }}>
              Comment ça marche ?
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, textAlign: "center" }} className="reveal">
            {[
              { n: "01", icon: "📞", title: "Vous contactez", text: "Par téléphone, WhatsApp ou formulaire. Réponse sous 24h.", color: T },
              { n: "02", icon: "📋", title: "Devis gratuit", text: "Nous analysons vos besoins et vous proposons une formule.", color: P },
              { n: "03", icon: "🏠", title: "On intervient", text: "Votre intervenante J'MTD vient chez vous aux horaires convenus.", color: T },
              { n: "04", icon: "💳", title: "50% remboursé", text: "Attestation fiscale fournie chaque année pour votre déclaration.", color: P },
            ].map((step, i) => (
              <div key={step.n} style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                {i < 3 && <div className="hide-mobile" style={{ position: "absolute", top: 28, left: "62%", width: "76%", height: 2, background: `linear-gradient(90deg, ${step.color}40, transparent)` }} />}
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${step.color}, ${step.color}cc)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, boxShadow: `0 6px 20px ${step.color}35`, fontSize: 24 }}>
                  {step.icon}
                </div>
                <div style={{ fontSize: 11, fontWeight: 800, color: step.color, letterSpacing: 1, marginBottom: 6 }}>ÉTAPE {step.n}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: TEXT2, lineHeight: 1.7 }}>{step.text}</p>
              </div>
            ))}
          </div>

          <div className="reveal" style={{ textAlign: "center", marginTop: 52 }}>
            <a href={PHONE_HREF} style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 32px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none", boxShadow: `0 8px 28px ${T}44` }}>
              📞 Commencer — Appel gratuit
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          CRÉDIT D'IMPÔT + SIMULATEUR
          ════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "88px 24px" }}>
        <div className="calc-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 64, alignItems: "center" }}>
          <div className="reveal">
            <div style={{ fontSize: 12, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 14 }}>Crédit d&apos;impôt SAP</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, color: TEXT, marginBottom: 20, letterSpacing: -0.5 }}>
              Moins cher<br />que vous<br />ne le pensez
            </h2>
            <p style={{ fontSize: 16, color: TEXT2, lineHeight: 1.8, marginBottom: 32 }}>
              L&apos;État finance <strong style={{ color: TEXT }}>50% de vos dépenses</strong> de services à la personne. Ce qui coûte 100€ ne vous revient qu&apos;à 50€.
            </p>
            {["Valable pour tous les foyers", "Sur toutes nos prestations", "Attestation fiscale incluse"].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15, color: TEXT2, marginBottom: 14 }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", background: `${T}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: T, fontWeight: 700, flexShrink: 0 }}>✓</span>
                {t}
              </div>
            ))}
          </div>
          <div className="reveal reveal-delay-2"><Calculator /></div>
        </div>
      </section>

      {/* ════════════════════════════════
          TÉMOIGNAGES — humains et chaleureux
          ════════════════════════════════ */}
      <section style={{ background: WARM, padding: "88px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 14 }}>Ils nous font confiance</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, color: TEXT, letterSpacing: -0.5 }}>
              Ce que disent nos clients
            </h2>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 16 }}>
              {"★★★★★".split("").map((s, i) => <span key={i} style={{ color: "#F59E0B", fontSize: 22 }}>{s}</span>)}
              <span style={{ fontSize: 14, color: TEXT2, marginLeft: 10, fontWeight: 500 }}>5/5 · +200 familles satisfaites en Martinique</span>
            </div>
          </div>

          <div className="testimonials-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 22 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className={`reveal reveal-delay-${i + 1}`}
                style={{ padding: "32px 28px", background: "#fff", borderRadius: 22, boxShadow: WARM_SHADOW, border: "1px solid rgba(0,0,0,0.04)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 10, right: 20, fontFamily: "Georgia, serif", fontSize: 100, color: `${T}07`, lineHeight: 1 }}>&ldquo;</div>
                <div style={{ display: "flex", gap: 3, marginBottom: 18 }}>
                  {"★★★★★".split("").map((s, j) => <span key={j} className="star-filled" style={{ animationDelay: `${j * 0.08}s` }}>{s}</span>)}
                </div>
                <p style={{ fontSize: 15, color: TEXT, lineHeight: 1.9, marginBottom: 28, fontStyle: "italic", fontWeight: 500, position: "relative" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 14, paddingTop: 20, borderTop: "1px solid #F1F5F9" }}>
                  <div style={{ width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg, ${T}30, ${P}20)`, border: `2px solid ${T}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>👤</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: TEXT2, marginTop: 2 }}>📍 {t.city} · Cliente J&apos;MTD</div>
                  </div>
                  <div style={{ marginLeft: "auto", background: `${T}10`, borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: T, fontWeight: 700, fontSize: 13 }}>✓</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          ZONES D'INTERVENTION
          ════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "72px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 14 }}>Toute la Martinique</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 700, color: TEXT, letterSpacing: -0.5, marginBottom: 10 }}>
              Zones d&apos;intervention
            </h2>
            <p style={{ fontSize: 15, color: TEXT2 }}>Basée à Rivière-Salée · Nous nous déplaçons partout en Martinique</p>
          </div>
          <div className="reveal reveal-delay-1" style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {[
              "📍 Rivière-Salée","📍 Le Lamentin","📍 Le Diamant","📍 Saint-Esprit",
              "📍 Fort-de-France","📍 Le Vauclin","📍 Sainte-Anne","📍 Le François",
              "📍 Sainte-Luce","📍 Le Marin","📍 Trois-Îlets","📍 et toute la Martinique"
            ].map(z => (
              <span key={z} style={{ padding: "10px 20px", background: WARM, border: `1.5px solid ${T}20`, borderRadius: 30, fontSize: 13, color: TEXT2, fontWeight: 500, transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T; e.currentTarget.style.color = T; e.currentTarget.style.background = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${T}20`; e.currentTarget.style.color = TEXT2; e.currentTarget.style.background = WARM; }}>
                {z}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          FAQ
          ════════════════════════════════ */}
      <section style={{ background: WARM, padding: "88px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 14 }}>Questions fréquentes</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, color: TEXT, letterSpacing: -0.5 }}>
              Tout ce que vous voulez savoir
            </h2>
          </div>
          <div className="reveal reveal-delay-1"><FAQ /></div>
          <div className="reveal" style={{ textAlign: "center", marginTop: 44 }}>
            <p style={{ fontSize: 15, color: TEXT2, marginBottom: 20 }}>Une autre question ? On vous répond en 2 min.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href={PHONE_HREF} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 26px", borderRadius: 30, border: `2px solid ${T}40`, color: T, fontWeight: 700, fontSize: 14, textDecoration: "none", background: "#fff" }}>
                📞 Appeler
              </a>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 26px", borderRadius: 30, background: "#25D366", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none", boxShadow: "0 4px 16px rgba(37,211,102,0.3)" }}>
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          CTA FINAL — sombre, rassurant
          ════════════════════════════════ */}
      <section style={{ background: `linear-gradient(135deg, #0D1B2A 0%, #1A2D3D 100%)`, padding: "88px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, right: -80, width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${T}14, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: -60, width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${P}10, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 16 }}>Commencez maintenant</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(30px, 4vw, 50px)", fontWeight: 700, color: "#F8FAFC", marginBottom: 16, letterSpacing: -0.5, lineHeight: 1.15 }}>
              Prêt à déléguer votre quotidien ?
            </h2>
            <p style={{ fontSize: 16, color: "rgba(248,250,252,0.65)", lineHeight: 1.8 }}>Devis gratuit · Rappel sous 24h · Sans engagement · 50% remboursé</p>
          </div>

          {/* Phone grande */}
          <div className="reveal" style={{ textAlign: "center", marginBottom: 40 }}>
            <a href={PHONE_HREF} style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "20px 40px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 800, fontSize: 20, textDecoration: "none", boxShadow: `0 10px 36px ${T}50`, letterSpacing: -0.3 }}>
              📞 {PHONE}
            </a>
            <div style={{ fontSize: 13, color: "rgba(248,250,252,0.4)", marginTop: 12 }}>Lun–Ven · 8h–18h · Appel gratuit</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36, color: "rgba(248,250,252,0.3)", fontSize: 13, justifyContent: "center" }}>
            <div style={{ flex: 1, maxWidth: 120, height: 1, background: "rgba(255,255,255,0.12)" }} />
            ou remplissez le formulaire ci-dessous
            <div style={{ flex: 1, maxWidth: 120, height: 1, background: "rgba(255,255,255,0.12)" }} />
          </div>

          <div className="reveal reveal-delay-2"><QuickForm /></div>
        </div>
      </section>

    </div>
  );
}

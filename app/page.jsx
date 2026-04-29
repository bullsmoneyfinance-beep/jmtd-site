"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { PHONE, PHONE_HREF, WHATSAPP, SERVICES, TESTIMONIALS, ZONES } from "../lib/data";

const T = "#0DA9A4";
const P = "#D4197A";
const TEXT = "#1A2D3D";
const TEXT2 = "#64748B";

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

// ── Ticker ──
const TICKS = [
  "✦ Agrément SAP officiel","✦ 5/5 Google","✦ +200 foyers","✦ Méthode Marie Kondo",
  "✦ 50% crédit d'impôt","✦ Toute la Martinique","✦ Réponse en 24h","✦ Devis gratuit",
];

// ── Simulateur crédit d'impôt ──
function Calculator() {
  const [h, setH] = useState(8);
  const gross = h * 18;
  const net = Math.ceil(gross * 0.5);
  return (
    <div style={{ background: "#fff", borderRadius: 24, border: `1.5px solid rgba(13,169,164,0.2)`, boxShadow: "0 8px 48px rgba(13,169,164,0.1)", padding: "36px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${T}, ${P})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💳</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 1 }}>Simulateur</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>Crédit d&apos;impôt</div>
        </div>
      </div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 14, color: TEXT2 }}>Heures / mois</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: T, fontFamily: "Syne, sans-serif" }}>{h}h</span>
        </div>
        <input type="range" min={1} max={40} value={h} onChange={e => setH(+e.target.value)}
          style={{ width: "100%", accentColor: T, cursor: "pointer", height: 4 }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#CBD5E1", marginTop: 6 }}>
          <span>1h</span><span>40h</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
        <div style={{ background: "#F8FAFB", borderRadius: 14, padding: "18px 14px", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 6 }}>Coût brut</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: TEXT, fontFamily: "Syne, sans-serif" }}>{gross}€</div>
        </div>
        <div style={{ background: `${T}0d`, border: `1.5px solid ${T}33`, borderRadius: 14, padding: "18px 14px", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: T, fontWeight: 600, marginBottom: 6 }}>Votre coût réel</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: T, fontFamily: "Syne, sans-serif" }}>{net}€</div>
        </div>
      </div>
      <p style={{ fontSize: 12, color: "#94A3B8", textAlign: "center", marginBottom: 20, lineHeight: 1.6 }}>
        L&apos;État rembourse <strong style={{ color: TEXT2 }}>50% de vos dépenses</strong> via votre déclaration d&apos;impôt (art. 199 sexdecies CGI)
      </p>
      <Link href="/contact" style={{ display: "block", textAlign: "center", background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", padding: 15, borderRadius: 30, fontWeight: 700, fontSize: 15, textDecoration: "none", boxShadow: `0 6px 24px ${T}44` }}>
        Obtenir mon devis gratuit →
      </Link>
    </div>
  );
}

// ── Formulaire rapide ──
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
    <form onSubmit={submit} style={{ background: "#fff", border: `1.5px solid rgba(13,169,164,0.15)`, borderRadius: 24, padding: "36px 32px", boxShadow: "0 8px 48px rgba(13,169,164,0.08)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
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
          J&apos;accepte que mes données soient utilisées pour traiter ma demande, conformément à la{" "}
          <Link href="/politique-confidentialite" style={{ color: T, textDecoration: "underline" }}>politique de confidentialité</Link> de J&apos;MTD (RGPD).
        </span>
      </label>
      <button type="submit" disabled={loading} className="btn-amber"
        style={{ width: "100%", padding: "16px", borderRadius: 30, fontSize: 16, cursor: loading ? "wait" : "pointer", border: "none" }}>
        {loading ? "Envoi…" : "Envoyer ma demande de devis →"}
      </button>
    </form>
  );
}

// ── FAQ ──
const FAQ_ITEMS = [
  { q: "Êtes-vous agréés Services à la Personne ?", a: "Oui, J'MTD est officiellement agréé SAP. Cet agrément vous donne droit au crédit d'impôt de 50% sur toutes nos prestations, quelles qu'elles soient." },
  { q: "Comment fonctionne le crédit d'impôt ?", a: "L'État rembourse 50% de vos dépenses de services à la personne via votre déclaration d'impôts (art. 199 sexdecies du CGI). Nous vous fournissons une attestation fiscale annuelle. Applicable même si vous n'êtes pas imposable (sous forme de crédit remboursé)." },
  { q: "Dans quelles communes intervenez-vous ?", a: "J'MTD intervient partout en Martinique : Rivière-Salée (siège), Le Lamentin, Le Diamant, Saint-Esprit, Fort-de-France, Le Vauclin, Sainte-Anne, Le François et toutes les communes environnantes." },
  { q: "Comment se passe le premier contact ?", a: "C'est simple : remplissez le formulaire ou appelez-nous. Nous vous rappelons sous 24h pour comprendre vos besoins. Nous établissons ensuite un devis gratuit et sans engagement avant toute intervention." },
  { q: "Le coaching rangement, comment ça marche ?", a: "Inspirée de la méthode Marie Kondo, notre coach en rangement commence par un diagnostic gratuit de votre domicile. Ensemble, on définit un plan d'action. Elle peut intervenir en accompagnement (vous guidez) ou en prestation complète (elle range à votre place)." },
  { q: "Puis-je choisir mes jours et horaires ?", a: "Absolument. Nos interventions sont planifiées selon vos disponibilités, du lundi au vendredi de 8h à 18h. Des créneaux en dehors de ces horaires peuvent être arrangés sur demande." },
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

// ── Page principale ──
export default function HomePage() {
  useReveal();

  return (
    <div style={{ background: "#fff" }}>

      {/* ──── HERO ──── */}
      <section style={{ position: "relative", overflow: "hidden", background: "#fff", paddingBottom: 80 }}>
        {/* Orbes flottants */}
        <div style={{ position: "absolute", top: -120, right: -80, width: 560, height: 560, borderRadius: "50%", background: `radial-gradient(circle, ${T}1a 0%, transparent 70%)`, animation: "floatOrb 14s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: -60, width: 420, height: 420, borderRadius: "50%", background: `radial-gradient(circle, ${P}14 0%, transparent 70%)`, animation: "floatOrb 18s ease-in-out infinite reverse", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30%", left: "40%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${T}0d 0%, transparent 70%)`, animation: "floatOrbSlow 22s ease-in-out infinite", pointerEvents: "none" }} />

        {/* ── Logo showcase centré ── */}
        <div className="logo-showcase" style={{ textAlign: "center", padding: "56px 24px 28px", position: "relative" }}>
          <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
            {/* SVG inline — Dancing Script chargé dans <head> s'applique ici */}
            <svg viewBox="0 0 300 240" width={260} height={208} style={{ display: "block", overflow: "visible" }} aria-label="J'MTD">
              <text x="2" y="110" fontFamily="'Dancing Script', cursive" fontWeight="700" fontSize="108" fill="#D4197A" letterSpacing="-2">J&apos;m</text>
              <text x="90" y="220" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="154" fill="#0DA9A4" letterSpacing="-5">TD</text>
              <text x="2" y="250" fontFamily="'Dancing Script', cursive" fontWeight="700" fontSize="21" fill="#D4197A" letterSpacing="0.3">Société de services sur mesure</text>
            </svg>
          </div>
          <div style={{ width: 56, height: 3, background: `linear-gradient(90deg, ${T}, ${P})`, borderRadius: 10, margin: "4px auto 0" }} />
        </div>

        <div className="hero-grid" style={{ maxWidth: 1140, margin: "0 auto", padding: "24px 24px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", position: "relative" }}>

          {/* Gauche */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${T}12`, border: `1px solid ${T}2a`, borderRadius: 30, padding: "7px 16px", marginBottom: 28 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: T, display: "inline-block", animation: "softPulse 2.5s infinite" }} />
              <span style={{ fontSize: 12, color: T, fontWeight: 600, letterSpacing: 0.3 }}>Agréé Services à la Personne · SAP</span>
            </div>

            <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(34px, 4.5vw, 58px)", fontWeight: 700, lineHeight: 1.12, color: TEXT, marginBottom: 22, letterSpacing: -1 }}>
              La sérénité<br />
              à domicile, <span style={{ background: `linear-gradient(135deg, ${T}, ${P})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>enfin.</span>
            </h1>

            <p style={{ fontSize: 17, color: TEXT2, lineHeight: 1.75, marginBottom: 36, maxWidth: 460 }}>
              Ménage, repas, courses, coach rangement… Déléguez votre quotidien à l&apos;équipe J&apos;MTD.
              <strong style={{ color: TEXT }}> 50% remboursé</strong> par crédit d&apos;impôt.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 44 }}>
              <Link href="/contact" className="btn-amber"
                style={{ padding: "15px 28px", borderRadius: 30, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, border: "none" }}>
                Devis gratuit en 2 min →
              </Link>
              <a href={PHONE_HREF}
                style={{ padding: "15px 28px", borderRadius: 30, border: `1.5px solid ${T}44`, color: T, fontSize: 15, fontWeight: 600, textDecoration: "none", background: `${T}08`, transition: "all 0.2s" }}>
                📞 {PHONE}
              </a>
            </div>

            <div style={{ display: "flex", gap: 36 }}>
              {[["200+", "Foyers accompagnés"], ["5★", "Note Google"], ["50%", "Crédit d'impôt"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 800, color: T }}>{n}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Droite — preuves sociales & avantages */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Google 5★ */}
            <div className="card-zen" style={{ padding: "22px 24px", display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "#FFF9F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>⭐</div>
              <div>
                <div style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800, color: TEXT }}>5 / 5</div>
                <div style={{ fontSize: 12, color: TEXT2 }}>{"★★★★★"} · Avis Google vérifiés</div>
              </div>
            </div>
            {/* SAP */}
            <div className="card-zen" style={{ padding: "22px 24px", display: "flex", alignItems: "center", gap: 18, borderColor: `${T}33` }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${T}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>🏅</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>Agréé SAP officiel</div>
                <div style={{ fontSize: 12, color: TEXT2 }}>Crédit d&apos;impôt 50% garanti</div>
              </div>
            </div>
            {/* Intervention */}
            <div className="card-zen" style={{ padding: "22px 24px", display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${P}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>🏠</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>Toute la Martinique</div>
                <div style={{ fontSize: 12, color: TEXT2 }}>Intervention sous 24h · Lun–Ven</div>
              </div>
            </div>
            {/* Devis */}
            <Link href="/contact" className="btn-amber"
              style={{ padding: "18px 24px", borderRadius: 18, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "space-between", border: "none", fontSize: 15 }}>
              <span>🎯 Devis gratuit en 2 min</span>
              <span style={{ fontSize: 22 }}>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ──── TICKER ──── */}
      <div style={{ background: `linear-gradient(135deg, ${T}, ${P})`, overflow: "hidden", padding: "11px 0" }}>
        <div className="ticker-inner">
          {[...TICKS, ...TICKS].map((t, i) => (
            <span key={i} style={{ whiteSpace: "nowrap", padding: "0 28px", fontSize: 12, fontWeight: 600, color: "#fff", opacity: 0.9 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* ──── POURQUOI J'MTD ──── */}
      <section className="section-pad" style={{ background: "#F8FAFB", padding: "88px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 14 }}>Pourquoi nous choisir</div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: TEXT, marginBottom: 14, letterSpacing: -0.5 }}>
              Votre temps est précieux
            </h2>
            <p style={{ fontSize: 16, color: TEXT2, maxWidth: 540, margin: "0 auto", lineHeight: 1.75 }}>
              J&apos;MTD prend soin de l&apos;essentiel pour que vous puissiez profiter pleinement de ce qui compte vraiment.
            </p>
          </div>
          <div className="why-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {[
              { icon: "🕐", title: "Gagnez du temps", text: "Confiez-nous votre quotidien : ménage, repas, courses. Vous récupérez vos soirées et week-ends.", color: T },
              { icon: "🔒", title: "Personnel de confiance", text: "Chaque intervenant est rigoureusement sélectionné, formé et couvert. Discrétion garantie.", color: P },
              { icon: "💳", title: "50% remboursé", text: "Le crédit d'impôt (art. 199 sexdecies CGI) rembourse la moitié de vos dépenses. Attestation fournie.", color: T },
            ].map((c, i) => (
              <div key={c.title} className={`card-zen reveal reveal-delay-${i + 1}`} style={{ padding: "32px 28px" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${c.color}14`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 20 }}>{c.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: TEXT, marginBottom: 10 }}>{c.title}</h3>
                <p style={{ fontSize: 14, color: TEXT2, lineHeight: 1.75 }}>{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── NOS SERVICES ──── */}
      <section style={{ background: "#fff", padding: "88px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 14 }}>Nos prestations</div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: TEXT, letterSpacing: -0.5 }}>
              Tout ce dont vous avez besoin
            </h2>
          </div>
          <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 20 }}>
            {SERVICES.map((s, i) => (
              <Link key={s.id} href={s.id === "rangement" ? "/coach" : `/services#${s.id}`}
                className={`card-zen reveal reveal-delay-${(i % 3) + 1}`}
                style={{ textDecoration: "none", display: "block", overflow: "hidden", borderColor: s.special ? `${P}33` : "rgba(13,169,164,0.14)" }}>
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img src={s.img} alt={s.title} style={{ width: "100%", height: 190, objectFit: "cover", display: "block", transition: "transform 0.5s ease" }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"}
                    loading="lazy" />
                  {s.special && (
                    <div style={{ position: "absolute", top: 14, right: 14, background: P, color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>⭐ Spécialité</div>
                  )}
                </div>
                <div style={{ padding: "22px 22px 26px" }}>
                  <div style={{ fontSize: 24, marginBottom: 10 }}>{s.icon}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 6 }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: TEXT2, lineHeight: 1.65, marginBottom: 16 }}>{s.short}</p>
                  <span style={{ fontSize: 13, color: T, fontWeight: 600 }}>Découvrir →</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="reveal" style={{ textAlign: "center", marginTop: 44 }}>
            <Link href="/services" className="btn-outline"
              style={{ display: "inline-block", padding: "13px 32px", borderRadius: 30, fontSize: 15, textDecoration: "none" }}>
              Voir toutes nos prestations →
            </Link>
          </div>
        </div>
      </section>

      {/* ──── CALCULATEUR ──── */}
      <section style={{ background: "#F8FAFB", padding: "88px 24px" }}>
        <div className="calc-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 64, alignItems: "center" }}>
          <div className="reveal">
            <div style={{ fontSize: 11, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 14 }}>Crédit d&apos;impôt</div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: TEXT, marginBottom: 18, letterSpacing: -0.5 }}>
              Moins cher que<br />vous ne le pensez
            </h2>
            <p style={{ fontSize: 16, color: TEXT2, lineHeight: 1.75, marginBottom: 28 }}>
              L&apos;État finance <strong style={{ color: TEXT }}>50% de vos dépenses</strong> de services à la personne. Simulez votre coût réel en glissant le curseur.
            </p>
            {["Valable pour tous les contribuables", "Applicable sur toutes nos prestations", "Attestation fiscale annuelle fournie"].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: TEXT2, marginBottom: 12 }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: `${T}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: T, flexShrink: 0 }}>✓</span>
                {t}
              </div>
            ))}
          </div>
          <div className="reveal reveal-delay-2"><Calculator /></div>
        </div>
      </section>

      {/* ──── COMMENT ÇA MARCHE ──── */}
      <section style={{ background: "#F8FAFB", padding: "88px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 14 }}>Simple & rapide</div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: TEXT, letterSpacing: -0.5 }}>
              Comment ça marche ?
            </h2>
            <div className="section-divider" style={{ margin: "16px auto 0" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { n: "01", icon: "📞", title: "Vous nous contactez", text: "Par téléphone, WhatsApp ou formulaire. Réponse garantie sous 24h ouvrées. Aucun engagement.", color: T },
              { n: "02", icon: "📋", title: "Devis gratuit sur mesure", text: "Nous analysons vos besoins et vous proposons une formule adaptée à votre quotidien et votre budget.", color: P },
              { n: "03", icon: "🏠", title: "On s'occupe de tout", text: "Votre intervenant J'MTD intervient chez vous aux jours et heures convenus. Discret, fiable, souriant.", color: T },
              { n: "04", icon: "💳", title: "50% remboursé par l'État", text: "Attestation fiscale annuelle fournie. Le crédit d'impôt SAP s'applique automatiquement à votre déclaration.", color: P },
            ].map((step, i) => (
              <div key={step.n} className={`process-step reveal reveal-delay-${i % 3 + 1}`}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${step.color}14`, border: `2px solid ${step.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                  {step.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontFamily: "Syne, sans-serif", fontSize: 11, fontWeight: 800, color: step.color, letterSpacing: 1 }}>ÉTAPE {step.n}</span>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>{step.title}</h3>
                  </div>
                  <p style={{ fontSize: 14, color: TEXT2, lineHeight: 1.7 }}>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── TÉMOIGNAGES ──── */}
      <section style={{ background: "#fff", padding: "88px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 14 }}>Avis clients</div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: TEXT, letterSpacing: -0.5 }}>
              Ce que disent nos clients
            </h2>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 14 }}>
              {"★★★★★".split("").map((s, i) => <span key={i} style={{ color: "#F59E0B", fontSize: 20 }}>{s}</span>)}
              <span style={{ fontSize: 14, color: TEXT2, marginLeft: 8 }}>5/5 · Tous nos clients recommandent J&apos;MTD</span>
            </div>
          </div>
          <div className="testimonials-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className={`card-zen reveal reveal-delay-${i + 1}`} style={{ padding: "30px 26px", position: "relative", overflow: "hidden" }}>
                {/* Quote mark décoratif */}
                <div style={{ position: "absolute", top: 16, right: 20, fontFamily: "Georgia, serif", fontSize: 80, color: `${T}08`, lineHeight: 1, userSelect: "none" }}>&ldquo;</div>
                <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                  {"★★★★★".split("").map((s, j) => <span key={j} className="star-filled" style={{ animationDelay: `${j * 0.08}s` }}>{s}</span>)}
                </div>
                <p style={{ fontSize: 14, color: TEXT2, lineHeight: 1.85, marginBottom: 24, fontStyle: "italic", position: "relative" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16, borderTop: "1px solid rgba(13,169,164,0.1)" }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg, ${T}30, ${P}20)`, border: `2px solid ${T}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>👤</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "#94A3B8" }}>📍 {t.city} · Client vérifié</div>
                  </div>
                  <div style={{ marginLeft: "auto", width: 28, height: 28, borderRadius: "50%", background: `${T}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✓</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── ZONES ──── */}
      <section style={{ background: `linear-gradient(135deg, ${T}08, ${P}06)`, padding: "80px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${T}12, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 14 }}>Toute la Martinique</div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 700, color: TEXT, letterSpacing: -0.5, marginBottom: 10 }}>
              Zones d&apos;intervention
            </h2>
            <p style={{ fontSize: 15, color: TEXT2 }}>Basée à Rivière-Salée · Nous nous déplaçons partout en Martinique</p>
          </div>
          <div className="reveal reveal-delay-1" style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            {[
              "📍 Rivière-Salée", "📍 Le Lamentin", "📍 Le Diamant", "📍 Saint-Esprit",
              "📍 Fort-de-France", "📍 Le Vauclin", "📍 Sainte-Anne", "📍 Le François",
              "📍 Sainte-Luce", "📍 Le Marin", "📍 Trois-Îlets", "📍 et toute la Martinique"
            ].map(z => (
              <span key={z} style={{ padding: "10px 22px", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", border: `1.5px solid ${T}25`, borderRadius: 30, fontSize: 13, color: TEXT2, fontWeight: 500, boxShadow: "0 2px 12px rgba(13,169,164,0.08)", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T; e.currentTarget.style.color = T; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${T}25`; e.currentTarget.style.color = TEXT2; }}>
                {z}
              </span>
            ))}
          </div>
          <div className="reveal" style={{ textAlign: "center", marginTop: 36 }}>
            <a href="tel:0596631308" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 28px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none", boxShadow: `0 6px 24px ${T}44` }}>
              📞 Vérifier ma zone · Appel gratuit
            </a>
          </div>
        </div>
      </section>

      {/* ──── FAQ ──── */}
      <section style={{ background: "#fff", padding: "88px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 14 }}>Questions fréquentes</div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: TEXT, letterSpacing: -0.5 }}>
              Tout ce que vous voulez savoir
            </h2>
            <div className="section-divider" style={{ margin: "16px auto 0" }} />
          </div>
          <div className="reveal reveal-delay-1">
            <FAQ />
          </div>
          <div className="reveal" style={{ textAlign: "center", marginTop: 44 }}>
            <p style={{ fontSize: 14, color: TEXT2, marginBottom: 20 }}>Une autre question ? On vous répond en 2 min.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="tel:0596631308" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 30, border: `2px solid ${T}40`, color: T, fontWeight: 600, fontSize: 14, textDecoration: "none", background: `${T}08` }}>
                📞 Appeler
              </a>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 30, background: "#25D366", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none", boxShadow: "0 4px 16px rgba(37,211,102,0.3)" }}>
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ──── CTA FINAL ──── */}
      <section style={{ background: "#F8FAFB", padding: "88px 24px" }}>
        <div style={{ maxWidth: 660, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 14 }}>Commencez maintenant</div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 700, color: TEXT, marginBottom: 14, letterSpacing: -0.5 }}>
              Prêt à déléguer ?
            </h2>
            <p style={{ fontSize: 16, color: TEXT2 }}>Devis gratuit · Rappel sous 24h · Sans engagement</p>
          </div>
          <div className="reveal reveal-delay-2"><QuickForm /></div>
        </div>
      </section>

    </div>
  );
}

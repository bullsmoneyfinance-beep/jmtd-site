"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { PHONE, PHONE_HREF, WHATSAPP, EMAIL, ADDRESS, HORAIRES, SERVICES, TEAL_TEXT } from "../../lib/data";
import { load, save } from "../../lib/storage";
import Reveal from "../../components/Reveal";
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
  lagon: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&h=1200&fit=crop&auto=format&q=80", // lagon turquoise, lumière claire
  palm:  "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=900&h=1100&fit=crop&auto=format&q=80",  // frondes de palmier
};


const inp = {
  width: "100%", padding: "13px 16px", borderRadius: 12,
  border: "1.5px solid rgba(13,169,164,0.2)", background: "#FAFBFC",
  color: TEXT, fontSize: 15, outline: "none", boxSizing: "border-box",
  fontFamily: "inherit", transition: "border-color 0.2s, box-shadow 0.2s",
};

function Field({ label, htmlFor, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} style={{ display: "block", fontSize: 11, color: MUTED, marginBottom: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function ContactPage() {
  const [form, setForm]   = useState({ nom: "", prenom: "", tel: "", email: "", service: "", message: "", zone: "", rgpd: false });
  const [sent, setSent]   = useState(false);
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  useParallax();

  // Pré-remplissage depuis l'URL : /contact?service=entretien&heures=8&zone=Diamant
  // (lu côté client pour ne pas rendre la page dynamique)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const service = params.get("service");
    const heures = params.get("heures");
    const zone = params.get("zone");
    setForm(f => ({
      ...f,
      service: SERVICES.some(s => s.id === service) ? service : f.service,
      zone: zone ? zone.slice(0, 60) : f.zone,
      message: /^\d{1,3}$/.test(heures || "")
        ? `Je souhaite environ ${heures} h par mois.`
        : f.message,
    }));
  }, []);

  const submit = async e => {
    e.preventDefault();
    if (!form.rgpd) { alert("Veuillez accepter la politique de confidentialité."); return; }
    setLoading(true);
    let ok = false;
    try {
      // Appel API → sauvegarde serveur + email de notification
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      ok = true;
    } catch {
      // Fallback localStorage si l'API échoue
      try {
        const existing = await load("jmtd_quotes", []);
        await save("jmtd_quotes", [{ id: `q${Date.now()}`, date: Date.now(), status: "nouveau", name: `${form.prenom} ${form.nom}`.trim(), phone: form.tel, email: form.email, service: form.service, zone: form.zone, message: form.message }, ...existing]);
        ok = true;
      } catch {
        ok = false;
      }
    }
    setLoading(false);
    if (ok) {
      setSent(true);
    } else {
      alert("Une erreur est survenue. Veuillez réessayer ou nous contacter directement par téléphone.");
    }
  };

  return (
    <>
      <style>{`
        @keyframes floatOrb { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes floatOrbSlow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .contact-grid { display: grid; grid-template-columns: 1fr minmax(280px,360px); gap: 40px; align-items: start; }
        .fields-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .inp-focus:focus { border-color: ${T}; box-shadow: 0 0 0 3px ${T}18; }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .fields-2col  { grid-template-columns: 1fr !important; gap: 12px !important; }
          .contact-hero { padding: 44px 16px 36px !important; }
          .contact-section { padding: 24px 16px 80px !important; }
          .contact-form { padding: 24px 18px !important; }
          .contact-sidebar { order: -1; }
          .hero-palm { opacity: 0.5 !important; }
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="contact-hero" style={{ background: `linear-gradient(160deg, ${WARM} 0%, #EAF7F6 100%)`, padding: "80px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Calque lagon turquoise (parallax profond) */}
        <div aria-hidden data-parallax="0.16" className="parallax" style={{ position: "absolute", top: "-24%", left: 0, right: 0, height: "148%", zIndex: 0 }}>
          <img src={IMG.lagon} alt="" width={1600} height={1200} loading="eager"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.20 }} />
        </div>
        {/* Frondes de palmier — accent tropical (droite) */}
        <div aria-hidden data-parallax="0.06" className="parallax hero-palm" style={{ position: "absolute", top: "-8%", right: "-8%", width: "clamp(180px, 28vw, 380px)", height: "116%", zIndex: 0, pointerEvents: "none" }}>
          <img src={IMG.palm} alt="" width={900} height={1100} loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.12, mixBlendMode: "multiply", maskImage: "linear-gradient(to left, #000 18%, transparent 90%)", WebkitMaskImage: "linear-gradient(to left, #000 18%, transparent 90%)" }} />
        </div>
        {/* Voile clair pour lisibilité */}
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(180deg, rgba(255,248,244,0.90) 0%, rgba(248,250,247,0.82) 46%, rgba(234,247,246,0.74) 100%)" }} />
        <div style={{ position: "absolute", top: -60, right: "10%", width: 280, height: 280, borderRadius: "50%", background: `radial-gradient(circle, ${T}18, transparent 70%)`, filter: "blur(40px)", animation: "floatOrb 12s ease-in-out infinite", pointerEvents: "none", zIndex: 1 }} />
        <div style={{ position: "absolute", bottom: -40, left: "5%", width: 240, height: 240, borderRadius: "50%", background: `radial-gradient(circle, ${P}12, transparent 70%)`, filter: "blur(40px)", animation: "floatOrbSlow 14s ease-in-out infinite", pointerEvents: "none", zIndex: 1 }} />
        <div style={{ maxWidth: 580, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: `1.5px solid ${T}30`, borderRadius: 30, padding: "7px 16px", marginBottom: 18, boxShadow: "0 2px 14px rgba(13,169,164,0.12)" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: T, display: "inline-block" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: TEAL_TEXT, textTransform: "uppercase", letterSpacing: 1.5 }}>Contact & Devis</span>
          </div>
          <h1 className="display" style={{ fontSize: "clamp(28px, 5vw, 48px)", color: TEXT, marginBottom: 14, lineHeight: 1.2 }}>
            Obtenez votre <span style={{ color: P }}>devis gratuit</span>
          </h1>
          <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.8 }}>
            Remplissez le formulaire ou contactez-nous directement. Réponse sous <strong style={{ color: TEXT }}>24h ouvrées</strong>.
          </p>
        </div>
      </section>

      {/* ── Contenu principal ── */}
      <section className="contact-section" style={{ background: "#F8FAFB", padding: "48px 24px 80px" }}>
        <div className="contact-grid" style={{ maxWidth: 1080, margin: "0 auto" }}>

          {/* Formulaire */}
          <Reveal>
            {sent ? (
              <div style={{ textAlign: "center", padding: "56px 24px", background: "#fff", border: `1px solid ${T}20`, borderRadius: 24 }}>
                <Icon name="checkCircle" size={56} color={T} strokeWidth={2} style={{ margin: "0 auto 16px" }} />
                <h2 style={{ fontSize: 22, fontWeight: 700, color: TEXT, marginBottom: 10 }}>Demande envoyée !</h2>
                <p style={{ color: MUTED, marginBottom: 24, lineHeight: 1.7 }}>Merci {form.prenom || form.nom}. Nous vous contactons sous 24h ouvrées.</p>
                <button onClick={() => { setSent(false); setForm({ nom: "", prenom: "", tel: "", email: "", service: "", message: "", zone: "", rgpd: false }); }}
                  style={{ padding: "12px 28px", borderRadius: 30, border: `2px solid ${T}44`, background: "transparent", color: TEAL_TEXT, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
                  Nouvelle demande
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="contact-form" style={{ background: "#fff", border: `1px solid rgba(13,169,164,0.12)`, borderRadius: 24, padding: "36px 32px", boxShadow: `0 4px 32px ${T}08` }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 700, color: TEXT, marginBottom: 6 }}>Formulaire de devis</h2>
                <p style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>Tous les champs * sont obligatoires.</p>

                <div className="fields-2col" style={{ marginBottom: 14 }}>
                  <Field label="Prénom *" htmlFor="prenom">
                    <input id="prenom" className="inp-focus" style={inp} placeholder="Marie" value={form.prenom} onChange={set("prenom")} required />
                  </Field>
                  <Field label="Nom *" htmlFor="nom">
                    <input id="nom" className="inp-focus" style={inp} placeholder="Dupont" value={form.nom} onChange={set("nom")} required />
                  </Field>
                </div>

                <div className="fields-2col" style={{ marginBottom: 14 }}>
                  <Field label="Téléphone *" htmlFor="tel">
                    <input id="tel" className="inp-focus" style={inp} placeholder="05 96 XX XX XX" type="tel" value={form.tel} onChange={set("tel")} required />
                  </Field>
                  <Field label="Email" htmlFor="email">
                    <input id="email" className="inp-focus" style={inp} placeholder="votre@email.fr" type="email" value={form.email} onChange={set("email")} />
                  </Field>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <Field label="Prestation souhaitée *" htmlFor="service">
                    <select id="service" className="inp-focus" style={{ ...inp, color: form.service ? TEXT : "#64748B" }} value={form.service} onChange={set("service")} required>
                      <option value="" style={{ color: "#64748B" }}>Choisir une prestation…</option>
                      {SERVICES.map(s => <option key={s.id} value={s.id} style={{ color: TEXT }}>{s.icon} {s.title}</option>)}
                      <option value="conciergerie" style={{ color: TEXT }}>🔑 Conciergerie locative (B2B)</option>
                    </select>
                  </Field>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <Field label="Votre commune" htmlFor="zone">
                    <input id="zone" className="inp-focus" style={inp} placeholder="Rivière-Salée, Fort-de-France…" value={form.zone} onChange={set("zone")} />
                  </Field>
                </div>

                <div style={{ marginBottom: 22 }}>
                  <Field label="Message (optionnel)" htmlFor="message">
                    <textarea id="message" className="inp-focus" style={{ ...inp, resize: "vertical", minHeight: 110 }} placeholder="Décrivez votre besoin, fréquence souhaitée, toute info utile…" value={form.message} onChange={set("message")} rows={4} />
                  </Field>
                </div>

                {/* RGPD */}
                <div style={{ background: `${T}08`, border: `1px solid ${T}22`, borderRadius: 12, padding: "14px 16px", marginBottom: 22 }}>
                  <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                    <input type="checkbox" checked={form.rgpd} onChange={e => setForm(f => ({ ...f, rgpd: e.target.checked }))}
                      style={{ marginTop: 3, accentColor: T, flexShrink: 0, width: 18, height: 18 }} required />
                    <span style={{ fontSize: 13, color: MUTED, lineHeight: 1.7 }}>
                      J&apos;accepte que J&apos;MTD traite mes données pour répondre à ma demande. Données non partagées, conservées 3 ans max.{" "}
                      <Link href="/politique-confidentialite" style={{ color: TEAL_TEXT }}>En savoir plus</Link>. *
                    </span>
                  </label>
                </div>

                <button type="submit" disabled={loading}
                  style={{ width: "100%", padding: "16px", borderRadius: 30, fontSize: 16, fontWeight: 700, color: "#fff", border: "none", cursor: loading ? "wait" : "pointer", background: `linear-gradient(135deg, ${T}, ${P})`, boxShadow: `0 6px 24px ${T}44`, transition: "transform 0.2s, box-shadow 0.2s", WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}>
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }}>
                        <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="3"/>
                        <path d="M12 2a10 10 0 0 1 10 10" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                      Envoi en cours…
                    </span>
                  ) : "Envoyer ma demande →"}
                </button>

                <p style={{ fontSize: 11, color: "#64748B", textAlign: "center", marginTop: 14 }}>
                  * Obligatoire · Données traitées conformément au RGPD
                </p>
              </form>
            )}
          </Reveal>

          {/* Sidebar */}
          <Reveal className="contact-sidebar" delay={120} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Contact rapide */}
            <div className="lift" style={{ background: "#fff", border: `1px solid rgba(13,169,164,0.12)`, borderRadius: 20, padding: "24px", boxShadow: `0 4px 20px ${T}08` }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 18 }}>Contact direct</h3>
              {[
                { href: PHONE_HREF, bg: `linear-gradient(135deg,${T},${P})`, icon: "phone", iconColor: "#fff", title: PHONE, sub: "Appel direct" },
                { href: WHATSAPP, bg: "#25D366", icon: "chat", iconColor: "#fff", title: "WhatsApp", sub: "Message rapide", target: "_blank" },
                { href: `mailto:${EMAIL}`, bg: `${T}14`, icon: "mail", iconColor: TEAL_TEXT, title: EMAIL, sub: "Email", border: `1px solid ${T}22` },
              ].map(item => (
                <a key={item.href} href={item.href} target={item.target} rel={item.target ? "noopener noreferrer" : undefined}
                  style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14, textDecoration: "none", WebkitTapHighlightColor: "transparent" }}>
                  <div style={{ width: 46, height: 46, borderRadius: "50%", background: item.bg, border: item.border, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={item.icon} size={20} color={item.iconColor} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: MUTED }}>{item.sub}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Infos */}
            <div className="lift" style={{ background: "#fff", border: `1px solid rgba(13,169,164,0.12)`, borderRadius: 20, padding: "24px", boxShadow: `0 4px 20px ${T}08` }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 16 }}>Informations</h3>
              {[
                { icon: "clock", label: "Horaires", value: HORAIRES },
                { icon: "pin", label: "Adresse", value: ADDRESS },
                { icon: "check",  label: "Réponse garantie", value: "Sous 24h ouvrées", color: T },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                  <Icon name={item.icon} size={18} color={item.color || T} strokeWidth={2} style={{ marginTop: 1 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.5 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Crédit impôt */}
            <div className="lift" style={{ background: `linear-gradient(135deg,${T}12,${P}08)`, border: `1px solid ${T}25`, borderRadius: 20, padding: "22px" }}>
              <IconTile name="credit" size={46} icon={23} from={T} to={OCEAN} radius={13} style={{ marginBottom: 10 }} />
              <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 6 }}>50% remboursé</div>
              <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.7 }}>
                Toutes nos prestations ouvrent droit au crédit d&apos;impôt SAP. Attestation fiscale remise chaque année.
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

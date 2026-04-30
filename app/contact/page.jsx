"use client";
import { useState } from "react";
import Link from "next/link";
import { PHONE, PHONE_HREF, WHATSAPP, EMAIL, ADDRESS, HORAIRES, SERVICES } from "../../lib/data";
import { load, save } from "../../lib/storage";

const T = "#0DA9A4";
const P = "#D4197A";
const TEXT = "#1A2D3D";
const MUTED = "#64748B";

const inp = {
  width: "100%", padding: "13px 16px", borderRadius: 12,
  border: "1.5px solid rgba(13,169,164,0.2)", background: "#FAFBFC",
  color: TEXT, fontSize: 15, outline: "none", boxSizing: "border-box",
  fontFamily: "inherit", transition: "border-color 0.2s, box-shadow 0.2s",
};

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, color: MUTED, marginBottom: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>
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

  const submit = async e => {
    e.preventDefault();
    if (!form.rgpd) { alert("Veuillez accepter la politique de confidentialité."); return; }
    setLoading(true);
    const existing = await load("jmtd_quotes", []);
    await save("jmtd_quotes", [{ id: `q${Date.now()}`, date: Date.now(), status: "nouveau", name: `${form.prenom} ${form.nom}`.trim(), phone: form.tel, email: form.email, service: form.service, zone: form.zone, message: form.message }, ...existing]);
    setLoading(false);
    setSent(true);
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
          .contact-hero { padding: 40px 16px 32px !important; }
          .contact-section { padding: 24px 16px 80px !important; }
          .contact-form { padding: 24px 18px !important; }
          .contact-sidebar { order: -1; }
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="contact-hero" style={{ background: "#fff", padding: "72px 24px 56px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: "10%", width: 280, height: 280, borderRadius: "50%", background: `radial-gradient(circle, ${T}18, transparent 70%)`, filter: "blur(40px)", animation: "floatOrb 12s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: "5%", width: 240, height: 240, borderRadius: "50%", background: `radial-gradient(circle, ${P}12, transparent 70%)`, filter: "blur(40px)", animation: "floatOrbSlow 14s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ maxWidth: 580, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${T}10`, border: `1px solid ${T}30`, borderRadius: 30, padding: "6px 16px", marginBottom: 18 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 1.5 }}>Contact & Devis</span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(26px, 5vw, 46px)", fontWeight: 700, color: TEXT, marginBottom: 14, lineHeight: 1.2 }}>
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
          <div>
            {sent ? (
              <div style={{ textAlign: "center", padding: "56px 24px", background: "#fff", border: `1px solid ${T}20`, borderRadius: 24 }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: TEXT, marginBottom: 10 }}>Demande envoyée !</h2>
                <p style={{ color: MUTED, marginBottom: 24, lineHeight: 1.7 }}>Merci {form.prenom || form.nom}. Nous vous contactons sous 24h ouvrées.</p>
                <button onClick={() => { setSent(false); setForm({ nom: "", prenom: "", tel: "", email: "", service: "", message: "", zone: "", rgpd: false }); }}
                  style={{ padding: "12px 28px", borderRadius: 30, border: `2px solid ${T}44`, background: "transparent", color: T, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
                  Nouvelle demande
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="contact-form" style={{ background: "#fff", border: `1px solid rgba(13,169,164,0.12)`, borderRadius: 24, padding: "36px 32px", boxShadow: `0 4px 32px ${T}08` }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 700, color: TEXT, marginBottom: 6 }}>Formulaire de devis</h2>
                <p style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>Tous les champs * sont obligatoires.</p>

                <div className="fields-2col" style={{ marginBottom: 14 }}>
                  <Field label="Prénom *">
                    <input className="inp-focus" style={inp} placeholder="Marie" value={form.prenom} onChange={set("prenom")} required />
                  </Field>
                  <Field label="Nom *">
                    <input className="inp-focus" style={inp} placeholder="Dupont" value={form.nom} onChange={set("nom")} required />
                  </Field>
                </div>

                <div className="fields-2col" style={{ marginBottom: 14 }}>
                  <Field label="Téléphone *">
                    <input className="inp-focus" style={inp} placeholder="05 96 XX XX XX" type="tel" value={form.tel} onChange={set("tel")} required />
                  </Field>
                  <Field label="Email">
                    <input className="inp-focus" style={inp} placeholder="votre@email.fr" type="email" value={form.email} onChange={set("email")} />
                  </Field>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <Field label="Prestation souhaitée *">
                    <select className="inp-focus" style={{ ...inp, color: form.service ? TEXT : "#94A3B8" }} value={form.service} onChange={set("service")} required>
                      <option value="" style={{ color: "#94A3B8" }}>Choisir une prestation…</option>
                      {SERVICES.map(s => <option key={s.id} value={s.id} style={{ color: TEXT }}>{s.icon} {s.title}</option>)}
                    </select>
                  </Field>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <Field label="Votre commune">
                    <input className="inp-focus" style={inp} placeholder="Rivière-Salée, Fort-de-France…" value={form.zone} onChange={set("zone")} />
                  </Field>
                </div>

                <div style={{ marginBottom: 22 }}>
                  <Field label="Message (optionnel)">
                    <textarea className="inp-focus" style={{ ...inp, resize: "vertical", minHeight: 110 }} placeholder="Décrivez votre besoin, fréquence souhaitée, toute info utile…" value={form.message} onChange={set("message")} rows={4} />
                  </Field>
                </div>

                {/* RGPD */}
                <div style={{ background: `${T}08`, border: `1px solid ${T}22`, borderRadius: 12, padding: "14px 16px", marginBottom: 22 }}>
                  <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                    <input type="checkbox" checked={form.rgpd} onChange={e => setForm(f => ({ ...f, rgpd: e.target.checked }))}
                      style={{ marginTop: 3, accentColor: T, flexShrink: 0, width: 18, height: 18 }} required />
                    <span style={{ fontSize: 13, color: MUTED, lineHeight: 1.7 }}>
                      J&apos;accepte que J&apos;MTD traite mes données pour répondre à ma demande. Données non partagées, conservées 3 ans max.{" "}
                      <Link href="/politique-confidentialite" style={{ color: T }}>En savoir plus</Link>. *
                    </span>
                  </label>
                </div>

                <button type="submit" disabled={loading}
                  style={{ width: "100%", padding: "16px", borderRadius: 30, fontSize: 16, fontWeight: 700, color: "#fff", border: "none", cursor: loading ? "wait" : "pointer", background: `linear-gradient(135deg, ${T}, ${P})`, boxShadow: `0 6px 24px ${T}44`, transition: "transform 0.2s, box-shadow 0.2s", WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}>
                  {loading ? "Envoi en cours…" : "Envoyer ma demande →"}
                </button>

                <p style={{ fontSize: 11, color: "#94A3B8", textAlign: "center", marginTop: 14 }}>
                  * Obligatoire · Données traitées conformément au RGPD
                </p>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="contact-sidebar" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Contact rapide */}
            <div style={{ background: "#fff", border: `1px solid rgba(13,169,164,0.12)`, borderRadius: 20, padding: "24px", boxShadow: `0 4px 20px ${T}08` }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 18 }}>Contact direct</h3>
              {[
                { href: PHONE_HREF, bg: `linear-gradient(135deg,${T},${P})`, icon: "📞", title: PHONE, sub: "Appel direct" },
                { href: WHATSAPP, bg: "#25D366", icon: "💬", title: "WhatsApp", sub: "Message rapide", target: "_blank" },
                { href: `mailto:${EMAIL}`, bg: `${T}14`, icon: "✉️", title: EMAIL, sub: "Email", border: `1px solid ${T}22` },
              ].map(item => (
                <a key={item.href} href={item.href} target={item.target} rel={item.target ? "noopener noreferrer" : undefined}
                  style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14, textDecoration: "none", WebkitTapHighlightColor: "transparent" }}>
                  <div style={{ width: 46, height: 46, borderRadius: "50%", background: item.bg, border: item.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: MUTED }}>{item.sub}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Infos */}
            <div style={{ background: "#fff", border: `1px solid rgba(13,169,164,0.12)`, borderRadius: 20, padding: "24px", boxShadow: `0 4px 20px ${T}08` }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 16 }}>Informations</h3>
              {[
                { icon: "⏰", label: "Horaires", value: HORAIRES },
                { icon: "📍", label: "Adresse", value: ADDRESS },
                { icon: "✓",  label: "Réponse garantie", value: "Sous 24h ouvrées", color: T },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                  <span style={{ color: item.color || T, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.5 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Crédit impôt */}
            <div style={{ background: `linear-gradient(135deg,${T}12,${P}08)`, border: `1px solid ${T}25`, borderRadius: 20, padding: "22px" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>💳</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 6 }}>50% remboursé</div>
              <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.7 }}>
                Toutes nos prestations ouvrent droit au crédit d&apos;impôt SAP. Attestation fiscale remise chaque année.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

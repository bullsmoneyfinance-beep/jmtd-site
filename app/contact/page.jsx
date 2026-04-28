"use client";
import { useState } from "react";
import Link from "next/link";
import { PHONE, PHONE_HREF, WHATSAPP, EMAIL, ADDRESS, HORAIRES, SERVICES } from "../../lib/data";
import { load, save } from "../../lib/storage";

const T = "#0DA9A4";
const P = "#D4197A";
const TEXT = "#1A2D3D";
const MUTED = "#64748B";

export default function ContactPage() {
  const [form, setForm] = useState({ nom: "", prenom: "", tel: "", email: "", service: "", message: "", zone: "", rgpd: false });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    if (!form.rgpd) { alert("Veuillez accepter la politique de confidentialité pour envoyer votre demande."); return; }
    setLoading(true);
    const existing = await load("jmtd_quotes", []);
    const entry = {
      id: `q${Date.now()}`,
      date: Date.now(),
      status: "nouveau",
      name: `${form.prenom} ${form.nom}`.trim(),
      phone: form.tel,
      email: form.email,
      service: form.service,
      zone: form.zone,
      message: form.message,
    };
    await save("jmtd_quotes", [entry, ...existing]);
    setLoading(false);
    setSent(true);
  };

  return (
    <>
      {/* Hero */}
      <section style={{ background: "#fff", padding: "80px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Orbs */}
        <div style={{ position: "absolute", top: -60, right: "10%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${T}18, transparent 70%)`, filter: "blur(40px)", animation: "floatOrb 12s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: "5%", width: 250, height: 250, borderRadius: "50%", background: `radial-gradient(circle, ${P}12, transparent 70%)`, filter: "blur(40px)", animation: "floatOrbSlow 14s ease-in-out infinite", pointerEvents: "none" }} />

        <div style={{ maxWidth: 600, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${T}10`, border: `1px solid ${T}30`, borderRadius: 30, padding: "6px 16px", marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 1.5 }}>Contact & Devis</span>
          </div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 700, color: TEXT, marginBottom: 16, lineHeight: 1.2 }}>
            Obtenez votre <span style={{ color: P }}>devis gratuit</span>
          </h1>
          <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.8 }}>
            Remplissez le formulaire ou appelez-nous directement. Réponse sous <strong style={{ color: TEXT }}>24h ouvrées</strong>.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section style={{ background: "#F8FAFB", padding: "64px 24px 80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr minmax(300px, 380px)", gap: 48, alignItems: "start" }}>

          {/* Form */}
          <div>
            {sent ? (
              <div style={{ textAlign: "center", padding: "64px 24px", background: "#fff", border: `1px solid ${T}20`, borderRadius: 24, boxShadow: `0 8px 40px ${T}0a` }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: TEXT, marginBottom: 12 }}>Demande envoyée !</h2>
                <p style={{ color: MUTED, marginBottom: 28, lineHeight: 1.7 }}>Merci {form.prenom || form.nom}. Nous vous contactons sous 24h ouvrées pour discuter de votre projet.</p>
                <button onClick={() => { setSent(false); setForm({ nom: "", prenom: "", tel: "", email: "", service: "", message: "", zone: "", rgpd: false }); }}
                  style={{ padding: "12px 28px", borderRadius: 30, border: `2px solid ${T}44`, background: "transparent", color: T, fontWeight: 600, cursor: "pointer", fontSize: 15 }}>
                  Envoyer une autre demande
                </button>
              </div>
            ) : (
              <form onSubmit={submit} style={{ background: "#fff", border: `1px solid rgba(13,169,164,0.12)`, borderRadius: 24, padding: "40px 36px", boxShadow: `0 4px 32px ${T}08` }}>
                <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 700, color: TEXT, marginBottom: 8 }}>Formulaire de devis</h2>
                <p style={{ fontSize: 13, color: MUTED, marginBottom: 28 }}>Tous les champs marqués * sont obligatoires.</p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11, color: MUTED, marginBottom: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>Prénom *</label>
                    <input className="form-input" placeholder="Marie" value={form.prenom} onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))} required />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, color: MUTED, marginBottom: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>Nom *</label>
                    <input className="form-input" placeholder="Dupont" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} required />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11, color: MUTED, marginBottom: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>Téléphone *</label>
                    <input className="form-input" placeholder="05 96 XX XX XX" type="tel" value={form.tel} onChange={e => setForm(f => ({ ...f, tel: e.target.value }))} required />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, color: MUTED, marginBottom: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>Email</label>
                    <input className="form-input" placeholder="votre@email.fr" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 11, color: MUTED, marginBottom: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>Prestation souhaitée *</label>
                  <select className="form-input" value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} required
                    style={{ color: form.service ? TEXT : "#94A3B8", background: "#FAFBFC" }}>
                    <option value="" style={{ color: "#94A3B8" }}>Choisir une prestation…</option>
                    {SERVICES.map(s => <option key={s.id} value={s.id} style={{ color: TEXT, background: "#fff" }}>{s.icon} {s.title}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 11, color: MUTED, marginBottom: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>Votre commune</label>
                  <input className="form-input" placeholder="Rivière-Salée, Fort-de-France…" value={form.zone} onChange={e => setForm(f => ({ ...f, zone: e.target.value }))} />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: 11, color: MUTED, marginBottom: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>Message (optionnel)</label>
                  <textarea className="form-input" placeholder="Décrivez votre besoin, la fréquence souhaitée, toute information utile…" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={4} style={{ resize: "vertical" }} />
                </div>

                {/* RGPD */}
                <div style={{ background: `${T}08`, border: `1px solid ${T}22`, borderRadius: 12, padding: "16px 18px", marginBottom: 24 }}>
                  <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                    <input type="checkbox" checked={form.rgpd} onChange={e => setForm(f => ({ ...f, rgpd: e.target.checked }))}
                      style={{ marginTop: 3, accentColor: T, flexShrink: 0 }} required />
                    <span style={{ fontSize: 13, color: MUTED, lineHeight: 1.7 }}>
                      J&apos;accepte que J&apos;MTD traite mes données personnelles dans le but de répondre à ma demande de devis. Ces données ne sont pas partagées et sont conservées 3 ans maximum.{" "}
                      <Link href="/politique-confidentialite" style={{ color: T, textDecoration: "underline" }}>En savoir plus</Link>. *
                    </span>
                  </label>
                </div>

                <button type="submit" disabled={loading} className="btn-amber"
                  style={{ width: "100%", padding: 16, borderRadius: 30, fontSize: 16, cursor: loading ? "wait" : "pointer" }}>
                  {loading ? "Envoi en cours…" : "Envoyer ma demande de devis →"}
                </button>

                <p style={{ fontSize: 11, color: "#94A3B8", textAlign: "center", marginTop: 16 }}>
                  * Champ obligatoire · Données traitées conformément au RGPD
                </p>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Direct contact */}
            <div style={{ background: "#fff", border: `1px solid rgba(13,169,164,0.12)`, borderRadius: 20, padding: "28px 24px", boxShadow: `0 4px 24px ${T}08` }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 20 }}>Nous contacter directement</h3>
              <a href={PHONE_HREF} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, textDecoration: "none" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${T}, ${P})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, boxShadow: `0 4px 16px ${T}30` }}>📞</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T }}>{PHONE}</div>
                  <div style={{ fontSize: 12, color: MUTED }}>Appel direct</div>
                </div>
              </a>
              {WHATSAPP && (
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, textDecoration: "none" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>💬</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>WhatsApp</div>
                    <div style={{ fontSize: 12, color: MUTED }}>Message rapide</div>
                  </div>
                </a>
              )}
              <a href={`mailto:${EMAIL}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${T}10`, border: `1px solid ${T}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>✉️</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{EMAIL}</div>
                  <div style={{ fontSize: 12, color: MUTED }}>Email</div>
                </div>
              </a>
            </div>

            {/* Infos pratiques */}
            <div style={{ background: "#fff", border: `1px solid rgba(13,169,164,0.12)`, borderRadius: 20, padding: "28px 24px", boxShadow: `0 4px 24px ${T}08` }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 16 }}>Informations pratiques</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { icon: "⏰", label: "Horaires", value: HORAIRES },
                  { icon: "📍", label: "Adresse", value: ADDRESS },
                  { icon: "✓", label: "Réponse garantie", value: "Sous 24h ouvrées", color: T },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", gap: 10 }}>
                    <span style={{ color: item.color || T, flexShrink: 0 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{item.label}</div>
                      <div style={{ fontSize: 13, color: MUTED }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Crédit impôt */}
            <div style={{ background: `linear-gradient(135deg, ${T}10, ${P}08)`, border: `1px solid ${T}25`, borderRadius: 20, padding: "24px" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>💳</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 6 }}>50% remboursé</div>
              <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.7 }}>
                Toutes nos prestations ouvrent droit au crédit d&apos;impôt. Une attestation fiscale vous est remise chaque année.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

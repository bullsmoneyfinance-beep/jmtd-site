"use client";
import { useState } from "react";
import Link from "next/link";
import { PHONE, PHONE_HREF, WHATSAPP, EMAIL, ADDRESS, HORAIRES, SERVICES, AMBER, PINK, NAVY, EMERALD } from "../../lib/data";

export default function ContactPage() {
  const [form, setForm] = useState({ nom: "", prenom: "", tel: "", email: "", service: "", message: "", zone: "", rgpd: false });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    if (!form.rgpd) { alert("Veuillez accepter la politique de confidentialité pour envoyer votre demande."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  return (
    <>
      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg, #0D1B2A 0%, #1a2d4a 100%)", padding: "72px 24px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: AMBER, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Contact & Devis</div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: "#F8FAFC", marginBottom: 16 }}>
            Obtenez votre devis gratuit
          </h1>
          <p style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.7 }}>
            Remplissez le formulaire ci-dessous ou appelez-nous directement. Nous vous répondons sous <strong style={{ color: "#F8FAFC" }}>24h ouvrées</strong>.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section style={{ background: "#0D1B2A", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 400px", gap: 48, alignItems: "start" }}>

          {/* Form */}
          <div>
            {sent ? (
              <div style={{ textAlign: "center", padding: "64px 24px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 24 }}>
                <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: "#F8FAFC", marginBottom: 12 }}>Demande envoyée !</h2>
                <p style={{ color: "#94A3B8", marginBottom: 28 }}>Merci {form.prenom || form.nom}. Nous vous contactons sous 24h ouvrées pour discuter de votre projet.</p>
                <button onClick={() => { setSent(false); setForm({ nom: "", prenom: "", tel: "", email: "", service: "", message: "", zone: "", rgpd: false }); }}
                  style={{ padding: "12px 28px", borderRadius: 30, border: "2px solid rgba(13,169,164,0.4)", background: "transparent", color: AMBER, fontWeight: 600, cursor: "pointer", fontSize: 15 }}>
                  Envoyer une autre demande
                </button>
              </div>
            ) : (
              <form onSubmit={submit} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24, padding: "36px 32px" }}>
                <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800, color: "#F8FAFC", marginBottom: 28 }}>Formulaire de devis</h2>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, color: "#64748B", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Prénom *</label>
                    <input className="form-input" placeholder="Marie" value={form.prenom} onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))} required />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, color: "#64748B", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Nom *</label>
                    <input className="form-input" placeholder="Dupont" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} required />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, color: "#64748B", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Téléphone *</label>
                    <input className="form-input" placeholder="05 96 XX XX XX" type="tel" value={form.tel} onChange={e => setForm(f => ({ ...f, tel: e.target.value }))} required />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, color: "#64748B", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Email</label>
                    <input className="form-input" placeholder="votre@email.fr" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 12, color: "#64748B", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Prestation souhaitée *</label>
                  <select className="form-input" value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} required>
                    <option value="">Choisir une prestation</option>
                    {SERVICES.map(s => <option key={s.id} value={s.id}>{s.icon} {s.title}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 12, color: "#64748B", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Votre commune</label>
                  <input className="form-input" placeholder="Rivière-Salée, Fort-de-France…" value={form.zone} onChange={e => setForm(f => ({ ...f, zone: e.target.value }))} />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: 12, color: "#64748B", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Message (optionnel)</label>
                  <textarea className="form-input" placeholder="Décrivez votre besoin, la fréquence souhaitée, toute information utile…" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={4} style={{ resize: "vertical" }} />
                </div>

                {/* RGPD */}
                <div style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 12, padding: "16px 18px", marginBottom: 24 }}>
                  <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                    <input type="checkbox" checked={form.rgpd} onChange={e => setForm(f => ({ ...f, rgpd: e.target.checked }))}
                      style={{ marginTop: 3, accentColor: AMBER, flexShrink: 0 }} required />
                    <span style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6 }}>
                      J&apos;accepte que J&apos;MTD traite mes données personnelles (nom, téléphone, email) dans le but de répondre à ma demande de devis. Ces données ne sont pas partagées avec des tiers et sont conservées 3 ans maximum.
                      Conformément au RGPD, je dispose d&apos;un droit d&apos;accès, de rectification et de suppression.{" "}
                      <Link href="/politique-confidentialite" style={{ color: AMBER, textDecoration: "underline" }}>
                        En savoir plus
                      </Link>
                      . *
                    </span>
                  </label>
                </div>

                <button type="submit" disabled={loading} className="btn-amber"
                  style={{ width: "100%", padding: 16, borderRadius: 30, fontSize: 16, cursor: loading ? "wait" : "pointer" }}>
                  {loading ? "Envoi en cours…" : "Envoyer ma demande de devis →"}
                </button>

                <p style={{ fontSize: 11, color: "#334155", textAlign: "center", marginTop: 16 }}>
                  * Champ obligatoire · Données traitées conformément au RGPD
                </p>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "28px 24px" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 20 }}>Nous contacter directement</h3>
              <a href={PHONE_HREF} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, textDecoration: "none" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${AMBER}, ${PINK})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>📞</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: AMBER }}>{PHONE}</div>
                  <div style={{ fontSize: 12, color: "#475569" }}>Appel direct</div>
                </div>
              </a>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, textDecoration: "none" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>💬</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#F8FAFC" }}>WhatsApp</div>
                  <div style={{ fontSize: 12, color: "#475569" }}>Message rapide</div>
                </div>
              </a>
              <a href={`mailto:${EMAIL}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>✉️</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#F8FAFC" }}>{EMAIL}</div>
                  <div style={{ fontSize: 12, color: "#475569" }}>Email</div>
                </div>
              </a>
            </div>

            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "28px 24px" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Informations pratiques</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <span style={{ color: AMBER, flexShrink: 0 }}>⏰</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#F8FAFC" }}>Horaires</div>
                    <div style={{ fontSize: 13, color: "#64748B" }}>{HORAIRES}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <span style={{ color: AMBER, flexShrink: 0 }}>📍</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#F8FAFC" }}>Adresse</div>
                    <div style={{ fontSize: 13, color: "#64748B" }}>{ADDRESS}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <span style={{ color: EMERALD, flexShrink: 0 }}>✓</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#F8FAFC" }}>Réponse garantie</div>
                    <div style={{ fontSize: 13, color: "#64748B" }}>Sous 24h ouvrées</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: `linear-gradient(135deg, ${AMBER}22, transparent)`, border: `1px solid ${AMBER}33`, borderRadius: 20, padding: "24px" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>💳</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC", marginBottom: 6 }}>50% remboursé</div>
              <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>
                Toutes nos prestations ouvrent droit au crédit d&apos;impôt. Une attestation fiscale vous est remise chaque année.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

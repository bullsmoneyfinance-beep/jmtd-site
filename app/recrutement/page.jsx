"use client";
import { useState } from "react";
import Link from "next/link";
import { PHONE_HREF, WHATSAPP } from "../../lib/data";

const T = "#0DA9A4";
const P = "#D4197A";
const TEXT = "#1A2D3D";
const MUTED = "#64748B";

const POSTES = [
  { id: "menage",     label: "🏠 Aide ménagère / Entretien" },
  { id: "repas",      label: "🍽️ Préparation de repas" },
  { id: "courses",    label: "🛒 Livraison de courses" },
  { id: "assistance", label: "📋 Assistance administrative" },
  { id: "rangement",  label: "🗂️ Coach en rangement" },
];

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

const PROCESS = [
  { n: "01", icon: "📝", title: "Dépôt de candidature", desc: "Remplissez ce formulaire complet. Soyez précis et honnête — c'est ce qui fait la différence." },
  { n: "02", icon: "🔍", title: "Étude du dossier", desc: "Nous analysons chaque candidature avec soin sous 48 à 72h. Les profils sérieux sont contactés en priorité." },
  { n: "03", icon: "📞", title: "Entretien téléphonique", desc: "Un premier échange pour faire connaissance, vérifier les disponibilités et répondre à vos questions." },
  { n: "04", icon: "🤝", title: "Entretien & test pratique", desc: "Rencontre en personne avec Myriam. Une mise en situation pratique permet de valider vos compétences." },
  { n: "05", icon: "🌟", title: "Intégration accompagnée", desc: "Premières interventions en binôme, formation aux standards J'MTD et accompagnement personnalisé." },
];

const VALEURS = [
  { icon: "🤫", title: "Discrétion absolue", desc: "Vous entrez dans l'intimité des foyers. La confidentialité est non négociable." },
  { icon: "⏰", title: "Ponctualité & fiabilité", desc: "Nos clients comptent sur vous. L'absence non justifiée impacte toute l'équipe." },
  { icon: "✨", title: "Souci du détail", desc: "Un travail bien fait, c'est un client satisfait qui revient et recommande." },
  { icon: "💬", title: "Communication ouverte", desc: "En cas de problème, vous prévenez. Myriam est là pour vous soutenir, pas vous juger." },
  { icon: "📈", title: "Envie de progresser", desc: "Nous formons et faisons évoluer celles qui s'investissent vraiment dans leur travail." },
  { icon: "🤝", title: "Esprit d'équipe", desc: "Chez J'MTD, on s'entraide. Chaque intervenante est respectée et valorisée." },
];

const AVANTAGES = [
  "Contrat stable (CDI ou CDD selon profil)",
  "Horaires adaptés à votre vie personnelle",
  "Formation interne continue offerte",
  "Attestation fiscale pour vos propres impôts",
  "Bonne ambiance et management bienveillant",
  "Primes de performance et de fidélité",
];

const inp = {
  width: "100%", padding: "13px 16px", borderRadius: 12,
  border: "1.5px solid rgba(13,169,164,0.2)", background: "#FAFBFC",
  color: TEXT, fontSize: 15, outline: "none", boxSizing: "border-box",
  fontFamily: "inherit", transition: "border-color 0.2s, box-shadow 0.2s",
};

const DEFAULT_FORM = {
  prenom: "", nom: "", tel: "", email: "", commune: "",
  postes: [],
  experience: "", experience_detail: "",
  transport: "", transport_detail: "",
  dispo_heures: "", dispo_jours: [],
  situation: "",
  motivation: "",
  discretion: "",
  references: "",
  formation: "",
  infos_plus: "",
  rgpd: false,
};

function Label({ children }) {
  return (
    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 7 }}>
      {children}
    </label>
  );
}

function Section({ number, title, children }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingBottom: 12, borderBottom: `2px solid ${T}18` }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${T}, ${P})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
          {number}
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: 0 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function RecrutementPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const togglePoste = id => setForm(f => ({
    ...f,
    postes: f.postes.includes(id) ? f.postes.filter(p => p !== id) : [...f.postes, id],
  }));

  const toggleJour = j => setForm(f => ({
    ...f,
    dispo_jours: f.dispo_jours.includes(j) ? f.dispo_jours.filter(d => d !== j) : [...f.dispo_jours, j],
  }));

  const validate = () => {
    const e = {};
    if (!form.prenom.trim())    e.prenom = true;
    if (!form.nom.trim())       e.nom = true;
    if (!form.tel.trim())       e.tel = true;
    if (!form.commune.trim())   e.commune = true;
    if (form.postes.length === 0) e.postes = true;
    if (!form.experience)       e.experience = true;
    if (!form.transport)        e.transport = true;
    if (!form.dispo_heures)     e.dispo_heures = true;
    if (form.dispo_jours.length === 0) e.dispo_jours = true;
    if (!form.situation)        e.situation = true;
    if (form.motivation.trim().length < 50) e.motivation = true;
    if (form.discretion.trim().length < 30) e.discretion = true;
    if (!form.rgpd)             e.rgpd = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async e => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setLoading(true);
    try {
      await fetch("/api/recrutement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch { /* silently fail */ }
    setLoading(false);
    setSent(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const errStyle = key => errors[key] ? { borderColor: "#EF4444", boxShadow: "0 0 0 3px rgba(239,68,68,0.12)" } : {};

  return (
    <>
      <style>{`
        @keyframes floatOrb { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        .inp-focus:focus { border-color: ${T} !important; box-shadow: 0 0 0 3px rgba(13,169,164,0.15) !important; }
        .poste-check:hover { border-color: ${T} !important; background: rgba(13,169,164,0.06) !important; }
        .jour-btn:hover { border-color: ${T} !important; color: ${T} !important; }
        @media (max-width: 768px) {
          .recru-hero { padding: 40px 16px 32px !important; }
          .recru-layout { grid-template-columns: 1fr !important; }
          .recru-process { grid-template-columns: 1fr !important; }
          .recru-valeurs { grid-template-columns: 1fr 1fr !important; }
          .recru-form-2col { grid-template-columns: 1fr !important; gap: 12px !important; }
          .recru-avantages { grid-template-columns: 1fr !important; }
          .recru-section { padding: 32px 16px 80px !important; }
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="recru-hero" style={{ background: `linear-gradient(135deg, ${TEXT} 0%, #0e2235 100%)`, padding: "80px 24px 72px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, right: "5%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${T}18, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: "3%", width: 380, height: 380, borderRadius: "50%", background: `radial-gradient(circle, ${P}12, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 30, padding: "6px 18px", marginBottom: 24 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 1.5 }}>Recrutement J'MTD</span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 700, color: "#F8FAFC", lineHeight: 1.15, marginBottom: 20 }}>
            Rejoignez une équipe qui fait{" "}
            <span style={{ background: `linear-gradient(135deg, ${T}, ${P})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              la différence
            </span>{" "}en Martinique
          </h1>
          <p style={{ fontSize: 17, color: "rgba(248,250,252,0.7)", lineHeight: 1.8, marginBottom: 40, maxWidth: 580, margin: "0 auto 40px" }}>
            J'MTD recherche des personnes <strong style={{ color: "#F8FAFC" }}>sérieuses, discrètes et motivées</strong> pour accompagner nos clients à domicile. Si vous avez l'envie de bien faire, nous avons la place pour vous.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#formulaire"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 32px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 800, fontSize: 15, textDecoration: "none", boxShadow: `0 8px 32px ${T}50` }}>
              Postuler maintenant ↓
            </a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 24px", borderRadius: 30, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#F8FAFC", fontWeight: 600, fontSize: 15, textDecoration: "none" }}>
              💬 Question par WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── Processus ── */}
      <section style={{ background: "#F8FAFB", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 700, color: TEXT, marginBottom: 12 }}>
              Notre processus de recrutement
            </h2>
            <p style={{ fontSize: 15, color: MUTED, maxWidth: 520, margin: "0 auto" }}>5 étapes transparentes, de la candidature à l'intégration.</p>
          </div>

          <div className="recru-process" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
            {PROCESS.map((step, i) => (
              <div key={i} style={{ textAlign: "center", position: "relative" }}>
                {i < PROCESS.length - 1 && (
                  <div style={{ position: "absolute", top: 24, left: "60%", width: "80%", height: 2, background: `linear-gradient(90deg, ${T}40, transparent)` }} className="hide-mobile" />
                )}
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg, ${T}, ${P})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: "#fff", fontWeight: 800, fontSize: 14, boxShadow: `0 4px 16px ${T}30` }}>
                  {step.n}
                </div>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{step.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 6 }}>{step.title}</div>
                <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ce qu'on recherche + avantages ── */}
      <section style={{ background: "#fff", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="recru-layout" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}>

            <div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 700, color: TEXT, marginBottom: 8 }}>
                Ce que nous recherchons
              </h2>
              <p style={{ fontSize: 14, color: MUTED, marginBottom: 32, lineHeight: 1.7 }}>
                Pas forcément de diplôme, mais des qualités humaines réelles. Voici ce qui fait la différence chez J'MTD.
              </p>
              <div className="recru-valeurs" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {VALEURS.map((v, i) => (
                  <div key={i} style={{ padding: "18px 16px", background: "#F8FAFB", borderRadius: 16, border: `1px solid rgba(13,169,164,0.1)` }}>
                    <div style={{ fontSize: 26, marginBottom: 8 }}>{v.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{v.title}</div>
                    <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.6 }}>{v.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 700, color: TEXT, marginBottom: 8 }}>
                Ce que nous offrons
              </h2>
              <p style={{ fontSize: 14, color: MUTED, marginBottom: 32, lineHeight: 1.7 }}>
                Travailler avec J'MTD, c'est rejoindre une structure qui prend soin de ses équipes autant que de ses clients.
              </p>
              <div className="recru-avantages" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 32 }}>
                {AVANTAGES.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ color: T, fontWeight: 800, fontSize: 16, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: 13, color: TEXT, lineHeight: 1.5 }}>{a}</span>
                  </div>
                ))}
              </div>

              {/* Témoignage fictif / encouragement */}
              <div style={{ background: `linear-gradient(135deg, ${T}10, ${P}06)`, border: `1px solid ${T}20`, borderRadius: 18, padding: "22px 20px" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>💬</div>
                <p style={{ fontSize: 14, color: TEXT, lineHeight: 1.8, fontStyle: "italic", margin: 0, marginBottom: 12 }}>
                  "Chez J'MTD, on n'est pas un numéro. Myriam est à l'écoute, et les clients sont vraiment reconnaissants de notre travail."
                </p>
                <div style={{ fontSize: 12, color: MUTED, fontWeight: 600 }}>— Fabienne R., Coach en rangement chez J'MTD</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Formulaire ── */}
      <section id="formulaire" className="recru-section" style={{ background: "#F8FAFB", padding: "64px 24px 80px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 700, color: TEXT, marginBottom: 12 }}>
              Formulaire de candidature
            </h2>
            <p style={{ fontSize: 15, color: MUTED, maxWidth: 520, margin: "0 auto" }}>
              Prenez le temps de répondre soigneusement à chaque question. C'est votre première impression.
            </p>
          </div>

          {/* Erreurs */}
          {Object.keys(errors).length > 0 && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 16, padding: "16px 20px", marginBottom: 28, display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 22 }}>⚠️</span>
              <div style={{ fontSize: 14, color: "#EF4444", fontWeight: 600 }}>
                Certains champs sont incomplets ou trop courts. Vérifiez les zones en rouge.
              </div>
            </div>
          )}

          {sent ? (
            <div style={{ textAlign: "center", padding: "64px 32px", background: "#fff", borderRadius: 24, border: `1px solid ${T}20`, boxShadow: `0 8px 40px ${T}08` }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: TEXT, marginBottom: 12 }}>Candidature envoyée !</h3>
              <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.8, maxWidth: 440, margin: "0 auto 28px" }}>
                Merci <strong>{form.prenom}</strong> ! Votre candidature a bien été reçue. Nous l'étudions avec soin et vous recontactons sous 48 à 72h si votre profil correspond.
              </p>
              <div style={{ fontSize: 13, color: MUTED, background: `${T}08`, border: `1px solid ${T}20`, borderRadius: 12, padding: "12px 20px", display: "inline-block" }}>
                En attendant, n'hésitez pas à nous contacter par WhatsApp pour toute question.
              </div>
            </div>
          ) : (
            <form onSubmit={submit} style={{ background: "#fff", borderRadius: 24, border: `1px solid rgba(13,169,164,0.12)`, padding: "40px 36px", boxShadow: `0 4px 32px ${T}08` }}>

              {/* ── 1. Infos personnelles ── */}
              <Section number="1" title="Vos informations personnelles">
                <div className="recru-form-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
                  <div>
                    <Label>Prénom *</Label>
                    <input className="inp-focus" style={{ ...inp, ...errStyle("prenom") }} placeholder="Marie" value={form.prenom} onChange={set("prenom")} required />
                  </div>
                  <div>
                    <Label>Nom *</Label>
                    <input className="inp-focus" style={{ ...inp, ...errStyle("nom") }} placeholder="Dupont" value={form.nom} onChange={set("nom")} required />
                  </div>
                </div>
                <div className="recru-form-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
                  <div>
                    <Label>Téléphone *</Label>
                    <input className="inp-focus" style={{ ...inp, ...errStyle("tel") }} placeholder="05 96 XX XX XX" type="tel" value={form.tel} onChange={set("tel")} required />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <input className="inp-focus" style={inp} placeholder="votre@email.fr" type="email" value={form.email} onChange={set("email")} />
                  </div>
                </div>
                <div>
                  <Label>Commune de résidence *</Label>
                  <input className="inp-focus" style={{ ...inp, ...errStyle("commune") }} placeholder="Rivière-Salée, Fort-de-France, Le Diamant…" value={form.commune} onChange={set("commune")} required />
                </div>
              </Section>

              {/* ── 2. Profil ── */}
              <Section number="2" title="Votre profil professionnel">
                <div style={{ marginBottom: 20 }}>
                  <Label>Poste(s) souhaité(s) * — plusieurs choix possibles</Label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, ...(errors.postes ? { outline: "2px solid #EF4444", borderRadius: 12, padding: 8 } : {}) }}>
                    {POSTES.map(p => (
                      <label key={p.id} className="poste-check"
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${form.postes.includes(p.id) ? T : "rgba(13,169,164,0.2)"}`, background: form.postes.includes(p.id) ? `${T}08` : "transparent", cursor: "pointer", transition: "all 0.15s", userSelect: "none" }}>
                        <input type="checkbox" checked={form.postes.includes(p.id)} onChange={() => togglePoste(p.id)}
                          style={{ accentColor: T, width: 18, height: 18, cursor: "pointer", flexShrink: 0 }} />
                        <span style={{ fontSize: 14, fontWeight: form.postes.includes(p.id) ? 700 : 500, color: form.postes.includes(p.id) ? T : TEXT }}>{p.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <Label>Avez-vous une expérience dans les services à la personne ? *</Label>
                  <select className="inp-focus" style={{ ...inp, ...errStyle("experience") }} value={form.experience} onChange={set("experience")} required>
                    <option value="">Sélectionner…</option>
                    <option value="aucune">Non, c'est ma première expérience</option>
                    <option value="moins1">Oui, moins d'1 an</option>
                    <option value="1-3">Oui, 1 à 3 ans</option>
                    <option value="3-5">Oui, 3 à 5 ans</option>
                    <option value="plus5">Oui, plus de 5 ans</option>
                  </select>
                </div>

                {form.experience && form.experience !== "aucune" && (
                  <div style={{ marginBottom: 14 }}>
                    <Label>Décrivez brièvement votre expérience</Label>
                    <textarea className="inp-focus" style={{ ...inp, resize: "vertical", minHeight: 80 }}
                      placeholder="Type d'employeur, missions principales, ce que vous en avez appris…"
                      value={form.experience_detail} onChange={set("experience_detail")} rows={3} />
                  </div>
                )}

                <div style={{ marginBottom: 14 }}>
                  <Label>Avez-vous un moyen de transport personnel ? *</Label>
                  <select className="inp-focus" style={{ ...inp, ...errStyle("transport") }} value={form.transport} onChange={set("transport")} required>
                    <option value="">Sélectionner…</option>
                    <option value="voiture">Oui, voiture</option>
                    <option value="scooter">Oui, scooter / moto</option>
                    <option value="velo">Oui, vélo / trottinette</option>
                    <option value="non">Non, je n'en ai pas</option>
                  </select>
                </div>

                {form.transport === "non" && (
                  <div style={{ marginBottom: 14, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#EF4444" }}>
                    ⚠️ Un moyen de transport est fortement recommandé pour intervenir chez nos clients en Martinique. Précisez comment vous comptez vous déplacer.
                    <textarea className="inp-focus" style={{ ...inp, resize: "vertical", minHeight: 60, marginTop: 10 }}
                      placeholder="Comment vous déplacez-vous ?" value={form.transport_detail} onChange={set("transport_detail")} rows={2} />
                  </div>
                )}

                <div style={{ marginBottom: 14 }}>
                  <Label>Nombre d'heures disponibles par semaine *</Label>
                  <select className="inp-focus" style={{ ...inp, ...errStyle("dispo_heures") }} value={form.dispo_heures} onChange={set("dispo_heures")} required>
                    <option value="">Sélectionner…</option>
                    <option value="moins10">Moins de 10h/semaine</option>
                    <option value="10-20">10 à 20h/semaine</option>
                    <option value="20-30">20 à 30h/semaine</option>
                    <option value="30-35">30 à 35h/semaine</option>
                    <option value="temps-plein">Temps plein (35h+)</option>
                  </select>
                </div>

                <div>
                  <Label>Jours disponibles * — plusieurs choix possibles</Label>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", ...(errors.dispo_jours ? { outline: "2px solid #EF4444", borderRadius: 8, padding: 4 } : {}) }}>
                    {JOURS.map(j => (
                      <button key={j} type="button" className="jour-btn"
                        onClick={() => toggleJour(j)}
                        style={{ padding: "9px 18px", borderRadius: 30, border: `1.5px solid ${form.dispo_jours.includes(j) ? T : "rgba(13,169,164,0.22)"}`, background: form.dispo_jours.includes(j) ? `${T}14` : "transparent", color: form.dispo_jours.includes(j) ? T : MUTED, fontWeight: form.dispo_jours.includes(j) ? 700 : 500, fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}>
                        {j}
                      </button>
                    ))}
                  </div>
                </div>
              </Section>

              {/* ── 3. Motivations ── */}
              <Section number="3" title="Vos motivations — questions importantes">
                <div style={{ background: `${T}06`, border: `1px solid ${T}18`, borderRadius: 12, padding: "14px 18px", marginBottom: 20, fontSize: 13, color: MUTED, lineHeight: 1.7 }}>
                  💡 Cette section est la plus importante du formulaire. Prenez le temps d'y répondre sincèrement. Les réponses trop courtes ou génériques ne seront pas retenues.
                </div>

                <div style={{ marginBottom: 20 }}>
                  <Label>Votre situation actuelle *</Label>
                  <select className="inp-focus" style={{ ...inp, ...errStyle("situation") }} value={form.situation} onChange={set("situation")} required>
                    <option value="">Sélectionner…</option>
                    <option value="chomage">En recherche d'emploi (chômage)</option>
                    <option value="partiel">En poste à temps partiel, je cherche un complément</option>
                    <option value="reconversion">En reconversion professionnelle</option>
                    <option value="retraite">Retraité(e), je souhaite un emploi léger</option>
                    <option value="autre">Autre situation</option>
                  </select>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <Label>Pourquoi souhaitez-vous rejoindre J'MTD ? * (minimum 50 caractères)</Label>
                  <textarea className="inp-focus" style={{ ...inp, resize: "vertical", minHeight: 110, ...errStyle("motivation") }}
                    placeholder="Expliquez ce qui vous attire dans ce métier, pourquoi J'MTD spécifiquement, vos objectifs professionnels…"
                    value={form.motivation} onChange={set("motivation")} rows={4} />
                  <div style={{ fontSize: 11, color: form.motivation.length >= 50 ? T : "#94A3B8", marginTop: 4, textAlign: "right" }}>
                    {form.motivation.length} / 50 caractères minimum
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <Label>Qu'est-ce que la discrétion représente pour vous dans ce métier ? * (minimum 30 caractères)</Label>
                  <div style={{ fontSize: 12, color: MUTED, marginBottom: 8, lineHeight: 1.6 }}>
                    Nos intervenantes entrent dans la vie privée de nos clients. Nous avons besoin de savoir comment vous concevez la confidentialité au quotidien.
                  </div>
                  <textarea className="inp-focus" style={{ ...inp, resize: "vertical", minHeight: 100, ...errStyle("discretion") }}
                    placeholder="Expliquez concrètement comment vous gérez la discrétion dans un contexte professionnel à domicile…"
                    value={form.discretion} onChange={set("discretion")} rows={3} />
                  <div style={{ fontSize: 11, color: form.discretion.length >= 30 ? T : "#94A3B8", marginTop: 4, textAlign: "right" }}>
                    {form.discretion.length} / 30 caractères minimum
                  </div>
                </div>
              </Section>

              {/* ── 4. Infos complémentaires ── */}
              <Section number="4" title="Informations complémentaires">
                <div style={{ marginBottom: 14 }}>
                  <Label>Avez-vous des références professionnelles ?</Label>
                  <select className="inp-focus" style={inp} value={form.references} onChange={set("references")}>
                    <option value="">Sélectionner…</option>
                    <option value="oui">Oui, je peux fournir des références</option>
                    <option value="non">Non, pas pour le moment</option>
                    <option value="bientot">Je peux en obtenir si nécessaire</option>
                  </select>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <Label>Êtes-vous prêt(e) à suivre notre formation interne (1 à 2 jours) ?</Label>
                  <select className="inp-focus" style={inp} value={form.formation} onChange={set("formation")}>
                    <option value="">Sélectionner…</option>
                    <option value="oui">Oui, tout à fait</option>
                    <option value="avec_contrainte">Oui, avec certaines contraintes horaires</option>
                    <option value="non">Non, j'ai déjà toutes les compétences</option>
                  </select>
                </div>

                <div>
                  <Label>Informations supplémentaires (optionnel)</Label>
                  <textarea className="inp-focus" style={{ ...inp, resize: "vertical", minHeight: 80 }}
                    placeholder="Toute information que vous jugez utile à partager : contraintes spécifiques, compétences particulières, questions…"
                    value={form.infos_plus} onChange={set("infos_plus")} rows={3} />
                </div>
              </Section>

              {/* ── RGPD & Submit ── */}
              <div style={{ borderTop: `1px solid rgba(13,169,164,0.12)`, paddingTop: 24, marginBottom: 24 }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", padding: "14px 16px", background: `${T}06`, border: `1.5px solid ${errors.rgpd ? "#EF4444" : `${T}20`}`, borderRadius: 12 }}>
                  <input type="checkbox" checked={form.rgpd} onChange={e => setForm(f => ({ ...f, rgpd: e.target.checked }))}
                    style={{ marginTop: 3, accentColor: T, flexShrink: 0, width: 18, height: 18 }} />
                  <span style={{ fontSize: 13, color: MUTED, lineHeight: 1.7 }}>
                    J'accepte que J'MTD conserve mes données dans le cadre de ma candidature. Ces données seront utilisées uniquement pour le processus de recrutement et ne seront pas transmises à des tiers.{" "}
                    <Link href="/politique-confidentialite" style={{ color: T }}>Politique de confidentialité</Link>. *
                  </span>
                </label>
              </div>

              <button type="submit" disabled={loading}
                style={{ width: "100%", padding: "18px", borderRadius: 30, fontSize: 16, fontWeight: 800, color: "#fff", border: "none", cursor: loading ? "wait" : "pointer", background: `linear-gradient(135deg, ${T}, ${P})`, boxShadow: `0 6px 28px ${T}44`, transition: "transform 0.2s, box-shadow 0.2s", letterSpacing: 0.3 }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 10px 36px ${T}55`; }}}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 6px 28px ${T}44`; }}>
                {loading ? "⏳ Envoi en cours…" : "Envoyer ma candidature →"}
              </button>

              <p style={{ fontSize: 12, color: "#94A3B8", textAlign: "center", marginTop: 14, lineHeight: 1.7 }}>
                * Champs obligatoires · Réponse sous 48 à 72h ouvrées · Candidature traitée confidentiellement
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

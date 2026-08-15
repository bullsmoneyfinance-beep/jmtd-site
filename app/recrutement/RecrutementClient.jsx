"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { PHONE, PHONE_HREF, WHATSAPP, TEAL_TEXT } from "../../lib/data";
import { load } from "../../lib/storage";
import { DEFAULT_OFFERS } from "./offersData";

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

/* Longueurs minimales des réponses rédigées — calées sur le palier "bon" du scoring
   (lib/scoring.js : motivation 200/100/50, discrétion 100/60/30). Auparavant le
   formulaire acceptait le palier le plus faible, d'où des réponses trop courtes. */
const MIN_MOTIVATION = 150;
const MIN_DISCRETION = 80;
const MIN_LONG  = 80;   // mises en situation & savoir-être : on attend un vrai raisonnement
const MIN_COURT = 40;   // questions factuelles (parcours, types de lieux…)

const DEFAULT_FORM = {
  // § 1 — Identification
  prenom: "", nom: "", tel: "", email: "", commune: "",
  secteurs: "",
  postes: [],
  // § 2 — Parcours et expérience professionnelle
  experience: "",
  parcours: "",              // Q1
  exp_sap: "",               // Q2
  types_lieux: "",           // Q3
  taches_maitrisees: "",     // Q4
  exp_personnes_fragiles: "",// Q5
  certifications: "",        // Q6
  // § 3 — Compétences techniques (auto-évaluation)
  competences: {},
  // § 4 — Mises en situation
  situ_temps: "",            // Q7
  situ_produit: "",          // Q8
  situ_casse: "",            // Q9
  situ_hors_consignes: "",   // Q10
  situ_alerte: "",           // Q11
  // § 5 — Savoir-être et relation client
  travail_bien_fait: "",     // Q12
  qualites: "",              // Q13
  reclamation: "",           // Q14
  discretion: "",            // Q15
  // § 6 — Disponibilités et conditions d'exercice
  dispo_heures: "", dispo_jours: [],
  plages_horaires: "",
  mobilite: "", permis: "", vehicule: "",
  prise_poste: "",
  // § 7 — Motivation
  motivation: "",            // Q16
  interet_metier: "",        // Q17
  attentes: "",              // Q18
  // Divers
  situation: "",
  references: "",
  formation: "",
  infos_plus: "",
  offreId: "", offreTitre: "",
  rgpd: false,
};

/* Parcours calqué sur le questionnaire de recrutement J'MTD (aide ménagère) */
const STEPS = [
  { n: 1, label: "Coordonnées" },
  { n: 2, label: "Parcours" },
  { n: 3, label: "Compétences" },
  { n: 4, label: "Situations" },
  { n: 5, label: "Savoir-être" },
  { n: 6, label: "Disponibilités" },
  { n: 7, label: "Motivation" },
  { n: 8, label: "Finalisation" },
];

/* § 3 du questionnaire — grille d'auto-évaluation des compétences techniques */
const COMPETENCES = [
  { id: "surfaces",     label: "Dépoussiérage et nettoyage des surfaces" },
  { id: "sols",         label: "Nettoyage des sols" },
  { id: "sanitaires",   label: "Nettoyage des sanitaires et de la cuisine" },
  { id: "linge",        label: "Entretien du linge / repassage" },
  { id: "materiel",     label: "Organisation des produits et du matériel" },
  { id: "consignes",    label: "Respect des consignes d'utilisation des produits" },
  { id: "gestion_temps",label: "Gestion du temps et priorisation des tâches" },
  { id: "autonomie",    label: "Capacité à travailler de manière autonome" },
];
const NIVEAUX = [
  { id: "maitrisee",     label: "Maîtrisée",     color: "#16A34A" },
  { id: "a_renforcer",   label: "À renforcer",   color: "#F59E0B" },
  { id: "non_pratiquee", label: "Non pratiquée", color: "#94A3B8" },
];

function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} style={{ display: "block", fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 7 }}>
      {children}
    </label>
  );
}

function StepBar({ step }) {
  const cur = STEPS.find(s => s.n === step);
  return (
    <>
      {/* Mobile : progression compacte (8 pastilles ne tiennent pas sur 375px) */}
      <div className="step-bar-compact" style={{ display: "none", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: TEXT }}>{cur?.label}</span>
          <span style={{ fontSize: 12, color: MUTED, fontWeight: 600 }}>Étape {step} / {STEPS.length}</span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: "#E2E8F0", overflow: "hidden" }}>
          <div style={{ width: `${(step / STEPS.length) * 100}%`, height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${T}, ${P})`, transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)" }} />
        </div>
      </div>

      <div className="step-bar-full" style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28, padding: "4px 0" }}>
      {STEPS.map((s, i) => (
        <div key={s.n} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div className="step-bar-circle" style={{
              width: 42, height: 42, borderRadius: "50%",
              background: step > s.n ? T : step === s.n ? `linear-gradient(135deg, ${T}, ${P})` : "#F1F5F9",
              border: step >= s.n ? "none" : "1.5px solid #E2E8F0",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: step >= s.n ? "#fff" : "#94A3B8", fontWeight: 800, fontSize: 15,
              boxShadow: step === s.n ? `0 4px 18px rgba(13,169,164,0.32)` : "none",
              transition: "all 0.35s ease", flexShrink: 0,
            }}>
              {step > s.n ? "✓" : s.n}
            </div>
            <span className="step-bar-label" style={{ fontSize: 11, fontWeight: step === s.n ? 700 : 400, color: step === s.n ? T : "#94A3B8", whiteSpace: "nowrap", transition: "color 0.3s" }}>
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="step-bar-connector" style={{ width: 26, height: 2, margin: "0 5px", marginBottom: 20, background: step > i + 1 ? T : "#E2E8F0", transition: "background 0.4s ease", flexShrink: 0 }} />
          )}
        </div>
      ))}
      </div>
    </>
  );
}

/* Question ouverte avec compteur de caractères — mutualisée (15 questions du questionnaire) */
function TextQ({ id, num, label, hint, value, onChange, min = 0, required, placeholder, rows = 3, invalid }) {
  const len = (value || "").length;
  return (
    <div style={{ marginBottom: 20 }}>
      <Label htmlFor={id}>
        {num ? `${num}. ` : ""}{label}{(min > 0 || required) ? " *" : ""}
      </Label>
      {hint && <div style={{ fontSize: 12, color: MUTED, marginBottom: 8, lineHeight: 1.6 }}>{hint}</div>}
      <textarea id={id} className="inp-focus" rows={rows}
        style={{ ...inp, resize: "vertical", minHeight: rows * 26 + 30, ...(invalid ? { borderColor: "#EF4444", boxShadow: "0 0 0 3px rgba(239,68,68,0.12)" } : {}) }}
        placeholder={placeholder} value={value} onChange={onChange} />
      {min > 0 && (
        <div style={{ fontSize: 11, color: len >= min ? T : "#94A3B8", marginTop: 6, textAlign: "right", fontWeight: 600, transition: "color 0.2s" }}>
          {len} / {min} caractères minimum
        </div>
      )}
    </div>
  );
}

/* Choix Oui / Non compact (§ 6 du questionnaire) */
function YesNo({ label, value, onChange, invalid }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <Label>{label} *</Label>
      <div role="group" style={{ display: "flex", gap: 10, ...(invalid ? { outline: "2px solid #EF4444", borderRadius: 8, padding: 4 } : {}) }}>
        {[{ v: "oui", l: "Oui" }, { v: "non", l: "Non" }].map(o => (
          <button key={o.v} type="button" onClick={() => onChange(o.v)} aria-pressed={value === o.v}
            style={{ flex: 1, padding: "11px 18px", borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: value === o.v ? 700 : 500, transition: "all 0.15s",
              border: `1.5px solid ${value === o.v ? T : "rgba(13,169,164,0.22)"}`,
              background: value === o.v ? `${T}12` : "transparent",
              color: value === o.v ? T : MUTED }}>
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: `2px solid ${T}15` }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: TEXT, margin: 0, marginBottom: subtitle ? 5 : 0 }}>{title}</h3>
      {subtitle && <p style={{ fontSize: 13, color: MUTED, margin: 0, lineHeight: 1.6, marginTop: 4 }}>{subtitle}</p>}
    </div>
  );
}

export default function RecrutementPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [step, setStep] = useState(1);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [offers, setOffers] = useState(DEFAULT_OFFERS);

  useEffect(() => {
    load("jmtd_offers", DEFAULT_OFFERS).then(list => { if (Array.isArray(list)) setOffers(list); });
  }, []);
  const activeOffers = offers.filter(o => o.statut !== "pourvue");

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const togglePoste = id => setForm(f => ({
    ...f,
    postes: f.postes.includes(id) ? f.postes.filter(p => p !== id) : [...f.postes, id],
  }));

  const toggleJour = j => setForm(f => ({
    ...f,
    dispo_jours: f.dispo_jours.includes(j) ? f.dispo_jours.filter(d => d !== j) : [...f.dispo_jours, j],
  }));

  const validateStep = s => {
    const e = {};
    const req    = k => { if (!String(form[k] || "").trim()) e[k] = true; };
    const reqLen = (k, min) => { if (String(form[k] || "").trim().length < min) e[k] = true; };

    if (s === 1) {
      ["prenom", "nom", "tel", "commune", "secteurs"].forEach(req);
      if (form.postes.length === 0) e.postes = true;
    }
    if (s === 2) {
      req("experience");
      reqLen("parcours", MIN_COURT);
      ["exp_sap", "types_lieux", "exp_personnes_fragiles"].forEach(req);
      reqLen("taches_maitrisees", MIN_COURT);
    }
    if (s === 3) {
      if (COMPETENCES.some(c => !form.competences[c.id])) e.competences = true;
    }
    if (s === 4) {
      ["situ_temps", "situ_produit", "situ_casse", "situ_hors_consignes", "situ_alerte"].forEach(k => reqLen(k, MIN_LONG));
    }
    if (s === 5) {
      ["travail_bien_fait", "qualites", "reclamation"].forEach(k => reqLen(k, MIN_LONG));
      reqLen("discretion", MIN_DISCRETION);
    }
    if (s === 6) {
      if (form.dispo_jours.length === 0) e.dispo_jours = true;
      ["plages_horaires", "dispo_heures", "mobilite", "permis", "vehicule", "prise_poste"].forEach(req);
    }
    if (s === 7) {
      reqLen("motivation", MIN_MOTIVATION);
      reqLen("interet_metier", MIN_LONG);
      reqLen("attentes", MIN_LONG);
    }
    if (s === 8) {
      if (!form.rgpd) e.rgpd = true;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const setCompetence = (id, niveau) => setForm(f => ({ ...f, competences: { ...f.competences, [id]: niveau } }));

  const scrollToForm = () => {
    const el = document.getElementById("formulaire");
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
  };

  const postulerOffre = (offre) => {
    setForm(f => ({
      ...f,
      offreId: offre.id,
      offreTitre: offre.titre,
      postes: offre.poste && !f.postes.includes(offre.poste) ? [...f.postes, offre.poste] : f.postes,
    }));
    scrollToForm();
  };

  const goNext = () => {
    if (validateStep(step)) {
      setErrors({});
      setStep(s => s + 1);
      scrollToForm();
    }
  };

  const goPrev = () => {
    setErrors({});
    setStep(s => s - 1);
    scrollToForm();
  };

  const submit = async e => {
    e.preventDefault();
    if (!validateStep(STEPS.length)) return;
    setLoading(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/recrutement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("bad-status");
      setSent(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError(`Envoi impossible pour le moment. Réessayez, ou contactez-nous directement au ${PHONE}.`);
    } finally {
      setLoading(false);
    }
  };

  const errStyle = key => errors[key] ? { borderColor: "#EF4444", boxShadow: "0 0 0 3px rgba(239,68,68,0.12)" } : {};

  return (
    <>
      <style>{`
        @keyframes floatOrb { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes stepIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
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
          .step-bar-label { display: none !important; }
        }
        /* 8 étapes : pastilles en desktop, progression compacte en dessous */
        @media (max-width: 900px) {
          .step-bar-full { display: none !important; }
          .step-bar-compact { display: block !important; }
        }
        /* Grille de compétences : empilée sur mobile */
        .comp-row { display: grid; grid-template-columns: 1fr auto; gap: 10px; align-items: center; }
        @media (max-width: 620px) {
          .comp-row { grid-template-columns: 1fr; gap: 8px; }
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="recru-hero" style={{ background: `linear-gradient(135deg, ${TEXT} 0%, #0e2235 100%)`, padding: "80px 24px 72px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, right: "5%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${T}18, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: "3%", width: 380, height: 380, borderRadius: "50%", background: `radial-gradient(circle, ${P}12, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 30, padding: "6px 18px", marginBottom: 24 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: TEAL_TEXT, textTransform: "uppercase", letterSpacing: 1.5 }}>Recrutement J&apos;MTD</span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 700, color: "#F8FAFC", lineHeight: 1.15, marginBottom: 20 }}>
            Rejoignez une équipe qui fait{" "}
            <span style={{ background: `linear-gradient(135deg, ${T}, ${P})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              la différence
            </span>{" "}en Martinique
          </h1>
          <p style={{ fontSize: 17, color: "rgba(248,250,252,0.7)", lineHeight: 1.8, marginBottom: 40, maxWidth: 580, margin: "0 auto 40px" }}>
            J&apos;MTD recherche des personnes <strong style={{ color: "#F8FAFC" }}>sérieuses, discrètes et motivées</strong> pour accompagner nos clients à domicile. Si vous avez l&apos;envie de bien faire, nous avons la place pour vous.
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

      {/* ── Offres en cours ── */}
      {activeOffers.length > 0 && (
        <section id="offres" style={{ background: "linear-gradient(180deg, #fff 0%, #F8FAFB 100%)", padding: "64px 24px 44px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${P}0e`, border: `1px solid ${P}28`, borderRadius: 30, padding: "6px 16px", marginBottom: 14 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#E23B3B", flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 800, color: P, textTransform: "uppercase", letterSpacing: 1.2 }}>{activeOffers.length} poste{activeOffers.length > 1 ? "s" : ""} à pourvoir</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 700, color: TEXT, marginBottom: 8 }}>Nos offres du moment</h2>
              <p style={{ fontSize: 15, color: MUTED, maxWidth: 520, margin: "0 auto" }}>Postulez directement à l&apos;une de nos offres — votre candidature nous parvient aussitôt.</p>
            </div>

            <div style={{ display: "grid", gap: 20 }}>
              {activeOffers.map(o => (
                <div key={o.id} style={{ background: "#fff", borderRadius: 22, border: "1px solid rgba(13,169,164,0.14)", borderLeft: `4px solid ${o.urgent ? "#E23B3B" : T}`, boxShadow: "0 8px 34px rgba(13,27,42,0.07)", padding: "28px 26px", position: "relative" }}>
                  {o.urgent && (
                    <span style={{ position: "absolute", top: 20, right: 22, display: "inline-flex", alignItems: "center", gap: 5, background: "#E23B3B", color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 0.6 }}>⚡ Urgent</span>
                  )}
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: TEXT, marginBottom: 12, paddingRight: 92, lineHeight: 1.3 }}>{o.titre}</h3>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                    {[["📄", o.contrat], ["📍", o.lieu], ["🕒", o.horaires], ["📅", o.prisePoste]].filter(([, v]) => v).map(([ic, v]) => (
                      <span key={v} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: "#334155", background: "#F1F5F9", borderRadius: 20, padding: "6px 12px" }}>{ic} {v}</span>
                    ))}
                  </div>

                  <p style={{ fontSize: 14.5, color: "#475569", lineHeight: 1.75, marginBottom: o.profil?.length ? 16 : 20 }}>{o.description}</p>

                  {o.profil?.length > 0 && (
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: TEAL_TEXT, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>Profil recherché</div>
                      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 7 }}>
                        {o.profil.map(p => (
                          <li key={p} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13.5, color: "#334155", lineHeight: 1.55 }}>
                            <span style={{ color: T, fontWeight: 800, flexShrink: 0 }}>✓</span> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {o.evolution && (
                    <div style={{ background: `${T}07`, border: `1px solid ${T}18`, borderRadius: 12, padding: "12px 15px", marginBottom: 20, fontSize: 13, color: "#475569", lineHeight: 1.65 }}>
                      <strong style={{ color: TEXT }}>Évolution :</strong> {o.evolution}
                    </div>
                  )}

                  <button onClick={() => postulerOffre(o)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 800, fontSize: 14.5, border: "none", cursor: "pointer", boxShadow: `0 6px 22px ${T}44` }}>
                    Postuler à cette offre →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Processus ── */}
      <section style={{ background: "#F8FAFB", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 700, color: TEXT, marginBottom: 12 }}>
              Notre processus de recrutement
            </h2>
            <p style={{ fontSize: 15, color: MUTED, maxWidth: 520, margin: "0 auto" }}>5 étapes transparentes, de la candidature à l&apos;intégration.</p>
          </div>

          <div className="recru-process" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
            {PROCESS.map((proc, i) => (
              <div key={i} style={{ textAlign: "center", position: "relative" }}>
                {i < PROCESS.length - 1 && (
                  <div style={{ position: "absolute", top: 24, left: "60%", width: "80%", height: 2, background: `linear-gradient(90deg, ${T}40, transparent)` }} className="hide-mobile" />
                )}
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg, ${T}, ${P})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: "#fff", fontWeight: 800, fontSize: 14, boxShadow: `0 4px 16px ${T}30` }}>
                  {proc.n}
                </div>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{proc.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 6 }}>{proc.title}</div>
                <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.6 }}>{proc.desc}</div>
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
                Pas forcément de diplôme, mais des qualités humaines réelles. Voici ce qui fait la différence chez J&apos;MTD.
              </p>
              <div className="recru-valeurs" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {VALEURS.map((v, i) => (
                  <div key={i} style={{ padding: "18px 16px", background: "#F8FAFB", borderRadius: 16, border: `1px solid rgba(13,169,164,0.1)`, transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${T}30`; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 6px 24px ${T}10`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(13,169,164,0.1)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
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
                Travailler avec J&apos;MTD, c&apos;est rejoindre une structure qui prend soin de ses équipes autant que de ses clients.
              </p>
              <div className="recru-avantages" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 32 }}>
                {AVANTAGES.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ color: TEAL_TEXT, fontWeight: 800, fontSize: 16, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: 13, color: TEXT, lineHeight: 1.5 }}>{a}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: `linear-gradient(135deg, ${T}10, ${P}06)`, border: `1px solid ${T}20`, borderRadius: 18, padding: "22px 20px" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>💬</div>
                <p style={{ fontSize: 14, color: TEXT, lineHeight: 1.8, fontStyle: "italic", margin: 0, marginBottom: 12 }}>
                  &ldquo;Chez J&apos;MTD, on n&apos;est pas un numéro. Myriam est à l&apos;écoute, et les clients sont vraiment reconnaissants de notre travail.&rdquo;
                </p>
                <div style={{ fontSize: 12, color: MUTED, fontWeight: 600 }}>— Fabienne R., Coach en rangement chez J&apos;MTD</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FORMULAIRE STEPPER ══ */}
      <section id="formulaire" className="recru-section" style={{ background: "#F8FAFB", padding: "64px 24px 80px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 700, color: TEXT, marginBottom: 12 }}>
              Formulaire de candidature
            </h2>
            <p style={{ fontSize: 15, color: MUTED, maxWidth: 520, margin: "0 auto" }}>
              Prenez le temps de répondre soigneusement à chaque question. C&apos;est votre première impression.
            </p>
            {form.offreTitre && !sent && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 18, background: `${T}0e`, border: `1px solid ${T}30`, borderRadius: 30, padding: "8px 18px" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: TEAL_TEXT, textTransform: "uppercase", letterSpacing: 0.6 }}>Candidature pour</span>
                <span style={{ fontSize: 13.5, fontWeight: 800, color: TEXT }}>{form.offreTitre}</span>
                <button onClick={() => setForm(f => ({ ...f, offreId: "", offreTitre: "" }))}
                  aria-label="Retirer l'offre" style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>
              </div>
            )}
          </div>

          {sent ? (
            <div style={{ textAlign: "center", padding: "64px 32px", background: "#fff", borderRadius: 24, border: `1px solid ${T}20`, boxShadow: `0 8px 40px ${T}08` }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: TEXT, marginBottom: 12 }}>Candidature envoyée !</h3>
              <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.8, maxWidth: 440, margin: "0 auto 28px" }}>
                Merci <strong>{form.prenom}</strong> ! Votre candidature a bien été reçue. Nous l&apos;étudions avec soin et vous recontactons sous 48 à 72h si votre profil correspond.
              </p>
              <div style={{ fontSize: 13, color: MUTED, background: `${T}08`, border: `1px solid ${T}20`, borderRadius: 12, padding: "12px 20px", display: "inline-block" }}>
                En attendant, n&apos;hésitez pas à nous contacter par WhatsApp pour toute question.
              </div>
            </div>
          ) : (
            <div style={{ background: "#fff", borderRadius: 24, border: `1px solid rgba(13,169,164,0.12)`, padding: "40px 36px", boxShadow: `0 4px 32px ${T}08` }}>

              {/* ── Stepper visuel ── */}
              <StepBar step={step} />

              {/* Barre de progression linéaire */}
              <div style={{ height: 4, background: "#F1F5F9", borderRadius: 4, marginBottom: 32, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${(step / 4) * 100}%`,
                  background: `linear-gradient(90deg, ${T}, ${P})`,
                  borderRadius: 4,
                  transition: "width 0.55s cubic-bezier(0.16,1,0.3,1)",
                }} />
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

              <form onSubmit={submit}>

                {/* ══ ÉTAPE 1 — Coordonnées ══ */}
                {step === 1 && (
                  <div style={{ animation: "stepIn 0.32s cubic-bezier(0.16,1,0.3,1) both" }}>
                    <SectionTitle
                      title="👤 Vos informations personnelles"
                      subtitle="Ces informations nous permettront de vous contacter rapidement."
                    />
                    <div className="recru-form-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
                      <div>
                        <Label htmlFor="recru-prenom">Prénom *</Label>
                        <input id="recru-prenom" className="inp-focus" style={{ ...inp, ...errStyle("prenom") }} placeholder="Marie" value={form.prenom} onChange={set("prenom")} />
                      </div>
                      <div>
                        <Label htmlFor="recru-nom">Nom *</Label>
                        <input id="recru-nom" className="inp-focus" style={{ ...inp, ...errStyle("nom") }} placeholder="Dupont" value={form.nom} onChange={set("nom")} />
                      </div>
                    </div>
                    <div className="recru-form-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
                      <div>
                        <Label htmlFor="recru-tel">Téléphone *</Label>
                        <input id="recru-tel" className="inp-focus" style={{ ...inp, ...errStyle("tel") }} placeholder="05 96 XX XX XX" type="tel" value={form.tel} onChange={set("tel")} />
                      </div>
                      <div>
                        <Label htmlFor="recru-email">Email</Label>
                        <input id="recru-email" className="inp-focus" style={inp} placeholder="votre@email.fr" type="email" value={form.email} onChange={set("email")} />
                      </div>
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <Label htmlFor="recru-commune">Commune de résidence *</Label>
                      <input id="recru-commune" className="inp-focus" style={{ ...inp, ...errStyle("commune") }} placeholder="Rivière-Salée, Fort-de-France, Le Diamant…" value={form.commune} onChange={set("commune")} />
                    </div>

                    <div style={{ marginBottom: 20 }}>
                      <Label htmlFor="recru-secteurs">Secteur(s) de déplacement accepté(s) *</Label>
                      <input id="recru-secteurs" className="inp-focus" style={{ ...inp, ...errStyle("secteurs") }}
                        placeholder="Ex : Le Lamentin, Rivière-Salée, Ducos, Fort-de-France…"
                        value={form.secteurs} onChange={set("secteurs")} />
                    </div>

                    <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
                      <legend style={{ display: "block", fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 7, padding: 0 }}>Poste(s) souhaité(s) * — plusieurs choix possibles</legend>
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
                    </fieldset>
                  </div>
                )}

                {/* ══ ÉTAPE 2 — Parcours et expérience (§ 2 du questionnaire) ══ */}
                {step === 2 && (
                  <div style={{ animation: "stepIn 0.32s cubic-bezier(0.16,1,0.3,1) both" }}>
                    <SectionTitle
                      title="💼 Parcours et expérience professionnelle"
                      subtitle="Répondez avec vos mots — il n'y a pas de mauvaise réponse, nous cherchons à vous connaître."
                    />

                    <div style={{ marginBottom: 20 }}>
                      <Label htmlFor="recru-experience">Expérience dans les services à la personne *</Label>
                      <select id="recru-experience" className="inp-focus" style={{ ...inp, ...errStyle("experience") }} value={form.experience} onChange={set("experience")}>
                        <option value="">Sélectionner…</option>
                        <option value="aucune">Non, c&apos;est ma première expérience</option>
                        <option value="moins1">Oui, moins d&apos;1 an</option>
                        <option value="1-3">Oui, 1 à 3 ans</option>
                        <option value="3-5">Oui, 3 à 5 ans</option>
                        <option value="plus5">Oui, plus de 5 ans</option>
                      </select>
                    </div>

                    <TextQ num={1} id="recru-parcours" label="Présentez brièvement votre parcours professionnel." min={MIN_COURT} invalid={errors.parcours}
                      placeholder="Vos précédents emplois, vos missions principales, la durée…"
                      value={form.parcours} onChange={set("parcours")} />

                    <TextQ num={2} id="recru-exp-sap" label="Avez-vous déjà travaillé comme aide ménagère, agent(e) d'entretien ou dans les services à la personne ? Si oui, précisez." required invalid={errors.exp_sap}
                      placeholder="Si ce n'est pas le cas, indiquez simplement « non »."
                      value={form.exp_sap} onChange={set("exp_sap")} rows={2} />

                    <TextQ num={3} id="recru-types-lieux" label="Quels types de logements ou de locaux avez-vous déjà entretenus ?" required invalid={errors.types_lieux}
                      placeholder="Maisons, appartements, bureaux, cabinets, locations saisonnières…"
                      value={form.types_lieux} onChange={set("types_lieux")} rows={2} />

                    <TextQ num={4} id="recru-taches" label="Quelles tâches maîtrisez-vous particulièrement bien ?" min={MIN_COURT} invalid={errors.taches_maitrisees}
                      placeholder="Ce que vous faites le mieux, ce dont vous êtes fier(ère)…"
                      value={form.taches_maitrisees} onChange={set("taches_maitrisees")} />

                    <TextQ num={5} id="recru-fragiles" label="Avez-vous déjà travaillé auprès de personnes âgées, fragiles ou en situation de dépendance ?" required invalid={errors.exp_personnes_fragiles}
                      placeholder="Si ce n'est pas le cas, indiquez simplement « non »."
                      value={form.exp_personnes_fragiles} onChange={set("exp_personnes_fragiles")} rows={2} />

                    <TextQ num={6} id="recru-certifs" label="Avez-vous des formations, certifications ou expériences utiles pour ce poste ?"
                      hint="Optionnel — diplômes, formations hygiène, secourisme, expérience personnelle…"
                      placeholder="Laissez vide si vous n'en avez pas."
                      value={form.certifications} onChange={set("certifications")} rows={2} />
                  </div>
                )}

                {/* ══ ÉTAPE 3 — Compétences techniques (§ 3) ══ */}
                {step === 3 && (
                  <div style={{ animation: "stepIn 0.32s cubic-bezier(0.16,1,0.3,1) both" }}>
                    <SectionTitle
                      title="🧰 Vos compétences techniques"
                      subtitle="Auto-évaluez-vous honnêtement. « À renforcer » n'est pas éliminatoire : nous formons nos intervenantes."
                    />

                    {errors.competences && (
                      <div role="alert" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#B91C1C", marginBottom: 18 }}>
                        Merci de vous positionner sur chacune des {COMPETENCES.length} compétences.
                      </div>
                    )}

                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {COMPETENCES.map(c => {
                        const val = form.competences[c.id];
                        return (
                          <div key={c.id} className="comp-row" style={{ padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${val ? `${T}30` : "rgba(13,169,164,0.16)"}`, background: val ? `${T}06` : "transparent", transition: "all 0.15s" }}>
                            <span style={{ fontSize: 13.5, fontWeight: 600, color: TEXT, lineHeight: 1.45 }}>{c.label}</span>
                            <div role="group" aria-label={c.label} style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                              {NIVEAUX.map(n => (
                                <button key={n.id} type="button" onClick={() => setCompetence(c.id, n.id)} aria-pressed={val === n.id}
                                  style={{ padding: "7px 12px", borderRadius: 20, fontSize: 12, fontWeight: val === n.id ? 800 : 500, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s",
                                    border: `1.5px solid ${val === n.id ? n.color : "rgba(13,169,164,0.2)"}`,
                                    background: val === n.id ? `${n.color}16` : "transparent",
                                    color: val === n.id ? n.color : MUTED }}>
                                  {n.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ══ ÉTAPE 4 — Mises en situation (§ 4) ══ */}
                {step === 4 && (
                  <div style={{ animation: "stepIn 0.32s cubic-bezier(0.16,1,0.3,1) both" }}>
                    <SectionTitle
                      title="🎯 Mises en situation professionnelles"
                      subtitle="Ces situations arrivent réellement chez nos clients. Dites-nous comment vous réagiriez."
                    />

                    <TextQ num={7} id="recru-situ-temps" label="Un client vous demande de réaliser plusieurs tâches dans un temps limité. Comment organisez-vous votre intervention ?" min={MIN_LONG} invalid={errors.situ_temps}
                      value={form.situ_temps} onChange={set("situ_temps")}
                      placeholder="Comment vous priorisez, ce que vous faites en premier, ce que vous dites au client…" />

                    <TextQ num={8} id="recru-situ-produit" label="Vous constatez qu'un produit habituellement utilisé n'est plus disponible. Que faites-vous ?" min={MIN_LONG} invalid={errors.situ_produit}
                      value={form.situ_produit} onChange={set("situ_produit")}
                      placeholder="Votre réflexe immédiat, qui vous prévenez…" />

                    <TextQ num={9} id="recru-situ-casse" label="Vous cassez accidentellement un objet chez un client. Quelle est votre réaction ?" min={MIN_LONG} invalid={errors.situ_casse}
                      value={form.situ_casse} onChange={set("situ_casse")}
                      placeholder="Ce que vous faites sur le moment et ensuite…" />

                    <TextQ num={10} id="recru-situ-hors" label="Un client vous demande une tâche qui ne figure pas dans les consignes prévues. Comment réagissez-vous ?" min={MIN_LONG} invalid={errors.situ_hors_consignes}
                      value={form.situ_hors_consignes} onChange={set("situ_hors_consignes")}
                      placeholder="Comment vous conciliez le service au client et le cadre de la mission…" />

                    <TextQ num={11} id="recru-situ-alerte" label="Vous remarquez une situation inhabituelle ou préoccupante chez une personne âgée. Que faites-vous ?" min={MIN_LONG} invalid={errors.situ_alerte}
                      value={form.situ_alerte} onChange={set("situ_alerte")}
                      placeholder="Ce que vous observez, qui vous alertez, ce que vous ne faites pas…" />
                  </div>
                )}

                {/* ══ ÉTAPE 5 — Savoir-être et relation client (§ 5) ══ */}
                {step === 5 && (
                  <div style={{ animation: "stepIn 0.32s cubic-bezier(0.16,1,0.3,1) both" }}>
                    <SectionTitle
                      title="🤝 Savoir-être et relation client"
                      subtitle="Chez J'MTD, la manière de travailler compte autant que le travail lui-même."
                    />

                    <TextQ num={12} id="recru-travail-bien-fait" label="Pour vous, que signifie « travail bien fait » ?" min={MIN_LONG} invalid={errors.travail_bien_fait}
                      value={form.travail_bien_fait} onChange={set("travail_bien_fait")}
                      placeholder="Ce qui fait, selon vous, la différence entre une intervention correcte et une intervention réussie…" />

                    <TextQ num={13} id="recru-qualites" label="Quelles qualités sont indispensables pour intervenir au domicile d'un client ?" min={MIN_LONG} invalid={errors.qualites}
                      value={form.qualites} onChange={set("qualites")}
                      placeholder="Les qualités humaines et professionnelles que vous jugez essentielles…" />

                    <TextQ num={14} id="recru-reclamation" label="Comment réagissez-vous face à une remarque ou une réclamation d'un client ?" min={MIN_LONG} invalid={errors.reclamation}
                      value={form.reclamation} onChange={set("reclamation")}
                      placeholder="Votre attitude, ce que vous dites, ce que vous faites ensuite…" />

                    <TextQ num={15} id="recru-discretion" label="Comment garantissez-vous la discrétion et la confidentialité au domicile des clients ?" min={MIN_DISCRETION} invalid={errors.discretion}
                      hint="Nos intervenantes entrent dans la vie privée de nos clients. C'est un point sur lequel nous sommes intransigeants."
                      value={form.discretion} onChange={set("discretion")}
                      placeholder="Concrètement, au quotidien : ce que vous faites et ce que vous ne faites jamais…" />
                  </div>
                )}

                {/* ══ ÉTAPE 6 — Disponibilités et conditions d'exercice (§ 6) ══ */}
                {step === 6 && (
                  <div style={{ animation: "stepIn 0.32s cubic-bezier(0.16,1,0.3,1) both" }}>
                    <SectionTitle
                      title="📅 Disponibilités et conditions d'exercice"
                      subtitle="Ces informations nous permettent de vérifier la compatibilité avec nos plannings clients."
                    />

                    <div style={{ marginBottom: 18 }}>
                      <Label htmlFor="recru-jours-group">Jours disponibles * — plusieurs choix possibles</Label>
                      <div id="recru-jours-group" role="group" aria-label="Jours disponibles" style={{ display: "flex", gap: 10, flexWrap: "wrap", ...(errors.dispo_jours ? { outline: "2px solid #EF4444", borderRadius: 8, padding: 4 } : {}) }}>
                        {JOURS.map(j => (
                          <button key={j} type="button" className="jour-btn"
                            onClick={() => toggleJour(j)} aria-pressed={form.dispo_jours.includes(j)}
                            style={{ padding: "9px 18px", borderRadius: 30, border: `1.5px solid ${form.dispo_jours.includes(j) ? T : "rgba(13,169,164,0.22)"}`, background: form.dispo_jours.includes(j) ? `${T}14` : "transparent", color: form.dispo_jours.includes(j) ? T : MUTED, fontWeight: form.dispo_jours.includes(j) ? 700 : 500, fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}>
                            {j}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: 18 }}>
                      <Label htmlFor="recru-plages">Plages horaires possibles *</Label>
                      <input id="recru-plages" className="inp-focus" style={{ ...inp, ...errStyle("plages_horaires") }}
                        placeholder="Ex : 8h–12h et 14h–17h, ou « matin uniquement »…"
                        value={form.plages_horaires} onChange={set("plages_horaires")} />
                    </div>

                    <div style={{ marginBottom: 18 }}>
                      <Label htmlFor="recru-dispo-heures">Nombre d&apos;heures disponibles par semaine *</Label>
                      <select id="recru-dispo-heures" className="inp-focus" style={{ ...inp, ...errStyle("dispo_heures") }} value={form.dispo_heures} onChange={set("dispo_heures")}>
                        <option value="">Sélectionner…</option>
                        <option value="moins10">Moins de 10h/semaine</option>
                        <option value="10-20">10 à 20h/semaine</option>
                        <option value="20-30">20 à 30h/semaine</option>
                        <option value="30-35">30 à 35h/semaine</option>
                        <option value="temps-plein">Temps plein (35h+)</option>
                      </select>
                    </div>

                    <YesNo label="Mobilité pour effectuer les interventions" value={form.mobilite} onChange={v => setForm(f => ({ ...f, mobilite: v }))} invalid={errors.mobilite} />
                    <YesNo label="Permis de conduire" value={form.permis} onChange={v => setForm(f => ({ ...f, permis: v }))} invalid={errors.permis} />
                    <YesNo label="Véhicule personnel disponible pour les déplacements professionnels" value={form.vehicule} onChange={v => setForm(f => ({ ...f, vehicule: v }))} invalid={errors.vehicule} />

                    {form.vehicule === "non" && (
                      <div style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.28)", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#92400E", lineHeight: 1.6, marginBottom: 18 }}>
                        ⚠️ Nos interventions se font au domicile des clients, réparties sur plusieurs communes. Sans véhicule personnel, certaines missions ne pourront pas vous être confiées.
                      </div>
                    )}

                    <div>
                      <Label htmlFor="recru-prise-poste">Date possible de prise de poste *</Label>
                      <input id="recru-prise-poste" className="inp-focus" style={{ ...inp, ...errStyle("prise_poste") }}
                        placeholder="Ex : immédiatement, dès le 1er septembre, sous 1 mois…"
                        value={form.prise_poste} onChange={set("prise_poste")} />
                    </div>
                  </div>
                )}

                {/* ══ ÉTAPE 7 — Motivation (§ 7) ══ */}
                {step === 7 && (
                  <div style={{ animation: "stepIn 0.32s cubic-bezier(0.16,1,0.3,1) both" }}>
                    <SectionTitle
                      title="⭐ Votre motivation"
                      subtitle="Prenez le temps de répondre soigneusement — c'est ce qui fera la différence."
                    />

                    <TextQ num={16} id="recru-motivation" label="Pourquoi souhaitez-vous rejoindre J'MTD ?" min={MIN_MOTIVATION} invalid={errors.motivation}
                      value={form.motivation} onChange={set("motivation")} rows={4}
                      placeholder="Ce qui vous attire chez nous en particulier, ce que vous avez compris de notre façon de travailler…" />

                    <TextQ num={17} id="recru-interet-metier" label="Pourquoi le métier d'aide ménagère vous intéresse-t-il ?" min={MIN_LONG} invalid={errors.interet_metier}
                      value={form.interet_metier} onChange={set("interet_metier")}
                      placeholder="Ce qui vous plaît dans ce métier, ce que vous y trouvez…" />

                    <TextQ num={18} id="recru-attentes" label="Qu'attendez-vous de votre futur poste et de l'entreprise ?" min={MIN_LONG} invalid={errors.attentes}
                      value={form.attentes} onChange={set("attentes")}
                      placeholder="Vos attentes en matière d'organisation, d'accompagnement, d'évolution…" />
                  </div>
                )}

                {/* ══ ÉTAPE 8 — Finalisation ══ */}
                {step === 8 && (
                  <div style={{ animation: "stepIn 0.32s cubic-bezier(0.16,1,0.3,1) both" }}>
                    <SectionTitle
                      title="📝 Pour finir"
                      subtitle="Vérifiez votre récapitulatif, puis validez votre candidature."
                    />

                    {/* Récapitulatif */}
                    <div style={{ background: `${T}07`, border: `1px solid ${T}20`, borderRadius: 14, padding: "16px 20px", marginBottom: 28 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: TEAL_TEXT, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 }}>📋 Récapitulatif de votre candidature</div>
                      <div className="recru-form-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        {[
                          ["Candidat·e", `${form.prenom} ${form.nom}`],
                          ["Téléphone", form.tel || "—"],
                          ["Commune", form.commune || "—"],
                          ["Secteurs acceptés", form.secteurs || "—"],
                          ["Poste(s) visé(s)", form.postes.length > 0 ? `${form.postes.length} sélectionné(s)` : "—"],
                          ["Jours disponibles", form.dispo_jours.length > 0 ? form.dispo_jours.join(", ") : "—"],
                          ["Véhicule", form.vehicule === "oui" ? "Oui" : form.vehicule === "non" ? "Non" : "—"],
                          ["Prise de poste", form.prise_poste || "—"],
                          ["Compétences maîtrisées", `${Object.values(form.competences).filter(v => v === "maitrisee").length} / ${COMPETENCES.length}`],
                          ...(form.offreTitre ? [["Offre visée", form.offreTitre]] : []),
                        ].map(([k, v]) => (
                          <div key={k} style={{ fontSize: 13 }}>
                            <span style={{ color: MUTED, fontSize: 11 }}>{k} : </span>
                            <span style={{ fontWeight: 700, color: TEXT }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: 14 }}>
                      <Label htmlFor="recru-references">Avez-vous des références professionnelles ?</Label>
                      <select id="recru-references" className="inp-focus" style={inp} value={form.references} onChange={set("references")}>
                        <option value="">Sélectionner…</option>
                        <option value="oui">Oui, je peux fournir des références</option>
                        <option value="non">Non, pas pour le moment</option>
                        <option value="bientot">Je peux en obtenir si nécessaire</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: 14 }}>
                      <Label htmlFor="recru-formation">Êtes-vous prêt(e) à suivre notre formation interne (1 à 2 jours) ?</Label>
                      <select id="recru-formation" className="inp-focus" style={inp} value={form.formation} onChange={set("formation")}>
                        <option value="">Sélectionner…</option>
                        <option value="oui">Oui, tout à fait</option>
                        <option value="avec_contrainte">Oui, avec certaines contraintes horaires</option>
                        <option value="non">Non, j&apos;ai déjà toutes les compétences</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                      <Label htmlFor="recru-infos-plus">Informations supplémentaires (optionnel)</Label>
                      <textarea id="recru-infos-plus" className="inp-focus" style={{ ...inp, resize: "vertical", minHeight: 80 }}
                        placeholder="Toute information que vous jugez utile à partager : contraintes spécifiques, compétences particulières, questions…"
                        value={form.infos_plus} onChange={set("infos_plus")} rows={3} />
                    </div>

                    {/* § 9 — Protection des données et non-discrimination */}
                    <div style={{ background: "#F8FAFB", border: "1px solid rgba(13,169,164,0.14)", borderRadius: 12, padding: "14px 16px", marginBottom: 18, fontSize: 12, color: MUTED, lineHeight: 1.7 }}>
                      <strong style={{ color: TEXT, display: "block", marginBottom: 5 }}>Protection des données et non-discrimination</strong>
                      Les informations recueillies sont destinées à l&apos;évaluation de votre candidature au regard des exigences du poste. Les questions sont limitées aux éléments nécessaires à l&apos;appréciation des compétences, de l&apos;expérience, de la disponibilité et des conditions d&apos;exercice. J&apos;MTD respecte les principes applicables en matière de protection des données personnelles et de non-discrimination dans le recrutement.
                    </div>

                    {/* RGPD */}
                    <div style={{ borderTop: `1px solid rgba(13,169,164,0.12)`, paddingTop: 20, marginBottom: 8 }}>
                      <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", padding: "14px 16px", background: `${T}06`, border: `1.5px solid ${errors.rgpd ? "#EF4444" : `${T}20`}`, borderRadius: 12, transition: "border-color 0.2s" }}>
                        <input type="checkbox" checked={form.rgpd} onChange={e => setForm(f => ({ ...f, rgpd: e.target.checked }))}
                          style={{ marginTop: 3, accentColor: T, flexShrink: 0, width: 18, height: 18 }} />
                        <span style={{ fontSize: 13, color: MUTED, lineHeight: 1.7 }}>
                          J&apos;accepte que J&apos;MTD conserve mes données dans le cadre de ma candidature. Ces données seront utilisées uniquement pour le processus de recrutement et ne seront pas transmises à des tiers.{" "}
                          <Link href="/politique-confidentialite" style={{ color: T }}>Politique de confidentialité</Link>. *
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* ── Navigation Stepper ── */}
                <div style={{ display: "flex", gap: 12, marginTop: 32, justifyContent: "space-between", alignItems: "center" }}>
                  {step > 1 ? (
                    <button type="button" onClick={goPrev}
                      style={{ padding: "13px 28px", borderRadius: 30, border: `1.5px solid rgba(13,169,164,0.3)`, background: "transparent", color: TEAL_TEXT, fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = `${T}08`; e.currentTarget.style.borderColor = T; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(13,169,164,0.3)"; }}>
                      ← Retour
                    </button>
                  ) : <div />}

                  {step < STEPS.length ? (
                    <button type="button" onClick={goNext}
                      style={{ padding: "14px 36px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", border: "none", boxShadow: `0 6px 24px ${T}40`, transition: "transform 0.2s, box-shadow 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 10px 32px ${T}55`; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 6px 24px ${T}40`; }}>
                      Continuer — étape {step + 1}/{STEPS.length} →
                    </button>
                  ) : (
                    <button type="submit" disabled={loading}
                      style={{ padding: "16px 36px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 800, fontSize: 16, cursor: loading ? "wait" : "pointer", border: "none", boxShadow: `0 6px 28px ${T}44`, transition: "transform 0.2s, box-shadow 0.2s", letterSpacing: 0.3 }}
                      onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 10px 36px ${T}55`; }}}
                      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 6px 28px ${T}44`; }}>
                      {loading ? (
                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }}>
                            <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="3"/>
                            <path d="M12 2a10 10 0 0 1 10 10" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
                          </svg>
                          Envoi en cours…
                        </span>
                      ) : "Envoyer ma candidature →"}
                    </button>
                  )}
                </div>

                {submitError && (
                  <p role="alert" style={{ fontSize: 13.5, color: "#B91C1C", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: "12px 16px", textAlign: "center", marginTop: 16, lineHeight: 1.6 }}>
                    {submitError}
                  </p>
                )}

                <p style={{ fontSize: 12, color: "#94A3B8", textAlign: "center", marginTop: 16, lineHeight: 1.7 }}>
                  Étape {step}/{STEPS.length} · * Champs obligatoires · Réponse sous 48 à 72h ouvrées · Candidature traitée confidentiellement
                </p>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

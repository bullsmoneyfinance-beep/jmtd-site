// ─── Scoring & tri des candidatures (module partagé) ───
// Réutilisable côté API (email de notif), admin (tri) et future app de gestion SAP.
// Modèle pondéré sur 100 points, critères adaptés aux métiers du service à la personne.

// Libellés centralisés (source unique — évite la duplication éparpillée)
export const POSTE_LABELS = {
  menage: "🏠 Ménage", repas: "🍽️ Repas", courses: "🛒 Courses",
  assistance: "📋 Admin", rangement: "🗂️ Rangement", jardinage: "🌿 Jardinage",
};
export const EXP_LABELS = { aucune: "Aucune exp.", moins1: "< 1 an", "1-3": "1–3 ans", "3-5": "3–5 ans", plus5: "5 ans +" };
export const TRANSPORT_LABELS = { voiture: "🚗 Voiture", scooter: "🛵 Scooter", velo: "🚲 Vélo", non: "🚶 Sans véhicule" };
export const DISPO_LABELS = { moins10: "< 10 h/sem", "10-20": "10–20 h/sem", "20-30": "20–30 h/sem", "30-35": "30–35 h/sem", "temps-plein": "Temps plein" };
export const SITUATION_LABELS = { chomage: "Recherche d'emploi", partiel: "Temps partiel", reconversion: "Reconversion", retraite: "Retraité·e", autre: "Autre" };

// Barème par critère (max de chaque poste) — total 100
const SCALES = {
  experience: { aucune: 0, moins1: 6, "1-3": 12, "3-5": 17, plus5: 20 },        // /20
  dispo:      { "temps-plein": 12, "30-35": 10, "20-30": 8, "10-20": 5, moins10: 2 }, // /12
  references: { oui: 5, bientot: 3, non: 0 },                                    // /5
  formation:  { oui: 5, avec_contrainte: 3, non: 1 },                            // /5
};

const NB_COMPETENCES = 8; // cf. COMPETENCES du formulaire (§ 3 du questionnaire)

/* Mobilité — questionnaire : permis + véhicule personnel.
   Repli sur l'ancien champ `transport` pour les candidatures antérieures. */
function mobiliteScore(c) {
  if (c.vehicule === "oui") return 15;
  if (c.vehicule === "non") return c.permis === "oui" ? 6 : 2;
  return { voiture: 15, scooter: 11, velo: 6, non: 0 }[c.transport] ?? 0;
}

/* Auto-évaluation des 8 compétences techniques (§ 3) — maîtrisée = 1, à renforcer = 0,5 */
function competencesScore(c) {
  const vals = Object.values(c.competences || {});
  if (!vals.length) return 0;
  const raw = vals.reduce((a, v) => a + (v === "maitrisee" ? 1 : v === "a_renforcer" ? 0.5 : 0), 0);
  return Math.round((raw / NB_COMPETENCES) * 15);
}

const CRITERES = [
  { key: "experience", label: "Expérience", max: 20 },
  { key: "competences", label: "Compétences", max: 15 },
  { key: "mobilite", label: "Mobilité", max: 15 },
  { key: "dispo", label: "Disponibilité", max: 12 },
  { key: "jours", label: "Jours dispo", max: 8 },
  { key: "motivation", label: "Motivation", max: 10 },
  { key: "discretion", label: "Savoir-être", max: 10 },
  { key: "references", label: "Références", max: 5 },
  { key: "formation", label: "Évolutivité", max: 5 },
];

function textScore(str, hi, mid, lo, maxPts) {
  const n = (str || "").trim().length;
  if (n >= hi) return maxPts;
  if (n >= mid) return Math.round(maxPts * 0.7);
  if (n >= lo) return Math.round(maxPts * 0.4);
  return n > 0 ? Math.round(maxPts * 0.2) : 0;
}

/**
 * Score une candidature.
 * @returns {{ total:number, breakdown:Array<{key,label,score,max}>, tier:object }}
 */
export function scoreCandidature(c = {}) {
  const parts = {
    experience:  SCALES.experience[c.experience] ?? 0,
    competences: competencesScore(c),
    mobilite:    mobiliteScore(c),
    dispo:       SCALES.dispo[c.dispo_heures] ?? 0,
    jours:       Math.round(Math.min((c.dispo_jours?.length || 0) * 1.5, 8)),
    motivation:  textScore(c.motivation, 250, 150, 80, 10),
    discretion:  textScore(c.discretion, 160, 110, 80, 10),
    references:  SCALES.references[c.references] ?? 0,
    formation:   SCALES.formation[c.formation] ?? 1,
  };
  const total = Object.values(parts).reduce((a, b) => a + b, 0);
  const breakdown = CRITERES.map(cr => ({ ...cr, score: parts[cr.key] }));
  return { total, breakdown, tier: tierFor(total) };
}

// Catégorisation automatique
export const TIERS = {
  prioritaire: { key: "prioritaire", label: "Prioritaire", short: "À rencontrer", emoji: "🟢", color: "#10B981", min: 70 },
  etudier:     { key: "etudier",     label: "À étudier",   short: "À approfondir", emoji: "🟡", color: "#F59E0B", min: 45 },
  faible:      { key: "faible",      label: "Non prioritaire", short: "Non prioritaire", emoji: "🔴", color: "#94A3B8", min: 0 },
};

export function tierFor(total) {
  if (total >= TIERS.prioritaire.min) return TIERS.prioritaire;
  if (total >= TIERS.etudier.min) return TIERS.etudier;
  return TIERS.faible;
}

// Étoiles (compat affichage 0–5)
export function scoreToStars(total) {
  return Math.max(1, Math.min(5, Math.round(total / 20)));
}

/**
 * Tri + filtrage d'une liste de candidatures pour le tableau de triage.
 * @param opts { sort:"score"|"date", tier:"all"|clé, poste:"all"|clé, status:"all"|clé }
 */
export function triageCandidatures(list = [], opts = {}) {
  const { sort = "score", tier = "all", poste = "all", status = "all" } = opts;
  let out = list.map(c => ({ ...c, _score: scoreCandidature(c) }));
  if (tier !== "all") out = out.filter(c => c._score.tier.key === tier);
  if (poste !== "all") out = out.filter(c => (c.postes || []).includes(poste));
  if (status !== "all") out = out.filter(c => (c.status || "nouveau") === status);
  out.sort((a, b) => sort === "date" ? (b.date || 0) - (a.date || 0) : b._score.total - a._score.total);
  return out;
}

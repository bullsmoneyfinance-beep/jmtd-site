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

// Barème par critère (max de chaque poste)
const SCALES = {
  experience: { aucune: 0, moins1: 8, "1-3": 15, "3-5": 21, plus5: 25 },        // /25
  transport:  { voiture: 20, scooter: 14, velo: 8, non: 0 },                     // /20 — mobilité clé en Martinique
  dispo:      { "temps-plein": 15, "30-35": 13, "20-30": 10, "10-20": 6, moins10: 3 }, // /15
  references: { oui: 5, bientot: 3, non: 0 },                                    // /5
  formation:  { oui: 5, avec_contrainte: 3, non: 1 },                            // /5
};

const CRITERES = [
  { key: "experience", label: "Expérience", max: 25 },
  { key: "transport", label: "Mobilité", max: 20 },
  { key: "dispo", label: "Disponibilité", max: 15 },
  { key: "jours", label: "Jours dispo", max: 10 },
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
    experience: SCALES.experience[c.experience] ?? 0,
    transport:  SCALES.transport[c.transport] ?? 0,
    dispo:      SCALES.dispo[c.dispo_heures] ?? 0,
    jours:      Math.min((c.dispo_jours?.length || 0) * 2, 10),
    motivation: textScore(c.motivation, 200, 100, 50, 10),
    discretion: textScore(c.discretion, 100, 60, 30, 10),
    references: SCALES.references[c.references] ?? 0,
    formation:  SCALES.formation[c.formation] ?? 1,
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

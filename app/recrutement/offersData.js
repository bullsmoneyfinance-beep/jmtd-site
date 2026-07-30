// ─── Offres d'emploi J'MTD ───────────────────────────────────────────────
// Modèle partagé par la page publique /recrutement et le module admin.
// Les offres sont éditables « à la main » depuis l'admin (clé de stockage
// jmtd_offers). DEFAULT_OFFERS sert de contenu initial (offre en cours) et
// de source pour les données structurées JobPosting (Google for Jobs).

export const CONTRATS = [
  "CDI à temps plein",
  "CDI à temps partiel",
  "CDD",
  "Temps partiel",
  "Extra / ponctuel",
];

// employmentType schema.org selon le contrat
export const EMPLOYMENT_TYPE = {
  "CDI à temps plein": "FULL_TIME",
  "CDI à temps partiel": "PART_TIME",
  "CDD": "TEMPORARY",
  "Temps partiel": "PART_TIME",
  "Extra / ponctuel": "PER_DIEM",
};

// Offre(s) initiale(s) — l'admin peut les modifier, les désactiver ou en ajouter.
export const DEFAULT_OFFERS = [
  {
    id: "menage-lamentin-jeanne-darc",
    titre: "Aide ménagère — Nettoyage de locaux professionnels",
    contrat: "CDI à temps partiel",
    lieu: "Le Lamentin (quartier Jeanne d'Arc)",
    horaires: "Du lundi au vendredi, de 8h00 à 9h00",
    prisePoste: "Dès le mois d'août",
    urgent: true,
    statut: "active", // "active" | "pourvue"
    poste: "menage", // pré-coche ce poste dans le formulaire de candidature
    datePosted: "2026-07-29",
    validThrough: "2026-10-31",
    description:
      "Nous recherchons une aide ménagère pour assurer le nettoyage quotidien de locaux professionnels au Lamentin, principalement dans le quartier Jeanne d'Arc.",
    profil: [
      "Véhiculé(e)",
      "Sérieux(se), ponctuel(le) et professionnel(le)",
      "Méticuleux(se), autonome et ayant le sens du détail",
      "Une expérience dans le nettoyage de bureaux ou de locaux est fortement appréciée",
    ],
    evolution:
      "La personne interviendra dans un premier temps sur un site situé à Jeanne d'Arc (Le Lamentin), avec la possibilité d'effectuer par la suite d'autres prestations sur le secteur du Lamentin, aussi bien auprès de professionnels que de particuliers.",
  },
];

// Construit le JSON-LD schema.org/JobPosting d'une offre (Google for Jobs).
export function buildJobPostingLd(offer) {
  const profilText = (offer.profil || []).map((p) => `• ${p}`).join("\n");
  const descriptionHtml =
    `<p>${offer.description || ""}</p>` +
    (offer.horaires ? `<p><strong>Horaires :</strong> ${offer.horaires}</p>` : "") +
    (offer.prisePoste ? `<p><strong>Prise de poste :</strong> ${offer.prisePoste}</p>` : "") +
    (offer.profil?.length ? `<p><strong>Profil recherché :</strong></p><ul>${offer.profil.map((p) => `<li>${p}</li>`).join("")}</ul>` : "") +
    (offer.evolution ? `<p><strong>Évolution :</strong> ${offer.evolution}</p>` : "");

  return {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: offer.titre,
    description: descriptionHtml || offer.description || offer.titre,
    datePosted: offer.datePosted || undefined,
    validThrough: offer.validThrough || undefined,
    employmentType: EMPLOYMENT_TYPE[offer.contrat] || "PART_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: "J'MTD",
      sameAs: "https://jmtd.fr",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Le Lamentin",
        addressRegion: "Martinique",
        addressCountry: "FR",
      },
    },
    applicantLocationRequirements: {
      "@type": "Country",
      name: "France",
    },
    directApply: true,
  };
}

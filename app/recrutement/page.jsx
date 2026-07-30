import RecrutementClient from "./RecrutementClient";
import { DEFAULT_OFFERS, buildJobPostingLd } from "./offersData";

export const metadata = {
  title: "Rejoindre l'équipe J'MTD — Offres d'emploi Martinique",
  description: "J'MTD recrute des intervenant(e)s à domicile en Martinique. Postulez en ligne : ménage, aide à la personne, coach rangement.",
};

export default function RecrutementPage() {
  // Données structurées JobPosting (Google for Jobs) — rendues côté serveur
  // à partir des offres par défaut (offres en cours connues au build).
  const activeOffers = DEFAULT_OFFERS.filter((o) => o.statut !== "pourvue");

  return (
    <>
      {activeOffers.map((offer) => (
        <script
          key={offer.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJobPostingLd(offer)) }}
        />
      ))}
      <RecrutementClient />
    </>
  );
}

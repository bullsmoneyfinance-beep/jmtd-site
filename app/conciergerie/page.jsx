import ConciergerieClient from "./ConciergerieClient";

export const metadata = {
  title: "Conciergerie locative Airbnb & meublés de tourisme Martinique | J'MTD",
  description: "Gestion complète de votre location saisonnière dans le Centre et le Sud de la Martinique : ménage hôtelier, accueil voyageurs, blanchisserie, gestion des annonces. Simulateur de revenus gratuit.",
};

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Conciergerie locative — gestion de meublés de tourisme",
  description: "Ménage hôtelier entre séjours, accueil des voyageurs, blanchisserie, entretien extérieur et gestion des annonces pour propriétaires de locations saisonnières dans le Centre et le Sud de la Martinique.",
  provider: { "@type": "LocalBusiness", name: "J'MTD" },
  areaServed: ["Rivière-Salée", "Le Diamant", "Sainte-Luce", "Trois-Îlets", "Le Marin"].map((name) => ({ "@type": "City", name })),
  audience: { "@type": "BusinessAudience", audienceType: "Propriétaires de meublés de tourisme" },
};

export default function ConciergeriePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_SCHEMA) }}
      />
      <ConciergerieClient />
    </>
  );
}

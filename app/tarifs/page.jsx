import TarifsClient from "./TarifsClient";

export const metadata = {
  title: "Tarifs services à la personne — 50% crédit d'impôt | J'MTD",
  description: "Découvrez nos tarifs transparents pour le ménage, les repas, les courses et l'entretien à domicile en Martinique. Simulateur de crédit d'impôt et formules d'abonnement dès 28€/h.",
};

const OFFER_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Services à la personne",
  provider: { "@type": "LocalBusiness", name: "J'MTD" },
  areaServed: ["Rivière-Salée", "Le Lamentin", "Fort-de-France", "Le Diamant", "Sainte-Luce", "Trois-Îlets", "Le Marin", "Saint-Esprit"]
    .map((name) => ({ "@type": "City", name })),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Tarifs J'MTD",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Entretien & Ménage" }, priceCurrency: "EUR", price: "32", priceSpecification: { "@type": "UnitPriceSpecification", price: "32", priceCurrency: "EUR", unitText: "HOUR" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Préparation des repas" }, priceCurrency: "EUR", price: "32", priceSpecification: { "@type": "UnitPriceSpecification", price: "32", priceCurrency: "EUR", unitText: "HOUR" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Livraison de courses" }, priceCurrency: "EUR", price: "28" },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Assistance administrative" }, priceCurrency: "EUR", price: "34", priceSpecification: { "@type": "UnitPriceSpecification", price: "34", priceCurrency: "EUR", unitText: "HOUR" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Entretien extérieur & jardinage" }, priceCurrency: "EUR", price: "36", priceSpecification: { "@type": "UnitPriceSpecification", price: "36", priceCurrency: "EUR", unitText: "HOUR" } },
    ],
  },
};

export default function TarifsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(OFFER_SCHEMA) }}
      />
      <TarifsClient />
    </>
  );
}

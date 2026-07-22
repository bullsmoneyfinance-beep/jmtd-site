import ServicesClient from "./ServicesClient";
import { SERVICES } from "../../lib/data";

export const metadata = {
  title: "Ménage, repas, courses à domicile — Martinique | J'MTD",
  description: "Ménage, préparation de repas, livraison de courses, assistance administrative et coach rangement à domicile dans le Centre et le Sud de la Martinique. Devis gratuit, crédit d'impôt 50%.",
};

// Communes réellement couvertes (Centre + Sud) — cohérent avec le schema LocalBusiness racine
const SERVICE_AREA = ["Rivière-Salée", "Le Lamentin", "Fort-de-France", "Le Diamant", "Sainte-Luce", "Trois-Îlets", "Le Marin", "Saint-Esprit"]
  .map((name) => ({ "@type": "City", name }));

// Schéma Service (un par prestation) — renforce la pertinence locale et l'éligibilité aux rich results
const SERVICES_SCHEMA = SERVICES.map((s) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: s.title,
  description: s.desc,
  provider: { "@type": "LocalBusiness", name: "J'MTD" },
  areaServed: SERVICE_AREA,
}));

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICES_SCHEMA) }}
      />
      <ServicesClient />
    </>
  );
}

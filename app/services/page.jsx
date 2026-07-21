import ServicesClient from "./ServicesClient";
import { SERVICES } from "../../lib/data";

export const metadata = {
  title: "Nos prestations à domicile en Martinique — Ménage, repas, courses | J'MTD",
  description: "Ménage, préparation de repas, livraison de courses, assistance administrative et coach rangement à domicile partout en Martinique. Devis gratuit, crédit d'impôt 50%.",
};

// Schéma Service (un par prestation) — renforce la pertinence locale et l'éligibilité aux rich results
const SERVICES_SCHEMA = SERVICES.map((s) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: s.title,
  description: s.desc,
  provider: { "@type": "LocalBusiness", name: "J'MTD" },
  areaServed: { "@type": "AdministrativeArea", name: "Martinique" },
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

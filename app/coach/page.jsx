import CoachClient from "./CoachClient";

export const metadata = {
  title: "Coach en rangement méthode Marie Kondo à domicile en Martinique | J'MTD",
  description: "Diagnostic gratuit et accompagnement personnalisé en rangement selon la méthode Marie Kondo, à domicile dans le Centre et le Sud de la Martinique. Formules et tarifs.",
};

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Coach en rangement — méthode Marie Kondo",
  description: "Diagnostic gratuit, accompagnement personnalisé et rangement intégral selon la méthode Marie Kondo, à domicile dans le Centre et le Sud de la Martinique.",
  provider: { "@type": "LocalBusiness", name: "J'MTD" },
  areaServed: ["Rivière-Salée", "Le Lamentin", "Fort-de-France", "Le Diamant", "Sainte-Luce", "Trois-Îlets", "Le Marin", "Saint-Esprit"]
    .map((name) => ({ "@type": "City", name })),
};

export default function CoachPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_SCHEMA) }}
      />
      <CoachClient />
    </>
  );
}

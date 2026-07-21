import CoachClient from "./CoachClient";

export const metadata = {
  title: "Coach en rangement méthode Marie Kondo à domicile en Martinique | J'MTD",
  description: "Diagnostic gratuit et accompagnement personnalisé en rangement selon la méthode Marie Kondo, à domicile partout en Martinique. Formules et tarifs.",
};

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Coach en rangement — méthode Marie Kondo",
  description: "Diagnostic gratuit, accompagnement personnalisé et rangement intégral selon la méthode Marie Kondo, à domicile en Martinique.",
  provider: { "@type": "LocalBusiness", name: "J'MTD" },
  areaServed: { "@type": "AdministrativeArea", name: "Martinique" },
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

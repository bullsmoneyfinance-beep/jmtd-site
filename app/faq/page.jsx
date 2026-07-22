import FaqClient from "./FaqClient";
import { FAQ_DATA } from "./faqData";

export const metadata = {
  title: "FAQ — Services à la personne en Martinique | J'MTD",
  description: "Toutes les réponses sur nos tarifs, le crédit d'impôt, nos zones d'intervention et la sécurité de nos services à la personne en Martinique.",
};

// Schéma FAQPage — éligible aux extraits enrichis Google (rich results)
const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_DATA.flatMap((cat) =>
    cat.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    }))
  ),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
      <FaqClient />
    </>
  );
}

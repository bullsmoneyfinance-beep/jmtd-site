import FaqClient from "./FaqClient";

export const metadata = {
  title: "FAQ — Questions fréquentes sur nos services à la personne | J'MTD",
  description: "Toutes les réponses sur nos tarifs, le crédit d'impôt, nos zones d'intervention et la sécurité de nos services à la personne en Martinique.",
};

export default function FAQPage() {
  return <FaqClient />;
}

import TarifsClient from "./TarifsClient";

export const metadata = {
  title: "Tarifs services à la personne Martinique — 50% crédit d'impôt | J'MTD",
  description: "Découvrez nos tarifs transparents pour le ménage, les repas, les courses et l'entretien à domicile en Martinique. Simulateur de crédit d'impôt et formules d'abonnement dès 28€/h.",
};

export default function TarifsPage() {
  return <TarifsClient />;
}

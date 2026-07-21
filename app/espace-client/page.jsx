import EspaceClientClient from "./EspaceClientClient";

export const metadata = {
  title: "Espace client — Votre suivi J'MTD",
  description: "Consultez vos interventions et téléchargez votre attestation fiscale crédit d'impôt.",
  robots: { index: false, follow: false },
};

export default function EspaceClientPage() {
  return <EspaceClientClient />;
}

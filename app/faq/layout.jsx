import { HORAIRES } from "../../lib/data";

export const metadata = {
  title: "Questions fréquentes — services à la personne Martinique | J'MTD",
  description:
    "Réponses à vos questions sur les services à la personne en Martinique : tarifs, crédit d'impôt 50%, interventions, coaching rangement. J'MTD vous répond.",
  alternates: { canonical: "https://jmtd.fr/faq" },
};

const FAQ_ENTRIES = [
  {
    q: "Comment fonctionne le crédit d'impôt à 50% ?",
    a: "Le crédit d'impôt pour services à la personne (SAP) vous permet de récupérer 50% du montant payé directement sur votre impôt. Si vous n'êtes pas imposable, l'État vous verse la somme sous forme de remboursement direct. Il suffit de déclarer les montants sur votre déclaration annuelle grâce à l'attestation fiscale que nous vous remettons chaque janvier.",
  },
  {
    q: "Quels sont vos modes de paiement acceptés ?",
    a: "Nous acceptons le virement bancaire, le chèque, les espèces et le CESU (Chèque Emploi Service Universel). Le paiement s'effectue après chaque intervention ou en fin de mois selon votre préférence.",
  },
  {
    q: "Puis-je payer avec le CESU préfinancé ?",
    a: "Oui, nous acceptons le CESU préfinancé. C'est même avantageux car il peut être combiné avec le crédit d'impôt dans certains cas. Renseignez-vous auprès de votre employeur ou de votre mutuelle.",
  },
  {
    q: "Y a-t-il des frais de déplacement en plus ?",
    a: "Nos tarifs incluent les déplacements dans un rayon standard autour de Rivière-Salée. Pour les zones plus éloignées (Nord Atlantique, Presqu'île), des frais kilométriques peuvent s'appliquer — précisez votre commune lors du devis.",
  },
  {
    q: "Proposez-vous des abonnements mensuels ?",
    a: "Oui ! Les abonnements hebdomadaires ou bi-hebdomadaires bénéficient de conditions tarifaires avantageuses par rapport aux interventions ponctuelles. Demandez un devis mensuel pour connaître notre offre fidélité.",
  },
  {
    q: "Quelles prestations proposez-vous exactement ?",
    a: "J'MTD propose 5 services : entretien & nettoyage du domicile, préparation de repas à domicile, livraison de courses, assistance administrative et coaching en rangement (méthode Marie Kondo). Ces services peuvent être combinés selon vos besoins.",
  },
  {
    q: "Intervenez-vous aussi pour les professionnels ?",
    a: "Notre déclaration SAP concerne les prestations aux particuliers (crédit d'impôt). Pour les professionnels — locaux, bureaux, ou gestion de biens en location — nous proposons une offre dédiée : découvrez notre conciergerie locative ou contactez-nous.",
  },
  {
    q: "Que couvre exactement l'entretien ménager ?",
    a: "L'entretien comprend le ménage complet (dépoussiérage, aspiration, lavage des sols), le nettoyage des surfaces et plans de travail, la désinfection des pièces humides (WC, salle de bain), le nettoyage des vitres et le repassage. Chaque intervention est adaptée à votre domicile et vos priorités.",
  },
  {
    q: "Puis-je avoir plusieurs services en même temps ?",
    a: "Absolument ! Vous pouvez combiner par exemple ménage + préparation de repas lors d'une même visite, ou courses + rangement. Nous organisons l'intervention selon la durée et vos priorités.",
  },
  {
    q: "Le coaching rangement, c'est quoi exactement ?",
    a: "Notre coach certifiée méthode Marie Kondo commence par un diagnostic gratuit de votre intérieur. Selon vos besoins, elle vous propose un accompagnement (plusieurs séances guidées) ou une prestation intégrale où elle prend tout en charge. L'objectif : un espace ordonné et fonctionnel qui correspond à votre mode de vie.",
  },
  {
    q: "Dans quelles zones intervenez-vous ?",
    a: "Nous intervenons sur toute la Martinique : Centre (Lamentin, Rivière-Salée), Nord Atlantique, Nord Caraïbe, Sud (Diamant, Saint-Esprit). Notre siège est à Rivière-Salée mais nos intervenantes se déplacent partout sur l'île.",
  },
  {
    q: "Quels sont vos horaires d'intervention ?",
    a: `Nous intervenons du lundi au vendredi de 08h à 18h (${HORAIRES}). Des créneaux le samedi matin sont parfois disponibles selon les équipes — demandez lors de votre devis.`,
  },
  {
    q: "Combien de temps à l'avance faut-il réserver ?",
    a: "Idéalement 48 à 72h à l'avance pour les interventions ponctuelles. Pour les abonnements réguliers, un créneau fixe vous est attribué. En cas d'urgence, contactez-nous directement par WhatsApp — nous ferons notre possible.",
  },
  {
    q: "Que se passe-t-il si je dois annuler ?",
    a: "Nous demandons un préavis de 24h minimum pour annuler ou reporter une intervention. En deçà, une indemnité peut s'appliquer. En cas de force majeure (urgence médicale, etc.), nous faisons preuve de compréhension.",
  },
  {
    q: "Dois-je être présent pendant l'intervention ?",
    a: "Non, vous pouvez laisser un double de clé ou un code d'accès sécurisé. Nos intervenantes sont sélectionnées pour leur sérieux et leur discrétion. Un compte-rendu vous est transmis après chaque intervention.",
  },
  {
    q: "Vos intervenantes sont-elles qualifiées ?",
    a: "Toutes nos intervenantes sont recrutées pour leur sérieux, leur discrétion et leur expérience. Elles bénéficient d'une formation continue aux méthodes professionnelles de nettoyage, rangement et aide à la personne.",
  },
  {
    q: "Êtes-vous assurés en cas de casse ou d'accident ?",
    a: "Oui, J'MTD dispose d'une assurance responsabilité civile professionnelle. En cas de casse ou de dommage lors d'une intervention, vous êtes couvert. Signalez tout incident dans les 24h.",
  },
  {
    q: "Mes données personnelles sont-elles protégées ?",
    a: "Vos données sont traitées conformément au RGPD. Elles ne sont jamais partagées avec des tiers, sont conservées 3 ans maximum et vous pouvez demander leur suppression à tout moment. Consultez notre politique de confidentialité.",
  },
  {
    q: "J'MTD est-il déclaré Services à la Personne ?",
    a: "Oui, J'MTD est déclaré Services à la Personne (SAP) auprès de la DEETS Martinique, sous le numéro SAP802877779. Cette déclaration est la condition qui vous permet de bénéficier du crédit d'impôt de 50%. Notre numéro SIREN : 802 877 779.",
  },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQ_ENTRIES.map((entry) => ({
    "@type": "Question",
    "name": entry.q,
    "acceptedAnswer": { "@type": "Answer", "text": entry.a },
  })),
};

export default function Layout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
      {children}
    </>
  );
}

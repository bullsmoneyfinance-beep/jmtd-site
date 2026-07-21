// ─── Palette — inspirée du logo J'MTD (teal + rose/magenta) ───
export const AMBER = "#0DA9A4";       // teal principal (couleur "TD" du logo) — pour FONDS/dégradés/déco
export const AMBER_DARK = "#0891A0"; // teal foncé (hover)
export const TEAL_TEXT = "#0B7C78";   // teal accessible (≥4.5:1 sur blanc) — pour TEXTE, liens, petites icônes
export const PINK = "#D4197A";        // rose/magenta (couleur "J'm" du logo)
export const PINK_DARK = "#B01368";   // rose foncé
export const EMERALD = "#10B981";
export const NAVY = "#0D1B2A";
export const NAVY2 = "#0e2235";
export const TEXT = "#F8FAFC";
export const TEXT2 = "#94A3B8";
export const CARD_BG = "rgba(255,255,255,0.04)";
export const BORDER = "rgba(255,255,255,0.06)";

// ─── Entreprise ───
export const PHONE = "05 96 63 13 08";
export const PHONE_HREF = "tel:0596631308";
export const WHATSAPP = "https://wa.me/596696406743";
export const YOUTUBE  = "https://www.youtube.com/@JMTD-Martinique"; // ← URL de votre chaîne YouTube
export const ADDRESS = "Quartier Les Digues, 97215 Rivière-Salée, Martinique";
export const EMAIL = "contact@jmtd.fr";
export const HORAIRES = "Lun–Ven · 08h à 18h";
export const FONDATRICE = "Myriam Rovela";
export const SIRET = "802 877 779";
export const SITE_URL = "https://jmtd.fr";

// ─── Conformité Services à la Personne ───
// J'MTD est DÉCLARÉ SAP (portail NOVA / DEETS Martinique).
// Le n° de déclaration au format SAP + SIREN ouvre droit au crédit d'impôt 50 %.
export const DECLARATION_SAP = "SAP802877779";
export const TUTELLE_SAP = "DEETS Martinique";
export const CREDIT_IMPOT_TAUX = 0.5; // 50 %

// ─── Services ───
export const SERVICES = [
  {
    id: "entretien",
    icon: "🏠",
    title: "Entretien & Nettoyage",
    headline: "Un domicile impeccable, sans lever le petit doigt",
    short: "Ménage, repassage, nettoyage complet",
    desc: "L'équipe J'MTD se déplace chez vous à Rivière-Salée, au Diamant, au Lamentin et dans les communes du Centre et du Sud de la Martinique pour l'entretien et le nettoyage complet de votre intérieur. Travail sérieux, discret et toujours avec le sourire.",
    details: [
      "Ménage complet de votre domicile",
      "Repassage et entretien du linge",
      "Nettoyage des vitres et surfaces",
      "Désinfection des pièces humides",
      "Entretien des sols (aspiration + lavage)",
    ],
    img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&h=350&fit=crop&auto=format",
  },
  {
    id: "repas",
    icon: "🍽️",
    title: "Préparation des repas",
    headline: "Des repas faits maison, sans vous fatiguer",
    short: "Cuisine à domicile, repas équilibrés",
    desc: "J'MTD prépare vos repas directement chez vous, selon vos goûts et vos contraintes alimentaires. Des repas faits maison, équilibrés et savoureux, sans que vous n'ayez à lever le petit doigt.",
    details: [
      "Préparation de repas équilibrés et savoureux",
      "Cuisine selon vos habitudes et régimes",
      "Aide aux personnes à mobilité réduite",
      "Respect des contraintes diététiques",
      "Rangement et nettoyage après cuisson",
    ],
    img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=350&fit=crop&auto=format",
  },
  {
    id: "courses",
    icon: "🛒",
    title: "Livraison de courses",
    headline: "Vos courses livrées chez vous, sans vous déplacer",
    short: "Commissions, courses, livraison à domicile",
    desc: "J'MTD s'occupe de vos commissions selon votre liste et vous les livre directement chez vous, dans les délais convenus. De Rivière-Salée à Saint-Esprit, nous intervenons dans le Centre et le Sud de la Martinique.",
    details: [
      "Courses selon votre liste personnalisée",
      "Livraison à domicile dans le Centre et le Sud",
      "Respect de vos habitudes d'achat",
      "Gestion des produits frais et surgelés",
      "Rangement des courses à votre domicile",
    ],
    img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&h=350&fit=crop&auto=format",
  },
  {
    id: "assistance",
    icon: "📋",
    title: "Assistance administrative",
    headline: "Vos démarches administratives simplifiées",
    short: "Paperasse, courrier, démarches en ligne",
    desc: "J'MTD vous accompagne dans vos démarches administratives : tri du courrier, saisie informatique, aide aux formulaires, classement de documents. Un service discret et fiable.",
    details: [
      "Tri et classement du courrier",
      "Aide à la saisie informatique",
      "Accompagnement aux démarches en ligne",
      "Classement et archivage de documents",
      "Aide aux formulaires administratifs",
    ],
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&h=350&fit=crop&auto=format",
  },
  {
    id: "rangement",
    icon: "🗂️",
    title: "Coach en rangement",
    headline: "Un intérieur ordonné qui transforme votre vie",
    short: "Méthode Marie Kondo · 3 formules",
    desc: "Fan absolue de Marie Kondo, notre spécialiste du rangement étudie vos besoins, vos habitudes de vie et vos attentes. Un diagnostic initial nous permettra de vous présenter le travail à réaliser.",
    details: [
      "Diagnostic initial de votre intérieur",
      "Recommandations et conseils personnalisés",
      "Accompagnement au rangement (multi-séances)",
      "Prestation de rangement intégrale",
      "Intervention dans toutes les pièces",
    ],
    img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&h=350&fit=crop&auto=format",
    special: true,
  },
];

// ─── Zones réellement couvertes (Centre + Sud) ───
export const ZONES = [
  "Rivière-Salée",
  "Le Lamentin",
  "Fort-de-France",
  "Le Diamant",
  "Sainte-Luce",
  "Trois-Îlets",
  "Le Marin",
  "Saint-Esprit",
];

// ─── Témoignages ───
// ⚠️ PLACEHOLDERS à remplacer par de vrais avis clients (Samuel les collectera).
// Rédigés « résultat + émotion » pour la conversion — ne pas afficher de faux badge « vérifié ».
export const TESTIMONIALS = [
  {
    name: "Marie-Hélène T.",
    city: "Fort-de-France",
    role: "Cliente particulière",
    stars: 5,
    text: "Avant, le ménage me prenait tout mon samedi. Aujourd'hui, j'ai retrouvé mes week-ends pour ma famille. L'équipe travaille comme si c'était chez elle — sérieuse, discrète, jamais besoin de surveiller. Enfin une agence de confiance en Martinique.",
  },
  {
    name: "Jean-Luc B.",
    city: "Rivière-Salée",
    role: "Client particulier",
    stars: 5,
    text: "Après le coaching rangement, notre maison respire enfin. Chaque chose a sa place, on retrouve tout en quelques secondes, on reçoit sans stress. Ce n'était pas juste du rangement : c'est notre quotidien qui a changé.",
  },
  {
    name: "Claudine M.",
    city: "Le Diamant",
    role: "Cliente particulière",
    stars: 5,
    text: "Les courses, c'était ma corvée de la semaine. Je donne ma liste, tout est livré et rangé chez moi. Avec le crédit d'impôt, le coût réel est minime. C'est devenu un vrai réflexe, je ne reviendrais en arrière pour rien au monde.",
  },
  {
    name: "Cabinet Ravel & Associés",
    city: "Le Lamentin",
    role: "Client entreprise",
    stars: 5,
    text: "Nous confions l'entretien de nos locaux à J'MTD depuis plusieurs mois. Ponctualité, rigueur, interlocuteur unique : un vrai partenaire professionnel, fiable et réactif. Nos bureaux sont toujours impeccables pour accueillir nos clients.",
  },
];

// ─── Données privé ───
export const DEMO_EMPS = [
  { id: "e1", name: "Marie-Louise D.", pin: "1234", zone: "Centre", role: "Aide ménagère" },
  { id: "e2", name: "Sylvie B.", pin: "5678", zone: "Nord", role: "Préparation repas" },
  { id: "e3", name: "Fabienne R.", pin: "9012", zone: "Sud", role: "Coach rangement" },
];

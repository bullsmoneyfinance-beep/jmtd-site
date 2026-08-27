export default function manifest() {
  return {
    name: "J'MTD — Services à la personne Martinique",
    short_name: "J'MTD",
    description: "Entretien, repas, courses, coach rangement à domicile en Martinique. Déclaré SAP — 50% crédit d'impôt.",
    id: "/",
    scope: "/",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0DA9A4",
    orientation: "portrait",
    lang: "fr",
    // Icônes carrées réelles (logo.png est rectangulaire : il était déformé)
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // Variante « maskable » : Android rogne en cercle sur ~80 % du carré →
      // logo réduit à 58 % pour rester entier (icon-512 serait coupé).
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: "Devis gratuit",
        url: "/contact",
        description: "Demander un devis gratuit",
      },
      {
        name: "Nos prestations",
        url: "/services",
        description: "Découvrir nos services",
      },
      {
        name: "Nos tarifs",
        url: "/tarifs",
        description: "Consulter les tarifs",
      },
    ],
    categories: ["lifestyle", "home", "services"],
  };
}

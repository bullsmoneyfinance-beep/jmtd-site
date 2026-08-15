import "./globals.css";
import { Cormorant_Garamond, DM_Sans, Dancing_Script } from "next/font/google";
import ConditionalLayout from "../components/ConditionalLayout";

// Polices auto-hébergées (next/font) — supprime la requête bloquante vers
// Google Fonts et applique automatiquement font-display: swap. Les noms de
// famille générés correspondent exactement aux fontFamily inline existants
// (ex: "'Cormorant Garamond', Georgia, serif") : aucune autre modification
// de code n'est nécessaire pour que le site utilise les polices auto-hébergées.
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const dancingScript = Dancing_Script({ subsets: ["latin"], weight: ["700"], display: "swap" });
const fontClasses = `${cormorant.className} ${dmSans.className} ${dancingScript.className}`;

// URL de base : variable d'env en priorité, sinon Vercel URL, sinon fallback production
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://jmtd-site.vercel.app");

export const metadata = {
  title: "J'MTD — Société de services sur mesure en Martinique",
  description: "Entretien, préparation de repas, livraison de courses, assistance administrative, coach rangement dans le Centre et le Sud de la Martinique (Rivière-Salée, Lamentin, Diamant…). Déclaré SAP — 50% crédit d'impôt. Devis gratuit.",
  keywords: "services à la personne, aide à domicile, ménage, coach rangement, Martinique, Rivière-Salée, services sur mesure",
  authors: [{ name: "J'MTD" }],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "J'MTD — Société de services sur mesure en Martinique",
    description: "Entretien, préparation de repas, livraison de courses et coach rangement dans le Centre et le Sud de la Martinique.",
    url: SITE_URL,
    siteName: "J'MTD",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "J'MTD — Société de services sur mesure en Martinique",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "J'MTD — Société de services sur mesure en Martinique",
    description: "Ménage, repas, courses, coach rangement dans le Centre et le Sud de la Martinique. Déclaré SAP — 50% crédit d'impôt.",
    images: [`${SITE_URL}/opengraph-image`],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/logo.png", sizes: "any" },
    ],
    // apple-touch-icon : généré par app/apple-icon.jsx (carré 180×180, opaque)
  },
  // « Ajouter à l'écran d'accueil » sur iOS : sans ceci, le site s'ouvre dans
  // Safari avec la barre d'adresse au lieu de se lancer en plein écran.
  appleWebApp: {
    capable: true,
    title: "J'MTD",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
  manifest: "/manifest.webmanifest",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  // Permet au contenu de passer sous l'encoche / la barre d'accueil,
  // que l'on compense ensuite avec les env(safe-area-inset-*) en CSS.
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1523" },
  ],
};

const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "J'MTD",
  "description": "Société de services à la personne déclarée SAP, intervenant dans le Centre et le Sud de la Martinique. Entretien, préparation de repas, livraison de courses, assistance administrative, coach rangement.",
  "url": "https://jmtd.fr",
  "logo": "https://jmtd.fr/logo.png",
  "image": "https://jmtd.fr/logo.png",
  "telephone": "+596596631308",
  "email": "contact@jmtd.fr",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Quartier Les Digues",
    "addressLocality": "Rivière-Salée",
    "postalCode": "97215",
    "addressRegion": "Martinique",
    "addressCountry": "FR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 14.5243,
    "longitude": -60.9937
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      "opens": "08:00",
      "closes": "18:00"
    }
  ],
  "areaServed": [
    { "@type": "City", "name": "Rivière-Salée" },
    { "@type": "City", "name": "Le Lamentin" },
    { "@type": "City", "name": "Fort-de-France" },
    { "@type": "City", "name": "Le Diamant" },
    { "@type": "City", "name": "Saint-Esprit" },
    { "@type": "City", "name": "Sainte-Luce" },
    { "@type": "City", "name": "Le Marin" },
    { "@type": "City", "name": "Trois-Îlets" }
  ],
  "priceRange": "€€",
  "sameAs": ["https://www.youtube.com/@JMTD-Martinique"],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Services à la personne",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Entretien & Nettoyage" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Préparation de repas" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Livraison de courses" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Assistance administrative" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Coach en rangement" } }
    ]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }}
        />
      </head>
      <body className={fontClasses} style={{ fontFamily: dmSans.style.fontFamily }}>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}

import "./globals.css";
import ConditionalLayout from "../components/ConditionalLayout";

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
  description: "Entretien, préparation de repas, livraison de courses, assistance administrative, coach rangement à Rivière-Salée et toute la Martinique. Agrément SAP. Devis gratuit.",
  keywords: "services à la personne, aide à domicile, ménage, coach rangement, Martinique, Rivière-Salée, services sur mesure",
  authors: [{ name: "J'MTD" }],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "J'MTD — Société de services sur mesure en Martinique",
    description: "Entretien, préparation de repas, livraison de courses et coach rangement à Rivière-Salée et toute la Martinique.",
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
    description: "Ménage, repas, courses, coach rangement en Martinique. Agrément SAP — 50% crédit d'impôt.",
    images: [`${SITE_URL}/opengraph-image`],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/logo.png", sizes: "any" },
    ],
    apple: [{ url: "/logo.png" }],
  },
  manifest: "/manifest.webmanifest",
};

const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "J'MTD",
  "description": "Société de services à la personne agréée SAP en Martinique. Entretien, préparation de repas, livraison de courses, assistance administrative, coach rangement.",
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
  "areaServed": {
    "@type": "AdministrativeArea",
    "name": "Martinique"
  },
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;600;700&family=Dancing+Script:wght@700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }}
        />
      </head>
      <body>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}

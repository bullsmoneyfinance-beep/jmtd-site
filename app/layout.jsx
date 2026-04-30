import "./globals.css";
import ConditionalLayout from "../components/ConditionalLayout";

export const metadata = {
  title: "J'MTD — Société de services sur mesure en Martinique",
  description: "Entretien, préparation de repas, livraison de courses, assistance administrative, coach rangement à Rivière-Salée et toute la Martinique. Agrément SAP. Devis gratuit.",
  keywords: "services à la personne, aide à domicile, ménage, coach rangement, Martinique, Rivière-Salée, services sur mesure",
  authors: [{ name: "J'MTD" }],
  metadataBase: new URL("https://jmtd.fr"),
  openGraph: {
    title: "J'MTD — Société de services sur mesure en Martinique",
    description: "Entretien, préparation de repas, livraison de courses et coach rangement à Rivière-Salée et toute la Martinique.",
    url: "https://jmtd.fr",
    siteName: "J'MTD",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
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
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;600;700&family=Dancing+Script:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}

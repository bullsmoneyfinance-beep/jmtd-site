import "./globals.css";
import ConditionalLayout from "../components/ConditionalLayout";

export const metadata = {
  title: "J'MTD — Services à la Personne en Martinique",
  description: "Aide à domicile, ménage, jardinage, garde d'enfants, coach rangement à Rivière-Salée et toute la Martinique. Agrément SAP. Devis gratuit.",
  keywords: "services à la personne, aide à domicile, ménage, jardinage, Martinique, Rivière-Salée, coach rangement",
  authors: [{ name: "J'MTD" }],
  metadataBase: new URL("https://jmtd.fr"),
  openGraph: {
    title: "J'MTD — Services à la Personne en Martinique",
    description: "Aide à domicile, ménage, jardinage, garde d'enfants à Rivière-Salée et toute la Martinique.",
    url: "https://jmtd.fr",
    siteName: "J'MTD",
    locale: "fr_FR",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}

import "./globals.css";

export const metadata = {
  title: "J'MTD - Services à la personne en Martinique",
  description:
    "J'MTD propose des services à la personne de qualité en Martinique : ménage, garde d'enfants, aide aux seniors et bien plus.",
  keywords: "services à la personne, Martinique, ménage, garde enfants, aide seniors, JMTD",
  openGraph: {
    title: "J'MTD - Services à la personne en Martinique",
    description:
      "J'MTD propose des services à la personne de qualité en Martinique.",
    url: "https://jmtd.fr",
    siteName: "J'MTD",
    locale: "fr_FR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://jmtd.fr"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

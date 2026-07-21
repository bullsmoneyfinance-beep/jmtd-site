import { SITE_URL } from "../lib/data";

export default function sitemap() {
  const base = SITE_URL || "https://jmtd.fr";
  const now = new Date();

  return [
    { url: base,                   lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/services`,     lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/conciergerie`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/tarifs`,       lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/coach`,        lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/coaching`,     lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/conseils`,     lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/faq`,          lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`,      lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/recrutement`,  lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/mentions-legales`,            lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/politique-confidentialite`,   lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}

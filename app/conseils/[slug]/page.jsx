import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL, TEAL_TEXT } from "../../../lib/data";
import { ARTICLES, getArticleBySlug } from "../articlesData";

const T     = "#0DA9A4";
const P     = "#D4197A";
const TEXT  = "#1A2D3D";
const MUTED = "#64748B";
const WARM  = "#FFF8F4";

const BASE = SITE_URL || "https://jmtd.fr";
const MAX_DESC = 155;

function truncate(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`;
}

export function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }));
}

export function generateMetadata({ params }) {
  const article = getArticleBySlug(params.slug);
  if (!article) return { title: "Article introuvable | J'MTD" };

  return {
    title: `${article.seoTitle} | J'MTD`,
    description: truncate(article.desc, MAX_DESC),
    alternates: { canonical: `${BASE}/conseils/${article.slug}` },
  };
}

export default function ArticlePage({ params }) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: truncate(article.desc, MAX_DESC),
    inLanguage: "fr-FR",
    mainEntityOfPage: `${BASE}/conseils/${article.slug}`,
    author: { "@type": "Organization", name: "J'MTD" },
    publisher: { "@type": "Organization", name: "J'MTD", url: BASE },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── En-tête article ── */}
      <section style={{ background: `linear-gradient(160deg, ${WARM} 0%, #EAF7F6 100%)`, padding: "72px 24px 56px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>

          {/* Fil d'ariane */}
          <nav aria-label="Fil d'ariane" style={{ fontSize: 13, color: MUTED, marginBottom: 22 }}>
            <Link href="/conseils" style={{ color: TEAL_TEXT, fontWeight: 700, textDecoration: "none" }}>
              Conseils &amp; astuces
            </Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span>{article.tag}</span>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: article.color, background: `${article.color}14`, border: `1px solid ${article.color}30`, borderRadius: 20, padding: "5px 14px", textTransform: "uppercase", letterSpacing: 0.8 }}>
              {article.tag}
            </span>
            <span style={{ fontSize: 13, color: MUTED }}>{article.duration} de lecture</span>
          </div>

          <h1 className="display" style={{ fontSize: "clamp(26px, 4.2vw, 44px)", color: TEXT, lineHeight: 1.2, marginBottom: 20 }}>
            {article.title}
          </h1>

          <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.85, margin: 0, borderLeft: `3px solid ${article.color}`, paddingLeft: 18 }}>
            {article.desc}
          </p>
        </div>
      </section>

      {/* ── Corps de l'article ── */}
      <section style={{ background: "#fff", padding: "64px 24px 72px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>

          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, color: TEXT, marginBottom: 24 }}>
            Points clés à retenir
          </h2>

          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 48px", display: "flex", flexDirection: "column", gap: 12 }}>
            {article.tips.map((tip, i) => (
              <li key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "16px 18px", background: `${article.color}08`, borderRadius: 14, border: `1px solid ${article.color}18` }}>
                <span aria-hidden style={{ width: 24, height: 24, borderRadius: "50%", background: `${article.color}22`, border: `1.5px solid ${article.color}40`, color: article.color, fontWeight: 800, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: 15.5, color: TEXT, lineHeight: 1.7 }}>{tip}</span>
              </li>
            ))}
          </ul>

          {/* ── Appel à l'action ── */}
          <div style={{ background: `linear-gradient(135deg, ${T}12, ${P}0c)`, border: `1px solid ${T}28`, borderRadius: 20, padding: "28px 28px 30px", textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(20px, 2.6vw, 28px)", fontWeight: 700, color: TEXT, marginBottom: 10 }}>
              Vous préférez qu&apos;on s&apos;en occupe pour vous ?
            </h2>
            <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.75, marginBottom: 24, maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>
              J&apos;MTD intervient chez vous partout en Martinique. Ménage, repassage, entretien : demandez votre devis gratuit, 50&nbsp;% de crédit d&apos;impôt.
            </p>
            <Link href="/contact"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 30px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 800, fontSize: 15, textDecoration: "none", boxShadow: `0 8px 28px ${T}40` }}>
              Demander un devis gratuit →
            </Link>
          </div>

          <div style={{ marginTop: 40, textAlign: "center" }}>
            <Link href="/conseils" style={{ color: TEAL_TEXT, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
              ← Retour à tous les conseils
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}

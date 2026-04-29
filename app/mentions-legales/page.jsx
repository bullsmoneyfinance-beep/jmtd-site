import Link from "next/link";
import { EMAIL, PHONE, ADDRESS, SIRET, FONDATRICE } from "../../lib/data";

const T = "#0DA9A4";
const TEXT = "#1A2D3D";
const MUTED = "#64748B";

export const metadata = {
  title: "Mentions légales — J'MTD",
  description: "Mentions légales du site jmtd.fr, société de services à la personne en Martinique.",
};

const SECTIONS = [
  {
    title: "1. Éditeur du site",
    content: [
      "Le site jmtd.fr est édité par :",
      "Raison sociale : J'MTD",
      "Forme juridique : Entreprise individuelle",
      `Dirigeante : ${FONDATRICE}`,
      `SIRET : ${SIRET}`,
      "Agrément SAP : Agrément Services à la Personne",
      `Adresse : ${ADDRESS}`,
      `Téléphone : ${PHONE}`,
      `Email : ${EMAIL}`,
    ],
    isList: true,
  },
  {
    title: "2. Directrice de la publication",
    text: `${FONDATRICE}, en sa qualité de dirigeante de J'MTD.`,
  },
  {
    title: "3. Hébergement",
    content: [
      "Le site est hébergé par :",
      "Société : Vercel Inc.",
      "Adresse : 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
      "Site : vercel.com",
      "Région de déploiement : Europe (Paris, cdg1)",
    ],
    isList: true,
  },
  {
    title: "4. Propriété intellectuelle",
    text: "L'ensemble des éléments constituant ce site (textes, images, graphismes, logo, icônes, sons, logiciels, etc.) est la propriété exclusive de J'MTD ou fait l'objet d'une autorisation d'utilisation. Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de J'MTD.",
  },
  {
    title: "5. Responsabilité",
    text: "J'MTD s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Cependant, J'MTD ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site. En conséquence, J'MTD décline toute responsabilité pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur ce site.",
  },
  {
    title: "6. Liens hypertextes",
    text: "Le site peut contenir des liens vers d'autres sites internet. J'MTD n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.",
  },
  {
    title: "7. Données personnelles",
    text: null,
    custom: true,
  },
  {
    title: "8. Cookies",
    text: "Ce site utilise uniquement des cookies techniques nécessaires au fonctionnement du site. Aucun cookie publicitaire ou de suivi tiers n'est déposé sur votre appareil.",
  },
  {
    title: "9. Droit applicable",
    text: "Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront compétents.",
  },
  {
    title: "10. Contact",
    text: null,
    isContact: true,
  },
];

export default function MentionsLegalesPage() {
  return (
    <section style={{ background: "#F8FAFB", padding: "80px 24px", minHeight: "80vh" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${T}10`, border: `1px solid ${T}28`, borderRadius: 30, padding: "5px 14px", marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 1.5 }}>Légal</span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: TEXT, marginBottom: 12 }}>Mentions légales</h1>
          <p style={{ fontSize: 14, color: MUTED }}>Dernière mise à jour : avril 2025</p>
        </div>

        <div style={{ background: "#fff", border: `1px solid rgba(13,169,164,0.1)`, borderRadius: 20, padding: "40px 36px", boxShadow: `0 4px 24px rgba(13,169,164,0.06)` }}>
          {SECTIONS.map((section, idx) => (
            <div key={section.title} style={{ marginBottom: idx < SECTIONS.length - 1 ? 32 : 0 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: TEXT, marginBottom: 12, paddingBottom: 10, borderBottom: `1px solid rgba(13,169,164,0.1)` }}>
                {section.title}
              </h2>
              <div style={{ fontSize: 15, color: MUTED, lineHeight: 1.8 }}>
                {section.isList && (
                  <>
                    <p>{section.content[0]}</p>
                    <ul style={{ marginTop: 10, paddingLeft: 20 }}>
                      {section.content.slice(1).map(item => <li key={item}>{item}</li>)}
                    </ul>
                  </>
                )}
                {section.text && <p>{section.text}</p>}
                {section.custom && (
                  <p>
                    Le traitement de vos données personnelles est régi par notre{" "}
                    <Link href="/politique-confidentialite" style={{ color: T }}>politique de confidentialité</Link>,
                    conformément au RGPD — Règlement (UE) 2016/679.
                  </p>
                )}
                {section.isContact && (
                  <p>
                    Pour toute question, contactez-nous à{" "}
                    <a href={`mailto:${EMAIL}`} style={{ color: T }}>{EMAIL}</a> ou par téléphone au {PHONE}.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Link href="/" style={{ color: T, fontSize: 14 }}>← Retour à l&apos;accueil</Link>
          <Link href="/politique-confidentialite" style={{ color: MUTED, fontSize: 14 }}>Politique de confidentialité →</Link>
        </div>
      </div>
    </section>
  );
}

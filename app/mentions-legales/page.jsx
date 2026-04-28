import Link from "next/link";
import { EMAIL, PHONE, ADDRESS, SIRET, FONDATRICE, AMBER } from "../../lib/data";

export const metadata = {
  title: "Mentions légales — J'MTD",
  description: "Mentions légales du site jmtd.fr, société de services à la personne en Martinique.",
};

export default function MentionsLegalesPage() {
  return (
    <section style={{ background: "#0D1B2A", padding: "80px 24px", minHeight: "80vh" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: AMBER, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Légal</div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 40, fontWeight: 800, color: "#F8FAFC", marginBottom: 12 }}>Mentions légales</h1>
          <p style={{ fontSize: 14, color: "#475569" }}>Dernière mise à jour : avril 2025</p>
        </div>

        {[
          {
            title: "1. Éditeur du site",
            content: (
              <>
                <p>Le site <strong>jmtd.fr</strong> est édité par :</p>
                <ul style={{ marginTop: 12, paddingLeft: 20 }}>
                  <li><strong>Raison sociale :</strong> J&apos;MTD</li>
                  <li><strong>Forme juridique :</strong> Entreprise individuelle</li>
                  <li><strong>Dirigeante :</strong> {FONDATRICE}</li>
                  <li><strong>SIRET :</strong> {SIRET}</li>
                  <li><strong>Agrément SAP :</strong> Agrément Services à la Personne</li>
                  <li><strong>Adresse :</strong> {ADDRESS}</li>
                  <li><strong>Téléphone :</strong> {PHONE}</li>
                  <li><strong>Email :</strong> {EMAIL}</li>
                </ul>
              </>
            ),
          },
          {
            title: "2. Directrice de la publication",
            content: <p>{FONDATRICE}, en sa qualité de dirigeante de J&apos;MTD.</p>,
          },
          {
            title: "3. Hébergement",
            content: (
              <>
                <p>Le site est hébergé par :</p>
                <ul style={{ marginTop: 12, paddingLeft: 20 }}>
                  <li><strong>Société :</strong> Vercel Inc.</li>
                  <li><strong>Adresse :</strong> 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</li>
                  <li><strong>Site :</strong> vercel.com</li>
                  <li><strong>Région de déploiement :</strong> Europe (Paris, cdg1)</li>
                </ul>
              </>
            ),
          },
          {
            title: "4. Propriété intellectuelle",
            content: (
              <p>
                L&apos;ensemble des éléments constituant ce site (textes, images, graphismes, logo, icônes, sons, logiciels, etc.) est la propriété exclusive de J&apos;MTD ou fait l&apos;objet d&apos;une autorisation d&apos;utilisation. Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de J&apos;MTD.
              </p>
            ),
          },
          {
            title: "5. Responsabilité",
            content: (
              <p>
                J&apos;MTD s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des informations diffusées sur ce site. Cependant, J&apos;MTD ne peut garantir l&apos;exactitude, la précision ou l&apos;exhaustivité des informations mises à disposition sur ce site. En conséquence, J&apos;MTD décline toute responsabilité pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur ce site.
              </p>
            ),
          },
          {
            title: "6. Liens hypertextes",
            content: (
              <p>
                Le site peut contenir des liens vers d&apos;autres sites internet. J&apos;MTD n&apos;exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
              </p>
            ),
          },
          {
            title: "7. Données personnelles",
            content: (
              <p>
                Le traitement de vos données personnelles est régi par notre{" "}
                <Link href="/politique-confidentialite" style={{ color: AMBER }}>politique de confidentialité</Link>,
                conformément au Règlement Général sur la Protection des Données (RGPD) — Règlement (UE) 2016/679.
              </p>
            ),
          },
          {
            title: "8. Cookies",
            content: (
              <p>
                Ce site utilise uniquement des cookies techniques nécessaires au fonctionnement du site. Aucun cookie publicitaire ou de suivi tiers n&apos;est déposé sur votre appareil.
              </p>
            ),
          },
          {
            title: "9. Droit applicable",
            content: (
              <p>
                Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront compétents.
              </p>
            ),
          },
          {
            title: "10. Contact",
            content: (
              <p>
                Pour toute question concernant ces mentions légales, vous pouvez nous contacter à l&apos;adresse <a href={`mailto:${EMAIL}`} style={{ color: AMBER }}>{EMAIL}</a> ou par téléphone au {PHONE}.
              </p>
            ),
          },
        ].map(section => (
          <div key={section.title} style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#F8FAFC", marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {section.title}
            </h2>
            <div style={{ fontSize: 15, color: "#94A3B8", lineHeight: 1.8 }}>
              {section.content}
            </div>
          </div>
        ))}

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Link href="/" style={{ color: AMBER, fontSize: 14 }}>← Retour à l&apos;accueil</Link>
          <Link href="/politique-confidentialite" style={{ color: "#64748B", fontSize: 14 }}>Politique de confidentialité</Link>
        </div>
      </div>
    </section>
  );
}

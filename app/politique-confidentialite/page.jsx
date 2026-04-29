import Link from "next/link";
import { EMAIL, PHONE, FONDATRICE } from "../../lib/data";

const T = "#0DA9A4";
const TEXT = "#1A2D3D";
const MUTED = "#64748B";

export const metadata = {
  title: "Politique de confidentialité — J'MTD",
  description: "Politique de confidentialité et protection des données personnelles de J'MTD, conformément au RGPD.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <section style={{ background: "#F8FAFB", padding: "80px 24px", minHeight: "80vh" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${T}10`, border: `1px solid ${T}28`, borderRadius: 30, padding: "5px 14px", marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 1.5 }}>RGPD</span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: TEXT, marginBottom: 12 }}>Politique de confidentialité</h1>
          <p style={{ fontSize: 14, color: MUTED }}>Dernière mise à jour : avril 2025 · Conforme au RGPD (Règlement UE 2016/679)</p>
        </div>

        <div style={{ background: "#fff", border: `1px solid rgba(13,169,164,0.1)`, borderRadius: 20, padding: "40px 36px", boxShadow: `0 4px 24px rgba(13,169,164,0.06)` }}>
          {[
            {
              title: "1. Responsable du traitement",
              content: (
                <>
                  <p>Le responsable du traitement des données personnelles collectées sur jmtd.fr est :</p>
                  <ul style={{ marginTop: 10, paddingLeft: 20 }}>
                    <li><strong>Identité :</strong> J&apos;MTD, représentée par {FONDATRICE}</li>
                    <li><strong>Email :</strong> <a href={`mailto:${EMAIL}`} style={{ color: T }}>{EMAIL}</a></li>
                    <li><strong>Téléphone :</strong> {PHONE}</li>
                  </ul>
                </>
              ),
            },
            {
              title: "2. Données collectées",
              content: (
                <>
                  <p>Nous collectons les données suivantes uniquement lorsque vous remplissez notre formulaire de contact ou de devis :</p>
                  <ul style={{ marginTop: 10, paddingLeft: 20 }}>
                    <li>Nom et prénom</li>
                    <li>Numéro de téléphone</li>
                    <li>Adresse email (optionnel)</li>
                    <li>Commune de résidence (optionnel)</li>
                    <li>Type de prestation souhaitée</li>
                    <li>Message libre (optionnel)</li>
                  </ul>
                  <p style={{ marginTop: 10 }}>Nous ne collectons aucune donnée sensible au sens de l&apos;article 9 du RGPD.</p>
                </>
              ),
            },
            {
              title: "3. Finalité et base légale du traitement",
              content: (
                <>
                  <p>Vos données sont collectées et traitées pour les finalités suivantes :</p>
                  <ul style={{ marginTop: 10, paddingLeft: 20 }}>
                    <li><strong>Traitement de votre demande de devis</strong> — Base légale : exécution d&apos;un contrat (art. 6.1.b RGPD)</li>
                    <li><strong>Répondre à vos questions</strong> — Base légale : intérêt légitime (art. 6.1.f RGPD)</li>
                    <li><strong>Obligations légales comptables</strong> (si client) — Base légale : obligation légale (art. 6.1.c RGPD)</li>
                  </ul>
                  <p style={{ marginTop: 10 }}>Nous ne procédons à aucun traitement de marketing direct sans votre consentement explicite.</p>
                </>
              ),
            },
            {
              title: "4. Durée de conservation",
              content: (
                <ul style={{ paddingLeft: 20 }}>
                  <li><strong>Données de prospect (devis) :</strong> 3 ans à compter du dernier contact</li>
                  <li><strong>Données de client :</strong> 5 ans à compter de la fin de la relation commerciale</li>
                  <li>Au-delà de ces durées, vos données sont supprimées ou anonymisées.</li>
                </ul>
              ),
            },
            {
              title: "5. Destinataires des données",
              content: (
                <p>Vos données sont traitées exclusivement par J&apos;MTD et ne sont transmises à aucun tiers commercial. L&apos;hébergeur du site (Vercel Inc.) peut avoir accès aux données dans le cadre de l&apos;exploitation technique du site, dans le respect des garanties contractuelles appropriées.</p>
              ),
            },
            {
              title: "6. Vos droits",
              content: (
                <>
                  <p>Conformément au RGPD (art. 15 à 22), vous disposez des droits suivants :</p>
                  <ul style={{ marginTop: 10, paddingLeft: 20 }}>
                    <li><strong>Droit d&apos;accès :</strong> obtenir une copie de vos données</li>
                    <li><strong>Droit de rectification :</strong> corriger des données inexactes</li>
                    <li><strong>Droit à l&apos;effacement :</strong> demander la suppression de vos données</li>
                    <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
                    <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
                    <li><strong>Droit d&apos;opposition :</strong> s&apos;opposer à certains traitements</li>
                  </ul>
                  <p style={{ marginTop: 14 }}>
                    Pour exercer ces droits, contactez-nous à{" "}
                    <a href={`mailto:${EMAIL}`} style={{ color: T }}>{EMAIL}</a>.
                    Nous répondrons dans un délai d&apos;un mois (art. 12 RGPD).
                  </p>
                  <p style={{ marginTop: 10 }}>
                    Vous disposez également du droit d&apos;introduire une réclamation auprès de la <strong>CNIL</strong> :{" "}
                    <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color: T }}>www.cnil.fr</a>.
                  </p>
                </>
              ),
            },
            {
              title: "7. Sécurité des données",
              content: (
                <p>J&apos;MTD met en œuvre les mesures techniques et organisationnelles appropriées pour protéger vos données personnelles. Le site est hébergé sur une infrastructure sécurisée (HTTPS, infrastructure Vercel avec chiffrement en transit et au repos).</p>
              ),
            },
            {
              title: "8. Cookies",
              content: (
                <p>Le site jmtd.fr utilise uniquement des cookies techniques strictement nécessaires au fonctionnement du site. Aucun cookie publicitaire, de traçage ou analytique tiers n&apos;est déposé sur votre appareil.</p>
              ),
            },
            {
              title: "9. Modifications",
              content: (
                <p>J&apos;MTD se réserve le droit de modifier la présente politique de confidentialité à tout moment. La date de mise à jour figurant en haut de cette page fait foi.</p>
              ),
            },
            {
              title: "10. Contact",
              content: (
                <p>
                  Pour toute question relative à vos données, contactez {FONDATRICE} à{" "}
                  <a href={`mailto:${EMAIL}`} style={{ color: T }}>{EMAIL}</a>.
                </p>
              ),
            },
          ].map((section, idx, arr) => (
            <div key={section.title} style={{ marginBottom: idx < arr.length - 1 ? 32 : 0 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: TEXT, marginBottom: 12, paddingBottom: 10, borderBottom: `1px solid rgba(13,169,164,0.1)` }}>
                {section.title}
              </h2>
              <div style={{ fontSize: 15, color: MUTED, lineHeight: 1.8 }}>
                {section.content}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Link href="/" style={{ color: T, fontSize: 14 }}>← Retour à l&apos;accueil</Link>
          <Link href="/mentions-legales" style={{ color: MUTED, fontSize: 14 }}>Mentions légales</Link>
          <Link href="/contact" style={{ color: MUTED, fontSize: 14 }}>Exercer mes droits</Link>
        </div>
      </div>
    </section>
  );
}

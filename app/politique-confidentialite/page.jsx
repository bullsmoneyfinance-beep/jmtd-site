import Link from "next/link";
import { EMAIL, PHONE, FONDATRICE, AMBER } from "../../lib/data";

export const metadata = {
  title: "Politique de confidentialité — J'MTD",
  description: "Politique de confidentialité et protection des données personnelles de J'MTD, conformément au RGPD.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <section style={{ background: "#0D1B2A", padding: "80px 24px", minHeight: "80vh" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: AMBER, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>RGPD</div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 40, fontWeight: 800, color: "#F8FAFC", marginBottom: 12 }}>Politique de confidentialité</h1>
          <p style={{ fontSize: 14, color: "#475569" }}>Dernière mise à jour : avril 2025 · Conforme au RGPD (Règlement UE 2016/679)</p>
        </div>

        {[
          {
            title: "1. Responsable du traitement",
            content: (
              <>
                <p>Le responsable du traitement des données personnelles collectées sur jmtd.fr est :</p>
                <ul style={{ marginTop: 12, paddingLeft: 20 }}>
                  <li><strong>Identité :</strong> J&apos;MTD, représentée par {FONDATRICE}</li>
                  <li><strong>Email :</strong> <a href={`mailto:${EMAIL}`} style={{ color: AMBER }}>{EMAIL}</a></li>
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
                <ul style={{ marginTop: 12, paddingLeft: 20 }}>
                  <li>Nom et prénom</li>
                  <li>Numéro de téléphone</li>
                  <li>Adresse email (optionnel)</li>
                  <li>Commune de résidence (optionnel)</li>
                  <li>Type de prestation souhaitée</li>
                  <li>Message libre (optionnel)</li>
                </ul>
                <p style={{ marginTop: 12 }}>Nous ne collectons aucune donnée sensible au sens de l&apos;article 9 du RGPD.</p>
              </>
            ),
          },
          {
            title: "3. Finalité et base légale du traitement",
            content: (
              <>
                <p>Vos données sont collectées et traitées pour les finalités suivantes :</p>
                <ul style={{ marginTop: 12, paddingLeft: 20 }}>
                  <li><strong>Traitement de votre demande de devis</strong> — Base légale : exécution d&apos;un contrat (art. 6.1.b RGPD)</li>
                  <li><strong>Répondre à vos questions</strong> — Base légale : intérêt légitime (art. 6.1.f RGPD)</li>
                  <li><strong>Obligations légales comptables</strong> (si client) — Base légale : obligation légale (art. 6.1.c RGPD)</li>
                </ul>
                <p style={{ marginTop: 12 }}>Nous ne procédons à aucun traitement de marketing direct sans votre consentement explicite.</p>
              </>
            ),
          },
          {
            title: "4. Durée de conservation",
            content: (
              <ul style={{ paddingLeft: 20 }}>
                <li><strong>Données de prospect (devis) :</strong> 3 ans à compter du dernier contact</li>
                <li><strong>Données de client :</strong> 5 ans à compter de la fin de la relation commerciale (obligations comptables)</li>
                <li>Au-delà de ces durées, vos données sont supprimées ou anonymisées.</li>
              </ul>
            ),
          },
          {
            title: "5. Destinataires des données",
            content: (
              <p>
                Vos données sont traitées exclusivement par J&apos;MTD et ne sont transmises à aucun tiers commercial. Elles peuvent être transmises aux autorités compétentes sur réquisition légale. L&apos;hébergeur du site (Vercel Inc.) peut avoir accès aux données dans le cadre de l&apos;exploitation technique du site, dans le respect des garanties contractuelles appropriées (accord de traitement des données, clauses contractuelles types UE).
              </p>
            ),
          },
          {
            title: "6. Vos droits",
            content: (
              <>
                <p>Conformément au RGPD (art. 15 à 22), vous disposez des droits suivants concernant vos données personnelles :</p>
                <ul style={{ marginTop: 12, paddingLeft: 20 }}>
                  <li><strong>Droit d&apos;accès :</strong> obtenir une copie de vos données</li>
                  <li><strong>Droit de rectification :</strong> corriger des données inexactes</li>
                  <li><strong>Droit à l&apos;effacement :</strong> demander la suppression de vos données</li>
                  <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
                  <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
                  <li><strong>Droit d&apos;opposition :</strong> s&apos;opposer à certains traitements</li>
                </ul>
                <p style={{ marginTop: 16 }}>
                  Pour exercer ces droits, contactez-nous par email à{" "}
                  <a href={`mailto:${EMAIL}`} style={{ color: AMBER }}>{EMAIL}</a>{" "}
                  ou par courrier à l&apos;adresse indiquée dans nos <Link href="/mentions-legales" style={{ color: AMBER }}>mentions légales</Link>.
                  Nous répondrons dans un délai d&apos;un mois (art. 12 RGPD).
                </p>
                <p style={{ marginTop: 12 }}>
                  Vous disposez également du droit d&apos;introduire une réclamation auprès de la <strong>CNIL</strong> (Commission Nationale de l&apos;Informatique et des Libertés) : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color: AMBER }}>www.cnil.fr</a>.
                </p>
              </>
            ),
          },
          {
            title: "7. Sécurité des données",
            content: (
              <p>
                J&apos;MTD met en œuvre les mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre toute perte, destruction, altération, accès ou divulgation non autorisée. Le site est hébergé sur une infrastructure sécurisée (HTTPS, infrastructure Vercel avec chiffrement en transit et au repos).
              </p>
            ),
          },
          {
            title: "8. Cookies",
            content: (
              <p>
                Le site jmtd.fr utilise uniquement des cookies techniques strictement nécessaires au fonctionnement du site (navigation, mémorisation de vos choix de formulaire via sessionStorage). Aucun cookie publicitaire, de traçage ou analytique tiers n&apos;est déposé sur votre appareil. En conséquence, aucun bandeau de consentement aux cookies n&apos;est requis (article 82 de la loi Informatique et Libertés modifiée).
              </p>
            ),
          },
          {
            title: "9. Modifications",
            content: (
              <p>
                J&apos;MTD se réserve le droit de modifier la présente politique de confidentialité à tout moment. La date de mise à jour figurant en haut de cette page fait foi. En cas de modification substantielle, nous en informerons les personnes concernées par les moyens appropriés.
              </p>
            ),
          },
          {
            title: "10. Contact DPO",
            content: (
              <p>
                J&apos;MTD, en tant qu&apos;entreprise individuelle, n&apos;est pas soumise à l&apos;obligation de désigner un Délégué à la Protection des Données (DPO). Pour toute question relative à vos données, vous pouvez néanmoins contacter directement {FONDATRICE} à l&apos;adresse <a href={`mailto:${EMAIL}`} style={{ color: AMBER }}>{EMAIL}</a>.
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
          <Link href="/mentions-legales" style={{ color: "#64748B", fontSize: 14 }}>Mentions légales</Link>
          <Link href="/contact" style={{ color: "#64748B", fontSize: 14 }}>Exercer mes droits</Link>
        </div>
      </div>
    </section>
  );
}

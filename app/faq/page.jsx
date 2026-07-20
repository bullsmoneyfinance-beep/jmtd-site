"use client";
import { useState } from "react";
import Link from "next/link";
import { PHONE_HREF, WHATSAPP, HORAIRES } from "../../lib/data";

const T = "#0DA9A4";
const P = "#D4197A";
const TEXT = "#1A2D3D";
const MUTED = "#64748B";

const FAQ_DATA = [
  {
    cat: "💳 Tarifs & Paiement",
    items: [
      { q: "Comment fonctionne le crédit d'impôt à 50% ?", a: "Le crédit d'impôt pour services à la personne (SAP) vous permet de récupérer 50% du montant payé directement sur votre impôt. Si vous n'êtes pas imposable, l'État vous verse la somme sous forme de remboursement direct. Il suffit de déclarer les montants sur votre déclaration annuelle grâce à l'attestation fiscale que nous vous remettons chaque janvier." },
      { q: "Quels sont vos modes de paiement acceptés ?", a: "Nous acceptons le virement bancaire, le chèque, les espèces et le CESU (Chèque Emploi Service Universel). Le paiement s'effectue après chaque intervention ou en fin de mois selon votre préférence." },
      { q: "Puis-je payer avec le CESU préfinancé ?", a: "Oui, nous acceptons le CESU préfinancé. C'est même avantageux car il peut être combiné avec le crédit d'impôt dans certains cas. Renseignez-vous auprès de votre employeur ou de votre mutuelle." },
      { q: "Y a-t-il des frais de déplacement en plus ?", a: "Nos tarifs incluent les déplacements dans un rayon standard autour de Rivière-Salée. Pour les zones plus éloignées (Nord Atlantique, Presqu'île), des frais kilométriques peuvent s'appliquer — précisez votre commune lors du devis." },
      { q: "Proposez-vous des abonnements mensuels ?", a: "Oui ! Les abonnements hebdomadaires ou bi-hebdomadaires bénéficient de conditions tarifaires avantageuses par rapport aux interventions ponctuelles. Demandez un devis mensuel pour connaître notre offre fidélité." },
    ],
  },
  {
    cat: "🏠 Nos prestations",
    items: [
      { q: "Quelles prestations proposez-vous exactement ?", a: "J'MTD propose 5 services : entretien & nettoyage du domicile, préparation de repas à domicile, livraison de courses, assistance administrative et coaching en rangement (méthode Marie Kondo). Ces services peuvent être combinés selon vos besoins." },
      { q: "Intervenez-vous aussi pour les professionnels ?", a: "Notre déclaration SAP concerne les prestations aux particuliers (crédit d'impôt). Pour les professionnels — locaux, bureaux, ou gestion de biens en location — nous proposons une offre dédiée : découvrez notre conciergerie locative ou contactez-nous." },
      { q: "Que couvre exactement l'entretien ménager ?", a: "L'entretien comprend le ménage complet (dépoussiérage, aspiration, lavage des sols), le nettoyage des surfaces et plans de travail, la désinfection des pièces humides (WC, salle de bain), le nettoyage des vitres et le repassage. Chaque intervention est adaptée à votre domicile et vos priorités." },
      { q: "Puis-je avoir plusieurs services en même temps ?", a: "Absolument ! Vous pouvez combiner par exemple ménage + préparation de repas lors d'une même visite, ou courses + rangement. Nous organisons l'intervention selon la durée et vos priorités." },
      { q: "Le coaching rangement, c'est quoi exactement ?", a: "Notre coach certifiée méthode Marie Kondo commence par un diagnostic gratuit de votre intérieur. Selon vos besoins, elle vous propose un accompagnement (plusieurs séances guidées) ou une prestation intégrale où elle prend tout en charge. L'objectif : un espace ordonné et fonctionnel qui correspond à votre mode de vie." },
    ],
  },
  {
    cat: "📅 Interventions & Logistique",
    items: [
      { q: "Dans quelles zones intervenez-vous ?", a: "Nous intervenons sur toute la Martinique : Centre (Lamentin, Rivière-Salée), Nord Atlantique, Nord Caraïbe, Sud (Diamant, Saint-Esprit). Notre siège est à Rivière-Salée mais nos intervenantes se déplacent partout sur l'île." },
      { q: "Quels sont vos horaires d'intervention ?", a: `Nous intervenons du lundi au vendredi de 08h à 18h (${HORAIRES}). Des créneaux le samedi matin sont parfois disponibles selon les équipes — demandez lors de votre devis.` },
      { q: "Combien de temps à l'avance faut-il réserver ?", a: "Idéalement 48 à 72h à l'avance pour les interventions ponctuelles. Pour les abonnements réguliers, un créneau fixe vous est attribué. En cas d'urgence, contactez-nous directement par WhatsApp — nous ferons notre possible." },
      { q: "Que se passe-t-il si je dois annuler ?", a: "Nous demandons un préavis de 24h minimum pour annuler ou reporter une intervention. En deçà, une indemnité peut s'appliquer. En cas de force majeure (urgence médicale, etc.), nous faisons preuve de compréhension." },
      { q: "Dois-je être présent pendant l'intervention ?", a: "Non, vous pouvez laisser un double de clé ou un code d'accès sécurisé. Nos intervenantes sont sélectionnées pour leur sérieux et leur discrétion. Un compte-rendu vous est transmis après chaque intervention." },
    ],
  },
  {
    cat: "🔐 Confiance & Sécurité",
    items: [
      { q: "Vos intervenantes sont-elles qualifiées ?", a: "Toutes nos intervenantes sont recrutées pour leur sérieux, leur discrétion et leur expérience. Elles bénéficient d'une formation continue aux méthodes professionnelles de nettoyage, rangement et aide à la personne." },
      { q: "Êtes-vous assurés en cas de casse ou d'accident ?", a: "Oui, J'MTD dispose d'une assurance responsabilité civile professionnelle. En cas de casse ou de dommage lors d'une intervention, vous êtes couvert. Signalez tout incident dans les 24h." },
      { q: "Mes données personnelles sont-elles protégées ?", a: "Vos données sont traitées conformément au RGPD. Elles ne sont jamais partagées avec des tiers, sont conservées 3 ans maximum et vous pouvez demander leur suppression à tout moment. Consultez notre politique de confidentialité." },
      { q: "J'MTD est-il déclaré Services à la Personne ?", a: "Oui, J'MTD est déclaré Services à la Personne (SAP) auprès de la DEETS Martinique, sous le numéro SAP802877779. Cette déclaration est la condition qui vous permet de bénéficier du crédit d'impôt de 50%. Notre numéro SIREN : 802 877 779." },
    ],
  },
];

export default function FAQPage() {
  const [openItem, setOpenItem] = useState(null);
  const [activeSearch, setActiveSearch] = useState("");

  const allItems = FAQ_DATA.flatMap((cat, ci) => cat.items.map((item, ii) => ({ ...item, key: `${ci}-${ii}`, cat: cat.cat })));
  const filtered = activeSearch.trim().length > 1
    ? allItems.filter(i => i.q.toLowerCase().includes(activeSearch.toLowerCase()) || i.a.toLowerCase().includes(activeSearch.toLowerCase()))
    : null;

  return (
    <>
      <style>{`
        @keyframes floatOrb { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        .faq-item { border-bottom: 1px solid rgba(13,169,164,0.1); cursor: pointer; }
        .faq-item:last-child { border-bottom: none; }
        @media (max-width: 768px) {
          .faq-hero { padding: 40px 16px 32px !important; }
          .faq-main { padding: 32px 16px 80px !important; }
          .faq-layout { grid-template-columns: 1fr !important; }
          .faq-sidebar { display: none !important; }
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="faq-hero" style={{ background: "#fff", padding: "80px 24px 56px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: "8%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${T}14, transparent 70%)`, filter: "blur(50px)", animation: "floatOrb 14s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ maxWidth: 620, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${T}10`, border: `1px solid ${T}28`, borderRadius: 30, padding: "6px 18px", marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 1.5 }}>Questions fréquentes</span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 700, color: TEXT, lineHeight: 1.15, marginBottom: 16 }}>
            Toutes vos questions{" "}
            <span style={{ background: `linear-gradient(135deg, ${T}, ${P})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>sur J'MTD</span>
          </h1>
          <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.8, marginBottom: 32 }}>
            Tarifs, interventions, crédit d'impôt… Retrouvez toutes les réponses ici. Vous ne trouvez pas ? Contactez-nous directement.
          </p>

          {/* Recherche */}
          <div style={{ position: "relative", maxWidth: 480, margin: "0 auto" }}>
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 18 }}>🔍</span>
            <input
              value={activeSearch}
              onChange={e => setActiveSearch(e.target.value)}
              placeholder="Rechercher une question…"
              style={{ width: "100%", padding: "14px 16px 14px 46px", borderRadius: 30, border: `1.5px solid ${T}30`, background: "#fff", fontSize: 15, color: TEXT, outline: "none", boxSizing: "border-box", boxShadow: `0 4px 20px ${T}10` }}
            />
          </div>
        </div>
      </section>

      {/* ── Contenu ── */}
      <section className="faq-main" style={{ background: "#F8FAFB", padding: "48px 24px 80px" }}>
        <div style={{ maxWidth: 1050, margin: "0 auto" }}>

          {/* Résultats de recherche */}
          {filtered && (
            <div style={{ marginBottom: 48 }}>
              <div style={{ fontSize: 13, color: MUTED, marginBottom: 16 }}>{filtered.length} résultat{filtered.length !== 1 ? "s" : ""} pour « {activeSearch} »</div>
              {filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 24px", background: "#fff", borderRadius: 20, border: `1px solid rgba(13,169,164,0.1)` }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🤔</div>
                  <p style={{ color: MUTED, marginBottom: 16 }}>Aucun résultat. Posez-nous directement votre question !</p>
                  <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 30, background: "#25D366", color: "#fff", fontWeight: 700, textDecoration: "none", fontSize: 14 }}>
                    💬 WhatsApp
                  </a>
                </div>
              ) : filtered.map(item => (
                <div key={item.key} className="faq-item"
                  style={{ background: "#fff", borderRadius: 16, marginBottom: 8, padding: "0 20px" }}
                  onClick={() => setOpenItem(openItem === item.key ? null : item.key)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, color: T, fontWeight: 700, marginBottom: 3 }}>{item.cat}</div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>{item.q}</div>
                    </div>
                    <span style={{ color: T, fontSize: 20, flexShrink: 0, transition: "transform 0.2s", transform: openItem === item.key ? "rotate(45deg)" : "none" }}>+</span>
                  </div>
                  {openItem === item.key && (
                    <div style={{ padding: "0 0 18px", fontSize: 14, color: MUTED, lineHeight: 1.8 }}>{item.a}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Catégories */}
          {!filtered && (
            <div className="faq-layout" style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 32, alignItems: "start" }}>

              {/* Sidebar ancres */}
              <div className="faq-sidebar" style={{ position: "sticky", top: 100 }}>
                <div style={{ background: "#fff", borderRadius: 18, border: `1px solid rgba(13,169,164,0.1)`, padding: "20px 18px" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Catégories</div>
                  {FAQ_DATA.map((cat, i) => (
                    <a key={i} href={`#cat-${i}`}
                      style={{ display: "block", padding: "8px 12px", borderRadius: 10, fontSize: 13, color: MUTED, textDecoration: "none", marginBottom: 4, transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = `${T}10`; e.currentTarget.style.color = T; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = MUTED; }}>
                      {cat.cat}
                    </a>
                  ))}
                </div>
              </div>

              {/* Accordéons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                {FAQ_DATA.map((cat, ci) => (
                  <div key={ci} id={`cat-${ci}`}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: TEXT, marginBottom: 16, paddingBottom: 12, borderBottom: `2px solid ${T}20` }}>
                      {cat.cat}
                    </h2>
                    <div style={{ background: "#fff", borderRadius: 20, border: `1px solid rgba(13,169,164,0.08)`, overflow: "hidden" }}>
                      {cat.items.map((item, ii) => {
                        const key = `${ci}-${ii}`;
                        return (
                          <div key={ii} className="faq-item"
                            style={{ padding: "0 24px" }}
                            onClick={() => setOpenItem(openItem === key ? null : key)}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", gap: 16 }}>
                              <span style={{ fontSize: 15, fontWeight: 600, color: TEXT, lineHeight: 1.4 }}>{item.q}</span>
                              <span style={{ color: T, fontSize: 22, flexShrink: 0, fontWeight: 300, transition: "transform 0.25s", transform: openItem === key ? "rotate(45deg)" : "none" }}>+</span>
                            </div>
                            {openItem === key && (
                              <div style={{ padding: "0 0 20px", fontSize: 14, color: MUTED, lineHeight: 1.85 }}>{item.a}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA aide */}
          <div style={{ marginTop: 56, background: `linear-gradient(135deg, ${T}10, ${P}06)`, border: `1px solid ${T}20`, borderRadius: 24, padding: "36px 32px", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>💬</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: TEXT, marginBottom: 10 }}>Vous ne trouvez pas votre réponse ?</h3>
            <p style={{ fontSize: 14, color: MUTED, marginBottom: 24, maxWidth: 440, margin: "0 auto 24px" }}>
              Notre équipe répond en moins de 24h. Par WhatsApp, par téléphone ou par email — choisissez ce qui vous convient.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 24px", borderRadius: 30, background: "#25D366", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                💬 WhatsApp
              </a>
              <a href={PHONE_HREF} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 24px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                📞 Appeler
              </a>
              <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 24px", borderRadius: 30, border: `1.5px solid ${T}40`, color: T, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                ✉️ Formulaire
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

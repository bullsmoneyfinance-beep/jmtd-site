"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { PHONE_HREF, WHATSAPP, HORAIRES, TEAL_TEXT } from "../../lib/data";
import Reveal from "../../components/Reveal";
import Icon from "../../components/Icon";

const T = "#0DA9A4";
const P = "#D4197A";
const OCEAN = "#12B5B0";
const TEXT = "#1A2D3D";
const MUTED = "#64748B";
const WARM = "#FFF8F4";

/* ── Imagerie Martinique / tropical-premium (Unsplash) ── */
const IMG = {
  greenery: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1600&h=900&fit=crop&auto=format&q=80", // feuillage vert rétroéclairé
  palm:     "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=900&h=1100&fit=crop&auto=format&q=80",  // frondes de palmier
};

/* Parallax générique — piloté par [data-parallax] (voir globals.css .parallax) */
function useParallax() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layers = Array.from(document.querySelectorAll("[data-parallax]"));
    if (!layers.length) return;
    let raf = null;
    const update = () => {
      const vh = window.innerHeight;
      layers.forEach(el => {
        const speed = parseFloat(el.getAttribute("data-parallax")) || 0.12;
        const r = el.getBoundingClientRect();
        const offset = r.top + r.height / 2 - vh / 2;
        el.style.transform = `translate3d(0, ${(-offset * speed).toFixed(1)}px, 0)`;
      });
      raf = null;
    };
    const onScroll = () => { if (raf == null) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}

const FAQ_DATA = [
  {
    cat: "Tarifs & Paiement", icon: "credit",
    items: [
      { q: "Comment fonctionne le crédit d'impôt à 50% ?", a: "Le crédit d'impôt pour services à la personne (SAP) vous permet de récupérer 50% du montant payé directement sur votre impôt. Si vous n'êtes pas imposable, l'État vous verse la somme sous forme de remboursement direct. Il suffit de déclarer les montants sur votre déclaration annuelle grâce à l'attestation fiscale que nous vous remettons chaque janvier." },
      { q: "Quels sont vos modes de paiement acceptés ?", a: "Nous acceptons le virement bancaire, le chèque, les espèces et le CESU (Chèque Emploi Service Universel). Le paiement s'effectue après chaque intervention ou en fin de mois selon votre préférence." },
      { q: "Puis-je payer avec le CESU préfinancé ?", a: "Oui, nous acceptons le CESU préfinancé. C'est même avantageux car il peut être combiné avec le crédit d'impôt dans certains cas. Renseignez-vous auprès de votre employeur ou de votre mutuelle." },
      { q: "Y a-t-il des frais de déplacement en plus ?", a: "Nos tarifs incluent les déplacements dans un rayon standard autour de Rivière-Salée. Pour les zones plus éloignées (Nord Atlantique, Presqu'île), des frais kilométriques peuvent s'appliquer — précisez votre commune lors du devis." },
      { q: "Proposez-vous des abonnements mensuels ?", a: "Oui ! Les abonnements hebdomadaires ou bi-hebdomadaires bénéficient de conditions tarifaires avantageuses par rapport aux interventions ponctuelles. Demandez un devis mensuel pour connaître notre offre fidélité." },
    ],
  },
  {
    cat: "Nos prestations", icon: "home",
    items: [
      { q: "Quelles prestations proposez-vous exactement ?", a: "J'MTD propose 5 services : entretien & nettoyage du domicile, préparation de repas à domicile, livraison de courses, assistance administrative et coaching en rangement (méthode Marie Kondo). Ces services peuvent être combinés selon vos besoins." },
      { q: "Intervenez-vous aussi pour les professionnels ?", a: "Notre déclaration SAP concerne les prestations aux particuliers (crédit d'impôt). Pour les professionnels — locaux, bureaux, ou gestion de biens en location — nous proposons une offre dédiée : découvrez notre conciergerie locative ou contactez-nous." },
      { q: "Que couvre exactement l'entretien ménager ?", a: "L'entretien comprend le ménage complet (dépoussiérage, aspiration, lavage des sols), le nettoyage des surfaces et plans de travail, la désinfection des pièces humides (WC, salle de bain), le nettoyage des vitres et le repassage. Chaque intervention est adaptée à votre domicile et vos priorités." },
      { q: "Puis-je avoir plusieurs services en même temps ?", a: "Absolument ! Vous pouvez combiner par exemple ménage + préparation de repas lors d'une même visite, ou courses + rangement. Nous organisons l'intervention selon la durée et vos priorités." },
      { q: "Le coaching rangement, c'est quoi exactement ?", a: "Notre coach certifiée méthode Marie Kondo commence par un diagnostic gratuit de votre intérieur. Selon vos besoins, elle vous propose un accompagnement (plusieurs séances guidées) ou une prestation intégrale où elle prend tout en charge. L'objectif : un espace ordonné et fonctionnel qui correspond à votre mode de vie." },
    ],
  },
  {
    cat: "Interventions & Logistique", icon: "annonces",
    items: [
      { q: "Dans quelles zones intervenez-vous ?", a: "Nous intervenons sur toute la Martinique : Centre (Lamentin, Rivière-Salée), Nord Atlantique, Nord Caraïbe, Sud (Diamant, Saint-Esprit). Notre siège est à Rivière-Salée mais nos intervenantes se déplacent partout sur l'île." },
      { q: "Quels sont vos horaires d'intervention ?", a: `Nous intervenons du lundi au vendredi de 08h à 18h (${HORAIRES}). Des créneaux le samedi matin sont parfois disponibles selon les équipes — demandez lors de votre devis.` },
      { q: "Combien de temps à l'avance faut-il réserver ?", a: "Idéalement 48 à 72h à l'avance pour les interventions ponctuelles. Pour les abonnements réguliers, un créneau fixe vous est attribué. En cas d'urgence, contactez-nous directement par WhatsApp — nous ferons notre possible." },
      { q: "Que se passe-t-il si je dois annuler ?", a: "Nous demandons un préavis de 24h minimum pour annuler ou reporter une intervention. En deçà, une indemnité peut s'appliquer. En cas de force majeure (urgence médicale, etc.), nous faisons preuve de compréhension." },
      { q: "Dois-je être présent pendant l'intervention ?", a: "Non, vous pouvez laisser un double de clé ou un code d'accès sécurisé. Nos intervenantes sont sélectionnées pour leur sérieux et leur discrétion. Un compte-rendu vous est transmis après chaque intervention." },
    ],
  },
  {
    cat: "Confiance & Sécurité", icon: "shield",
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
  useParallax();

  const allItems = FAQ_DATA.flatMap((cat, ci) => cat.items.map((item, ii) => ({ ...item, key: `${ci}-${ii}`, cat: cat.cat, catIcon: cat.icon })));
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
          .faq-hero { padding: 44px 16px 36px !important; }
          .faq-main { padding: 32px 16px 80px !important; }
          .faq-layout { grid-template-columns: 1fr !important; }
          .faq-sidebar { display: none !important; }
          .hero-palm { opacity: 0.5 !important; }
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="faq-hero" style={{ background: `linear-gradient(160deg, ${WARM} 0%, #EAF7F6 100%)`, padding: "88px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Calque feuillage tropical (parallax profond) */}
        <div aria-hidden data-parallax="0.16" className="parallax" style={{ position: "absolute", top: "-24%", left: 0, right: 0, height: "148%", zIndex: 0 }}>
          <img src={IMG.greenery} alt="" width={1600} height={900} loading="eager"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.18 }} />
        </div>
        {/* Frondes de palmier — accent tropical (droite) */}
        <div aria-hidden data-parallax="0.06" className="parallax hero-palm" style={{ position: "absolute", top: "-8%", right: "-6%", width: "clamp(180px, 28vw, 400px)", height: "116%", zIndex: 0, pointerEvents: "none" }}>
          <img src={IMG.palm} alt="" width={900} height={1100} loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.12, mixBlendMode: "multiply", maskImage: "linear-gradient(to left, #000 18%, transparent 90%)", WebkitMaskImage: "linear-gradient(to left, #000 18%, transparent 90%)" }} />
        </div>
        {/* Voile clair pour lisibilité */}
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(180deg, rgba(255,248,244,0.90) 0%, rgba(248,250,247,0.82) 46%, rgba(234,247,246,0.74) 100%)" }} />
        <div style={{ position: "absolute", top: -80, right: "8%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${T}14, transparent 70%)`, filter: "blur(50px)", animation: "floatOrb 14s ease-in-out infinite", pointerEvents: "none", zIndex: 1 }} />
        <div style={{ maxWidth: 620, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: `1.5px solid ${T}28`, borderRadius: 30, padding: "7px 18px", marginBottom: 20, boxShadow: "0 2px 14px rgba(13,169,164,0.12)" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: T, display: "inline-block" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: TEAL_TEXT, textTransform: "uppercase", letterSpacing: 1.5 }}>Questions fréquentes</span>
          </div>
          <h1 className="display" style={{ fontSize: "clamp(28px, 5vw, 48px)", color: TEXT, lineHeight: 1.15, marginBottom: 16 }}>
            Toutes vos questions{" "}
            <span style={{ background: `linear-gradient(135deg, ${T}, ${P})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>sur J'MTD</span>
          </h1>
          <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.8, marginBottom: 32 }}>
            Tarifs, interventions, crédit d'impôt… Retrouvez toutes les réponses ici. Vous ne trouvez pas ? Contactez-nous directement.
          </p>

          {/* Recherche */}
          <div style={{ position: "relative", maxWidth: 480, margin: "0 auto" }}>
            <Icon name="search" size={18} color={MUTED} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="search"
              aria-label="Rechercher une question dans la FAQ"
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
                  <Icon name="faq" size={40} color={MUTED} style={{ margin: "0 auto 12px" }} />
                  <p style={{ color: MUTED, marginBottom: 16 }}>Aucun résultat. Posez-nous directement votre question !</p>
                  <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 30, background: "#25D366", color: "#fff", fontWeight: 700, textDecoration: "none", fontSize: 14 }}>
                    <Icon name="chat" size={16} color="#fff" /> WhatsApp
                  </a>
                </div>
              ) : filtered.map(item => (
                <div key={item.key} className="faq-item"
                  style={{ background: "#fff", borderRadius: 16, marginBottom: 8, padding: "0 20px" }}>
                  <button type="button" aria-expanded={openItem === item.key}
                    onClick={() => setOpenItem(openItem === item.key ? null : item.key)}
                    style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", gap: 16, background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                    <span>
                      <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: TEAL_TEXT, fontWeight: 700, marginBottom: 3 }}><Icon name={item.catIcon} size={13} color={TEAL_TEXT} /> {item.cat}</span>
                      <span style={{ display: "block", fontSize: 15, fontWeight: 600, color: TEXT }}>{item.q}</span>
                    </span>
                    <span style={{ color: TEAL_TEXT, fontSize: 20, flexShrink: 0, transition: "transform 0.2s", transform: openItem === item.key ? "rotate(45deg)" : "none" }}>+</span>
                  </button>
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
                      style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 10, fontSize: 13, color: MUTED, textDecoration: "none", marginBottom: 4, transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = `${T}10`; e.currentTarget.style.color = TEAL_TEXT; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = MUTED; }}>
                      <Icon name={cat.icon} size={15} /> <span>{cat.cat}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Accordéons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                {FAQ_DATA.map((cat, ci) => (
                  <Reveal key={ci} id={`cat-${ci}`} delay={ci * 70}>
                    <h2 style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 18, fontWeight: 700, color: TEXT, marginBottom: 16, paddingBottom: 12, borderBottom: `2px solid ${T}20` }}>
                      <Icon name={cat.icon} size={19} color={TEAL_TEXT} /> {cat.cat}
                    </h2>
                    <div style={{ background: "#fff", borderRadius: 20, border: `1px solid rgba(13,169,164,0.08)`, overflow: "hidden", boxShadow: "0 4px 24px rgba(13,169,164,0.05)" }}>
                      {cat.items.map((item, ii) => {
                        const key = `${ci}-${ii}`;
                        return (
                          <div key={ii} className="faq-item" style={{ padding: "0 24px" }}>
                            <button type="button" aria-expanded={openItem === key}
                              onClick={() => setOpenItem(openItem === key ? null : key)}
                              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", gap: 16, background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                              <span style={{ fontSize: 15, fontWeight: 600, color: TEXT, lineHeight: 1.4 }}>{item.q}</span>
                              <span style={{ color: TEAL_TEXT, fontSize: 22, flexShrink: 0, fontWeight: 300, transition: "transform 0.25s", transform: openItem === key ? "rotate(45deg)" : "none" }}>+</span>
                            </button>
                            {openItem === key && (
                              <div style={{ padding: "0 0 20px", fontSize: 14, color: MUTED, lineHeight: 1.85 }}>{item.a}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {/* CTA aide */}
          <Reveal style={{ marginTop: 56, background: `linear-gradient(135deg, ${T}10, ${P}06)`, border: `1px solid ${T}20`, borderRadius: 24, padding: "36px 32px", textAlign: "center" }}>
            <Icon name="chat" size={36} color={TEAL_TEXT} style={{ margin: "0 auto 12px" }} />
            <h3 style={{ fontSize: 20, fontWeight: 700, color: TEXT, marginBottom: 10 }}>Vous ne trouvez pas votre réponse ?</h3>
            <p style={{ fontSize: 14, color: MUTED, marginBottom: 24, maxWidth: 440, margin: "0 auto 24px" }}>
              Notre équipe répond en moins de 24h. Par WhatsApp, par téléphone ou par email — choisissez ce qui vous convient.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 24px", borderRadius: 30, background: "#25D366", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                <Icon name="chat" size={16} color="#fff" /> WhatsApp
              </a>
              <a href={PHONE_HREF} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 24px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                <Icon name="phone" size={16} color="#fff" /> Appeler
              </a>
              <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 24px", borderRadius: 30, border: `1.5px solid ${T}40`, color: TEAL_TEXT, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                <Icon name="mail" size={16} color={TEAL_TEXT} /> Formulaire
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

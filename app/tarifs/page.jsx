"use client";
import { useState } from "react";
import Link from "next/link";
import { PHONE_HREF, WHATSAPP, SERVICES } from "../../lib/data";
import SapBadge from "../../components/SapBadge";

const T = "#0DA9A4";
const P = "#D4197A";
const TEXT = "#1A2D3D";
const MUTED = "#64748B";

// Prix net après crédit d'impôt 50 % — formatage FR (virgule décimale)
const net = (v) => (v / 2).toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

// Formules d'abonnement ménage — dégressif selon le volume hebdomadaire (positionnement premium)
const ABONNEMENTS = [
  { key: "ponctuel", label: "Ponctuel", tag: "Sans engagement", taux: 32, desc: "À la demande, quand vous voulez", features: ["Intervention à la carte", "Minimum 2h par passage", "Idéal pour un grand ménage"] },
  { key: "essentiel", label: "Essentiel", tag: "2 h / semaine", taux: 30, desc: "Le rythme confort pour un intérieur toujours net", features: ["Intervenante attitrée", "Créneau fixe réservé", "Produits fournis"] },
  { key: "confort", label: "Confort", tag: "3 à 4 h / semaine", taux: 29, popular: true, desc: "Notre formule la plus choisie", features: ["Intervenante attitrée", "Priorité sur le planning", "Repassage inclus", "Suivi qualité"] },
  { key: "premium", label: "Premium", tag: "6 h et + / semaine", taux: 28, desc: "Prise en charge complète de la maison", features: ["Référent dédié", "Planning sur-mesure", "Remplacement garanti", "Bilan mensuel"] },
];

const TARIFS = [
  {
    id: "entretien",
    icon: "🏠",
    title: "Entretien & Ménage",
    from: 32,
    unit: "h",
    popular: true,
    desc: "Ménage complet, repassage, vitres et surfaces, désinfection. Intervenante attitrée, produits professionnels fournis.",
    includes: ["Ménage complet du domicile", "Repassage & entretien du linge", "Nettoyage vitres & surfaces", "Sols : aspiration + lavage", "Désinfection pièces humides"],
    color: T,
    note: "Formules d'abonnement dégressives ci-dessous",
  },
  {
    id: "repas",
    icon: "🍽️",
    title: "Préparation des repas",
    from: 32,
    unit: "h",
    popular: false,
    desc: "Cuisine faite maison à votre domicile, selon vos goûts, régimes et contraintes diététiques.",
    includes: ["Repas équilibrés & savoureux", "Respect des régimes alimentaires", "Aide aux personnes à mobilité réduite", "Rangement & nettoyage après cuisson"],
    color: P,
  },
  {
    id: "courses",
    icon: "🛒",
    title: "Livraison de courses",
    from: 28,
    unit: "prestation",
    popular: false,
    desc: "Vos commissions faites selon votre liste et livrées chez vous, partout en Martinique.",
    includes: ["Courses sur liste personnalisée", "Livraison à domicile", "Gestion produits frais & surgelés", "Rangement des courses à domicile"],
    color: "#10B981",
  },
  {
    id: "assistance",
    icon: "📋",
    title: "Assistance administrative",
    from: 34,
    unit: "h",
    popular: false,
    desc: "Tri du courrier, démarches en ligne, saisie informatique, classement et archivage.",
    includes: ["Tri & classement du courrier", "Aide à la saisie informatique", "Accompagnement démarches en ligne", "Archivage de documents"],
    color: "#F59E0B",
  },
  {
    id: "jardinage",
    icon: "🌿",
    title: "Entretien extérieur & jardinage",
    from: 36,
    unit: "h",
    popular: false,
    desc: "Petits travaux de jardinage et entretien des extérieurs de votre domicile.",
    includes: ["Tonte, taille & désherbage", "Entretien des massifs & terrasses", "Ramassage & évacuation des déchets verts", "Nettoyage des abords"],
    color: "#16A34A",
    cap: "Plafond crédit d'impôt : 5 000 €/an/foyer",
  },
  {
    id: "rangement",
    icon: "🗂️",
    title: "Coach en rangement",
    from: null,
    unit: null,
    popular: false,
    desc: "Méthode Marie Kondo — 3 formules adaptées à votre intérieur et votre rythme.",
    includes: [],
    color: P,
    formules: [
      { label: "Diagnostic conseil", price: "Offert", desc: "Visite + plan de rangement personnalisé" },
      { label: "Séance accompagnée", price: "165€ / 3h", desc: "Rangement guidé, pièce par pièce" },
      { label: "Rangement intégral", price: "Sur devis", desc: "Prise en charge complète du domicile" },
    ],
  },
];

function SimulateurCredit() {
  const [tauxH, setTauxH] = useState(30);
  const [heures, setHeures] = useState(8);
  const brut = tauxH * heures;
  const credit = Math.round(brut * 0.5);
  const net = brut - credit;

  return (
    <div style={{ background: `linear-gradient(135deg, ${T}10, ${P}08)`, border: `1px solid ${T}25`, borderRadius: 24, padding: "32px 28px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <span style={{ fontSize: 28 }}>🧮</span>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: TEXT, margin: 0 }}>Simulateur crédit d'impôt</h3>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }} className="simu-grid">
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 8 }}>
            Taux horaire (€/h)
          </label>
          <input type="range" min="20" max="40" value={tauxH} onChange={e => setTauxH(+e.target.value)}
            style={{ width: "100%", accentColor: T, cursor: "pointer" }} />
          <div style={{ textAlign: "center", fontSize: 22, fontWeight: 800, color: T, marginTop: 6 }}>{tauxH}€/h</div>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 8 }}>
            Heures par mois
          </label>
          <input type="range" min="1" max="20" value={heures} onChange={e => setHeures(+e.target.value)}
            style={{ width: "100%", accentColor: T, cursor: "pointer" }} />
          <div style={{ textAlign: "center", fontSize: 22, fontWeight: 800, color: T, marginTop: 6 }}>{heures}h/mois</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }} className="simu-results">
        <div style={{ textAlign: "center", padding: "16px 12px", background: "rgba(255,255,255,0.7)", borderRadius: 16, border: "1px solid rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>Coût brut</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: TEXT }}>{brut}€</div>
          <div style={{ fontSize: 11, color: MUTED }}>par mois</div>
        </div>
        <div style={{ textAlign: "center", padding: "16px 12px", background: `linear-gradient(135deg, ${P}15, ${P}08)`, borderRadius: 16, border: `1px solid ${P}30` }}>
          <div style={{ fontSize: 11, color: P, fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>Crédit d'impôt</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: P }}>−{credit}€</div>
          <div style={{ fontSize: 11, color: MUTED }}>remboursé</div>
        </div>
        <div style={{ textAlign: "center", padding: "16px 12px", background: `linear-gradient(135deg, ${T}15, ${T}08)`, borderRadius: 16, border: `1px solid ${T}30` }}>
          <div style={{ fontSize: 11, color: T, fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>Coût réel</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: T }}>{net}€</div>
          <div style={{ fontSize: 11, color: MUTED }}>par mois</div>
        </div>
      </div>

      <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 16, textAlign: "center" }}>
        * Simulation indicative. Crédit d'impôt applicable aux particuliers. Sous réserve de conditions fiscales.
      </p>
    </div>
  );
}

export default function TarifsPage() {
  const [open, setOpen] = useState(null);

  return (
    <>
      <style>{`
        @keyframes floatOrb { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @media (max-width: 768px) {
          .tarifs-hero { padding: 40px 16px 32px !important; }
          .tarifs-section { padding: 32px 16px 80px !important; }
          .tarifs-grid { grid-template-columns: 1fr !important; }
          .abo-grid { grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
          .abo-grid > div { transform: none !important; }
          .abo-section { padding: 48px 16px 64px !important; }
          .simu-grid { grid-template-columns: 1fr !important; }
          .simu-results { grid-template-columns: 1fr !important; }
          .credit-explainer { grid-template-columns: 1fr !important; gap: 16px !important; }
          .tarifs-card-pad { padding: 20px 18px !important; }
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="tarifs-hero" style={{ background: "#fff", padding: "80px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: "8%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${T}14, transparent 70%)`, filter: "blur(50px)", animation: "floatOrb 14s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: "5%", width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${P}10, transparent 70%)`, filter: "blur(50px)", animation: "floatOrb 18s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${T}10`, border: `1px solid ${T}28`, borderRadius: 30, padding: "6px 18px", marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 1.5 }}>Tarifs & Devis</span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 5vw, 50px)", fontWeight: 700, color: TEXT, lineHeight: 1.15, marginBottom: 18 }}>
            Des tarifs clairs,{" "}
            <span style={{ background: `linear-gradient(135deg, ${T}, ${P})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              remboursés à 50%
            </span>
          </h1>
          <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.8, maxWidth: 540, margin: "0 auto 36px" }}>
            Toutes nos prestations ouvrent droit au <strong style={{ color: TEXT }}>crédit d'impôt SAP de 50%</strong>. Ce qui coûte 20€ ne vous revient qu'à 10€.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none", boxShadow: `0 8px 28px ${T}40` }}>
              Devis gratuit →
            </Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 30, background: "#25D366", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
              💬 WhatsApp rapide
            </a>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
            <SapBadge variant="inline" />
          </div>
        </div>
      </section>

      {/* ── Crédit d'impôt explication ── */}
      <section style={{ background: "#F8FAFB", padding: "56px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 700, color: TEXT, marginBottom: 10 }}>
              Comment fonctionne le crédit d'impôt ?
            </h2>
            <p style={{ fontSize: 15, color: MUTED }}>L'État rembourse 50% de vos dépenses SAP — automatiquement sur votre déclaration d'impôts.</p>
          </div>

          <div className="credit-explainer" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 40 }}>
            {[
              { step: "1", icon: "📋", title: "Vous commandez", desc: "Choisissez votre prestation et fréquence" },
              { step: "2", icon: "🏠", title: "On intervient", desc: "Nos professionnelles viennent chez vous" },
              { step: "3", icon: "🧾", title: "Attestation fiscale", desc: "Remise chaque année en janvier" },
              { step: "4", icon: "💳", title: "50% remboursé", desc: "Crédit sur votre déclaration d'impôts" },
            ].map(item => (
              <div key={item.step} style={{ textAlign: "center", padding: "24px 16px", background: "#fff", borderRadius: 20, border: `1px solid rgba(13,169,164,0.1)` }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg, ${T}, ${P})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: "#fff", fontWeight: 800, fontSize: 18 }}>{item.step}</div>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>

          <SimulateurCredit />
        </div>
      </section>

      {/* ── Grille tarifs ── */}
      <section className="tarifs-section" style={{ background: "#fff", padding: "72px 24px 80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 700, color: TEXT, marginBottom: 12 }}>
              Nos prestations & tarifs indicatifs
            </h2>
            <p style={{ fontSize: 15, color: MUTED, maxWidth: 520, margin: "0 auto" }}>
              Devis précis et personnalisé gratuit sur demande. Tarifs avant crédit d'impôt.
            </p>
          </div>

          <div className="tarifs-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {TARIFS.map(t => (
              <div key={t.id}
                style={{ background: "#fff", borderRadius: 22, border: t.popular ? `2px solid ${P}` : `1px solid rgba(13,169,164,0.12)`, boxShadow: t.popular ? `0 8px 40px ${P}18` : "0 4px 24px rgba(13,169,164,0.06)", padding: "28px 26px", position: "relative", display: "flex", flexDirection: "column", gap: 16 }}
                className="tarifs-card-pad">
                {t.popular && (
                  <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg, ${P}, ${T})`, color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 18px", borderRadius: 20, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: 0.8 }}>
                    ⭐ Le plus demandé
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: t.color + "18", border: `1.5px solid ${t.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
                    {t.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: TEXT, margin: 0, lineHeight: 1.3 }}>{t.title}</h3>
                    {t.from ? (
                      <div style={{ marginTop: 4 }}>
                        <span style={{ fontSize: 22, fontWeight: 800, color: t.color }}>À partir de {t.from}€</span>
                        <span style={{ fontSize: 13, color: MUTED }}>/{t.unit}</span>
                        <div style={{ fontSize: 11, color: T, fontWeight: 600, marginTop: 1 }}>→ {Math.round(t.from / 2)}€/{t.unit} après crédit d'impôt</div>
                      </div>
                    ) : (
                      <div style={{ marginTop: 4, fontSize: 13, color: MUTED }}>3 formules disponibles</div>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.7, margin: 0 }}>{t.desc}</p>

                {t.cap && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "#16A34A", background: "#16A34A12", border: "1px solid #16A34A28", borderRadius: 20, padding: "4px 11px", alignSelf: "flex-start" }}>
                    ⓘ {t.cap}
                  </div>
                )}
                {t.note && (
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: T, marginTop: -4 }}>↓ {t.note}</div>
                )}

                {t.formules ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {t.formules.map(f => (
                      <div key={f.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: `${t.color}08`, border: `1px solid ${t.color}18`, borderRadius: 12 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>{f.label}</div>
                          <div style={{ fontSize: 11, color: MUTED }}>{f.desc}</div>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: t.color, whiteSpace: "nowrap" }}>{f.price}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
                    {t.includes.map(item => (
                      <li key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: MUTED }}>
                        <span style={{ color: t.color, fontWeight: 800, flexShrink: 0 }}>✓</span> {item}
                      </li>
                    ))}
                  </ul>
                )}

                <Link href="/contact"
                  style={{ display: "block", textAlign: "center", padding: "12px", borderRadius: 30, background: t.popular ? `linear-gradient(135deg, ${P}, ${T})` : `${t.color}12`, border: t.popular ? "none" : `1px solid ${t.color}30`, color: t.popular ? "#fff" : t.color, fontWeight: 700, fontSize: 14, textDecoration: "none", marginTop: "auto", transition: "all 0.2s" }}>
                  Demander un devis →
                </Link>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 36, padding: "20px 24px", background: `${T}08`, border: `1px solid ${T}20`, borderRadius: 18 }}>
            <p style={{ fontSize: 14, color: MUTED, margin: 0 }}>
              💡 <strong style={{ color: TEXT }}>Devis gratuit et sans engagement</strong> — Nous nous déplaçons pour évaluer vos besoins avant tout engagement.{" "}
              <Link href="/contact" style={{ color: T, fontWeight: 700 }}>Prendre rendez-vous →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── Formules d'abonnement ménage ── */}
      <section className="abo-section" style={{ background: `linear-gradient(180deg, #F8FAFB, #fff)`, padding: "72px 24px 80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${P}10`, border: `1px solid ${P}28`, borderRadius: 30, padding: "6px 16px", marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: P, textTransform: "uppercase", letterSpacing: 1.2 }}>Ménage régulier · plus vous confiez, moins c'est cher</span>
            </div>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 700, color: TEXT, textAlign: "center", marginBottom: 12 }}>
            Formules d'abonnement
          </h2>
          <p style={{ fontSize: 15, color: MUTED, maxWidth: 560, margin: "0 auto 44px", textAlign: "center" }}>
            Un tarif dégressif selon votre volume hebdomadaire. Intervenante attitrée et créneau réservé dès la formule Essentiel.
          </p>

          <div className="abo-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, alignItems: "stretch" }}>
            {ABONNEMENTS.map(a => (
              <div key={a.key} style={{
                background: "#fff", borderRadius: 22, padding: "26px 22px", position: "relative",
                border: a.popular ? `2px solid ${P}` : "1px solid rgba(13,169,164,0.14)",
                boxShadow: a.popular ? `0 12px 44px ${P}20` : "0 4px 22px rgba(13,169,164,0.07)",
                display: "flex", flexDirection: "column", gap: 14,
                transform: a.popular ? "scale(1.03)" : "none", zIndex: a.popular ? 2 : 1,
              }}>
                {a.popular && (
                  <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg, ${P}, ${T})`, color: "#fff", fontSize: 10.5, fontWeight: 800, padding: "4px 16px", borderRadius: 20, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: 0.8 }}>
                    ⭐ Le plus choisi
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: TEXT }}>{a.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: a.popular ? P : T, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>{a.tag}</div>
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontSize: 34, fontWeight: 900, color: TEXT, lineHeight: 1 }}>{a.taux}€</span>
                    <span style={{ fontSize: 14, color: MUTED, fontWeight: 600 }}>/heure</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: T, marginTop: 6, background: `${T}10`, borderRadius: 10, padding: "6px 10px", display: "inline-block" }}>
                    soit {net(a.taux)}€/h après crédit d'impôt
                  </div>
                </div>
                <p style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.6, margin: 0 }}>{a.desc}</p>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  {a.features.map(f => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12.5, color: TEXT }}>
                      <span style={{ color: a.popular ? P : T, fontWeight: 900, flexShrink: 0 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" style={{
                  display: "block", textAlign: "center", padding: "12px", borderRadius: 30, marginTop: "auto",
                  background: a.popular ? `linear-gradient(135deg, ${P}, ${T})` : `${T}12`,
                  border: a.popular ? "none" : `1px solid ${T}30`,
                  color: a.popular ? "#fff" : T, fontWeight: 700, fontSize: 13.5, textDecoration: "none",
                }}>
                  Choisir cette formule →
                </Link>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 12.5, color: "#94A3B8", textAlign: "center", marginTop: 24 }}>
            Repas, courses, administratif et jardinage peuvent être ajoutés à toute formule. Tarifs indicatifs avant crédit d'impôt · engagement mensuel, résiliable avec préavis.
          </p>
        </div>
      </section>

      {/* ── FAQ mini ── */}
      <section style={{ background: "#F8FAFB", padding: "56px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, color: TEXT, textAlign: "center", marginBottom: 32 }}>
            Questions fréquentes sur les tarifs
          </h2>
          {[
            { q: "Le crédit d'impôt, c'est pour tout le monde ?", a: "Oui, pour tous les foyers fiscaux français (résidents en Martinique inclus), qu'ils soient imposables ou non. Si vous ne payez pas d'impôts, le crédit devient un remboursement direct." },
            { q: "Comment se passe le paiement ?", a: "Paiement par virement, chèque ou espèces après chaque intervention. Nous remettons une facture détaillée qui sert de justificatif pour votre déclaration d'impôts." },
            { q: "Y a-t-il un minimum d'heures à commander ?", a: "Oui, nous intervenons à partir de 2h minimum par passage pour garantir un travail de qualité. Pour les abonnements hebdomadaires ou mensuels, des forfaits avantageux sont disponibles." },
            { q: "Les tarifs changent-ils selon la distance ?", a: "Nos tarifs de base sont les mêmes partout en Martinique. Des frais de déplacement peuvent s'appliquer pour les zones éloignées — précisez votre commune dans le devis." },
          ].map((item, i) => (
            <div key={i}
              onClick={() => setOpen(open === i ? null : i)}
              style={{ borderBottom: "1px solid rgba(13,169,164,0.1)", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", gap: 16 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>{item.q}</span>
                <span style={{ color: T, fontSize: 20, flexShrink: 0, transition: "transform 0.2s", transform: open === i ? "rotate(45deg)" : "none" }}>+</span>
              </div>
              {open === i && (
                <div style={{ padding: "0 0 18px", fontSize: 14, color: MUTED, lineHeight: 1.8 }}>{item.a}</div>
              )}
            </div>
          ))}
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link href="/faq" style={{ fontSize: 14, color: T, fontWeight: 700, textDecoration: "none" }}>
              Voir toutes les questions fréquentes →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 700, color: TEXT, marginBottom: 16 }}>
            Prêt à nous confier votre domicile ?
          </h2>
          <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.8, marginBottom: 32 }}>
            Devis gratuit, réponse sous 24h. Aucun engagement avant validation.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 32px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none", boxShadow: `0 8px 32px ${T}40` }}>
              Devis gratuit →
            </Link>
            <a href={PHONE_HREF} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 24px", borderRadius: 30, border: `1.5px solid ${T}40`, color: T, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
              📞 Appeler directement
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

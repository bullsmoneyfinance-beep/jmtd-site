import { DECLARATION_SAP, TUTELLE_SAP, TEAL_TEXT } from "../lib/data";

const T = "#0DA9A4";
const P = "#D4197A";
const NAVY = "#0D1B2A";

/**
 * Badge officiel "Déclaré Services à la Personne".
 * J'MTD est déclaré (pas agréé) → mention conforme + n° de déclaration SAP + SIREN.
 *
 * variant:
 *  - "full"    : bloc complet avec explication crédit d'impôt (pages tarifs/contact)
 *  - "inline"  : pastille compacte (footer, hero)
 *  - "seal"    : sceau carré vertical (colonnes, encarts)
 */
export default function SapBadge({ variant = "inline" }) {
  if (variant === "inline") {
    return (
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 10,
        background: "#fff", border: `1.5px solid ${T}33`, borderRadius: 12,
        padding: "8px 14px", boxShadow: "0 2px 12px rgba(13,169,164,0.10)",
      }}>
        <SapMark size={30} />
        <div style={{ lineHeight: 1.25, textAlign: "left" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: NAVY, letterSpacing: 0.2 }}>
            Déclaré Services à la Personne
          </div>
          <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>
            N° {DECLARATION_SAP} · crédit d'impôt 50 %
          </div>
        </div>
      </div>
    );
  }

  if (variant === "seal") {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        background: "#fff", border: `1.5px solid ${T}2E`, borderRadius: 16,
        padding: "18px 16px", textAlign: "center", boxShadow: "0 4px 20px rgba(13,169,164,0.10)",
      }}>
        <SapMark size={46} />
        <div style={{ fontSize: 12.5, fontWeight: 800, color: NAVY, lineHeight: 1.3 }}>
          Déclaré<br />Services à la Personne
        </div>
        <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>N° {DECLARATION_SAP}</div>
        <div style={{
          fontSize: 10.5, fontWeight: 800, color: TEAL_TEXT, background: `${T}12`,
          borderRadius: 20, padding: "3px 10px",
        }}>
          Crédit d'impôt 50 %
        </div>
      </div>
    );
  }

  // full
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap",
      background: `linear-gradient(135deg, #fff, ${T}08)`,
      border: `1.5px solid ${T}2E`, borderRadius: 18,
      padding: "20px 24px", boxShadow: "0 6px 28px rgba(13,169,164,0.10)",
    }}>
      <SapMark size={58} />
      <div style={{ flex: 1, minWidth: 220 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: NAVY, marginBottom: 4 }}>
          Organisme déclaré Services à la Personne
        </div>
        <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
          Déclaration enregistrée auprès de la <strong>{TUTELLE_SAP}</strong> sous le
          n° <strong style={{ color: T }}>{DECLARATION_SAP}</strong>. Toutes nos prestations
          à domicile ouvrent droit au <strong>crédit d'impôt de 50 %</strong> (article 199 sexdecies du CGI).
        </div>
      </div>
    </div>
  );
}

/** Marque visuelle SAP — silhouette maison + personne dans un écusson bleu-France. */
export function SapMark({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-label="Service à la Personne" role="img" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="sapShield" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1D5FA8" />
          <stop offset="1" stopColor="#123E73" />
        </linearGradient>
      </defs>
      {/* écusson */}
      <path d="M32 3 L57 11 V31 C57 47 46 57 32 61 C18 57 7 47 7 31 V11 Z" fill="url(#sapShield)" />
      <path d="M32 3 L57 11 V31 C57 47 46 57 32 61 C18 57 7 47 7 31 V11 Z" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="1.5" />
      {/* toit */}
      <path d="M17 33 L32 21 L47 33" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* personne (cœur/tête + corps) */}
      <circle cx="32" cy="35" r="4.2" fill="#fff" />
      <path d="M24 51 C24 43 40 43 40 51 Z" fill="#fff" />
      {/* liseré rose J'MTD */}
      <path d="M32 3 L57 11 V16 L32 8 L7 16 V11 Z" fill="#D4197A" fillOpacity="0.9" />
    </svg>
  );
}

import Link from "next/link";
import { PHONE, PHONE_HREF, EMAIL, ADDRESS, HORAIRES, FONDATRICE, SIRET, AMBER, NAVY, SERVICES } from "../lib/data";

export default function Footer() {
  return (
    <footer style={{ background: "#060E18", borderTop: "1px solid rgba(255,255,255,0.06)", paddingBottom: 80 }}>
      {/* Main footer */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px 32px", display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "space-between" }}>

        {/* Brand */}
        <div style={{ minWidth: 220, maxWidth: 280 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 9, background: `linear-gradient(135deg, ${AMBER}, #D97706)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 13, color: NAVY }}>J'MTD</div>
            <div>
              <div style={{ fontWeight: 800, color: "#F8FAFC", fontFamily: "Syne, sans-serif" }}>J&apos;MTD</div>
              <div style={{ fontSize: 10, color: "#475569", letterSpacing: 0.5, textTransform: "uppercase" }}>Services à la Personne</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.8, marginBottom: 12 }}>
            Société de services à la personne basée à Rivière-Salée, Martinique. Fondée par {FONDATRICE}.
          </p>
          <div style={{ fontSize: 11, color: "#334155" }}>
            <div>SIRET {SIRET}</div>
            <div>Agréé Services à la Personne (SAP)</div>
          </div>
        </div>

        {/* Services */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#F8FAFC", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Nos prestations</div>
          {SERVICES.map(s => (
            <Link key={s.id} href={s.id === "rangement" ? "/coach" : `/services#${s.id}`}
              style={{ display: "block", fontSize: 13, color: "#475569", padding: "3px 0", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => e.target.style.color = AMBER}
              onMouseLeave={e => e.target.style.color = "#475569"}>
              {s.icon} {s.title}
            </Link>
          ))}
        </div>

        {/* Liens */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#F8FAFC", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Navigation</div>
          {[
            ["/", "Accueil"],
            ["/services", "Nos prestations"],
            ["/coach", "Coach rangement"],
            ["/contact", "Contact & Devis"],
            ["/mentions-legales", "Mentions légales"],
            ["/politique-confidentialite", "Politique de confidentialité"],
          ].map(([href, label]) => (
            <Link key={href} href={href}
              style={{ display: "block", fontSize: 13, color: "#475569", padding: "3px 0", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => e.target.style.color = AMBER}
              onMouseLeave={e => e.target.style.color = "#475569"}>
              {label}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#F8FAFC", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Contact</div>
          <a href={PHONE_HREF} style={{ display: "block", color: AMBER, fontSize: 15, fontWeight: 700, marginBottom: 6, textDecoration: "none" }}>📞 {PHONE}</a>
          <div style={{ fontSize: 13, color: "#475569", marginBottom: 4 }}>⏰ {HORAIRES}</div>
          <div style={{ fontSize: 13, color: "#475569", marginBottom: 16 }}>✉️ {EMAIL}</div>
          <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.7 }}>{ADDRESS}</div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 24px 0", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 11, color: "#334155" }}>© 2025 J&apos;MTD — Tous droits réservés · SIRET {SIRET}</span>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/mentions-legales" style={{ fontSize: 11, color: "#334155", textDecoration: "none" }}>Mentions légales</Link>
          <Link href="/politique-confidentialite" style={{ fontSize: 11, color: "#334155", textDecoration: "none" }}>Confidentialité</Link>
          <Link href="/portail" style={{ fontSize: 11, color: "#1E3A5F", textDecoration: "none" }}>🔐 Espace équipe</Link>
        </div>
      </div>
    </footer>
  );
}

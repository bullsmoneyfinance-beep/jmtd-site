import Link from "next/link";
import { PHONE, PHONE_HREF, EMAIL, ADDRESS, HORAIRES, FONDATRICE, SIRET, AMBER, PINK, SERVICES } from "../lib/data";

const T = "#0DA9A4";
const P = "#D4197A";

export default function Footer() {
  return (
    <footer style={{ background: "#F8FAFB", borderTop: "1px solid rgba(13,169,164,0.1)", paddingBottom: 80 }}>
      {/* Wave accent */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${T}, ${P}, ${T})`, backgroundSize: "200% 100%", animation: "shimmerText 4s linear infinite" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px 32px", display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "space-between" }}>

        {/* Brand */}
        <div style={{ minWidth: 220, maxWidth: 280 }}>
          {/* Logo mark — stacked */}
          <div style={{ position: "relative", width: 96, height: 68, marginBottom: 4 }}>
            <div style={{ position: "absolute", top: 0, left: 0, fontFamily: "'Dancing Script', cursive", fontWeight: 700, fontSize: 34, color: P, lineHeight: 1, zIndex: 2 }}>
              J&apos;m
            </div>
            <div style={{ position: "absolute", bottom: 0, right: 0, fontFamily: "Arial,Helvetica,sans-serif", fontWeight: 900, fontSize: 52, color: T, lineHeight: 1, letterSpacing: -2 }}>
              TD
            </div>
          </div>
          <div style={{ marginBottom: 14, fontFamily: "'Dancing Script', cursive", fontWeight: 700, fontSize: 15, color: P, letterSpacing: 0.2 }}>
            Société de services sur mesure
          </div>
          <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.8, marginBottom: 12 }}>
            Société de services à la personne basée à Rivière-Salée, Martinique. Fondée par {FONDATRICE}.
          </p>
          <div style={{ fontSize: 11, color: "#94A3B8" }}>
            <div>SIRET {SIRET}</div>
            <div>Agréé Services à la Personne (SAP)</div>
          </div>
        </div>

        {/* Services */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#1A2D3D", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Nos prestations</div>
          {SERVICES.map(s => (
            <Link key={s.id} href={s.id === "rangement" ? "/coach" : `/services#${s.id}`}
              style={{ display: "block", fontSize: 13, color: "#64748B", padding: "4px 0", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => e.target.style.color = T}
              onMouseLeave={e => e.target.style.color = "#64748B"}>
              {s.icon} {s.title}
            </Link>
          ))}
        </div>

        {/* Navigation */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#1A2D3D", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Navigation</div>
          {[
            ["/", "Accueil"],
            ["/services", "Nos prestations"],
            ["/coach", "Coach rangement"],
            ["/contact", "Contact & Devis"],
            ["/mentions-legales", "Mentions légales"],
            ["/politique-confidentialite", "Politique de confidentialité"],
          ].map(([href, label]) => (
            <Link key={href} href={href}
              style={{ display: "block", fontSize: 13, color: "#64748B", padding: "4px 0", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => e.target.style.color = T}
              onMouseLeave={e => e.target.style.color = "#64748B"}>
              {label}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#1A2D3D", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Contact</div>
          <a href={PHONE_HREF} style={{ display: "block", color: T, fontSize: 15, fontWeight: 700, marginBottom: 6, textDecoration: "none" }}>📞 {PHONE}</a>
          <div style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>⏰ {HORAIRES}</div>
          <div style={{ fontSize: 13, color: "#64748B", marginBottom: 16 }}>✉️ {EMAIL}</div>
          <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.7 }}>{ADDRESS}</div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 24px 0", borderTop: "1px solid rgba(13,169,164,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 11, color: "#94A3B8" }}>© 2025 J&apos;MTD — Tous droits réservés · SIRET {SIRET}</span>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/mentions-legales" style={{ fontSize: 11, color: "#94A3B8", textDecoration: "none", transition: "color 0.15s" }}
            onMouseEnter={e => e.target.style.color = T} onMouseLeave={e => e.target.style.color = "#94A3B8"}>
            Mentions légales
          </Link>
          <Link href="/politique-confidentialite" style={{ fontSize: 11, color: "#94A3B8", textDecoration: "none", transition: "color 0.15s" }}
            onMouseEnter={e => e.target.style.color = T} onMouseLeave={e => e.target.style.color = "#94A3B8"}>
            Confidentialité
          </Link>
          <Link href="/portail" style={{ fontSize: 11, color: "#94A3B8", textDecoration: "none", transition: "color 0.15s" }}
            onMouseEnter={e => e.target.style.color = T} onMouseLeave={e => e.target.style.color = "#94A3B8"}>
            🔐 Espace équipe
          </Link>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { PHONE, PHONE_HREF, EMAIL, ADDRESS, HORAIRES, FONDATRICE, SIRET, AMBER, PINK, SERVICES, DECLARATION_SAP, TEAL_TEXT } from "../lib/data";
import Logo from "./Logo";
import Icon from "./Icon";
import { SapMark } from "./SapBadge";

const T = "#0DA9A4";
const P = "#D4197A";

export default function Footer() {
  return (
    <footer className="site-footer" style={{ background: "#F8FAFB", borderTop: "1px solid rgba(13,169,164,0.1)" }}>
      {/* Wave accent */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${T}, ${P}, ${T})`, backgroundSize: "200% 100%", animation: "shimmerText 4s linear infinite" }} />

      <div className="footer-grid">

        {/* Brand */}
        <div style={{ maxWidth: 320 }}>
          <Logo size="md" tagline style={{ marginBottom: 12 }} />
          <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.8, marginBottom: 12 }}>
            Société de services à la personne basée à Rivière-Salée, Martinique. Fondée par {FONDATRICE}.
          </p>
          <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 14 }}>
            <div>SIRET {SIRET}</div>
          </div>
          {/* Badge conformité SAP */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "#fff", border: `1.5px solid ${AMBER}30`, borderRadius: 10, padding: "7px 12px" }}>
            <SapMark size={26} />
            <div style={{ lineHeight: 1.25 }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: "#1A2D3D" }}>Déclaré Services à la Personne</div>
              <div style={{ fontSize: 10.5, color: "#64748B", fontWeight: 600 }}>N° {DECLARATION_SAP}</div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#1A2D3D", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Nos prestations</div>
          {SERVICES.map(s => (
            <Link key={s.id} href={s.id === "rangement" ? "/coach" : `/services#${s.id}`}
              style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "#64748B", padding: "4px 0", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = T}
              onMouseLeave={e => e.currentTarget.style.color = "#64748B"}>
              <Icon name={s.id} size={16} color={TEAL_TEXT} /> {s.title}
            </Link>
          ))}
        </div>

        {/* Navigation */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#1A2D3D", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Navigation</div>
          {[
            ["/", "Accueil", null],
            ["/services", "Nos prestations", null],
            ["/conciergerie", "Conciergerie locative", "cle"],
            ["/tarifs", "Tarifs", "wallet"],
            ["/coach", "Coach rangement", null],
            ["/conseils", "Conseils & astuces", "conseils"],
            ["/faq", "FAQ", "faq"],
            ["/contact", "Contact & Devis", null],
            ["/recrutement", "Rejoindre l'équipe", "users"],
            ["/mentions-legales", "Mentions légales", null],
            ["/politique-confidentialite", "Politique de confidentialité", null],
          ].map(([href, label, ic]) => (
            <Link key={href} href={href}
              style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748B", padding: "4px 0", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = T}
              onMouseLeave={e => e.currentTarget.style.color = "#64748B"}>
              {ic && <Icon name={ic} size={15} color={TEAL_TEXT} />} {label}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#1A2D3D", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Contact</div>
          <a href={PHONE_HREF} style={{ display: "inline-flex", alignItems: "center", gap: 8, color: TEAL_TEXT, fontSize: 15, fontWeight: 700, marginBottom: 6, textDecoration: "none" }}><Icon name="phone" size={16} color={TEAL_TEXT} /> {PHONE}</a>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748B", marginBottom: 4 }}><Icon name="clock" size={15} color="#94A3B8" /> {HORAIRES}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748B", marginBottom: 16 }}><Icon name="mail" size={15} color="#94A3B8" /> {EMAIL}</div>
          <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.7 }}>{ADDRESS}</div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 24px 0", borderTop: "1px solid rgba(13,169,164,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 11, color: "#94A3B8" }}>© {new Date().getFullYear()} J&apos;MTD — Tous droits réservés · SIRET {SIRET}</span>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/mentions-legales" style={{ fontSize: 11, color: "#94A3B8", textDecoration: "none", transition: "color 0.15s" }}
            onMouseEnter={e => e.target.style.color = T} onMouseLeave={e => e.target.style.color = "#94A3B8"}>
            Mentions légales
          </Link>
          <Link href="/politique-confidentialite" style={{ fontSize: 11, color: "#94A3B8", textDecoration: "none", transition: "color 0.15s" }}
            onMouseEnter={e => e.target.style.color = T} onMouseLeave={e => e.target.style.color = "#94A3B8"}>
            Confidentialité
          </Link>
          <Link href="/espace-client" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "#94A3B8", textDecoration: "none", transition: "color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.color = T} onMouseLeave={e => e.currentTarget.style.color = "#94A3B8"}>
            <Icon name="users" size={13} color="currentColor" /> Espace client
          </Link>
          <Link href="/portail" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "#94A3B8", textDecoration: "none", transition: "color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.color = T} onMouseLeave={e => e.currentTarget.style.color = "#94A3B8"}>
            <Icon name="lock" size={13} color="currentColor" /> Espace équipe
          </Link>
        </div>
      </div>
    </footer>
  );
}

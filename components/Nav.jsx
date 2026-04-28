"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PHONE, PHONE_HREF, SERVICES, AMBER, NAVY } from "../lib/data";

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setSvcOpen(false); }, [pathname]);

  const isActive = (href) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Top info bar */}
      <div style={{ background: "#060E18", color: "#64748B", fontSize: 12, padding: "5px 24px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
        <span>📍 Quartier Les Digues, 97215 Rivière-Salée, Martinique</span>
        <span className="hide-mobile">·</span>
        <span className="hide-mobile">⏰ Lun–Ven 08h–18h</span>
        <span className="hide-mobile">·</span>
        <a href={PHONE_HREF} style={{ color: AMBER, fontWeight: 600 }}>📞 {PHONE}</a>
      </div>

      {/* Main header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: scrolled ? "rgba(13,27,42,0.97)" : "rgba(13,27,42,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${scrolled ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.06)"}`,
        transition: "all 0.3s ease",
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.4)" : "none",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: 68, gap: 12 }}>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: `linear-gradient(135deg, ${AMBER}, #D97706)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 15, color: NAVY, letterSpacing: -0.5, flexShrink: 0 }}>J'MTD</div>
            <div className="hide-mobile">
              <div style={{ fontSize: 15, fontWeight: 800, color: "#F8FAFC", fontFamily: "Syne, sans-serif", letterSpacing: -0.3 }}>J&apos;MTD</div>
              <div style={{ fontSize: 10, color: "#64748B", letterSpacing: 0.5, textTransform: "uppercase" }}>Services à la Personne</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>Accueil</Link>

            {/* Services dropdown */}
            <div style={{ position: "relative" }} onMouseEnter={() => setSvcOpen(true)} onMouseLeave={() => setSvcOpen(false)}>
              <button className={`nav-link ${pathname.startsWith("/services") || pathname.startsWith("/coach") ? "active" : ""}`} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                Nos prestations <span style={{ fontSize: 10 }}>▾</span>
              </button>
              {svcOpen && (
                <div style={{ position: "absolute", top: "100%", left: 0, background: "#0D1B2A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.5)", minWidth: 260, padding: "8px 0", animation: "slideDown 0.2s ease", zIndex: 200 }}>
                  {SERVICES.map(s => (
                    <Link key={s.id} href={s.id === "rangement" ? "/coach" : `/services#${s.id}`}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 18px", fontSize: 13, color: "#94A3B8", transition: "all 0.15s", textDecoration: "none" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(245,158,11,0.08)"; e.currentTarget.style.color = "#F8FAFC"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#94A3B8"; }}>
                      <span style={{ fontSize: 18 }}>{s.icon}</span>
                      <span>{s.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/coach" className={`nav-link ${isActive("/coach") ? "active" : ""}`}>Coach rangement</Link>
            <Link href="/contact" className={`nav-link ${isActive("/contact") ? "active" : ""}`}>Contact</Link>
          </nav>

          {/* CTA + Burger */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a href={PHONE_HREF} className="btn-amber hide-mobile" style={{ padding: "9px 18px", borderRadius: 30, fontSize: 13, display: "flex", alignItems: "center", gap: 7, textDecoration: "none" }}>
              📞 {PHONE}
            </a>
            <Link href="/contact" className="btn-amber" style={{ padding: "9px 18px", borderRadius: 30, fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }} aria-label="Obtenir un devis gratuit">
              <span className="hide-mobile">Devis gratuit</span>
              <span className="show-mobile" style={{ display: "none" }}>Devis</span>
            </Link>

            {/* Burger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="show-mobile" aria-label="Menu" style={{ background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: 5, padding: 6 }}>
              {[0, 1, 2].map(i => <span key={i} style={{ width: 22, height: 2, background: "#F8FAFC", borderRadius: 1, display: "block", transition: "all 0.25s", transform: mobileOpen && i === 0 ? "rotate(45deg) translate(5px,5px)" : mobileOpen && i === 2 ? "rotate(-45deg) translate(5px,-5px)" : "none", opacity: mobileOpen && i === 1 ? 0 : 1 }} />)}
            </button>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {mobileOpen && (
          <div style={{ background: "rgba(13,27,42,0.99)", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "16px 24px 32px", animation: "slideDown 0.25s ease" }}>
            {[["/" , "🏠 Accueil"], ["/services", "🛠 Nos prestations"], ["/coach", "🗂️ Coach rangement"], ["/contact", "✉️ Contact & Devis"]].map(([href, label]) => (
              <Link key={href} href={href} style={{ display: "block", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 15, color: pathname === href ? AMBER : "#94A3B8", fontWeight: pathname === href ? 600 : 400, textDecoration: "none" }}>{label}</Link>
            ))}
            <a href={PHONE_HREF} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 20, background: `linear-gradient(135deg, ${AMBER}, #D97706)`, color: NAVY, padding: "14px 0", borderRadius: 30, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>📞 {PHONE}</a>
          </div>
        )}
      </header>

      {/* Mobile bottom bar */}
      <div className="show-mobile" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(13,27,42,0.98)", borderTop: "1px solid rgba(255,255,255,0.08)", display: "none", zIndex: 99, backdropFilter: "blur(20px)" }}>
        {[
          { href: "/", icon: "🏠", label: "Accueil" },
          { href: PHONE_HREF, icon: "📞", label: "Appeler", external: true },
          { href: "/contact", icon: "✉️", label: "Devis" },
        ].map(item => item.external ? (
          <a key={item.label} href={item.href} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 0", color: AMBER, fontSize: 12, fontWeight: 600, textDecoration: "none", gap: 3 }} aria-label={item.label}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>{item.label}
          </a>
        ) : (
          <Link key={item.label} href={item.href} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 0", color: pathname === item.href ? AMBER : "#64748B", fontSize: 12, fontWeight: 600, textDecoration: "none", gap: 3 }} aria-label={item.label}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>{item.label}
          </Link>
        ))}
      </div>
    </>
  );
}

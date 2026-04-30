"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PHONE, PHONE_HREF, SERVICES } from "../lib/data";
import Logo from "./Logo";

const T = "#0DA9A4";
const P = "#D4197A";

const TEAM_LINKS = [
  { href: "/pointage",     icon: "⏱️", label: "Pointage",           desc: "Démarrer / terminer une session" },
  { href: "/admin",        icon: "📊", label: "Dashboard admin",     desc: "Suivi des sessions & équipes" },
  { href: "/admin/veille", icon: "🤖", label: "Agent IA — Veille",   desc: "Actualité juridique & SAP" },
];

export default function Nav() {
  const pathname      = usePathname();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [svcOpen, setSvcOpen]       = useState(false);
  const [teamOpen, setTeamOpen]     = useState(false);
  const teamRef = useRef(null);

  /* scroll */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* ferme tout au changement de route */
  useEffect(() => { setMobileOpen(false); setSvcOpen(false); setTeamOpen(false); }, [pathname]);

  /* ferme le dropdown team si clic en dehors */
  useEffect(() => {
    if (!teamOpen) return;
    const handler = e => { if (teamRef.current && !teamRef.current.contains(e.target)) setTeamOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [teamOpen]);

  const isActive = h => pathname === h || pathname.startsWith(h + "/");
  const isTeamActive = isActive("/portail") || isActive("/admin") || isActive("/pointage");

  const linkStyle = active => ({
    position: "relative", background: "none", border: "none", cursor: "pointer",
    padding: "8px 14px", fontSize: 14, fontWeight: active ? 600 : 500,
    color: active ? "#1A2D3D" : "#64748B", transition: "color 0.2s",
    textDecoration: "none", display: "block",
  });

  return (
    <>
      <header style={{
        position: "sticky", top: 0, zIndex: 200,
        background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.88)",
        backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
        borderBottom: `1px solid ${scrolled ? "rgba(13,169,164,0.18)" : "rgba(13,169,164,0.08)"}`,
        boxShadow: scrolled ? "0 4px 40px rgba(13,169,164,0.08)" : "none",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}>

        {/* Top info strip */}
        <div style={{ background: `linear-gradient(90deg, ${T}11, ${P}11)`, borderBottom: "1px solid rgba(13,169,164,0.08)", padding: "5px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#64748B" }}>📍 Rivière-Salée, Martinique</span>
          <span className="hide-mobile" style={{ fontSize: 12, color: "#CBD5E1" }}>·</span>
          <span className="hide-mobile" style={{ fontSize: 12, color: "#64748B" }}>⏰ Lun–Ven 08h–18h</span>
          <span className="hide-mobile" style={{ fontSize: 12, color: "#CBD5E1" }}>·</span>
          <a href={PHONE_HREF} style={{ fontSize: 12, color: T, fontWeight: 700 }}>📞 {PHONE}</a>
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: 88, gap: 12 }}>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
            <Logo size="sm" />
          </Link>

          {/* Desktop nav */}
          <nav className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Link href="/" style={linkStyle(pathname === "/")}>Accueil</Link>

            {/* Services dropdown — hover, gap comblé par paddingTop transparent */}
            <div style={{ position: "relative" }}
              onMouseEnter={() => setSvcOpen(true)}
              onMouseLeave={() => setSvcOpen(false)}>
              <button style={{ ...linkStyle(pathname.startsWith("/services") || pathname.startsWith("/coach")), display: "flex", alignItems: "center", gap: 5 }}>
                Nos prestations <span style={{ fontSize: 9, color: "#94A3B8" }}>▾</span>
              </button>
              {svcOpen && (
                <div style={{ position: "absolute", top: "100%", left: 0, paddingTop: 8, zIndex: 300 }}>
                  <div style={{ background: "#fff", border: `1px solid rgba(13,169,164,0.12)`, borderRadius: 16, boxShadow: "0 20px 60px rgba(13,169,164,0.12), 0 4px 16px rgba(0,0,0,0.06)", minWidth: 270, padding: "10px 0", animation: "slideDown 0.2s ease" }}>
                    {SERVICES.map(s => (
                      <Link key={s.id} href={s.id === "rangement" ? "/coach" : `/services#${s.id}`}
                        style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 20px", fontSize: 13, color: "#64748B", textDecoration: "none", transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = `${T}0a`; e.currentTarget.style.color = T; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#64748B"; }}>
                        <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>{s.icon}</span>
                        <div>
                          <div style={{ fontWeight: 600, color: "#1A2D3D", fontSize: 13 }}>{s.title}</div>
                          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>{s.short}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/coach" style={linkStyle(isActive("/coach"))}>Coach rangement</Link>
            <Link href="/coaching" style={linkStyle(isActive("/coaching"))}>Mon coaching</Link>
            <Link href="/contact" style={linkStyle(isActive("/contact"))}>Contact</Link>

            {/* Espace Équipe — clic pour ouvrir/fermer */}
            <div ref={teamRef} style={{ position: "relative", marginLeft: 8 }}>
              <button
                onClick={() => setTeamOpen(o => !o)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 22, background: isTeamActive || teamOpen ? `${T}12` : "rgba(13,169,164,0.06)", border: `1.5px solid ${isTeamActive || teamOpen ? T : "rgba(13,169,164,0.2)"}`, cursor: "pointer", fontSize: 13, fontWeight: 600, color: isTeamActive || teamOpen ? T : "#475569", transition: "all 0.2s" }}>
                🔐 <span>Espace équipe</span>
                <span style={{ fontSize: 9, color: "#94A3B8", transform: teamOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▾</span>
              </button>
              {teamOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: "#fff", border: `1px solid rgba(13,169,164,0.14)`, borderRadius: 18, boxShadow: "0 20px 60px rgba(13,169,164,0.14), 0 4px 20px rgba(0,0,0,0.07)", minWidth: 290, padding: "10px 0", animation: "slideDown 0.2s ease", zIndex: 300 }}>
                  <div style={{ padding: "10px 18px 12px", borderBottom: "1px solid rgba(13,169,164,0.08)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1.2 }}>Accès réservé</div>
                    <div style={{ fontSize: 12, color: "#64748B", marginTop: 3 }}>Connectez-vous via le portail</div>
                  </div>
                  {TEAM_LINKS.map(item => (
                    <Link key={item.href} href={item.href}
                      style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 18px", textDecoration: "none", transition: "background 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = `${T}08`; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "none"; }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: item.href.includes("veille") ? `linear-gradient(135deg, ${P}22, ${T}11)` : `${T}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                        {item.icon}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#1A2D3D", fontSize: 13 }}>{item.label}</div>
                        <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{item.desc}</div>
                      </div>
                    </Link>
                  ))}
                  <div style={{ padding: "10px 18px", borderTop: "1px solid rgba(13,169,164,0.08)" }}>
                    <Link href="/portail" style={{ display: "block", textAlign: "center", padding: "10px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
                      Se connecter →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* CTAs */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a href={PHONE_HREF} className="hide-mobile"
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 30, border: `1.5px solid ${T}44`, color: T, fontSize: 13, fontWeight: 600, textDecoration: "none", background: `${T}08` }}>
              📞 {PHONE}
            </a>
            <Link href="/contact"
              style={{ padding: "10px 20px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none", boxShadow: `0 4px 20px ${T}40`, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span className="hide-mobile">Devis gratuit</span>
              <span className="show-mobile" style={{ display: "none" }}>Devis</span>
            </Link>
            {/* Burger */}
            <button onClick={() => setMobileOpen(o => !o)} className="show-mobile"
              aria-label="Menu" style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: 5, padding: 6 }}>
              {[0,1,2].map(i => (
                <span key={i} style={{ width: 22, height: 2, borderRadius: 1, display: "block", transition: "all 0.25s", background: "#1A2D3D", transform: mobileOpen && i===0 ? "rotate(45deg) translate(5px,5px)" : mobileOpen && i===2 ? "rotate(-45deg) translate(5px,-5px)" : "none", opacity: mobileOpen && i===1 ? 0 : 1 }} />
              ))}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ background: "#fff", borderTop: `1px solid rgba(13,169,164,0.1)`, padding: "16px 24px 28px", animation: "slideDown 0.25s ease" }}>
            {[["/","🏠 Accueil"],["/services","🛠 Nos prestations"],["/coach","🗂️ Coach rangement"],["/coaching","✨ Mon coaching"],["/contact","✉️ Contact & Devis"]].map(([href, label]) => (
              <Link key={href} href={href} style={{ display: "block", padding: "14px 0", borderBottom: "1px solid rgba(13,169,164,0.08)", fontSize: 15, color: pathname === href ? T : "#64748B", fontWeight: pathname === href ? 600 : 400, textDecoration: "none" }}>
                {label}
              </Link>
            ))}
            <div style={{ marginTop: 12, background: "rgba(13,169,164,0.04)", border: "1px solid rgba(13,169,164,0.12)", borderRadius: 16, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10 }}>🔐 Espace équipe</div>
              {TEAM_LINKS.map(item => (
                <Link key={item.href} href={item.href} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid rgba(13,169,164,0.06)", textDecoration: "none" }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1A2D3D" }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>{item.desc}</div>
                  </div>
                </Link>
              ))}
              <Link href="/portail" style={{ display: "block", textAlign: "center", marginTop: 12, padding: "11px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                Se connecter →
              </Link>
            </div>
            <a href={PHONE_HREF} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 16, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", padding: "14px 0", borderRadius: 30, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
              📞 {PHONE}
            </a>
          </div>
        )}
      </header>

      {/* Mobile bottom bar */}
      <div className="show-mobile mobile-bottom-bar" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,0.98)", borderTop: `1px solid rgba(13,169,164,0.12)`, display: "none", zIndex: 199, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", boxShadow: "0 -2px 20px rgba(13,169,164,0.1)" }}>
        {[
          { href: "/",        icon: "🏠", label: "Accueil" },
          { href: "/services",icon: "🛠", label: "Services" },
          { href: PHONE_HREF, icon: "📞", label: "Appeler", ext: true },
          { href: "/contact", icon: "✉️", label: "Devis" },
          { href: "/portail", icon: "🔐", label: "Équipe" },
        ].map(item => {
          const active = !item.ext && pathname === item.href;
          const style = {
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "10px 0", fontSize: 9.5, fontWeight: active ? 700 : 600,
            color: active ? T : item.ext ? "#25D366" : "#94A3B8",
            textDecoration: "none", gap: 4, transition: "color 0.15s", letterSpacing: 0.3,
          };
          return item.ext
            ? <a key={item.label} href={item.href} style={style}>
                <span style={{ fontSize: 20, filter: item.ext ? "none" : "none" }}>{item.icon}</span>
                {item.label}
              </a>
            : <Link key={item.label} href={item.href} style={style}>
                {active && <span style={{ position: "absolute", top: 0, width: 28, height: 2.5, background: T, borderRadius: "0 0 3px 3px" }} />}
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                {item.label}
              </Link>;
        })}
      </div>
    </>
  );
}

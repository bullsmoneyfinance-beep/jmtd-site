"use client";
import { useState, useEffect, useCallback, useRef } from "react";

// ─── Palette ───
const T = "#0DA9A4";      // teal principal
const TD = "#0A8A85";     // teal foncé
const PU = "#9B1B6E";     // violet accent
const TX = "#333333";     // texte
const LG = "#F5F5F5";     // fond clair

// ─── Données ───
const PHONE = "05 96 63 13 08";
const PHONE_HREF = "tel:0596631308";
const ADDRESS = "Quartier Les Digues - 97215 - Rivière Salée - Martinique, France";
const EMAIL = "contact@jmtd.fr";
const HORAIRES = "Lun–Ven 08h–18h";
const FONDATRICE = "Myriam Rovela";
const SIRET = "802 877 779";

const SERVICES = [
  {
    id: "entretien", label: "L'entretien et le\nnettoyage de votre\ndomicile",
    img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=220&h=220&fit=crop&auto=format",
    desc: "Le ménage de votre domicile est devenu une corvée ? L'équipe J'MTD se déplace chez vous à Rivière-Salée, au Diamant, au Lamentin et partout en Martinique pour l'entretien et le nettoyage complet de votre intérieur.",
    details: ["Ménage complet de votre domicile", "Repassage et entretien du linge", "Nettoyage des vitres et surfaces", "Désinfection des pièces", "Entretien des sols"],
  },
  {
    id: "repas", label: "La préparation des\nrepas à domicile",
    img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=220&h=220&fit=crop&auto=format",
    desc: "J'MTD prépare vos repas directement chez vous, selon vos goûts et vos contraintes alimentaires. Des repas faits maison, équilibrés et savoureux.",
    details: ["Préparation de repas équilibrés", "Cuisine selon vos habitudes", "Respect des contraintes diététiques", "Rangement de la cuisine après cuisson"],
  },
  {
    id: "rangement", label: "Le coaching en\nrangement",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=220&h=220&fit=crop&auto=format",
    desc: "Fan absolue de Marie Kondo, notre spécialiste du rangement étudie vos besoins, vos habitudes de vie et vos attentes pour vous aider à retrouver un intérieur ordonné.",
    details: ["Recommandations et conseils (1h)", "Accompagnement au rangement", "Prestation de rangement intégrale", "Conseils tri, archivage, désencombrement"],
    special: true,
  },
  {
    id: "courses", label: "La livraison de\ncourses à domicile",
    img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=220&h=220&fit=crop&auto=format",
    desc: "J'MTD s'occupe de vos commissions selon votre liste et vous les livre directement chez vous, dans les délais convenus.",
    details: ["Courses selon votre liste", "Livraison sur toute la Martinique", "Gestion des produits frais et surgelés", "Rangement des courses"],
  },
  {
    id: "assistance", label: "L'assistance\nadministrative",
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=220&h=220&fit=crop&auto=format",
    desc: "J'MTD vous accompagne dans vos démarches administratives : tri du courrier, saisie informatique, aide aux formulaires, classement de documents.",
    details: ["Tri et classement du courrier", "Aide à la saisie informatique", "Accompagnement aux démarches en ligne", "Classement et archivage"],
  },
];

const TARIFS = [
  { service: "Entretien & nettoyage", tarif: "Sur devis", detail: "Selon surface et fréquence" },
  { service: "Préparation repas", tarif: "Sur devis", detail: "Selon nombre de personnes" },
  { service: "Coach rangement – Conseils (1h)", tarif: "Sur devis", detail: "Diagnostic initial inclus" },
  { service: "Coach rangement – Accompagnement", tarif: "Sur devis", detail: "Plusieurs séances" },
  { service: "Coach rangement – Intégral", tarif: "Sur devis", detail: "Toutes pièces, clé en main" },
  { service: "Livraison de courses", tarif: "Sur devis", detail: "Selon distance et volume" },
  { service: "Assistance administrative", tarif: "Sur devis", detail: "Selon complexité" },
];

const ZONES = ["Centre (Lamentin/Rivière-Salée)", "Nord Atlantique", "Nord Caraïbe", "Sud (Diamant/Saint-Esprit)", "Toute la Martinique"];
const DEMO_EMPS = [
  { id: "e1", name: "Marie-Louise D.", pin: "1234", zone: "Centre", role: "Aide ménagère" },
  { id: "e2", name: "Sylvie B.", pin: "5678", zone: "Nord", role: "Préparation repas" },
  { id: "e3", name: "Fabienne R.", pin: "9012", zone: "Sud", role: "Coach rangement" },
];

// ─── Storage ───
async function load(k, fb) { try { if (typeof window === "undefined") return fb; const r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch { return fb; } }
async function save(k, d) { try { if (typeof window === "undefined") return; localStorage.setItem(k, JSON.stringify(d)); } catch { } }

// ─── Utils ───
const pad = n => String(n).padStart(2, "0");
const fmtTime = d => new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
const fmtDate = d => new Date(d).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
const today = () => new Date().toISOString().split("T")[0];
const hrs = (a, b) => b ? Math.round(((new Date(b) - new Date(a)) / 36e5) * 100) / 100 : 0;
const weekNum = d => { const dt = new Date(d); dt.setHours(0, 0, 0, 0); dt.setDate(dt.getDate() + 3 - ((dt.getDay() + 6) % 7)); const w1 = new Date(dt.getFullYear(), 0, 4); return 1 + Math.round(((dt - w1) / 864e5 - 3 + ((w1.getDay() + 6) % 7)) / 7); };

// ─── GPS Hook ───
function useGeo() {
  const [loc, setLoc] = useState(null); const [err, setErr] = useState(null); const [loading, setLoading] = useState(false);
  const request = useCallback(() => {
    if (!navigator.geolocation) { setErr("GPS non disponible"); return; }
    setLoading(true); setErr(null);
    navigator.geolocation.getCurrentPosition(
      p => { setLoc({ lat: p.coords.latitude, lng: p.coords.longitude, acc: Math.round(p.coords.accuracy) }); setLoading(false); },
      e => { setErr(["", "Autorisation refusée", "Position indisponible", "Délai dépassé"][e.code] || "Erreur GPS"); setLoading(false); },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, []);
  return { loc, err, loading, request, reset: () => { setLoc(null); setErr(null); } };
}

// ═══════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("home");
  const [serviceId, setServiceId] = useState(null);
  const [emps, setEmps] = useState(DEMO_EMPS);
  const [sess, setSess] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [user, setUser] = useState(null);
  const [adminAuth, setAdminAuth] = useState(false);
  const [toast, setToast] = useState(null);
  const [ready, setReady] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    (async () => { setEmps(await load("jmtd-emps", DEMO_EMPS)); setSess(await load("jmtd-sess", [])); setContacts(await load("jmtd-contacts", [])); setReady(true); })();
  }, []);
  useEffect(() => { if (ready) save("jmtd-sess", sess); }, [sess, ready]);
  useEffect(() => { if (ready) save("jmtd-emps", emps); }, [emps, ready]);
  useEffect(() => { if (ready) save("jmtd-contacts", contacts); }, [contacts, ready]);

  const notify = useCallback((msg, type = "ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); }, []);
  const goTo = useCallback((p, sid = null) => { setPage(p); setServiceId(sid); setMobileMenu(false); setServicesOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  const active = user ? sess.find(s => s.eid === user.id && !s.out) : null;
  const clockIn = useCallback((client, geo) => { const now = new Date().toISOString(); setSess(p => [...p, { id: `s${Date.now()}`, eid: user.id, name: user.name, in: now, out: null, client, zone: user.zone, note: "", geoIn: geo || null }]); notify(`Arrivée pointée à ${fmtTime(now)}`); }, [user, notify]);
  const clockOut = useCallback((note, geo) => { if (!active) return; const now = new Date().toISOString(); setSess(p => p.map(s => s.id === active.id ? { ...s, out: now, note, geoOut: geo || null } : s)); notify(`${hrs(active.in, now).toFixed(1)}h enregistrées`); }, [active, notify]);

  const isPrivate = ["portail", "loginEmp", "pointage", "adminLogin", "admin"].includes(page);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#fff", color: TX, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        button,input,select,textarea{font-family:inherit;}
        input::placeholder,textarea::placeholder{color:#999;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        a{color:inherit;text-decoration:none;}
        .svc-circle:hover img{transform:scale(1.06);}
        .svc-circle:hover span{color:${T};}
        .nav-link:hover{color:${T};}
        .btn-teal:hover{background:${TD};}
        .btn-outline:hover{background:${T};color:#fff;}
        .card-svc:hover{box-shadow:0 8px 32px rgba(13,169,164,.15);transform:translateY(-2px);}
        @media(max-width:768px){
          .hide-mobile{display:none!important;}
          .hero-inner{flex-direction:column!important;}
          .services-grid{grid-template-columns:repeat(2,1fr)!important;}
          .avantages-grid{grid-template-columns:1fr!important;}
          .footer-cols{flex-direction:column!important;gap:24px!important;}
          .form-row{grid-template-columns:1fr!important;}
          .tarifs-table th,.tarifs-table td{padding:8px!important;font-size:12px!important;}
        }
      `}</style>

      {/* TOAST */}
      {toast && <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", background: toast.type === "ok" ? T : "#DC2626", color: "#fff", padding: "10px 20px", borderRadius: 30, fontSize: 13, fontWeight: 600, zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,.2)", animation: "slideDown .3s ease", whiteSpace: "nowrap" }}>{toast.msg}</div>}

      {/* NAV */}
      {!isPrivate && (
        <>
          {/* Top bar */}
          <div style={{ background: "#222", color: "#ccc", fontSize: 12, padding: "6px 24px", textAlign: "center" }}>
            📍 {ADDRESS}
          </div>

          {/* Header */}
          <header style={{ background: "#fff", borderBottom: "1px solid #eee", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: 72 }}>

              {/* Logo */}
              <button onClick={() => goTo("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                <Logo />
              </button>

              {/* Nav */}
              <nav className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <NavLink active={page === "home"} onClick={() => goTo("home")}>Accueil</NavLink>

                {/* Dropdown Nos prestations */}
                <div style={{ position: "relative" }} onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
                  <NavLink active={["services", ...SERVICES.map(s => s.id)].includes(page)}>
                    Nos prestations <span style={{ fontSize: 10, marginLeft: 2 }}>▾</span>
                  </NavLink>
                  {servicesOpen && (
                    <div style={{ position: "absolute", top: "100%", left: 0, background: "#fff", border: "1px solid #eee", borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,.1)", minWidth: 240, padding: "8px 0", animation: "slideDown .2s ease", zIndex: 200 }}>
                      {SERVICES.map(s => (
                        <button key={s.id} onClick={() => goTo("services", s.id)} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 18px", background: "none", border: "none", fontSize: 13, color: TX, cursor: "pointer", transition: "background .15s" }}
                          onMouseEnter={e => e.target.style.background = "#f0fafa"}
                          onMouseLeave={e => e.target.style.background = "none"}>
                          {s.label.replace(/\n/g, " ")}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <NavLink active={page === "coach"} onClick={() => goTo("coach")}>Coach rangements</NavLink>
                <NavLink active={page === "tarifs"} onClick={() => goTo("tarifs")}>Nos tarifs</NavLink>
                <NavLink active={page === "contact"} onClick={() => goTo("contact")}>Contact</NavLink>
              </nav>

              {/* CTA Phone */}
              <a href={PHONE_HREF} className="btn-teal hide-mobile" style={{ background: T, color: "#fff", padding: "10px 20px", borderRadius: 30, fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, transition: "background .2s" }}>
                📞 {PHONE}
              </a>

              {/* Burger */}
              <button className="burger" onClick={() => setMobileMenu(!mobileMenu)} style={{ background: "none", border: "none", cursor: "pointer", display: "none", flexDirection: "column", gap: 5, padding: 4, "@media(max-width:768px)": { display: "flex" } }}>
                <span style={{ width: 24, height: 2, background: TX, borderRadius: 1, display: "block", transition: "all .25s", transform: mobileMenu ? "rotate(45deg) translate(5px,5px)" : "none" }} />
                <span style={{ width: 24, height: 2, background: TX, borderRadius: 1, display: "block", opacity: mobileMenu ? 0 : 1 }} />
                <span style={{ width: 24, height: 2, background: TX, borderRadius: 1, display: "block", transition: "all .25s", transform: mobileMenu ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
              </button>
            </div>

            {/* Mobile menu */}
            {mobileMenu && (
              <div style={{ borderTop: "1px solid #eee", background: "#fff", padding: "12px 24px 20px" }}>
                {[["home", "Accueil"], ["services", "Nos prestations"], ["coach", "Coach rangements"], ["tarifs", "Nos tarifs"], ["contact", "Contact"]].map(([p, l]) => (
                  <button key={p} onClick={() => goTo(p)} style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 0", background: "none", border: "none", borderBottom: "1px solid #f0f0f0", fontSize: 15, color: page === p ? T : TX, fontWeight: page === p ? 600 : 400, cursor: "pointer" }}>{l}</button>
                ))}
                <a href={PHONE_HREF} style={{ display: "block", marginTop: 16, background: T, color: "#fff", padding: "12px 0", borderRadius: 30, textAlign: "center", fontSize: 15, fontWeight: 700 }}>📞 {PHONE}</a>
              </div>
            )}
          </header>
        </>
      )}

      {/* PAGES */}
      {page === "home" && <PageHome goTo={goTo} />}
      {page === "services" && <PageServices goTo={goTo} initId={serviceId} />}
      {page === "coach" && <PageCoach goTo={goTo} />}
      {page === "tarifs" && <PageTarifs goTo={goTo} />}
      {page === "contact" && <PageContact goTo={goTo} onSubmit={d => { setContacts(p => [...p, { ...d, id: `k${Date.now()}`, date: new Date().toISOString() }]); notify("Message envoyé ! Réponse sous 24h."); goTo("home"); }} />}
      {page === "portail" && <PagePortail goTo={goTo} />}
      {page === "loginEmp" && <LoginEmp emps={emps} onLogin={e => { setUser(e); goTo("pointage"); }} back={() => goTo("portail")} />}
      {page === "pointage" && user && <PagePointage emp={user} sess={sess.filter(s => s.eid === user.id)} active={active} clockIn={clockIn} clockOut={clockOut} logout={() => { setUser(null); goTo("portail"); }} />}
      {page === "adminLogin" && <AdminLogin onLogin={() => { setAdminAuth(true); goTo("admin"); }} back={() => goTo("portail")} />}
      {page === "admin" && adminAuth && <PageAdmin emps={emps} sess={sess} contacts={contacts} addEmp={e => setEmps(p => [...p, e])} removeEmp={id => setEmps(p => p.filter(e => e.id !== id))} logout={() => { setAdminAuth(false); goTo("portail"); }} notify={notify} />}

      {/* FOOTER (pages publiques) */}
      {!isPrivate && <Footer goTo={goTo} />}
    </div>
  );
}

// ─── LOGO ───
function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <rect width="52" height="52" rx="8" fill="#fff" />
        <text x="4" y="34" fontFamily="Syne, sans-serif" fontWeight="800" fontSize="28" fill={T}>J&apos;</text>
        <text x="26" y="34" fontFamily="Syne, sans-serif" fontWeight="800" fontSize="28" fill={PU}>MTD</text>
        <path d="M26 38 Q26 34 22 32 Q18 30 18 26 Q18 22 22 22 Q24 22 26 25 Q28 22 30 22 Q34 22 34 26 Q34 30 30 32 Q26 34 26 38Z" fill={T} opacity=".3" />
      </svg>
      <div>
        <div style={{ fontSize: 11, color: "#666", lineHeight: 1.3 }}>Société de services<br />à la minute</div>
      </div>
    </div>
  );
}

function NavLink({ children, onClick, active }) {
  return (
    <button className="nav-link" onClick={onClick} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 12px", fontSize: 14, fontWeight: active ? 600 : 400, color: active ? T : "#555", borderBottom: active ? `2px solid ${T}` : "2px solid transparent", transition: "color .15s", display: "flex", alignItems: "center", gap: 2 }}>
      {children}
    </button>
  );
}

// ═══════════ HOME ═══════════
function PageHome({ goTo }) {
  return (
    <div>
      {/* HERO */}
      <section style={{ position: "relative", minHeight: 480, overflow: "hidden", display: "flex", alignItems: "center" }}>
        <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1400&h=600&fit=crop&auto=format" alt="Services à la personne" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.35)" }} />
        <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", padding: "60px 24px", width: "100%" }}>
          <div style={{ maxWidth: 520, background: `linear-gradient(135deg, ${T}ee, ${TD}cc)`, backdropFilter: "blur(4px)", borderRadius: 4, padding: "36px 40px", animation: "fadeUp .6s ease", borderLeft: `5px solid ${PU}` }}>
            <h1 style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 800, color: "#fff", lineHeight: 1.25, fontFamily: "Syne, sans-serif" }}>
              J&apos;MTD, spécialiste des services à la personne en Martinique
            </h1>
            <div style={{ height: 4, background: `linear-gradient(90deg, ${PU}, ${T})`, borderRadius: 2, margin: "20px 0" }} />
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.9)", lineHeight: 1.7 }}>
              L&apos;équipe de <strong>{FONDATRICE}</strong> se déplace au domicile de ses clients pour les accompagner — avec sérieux et toujours avec le sourire.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
              <button className="btn-teal" onClick={() => goTo("contact")} style={{ background: "#fff", color: T, padding: "11px 24px", borderRadius: 30, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "background .2s" }}>Devis gratuit</button>
              <button onClick={() => goTo("services")} style={{ background: "transparent", color: "#fff", padding: "11px 24px", borderRadius: 30, border: "2px solid rgba(255,255,255,.7)", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Nos prestations →</button>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO + SERVICES CERCLES */}
      <section style={{ background: "#fff", padding: "64px 24px 48px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 15, color: "#555", lineHeight: 1.8, marginBottom: 48 }}>
            J&apos;MTD est une entreprise de <strong>services à la personne</strong> basée à Rivière Salée, en <strong>Martinique</strong> (97215).
            Au plus proche de ses clients, l&apos;équipe de {FONDATRICE}, fondatrice de J&apos;MTD, propose des <strong>prestations de qualité</strong>, dont :
          </p>

          {/* Cercles services */}
          <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 24, marginBottom: 40 }}>
            {SERVICES.map(s => (
              <button key={s.id} className="svc-circle" onClick={() => goTo(s.id === "rangement" ? "coach" : "services", s.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <div style={{ width: 140, height: 140, borderRadius: "50%", overflow: "hidden", border: `3px solid ${s.id === "rangement" ? T : "#e8e8e8"}`, boxShadow: "0 4px 16px rgba(0,0,0,.08)" }}>
                  <img src={s.img} alt={s.label} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .3s" }} />
                </div>
                <span style={{ fontSize: 12, color: s.id === "rangement" ? T : "#555", fontWeight: s.id === "rangement" ? 600 : 400, lineHeight: 1.4, textAlign: "center", whiteSpace: "pre-line", transition: "color .2s" }}>{s.label}</span>
              </button>
            ))}
          </div>

          <button className="btn-teal" onClick={() => goTo("tarifs")} style={{ background: T, color: "#fff", padding: "13px 36px", borderRadius: 30, border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "background .2s" }}>Nos Tarifs</button>
        </div>
      </section>

      {/* VAGUE SVG */}
      <div style={{ lineHeight: 0, overflow: "hidden" }}>
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", display: "block" }}>
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,30 1440,40 L1440,80 L0,80 Z" fill={LG} />
          <path d="M0,50 C400,10 800,70 1200,30 C1320,16 1400,45 1440,50 L1440,80 L0,80 Z" fill={LG} opacity=".5" />
        </svg>
      </div>

      {/* ABOUT */}
      <section style={{ background: LG, padding: "56px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 48, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <Eyebrow>À propos de J&apos;MTD</Eyebrow>
            <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, color: TX, marginBottom: 16, fontFamily: "Syne, sans-serif", lineHeight: 1.3 }}>
              Avec le plus grand sérieux,<br />et toujours avec le sourire
            </h2>
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.9, marginBottom: 14 }}>
              Avec le plus grand sérieux, et toujours avec le sourire, l&apos;équipe de J&apos;MTD se déplace au domicile de ses clients pour les accompagner et soulager leur quotidien.
            </p>
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.9, marginBottom: 14 }}>
              Le <strong>ménage</strong> de votre <strong>domicile</strong> à Rivière Salée en <strong>Martinique</strong> est devenu une corvée ? Vos vêtements et affaires personnelles débordent des placards au Diamant ? Vous avez besoin de courses livrées à domicile à Saint-Esprit ? Vous cherchez de l&apos;aide pour organiser vos tâches administratives au Lamentin ?
            </p>
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.9, marginBottom: 24 }}>
              Faites appel à notre équipe ! L&apos;entreprise J&apos;MTD est un prestataire de <strong>services à la personne</strong> qui veille en permanence à la qualité des services dispensés à ses clients, au-delà des contraintes légales.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <button className="btn-teal" onClick={() => goTo("contact")} style={{ background: T, color: "#fff", padding: "11px 24px", borderRadius: 30, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "background .2s" }}>Nous contacter</button>
              <button className="btn-outline" onClick={() => goTo("services")} style={{ background: "transparent", color: T, padding: "11px 24px", borderRadius: 30, border: `2px solid ${T}`, fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all .2s" }}>Nos services</button>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 280, maxWidth: 440 }}>
            <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=420&fit=crop&auto=format" alt="Services J'MTD" style={{ width: "100%", borderRadius: 16, boxShadow: "0 12px 48px rgba(0,0,0,.12)" }} />
          </div>
        </div>
      </section>

      {/* AVANTAGES */}
      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <Eyebrow>Pourquoi nous choisir</Eyebrow>
            <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, color: TX, fontFamily: "Syne, sans-serif" }}>Les avantages J&apos;MTD</h2>
          </div>
          <div className="avantages-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { icon: "⭐", t: "Prestations de qualité", d: "Satisfaction de nos clients gage de la qualité de nos services. Nous veillons à vous apporter le meilleur à chaque instant." },
              { icon: "🤝", t: "Travail sérieux & suivi", d: "J'MTD est un prestataire sérieux qui veille à ses clients et à ses équipes. Au plus proche de vous, nous sommes à votre écoute." },
              { icon: "✂️", t: "Services sur mesure", d: "Chaque client est différent. Nous nous adaptons à vos exigences et à vos contraintes, quelle que soit la prestation." },
              { icon: "💰", t: "50% de crédit d'impôt", d: "Les services d'aide à la personne vous font bénéficier d'une réduction ou crédit d'impôt de 50% des sommes versées." },
              { icon: "📍", t: "Toute la Martinique", d: "De Rivière-Salée au Diamant, de Saint-Esprit au Lamentin — J'MTD intervient partout en Martinique." },
              { icon: "⏱", t: "Ponctualité garantie", d: "Nos intervenantes sont équipées d'un système de pointage GPS. Vos horaires sont respectés, systématiquement." },
            ].map(a => (
              <div key={a.t} className="card-svc" style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: "24px 20px", transition: "all .25s", borderTop: `3px solid ${T}` }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{a.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: TX, marginBottom: 8 }}>{a.t}</h3>
                <p style={{ fontSize: 13, color: "#777", lineHeight: 1.7 }}>{a.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CREDIT IMPOT BANNER */}
      <section style={{ background: T, padding: "40px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(20px,3vw,28px)", fontWeight: 800, color: "#fff", fontFamily: "Syne, sans-serif", marginBottom: 10 }}>50% de crédit d&apos;impôt sur vos dépenses</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.88)", lineHeight: 1.7, marginBottom: 24 }}>Les services à domicile proposés par J&apos;MTD vous font bénéficier d&apos;une réduction ou crédit d&apos;impôt de 50% sur les sommes versées (plafonné à 12 000€/an). Le CESU est accepté.</p>
          <button className="btn-teal" onClick={() => goTo("contact")} style={{ background: "#fff", color: T, padding: "12px 28px", borderRadius: 30, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Demander un devis gratuit</button>
        </div>
      </section>

      {/* ZONES */}
      <section style={{ background: LG, padding: "56px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Eyebrow>Zone d&apos;intervention</Eyebrow>
          <h2 style={{ fontSize: "clamp(20px,3vw,30px)", fontWeight: 800, color: TX, fontFamily: "Syne, sans-serif", marginBottom: 16 }}>Nous intervenons partout en Martinique</h2>
          <p style={{ fontSize: 14, color: "#777", lineHeight: 1.8, marginBottom: 24 }}>J&apos;MTD, basée à Rivière-Salée (97215), intervient sur l&apos;ensemble du territoire martiniquais.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {["Rivière-Salée", "Lamentin", "Fort-de-France", "Schoelcher", "Le Diamant", "Saint-Esprit", "Le Robert", "Le François", "Le Marin", "Sainte-Anne", "Le Vauclin", "La Trinité", "Le Lorrain", "Sainte-Marie"].map(z => (
              <span key={z} style={{ fontSize: 12, padding: "5px 14px", borderRadius: 20, background: "#fff", border: `1px solid ${T}33`, color: "#555" }}>{z}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ═══════════ SERVICES ═══════════
function PageServices({ goTo, initId }) {
  const [sel, setSel] = useState(initId || SERVICES[0].id);
  const svc = SERVICES.find(s => s.id === sel) || SERVICES[0];
  return (
    <div style={{ paddingTop: 0 }}>
      {/* Banner */}
      <div style={{ background: `linear-gradient(135deg, ${T}, ${TD})`, padding: "40px 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 800, color: "#fff", fontFamily: "Syne, sans-serif" }}>Nos prestations</h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,.85)", marginTop: 8 }}>Des services à domicile de qualité sur toute la Martinique</p>
      </div>

      <section style={{ padding: "48px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36, borderBottom: "2px solid #eee", paddingBottom: 0 }}>
            {SERVICES.map(s => (
              <button key={s.id} onClick={() => setSel(s.id)} style={{ padding: "10px 18px", fontSize: 13, fontWeight: 600, background: "none", border: "none", borderBottom: sel === s.id ? `3px solid ${T}` : "3px solid transparent", color: sel === s.id ? T : "#777", cursor: "pointer", marginBottom: -2, transition: "all .15s" }}>
                {s.label.split("\n")[0]} {s.label.split("\n")[1] || ""}
              </button>
            ))}
          </div>

          {/* Detail */}
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap", animation: "fadeIn .35s ease" }}>
            <div style={{ flex: 1, minWidth: 260, maxWidth: 340 }}>
              <img src={svc.img} alt={svc.label} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: "50%", border: `4px solid ${T}22`, boxShadow: "0 8px 32px rgba(0,0,0,.1)" }} />
            </div>
            <div style={{ flex: 2, minWidth: 280 }}>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: TX, fontFamily: "Syne, sans-serif", marginBottom: 14, lineHeight: 1.3 }}>{svc.label.replace(/\n/g, " ")}</h2>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.85, marginBottom: 24 }}>{svc.desc}</p>
              {svc.special && <div style={{ background: `${T}10`, border: `1px solid ${T}33`, borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}><p style={{ fontSize: 13, color: T, fontWeight: 600 }}>💡 Prestation spéciale coaching en rangement</p><p style={{ fontSize: 13, color: "#666", marginTop: 4 }}>Inspirée de la méthode Marie Kondo — 3 formules disponibles.</p></div>}
              <h3 style={{ fontSize: 13, fontWeight: 700, color: TX, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Ce qui est inclus</h3>
              <ul style={{ listStyle: "none", marginBottom: 28 }}>
                {svc.details.map((d, i) => <li key={i} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: "1px solid #f0f0f0", fontSize: 14, color: "#555" }}><span style={{ color: T, flexShrink: 0 }}>✓</span>{d}</li>)}
              </ul>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button className="btn-teal" onClick={() => goTo("contact")} style={{ background: T, color: "#fff", padding: "12px 28px", borderRadius: 30, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "background .2s" }}>Demander un devis</button>
                <button onClick={() => goTo("tarifs")} style={{ background: "transparent", color: T, padding: "12px 24px", borderRadius: 30, border: `2px solid ${T}`, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Voir les tarifs</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CreditImpotBanner goTo={goTo} />
    </div>
  );
}

// ═══════════ COACH ═══════════
function PageCoach({ goTo }) {
  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${T}, ${TD})`, padding: "40px 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 800, color: "#fff", fontFamily: "Syne, sans-serif" }}>Coach en rangement en Martinique !</h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,.85)", marginTop: 8 }}>Prestation spéciale · Inspirée de la méthode Marie Kondo</p>
      </div>
      <section style={{ padding: "56px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 48, flexWrap: "wrap", marginBottom: 48 }}>
            <div style={{ flex: 1, minWidth: 280, maxWidth: 400 }}>
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop&auto=format" alt="Coach rangement" style={{ width: "100%", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,.1)" }} />
            </div>
            <div style={{ flex: 1, minWidth: 280 }}>
              <Eyebrow>Prestation spéciale</Eyebrow>
              <h2 style={{ fontSize: "clamp(20px,3vw,28px)", fontWeight: 800, color: TX, fontFamily: "Syne, sans-serif", marginBottom: 16, lineHeight: 1.3 }}>Un spécialiste du rangement intervient chez vous</h2>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.85, marginBottom: 12 }}>Fan absolue de Marie Kondo, un peu maniaque, mais surtout méticuleuse, notre spécialiste du rangement étudie vos besoins, vos habitudes de vie et vos attentes.</p>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.85, marginBottom: 24 }}>Un diagnostic initial nous permettra de vous présenter le travail à réaliser et la manière de procéder pour ranger votre intérieur. Notre coach intervient dans toutes les pièces : pièces à vivre, armoires, placards, bureaux…</p>
              <button className="btn-teal" onClick={() => goTo("contact")} style={{ background: T, color: "#fff", padding: "12px 28px", borderRadius: 30, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "background .2s" }}>Demander un devis</button>
            </div>
          </div>

          <h3 style={{ fontSize: 20, fontWeight: 800, color: TX, fontFamily: "Syne, sans-serif", textAlign: "center", marginBottom: 28 }}>Nos 3 formules</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {[
              { icon: "💡", tag: "Formule découverte", t: "Recommandations & conseils", d: "1 heure — Diagnostic de votre intérieur, conseils pratiques personnalisés pour mieux ranger." },
              { icon: "🤝", tag: "Formule accompagnement", t: "Conseils & accompagnement", d: "Plusieurs séances — Notre coach vous guide et vous montre comment trier, archiver, désencombrer." },
              { icon: "✅", tag: "Formule clé en main", t: "Prestation intégrale", d: "Rangement complet réalisé par votre coach, de A à Z, dans toutes les pièces souhaitées." },
            ].map(f => (
              <div key={f.t} className="card-svc" style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: "24px 20px", borderTop: `3px solid ${T}`, transition: "all .25s" }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontSize: 11, color: T, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{f.tag}</div>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: TX, marginBottom: 8 }}>{f.t}</h4>
                <p style={{ fontSize: 13, color: "#777", lineHeight: 1.7 }}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CreditImpotBanner goTo={goTo} />
    </div>
  );
}

// ═══════════ TARIFS ═══════════
function PageTarifs({ goTo }) {
  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${T}, ${TD})`, padding: "40px 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 800, color: "#fff", fontFamily: "Syne, sans-serif" }}>Nos tarifs</h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,.85)", marginTop: 8 }}>Tous les devis sont personnalisés et gratuits</p>
      </div>
      <section style={{ padding: "56px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ background: `${T}0A`, border: `1px solid ${T}33`, borderRadius: 14, padding: "20px 24px", marginBottom: 36, display: "flex", gap: 16, alignItems: "flex-start" }}>
            <span style={{ fontSize: 24 }}>💰</span>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: TX, marginBottom: 4 }}>50% de crédit d&apos;impôt applicable</p>
              <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7 }}>Les services à domicile J&apos;MTD vous font bénéficier d&apos;une réduction ou crédit d&apos;impôt de 50% sur les sommes versées (plafonné à 12 000€/an). Le CESU est accepté.</p>
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="tarifs-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: T, color: "#fff" }}>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontWeight: 700, borderRadius: "10px 0 0 0" }}>Prestation</th>
                  <th style={{ padding: "14px 16px", textAlign: "center", fontWeight: 700 }}>Tarif</th>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontWeight: 700, borderRadius: "0 10px 0 0" }}>Détail</th>
                </tr>
              </thead>
              <tbody>
                {TARIFS.map((t, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : LG }}>
                    <td style={{ padding: "14px 16px", color: TX, fontWeight: 500 }}>{t.service}</td>
                    <td style={{ padding: "14px 16px", textAlign: "center", color: T, fontWeight: 700 }}>{t.tarif}</td>
                    <td style={{ padding: "14px 16px", color: "#777", fontSize: 13 }}>{t.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <p style={{ fontSize: 14, color: "#777", marginBottom: 20 }}>Chaque devis est établi gratuitement selon votre situation. Contactez-nous pour en savoir plus.</p>
            <button className="btn-teal" onClick={() => goTo("contact")} style={{ background: T, color: "#fff", padding: "13px 32px", borderRadius: 30, border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "background .2s" }}>Demander un devis gratuit</button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ═══════════ CONTACT ═══════════
function PageContact({ goTo, onSubmit }) {
  const [form, setForm] = useState({ prenom: "", nom: "", tel: "", email: "", message: "", service: SERVICES[0].label.replace(/\n/g, " "), zone: ZONES[0], rgpd: false });
  const [sent, setSent] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = () => {
    if (!form.prenom || !form.nom || !form.tel || !form.message) return alert("Merci de remplir tous les champs obligatoires (*)");
    if (!form.rgpd) return alert("Merci d'accepter d'être contacté(e) par J'MTD");
    onSubmit(form); setSent(true);
  };
  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${T}, ${TD})`, padding: "40px 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 800, color: "#fff", fontFamily: "Syne, sans-serif" }}>Nous contacter</h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,.85)", marginTop: 8 }}>Devis gratuit · Réponse rapide</p>
      </div>
      <section style={{ padding: "56px 24px", background: LG }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 36 }}>
            {[{ icon: "📍", t: "Adresse", v: "Quartier Les Digues\n97215 Rivière-Salée" }, { icon: "📞", t: "Téléphone", v: PHONE, href: PHONE_HREF }, { icon: "⏰", t: "Horaires", v: "Lun–Ven · 08h–18h" }].map(c => (
              <div key={c.t} style={{ flex: 1, minWidth: 160, background: "#fff", borderRadius: 14, padding: "20px 18px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,.06)", borderTop: `3px solid ${T}` }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
                <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{c.t}</div>
                {c.href ? <a href={c.href} style={{ fontSize: 14, fontWeight: 700, color: T }}>{c.v}</a> : <div style={{ fontSize: 13, color: TX, whiteSpace: "pre-line" }}>{c.v}</div>}
              </div>
            ))}
          </div>

          {!sent ? (
            <div style={{ background: "#fff", borderRadius: 16, padding: "36px 32px", boxShadow: "0 4px 24px rgba(0,0,0,.07)" }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: TX, fontFamily: "Syne, sans-serif", marginBottom: 24 }}>Formulaire de contact / devis</h2>
              <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 0 }}>
                <FInput label="Prénom *" val={form.prenom} set={v => set("prenom", v)} />
                <FInput label="Nom *" val={form.nom} set={v => set("nom", v)} />
              </div>
              <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <FInput label="Téléphone *" val={form.tel} set={v => set("tel", v)} type="tel" />
                <FInput label="Email" val={form.email} set={v => set("email", v)} type="email" />
              </div>
              <FSelect label="Prestation souhaitée" val={form.service} set={v => set("service", v)} opts={SERVICES.map(s => s.label.replace(/\n/g, " "))} />
              <FSelect label="Zone d'intervention" val={form.zone} set={v => set("zone", v)} opts={ZONES} />
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6, fontWeight: 500 }}>Message *</label>
                <textarea style={inp} rows={4} value={form.message} onChange={e => set("message", e.target.value)} placeholder="Décrivez votre besoin, la fréquence souhaitée..." />
              </div>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "#666", cursor: "pointer", marginBottom: 24 }}>
                <input type="checkbox" checked={form.rgpd} onChange={e => set("rgpd", e.target.checked)} style={{ accentColor: T, marginTop: 2, flexShrink: 0 }} />
                J&apos;accepte d&apos;être contacté(e) par J&apos;MTD pour traiter ma demande.
              </label>
              <button className="btn-teal" onClick={submit} style={{ background: T, color: "#fff", padding: "13px 0", width: "100%", borderRadius: 30, border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "background .2s" }}>Envoyer ma demande</button>
            </div>
          ) : (
            <div style={{ background: "#fff", borderRadius: 16, padding: "64px 32px", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,.07)" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>📬</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: TX, marginBottom: 8 }}>Message bien reçu !</h3>
              <p style={{ fontSize: 14, color: "#777" }}>Nous vous recontactons dans les plus brefs délais.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ═══════════ PORTAIL PRIVÉ ═══════════
function PagePortail({ goTo }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0A0F1E", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 380, width: "100%", textAlign: "center" }}>
        <button onClick={() => goTo("home")} style={{ background: "none", border: "1px solid rgba(255,255,255,.15)", borderRadius: 20, color: "#94A3B8", padding: "6px 16px", fontSize: 12, cursor: "pointer", marginBottom: 24 }}>← Retour au site</button>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔐</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#F0FDFA", marginBottom: 8 }}>Espace Privé J&apos;MTD</h2>
        <p style={{ fontSize: 13, color: "#64748B", marginBottom: 28 }}>Réservé aux intervenantes et à l&apos;administration.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[{ icon: "👤", t: "Espace intervenante", s: "Pointer mes heures — GPS activé", p: "loginEmp", c: `rgba(13,169,164,.12)`, bc: `rgba(13,169,164,.3)` }, { icon: "📊", t: "Administration", s: "Heures, contacts, équipe", p: "adminLogin", c: "rgba(255,255,255,.03)", bc: "rgba(255,255,255,.08)" }].map(b => (
            <button key={b.p} onClick={() => goTo(b.p)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: b.c, border: `1px solid ${b.bc}`, borderRadius: 14, cursor: "pointer", color: "#F0FDFA", textAlign: "left", width: "100%" }}>
              <span style={{ fontSize: 26 }}>{b.icon}</span>
              <div style={{ flex: 1 }}><strong style={{ display: "block", fontSize: 14 }}>{b.t}</strong><span style={{ fontSize: 12, color: "#64748B" }}>{b.s}</span></div>
              <span style={{ color: "#475569" }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════ LOGIN EMP ═══════════
function LoginEmp({ emps, onLogin, back }) {
  const [sel, setSel] = useState(null); const [pin, setPin] = useState(""); const [err, setErr] = useState("");
  return (
    <div style={{ minHeight: "100vh", background: "#0A0F1E", padding: "24px 16px", maxWidth: 480, margin: "0 auto" }}>
      <button style={{ background: "none", border: "none", color: "#06B6D4", fontSize: 14, cursor: "pointer", marginBottom: 20, display: "block" }} onClick={back}>← Retour</button>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#F0FDFA", marginBottom: 4 }}>Identification</h2>
      <p style={{ fontSize: 13, color: "#64748B", marginBottom: 20 }}>Sélectionnez votre nom puis entrez votre PIN</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {emps.map(e => (
          <button key={e.id} onClick={() => { setSel(e.id); setErr(""); setPin(""); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: sel === e.id ? "rgba(13,169,164,.1)" : "rgba(255,255,255,.03)", border: `1px solid ${sel === e.id ? "rgba(13,169,164,.3)" : "rgba(255,255,255,.06)"}`, borderRadius: 12, cursor: "pointer" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, #0E7490, ${T})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#fff" }}>{e.name[0]}</div>
            <div style={{ flex: 1, textAlign: "left" }}><div style={{ fontSize: 14, fontWeight: 600, color: "#F0FDFA" }}>{e.name}</div><div style={{ fontSize: 11, color: "#64748B" }}>{e.role} · {e.zone}</div></div>
            {sel === e.id && <span style={{ color: T }}>✓</span>}
          </button>
        ))}
      </div>
      {sel && <PinPad pin={pin} setPin={setPin} onDone={() => { const e = emps.find(x => x.id === sel); if (pin !== e?.pin) { setErr("Code incorrect"); setPin(""); } else onLogin(e); }} err={err} />}
    </div>
  );
}

function PinPad({ pin, setPin, onDone, err }) {
  const press = n => { if (n === "⌫") return setPin(p => p.slice(0, -1)); if (pin.length < 4) setPin(p => p + n); };
  useEffect(() => { if (pin.length === 4) onDone(); }, [pin]);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 20 }}>
        {[0, 1, 2, 3].map(i => <div key={i} style={{ width: 14, height: 14, borderRadius: 7, border: "2px solid", borderColor: pin.length > i ? T : "#334155", background: pin.length > i ? T : "transparent", transition: "all .15s" }} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, maxWidth: 220, margin: "0 auto 12px" }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "⌫"].map((n, i) => n === null ? <div key={i} /> : <button key={i} onClick={() => press(n)} style={{ padding: "12px 0", fontSize: 20, fontWeight: 600, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 10, color: "#F0FDFA", cursor: "pointer" }}>{n}</button>)}
      </div>
      {err && <p style={{ color: "#F87171", fontSize: 12, textAlign: "center", marginTop: 8 }}>{err}</p>}
    </div>
  );
}

// ═══════════ POINTAGE ═══════════
function PagePointage({ emp, sess, active, clockIn, clockOut, logout }) {
  const [client, setClient] = useState(""); const [note, setNote] = useState(""); const [showHist, setShowHist] = useState(false); const [elapsed, setElapsed] = useState("00:00:00");
  const geo = useGeo();
  useEffect(() => { if (!active) return; const tick = () => { const d = Date.now() - new Date(active.in).getTime(); setElapsed(`${pad(Math.floor(d / 36e5))}:${pad(Math.floor((d % 36e5) / 6e4))}:${pad(Math.floor((d % 6e4) / 1e3))}`); }; tick(); const id = setInterval(tick, 1000); return () => clearInterval(id); }, [active]);
  const todayH = sess.filter(s => s.in?.startsWith(today())).reduce((a, s) => a + hrs(s.in, s.out || new Date().toISOString()), 0);
  const wkH = sess.filter(s => weekNum(s.in) === weekNum(new Date())).reduce((a, s) => a + hrs(s.in, s.out || new Date().toISOString()), 0);
  const dinp = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.04)", color: "#F0FDFA", fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 8 };
  return (
    <div style={{ background: "#0A0F1E", minHeight: "100vh", padding: "20px 16px", maxWidth: 480, margin: "0 auto", fontFamily: "inherit" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div><h2 style={{ fontSize: 20, fontWeight: 800, color: "#F0FDFA" }}>{emp.name}</h2><p style={{ fontSize: 12, color: "#64748B" }}>{emp.role} · {emp.zone}</p></div>
        <button onClick={logout} style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 8, color: "#64748B", padding: "5px 12px", fontSize: 11, cursor: "pointer" }}>Quitter</button>
      </div>
      <div style={active ? { background: "linear-gradient(135deg,rgba(5,150,105,.07),rgba(5,150,105,.02))", border: "1px solid rgba(5,150,105,.22)", borderRadius: 18, padding: 20, marginBottom: 16, textAlign: "center" } : { background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 18, padding: 20, marginBottom: 16, textAlign: "center" }}>
        {active ? (<>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: 20, background: "rgba(5,150,105,.14)", color: "#34D399", fontSize: 12, fontWeight: 600, marginBottom: 6 }}><span style={{ animation: "pulse 1.5s infinite" }}>●</span> En service</div>
          <div style={{ fontSize: 44, fontWeight: 800, color: "#34D399", margin: "4px 0 6px", letterSpacing: 2 }}>{elapsed}</div>
          <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 12 }}>Chez <strong style={{ color: "#F0FDFA" }}>{active.client || "—"}</strong> depuis {fmtTime(active.in)}</p>
          <input style={dinp} placeholder="Note de fin (optionnel)" value={note} onChange={e => setNote(e.target.value)} />
          {!geo.loc && !geo.loading && <button onClick={geo.request} style={{ width: "100%", padding: "10px 0", fontSize: 13, fontWeight: 600, background: `rgba(13,169,164,.08)`, border: `1px solid rgba(13,169,164,.2)`, borderRadius: 10, color: T, cursor: "pointer", marginBottom: 8 }}>📡 GPS pour le départ</button>}
          {geo.loading && <div style={{ padding: "10px 0", fontSize: 12, color: T, textAlign: "center" }}>📡 Acquisition GPS...</div>}
          {geo.loc && <div style={{ fontSize: 12, color: "#34D399", textAlign: "center", marginBottom: 8 }}>✓ GPS acquis (±{geo.loc.acc}m)</div>}
          <button onClick={() => { clockOut(note, geo.loc); setNote(""); geo.reset(); }} style={{ width: "100%", padding: "12px 0", fontSize: 14, fontWeight: 700, background: "linear-gradient(135deg,#991B1B,#DC2626)", border: "none", borderRadius: 12, color: "#fff", cursor: "pointer" }}>⏹ Fin de service</button>
        </>) : (<>
          <div style={{ display: "inline-block", padding: "4px 14px", borderRadius: 20, background: "rgba(100,116,139,.1)", color: "#64748B", fontSize: 12, fontWeight: 600, marginBottom: 8 }}>○ Disponible</div>
          <p style={{ fontSize: 14, color: "#94A3B8", margin: "8px 0 14px" }}>Prête à démarrer une intervention ?</p>
          <input style={dinp} placeholder="Nom du client / lieu" value={client} onChange={e => setClient(e.target.value)} />
          {!geo.loc && !geo.loading && <button onClick={geo.request} style={{ width: "100%", padding: "10px 0", fontSize: 13, fontWeight: 600, background: `rgba(13,169,164,.08)`, border: `1px solid rgba(13,169,164,.2)`, borderRadius: 10, color: T, cursor: "pointer", marginBottom: 8 }}>📡 Activer le GPS</button>}
          {geo.loading && <div style={{ padding: "10px 0", fontSize: 12, color: T, textAlign: "center" }}>📡 Acquisition GPS...</div>}
          {geo.err && <p style={{ fontSize: 11, color: "#FBBF24", textAlign: "center", marginBottom: 8 }}>⚠ {geo.err}</p>}
          {geo.loc && <div style={{ fontSize: 12, color: "#34D399", textAlign: "center", marginBottom: 8 }}>✓ Position acquise (±{geo.loc.acc}m)</div>}
          <button onClick={() => { clockIn(client, geo.loc); setClient(""); geo.reset(); }} style={{ width: "100%", padding: "12px 0", fontSize: 14, fontWeight: 700, background: `linear-gradient(135deg,#047857,#059669)`, border: "none", borderRadius: 12, color: "#fff", cursor: "pointer" }}>▶ Début de service</button>
        </>)}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[{ v: todayH.toFixed(1) + "h", l: "Aujourd'hui", c: T }, { v: wkH.toFixed(1) + "h", l: "Semaine", c: "#059669" }, { v: String(sess.filter(s => weekNum(s.in) === weekNum(new Date())).length), l: "Interventions", c: "#D97706" }].map((s, i) => (
          <div key={i} style={{ flex: 1, background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.04)", borderRadius: 12, padding: "10px 8px", textAlign: "center", borderLeft: `3px solid ${s.c}` }}><div style={{ fontSize: 18, fontWeight: 800, color: "#F0FDFA" }}>{s.v}</div><div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>{s.l}</div></div>
        ))}
      </div>
      <button onClick={() => setShowHist(!showHist)} style={{ width: "100%", background: "none", border: "none", color: T, fontSize: 12, fontWeight: 600, cursor: "pointer", padding: "8px 0" }}>{showHist ? "▲ Masquer" : "▼ Mon historique"}</button>
      {showHist && sess.filter(s => s.out).sort((a, b) => new Date(b.in) - new Date(a.in)).slice(0, 10).map(s => (
        <div key={s.id} style={{ background: "rgba(255,255,255,.02)", borderRadius: 12, padding: "10px 14px", marginBottom: 6, borderLeft: `3px solid ${T}` }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div><div style={{ fontSize: 11, color: T, fontWeight: 600, textTransform: "capitalize" }}>{fmtDate(s.in)}</div><div style={{ fontSize: 13, color: "#CBD5E1" }}>{fmtTime(s.in)} → {fmtTime(s.out)}</div></div>
            <div style={{ textAlign: "right" }}><div style={{ fontSize: 16, fontWeight: 800, color: "#F0FDFA" }}>{hrs(s.in, s.out).toFixed(1)}h</div><div style={{ fontSize: 10, color: "#64748B" }}>{s.client || "—"}</div></div>
          </div>
          {s.geoIn && <div style={{ fontSize: 10, color: "#059669", marginTop: 4 }}>📍 GPS ✓</div>}
        </div>
      ))}
    </div>
  );
}

// ═══════════ ADMIN LOGIN ═══════════
function AdminLogin({ onLogin, back }) {
  const [pin, setPin] = useState(""); const [err, setErr] = useState("");
  return (
    <div style={{ minHeight: "100vh", background: "#0A0F1E", padding: "24px 16px", maxWidth: 480, margin: "0 auto" }}>
      <button style={{ background: "none", border: "none", color: T, fontSize: 14, cursor: "pointer", marginBottom: 20, display: "block" }} onClick={back}>← Retour</button>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#F0FDFA", marginBottom: 4 }}>Administration</h2>
      <p style={{ fontSize: 13, color: "#64748B", marginBottom: 24 }}>Code administrateur requis</p>
      <PinPad pin={pin} setPin={setPin} onDone={() => { if (pin === "0000") onLogin(); else { setErr("Code incorrect"); setPin(""); } }} err={err} />
    </div>
  );
}

// ═══════════ PAGE ADMIN ═══════════
function PageAdmin({ emps, sess, contacts, addEmp, removeEmp, logout, notify }) {
  const [tab, setTab] = useState("heures"); const [wk, setWk] = useState(weekNum(new Date())); const [flt, setFlt] = useState("all"); const [showAdd, setShowAdd] = useState(false); const [form, setForm] = useState({ name: "", role: "", zone: ZONES[0], pin: "" }); const [confirmDel, setConfirmDel] = useState(null);
  const wkSess = sess.filter(s => s.out && weekNum(s.in) === wk);
  const stats = emps.map(e => { const es = wkSess.filter(s => s.eid === e.id); return { ...e, h: es.reduce((a, s) => a + hrs(s.in, s.out), 0), n: es.length, isOn: sess.some(s => s.eid === e.id && !s.out) }; });
  const filtered = flt === "all" ? wkSess : wkSess.filter(s => s.eid === flt);
  const doAdd = () => { if (!form.name || !form.role || form.pin.length !== 4) return notify("Remplissez tous les champs (PIN 4 chiffres)", "err"); addEmp({ id: `e${Date.now()}`, ...form }); setForm({ name: "", role: "", zone: ZONES[0], pin: "" }); setShowAdd(false); notify(`${form.name} ajoutée`); };
  const dinp = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.04)", color: "#F0FDFA", fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 8 };
  return (
    <div style={{ background: "#0A0F1E", minHeight: "100vh", padding: "20px 16px", fontFamily: "inherit" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div><h2 style={{ fontSize: 22, fontWeight: 800, color: "#F0FDFA" }}>Dashboard Admin</h2><p style={{ fontSize: 12, color: "#64748B" }}>J&apos;MTD · {FONDATRICE}</p></div>
        <button onClick={logout} style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 8, color: "#64748B", padding: "5px 12px", fontSize: 11, cursor: "pointer" }}>Quitter</button>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 16, overflowX: "auto" }}>
        {[["heures", "⏱ Heures"], ["contacts", `📬 Contacts (${contacts.length})`], ["equipe", "🧑 Équipe"]].map(([id, l]) => (
          <button key={id} onClick={() => setTab(id)} style={{ padding: "8px 14px", fontSize: 12, fontWeight: 600, background: tab === id ? `rgba(13,169,164,.12)` : "rgba(255,255,255,.02)", border: `1px solid ${tab === id ? "rgba(13,169,164,.25)" : "rgba(255,255,255,.04)"}`, borderRadius: 8, color: tab === id ? T : "#64748B", cursor: "pointer", whiteSpace: "nowrap" }}>{l}</button>
        ))}
      </div>
      {tab === "heures" && (<div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 14 }}>
          <button onClick={() => setWk(w => w - 1)} style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 6, color: "#F0FDFA", padding: "3px 10px", cursor: "pointer", fontSize: 16 }}>‹</button>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#F0FDFA", minWidth: 100, textAlign: "center" }}>Semaine {wk}</span>
          <button onClick={() => setWk(w => w + 1)} style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 6, color: "#F0FDFA", padding: "3px 10px", cursor: "pointer", fontSize: 16 }}>›</button>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[{ v: stats.reduce((a, e) => a + e.h, 0).toFixed(1) + "h", l: "Total heures", c: T }, { v: stats.reduce((a, e) => a + e.n, 0), l: "Interventions", c: "#059669" }, { v: `${stats.filter(e => e.isOn).length}/${emps.length}`, l: "En service", c: "#D97706" }].map((s, i) => (
            <div key={i} style={{ flex: 1, background: "rgba(255,255,255,.02)", borderRadius: 12, padding: "10px 8px", textAlign: "center", borderLeft: `3px solid ${s.c}` }}><div style={{ fontSize: 18, fontWeight: 800, color: "#F0FDFA" }}>{s.v}</div><div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>{s.l}</div></div>
          ))}
        </div>
        {stats.map(e => (<div key={e.id} style={{ background: "rgba(255,255,255,.02)", borderRadius: 14, padding: "12px 14px", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: e.isOn ? "#059669" : "#475569" }} />
            <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 700, color: "#F0FDFA" }}>{e.name}</div><div style={{ fontSize: 11, color: "#64748B" }}>{e.role}</div></div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#F0FDFA" }}>{e.h.toFixed(1)}<span style={{ fontSize: 12, color: "#64748B" }}>h</span></div>
          </div>
          <div style={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,.06)", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 3, width: `${Math.min((e.h / 35) * 100, 100)}%`, background: e.h > 35 ? "#DC2626" : T }} />
          </div>
        </div>))}
        <select style={{ ...dinp, marginTop: 12 }} value={flt} onChange={e => setFlt(e.target.value)}>
          <option value="all">Toutes les intervenantes</option>
          {emps.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
        {filtered.sort((a, b) => new Date(b.in) - new Date(a.in)).map(s => (
          <div key={s.id} style={{ display: "flex", padding: "8px 10px", borderBottom: "1px solid rgba(255,255,255,.03)", alignItems: "center", color: "#CBD5E1", gap: 4, fontSize: 12 }}>
            <span style={{ width: 70, textTransform: "capitalize" }}>{fmtDate(s.in)}</span><span style={{ flex: 1 }}>{s.name}</span><span style={{ width: 50, textAlign: "center" }}>{fmtTime(s.in)}</span><span style={{ width: 50, textAlign: "center" }}>{fmtTime(s.out)}</span><span style={{ width: 40, textAlign: "right", fontWeight: 700 }}>{hrs(s.in, s.out).toFixed(1)}h</span><span style={{ width: 24, textAlign: "center" }}>{s.geoIn ? "✅" : "—"}</span>
          </div>
        ))}
        {filtered.length === 0 && <p style={{ textAlign: "center", color: "#334155", fontSize: 12, padding: 20 }}>Aucune session cette semaine</p>}
      </div>)}
      {tab === "contacts" && (<div>
        <p style={{ fontSize: 13, fontWeight: 700, color: T, marginBottom: 12 }}>Demandes reçues ({contacts.length})</p>
        {contacts.length === 0 ? <p style={{ textAlign: "center", color: "#334155", padding: 24, fontSize: 12 }}>Aucune demande</p> : contacts.sort((a, b) => new Date(b.date) - new Date(a.date)).map(c => (
          <div key={c.id} style={{ background: "rgba(255,255,255,.02)", borderRadius: 14, padding: "12px 14px", marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><strong style={{ fontSize: 14, color: "#F0FDFA" }}>{c.prenom} {c.nom}</strong><span style={{ fontSize: 11, color: "#64748B" }}>{fmtDate(c.date)}</span></div>
            <div style={{ fontSize: 12, color: "#94A3B8", display: "flex", flexWrap: "wrap", gap: 10 }}><span>📞 {c.tel}</span>{c.email && <span>✉️ {c.email}</span>}<span>🛠 {c.service}</span></div>
            {c.message && <p style={{ fontSize: 12, color: "#64748B", fontStyle: "italic", marginTop: 4 }}>&quot;{c.message}&quot;</p>}
          </div>
        ))}
      </div>)}
      {tab === "equipe" && (<div>
        <p style={{ fontSize: 13, fontWeight: 700, color: T, marginBottom: 12 }}>Équipe ({emps.length} intervenantes)</p>
        {emps.map(e => (<div key={e.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, #0E7490, ${T})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#fff" }}>{e.name[0]}</div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 700, color: "#F0FDFA" }}>{e.name}</div><div style={{ fontSize: 11, color: "#64748B" }}>{e.role} · {e.zone}</div></div>
          {confirmDel === e.id ? (<div style={{ display: "flex", gap: 4 }}>
            <button onClick={() => { removeEmp(e.id); setConfirmDel(null); notify(`${e.name} retirée`); }} style={{ padding: "4px 8px", background: "#DC2626", border: "none", borderRadius: 6, color: "#fff", fontSize: 11, cursor: "pointer" }}>Oui</button>
            <button onClick={() => setConfirmDel(null)} style={{ padding: "4px 8px", background: "rgba(255,255,255,.06)", border: "none", borderRadius: 6, color: "#94A3B8", fontSize: 11, cursor: "pointer" }}>Non</button>
          </div>) : <button onClick={() => setConfirmDel(e.id)} style={{ background: "none", border: "none", color: "#475569", fontSize: 16, cursor: "pointer" }}>✕</button>}
        </div>))}
        {!showAdd ? <button onClick={() => setShowAdd(true)} style={{ background: T, color: "#fff", padding: "11px 24px", borderRadius: 30, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>+ Ajouter</button> : (
          <div style={{ background: "rgba(255,255,255,.02)", borderRadius: 14, padding: 16, border: "1px solid rgba(255,255,255,.06)", marginTop: 12 }}>
            <input style={dinp} placeholder="Nom complet" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <input style={dinp} placeholder="Rôle (ex: Aide ménagère)" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
            <select style={dinp} value={form.zone} onChange={e => setForm(f => ({ ...f, zone: e.target.value }))}>{ZONES.map(z => <option key={z}>{z}</option>)}</select>
            <input style={dinp} placeholder="Code PIN (4 chiffres)" value={form.pin} onChange={e => setForm(f => ({ ...f, pin: e.target.value.replace(/\D/g, "").slice(0, 4) }))} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={doAdd} style={{ flex: 1, padding: "12px 0", background: `linear-gradient(135deg,#047857,#059669)`, border: "none", borderRadius: 12, color: "#fff", fontWeight: 700, cursor: "pointer" }}>Ajouter</button>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: "12px 0", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, color: "#94A3B8", cursor: "pointer" }}>Annuler</button>
            </div>
          </div>
        )}
      </div>)}
    </div>
  );
}

// ─── SHARED ───
function Eyebrow({ children }) { return <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: T, textTransform: "uppercase", marginBottom: 10 }}>{children}</p>; }
function CreditImpotBanner({ goTo }) {
  return (
    <section style={{ background: T, padding: "40px 24px", textAlign: "center" }}>
      <h2 style={{ fontSize: "clamp(18px,2.5vw,26px)", fontWeight: 800, color: "#fff", marginBottom: 10 }}>50% de crédit d&apos;impôt sur vos dépenses</h2>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,.88)", lineHeight: 1.7, marginBottom: 20 }}>Profitez d&apos;une réduction fiscale de 50% sur les services à domicile J&apos;MTD.</p>
      <button onClick={() => goTo("contact")} style={{ background: "#fff", color: T, padding: "12px 28px", borderRadius: 30, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Demander un devis gratuit</button>
    </section>
  );
}

const inp = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd", background: "#fff", color: TX, fontSize: 13, outline: "none", boxSizing: "border-box" };
function FInput({ label, val, set, type = "text", placeholder = "" }) { return <div style={{ marginBottom: 14 }}><label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 5, fontWeight: 500 }}>{label}</label><input style={inp} type={type} value={val} onChange={e => set(e.target.value)} placeholder={placeholder} /></div>; }
function FSelect({ label, val, set, opts }) { return <div style={{ marginBottom: 14 }}><label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 5, fontWeight: 500 }}>{label}</label><select style={inp} value={val} onChange={e => set(e.target.value)}>{opts.map(o => <option key={o}>{o}</option>)}</select></div>; }

function Footer({ goTo }) {
  return (
    <footer style={{ background: "#1a1a1a", color: "#aaa", padding: "48px 24px 24px" }}>
      <div className="footer-cols" style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", gap: 40, marginBottom: 32, flexWrap: "wrap" }}>
        <div style={{ minWidth: 220 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8 }}>J&apos;MTD</div>
          <div style={{ fontSize: 12, marginBottom: 4 }}>Services à la Personne · Martinique (97215)</div>
          <div style={{ fontSize: 12, marginBottom: 4 }}>Fondatrice : {FONDATRICE}</div>
          <div style={{ fontSize: 12, marginBottom: 4 }}>SIRET {SIRET}</div>
          <div style={{ fontSize: 12 }}>Quartier Les Digues, 97215 Rivière-Salée</div>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Navigation</div>
          {[["home", "Accueil"], ["services", "Nos prestations"], ["coach", "Coach rangement"], ["tarifs", "Nos tarifs"], ["contact", "Contact"]].map(([p, l]) => (
            <button key={p} onClick={() => goTo(p)} style={{ display: "block", background: "none", border: "none", color: "#888", fontSize: 13, cursor: "pointer", padding: "3px 0", textAlign: "left" }}>{l}</button>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Contact</div>
          <a href={PHONE_HREF} style={{ display: "block", color: T, fontSize: 14, fontWeight: 700, marginBottom: 6 }}>📞 {PHONE}</a>
          <div style={{ fontSize: 12, marginBottom: 4 }}>{HORAIRES}</div>
          <div style={{ fontSize: 12 }}>✉️ {EMAIL}</div>
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", paddingTop: 20, borderTop: "1px solid #333", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "#555" }}>© 2025 J&apos;MTD · Tous droits réservés</span>
        <button onClick={() => goTo("portail")} style={{ background: "none", border: "none", color: "#444", fontSize: 11, cursor: "pointer" }}>🔐 Espace privé</button>
      </div>
    </footer>
  );
}

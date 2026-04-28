"use client";
import { useState, useEffect, useCallback } from "react";

/*
 * ═══════════════════════════════════════════════════════════════
 * J'MTD — SITE OFFICIEL v2.0
 * Services à la Personne — Martinique (972)
 * Fondatrice : Myriam Rovela
 * Adresse : Quartier Les Digues, 97215 Rivière-Salée
 * Tél : 05 96 63 13 08
 * SIRET : 802 877 779
 * ═══════════════════════════════════════════════════════════════
 */

// ─── Storage (localStorage) ───
async function load(key, fb) {
  try {
    if (typeof window === "undefined") return fb;
    const r = localStorage.getItem(key);
    return r ? JSON.parse(r) : fb;
  } catch { return fb; }
}
async function save(key, d) {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(d));
  } catch(e) {}
}

// ─── Utils ───
const pad = n => String(n).padStart(2, "0");
const fmtTime = d => new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
const fmtDate = d => new Date(d).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
const today = () => new Date().toISOString().split("T")[0];
const hrs = (a, b) => b ? Math.round(((new Date(b) - new Date(a)) / 36e5) * 100) / 100 : 0;
const weekNum = d => {
  const dt = new Date(d); dt.setHours(0, 0, 0, 0);
  dt.setDate(dt.getDate() + 3 - ((dt.getDay() + 6) % 7));
  const w1 = new Date(dt.getFullYear(), 0, 4);
  return 1 + Math.round(((dt - w1) / 864e5 - 3 + ((w1.getDay() + 6) % 7)) / 7);
};

// ─── REAL DATA ───
const PHONE = "05 96 63 13 08";
const PHONE_HREF = "tel:0596631308";
const ADDRESS = "Quartier Les Digues, 97215 Rivière-Salée, Martinique";
const EMAIL = "contact@jmtd.fr";
const HORAIRES = "Lun–Ven · 08h à 18h";
const FONDATRICE = "Myriam Rovela";

const SERVICES = [
  {
    id: "entretien", icon: "🏠",
    title: "Entretien & Nettoyage du domicile",
    short: "Ménage, repassage, nettoyage",
    desc: "Le ménage de votre domicile est devenu une corvée ? L'équipe J'MTD se déplace chez vous à Rivière-Salée, au Diamant, au Lamentin et partout en Martinique pour l'entretien et le nettoyage complet de votre intérieur. Travail sérieux, discret et toujours avec le sourire.",
    details: ["Ménage complet de votre domicile", "Repassage et entretien du linge", "Nettoyage des vitres et surfaces", "Désinfection des pièces", "Entretien des sols (aspirateur, serpillière)"],
    price: "Devis sur mesure",
  },
  {
    id: "repas", icon: "🍽️",
    title: "Préparation des repas à domicile",
    short: "Cuisine, repas équilibrés",
    desc: "J'MTD prépare vos repas directement chez vous, selon vos goûts et vos contraintes alimentaires. Des repas faits maison, équilibrés et savoureux, sans que vous n'ayez à lever le petit doigt.",
    details: ["Préparation de repas équilibrés", "Cuisine selon vos habitudes et régimes", "Aide aux personnes à mobilité réduite", "Respect des contraintes diététiques", "Rangement de la cuisine après cuisson"],
    price: "Devis sur mesure",
  },
  {
    id: "courses", icon: "🛒",
    title: "Livraison de courses à domicile",
    short: "Courses, commissions",
    desc: "Vous avez besoin de courses livrées à domicile à Saint-Esprit, au Robert, au François ? J'MTD s'occupe de vos commissions selon votre liste et vous les livre directement chez vous, dans les délais convenus.",
    details: ["Courses selon votre liste personnalisée", "Livraison à domicile sur toute la Martinique", "Respect de vos habitudes d'achat", "Gestion des produits frais et surgelés", "Rangement des courses à domicile"],
    price: "Devis sur mesure",
  },
  {
    id: "assistance", icon: "📋",
    title: "Assistance administrative",
    short: "Paperasse, démarches",
    desc: "Vous cherchez de l'aide pour organiser vos tâches administratives au Lamentin ou ailleurs en Martinique ? J'MTD vous accompagne dans vos démarches : tri du courrier, saisie informatique, aide aux formulaires, classement de documents.",
    details: ["Tri et classement du courrier", "Aide à la saisie informatique", "Accompagnement aux démarches en ligne", "Classement et archivage de documents", "Aide aux formulaires administratifs"],
    price: "Devis sur mesure",
  },
  {
    id: "rangement", icon: "🗂️",
    title: "Coach en rangement",
    short: "Désencombrement, organisation",
    desc: "Fan absolue de Marie Kondo, notre spécialiste du rangement étudie vos besoins, vos habitudes de vie et vos attentes. Un diagnostic initial nous permettra de vous présenter le travail à réaliser. Disponible dans toutes les pièces de votre domicile : armoires, placards, bureaux, pièces à vivre.",
    details: ["Recommandations et conseils (1h)", "Conseils et accompagnement au rangement", "Prestation de rangement intégrale", "Intervention dans toutes les pièces", "Conseils pratiques tri, archivage, désencombrement"],
    price: "3 formules disponibles",
    special: true,
  },
];

const DEMO_EMPS = [
  { id: "e1", name: "Marie-Louise D.", pin: "1234", zone: "Centre", role: "Aide ménagère" },
  { id: "e2", name: "Sylvie B.", pin: "5678", zone: "Nord", role: "Préparation repas" },
  { id: "e3", name: "Fabienne R.", pin: "9012", zone: "Sud", role: "Coach rangement" },
];
const ZONES = ["Centre (Lamentin/Rivière-Salée)", "Nord Atlantique", "Nord Caraïbe", "Sud (Diamant/Saint-Esprit)", "Toute la Martinique"];

// ─── GPS Hook ───
function useGeo() {
  const [loc, setLoc] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
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
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("home");
  const [emps, setEmps] = useState(DEMO_EMPS);
  const [sess, setSess] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [candidatures, setCandidatures] = useState([]);
  const [user, setUser] = useState(null);
  const [adminAuth, setAdminAuth] = useState(false);
  const [toast, setToast] = useState(null);
  const [ready, setReady] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeService, setActiveService] = useState(null);

  useEffect(() => {
    (async () => {
      setEmps(await load("jmtd-emps", DEMO_EMPS));
      setSess(await load("jmtd-sess", []));
      setContacts(await load("jmtd-contacts", []));
      setCandidatures(await load("jmtd-cands", []));
      setReady(true);
    })();
  }, []);

  useEffect(() => { if (ready) { save("jmtd-sess", sess); } }, [sess, ready]);
  useEffect(() => { if (ready) { save("jmtd-emps", emps); } }, [emps, ready]);
  useEffect(() => { if (ready) { save("jmtd-contacts", contacts); } }, [contacts, ready]);
  useEffect(() => { if (ready) { save("jmtd-cands", candidatures); } }, [candidatures, ready]);

  const notify = useCallback((msg, type = "ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); }, []);
  const goTo = useCallback((p, extra = {}) => { setPage(p); if (extra.service) setActiveService(extra.service); setMobileMenu(false); window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  const active = user ? sess.find(s => s.eid === user.id && !s.out) : null;
  const clockIn = useCallback((client, geo) => {
    const now = new Date().toISOString();
    setSess(p => [...p, { id: `s${Date.now()}`, eid: user.id, name: user.name, in: now, out: null, client, zone: user.zone, note: "", geoIn: geo || null, geoOut: null }]);
    notify(`Arrivée pointée à ${fmtTime(now)}${geo ? ` · GPS ✓ (±${geo.acc}m)` : ""}`);
  }, [user, notify]);
  const clockOut = useCallback((note, geo) => {
    if (!active) return;
    const now = new Date().toISOString();
    setSess(p => p.map(s => s.id === active.id ? { ...s, out: now, note, geoOut: geo || null } : s));
    notify(`Fin de service : ${hrs(active.in, now).toFixed(1)}h enregistrées`);
  }, [active, notify]);

  const isPrivate = ["portail", "loginEmp", "pointage", "adminLogin", "admin"].includes(page);

  return (
    <div style={C.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
        button,input,select,textarea{font-family:'DM Sans',sans-serif;}
        input::placeholder,textarea::placeholder{color:#64748B;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
      `}</style>

      {toast && <div style={{ ...C.toast, background: toast.type === "ok" ? "#059669" : toast.type === "err" ? "#DC2626" : "#D97706", animation: "slideDown .3s ease" }}><span>{toast.type === "ok" ? "✓" : "✕"}</span>{toast.msg}</div>}

      {/* NAV */}
      {!isPrivate && (
        <nav style={C.nav}>
          <button style={C.navLogo} onClick={() => goTo("home")}>
            <span style={C.logoText}>J&apos;MTD</span>
            <span style={C.logoSub}>Services à la Personne</span>
          </button>
          <div style={C.navCenter}>
            {[["home", "Accueil"], ["services", "Nos prestations"], ["coach", "Coach rangement"], ["contact", "Contact"]].map(([p, l]) => (
              <button key={p} style={{ ...C.navLink, ...(page === p ? C.navLinkOn : {}) }} onClick={() => goTo(p)}>{l}</button>
            ))}
          </div>
          <div style={C.navRight}>
            <a href={PHONE_HREF} style={C.navPhone}>{PHONE}</a>
            <button style={C.navPrivateBtn} onClick={() => goTo("portail")}>🔐 Espace privé</button>
          </div>
          <button style={C.burger} onClick={() => setMobileMenu(!mobileMenu)}>
            {[0, 1, 2].map(i => <span key={i} style={{ ...C.bline, ...(mobileMenu && i === 0 ? { transform: "rotate(45deg) translate(5px,5px)" } : mobileMenu && i === 1 ? { opacity: 0 } : mobileMenu && i === 2 ? { transform: "rotate(-45deg) translate(5px,-5px)" } : {}) }} />)}
          </button>
          {mobileMenu && (
            <div style={C.mMenu}>
              {[["home", "🏠 Accueil"], ["services", "🛠 Nos prestations"], ["coach", "🗂️ Coach rangement"], ["contact", "✉️ Contact"]].map(([p, l]) => (
                <button key={p} style={C.mLink} onClick={() => goTo(p)}>{l}</button>
              ))}
              <a href={PHONE_HREF} style={{ ...C.mLink, color: "#06B6D4", textDecoration: "none", display: "block", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,.04)" }}>📞 {PHONE}</a>
              <button style={{ ...C.mLink, color: "#06B6D4" }} onClick={() => goTo("portail")}>🔐 Espace privé</button>
            </div>
          )}
        </nav>
      )}

      {/* PAGES */}
      {page === "home" && <PageHome goTo={goTo} />}
      {page === "services" && <PageServices goTo={goTo} activeService={activeService} />}
      {page === "coach" && <PageCoach goTo={goTo} />}
      {page === "contact" && <PageContact goTo={goTo} onSubmit={d => { setContacts(p => [...p, { ...d, id: `k${Date.now()}`, date: new Date().toISOString() }]); notify("Message envoyé ! Réponse sous 24h."); goTo("home"); }} />}
      {page === "portail" && <PagePortail goTo={goTo} />}
      {page === "loginEmp" && <LoginEmp emps={emps} onLogin={e => { setUser(e); goTo("pointage"); }} back={() => goTo("portail")} />}
      {page === "pointage" && user && <PagePointage emp={user} sess={sess.filter(s => s.eid === user.id)} active={active} clockIn={clockIn} clockOut={clockOut} logout={() => { setUser(null); goTo("portail"); }} />}
      {page === "adminLogin" && <AdminLogin onLogin={() => { setAdminAuth(true); goTo("admin"); }} back={() => goTo("portail")} />}
      {page === "admin" && adminAuth && <PageAdmin emps={emps} sess={sess} contacts={contacts} candidatures={candidatures} addEmp={e => setEmps(p => [...p, e])} removeEmp={id => setEmps(p => p.filter(e => e.id !== id))} logout={() => { setAdminAuth(false); goTo("portail"); }} notify={notify} />}
    </div>
  );
}

// ═══════════ HOME ═══════════
function PageHome({ goTo }) {
  return (
    <div>
      {/* HERO */}
      <section style={C.hero}>
        <div style={C.heroGlow} />
        <div style={C.heroInner}>
          <div style={{ flex: 1, minWidth: 300, maxWidth: 580, animation: "fadeUp .6s ease" }}>
            <div style={C.badge}>✦ Rivière-Salée · Martinique (97215)</div>
            <h1 style={C.heroH1}>J&apos;MTD, spécialiste des<br /><span style={C.accent}>services à la personne</span><br />en Martinique</h1>
            <p style={C.heroP}>L&apos;équipe de <strong style={{ color: "#F0FDFA" }}>{FONDATRICE}</strong>, fondatrice de J&apos;MTD, se déplace au domicile de ses clients pour les accompagner et soulager leur quotidien — avec sérieux et toujours avec le sourire.</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
              <button style={C.btnCyan} onClick={() => goTo("contact")}>Devis gratuit</button>
              <button style={C.btnOutline} onClick={() => goTo("services")}>Nos prestations →</button>
            </div>
            <div style={C.heroMeta}>
              <a href={PHONE_HREF} style={C.heroPhone}>📞 {PHONE}</a>
              <span style={{ color: "#334155" }}>·</span>
              <span style={{ fontSize: 12, color: "#64748B" }}>{HORAIRES}</span>
            </div>
          </div>

          {/* SERVICES GRID CARD */}
          <div style={{ flex: 1, minWidth: 280, maxWidth: 420, animation: "fadeUp .8s ease" }}>
            <div style={C.heroCard}>
              <div style={C.heroCardHeader}>
                <span style={{ fontWeight: 700, fontSize: 13, color: "#F0FDFA" }}>Nos prestations</span>
                <span style={{ fontSize: 11, color: "#06B6D4", background: "rgba(6,182,212,.1)", padding: "2px 10px", borderRadius: 10 }}>50% crédit d&apos;impôt</span>
              </div>
              {SERVICES.map(s => (
                <button key={s.id} style={C.heroServiceRow} onClick={() => goTo(s.id === "rangement" ? "coach" : "services", { service: s.id })}>
                  <span style={{ fontSize: 20, minWidth: 28 }}>{s.icon}</span>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#F0FDFA" }}>{s.title}</div>
                    <div style={{ fontSize: 11, color: "#64748B" }}>{s.short}</div>
                  </div>
                  <span style={{ color: "#334155", fontSize: 14 }}>›</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AVANTAGES */}
      <section style={{ ...C.section, background: "#0A0F1E" }}>
        <div style={C.inner}>
          <Eyebrow>Pourquoi nous choisir</Eyebrow>
          <h2 style={C.h2}>Comptez sur J&apos;MTD pour vos tâches<br />du quotidien en Martinique</h2>
          <div style={C.grid3}>
            {[
              { icon: "⭐", t: "Prestations de qualité", d: "Satisfaction de nos clients gage de la qualité de nos services. Nous veillons à vous apporter le meilleur de nous-mêmes à chaque instant." },
              { icon: "🤝", t: "Travail sérieux & suivi permanent", d: "J'MTD est un prestataire sérieux qui veille à ses clients et à ses équipes. Au plus proche de vous, nous sommes à votre écoute." },
              { icon: "✂️", t: "Services sur mesure", d: "Chaque client est différent. Nous nous adaptons à vos exigences et à vos contraintes, quelle que soit la prestation demandée." },
              { icon: "💰", t: "50% de crédit d'impôt", d: "Les services d'aide à la personne proposés par J'MTD vous font bénéficier d'une réduction ou crédit d'impôt de 50% des sommes versées." },
              { icon: "📍", t: "Toute la Martinique", d: "De Rivière-Salée au Diamant, de Saint-Esprit au Lamentin — J'MTD intervient partout en Martinique selon vos besoins." },
              { icon: "⏱", t: "Ponctualité & transparence", d: "Nos intervenantes sont équipées d'un système de pointage GPS. Vos horaires sont respectés, systématiquement." },
            ].map(a => (
              <div key={a.t} style={C.card}>
                <span style={{ fontSize: 28, marginBottom: 12, display: "block" }}>{a.icon}</span>
                <h3 style={C.cardTitle}>{a.t}</h3>
                <p style={C.cardDesc}>{a.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ZONES */}
      <section style={{ ...C.section, background: "#0F172A" }}>
        <div style={{ ...C.inner, maxWidth: 700, textAlign: "center" }}>
          <Eyebrow>Zone d&apos;intervention</Eyebrow>
          <h2 style={C.h2}>Nous intervenons partout<br />en Martinique</h2>
          <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.8, marginBottom: 24 }}>J&apos;MTD, basée à Rivière-Salée (97215), intervient sur l&apos;ensemble du territoire martiniquais : Rivière-Salée, Lamentin, Fort-de-France, Diamant, Saint-Esprit, Robert, François, Le Marin, Sainte-Anne et bien plus encore.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {["Rivière-Salée", "Lamentin", "Fort-de-France", "Schoelcher", "Le Diamant", "Saint-Esprit", "Le Robert", "Le François", "Le Marin", "Sainte-Anne", "Le Vauclin", "La Trinité", "Le Lorrain", "Sainte-Marie"].map(z => (
              <span key={z} style={{ fontSize: 12, padding: "4px 14px", borderRadius: 20, background: "rgba(6,182,212,.06)", border: "1px solid rgba(6,182,212,.15)", color: "#94A3B8" }}>{z}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={C.ctaSec}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ ...C.h2, marginBottom: 12 }}>Prêt(e) à alléger votre quotidien ?</h2>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 28, lineHeight: 1.7 }}>Contactez-nous pour un devis gratuit et personnalisé. Réponse garantie dans les plus brefs délais.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button style={C.btnCyan} onClick={() => goTo("contact")}>Obtenir un devis gratuit</button>
            <a href={PHONE_HREF} style={{ ...C.btnOutline, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>📞 {PHONE}</a>
          </div>
        </div>
      </section>

      <Footer goTo={goTo} />
    </div>
  );
}

// ═══════════ PAGE SERVICES ═══════════
function PageServices({ goTo, activeService }) {
  const [sel, setSel] = useState(activeService || SERVICES[0].id);
  const svc = SERVICES.find(s => s.id === sel) || SERVICES[0];
  return (
    <div style={{ paddingTop: 64 }}>
      <section style={{ ...C.section, background: "#0A0F1E", paddingTop: 60 }}>
        <div style={C.inner}>
          <Eyebrow>Ce que nous proposons</Eyebrow>
          <h1 style={C.h2}>Nos prestations à domicile</h1>
          <p style={{ fontSize: 14, color: "#64748B", maxWidth: 520, marginBottom: 32, lineHeight: 1.7 }}>Intervenantes sérieuses, ponctuelles et bienveillantes — disponibles sur toute la Martinique.</p>
          {/* TABS */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
            {SERVICES.map(s => (
              <button key={s.id} style={sel === s.id ? C.tabOn : C.tabOff} onClick={() => setSel(s.id)}>
                <span style={{ marginRight: 6 }}>{s.icon}</span>{s.title.split(" ")[0]} {s.title.split(" ")[1] || ""}
              </button>
            ))}
          </div>
          {/* DETAIL */}
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap", animation: "fadeIn .4s ease" }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{svc.icon}</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#F0FDFA", fontFamily: "Syne", marginBottom: 10 }}>{svc.title}</h2>
              <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.8, marginBottom: 16 }}>{svc.desc}</p>
              {svc.special && <div style={{ ...C.infoBox, marginBottom: 16 }}><p style={{ fontSize: 13, color: "#06B6D4", fontWeight: 600 }}>💡 Prestation spéciale coaching en rangement</p><p style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>Inspirée de la méthode Marie Kondo, notre spécialiste analyse vos espaces et vous accompagne vers un intérieur ordonné et apaisé.</p></div>}
              <button style={C.btnCyan} onClick={() => goTo("contact")}>Demander un devis gratuit</button>
            </div>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={C.detailCard}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#06B6D4", marginBottom: 12, textTransform: "uppercase", letterSpacing: .5 }}>Ce qui est inclus</h3>
                {svc.details.map((d, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                    <span style={{ color: "#059669", flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 13, color: "#CBD5E1" }}>{d}</span>
                  </div>
                ))}
                <div style={{ marginTop: 14, padding: "12px 14px", background: "rgba(6,182,212,.06)", borderRadius: 10, border: "1px solid rgba(6,182,212,.12)" }}>
                  <div style={{ fontSize: 11, color: "#64748B" }}>Tarif</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#06B6D4" }}>{svc.price}</div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>Crédit d&apos;impôt 50% applicable</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CREDIT IMPOT */}
      <section style={{ ...C.section, background: "#0F172A" }}>
        <div style={{ ...C.inner, maxWidth: 640 }}>
          <Eyebrow>Avantage fiscal</Eyebrow>
          <h2 style={C.h2}>50% de crédit d&apos;impôt</h2>
          <div style={C.infoBox}>
            <p style={{ fontSize: 14, color: "#CBD5E1", lineHeight: 1.8 }}>Les services d&apos;aide à la personne proposés par J&apos;MTD vous font bénéficier d&apos;une <strong style={{ color: "#06B6D4" }}>réduction ou crédit d&apos;impôt de 50%</strong> sur les sommes versées (plafonné à 12 000€/an). Une attestation fiscale annuelle vous est remise pour votre déclaration de revenus. Le CESU est accepté.</p>
          </div>
        </div>
      </section>
      <Footer goTo={goTo} />
    </div>
  );
}

// ═══════════ PAGE COACH RANGEMENT ═══════════
function PageCoach({ goTo }) {
  return (
    <div style={{ paddingTop: 64 }}>
      <section style={{ ...C.section, background: "#0A0F1E", paddingTop: 60 }}>
        <div style={C.inner}>
          <Eyebrow>Prestation spéciale</Eyebrow>
          <h1 style={C.h2}>Coach en rangement<br /><span style={C.accent}>en Martinique !</span></h1>
          <p style={{ fontSize: 15, color: "#94A3B8", maxWidth: 600, lineHeight: 1.8, marginBottom: 32 }}>Ça déborde, et vous vous sentez submergé(e) ? Le manque d&apos;ordre dans votre maison impacte votre bien-être. Faites appel à un coach en rangement !</p>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 40 }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#F0FDFA", fontFamily: "Syne", marginBottom: 12 }}>Un spécialiste du rangement intervient chez vous</h2>
              <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.8, marginBottom: 14 }}>Fan absolue de Marie Kondo, un peu maniaque, mais surtout méticuleuse, notre spécialiste du rangement étudie vos besoins, vos habitudes de vie et vos attentes.</p>
              <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.8, marginBottom: 20 }}>Un diagnostic initial nous permettra de vous présenter le travail à réaliser et la manière de procéder pour ranger votre intérieur. Notre coach intervient dans toutes les pièces de votre domicile et dans les moindres recoins : pièces à vivre, armoires, placards, bureaux…</p>
              <button style={C.btnCyan} onClick={() => goTo("contact")}>Demander un devis</button>
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#06B6D4", marginBottom: 16, textTransform: "uppercase", letterSpacing: .5 }}>Nos 3 formules</h3>
              {[
                { icon: "💡", t: "Recommandations & conseils", d: "1 heure — Diagnostic de votre intérieur, conseils pratiques personnalisés pour mieux ranger.", tag: "Formule découverte" },
                { icon: "🤝", t: "Conseils & accompagnement", d: "Plusieurs séances — Notre coach vous guide et vous montre comment trier, archiver, désencombrer.", tag: "Formule accompagnement" },
                { icon: "✅", t: "Prestation intégrale", d: "Rangement complet réalisé par votre coach, de A à Z, dans toutes les pièces souhaitées.", tag: "Formule clé en main" },
              ].map(f => (
                <div key={f.t} style={{ ...C.card, marginBottom: 10, padding: 16, textAlign: "left", display: "flex", gap: 12 }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, color: "#06B6D4", fontWeight: 600, marginBottom: 3 }}>{f.tag}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#F0FDFA", marginBottom: 4 }}>{f.t}</div>
                    <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section style={C.ctaSec}>
        <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ ...C.h2, marginBottom: 10 }}>Prêt(e) à mettre de l&apos;ordre ?</h2>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 24 }}>J&apos;MTD assure un travail sérieux en toute discrétion. Contactez-nous pour un diagnostic gratuit.</p>
          <button style={C.btnCyan} onClick={() => goTo("contact")}>Demander un devis</button>
        </div>
      </section>
      <Footer goTo={goTo} />
    </div>
  );
}

// ═══════════ PAGE CONTACT ═══════════
function PageContact({ goTo, onSubmit }) {
  const [form, setForm] = useState({ prenom: "", nom: "", tel: "", email: "", message: "", service: SERVICES[0].title, zone: ZONES[0], rgpd: false });
  const [sent, setSent] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = () => {
    if (!form.prenom || !form.nom || !form.tel || !form.message) return alert("Merci de remplir tous les champs obligatoires (*)");
    if (!form.rgpd) return alert("Merci d'accepter d'être contacté(e) par J'MTD");
    onSubmit(form); setSent(true);
  };
  return (
    <div style={{ paddingTop: 64 }}>
      <section style={{ ...C.section, background: "#0A0F1E", paddingTop: 60 }}>
        <div style={{ ...C.inner, maxWidth: 760 }}>
          <Eyebrow>Nous contacter</Eyebrow>
          <h1 style={C.h2}>Contact & Devis gratuit</h1>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 32 }}>Contactez-nous si vous avez une question, ou pour une demande de devis. Décrivez-nous votre besoin et nous reviendrons vers vous dans les plus brefs délais.</p>

          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 32 }}>
            {[
              { icon: "📍", t: "Adresse", v: ADDRESS },
              { icon: "⏰", t: "Horaires", v: HORAIRES },
              { icon: "📞", t: "Téléphone", v: PHONE, href: PHONE_HREF },
            ].map(c => (
              <div key={c.t} style={{ flex: 1, minWidth: 160, ...C.card, padding: 16, textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{c.icon}</div>
                <div style={{ fontSize: 11, color: "#64748B", marginBottom: 4 }}>{c.t}</div>
                {c.href ? <a href={c.href} style={{ fontSize: 13, fontWeight: 600, color: "#06B6D4", textDecoration: "none" }}>{c.v}</a> : <div style={{ fontSize: 12, fontWeight: 600, color: "#F0FDFA", lineHeight: 1.5 }}>{c.v}</div>}
              </div>
            ))}
          </div>

          {!sent ? (
            <div style={C.formCard}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#F0FDFA", marginBottom: 20 }}>Formulaire de contact / devis</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <F label="Prénom *" val={form.prenom} set={v => set("prenom", v)} />
                <F label="Nom *" val={form.nom} set={v => set("nom", v)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <F label="Téléphone *" val={form.tel} set={v => set("tel", v)} type="tel" />
                <F label="Email" val={form.email} set={v => set("email", v)} type="email" />
              </div>
              <SF label="Prestation souhaitée" val={form.service} set={v => set("service", v)} opts={SERVICES.map(s => s.title)} />
              <SF label="Zone d'intervention" val={form.zone} set={v => set("zone", v)} opts={ZONES} />
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4 }}>Message *</label>
                <textarea style={{ ...C.input, minHeight: 100, resize: "vertical" }} value={form.message} onChange={e => set("message", e.target.value)} placeholder="Décrivez votre besoin, la fréquence souhaitée, vos contraintes particulières..." />
              </div>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#94A3B8", cursor: "pointer", marginBottom: 20 }}>
                <input type="checkbox" checked={form.rgpd} onChange={e => set("rgpd", e.target.checked)} style={{ accentColor: "#06B6D4", marginTop: 2, flexShrink: 0 }} />
                J&apos;accepte d&apos;être contacté(e) par J&apos;MTD pour traiter ma demande.
              </label>
              <button style={{ ...C.btnCyan, width: "100%" }} onClick={submit}>Envoyer</button>
            </div>
          ) : (
            <div style={{ ...C.infoBox, textAlign: "center", padding: 48 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#F0FDFA", marginBottom: 8 }}>Message reçu !</h3>
              <p style={{ fontSize: 14, color: "#94A3B8" }}>Nous vous recontactons dans les plus brefs délais.</p>
            </div>
          )}
        </div>
      </section>
      <Footer goTo={goTo} />
    </div>
  );
}

// ═══════════ PORTAIL ═══════════
function PagePortail({ goTo }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0A0F1E", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 380, width: "100%", textAlign: "center", animation: "fadeUp .5s ease" }}>
        <button style={{ ...C.btnOutline, marginBottom: 24, fontSize: 12 }} onClick={() => goTo("home")}>← Retour au site</button>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔐</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#F0FDFA", fontFamily: "Syne", marginBottom: 6 }}>Espace Privé</h2>
        <p style={{ fontSize: 13, color: "#64748B", marginBottom: 32 }}>Réservé aux intervenantes et à l&apos;administration J&apos;MTD.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button style={C.portalBtn} onClick={() => goTo("loginEmp")}>
            <span style={{ fontSize: 26 }}>👤</span>
            <div style={{ textAlign: "left" }}><strong style={{ display: "block", fontSize: 14 }}>Espace intervenante</strong><span style={{ fontSize: 12, color: "#64748B" }}>Pointer mes heures — GPS activé</span></div>
            <span style={{ color: "#334155" }}>›</span>
          </button>
          <button style={{ ...C.portalBtn, background: "rgba(255,255,255,.02)", borderColor: "rgba(255,255,255,.06)" }} onClick={() => goTo("adminLogin")}>
            <span style={{ fontSize: 26 }}>📊</span>
            <div style={{ textAlign: "left" }}><strong style={{ display: "block", fontSize: 14 }}>Administration</strong><span style={{ fontSize: 12, color: "#64748B" }}>Heures, contacts, candidatures, équipe</span></div>
            <span style={{ color: "#334155" }}>›</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════ LOGIN EMP ═══════════
function LoginEmp({ emps, onLogin, back }) {
  const [sel, setSel] = useState(null); const [pin, setPin] = useState(""); const [err, setErr] = useState("");
  return (
    <div style={{ minHeight: "100vh", background: "#0A0F1E", padding: "20px 16px", maxWidth: 480, margin: "0 auto" }}>
      <button style={C.back} onClick={back}>← Retour</button>
      <h2 style={{ ...C.h2, marginBottom: 4, fontSize: 22 }}>Identification</h2>
      <p style={{ fontSize: 13, color: "#64748B", marginBottom: 20 }}>Sélectionnez votre nom puis entrez votre PIN</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {emps.map(e => (
          <button key={e.id} style={{ ...C.empCard, ...(sel === e.id ? C.empCardOn : {}) }} onClick={() => { setSel(e.id); setErr(""); setPin(""); }}>
            <div style={C.avatar}>{e.name[0]}</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: "#F0FDFA" }}>{e.name}</div><div style={{ fontSize: 11, color: "#64748B" }}>{e.role} · {e.zone}</div></div>
            {sel === e.id && <span style={{ color: "#06B6D4" }}>✓</span>}
          </button>
        ))}
      </div>
      {sel && <PinPad pin={pin} setPin={setPin} onDone={() => { const e = emps.find(x => x.id === sel); if (pin !== e?.pin) { setErr("Code incorrect"); setPin(""); } else onLogin(e); }} err={err} />}
    </div>
  );
}

// ═══════════ PIN PAD ═══════════
function PinPad({ pin, setPin, onDone, err }) {
  const press = n => { if (n === "⌫") return setPin(p => p.slice(0, -1)); if (pin.length < 4) setPin(p => p + n); };
  useEffect(() => { if (pin.length === 4) onDone(); }, [pin]);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 20 }}>
        {[0, 1, 2, 3].map(i => <div key={i} style={{ width: 14, height: 14, borderRadius: 7, border: "2px solid", borderColor: pin.length > i ? "#06B6D4" : "#334155", background: pin.length > i ? "#06B6D4" : "transparent", transition: "all .15s" }} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, maxWidth: 220, margin: "0 auto 12px" }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "⌫"].map((n, i) => n === null ? <div key={i} /> : <button key={i} style={C.numBtn} onClick={() => press(n)}>{n}</button>)}
      </div>
      {err && <p style={{ color: "#F87171", fontSize: 12, textAlign: "center", marginTop: 8 }}>{err}</p>}
    </div>
  );
}

// ═══════════ PAGE POINTAGE ═══════════
function PagePointage({ emp, sess, active, clockIn, clockOut, logout }) {
  const [client, setClient] = useState(""); const [note, setNote] = useState(""); const [showHist, setShowHist] = useState(false);
  const [elapsed, setElapsed] = useState("00:00:00");
  const geo = useGeo();
  useEffect(() => {
    if (!active) return;
    const tick = () => { const d = Date.now() - new Date(active.in).getTime(); setElapsed(`${pad(Math.floor(d / 36e5))}:${pad(Math.floor((d % 36e5) / 6e4))}:${pad(Math.floor((d % 6e4) / 1e3))}`); };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, [active]);
  const todayH = sess.filter(s => s.in?.startsWith(today())).reduce((a, s) => a + hrs(s.in, s.out || new Date().toISOString()), 0);
  const wkH = sess.filter(s => weekNum(s.in) === weekNum(new Date())).reduce((a, s) => a + hrs(s.in, s.out || new Date().toISOString()), 0);
  return (
    <div style={{ background: "#0A0F1E", minHeight: "100vh", padding: "20px 16px", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div><h2 style={{ fontSize: 20, fontWeight: 800, color: "#F0FDFA", fontFamily: "Syne" }}>{emp.name}</h2><p style={{ fontSize: 12, color: "#64748B" }}>{emp.role} · {emp.zone}</p></div>
        <button style={C.logoutBtn} onClick={logout}>Quitter</button>
      </div>
      <div style={active ? C.cardActive : C.pCard}>
        {active ? (
          <>
            <div style={C.badgeOn}><span style={{ animation: "pulse 1.5s infinite" }}>●</span> En service</div>
            <div style={{ fontSize: 44, fontWeight: 800, color: "#34D399", margin: "4px 0 6px", fontFamily: "'JetBrains Mono',monospace", letterSpacing: 2 }}>{elapsed}</div>
            <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 4 }}>Chez <strong style={{ color: "#F0FDFA" }}>{active.client || "—"}</strong> depuis {fmtTime(active.in)}</p>
            {active.geoIn && <div style={C.gpsTag}>📍 GPS arrivée (±{active.geoIn.acc}m)</div>}
            <div style={{ marginTop: 12 }}>
              <input style={C.input} placeholder="Note de fin (optionnel)" value={note} onChange={e => setNote(e.target.value)} />
              {!geo.loc && !geo.loading && <button style={C.btnGPS} onClick={geo.request}>📡 Activer GPS pour le départ</button>}
              {geo.loading && <div style={{ padding: "10px 0", fontSize: 12, color: "#06B6D4", textAlign: "center" }}>📡 Acquisition GPS...</div>}
              {geo.err && <p style={{ fontSize: 11, color: "#FBBF24", textAlign: "center", marginBottom: 8 }}>⚠ {geo.err}</p>}
              {geo.loc && <div style={C.gpsOk}>✓ GPS acquis (±{geo.loc.acc}m)</div>}
              <button style={C.btnDanger} onClick={() => { clockOut(note, geo.loc); setNote(""); geo.reset(); }}>⏹ Fin de service</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "inline-block", padding: "4px 14px", borderRadius: 20, background: "rgba(100,116,139,.1)", color: "#64748B", fontSize: 12, fontWeight: 600, marginBottom: 8 }}>○ Disponible</div>
            <p style={{ fontSize: 14, color: "#94A3B8", margin: "8px 0 14px" }}>Prête à démarrer une intervention ?</p>
            <input style={C.input} placeholder="Nom du client / lieu" value={client} onChange={e => setClient(e.target.value)} />
            {!geo.loc && !geo.loading && <button style={C.btnGPS} onClick={geo.request}>📡 Activer le GPS</button>}
            {geo.loading && <div style={{ padding: "10px 0", fontSize: 12, color: "#06B6D4", textAlign: "center" }}>📡 Acquisition GPS...</div>}
            {geo.err && <p style={{ fontSize: 11, color: "#FBBF24", textAlign: "center", marginBottom: 8 }}>⚠ {geo.err} — pointage possible sans GPS</p>}
            {geo.loc && <div style={C.gpsOk}>✓ Position acquise (±{geo.loc.acc}m)</div>}
            <button style={C.btnSuccess} onClick={() => { clockIn(client, geo.loc); setClient(""); geo.reset(); }}>▶ Début de service</button>
          </>
        )}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[{ v: todayH.toFixed(1) + "h", l: "Aujourd'hui", c: "#06B6D4" }, { v: wkH.toFixed(1) + "h", l: "Semaine", c: "#059669" }, { v: String(sess.filter(s => weekNum(s.in) === weekNum(new Date())).length), l: "Interventions", c: "#D97706" }].map((s, i) => (
          <div key={i} style={{ flex: 1, background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.04)", borderRadius: 12, padding: "10px 8px", textAlign: "center", borderLeft: `3px solid ${s.c}` }}><div style={{ fontSize: 18, fontWeight: 800, color: "#F0FDFA" }}>{s.v}</div><div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>{s.l}</div></div>
        ))}
      </div>
      <button style={{ width: "100%", background: "none", border: "none", color: "#06B6D4", fontSize: 12, fontWeight: 600, cursor: "pointer", padding: "8px 0" }} onClick={() => setShowHist(!showHist)}>{showHist ? "▲ Masquer" : "▼ Mon historique"}</button>
      {showHist && sess.filter(s => s.out).sort((a, b) => new Date(b.in) - new Date(a.in)).slice(0, 10).map(s => (
        <div key={s.id} style={{ background: "rgba(255,255,255,.02)", borderRadius: 12, padding: "10px 14px", marginBottom: 6, borderLeft: "3px solid #06B6D4" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div><div style={{ fontSize: 11, color: "#06B6D4", fontWeight: 600, textTransform: "capitalize" }}>{fmtDate(s.in)}</div><div style={{ fontSize: 13, color: "#CBD5E1" }}>{fmtTime(s.in)} → {fmtTime(s.out)}</div></div>
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
    <div style={{ minHeight: "100vh", background: "#0A0F1E", padding: "20px 16px", maxWidth: 480, margin: "0 auto" }}>
      <button style={C.back} onClick={back}>← Retour</button>
      <h2 style={{ ...C.h2, fontSize: 22, marginBottom: 4 }}>Administration</h2>
      <p style={{ fontSize: 13, color: "#64748B", marginBottom: 24 }}>Code administrateur requis</p>
      <PinPad pin={pin} setPin={setPin} onDone={() => { if (pin === "0000") onLogin(); else { setErr("Code incorrect"); setPin(""); } }} err={err} />
    </div>
  );
}

// ═══════════ PAGE ADMIN ═══════════
function PageAdmin({ emps, sess, contacts, candidatures, addEmp, removeEmp, logout, notify }) {
  const [tab, setTab] = useState("heures");
  const [wk, setWk] = useState(weekNum(new Date()));
  const [flt, setFlt] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", zone: ZONES[0], pin: "" });
  const [confirmDel, setConfirmDel] = useState(null);

  const wkSess = sess.filter(s => s.out && weekNum(s.in) === wk);
  const stats = emps.map(e => { const es = wkSess.filter(s => s.eid === e.id); return { ...e, h: es.reduce((a, s) => a + hrs(s.in, s.out), 0), n: es.length, isOn: sess.some(s => s.eid === e.id && !s.out) }; });
  const filtered = flt === "all" ? wkSess : wkSess.filter(s => s.eid === flt);
  const doAdd = () => {
    if (!form.name || !form.role || form.pin.length !== 4) return notify("Remplissez tous les champs (PIN 4 chiffres)", "err");
    addEmp({ id: `e${Date.now()}`, ...form }); setForm({ name: "", role: "", zone: ZONES[0], pin: "" }); setShowAdd(false); notify(`${form.name} ajoutée`);
  };

  return (
    <div style={{ background: "#0A0F1E", minHeight: "100vh", padding: "20px 16px", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div><h2 style={{ fontSize: 22, fontWeight: 800, color: "#F0FDFA", fontFamily: "Syne" }}>Dashboard Admin</h2><p style={{ fontSize: 12, color: "#64748B" }}>J&apos;MTD · {FONDATRICE}</p></div>
        <button style={C.logoutBtn} onClick={logout}>Quitter</button>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 16, overflowX: "auto" }}>
        {[["heures", "⏱ Heures"], ["contacts", `📬 Contacts (${contacts.length})`], ["cands", `👥 Candidatures (${candidatures.length})`], ["equipe", "🧑 Équipe"]].map(([id, l]) => (
          <button key={id} style={tab === id ? C.tabOn : C.tabOff} onClick={() => setTab(id)}>{l}</button>
        ))}
      </div>

      {tab === "heures" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 14 }}>
            <button style={C.wkBtn} onClick={() => setWk(w => w - 1)}>‹</button>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#F0FDFA", minWidth: 100, textAlign: "center" }}>Semaine {wk}</span>
            <button style={C.wkBtn} onClick={() => setWk(w => w + 1)}>›</button>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[{ v: stats.reduce((a, e) => a + e.h, 0).toFixed(1) + "h", l: "Total heures", c: "#06B6D4" }, { v: stats.reduce((a, e) => a + e.n, 0), l: "Interventions", c: "#059669" }, { v: `${stats.filter(e => e.isOn).length}/${emps.length}`, l: "En service", c: "#D97706" }].map((s, i) => (
              <div key={i} style={{ flex: 1, background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.04)", borderRadius: 12, padding: "10px 8px", textAlign: "center", borderLeft: `3px solid ${s.c}` }}><div style={{ fontSize: 18, fontWeight: 800, color: "#F0FDFA" }}>{s.v}</div><div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>{s.l}</div></div>
            ))}
          </div>
          {stats.map(e => (
            <div key={e.id} style={{ background: "rgba(255,255,255,.02)", borderRadius: 14, padding: "12px 14px", marginBottom: 8, border: "1px solid rgba(255,255,255,.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: e.isOn ? "#059669" : "#475569", flexShrink: 0 }} />
                <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 700, color: "#F0FDFA" }}>{e.name}</div><div style={{ fontSize: 11, color: "#64748B" }}>{e.role} · {e.zone}</div></div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#F0FDFA" }}>{e.h.toFixed(1)}<span style={{ fontSize: 12, color: "#64748B" }}>h</span></div>
              </div>
              <div style={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,.06)", overflow: "hidden", marginBottom: 4 }}>
                <div style={{ height: "100%", borderRadius: 3, width: `${Math.min((e.h / 35) * 100, 100)}%`, background: e.h > 35 ? "#DC2626" : e.h > 28 ? "#059669" : "#06B6D4", transition: "width .5s" }} />
              </div>
              <div style={{ fontSize: 11, color: "#64748B" }}>{e.n} interv. · {e.h > 35 ? "⚠ Dépassement 35h" : `${(35 - e.h).toFixed(1)}h restantes`}</div>
            </div>
          ))}
          <select style={{ ...C.input, marginTop: 12 }} value={flt} onChange={e => setFlt(e.target.value)}>
            <option value="all">Toutes les intervenantes</option>
            {emps.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <div style={{ display: "flex", padding: "8px 10px", background: "rgba(6,182,212,.08)", borderRadius: "10px 10px 0 0", fontSize: 10, fontWeight: 700, color: "#06B6D4", gap: 4, marginTop: 4 }}>
            <span style={{ width: 70 }}>Date</span><span style={{ flex: 1 }}>Interv.</span><span style={{ width: 50, textAlign: "center" }}>Début</span><span style={{ width: 50, textAlign: "center" }}>Fin</span><span style={{ width: 45, textAlign: "right" }}>Heures</span><span style={{ width: 24, textAlign: "center" }}>GPS</span>
          </div>
          {filtered.sort((a, b) => new Date(b.in) - new Date(a.in)).map(s => (
            <div key={s.id} style={{ display: "flex", padding: "8px 10px", borderBottom: "1px solid rgba(255,255,255,.03)", alignItems: "center", color: "#CBD5E1", gap: 4 }}>
              <span style={{ width: 70, fontSize: 11, textTransform: "capitalize" }}>{fmtDate(s.in)}</span><span style={{ flex: 1, fontSize: 11 }}>{s.name}</span><span style={{ width: 50, textAlign: "center", fontSize: 11 }}>{fmtTime(s.in)}</span><span style={{ width: 50, textAlign: "center", fontSize: 11 }}>{fmtTime(s.out)}</span><span style={{ width: 45, textAlign: "right", fontSize: 12, fontWeight: 700 }}>{hrs(s.in, s.out).toFixed(1)}</span><span style={{ width: 24, textAlign: "center", fontSize: 11 }}>{s.geoIn ? "✅" : "—"}</span>
            </div>
          ))}
          {filtered.length === 0 && <p style={{ textAlign: "center", color: "#334155", fontSize: 12, padding: 20 }}>Aucune session cette semaine</p>}
          <div style={{ textAlign: "right", padding: "10px 12px", background: "rgba(255,255,255,.02)", borderRadius: "0 0 10px 10px", fontSize: 12, color: "#06B6D4" }}>Total : <strong>{filtered.reduce((a, s) => a + hrs(s.in, s.out), 0).toFixed(1)}h</strong> · {filtered.length} interventions</div>
        </div>
      )}

      {tab === "contacts" && (
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#06B6D4", marginBottom: 12 }}>Demandes de contact / devis ({contacts.length})</p>
          {contacts.length === 0 ? <p style={{ textAlign: "center", color: "#334155", padding: 24, fontSize: 12 }}>Aucune demande</p> : contacts.sort((a, b) => new Date(b.date) - new Date(a.date)).map(c => (
            <div key={c.id} style={{ background: "rgba(255,255,255,.02)", borderRadius: 14, padding: "12px 14px", marginBottom: 8, border: "1px solid rgba(255,255,255,.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <strong style={{ fontSize: 14, color: "#F0FDFA" }}>{c.prenom} {c.nom}</strong>
                <span style={{ fontSize: 11, color: "#64748B", textTransform: "capitalize" }}>{fmtDate(c.date)}</span>
              </div>
              <div style={{ fontSize: 12, color: "#94A3B8", display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 4 }}>
                <span>📞 {c.tel}</span>{c.email && <span>✉️ {c.email}</span>}<span>🛠 {c.service}</span><span>📍 {c.zone}</span>
              </div>
              {c.message && <p style={{ fontSize: 12, color: "#64748B", fontStyle: "italic" }}>&quot;{c.message}&quot;</p>}
            </div>
          ))}
        </div>
      )}

      {tab === "cands" && (
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#06B6D4", marginBottom: 12 }}>Candidatures ({candidatures.length})</p>
          {candidatures.length === 0 ? <p style={{ textAlign: "center", color: "#334155", padding: 24, fontSize: 12 }}>Aucune candidature</p> : candidatures.sort((a, b) => new Date(b.date) - new Date(a.date)).map(c => (
            <div key={c.id} style={{ background: "rgba(255,255,255,.02)", borderRadius: 14, padding: "12px 14px", marginBottom: 8, border: "1px solid rgba(255,255,255,.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <strong style={{ fontSize: 14, color: "#F0FDFA" }}>{c.prenom} {c.nom}</strong>
                <span style={{ fontSize: 11, color: "#64748B", textTransform: "capitalize" }}>{fmtDate(c.date)}</span>
              </div>
              <div style={{ fontSize: 12, color: "#94A3B8", display: "flex", flexWrap: "wrap", gap: 10 }}>
                <span>📞 {c.tel}</span>{c.email && <span>✉️ {c.email}</span>}<span>📍 {c.zone}</span><span>💼 {c.role}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "equipe" && (
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#06B6D4", marginBottom: 12 }}>Équipe ({emps.length} intervenantes)</p>
          {emps.map(e => (
            <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 12, marginBottom: 8 }}>
              <div style={C.avatar}>{e.name[0]}</div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 700, color: "#F0FDFA" }}>{e.name}</div><div style={{ fontSize: 11, color: "#64748B" }}>{e.role} · {e.zone}</div></div>
              {confirmDel === e.id ? (
                <div style={{ display: "flex", gap: 4 }}>
                  <button style={{ padding: "4px 8px", background: "#DC2626", border: "none", borderRadius: 6, color: "#fff", fontSize: 11, cursor: "pointer" }} onClick={() => { removeEmp(e.id); setConfirmDel(null); notify(`${e.name} retirée`); }}>Oui</button>
                  <button style={{ padding: "4px 8px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 6, color: "#94A3B8", fontSize: 11, cursor: "pointer" }} onClick={() => setConfirmDel(null)}>Non</button>
                </div>
              ) : <button style={{ background: "none", border: "none", color: "#475569", fontSize: 16, cursor: "pointer" }} onClick={() => setConfirmDel(e.id)}>✕</button>}
            </div>
          ))}
          {!showAdd ? (
            <button style={C.btnCyan} onClick={() => setShowAdd(true)}>+ Ajouter une intervenante</button>
          ) : (
            <div style={{ background: "rgba(255,255,255,.02)", borderRadius: 14, padding: 16, border: "1px solid rgba(255,255,255,.06)", marginTop: 12 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#F0FDFA", marginBottom: 10 }}>Nouvelle intervenante</h4>
              <F label="Nom complet" val={form.name} set={v => setForm(f => ({ ...f, name: v }))} />
              <F label="Rôle" val={form.role} set={v => setForm(f => ({ ...f, role: v }))} placeholder="Ex: Aide ménagère" />
              <SF label="Zone" val={form.zone} set={v => setForm(f => ({ ...f, zone: v }))} opts={ZONES} />
              <F label="Code PIN (4 chiffres)" val={form.pin} set={v => setForm(f => ({ ...f, pin: v.replace(/\D/g, "").slice(0, 4) }))} />
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <button style={C.btnSuccess} onClick={doAdd}>Ajouter</button>
                <button style={{ flex: 1, padding: "12px 0", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, color: "#94A3B8", cursor: "pointer", fontSize: 13 }} onClick={() => setShowAdd(false)}>Annuler</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════ SHARED ═══════════
function Eyebrow({ children }) { return <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "#06B6D4", textTransform: "uppercase", marginBottom: 10 }}>{children}</p>; }
function Footer({ goTo }) {
  return (
    <footer style={{ background: "#060A14", borderTop: "1px solid rgba(255,255,255,.05)", padding: "40px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#F0FDFA", fontFamily: "Syne", marginBottom: 4 }}>J&apos;MTD</div>
          <div style={{ fontSize: 12, color: "#64748B", marginBottom: 2 }}>Services à la Personne · Martinique (97215)</div>
          <div style={{ fontSize: 11, color: "#475569", marginBottom: 2 }}>Fondatrice : {FONDATRICE}</div>
          <div style={{ fontSize: 11, color: "#475569", marginBottom: 2 }}>SIRET 802 877 779</div>
          <div style={{ fontSize: 11, color: "#475569" }}>{ADDRESS}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#F0FDFA", marginBottom: 10 }}>Navigation</div>
          {[["home", "Accueil"], ["services", "Nos prestations"], ["coach", "Coach rangement"], ["contact", "Contact"]].map(([p, l]) => (
            <button key={p} style={{ display: "block", background: "none", border: "none", color: "#64748B", fontSize: 12, cursor: "pointer", padding: "3px 0", textAlign: "left" }} onClick={() => goTo(p)}>{l}</button>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#F0FDFA", marginBottom: 10 }}>Contact</div>
          <a href={PHONE_HREF} style={{ display: "block", color: "#06B6D4", fontSize: 13, fontWeight: 600, textDecoration: "none", marginBottom: 4 }}>📞 {PHONE}</a>
          <div style={{ fontSize: 12, color: "#64748B", marginBottom: 4 }}>{HORAIRES}</div>
          <div style={{ fontSize: 12, color: "#475569" }}>✉️ {EMAIL}</div>
        </div>
      </div>
      <div style={{ maxWidth: 1000, margin: "16px auto 0", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,.04)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 11, color: "#334155" }}>© 2025 J&apos;MTD · Tous droits réservés</span>
        <button style={{ background: "none", border: "none", color: "#475569", fontSize: 11, cursor: "pointer" }} onClick={() => goTo("portail")}>🔐 Espace privé</button>
      </div>
    </footer>
  );
}
function F({ label, val, set, type = "text", placeholder = "" }) { return <div style={{ marginBottom: 10 }}><label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4 }}>{label}</label><input style={C.input} type={type} value={val} onChange={e => set(e.target.value)} placeholder={placeholder} /></div>; }
function SF({ label, val, set, opts }) { return <div style={{ marginBottom: 10 }}><label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4 }}>{label}</label><select style={C.input} value={val} onChange={e => set(e.target.value)}>{opts.map(o => <option key={o}>{o}</option>)}</select></div>; }

// ═══════════ STYLES ═══════════
const C = {
  root: { fontFamily: "'DM Sans',sans-serif", background: "#0A0F1E", minHeight: "100vh", color: "#F0FDFA" },
  nav: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,15,30,.94)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", height: 62, gap: 12 },
  navLogo: { background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "flex-start", padding: 0, flexShrink: 0 },
  logoText: { fontSize: 18, fontWeight: 800, color: "#F0FDFA", fontFamily: "Syne", letterSpacing: -.3 },
  logoSub: { fontSize: 9, color: "#64748B", letterSpacing: .5, textTransform: "uppercase" },
  navCenter: { display: "flex", gap: 2, flex: 1, justifyContent: "center" },
  navLink: { background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 500, cursor: "pointer", padding: "6px 10px", borderRadius: 8, transition: "color .15s", whiteSpace: "nowrap" },
  navLinkOn: { color: "#F0FDFA", background: "rgba(255,255,255,.04)" },
  navRight: { display: "flex", alignItems: "center", gap: 8, flexShrink: 0 },
  navPhone: { color: "#06B6D4", fontSize: 13, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" },
  navPrivateBtn: { background: "rgba(6,182,212,.08)", border: "1px solid rgba(6,182,212,.2)", borderRadius: 8, color: "#06B6D4", padding: "5px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" },
  burger: { background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: 5, padding: 4 },
  bline: { width: 22, height: 2, background: "#94A3B8", borderRadius: 1, transition: "all .25s", display: "block" },
  mMenu: { position: "fixed", top: 62, left: 0, right: 0, background: "rgba(10,15,30,.98)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", flexDirection: "column", padding: "10px 16px", animation: "slideDown .25s ease", zIndex: 99 },
  mLink: { background: "none", border: "none", color: "#94A3B8", fontSize: 14, fontWeight: 500, cursor: "pointer", padding: "10px 0", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,.04)" },
  toast: { position: "fixed", top: 12, left: "50%", transform: "translateX(-50%)", padding: "10px 18px", borderRadius: 12, color: "#fff", fontSize: 13, fontWeight: 600, zIndex: 999, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 8px 32px rgba(0,0,0,.4)", whiteSpace: "nowrap" },

  hero: { paddingTop: 62, background: "#0A0F1E", minHeight: "90vh", position: "relative", overflow: "hidden" },
  heroGlow: { position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", height: "60%", background: "radial-gradient(ellipse 80% 50% at 50% 0%,rgba(6,182,212,.07),transparent)", pointerEvents: "none" },
  heroInner: { maxWidth: 1060, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 32, padding: "60px 24px" },
  badge: { display: "inline-flex", alignItems: "center", fontSize: 11, fontWeight: 700, color: "#06B6D4", background: "rgba(6,182,212,.08)", border: "1px solid rgba(6,182,212,.18)", padding: "4px 14px", borderRadius: 20, marginBottom: 18, letterSpacing: .5, textTransform: "uppercase" },
  heroH1: { fontSize: "clamp(28px,4.5vw,50px)", fontWeight: 800, color: "#F0FDFA", lineHeight: 1.12, marginBottom: 14, fontFamily: "Syne", letterSpacing: -.5 },
  accent: { background: "linear-gradient(135deg,#06B6D4,#38BDF8,#7DD3FC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  heroP: { fontSize: 14, color: "#64748B", lineHeight: 1.75, marginBottom: 24, maxWidth: 480 },
  heroMeta: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
  heroPhone: { color: "#06B6D4", fontSize: 14, fontWeight: 700, textDecoration: "none" },
  heroCard: { background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 20, padding: 18, backdropFilter: "blur(10px)" },
  heroCardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,.06)" },
  heroServiceRow: { display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.04)", background: "none", border: "none", cursor: "pointer", textAlign: "left", color: "#F0FDFA", transition: "all .15s" },

  section: { padding: "72px 24px" },
  inner: { maxWidth: 1060, margin: "0 auto" },
  h2: { fontSize: "clamp(22px,3.5vw,38px)", fontWeight: 800, color: "#F0FDFA", marginBottom: 32, fontFamily: "Syne", letterSpacing: -.4 },
  grid3: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14 },
  card: { background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 16, padding: 20 },
  cardTitle: { fontSize: 15, fontWeight: 700, color: "#F0FDFA", marginBottom: 6 },
  cardDesc: { fontSize: 13, color: "#64748B", lineHeight: 1.6 },
  detailCard: { background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 16, padding: 18 },
  infoBox: { background: "rgba(6,182,212,.04)", border: "1px solid rgba(6,182,212,.12)", borderRadius: 14, padding: 20 },
  ctaSec: { background: "linear-gradient(135deg,rgba(6,182,212,.05),rgba(6,182,212,.01))", borderTop: "1px solid rgba(6,182,212,.1)", padding: "72px 24px", textAlign: "center" },
  formCard: { background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 16, padding: 24 },

  btnCyan: { padding: "12px 22px", fontSize: 14, fontWeight: 700, background: "linear-gradient(135deg,#0E7490,#06B6D4)", border: "none", borderRadius: 12, color: "#fff", cursor: "pointer", boxShadow: "0 4px 20px rgba(6,182,212,.2)" },
  btnOutline: { padding: "12px 22px", fontSize: 14, fontWeight: 600, background: "transparent", border: "1px solid rgba(255,255,255,.12)", borderRadius: 12, color: "#94A3B8", cursor: "pointer" },
  btnSuccess: { flex: 1, padding: "12px 0", fontSize: 13, fontWeight: 700, background: "linear-gradient(135deg,#047857,#059669)", border: "none", borderRadius: 12, color: "#fff", cursor: "pointer" },
  btnDanger: { width: "100%", padding: "12px 0", fontSize: 14, fontWeight: 700, background: "linear-gradient(135deg,#991B1B,#DC2626)", border: "none", borderRadius: 12, color: "#fff", cursor: "pointer", marginTop: 4 },
  btnGPS: { width: "100%", padding: "10px 0", fontSize: 13, fontWeight: 600, background: "rgba(6,182,212,.08)", border: "1px solid rgba(6,182,212,.2)", borderRadius: 10, color: "#06B6D4", cursor: "pointer", marginBottom: 8 },
  portalBtn: { display: "flex", alignItems: "center", gap: 14, padding: "16px 14px", background: "rgba(6,182,212,.06)", border: "1px solid rgba(6,182,212,.15)", borderRadius: 14, cursor: "pointer", textAlign: "left", color: "#F0FDFA", width: "100%" },
  logoutBtn: { background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 8, color: "#64748B", padding: "5px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" },
  back: { background: "none", border: "none", color: "#06B6D4", fontSize: 14, cursor: "pointer", padding: "4px 0", marginBottom: 16, display: "block" },
  wkBtn: { background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 6, color: "#F0FDFA", padding: "3px 10px", cursor: "pointer", fontSize: 16, fontWeight: 600 },

  tabOn: { padding: "8px 14px", fontSize: 12, fontWeight: 700, background: "rgba(6,182,212,.12)", border: "1px solid rgba(6,182,212,.25)", borderRadius: 8, color: "#06B6D4", cursor: "pointer", whiteSpace: "nowrap" },
  tabOff: { padding: "8px 14px", fontSize: 12, fontWeight: 500, background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.04)", borderRadius: 8, color: "#64748B", cursor: "pointer", whiteSpace: "nowrap" },

  empCard: { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 12, cursor: "pointer", textAlign: "left", color: "#F0FDFA" },
  empCardOn: { background: "rgba(6,182,212,.08)", borderColor: "rgba(6,182,212,.25)" },
  avatar: { width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#0E7490,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#F0FDFA", flexShrink: 0 },
  numBtn: { padding: "12px 0", fontSize: 20, fontWeight: 600, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 10, color: "#F0FDFA", cursor: "pointer" },
  pCard: { background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 18, padding: 20, marginBottom: 16, textAlign: "center" },
  cardActive: { background: "linear-gradient(135deg,rgba(5,150,105,.07),rgba(5,150,105,.02))", border: "1px solid rgba(5,150,105,.22)", borderRadius: 18, padding: 20, marginBottom: 16, textAlign: "center" },
  badgeOn: { display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: 20, background: "rgba(5,150,105,.14)", color: "#34D399", fontSize: 12, fontWeight: 600, marginBottom: 6 },
  gpsTag: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, color: "#059669", background: "rgba(5,150,105,.08)", padding: "3px 10px", borderRadius: 8, marginTop: 4 },
  gpsOk: { fontSize: 12, color: "#34D399", textAlign: "center", marginBottom: 8, padding: "8px 10px", background: "rgba(5,150,105,.07)", borderRadius: 10, fontWeight: 600 },
  input: { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.04)", color: "#F0FDFA", fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 8 },
};

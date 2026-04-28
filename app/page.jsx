"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { PHONE, PHONE_HREF, SERVICES, TESTIMONIALS, ZONES, AMBER, PINK, NAVY, EMERALD } from "../lib/data";

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

const TICKER_ITEMS = [
  "✅ Agrément SAP officiel", "⭐ 5/5 sur Google", "🏠 +200 foyers satisfaits",
  "🎓 Méthode Marie Kondo", "💰 50% crédit d'impôt", "🇲🇶 Toute la Martinique",
  "⏰ Intervention en 24h", "📞 Devis gratuit immédiat", "🔒 Personnel vérifié",
];

function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={{ background: `linear-gradient(135deg, ${AMBER}, ${PINK})`, overflow: "hidden", padding: "12px 0" }}>
      <div className="ticker-inner">
        {doubled.map((item, i) => (
          <span key={i} style={{ whiteSpace: "nowrap", padding: "0 32px", fontSize: 13, fontWeight: 600, color: NAVY }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function Calculator() {
  const [hours, setHours] = useState(8);
  const gross = hours * 18;
  const net = Math.ceil(gross * 0.5);
  return (
    <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 20, padding: "32px 28px" }}>
      <div style={{ fontSize: 13, color: AMBER, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Simulateur crédit d&apos;impôt</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: "#F8FAFC", marginBottom: 24 }}>Combien ça vous coûte vraiment ?</div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 14, color: "#94A3B8" }}>Heures par mois</span>
          <span style={{ fontSize: 18, fontWeight: 700, color: AMBER }}>{hours}h</span>
        </div>
        <input type="range" min={1} max={40} value={hours} onChange={e => setHours(+e.target.value)}
          style={{ width: "100%", accentColor: AMBER, cursor: "pointer" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#475569", marginTop: 4 }}>
          <span>1h</span><span>40h</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>Coût brut mensuel</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#F8FAFC" }}>{gross}€</div>
        </div>
        <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 12, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: AMBER, marginBottom: 4 }}>Votre coût réel</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: AMBER }}>{net}€</div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: "#475569", textAlign: "center", marginBottom: 20 }}>
        💡 L&apos;État rembourse <strong style={{ color: "#F8FAFC" }}>50% de vos dépenses</strong> en crédit d&apos;impôt (art. 199 sexdecies CGI)
      </div>
      <Link href="/contact" style={{ display: "block", textAlign: "center", background: `linear-gradient(135deg, ${AMBER}, ${PINK})`, color: "#fff", padding: 14, borderRadius: 30, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
        Obtenir un devis gratuit →
      </Link>
    </div>
  );
}

function QuickForm() {
  const [form, setForm] = useState({ nom: "", tel: "", service: "", rgpd: false });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    if (!form.rgpd) { alert("Veuillez accepter la politique de confidentialité."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setSent(true);
  };

  if (sent) return (
    <div style={{ textAlign: "center", padding: "48px 24px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 20 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
      <h3 style={{ fontSize: 22, fontWeight: 700, color: "#F8FAFC", marginBottom: 8 }}>Demande envoyée !</h3>
      <p style={{ color: "#94A3B8" }}>Nous vous rappelons sous 24h ouvrées.</p>
    </div>
  );

  return (
    <form onSubmit={submit} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "32px 28px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <input className="form-input" placeholder="Votre nom" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} required />
        <input className="form-input" placeholder="Téléphone" type="tel" value={form.tel} onChange={e => setForm(f => ({ ...f, tel: e.target.value }))} required />
      </div>
      <select className="form-input" value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} required style={{ marginBottom: 16 }}>
        <option value="">Quelle prestation vous intéresse ?</option>
        {SERVICES.map(s => <option key={s.id} value={s.id}>{s.icon} {s.title}</option>)}
      </select>
      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 24, cursor: "pointer" }}>
        <input type="checkbox" checked={form.rgpd} onChange={e => setForm(f => ({ ...f, rgpd: e.target.checked }))} style={{ marginTop: 2, accentColor: AMBER }} required />
        <span style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6 }}>
          J&apos;accepte que mes données soient utilisées pour traiter ma demande, conformément à la{" "}
          <Link href="/politique-confidentialite" style={{ color: AMBER }}>politique de confidentialité</Link> de J&apos;MTD (RGPD).
        </span>
      </label>
      <button type="submit" disabled={loading} className="btn-amber"
        style={{ width: "100%", padding: 16, borderRadius: 30, fontSize: 16, cursor: loading ? "wait" : "pointer" }}>
        {loading ? "Envoi en cours…" : "Envoyer ma demande de devis →"}
      </button>
    </form>
  );
}

export default function HomePage() {
  useReveal();

  return (
    <>
      {/* ── Hero ── */}
      <section style={{ minHeight: "92vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", background: "linear-gradient(160deg, #0D1B2A 0%, #1a2d4a 60%, #0D1B2A 100%)" }}>
        <div style={{ position: "absolute", top: -200, right: -200, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 60px", width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 60, alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 30, padding: "6px 14px", marginBottom: 24 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: EMERALD, display: "inline-block", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: 12, color: AMBER, fontWeight: 600 }}>Agréé Services à la Personne (SAP)</span>
              </div>
              <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 800, lineHeight: 1.1, color: "#F8FAFC", marginBottom: 20 }}>
                Des services à la personne <span style={{ background: `linear-gradient(135deg, ${AMBER}, ${PINK})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>de confiance</span> en Martinique
              </h1>
              <p style={{ fontSize: 18, color: "#94A3B8", lineHeight: 1.7, marginBottom: 32, maxWidth: 500 }}>
                Ménage, repas, courses, coach rangement… L&apos;équipe J&apos;MTD prend soin de votre domicile. <strong style={{ color: "#F8FAFC" }}>50% remboursé</strong> par crédit d&apos;impôt.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
                <Link href="/contact" className="btn-amber" style={{ padding: "16px 28px", borderRadius: 30, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                  Devis gratuit en 2 min →
                </Link>
                <a href={PHONE_HREF} style={{ padding: "16px 28px", borderRadius: 30, fontSize: 16, border: "2px solid rgba(245,158,11,0.3)", color: AMBER, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(245,158,11,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                  📞 {PHONE}
                </a>
              </div>
              <div style={{ display: "flex", gap: 32 }}>
                {[["200+", "Foyers accompagnés"], ["5★", "Note Google"], ["50%", "Crédit d'impôt"]].map(([n, l]) => (
                  <div key={l}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: AMBER, fontFamily: "Syne, sans-serif" }}>{n}</div>
                    <div style={{ fontSize: 12, color: "#64748B" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {SERVICES.slice(0, 4).map(s => (
                <Link key={s.id} href={s.id === "rangement" ? "/coach" : `/services#${s.id}`}
                  className="card-hover"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "20px 16px", textDecoration: "none", display: "block" }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#F8FAFC", marginBottom: 6 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>{s.short}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Ticker ── */}
      <Ticker />

      {/* ── Pourquoi J'MTD ── */}
      <section style={{ background: "#0D1B2A", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: AMBER, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Pourquoi J&apos;MTD ?</div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#F8FAFC", marginBottom: 16 }}>
              Vous méritez du temps pour vous
            </h2>
            <p style={{ fontSize: 16, color: "#94A3B8", maxWidth: 600, margin: "0 auto" }}>
              Entre le travail, la famille et les tâches du quotidien, le temps manque. J&apos;MTD s&apos;occupe de l&apos;essentiel pour que vous puissiez profiter de la vie.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {[
              { icon: "🕐", title: "Gagnez du temps", text: "Nos intervenants s'occupent de tout : ménage, repas, courses. Vous récupérez vos week-ends." },
              { icon: "🔒", title: "Personnel de confiance", text: "Tous nos intervenants sont rigoureusement sélectionnés, formés et couverts par notre assurance." },
              { icon: "💳", title: "50% remboursé", text: "Grâce au crédit d'impôt (art. 199 sexdecies CGI), la moitié de vos dépenses vous est remboursée." },
            ].map((c, i) => (
              <div key={c.title} className={`reveal reveal-delay-${i + 1}`}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "32px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{c.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#F8FAFC", marginBottom: 12 }}>{c.title}</h3>
                <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7 }}>{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section style={{ background: "#060E18", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: AMBER, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Nos prestations</div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#F8FAFC" }}>
              Ce que nous faisons pour vous
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {SERVICES.map((s, i) => (
              <Link key={s.id} href={s.id === "rangement" ? "/coach" : `/services#${s.id}`}
                className={`card-hover reveal reveal-delay-${(i % 3) + 1}`}
                style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${s.special ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: 20, overflow: "hidden", textDecoration: "none", display: "block" }}>
                <img src={s.img} alt={s.title} style={{ width: "100%", height: 180, objectFit: "cover" }} loading="lazy" />
                <div style={{ padding: "20px 20px 24px" }}>
                  {s.special && <div style={{ fontSize: 11, color: AMBER, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>⭐ Spécialité</div>}
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 6 }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{s.short}</p>
                  <div style={{ marginTop: 14, fontSize: 13, color: AMBER, fontWeight: 600 }}>En savoir plus →</div>
                </div>
              </Link>
            ))}
          </div>
          <div className="reveal" style={{ textAlign: "center", marginTop: 40 }}>
            <Link href="/services" style={{ display: "inline-block", padding: "14px 32px", border: "2px solid rgba(245,158,11,0.4)", borderRadius: 30, color: AMBER, fontWeight: 600, textDecoration: "none", fontSize: 15 }}>
              Voir toutes nos prestations →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background: `linear-gradient(135deg, ${AMBER}, ${PINK})`, padding: "60px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 24, textAlign: "center" }}>
          {[["200+", "Foyers accompagnés"], ["5", "Prestations"], ["100%", "Clients satisfaits"], ["24h", "Délai intervention"]].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: 40, fontWeight: 800, color: NAVY }}>{n}</div>
              <div style={{ fontSize: 13, color: "rgba(13,27,42,0.7)", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Calculateur ── */}
      <section style={{ background: "#0D1B2A", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 60, alignItems: "center" }}>
          <div className="reveal">
            <div style={{ fontSize: 12, fontWeight: 700, color: AMBER, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Crédit d&apos;impôt</div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#F8FAFC", marginBottom: 20 }}>
              Moins cher que vous ne le pensez
            </h2>
            <p style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.7, marginBottom: 24 }}>
              L&apos;État prend en charge <strong style={{ color: "#F8FAFC" }}>50% de vos dépenses</strong> de services à la personne, directement déduit de votre impôt. Simulez votre coût réel.
            </p>
            {["Valable pour tous les contribuables", "Applicable sur toutes nos prestations", "Attestation fiscale fournie chaque année"].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#94A3B8", marginBottom: 10 }}>
                <span style={{ color: EMERALD, fontSize: 16 }}>✓</span> {t}
              </div>
            ))}
          </div>
          <div className="reveal reveal-delay-2"><Calculator /></div>
        </div>
      </section>

      {/* ── Témoignages ── */}
      <section style={{ background: "#060E18", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: AMBER, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Témoignages</div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#F8FAFC" }}>
              Ce que disent nos clients
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className={`reveal reveal-delay-${i + 1}`}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "28px 24px" }}>
                <div className="stars" style={{ marginBottom: 14 }}>{"★".repeat(t.stars)}</div>
                <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>&ldquo;{t.text}&rdquo;</p>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC" }}>{t.name}</div>
                <div style={{ fontSize: 12, color: "#475569" }}>{t.city}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Zones ── */}
      <section style={{ background: "#0D1B2A", padding: "60px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div className="reveal">
            <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 800, color: "#F8FAFC", marginBottom: 8 }}>Zones d&apos;intervention</h3>
            <p style={{ fontSize: 14, color: "#64748B", marginBottom: 28 }}>📍 Basée à Rivière-Salée · Toute la Martinique</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
              {ZONES.map(z => (
                <span key={z} style={{ padding: "8px 18px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 30, fontSize: 13, color: AMBER }}>
                  📍 {z}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section style={{ background: "#060E18", padding: "80px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#F8FAFC", marginBottom: 16 }}>
              Prêt à déléguer ?
            </h2>
            <p style={{ fontSize: 16, color: "#94A3B8" }}>Devis gratuit en 2 minutes · Rappel sous 24h</p>
          </div>
          <QuickForm />
        </div>
      </section>
    </>
  );
}

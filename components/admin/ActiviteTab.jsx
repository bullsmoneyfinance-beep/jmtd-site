"use client";
import { useState, useEffect } from "react";
import { load } from "../../lib/storage";
import { SERVICES, AMBER, PINK, EMERALD } from "../../lib/data";

const T = AMBER, P = PINK;
const eur = (n) => (Number(n) || 0).toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const SERVICE_LABELS = Object.fromEntries(SERVICES.map(s => [s.id, `${s.icon} ${s.title}`]));
const MOIS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
const card = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 22px" };

export default function ActiviteTab() {
  const [inters, setInters] = useState([]);
  const [clients, setClients] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [i, c] = await Promise.all([load("jmtd_interventions", []), load("jmtd_clients", [])]);
      setInters(i); setClients(c); setLoading(false);
    })();
  }, []);

  if (loading) return <div style={{ padding: 60, textAlign: "center", color: "#475569" }}>Chargement…</div>;

  const years = Array.from(new Set(inters.map(i => new Date(i.date).getFullYear()))).sort((a, b) => b - a);
  if (!years.includes(year)) years.unshift(year);
  const yInters = inters.filter(i => new Date(i.date).getFullYear() === year);

  const caRegle = yInters.filter(i => i.regle).reduce((a, i) => a + (i.montant || 0), 0);
  const caAttente = yInters.filter(i => !i.regle).reduce((a, i) => a + (i.montant || 0), 0);
  const heures = yInters.reduce((a, i) => a + (Number(i.heures) || 0), 0);
  const clientsActifs = new Set(yInters.map(i => i.clientId)).size;

  // CA par mois (réglé)
  const parMois = Array(12).fill(0);
  yInters.filter(i => i.regle).forEach(i => { parMois[new Date(i.date).getMonth()] += (i.montant || 0); });
  const maxMois = Math.max(...parMois, 1);

  // Répartition par prestation (réglé)
  const parPresta = {};
  yInters.filter(i => i.regle).forEach(i => { parPresta[i.service] = (parPresta[i.service] || 0) + (i.montant || 0); });
  const prestaArr = Object.entries(parPresta).sort((a, b) => b[1] - a[1]);
  const maxPresta = Math.max(...prestaArr.map(p => p[1]), 1);

  // Top clients (réglé)
  const parClient = {};
  yInters.filter(i => i.regle).forEach(i => { parClient[i.clientId] = (parClient[i.clientId] || 0) + (i.montant || 0); });
  const topClients = Object.entries(parClient).sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([id, ca]) => ({ nom: clients.find(c => c.id === id)?.prenom + " " + (clients.find(c => c.id === id)?.nom || "") || "Client", ca }));

  return (
    <div style={{ animation: "slideIn 0.25s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#F8FAFC", margin: 0 }}>Activité & Chiffre d'affaires</h1>
          <p style={{ fontSize: 13, color: "#475569", marginTop: 6 }}>Vue d'ensemble de vos prestations facturées</p>
        </div>
        <select value={year} onChange={e => setYear(+e.target.value)}
          style={{ padding: "9px 14px", background: "#0D1B2A", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#F8FAFC", fontSize: 13, cursor: "pointer" }}>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {inters.length === 0 ? (
        <div style={{ ...card, textAlign: "center", padding: "70px 24px", color: "#475569" }}>
          <div style={{ fontSize: 52, marginBottom: 14, opacity: 0.5 }}>💶</div>
          <p style={{ fontSize: 15 }}>Aucune intervention enregistrée.</p>
          <p style={{ fontSize: 13, color: "#334155" }}>Ajoutez des interventions dans l'onglet <strong style={{ color: T }}>Clients</strong> pour voir votre chiffre d'affaires apparaître ici.</p>
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 20 }}>
            <KPI label="CA réglé" value={eur(caRegle)} color={EMERALD} icon="✅" />
            <KPI label="En attente" value={eur(caAttente)} color="#F59E0B" icon="⏳" />
            <KPI label="Heures prestées" value={`${heures} h`} color={T} icon="⏱️" />
            <KPI label="Interventions" value={yInters.length} color="#8B5CF6" icon="📋" />
            <KPI label="Clients actifs" value={clientsActifs} color={P} icon="🏘️" />
          </div>

          {/* CA par mois */}
          <div style={{ ...card, marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", marginBottom: 20 }}>Chiffre d'affaires réglé par mois — {year}</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 160 }}>
              {parMois.map((v, m) => (
                <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
                  <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 700 }}>{v > 0 ? Math.round(v) : ""}</div>
                  <div style={{ width: "100%", maxWidth: 34, height: `${(v / maxMois) * 100}%`, minHeight: v > 0 ? 4 : 0, background: `linear-gradient(180deg, ${T}, ${P})`, borderRadius: "6px 6px 0 0", transition: "height 0.4s" }} />
                  <div style={{ fontSize: 10, color: "#64748B" }}>{MOIS[m]}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="act-two">
            {/* Répartition par prestation */}
            <div style={card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", marginBottom: 18 }}>Répartition par prestation</div>
              {prestaArr.length === 0 ? <div style={{ color: "#475569", fontSize: 13 }}>—</div> : prestaArr.map(([s, ca]) => (
                <div key={s} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 }}>
                    <span style={{ color: "#F8FAFC" }}>{SERVICE_LABELS[s] || s}</span>
                    <span style={{ color: "#94A3B8", fontWeight: 700 }}>{eur(ca)}</span>
                  </div>
                  <div style={{ height: 7, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${(ca / maxPresta) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${T}, ${P})`, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Top clients */}
            <div style={card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", marginBottom: 18 }}>Top clients — {year}</div>
              {topClients.length === 0 ? <div style={{ color: "#475569", fontSize: 13 }}>—</div> : topClients.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < topClients.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: i === 0 ? `${T}22` : "rgba(255,255,255,0.05)", color: i === 0 ? T : "#64748B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ flex: 1, fontSize: 13, color: "#F8FAFC" }}>{c.nom}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: EMERALD }}>{eur(c.ca)}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function KPI({ label, value, color, icon }) {
  return (
    <div style={{ ...card, padding: "18px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 700 }}>{label}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color }}>{value}</div>
    </div>
  );
}

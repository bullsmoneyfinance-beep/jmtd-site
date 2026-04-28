"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadSession, clearSession, load, save } from "../../lib/storage";
import { AMBER, NAVY, EMERALD } from "../../lib/data";

function fmt(ts) {
  return new Date(ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}
function fmtDate(ts) {
  return new Date(ts).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}
function duration(start, end) {
  const diff = Math.floor((end - start) / 60000);
  return `${Math.floor(diff / 60)}h${String(diff % 60).padStart(2, "0")}`;
}

export default function PointagePage() {
  const router = useRouter();
  const [emp, setEmp] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [active, setActive] = useState(null);
  const [gps, setGps] = useState(null);
  const [gpsError, setGpsError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("pointage");

  useEffect(() => {
    const e = loadSession("jmtd_emp");
    if (!e) { router.replace("/portail"); return; }
    setEmp(e);
    load("jmtd_sessions", []).then(s => setSessions(s.filter(x => x.empId === e.id)));
    load(`jmtd_active_${e.id}`, null).then(setActive);
  }, []);

  const getGPS = () => new Promise((resolve, reject) => {
    if (!navigator.geolocation) { reject("GPS non disponible"); return; }
    navigator.geolocation.getCurrentPosition(p => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, acc: Math.round(p.coords.accuracy) }), e => reject(e.message), { enableHighAccuracy: true, timeout: 10000 });
  });

  const pointageIn = async () => {
    setLoading(true);
    setGpsError(null);
    try {
      const pos = await getGPS();
      setGps(pos);
      const session = { id: Date.now(), empId: emp.id, empName: emp.name, start: Date.now(), startGps: pos, end: null, endGps: null };
      setActive(session);
      await save(`jmtd_active_${emp.id}`, session);
    } catch (e) { setGpsError(String(e)); }
    setLoading(false);
  };

  const pointageOut = async () => {
    if (!active) return;
    setLoading(true);
    setGpsError(null);
    try {
      const pos = await getGPS();
      const closed = { ...active, end: Date.now(), endGps: pos };
      const allSessions = await load("jmtd_sessions", []);
      const updated = [...allSessions.filter(s => s.id !== closed.id), closed];
      await save("jmtd_sessions", updated);
      setSessions(updated.filter(x => x.empId === emp.id));
      setActive(null);
      await save(`jmtd_active_${emp.id}`, null);
    } catch (e) { setGpsError(String(e)); }
    setLoading(false);
  };

  const logout = () => {
    clearSession("jmtd_emp");
    router.push("/portail");
  };

  if (!emp) return <div style={{ minHeight: "100vh", background: "#060E18", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B" }}>Chargement…</div>;

  const mySessions = sessions.filter(s => s.end).sort((a, b) => b.start - a.start);

  return (
    <div style={{ minHeight: "100vh", background: "#060E18", padding: "0 0 80px" }}>
      {/* Header */}
      <div style={{ background: "#0D1B2A", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${AMBER}, #D97706)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 12, color: NAVY }}>J&apos;MTD</div>
          <div>
            <div style={{ fontWeight: 700, color: "#F8FAFC", fontSize: 15 }}>{emp.name}</div>
            <div style={{ fontSize: 12, color: "#475569" }}>{emp.role} · {emp.zone}</div>
          </div>
        </div>
        <button onClick={logout} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#64748B", fontSize: 13, cursor: "pointer", padding: "6px 12px" }}>
          Déconnexion
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0D1B2A" }}>
        {[["pointage", "⏱ Pointage"], ["historique", "📋 Historique"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ flex: 1, padding: "14px", background: "none", border: "none", borderBottom: `2px solid ${tab === id ? AMBER : "transparent"}`, color: tab === id ? AMBER : "#64748B", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 500, margin: "0 auto", padding: "32px 24px" }}>
        {tab === "pointage" && (
          <>
            {/* Status card */}
            <div style={{ background: active ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${active ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 20, padding: "28px 24px", textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{active ? "🟢" : "⭕"}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#F8FAFC", marginBottom: 4 }}>
                {active ? "En service" : "Hors service"}
              </div>
              {active && (
                <div style={{ fontSize: 14, color: "#94A3B8" }}>
                  Depuis {fmt(active.start)}<br />
                  <span style={{ fontSize: 12, color: "#475569" }}>GPS: {active.startGps?.lat?.toFixed(4)}, {active.startGps?.lng?.toFixed(4)}</span>
                </div>
              )}
              {!active && <div style={{ fontSize: 14, color: "#475569" }}>Appuyez sur le bouton pour démarrer votre service</div>}
            </div>

            {/* GPS error */}
            {gpsError && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "14px 18px", marginBottom: 20, fontSize: 13, color: "#EF4444" }}>
                ⚠️ {gpsError}
              </div>
            )}

            {/* Main button */}
            <button onClick={active ? pointageOut : pointageIn} disabled={loading}
              style={{ width: "100%", padding: "20px", borderRadius: 16, fontSize: 18, fontWeight: 700, cursor: loading ? "wait" : "pointer", border: "none",
                background: active ? "rgba(239,68,68,0.9)" : `linear-gradient(135deg, ${AMBER}, #D97706)`,
                color: active ? "#FFF" : NAVY, boxShadow: active ? "0 8px 30px rgba(239,68,68,0.3)" : "0 8px 30px rgba(245,158,11,0.4)" }}>
              {loading ? "Localisation en cours…" : active ? "🔴 Pointer la sortie" : "🟢 Pointer l'entrée"}
            </button>

            <p style={{ textAlign: "center", fontSize: 12, color: "#334155", marginTop: 16 }}>
              📍 Votre position GPS sera enregistrée au pointage
            </p>

            {/* Date */}
            <div style={{ textAlign: "center", marginTop: 32, fontSize: 14, color: "#475569" }}>
              {fmtDate(Date.now())}
            </div>
          </>
        )}

        {tab === "historique" && (
          <>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#F8FAFC", marginBottom: 20 }}>Mes pointages</h2>
            {mySessions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 24px", color: "#475569" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                <p>Aucun pointage enregistré</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {mySessions.map(s => (
                  <div key={s.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "18px 20px" }}>
                    <div style={{ fontSize: 12, color: "#475569", marginBottom: 8 }}>{fmtDate(s.start)}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ color: EMERALD, fontWeight: 600, fontSize: 14 }}>▶ {fmt(s.start)}</span>
                        <span style={{ color: "#475569", margin: "0 8px" }}>→</span>
                        <span style={{ color: "#EF4444", fontWeight: 600, fontSize: 14 }}>■ {fmt(s.end)}</span>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: AMBER }}>{duration(s.start, s.end)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

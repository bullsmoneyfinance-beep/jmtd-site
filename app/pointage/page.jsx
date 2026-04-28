"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { loadSession, clearSession, load, save } from "../../lib/storage";
import { AMBER, PINK, EMERALD } from "../../lib/data";

const T = AMBER;
const P = PINK;
const G = EMERALD;

function fmt(ts) { return new Date(ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }); }
function fmtDay(ts) { return new Date(ts).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }); }
function fmtShort(ts) { return new Date(ts).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }); }
function duration(start, end) {
  const diff = Math.floor((end - start) / 60000);
  return `${Math.floor(diff / 60)}h${String(diff % 60).padStart(2, "0")}`;
}
function isSameDay(ts1, ts2) {
  const a = new Date(ts1), b = new Date(ts2);
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

/* ── Timer en direct ── */
function LiveTimer({ start }) {
  const [elapsed, setElapsed] = useState(Date.now() - start);
  useEffect(() => {
    const id = setInterval(() => setElapsed(Date.now() - start), 1000);
    return () => clearInterval(id);
  }, [start]);
  const h = Math.floor(elapsed / 3600000);
  const m = Math.floor((elapsed % 3600000) / 60000);
  const s = Math.floor((elapsed % 60000) / 1000);
  return <span>{String(h).padStart(2,"0")}:{String(m).padStart(2,"0")}:{String(s).padStart(2,"0")}</span>;
}

/* ── Carte RDV ── */
function RdvCard({ rdv, active, onStart, onEnd, loading }) {
  const now = Date.now();
  const isToday = isSameDay(rdv.date, now);
  const isPast = rdv.date + rdv.duration * 60000 < now;
  const isLinked = active?.appointmentId === rdv.id;
  const canStart = !active && !isPast && rdv.status !== "done" && rdv.status !== "cancelled";

  const statusColor = rdv.status === "done" ? G : rdv.status === "in-progress" ? T : rdv.status === "cancelled" ? "#EF4444" : P;
  const statusLabel = rdv.status === "done" ? "Terminé" : rdv.status === "in-progress" ? "En cours" : rdv.status === "cancelled" ? "Annulé" : "Programmé";

  return (
    <div style={{
      background: isLinked ? `rgba(13,169,164,0.08)` : "rgba(255,255,255,0.04)",
      border: `1px solid ${isLinked ? T + "55" : rdv.status === "done" ? "rgba(16,185,129,0.2)" : rdv.status === "cancelled" ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.08)"}`,
      borderRadius: 18, padding: "20px", marginBottom: 14, transition: "border-color 0.2s",
    }}>
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>
            {isToday ? "Aujourd'hui" : fmtShort(rdv.date)} · {fmt(rdv.date)}
            {rdv.duration ? ` → ${fmt(rdv.date + rdv.duration * 60000)}` : ""}
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#F8FAFC" }}>{rdv.clientName}</div>
          {rdv.service && <div style={{ fontSize: 13, color: T, fontWeight: 600, marginTop: 2 }}>{rdv.service}</div>}
        </div>
        <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: statusColor + "18", color: statusColor, flexShrink: 0, marginLeft: 8 }}>
          {statusLabel}
        </span>
      </div>

      {/* Details */}
      {rdv.address && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#94A3B8", marginBottom: 8 }}>
          <span style={{ flexShrink: 0 }}>📍</span>
          <span>{rdv.address}</span>
        </div>
      )}
      {rdv.notes && (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "10px 12px", fontSize: 12, color: "#64748B", marginBottom: 14 }}>
          📝 {rdv.notes}
        </div>
      )}

      {/* Action */}
      {isLinked && active && (
        <div style={{ marginBottom: 12, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: G, fontWeight: 600, marginBottom: 4 }}>🟢 En cours depuis {fmt(active.start)}</div>
          <div style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 700, color: T }}><LiveTimer start={active.start} /></div>
        </div>
      )}

      {isLinked && (
        <button onClick={onEnd} disabled={loading}
          style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: "rgba(239,68,68,0.85)", color: "#fff", fontWeight: 700, fontSize: 15, cursor: loading ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {loading ? "Localisation…" : "🔴 Terminer ce service"}
        </button>
      )}

      {canStart && !active && (
        <button onClick={() => onStart(rdv)} disabled={loading}
          style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 15, cursor: loading ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {loading ? "Localisation…" : "🟢 Démarrer ce service"}
        </button>
      )}

      {active && !isLinked && rdv.status !== "done" && rdv.status !== "cancelled" && (
        <div style={{ fontSize: 12, color: "#475569", textAlign: "center", padding: "10px 0" }}>
          Un autre service est en cours
        </div>
      )}
    </div>
  );
}

export default function PointagePage() {
  const router = useRouter();
  const [emp, setEmp] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [active, setActive] = useState(null);
  const [gpsError, setGpsError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("agenda");

  useEffect(() => {
    const e = loadSession("jmtd_emp");
    if (!e) { router.replace("/portail"); return; }
    setEmp(e);
    Promise.all([
      load("jmtd_sessions", []),
      load("jmtd_appointments", []),
      load(`jmtd_active_${e.id}`, null),
    ]).then(([s, a, active]) => {
      setSessions(s.filter(x => x.empId === e.id).sort((a, b) => b.start - a.start));
      setAppointments(a.filter(x => x.empId === e.id).sort((a, b) => a.date - b.date));
      setActive(active);
    });
  }, []);

  const getGPS = () => new Promise((resolve, reject) => {
    if (!navigator.geolocation) { reject("GPS non disponible"); return; }
    navigator.geolocation.getCurrentPosition(
      p => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, acc: Math.round(p.coords.accuracy) }),
      e => reject(e.message), { enableHighAccuracy: true, timeout: 10000 }
    );
  });

  /* Démarrer depuis un RDV */
  const startFromRdv = async (rdv) => {
    setLoading(true); setGpsError(null);
    try {
      const pos = await getGPS();
      const session = {
        id: Date.now(), empId: emp.id, empName: emp.name,
        start: Date.now(), startGps: pos, end: null, endGps: null,
        appointmentId: rdv.id, clientName: rdv.clientName, service: rdv.service,
      };
      setActive(session);
      await save(`jmtd_active_${emp.id}`, session);

      // Mettre à jour statut RDV
      const allRdv = await load("jmtd_appointments", []);
      const updatedRdv = allRdv.map(r => r.id === rdv.id ? { ...r, status: "in-progress" } : r);
      await save("jmtd_appointments", updatedRdv);
      setAppointments(updatedRdv.filter(x => x.empId === emp.id).sort((a, b) => a.date - b.date));
    } catch (e) { setGpsError(String(e)); }
    setLoading(false);
  };

  /* Démarrer manuellement (sans RDV) */
  const pointageIn = async () => {
    setLoading(true); setGpsError(null);
    try {
      const pos = await getGPS();
      const session = { id: Date.now(), empId: emp.id, empName: emp.name, start: Date.now(), startGps: pos, end: null, endGps: null };
      setActive(session);
      await save(`jmtd_active_${emp.id}`, session);
    } catch (e) { setGpsError(String(e)); }
    setLoading(false);
  };

  /* Terminer */
  const pointageOut = async () => {
    if (!active) return;
    setLoading(true); setGpsError(null);
    try {
      const pos = await getGPS();
      const closed = { ...active, end: Date.now(), endGps: pos };
      const allSessions = await load("jmtd_sessions", []);
      const updatedSessions = [...allSessions.filter(s => s.id !== closed.id), closed];
      await save("jmtd_sessions", updatedSessions);
      setSessions(updatedSessions.filter(x => x.empId === emp.id).sort((a, b) => b.start - a.start));

      // Mettre à jour le RDV lié
      if (active.appointmentId) {
        const allRdv = await load("jmtd_appointments", []);
        const updatedRdv = allRdv.map(r => r.id === active.appointmentId ? { ...r, status: "done" } : r);
        await save("jmtd_appointments", updatedRdv);
        setAppointments(updatedRdv.filter(x => x.empId === emp.id).sort((a, b) => a.date - b.date));
      }

      setActive(null);
      await save(`jmtd_active_${emp.id}`, null);
    } catch (e) { setGpsError(String(e)); }
    setLoading(false);
  };

  const logout = () => { clearSession("jmtd_emp"); router.push("/portail"); };

  if (!emp) return (
    <div style={{ minHeight: "100vh", background: "#060E18", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${T}33`, borderTopColor: T, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const now = Date.now();
  const todayRdv = appointments.filter(r => isSameDay(r.date, now));
  const upcomingRdv = appointments.filter(r => !isSameDay(r.date, now) && r.date > now && r.status !== "cancelled");
  const doneSessions = sessions.filter(s => s.end);

  const TABS = [
    { id: "agenda", icon: "📅", label: "Agenda" },
    { id: "pointage", icon: "⏱️", label: "Pointage" },
    { id: "historique", icon: "📋", label: "Historique" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#060E18", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.6; transform:scale(1.15); } }
        @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
      `}</style>

      {/* ── Header ── */}
      <div style={{ background: "#0B1523", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Avatar */}
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${T}, ${P})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
            👤
          </div>
          <div>
            <div style={{ fontWeight: 700, color: "#F8FAFC", fontSize: 15 }}>{emp.name}</div>
            <div style={{ fontSize: 12, color: "#475569" }}>{emp.role} · {emp.zone}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {active && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: G, animation: "pulse 1.5s infinite" }} />
              <span style={{ fontSize: 12, color: G, fontWeight: 700 }}>En service</span>
            </div>
          )}
          <button onClick={logout} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#64748B", fontSize: 12, cursor: "pointer", padding: "6px 12px" }}>
            Quitter
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ background: "#0B1523", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, padding: "13px 8px", background: "none", border: "none", borderBottom: `2px solid ${tab === t.id ? T : "transparent"}`, color: tab === t.id ? T : "#475569", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, transition: "color 0.2s" }}>
            <span style={{ fontSize: 17 }}>{t.icon}</span>
            <span>{t.label}</span>
            {t.id === "agenda" && todayRdv.filter(r => r.status === "scheduled").length > 0 && (
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: P, display: "block" }} />
            )}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 40px", maxWidth: 520, margin: "0 auto", width: "100%" }}>

        {/* ═══ AGENDA ═══ */}
        {tab === "agenda" && (
          <div style={{ animation: "slideUp 0.25s ease" }}>

            {/* Résumé du jour */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${T}22`, borderRadius: 16, padding: "16px 18px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13, color: "#475569", marginBottom: 4 }}>{fmtDay(now)}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#F8FAFC" }}>
                  {todayRdv.length} RDV aujourd&apos;hui
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "#475569" }}>Terminés</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: G }}>{todayRdv.filter(r => r.status === "done").length}/{todayRdv.length}</div>
              </div>
            </div>

            {/* RDV du jour */}
            {todayRdv.length > 0 && (
              <>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Aujourd&apos;hui</div>
                {todayRdv.map(rdv => (
                  <RdvCard key={rdv.id} rdv={rdv} active={active} onStart={startFromRdv} onEnd={pointageOut} loading={loading} />
                ))}
              </>
            )}

            {/* Prochains RDV */}
            {upcomingRdv.length > 0 && (
              <>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 1, margin: "20px 0 12px" }}>Prochains rendez-vous</div>
                {upcomingRdv.map(rdv => (
                  <RdvCard key={rdv.id} rdv={rdv} active={active} onStart={startFromRdv} onEnd={pointageOut} loading={loading} />
                ))}
              </>
            )}

            {todayRdv.length === 0 && upcomingRdv.length === 0 && (
              <div style={{ textAlign: "center", padding: "64px 24px" }}>
                <div style={{ fontSize: 52, marginBottom: 16 }}>📅</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#64748B" }}>Aucun rendez-vous planifié</div>
                <div style={{ fontSize: 13, color: "#334155", marginTop: 8 }}>L&apos;admin n&apos;a pas encore planifié de RDV pour vous.</div>
              </div>
            )}

            {/* GPS error */}
            {gpsError && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: "14px 16px", fontSize: 13, color: "#EF4444", marginTop: 16 }}>
                ⚠️ {gpsError}
              </div>
            )}
          </div>
        )}

        {/* ═══ POINTAGE MANUEL ═══ */}
        {tab === "pointage" && (
          <div style={{ animation: "slideUp 0.25s ease" }}>

            {/* Status card */}
            <div style={{
              background: active ? "rgba(13,169,164,0.07)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${active ? T + "44" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 20, padding: "32px 24px", textAlign: "center", marginBottom: 24,
            }}>
              {/* Indicator */}
              <div style={{ position: "relative", width: 72, height: 72, margin: "0 auto 20px" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: active ? `${G}22` : "rgba(255,255,255,0.06)", border: `3px solid ${active ? G : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>
                  {active ? "🟢" : "⭕"}
                </div>
                {active && <div style={{ position: "absolute", inset: -4, borderRadius: "50%", border: `2px solid ${G}33`, animation: "pulse 2s infinite" }} />}
              </div>

              <div style={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC", marginBottom: 8 }}>
                {active ? "En service" : "Hors service"}
              </div>

              {active ? (
                <>
                  <div style={{ fontFamily: "monospace", fontSize: 36, fontWeight: 800, color: T, marginBottom: 8 }}>
                    <LiveTimer start={active.start} />
                  </div>
                  <div style={{ fontSize: 13, color: "#64748B" }}>Début à {fmt(active.start)}</div>
                  {active.clientName && <div style={{ fontSize: 13, color: P, fontWeight: 600, marginTop: 6 }}>📋 {active.clientName}</div>}
                  {active.startGps && (
                    <a href={`https://maps.google.com/?q=${active.startGps.lat},${active.startGps.lng}`} target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-block", marginTop: 8, fontSize: 12, color: T, textDecoration: "none" }}>
                      📍 Voir position de départ
                    </a>
                  )}
                </>
              ) : (
                <div style={{ fontSize: 14, color: "#475569" }}>Prêt à démarrer votre service</div>
              )}
            </div>

            {/* GPS error */}
            {gpsError && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: "14px 16px", marginBottom: 20, fontSize: 13, color: "#EF4444" }}>
                ⚠️ {gpsError}
              </div>
            )}

            {/* Button */}
            <button onClick={active ? pointageOut : pointageIn} disabled={loading}
              style={{ width: "100%", padding: "20px", borderRadius: 16, fontSize: 17, fontWeight: 700, cursor: loading ? "wait" : "pointer", border: "none",
                background: active ? "rgba(239,68,68,0.85)" : `linear-gradient(135deg, ${T}, ${P})`,
                color: "#fff", boxShadow: active ? "0 8px 30px rgba(239,68,68,0.25)" : `0 8px 30px ${T}44`,
                transition: "all 0.2s" }}>
              {loading ? "📡 Localisation en cours…" : active ? "🔴 Terminer le service" : "🟢 Démarrer le service"}
            </button>

            <div style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: "#334155" }}>
              📍 Votre position GPS est enregistrée automatiquement
            </div>

            <div style={{ textAlign: "center", marginTop: 28, fontSize: 14, color: "#475569" }}>
              {fmtDay(now)}
            </div>
          </div>
        )}

        {/* ═══ HISTORIQUE ═══ */}
        {tab === "historique" && (
          <div style={{ animation: "slideUp 0.25s ease" }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#F8FAFC" }}>Mes services</div>
              <div style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>{doneSessions.length} session{doneSessions.length !== 1 ? "s" : ""} terminée{doneSessions.length !== 1 ? "s" : ""}</div>
            </div>

            {/* Stat rapide */}
            {doneSessions.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                  { label: "Total heures", value: `${doneSessions.reduce((a, s) => a + (s.end - s.start) / 3600000, 0).toFixed(1)}h`, color: T },
                  { label: "Cette semaine", value: `${doneSessions.filter(s => s.start > Date.now() - 7 * 86400000).length} sessions`, color: P },
                ].map(stat => (
                  <div key={stat.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                    <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {doneSessions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "64px 24px", color: "#475569" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                <p>Aucun service enregistré</p>
              </div>
            ) : (
              doneSessions.map(s => (
                <div key={s.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "16px 18px", marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>{fmtDay(s.start)}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}>
                        <span style={{ color: G, fontWeight: 600 }}>▶ {fmt(s.start)}</span>
                        <span style={{ color: "#334155" }}>→</span>
                        <span style={{ color: "#EF4444", fontWeight: 600 }}>■ {fmt(s.end)}</span>
                      </div>
                      {s.clientName && <div style={{ fontSize: 12, color: P, marginTop: 4 }}>📋 {s.clientName}</div>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: T }}>{duration(s.start, s.end)}</div>
                      {s.appointmentId && (
                        <div style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>RDV validé ✓</div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

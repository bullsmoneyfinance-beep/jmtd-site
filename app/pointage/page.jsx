"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { loadSession, clearSession, load, save } from "../../lib/storage";
import { AMBER, PINK, EMERALD } from "../../lib/data";

const T = AMBER;   // teal
const P = PINK;    // rose
const G = EMERALD; // vert

/* ─── Utilitaires ─── */
function fmt(ts)     { return new Date(ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }); }
function fmtDay(ts)  { return new Date(ts).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }); }
function fmtShort(ts){ return new Date(ts).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }); }
function dur(s, e)   { const d = Math.floor((e - s) / 60000); return `${Math.floor(d/60)}h${String(d%60).padStart(2,"0")}`; }
function sameDay(a, b){ const A=new Date(a),B=new Date(b); return A.getDate()===B.getDate()&&A.getMonth()===B.getMonth()&&A.getFullYear()===B.getFullYear(); }

/* ─── Timer live ─── */
function LiveTimer({ start }) {
  const [el, setEl] = useState(Date.now() - start);
  useEffect(() => { const id = setInterval(() => setEl(Date.now() - start), 1000); return () => clearInterval(id); }, [start]);
  const h = Math.floor(el/3600000), m = Math.floor((el%3600000)/60000), s = Math.floor((el%60000)/1000);
  return <>{String(h).padStart(2,"0")}:{String(m).padStart(2,"0")}:{String(s).padStart(2,"0")}</>;
}

/* ─── GPS ─── */
function getGPS() {
  return new Promise((res, rej) => {
    if (!navigator.geolocation) { rej("GPS non disponible sur cet appareil"); return; }
    navigator.geolocation.getCurrentPosition(
      p => res({ lat: p.coords.latitude, lng: p.coords.longitude, acc: Math.round(p.coords.accuracy) }),
      e => rej(e.code === 1 ? "Accès GPS refusé. Activez la localisation dans Réglages." : "GPS indisponible, réessayez."),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  });
}

/* ─── Carte RDV ─── */
function RdvCard({ rdv, active, onStart, onEnd, loading }) {
  const now = Date.now();
  const isToday    = sameDay(rdv.date, now);
  const isPast     = rdv.date + (rdv.duration||120) * 60000 < now;
  const isLinked   = active?.appointmentId === rdv.id;
  const isActive   = rdv.status === "in-progress" || isLinked;
  const isDone     = rdv.status === "done";
  const isCancelled= rdv.status === "cancelled";
  const canStart   = !active && !isPast && !isDone && !isCancelled;

  const statusMap  = { done: [G,"Terminé ✓"], "in-progress": [T,"En cours"], cancelled: ["#EF4444","Annulé"], scheduled: [P,"Programmé"] };
  const [sc, sl]   = statusMap[rdv.status] || [P,"Programmé"];

  return (
    <div style={{ background: isLinked ? `${T}0d` : isDone ? `${G}06` : "rgba(255,255,255,0.04)", border: `1.5px solid ${isLinked ? T+"55" : isDone ? G+"33" : isCancelled ? "#EF444422" : "rgba(255,255,255,0.07)"}`, borderRadius: 20, padding: "20px 18px", marginBottom: 12, opacity: isCancelled ? 0.6 : 1 }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: "#475569", marginBottom: 4 }}>
            {isToday ? "Aujourd'hui" : fmtShort(rdv.date)} · {fmt(rdv.date)}
            {rdv.duration ? ` → ${fmt(rdv.date + rdv.duration * 60000)}` : ""}
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#F8FAFC", lineHeight: 1.3 }}>{rdv.clientName}</div>
          {rdv.service && <div style={{ fontSize: 13, color: T, fontWeight: 600, marginTop: 3 }}>{rdv.service}</div>}
        </div>
        <span style={{ padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: sc+"18", color: sc, flexShrink: 0, whiteSpace: "nowrap" }}>{sl}</span>
      </div>

      {rdv.address && (
        <a href={`https://maps.google.com/?q=${encodeURIComponent(rdv.address)}`} target="_blank" rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748B", textDecoration: "none", marginBottom: 8, WebkitTapHighlightColor: "transparent" }}>
          <span style={{ fontSize: 16 }}>📍</span>
          <span style={{ textDecoration: "underline", textDecorationColor: "#64748B55" }}>{rdv.address}</span>
        </a>
      )}

      {rdv.notes && (
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 12px", fontSize: 12, color: "#64748B", marginBottom: 14, lineHeight: 1.6 }}>
          📝 {rdv.notes}
        </div>
      )}

      {isLinked && active && (
        <div style={{ textAlign: "center", padding: "14px 0", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", margin: "0 0 14px" }}>
          <div style={{ fontSize: 12, color: G, fontWeight: 600, marginBottom: 6 }}>🟢 En cours depuis {fmt(active.start)}</div>
          <div style={{ fontFamily: "monospace", fontSize: 28, fontWeight: 800, color: T, letterSpacing: 2 }}><LiveTimer start={active.start} /></div>
        </div>
      )}

      {isLinked && (
        <button onClick={onEnd} disabled={loading}
          style={{ width: "100%", minHeight: 52, borderRadius: 14, border: "none", background: "rgba(239,68,68,0.9)", color: "#fff", fontWeight: 700, fontSize: 16, cursor: loading ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}>
          {loading ? <><Spinner/> Localisation…</> : <>🔴 Terminer ce service</>}
        </button>
      )}

      {canStart && !active && (
        <button onClick={() => onStart(rdv)} disabled={loading}
          style={{ width: "100%", minHeight: 52, borderRadius: 14, border: "none", background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 16, cursor: loading ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, WebkitTapHighlightColor: "transparent", touchAction: "manipulation", boxShadow: `0 6px 24px ${T}44` }}>
          {loading ? <><Spinner/> Localisation…</> : <>🟢 Démarrer ce service</>}
        </button>
      )}

      {active && !isLinked && !isDone && !isCancelled && (
        <div style={{ fontSize: 12, color: "#475569", textAlign: "center", padding: "8px 0", fontStyle: "italic" }}>Un autre service est en cours</div>
      )}
    </div>
  );
}

function Spinner() {
  return <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0 }} />;
}

/* ═══════════════════════════════════════════════════════════ */
export default function PointagePage() {
  const router = useRouter();
  const [emp, setEmp]             = useState(null);
  const [sessions, setSessions]   = useState([]);
  const [appointments, setApts]   = useState([]);
  const [active, setActive]       = useState(null);
  const [gpsError, setGpsError]   = useState(null);
  const [loading, setLoading]     = useState(false);
  const [tab, setTab]             = useState("pointage");
  const [myMessages, setMyMessages] = useState([]);

  useEffect(() => {
    const e = loadSession("jmtd_emp");
    if (!e) { router.replace("/portail"); return; }
    setEmp(e);
    Promise.all([
      load("jmtd_sessions", []),
      load("jmtd_appointments", []),
      load(`jmtd_active_${e.id}`, null),
      load("jmtd_messages", []),
    ]).then(([s, a, act, msgs]) => {
      setSessions(s.filter(x => x.empId === e.id).sort((a,b) => b.start - a.start));
      setApts(a.filter(x => x.empId === e.id).sort((a,b) => a.date - b.date));
      setActive(act);
      if (act) setTab("pointage");
      // Messages destinés à cette intervenante ou à toute l'équipe
      const mine = msgs.filter(m => m.toId === "all" || m.toId === e.id).sort((a,b) => b.sentAt - a.sentAt);
      setMyMessages(mine);
      // Marquer comme lus
      const updated = msgs.map(m => {
        if ((m.toId === "all" || m.toId === e.id) && !m.readBy?.includes(e.name)) {
          return { ...m, readAt: Date.now(), readBy: [...(m.readBy||[]), e.name] };
        }
        return m;
      });
      if (updated.some((m,i) => m !== msgs[i])) save("jmtd_messages", updated);
    });
  }, []);

  const startFromRdv = useCallback(async (rdv) => {
    setLoading(true); setGpsError(null);
    try {
      const pos = await getGPS();
      const session = { id: Date.now(), empId: emp.id, empName: emp.name, start: Date.now(), startGps: pos, end: null, endGps: null, appointmentId: rdv.id, clientName: rdv.clientName, service: rdv.service };
      setActive(session);
      await save(`jmtd_active_${emp.id}`, session);
      // Ajoute immédiatement la session (active) à jmtd_sessions → visible dans l'admin en temps réel
      const allS = await load("jmtd_sessions", []);
      await save("jmtd_sessions", [...allS.filter(s => s.id !== session.id), session]);
      const allRdv = await load("jmtd_appointments", []);
      const upd = allRdv.map(r => r.id === rdv.id ? { ...r, status: "in-progress" } : r);
      await save("jmtd_appointments", upd);
      setApts(upd.filter(x => x.empId === emp.id).sort((a,b) => a.date - b.date));
      setTab("pointage");
    } catch(e) { setGpsError(String(e)); }
    setLoading(false);
  }, [emp]);

  const pointageIn = useCallback(async () => {
    setLoading(true); setGpsError(null);
    try {
      const pos = await getGPS();
      const session = { id: Date.now(), empId: emp.id, empName: emp.name, start: Date.now(), startGps: pos, end: null, endGps: null };
      setActive(session);
      await save(`jmtd_active_${emp.id}`, session);
      // Ajoute immédiatement la session (active) à jmtd_sessions → visible dans l'admin en temps réel
      const allS = await load("jmtd_sessions", []);
      await save("jmtd_sessions", [...allS.filter(s => s.id !== session.id), session]);
    } catch(e) { setGpsError(String(e)); }
    setLoading(false);
  }, [emp]);

  const pointageOut = useCallback(async () => {
    if (!active) return;
    setLoading(true); setGpsError(null);
    try {
      const pos = await getGPS();
      const closed = { ...active, end: Date.now(), endGps: pos };
      const allS = await load("jmtd_sessions", []);
      const updS = [...allS.filter(s => s.id !== closed.id), closed];
      await save("jmtd_sessions", updS);
      setSessions(updS.filter(x => x.empId === emp.id).sort((a,b) => b.start - a.start));
      if (active.appointmentId) {
        const allR = await load("jmtd_appointments", []);
        const updR = allR.map(r => r.id === active.appointmentId ? { ...r, status: "done" } : r);
        await save("jmtd_appointments", updR);
        setApts(updR.filter(x => x.empId === emp.id).sort((a,b) => a.date - b.date));
      }
      setActive(null);
      await save(`jmtd_active_${emp.id}`, null);
    } catch(e) { setGpsError(String(e)); }
    setLoading(false);
  }, [active, emp]);

  const logout = () => { clearSession("jmtd_emp"); router.push("/portail"); };

  if (!emp) return (
    <div style={{ minHeight: "100dvh", background: "#060E18", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${T}33`, borderTopColor: T, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const now = Date.now();
  const todayRdv    = appointments.filter(r => sameDay(r.date, now));
  const upcomingRdv = appointments.filter(r => !sameDay(r.date, now) && r.date > now && r.status !== "cancelled");
  const doneSessions= sessions.filter(s => s.end);
  const weekH       = doneSessions.filter(s => s.start > now - 7*86400000).reduce((a,s) => a + (s.end-s.start)/3600000, 0);
  const totalH      = doneSessions.reduce((a,s) => a + (s.end-s.start)/3600000, 0);
  const pendingToday= todayRdv.filter(r => r.status === "scheduled").length;

  const unreadMsgCount = myMessages.filter(m => !m.readBy?.includes(emp?.name)).length;

  const TABS = [
    { id: "agenda",     icon: "📅", label: "Agenda",    badge: pendingToday },
    { id: "pointage",   icon: "⏱️", label: "Pointage",  badge: active ? 1 : 0 },
    { id: "messages",   icon: "💬", label: "Messages",  badge: myMessages.length },
    { id: "historique", icon: "📋", label: "Historique", badge: 0 },
  ];

  return (
    <div style={{ minHeight: "100dvh", background: "#060E18", display: "flex", flexDirection: "column", maxWidth: 540, margin: "0 auto" }}>
      <style>{`
        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.25)} }
        @keyframes ring     { 0%,100%{transform:scale(1);opacity:.8} 50%{transform:scale(1.12);opacity:.3} }
        @keyframes slideUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes glow     { 0%,100%{box-shadow:0 8px 32px rgba(13,169,164,0.3)} 50%{box-shadow:0 8px 48px rgba(13,169,164,0.6)} }
        @keyframes glowRed  { 0%,100%{box-shadow:0 8px 32px rgba(239,68,68,0.3)} 50%{box-shadow:0 8px 48px rgba(239,68,68,0.55)} }
        * { -webkit-tap-highlight-color: transparent; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ background: "#0B1523", padding: "12px 18px", paddingTop: `max(12px, env(safe-area-inset-top))`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Avatar */}
          <div style={{ position: "relative", width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg, ${T}, ${P})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
            👤
            {active && <div style={{ position: "absolute", bottom: -2, right: -2, width: 12, height: 12, borderRadius: "50%", background: G, border: "2px solid #0B1523", animation: "pulse 1.8s infinite" }} />}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: "#F8FAFC", fontSize: 14, lineHeight: 1.2 }}>{emp.name}</div>
            <div style={{ fontSize: 11, color: "#475569", lineHeight: 1.2 }}>{emp.role} · {emp.zone}</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {active && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 20, background: `${G}14`, border: `1px solid ${G}44` }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: G, animation: "pulse 1.5s infinite", flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: G, fontWeight: 700 }}>En service</span>
            </div>
          )}
          <button onClick={logout} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#64748B", fontSize: 12, cursor: "pointer", padding: "6px 12px", minHeight: 34 }}>
            Quitter
          </button>
        </div>
      </div>

      {/* ── Content scrollable ── */}
      <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", padding: "0 16px", paddingBottom: "calc(80px + env(safe-area-inset-bottom))" }}>

        {/* ═══ POINTAGE ═══ */}
        {tab === "pointage" && (
          <div style={{ padding: "24px 0", animation: "slideUp 0.25s ease" }}>

            {/* Date */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: "#475569", textTransform: "capitalize" }}>{fmtDay(now)}</div>
            </div>

            {/* Grand status ring */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ position: "relative", display: "inline-block" }}>
                {/* Anneau animé */}
                {active && <div style={{ position: "absolute", inset: -12, borderRadius: "50%", border: `2px solid ${G}33`, animation: "ring 2.5s ease-in-out infinite" }} />}
                {active && <div style={{ position: "absolute", inset: -24, borderRadius: "50%", border: `1.5px solid ${G}18`, animation: "ring 2.5s ease-in-out infinite 0.4s" }} />}

                {/* Cercle principal */}
                <div style={{ width: 140, height: 140, borderRadius: "50%", background: active ? `radial-gradient(circle, ${G}20, ${G}08)` : "rgba(255,255,255,0.04)", border: `3px solid ${active ? G : "rgba(255,255,255,0.1)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "all 0.4s ease" }}>
                  <div style={{ fontSize: 40, marginBottom: 4 }}>{active ? "🟢" : "⭕"}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: active ? G : "#475569" }}>
                    {active ? "En service" : "Hors service"}
                  </div>
                </div>
              </div>
            </div>

            {/* Timer si actif */}
            {active && (
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{ fontFamily: "monospace", fontSize: 42, fontWeight: 800, color: T, letterSpacing: 3, lineHeight: 1 }}>
                  <LiveTimer start={active.start} />
                </div>
                <div style={{ fontSize: 13, color: "#64748B", marginTop: 8 }}>Début à {fmt(active.start)}</div>
                {active.clientName && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, padding: "6px 14px", borderRadius: 20, background: `${P}12`, border: `1px solid ${P}30` }}>
                    <span style={{ fontSize: 13, color: P, fontWeight: 600 }}>📋 {active.clientName}</span>
                  </div>
                )}
                {active.startGps && (
                  <div style={{ marginTop: 10 }}>
                    <a href={`https://maps.google.com/?q=${active.startGps.lat},${active.startGps.lng}`} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 12, color: T, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                      📍 Voir ma position de départ →
                    </a>
                  </div>
                )}
              </div>
            )}

            {!active && (
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.6 }}>
                  Appuyez sur le bouton<br />pour démarrer votre service
                </p>
              </div>
            )}

            {/* GPS error */}
            {gpsError && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 14, padding: "14px 16px", marginBottom: 20, fontSize: 13, color: "#EF4444", lineHeight: 1.6 }}>
                ⚠️ {gpsError}
              </div>
            )}

            {/* Bouton principal — énorme, impossible à rater */}
            <button onClick={active ? pointageOut : pointageIn} disabled={loading}
              style={{ width: "100%", minHeight: 64, borderRadius: 20, border: "none", fontSize: 18, fontWeight: 800, cursor: loading ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, transition: "transform 0.15s, box-shadow 0.3s", touchAction: "manipulation",
                background: active ? "rgba(239,68,68,0.92)" : `linear-gradient(135deg, ${T}, ${P})`,
                color: "#fff",
                animation: loading ? "none" : active ? "glowRed 3s infinite" : "glow 3s infinite",
              }}
              onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
              onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}>
              {loading
                ? <><Spinner /> Localisation GPS…</>
                : active
                  ? <>🔴 Pointer la sortie</>
                  : <>🟢 Pointer l&apos;entrée</>
              }
            </button>

            <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "#334155", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
              <span>📍</span> Votre position GPS sera enregistrée au pointage
            </div>

            {/* Si RDV du jour, afficher raccourci */}
            {!active && todayRdv.filter(r => r.status === "scheduled").length > 0 && (
              <div style={{ marginTop: 24, padding: "16px", background: `${T}08`, border: `1px solid ${T}22`, borderRadius: 16, textAlign: "center" }}>
                <div style={{ fontSize: 13, color: "#64748B", marginBottom: 8 }}>
                  Vous avez {todayRdv.filter(r => r.status === "scheduled").length} RDV aujourd&apos;hui
                </div>
                <button onClick={() => setTab("agenda")}
                  style={{ background: "none", border: `1px solid ${T}44`, borderRadius: 20, color: T, fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "8px 20px" }}>
                  Voir mon agenda →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ═══ AGENDA ═══ */}
        {tab === "agenda" && (
          <div style={{ padding: "20px 0", animation: "slideUp 0.25s ease" }}>

            {/* Résumé du jour */}
            <div style={{ background: `${T}0a`, border: `1px solid ${T}22`, borderRadius: 18, padding: "18px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, color: "#475569", marginBottom: 4, textTransform: "capitalize" }}>{fmtDay(now)}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#F8FAFC" }}>
                  {todayRdv.length} RDV aujourd&apos;hui
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: G }}>{todayRdv.filter(r => r.status === "done").length}<span style={{ fontSize: 14, color: "#475569" }}>/{todayRdv.length}</span></div>
                <div style={{ fontSize: 11, color: "#475569" }}>terminés</div>
              </div>
            </div>

            {todayRdv.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10 }}>Aujourd&apos;hui</div>
                {todayRdv.map(rdv => <RdvCard key={rdv.id} rdv={rdv} active={active} onStart={startFromRdv} onEnd={pointageOut} loading={loading} />)}
              </>
            )}

            {upcomingRdv.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 1.2, margin: "20px 0 10px" }}>Prochains</div>
                {upcomingRdv.map(rdv => <RdvCard key={rdv.id} rdv={rdv} active={active} onStart={startFromRdv} onEnd={pointageOut} loading={loading} />)}
              </>
            )}

            {todayRdv.length === 0 && upcomingRdv.length === 0 && (
              <div style={{ textAlign: "center", padding: "64px 24px" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>📅</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: "#64748B", marginBottom: 8 }}>Aucun rendez-vous planifié</div>
                <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.7 }}>L&apos;administrateur n&apos;a pas encore<br />planifié de RDV pour vous.</div>
              </div>
            )}

            {gpsError && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: "14px 16px", fontSize: 13, color: "#EF4444", marginTop: 16, lineHeight: 1.6 }}>
                ⚠️ {gpsError}
              </div>
            )}
          </div>
        )}

        {/* ═══ MESSAGES ═══ */}
        {tab === "messages" && (
          <div style={{ padding: "20px 0", animation: "slideUp 0.25s ease" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>
              💬 Messages de l&apos;administration
            </div>

            {myMessages.length === 0 ? (
              <div style={{ textAlign: "center", padding: "56px 24px", color: "#475569" }}>
                <div style={{ fontSize: 52, marginBottom: 12 }}>💬</div>
                <p style={{ fontSize: 15 }}>Aucun message pour l&apos;instant</p>
              </div>
            ) : (
              myMessages.map(msg => {
                const priorityColors = { urgent: "#EF4444", info: G, normal: T };
                const priorityLabels = { urgent: "🔴 Urgent", info: "🟢 Info", normal: "🔵 Normal" };
                const col = priorityColors[msg.priority] || T;
                return (
                  <div key={msg.id} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${col}33`, borderRadius: 16, padding: "16px 18px", marginBottom: 12, borderLeft: `4px solid ${col}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                      <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: col + "18", color: col }}>{priorityLabels[msg.priority] || "🔵 Normal"}</span>
                      <span style={{ fontSize: 11, color: "#475569" }}>{new Date(msg.sentAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <p style={{ fontSize: 14, color: "#F8FAFC", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{msg.text}</p>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ═══ HISTORIQUE ═══ */}
        {tab === "historique" && (
          <div style={{ padding: "20px 0", animation: "slideUp 0.25s ease" }}>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[
                { label: "Total", value: `${totalH.toFixed(1)}h`, color: T },
                { label: "7 jours", value: `${weekH.toFixed(1)}h`, color: P },
                { label: "Sessions", value: doneSessions.length, color: G },
              ].map(s => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 5 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {doneSessions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "56px 24px", color: "#475569" }}>
                <div style={{ fontSize: 52, marginBottom: 12 }}>📋</div>
                <p style={{ fontSize: 15 }}>Aucun service enregistré</p>
              </div>
            ) : (
              doneSessions.map(s => (
                <div key={s.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "16px 18px", marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: "#475569", marginBottom: 6, textTransform: "capitalize" }}>{fmtDay(s.start)}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, flexWrap: "wrap" }}>
                        <span style={{ color: G, fontWeight: 600 }}>▶ {fmt(s.start)}</span>
                        <span style={{ color: "#334155" }}>→</span>
                        <span style={{ color: "#EF4444", fontWeight: 600 }}>■ {fmt(s.end)}</span>
                      </div>
                      {s.clientName && <div style={{ fontSize: 12, color: P, marginTop: 5, fontWeight: 500 }}>📋 {s.clientName}</div>}
                      {s.appointmentId && <div style={{ fontSize: 10, color: G, marginTop: 3, fontWeight: 600 }}>✓ RDV validé</div>}
                    </div>
                    <div style={{ textAlign: "right", marginLeft: 12 }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: T }}>{dur(s.start, s.end)}</div>
                      {s.endGps && (
                        <a href={`https://maps.google.com/?q=${s.endGps.lat},${s.endGps.lng}`} target="_blank" rel="noopener noreferrer"
                          style={{ fontSize: 10, color: "#475569", textDecoration: "none", marginTop: 4, display: "block" }}>📍 GPS</a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ── Bottom tab bar — iOS/Android style ── */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 540, background: "rgba(11,21,35,0.96)", borderTop: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", display: "flex", zIndex: 100, paddingBottom: "env(safe-area-inset-bottom)" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, padding: "10px 0 8px", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, position: "relative", touchAction: "manipulation" }}>
            {/* Active indicator */}
            {tab === t.id && <div style={{ position: "absolute", top: 0, left: "25%", right: "25%", height: 2, background: T, borderRadius: "0 0 2px 2px" }} />}

            {/* Badge */}
            {t.badge > 0 && (
              <div style={{ position: "absolute", top: 6, right: "calc(50% - 18px)", width: 16, height: 16, borderRadius: "50%", background: t.id === "pointage" ? G : P, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#fff" }}>
                {t.badge}
              </div>
            )}

            <span style={{ fontSize: 22 }}>{t.icon}</span>
            <span style={{ fontSize: 10, fontWeight: tab === t.id ? 700 : 500, color: tab === t.id ? T : "#475569", letterSpacing: 0.3 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

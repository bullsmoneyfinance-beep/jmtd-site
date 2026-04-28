"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadSession, clearSession, load, save } from "../../lib/storage";
import { DEMO_EMPS, AMBER, PINK, NAVY, EMERALD } from "../../lib/data";

function fmt(ts) {
  return new Date(ts).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}
function duration(start, end) {
  if (!end) return "en cours";
  const diff = Math.floor((end - start) / 60000);
  return `${Math.floor(diff / 60)}h${String(diff % 60).padStart(2, "0")}`;
}

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState("sessions");
  const [sessions, setSessions] = useState([]);
  const [employees, setEmployees] = useState(DEMO_EMPS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAdmin = loadSession("jmtd_admin");
    if (!isAdmin) { router.replace("/portail"); return; }
    load("jmtd_sessions", []).then(s => { setSessions(s.sort((a, b) => b.start - a.start)); setLoading(false); });
    load("jmtd_employees", DEMO_EMPS).then(setEmployees);
  }, []);

  const logout = () => { clearSession("jmtd_admin"); router.push("/portail"); };

  const totalHours = sessions.filter(s => s.end).reduce((acc, s) => acc + (s.end - s.start) / 3600000, 0);
  const thisWeek = sessions.filter(s => s.start > Date.now() - 7 * 86400000 && s.end).length;

  if (loading) return <div style={{ minHeight: "100vh", background: "#060E18", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B" }}>Chargement…</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#060E18" }}>
      {/* Header */}
      <div style={{ background: "#0D1B2A", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${AMBER}, ${PINK})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 12, color: "#fff" }}>J&apos;MTD</div>
          <div>
            <div style={{ fontWeight: 700, color: "#F8FAFC", fontSize: 15 }}>Administration</div>
            <div style={{ fontSize: 12, color: "#475569" }}>Tableau de bord</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/admin/veille"
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, background: `linear-gradient(135deg, ${AMBER}22, ${PINK}11)`, border: `1px solid ${AMBER}44`, color: AMBER, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            🤖 Veille IA
          </Link>
          <button onClick={() => router.push("/")}
            style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#64748B", fontSize: 13, cursor: "pointer", padding: "6px 12px" }}>
            ← Site
          </button>
          <button onClick={logout}
            style={{ background: "none", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, color: "#EF4444", fontSize: 13, cursor: "pointer", padding: "6px 12px" }}>
            Déconnexion
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, padding: "24px 24px 0", maxWidth: 1200, margin: "0 auto" }}>
        {[
          { label: "Sessions totales", value: sessions.length, icon: "📋", color: AMBER },
          { label: "Heures cumulées", value: `${totalHours.toFixed(1)}h`, icon: "⏱", color: EMERALD },
          { label: "Cette semaine", value: thisWeek, icon: "📅", color: "#8B5CF6" },
          { label: "Intervenants", value: employees.length, icon: "👥", color: "#06B6D4" },
          { label: "Veille IA", value: "🤖", icon: "📡", color: PINK, link: "/admin/veille" },
        ].map(s => s.link ? (
          <Link key={s.label} href={s.link}
            style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${PINK}33`, borderRadius: 16, padding: "20px 18px", display: "block", textDecoration: "none" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "Syne, sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: s.color, fontWeight: 600, marginTop: 4 }}>{s.label} →</div>
          </Link>
        ) : (
          <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px 18px" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "Syne, sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)", maxWidth: 1200, margin: "24px auto 0", padding: "0 24px" }}>
        {[["sessions", "📋 Sessions"], ["employees", "👥 Équipe"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ padding: "12px 20px", background: "none", border: "none", borderBottom: `2px solid ${tab === id ? AMBER : "transparent"}`, color: tab === id ? AMBER : "#64748B", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 48px" }}>
        {tab === "sessions" && (
          <>
            {sessions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "64px", color: "#475569" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
                <p>Aucune session de pointage enregistrée.</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      {["Intervenant", "Début", "Fin", "Durée", "GPS entrée"].map(h => (
                        <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map(s => (
                      <tr key={s.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "12px 16px", color: "#F8FAFC", fontWeight: 600 }}>{s.empName}</td>
                        <td style={{ padding: "12px 16px", color: EMERALD }}>{fmt(s.start)}</td>
                        <td style={{ padding: "12px 16px", color: s.end ? "#EF4444" : AMBER }}>{s.end ? fmt(s.end) : "En cours"}</td>
                        <td style={{ padding: "12px 16px", color: AMBER, fontWeight: 700 }}>{duration(s.start, s.end)}</td>
                        <td style={{ padding: "12px 16px", color: "#475569", fontSize: 12 }}>
                          {s.startGps ? `${s.startGps.lat?.toFixed(4)}, ${s.startGps.lng?.toFixed(4)}` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {tab === "employees" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {employees.map(emp => {
              const empSessions = sessions.filter(s => s.empId === emp.id && s.end);
              const empHours = empSessions.reduce((acc, s) => acc + (s.end - s.start) / 3600000, 0);
              return (
                <div key={emp.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "22px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${AMBER}44, ${AMBER}22)`, border: `2px solid ${AMBER}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                      👤
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "#F8FAFC", fontSize: 15 }}>{emp.name}</div>
                      <div style={{ fontSize: 12, color: "#475569" }}>{emp.role}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <div>
                      <div style={{ color: "#475569", marginBottom: 4 }}>Zone</div>
                      <div style={{ color: "#94A3B8", fontWeight: 600 }}>{emp.zone}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: "#475569", marginBottom: 4 }}>Heures totales</div>
                      <div style={{ color: AMBER, fontWeight: 700, fontSize: 16 }}>{empHours.toFixed(1)}h</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: "#475569", marginBottom: 4 }}>Sessions</div>
                      <div style={{ color: "#F8FAFC", fontWeight: 600 }}>{empSessions.length}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

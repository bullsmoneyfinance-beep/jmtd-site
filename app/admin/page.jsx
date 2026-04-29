"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadSession, clearSession, load, save } from "../../lib/storage";
import { DEMO_EMPS, AMBER, PINK, NAVY, EMERALD, PHONE, EMAIL, ADDRESS, FONDATRICE, SIRET } from "../../lib/data";

const T = AMBER;   // teal
const P = PINK;    // rose
const C = "#0e2235"; // card bg dark

function fmt(ts) {
  return new Date(ts).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
}
function fmtDate(ts) {
  return new Date(ts).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}
function duration(start, end) {
  if (!end) return null;
  const diff = Math.floor((end - start) / 60000);
  return `${Math.floor(diff / 60)}h${String(diff % 60).padStart(2, "0")}`;
}
function exportCSV(sessions) {
  const rows = [["Intervenant", "Début", "Fin", "Durée", "GPS entrée"]];
  sessions.forEach(s => {
    rows.push([
      s.empName,
      new Date(s.start).toLocaleString("fr-FR"),
      s.end ? new Date(s.end).toLocaleString("fr-FR") : "En cours",
      duration(s.start, s.end) ?? "En cours",
      s.startGps ? `${s.startGps.lat?.toFixed(5)}, ${s.startGps.lng?.toFixed(5)}` : "-",
    ]);
  });
  const csv = rows.map(r => r.map(v => `"${v}"`).join(";")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `sessions_${Date.now()}.csv`; a.click();
  URL.revokeObjectURL(url);
}

/* ── Modal employé ── */
function EmpModal({ emp, onSave, onClose }) {
  const [form, setForm] = useState(emp || { name: "", role: "Aide ménagère", zone: "Centre", pin: "" });
  const roles = ["Aide ménagère", "Préparation repas", "Coach rangement", "Livraison courses", "Assistance admin"];
  const zones = ["Centre (Lamentin / Rivière-Salée)", "Nord Atlantique", "Nord Caraïbe", "Sud (Diamant / Saint-Esprit)", "Toute la Martinique"];
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#0D1B2A", border: `1px solid ${T}33`, borderRadius: 20, padding: "28px 32px", width: "100%", maxWidth: 440 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#F8FAFC", marginBottom: 24 }}>
          {emp ? "Modifier l'intervenant" : "Ajouter un intervenant"}
        </div>
        {[
          { label: "Nom complet", key: "name", type: "text", placeholder: "Prénom Nom" },
          { label: "Code PIN (4 chiffres)", key: "pin", type: "text", placeholder: "••••", maxLength: 4 },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94A3B8", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>{f.label}</label>
            <input type={f.type} value={form[f.key]} onChange={set(f.key)} placeholder={f.placeholder} maxLength={f.maxLength}
              style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#F8FAFC", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
          </div>
        ))}
        {[
          { label: "Rôle", key: "role", options: roles },
          { label: "Zone", key: "zone", options: zones },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94A3B8", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>{f.label}</label>
            <select value={form[f.key]} onChange={set(f.key)}
              style={{ width: "100%", padding: "11px 14px", background: "#0D1B2A", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#F8FAFC", fontSize: 14, boxSizing: "border-box", outline: "none" }}>
              {f.options.map(o => <option key={o} value={o} style={{ background: "#0D1B2A" }}>{o}</option>)}
            </select>
          </div>
        ))}
        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button onClick={onClose}
            style={{ flex: 1, padding: "11px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94A3B8", fontSize: 14, cursor: "pointer", fontWeight: 600 }}>
            Annuler
          </button>
          <button onClick={() => { if (form.name && form.pin) onSave(form); }}
            style={{ flex: 2, padding: "11px", borderRadius: 10, background: `linear-gradient(135deg, ${T}, ${P})`, border: "none", color: "#fff", fontSize: 14, cursor: "pointer", fontWeight: 700 }}>
            {emp ? "Enregistrer" : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Modal RDV ── */
function RdvModalInner({ initial, employees, services, isEdit, onSave, onClose }) {
  const [form, setForm] = useState(initial);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const T = AMBER; const P = PINK;

  const handleSave = () => {
    if (!form.clientName || !form.dateStr || !form.empId) return;
    onSave({ ...form, date: new Date(form.dateStr).getTime(), duration: Number(form.duration) });
  };

  const fieldStyle = { width: "100%", padding: "10px 13px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#F8FAFC", fontSize: 13, boxSizing: "border-box", outline: "none" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#0D1B2A", border: `1px solid ${T}33`, borderRadius: 20, padding: "28px 28px", width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#F8FAFC", marginBottom: 22 }}>
          {isEdit ? "Modifier le RDV" : "Planifier un rendez-vous"}
        </div>

        {[
          { label: "Nom du client *", key: "clientName", type: "text", placeholder: "Marie Dupont" },
          { label: "Adresse d'intervention", key: "address", type: "text", placeholder: "12 rue des Fleurs, Rivière-Salée" },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.8 }}>{f.label}</label>
            <input type={f.type} value={form[f.key]} onChange={set(f.key)} placeholder={f.placeholder} style={fieldStyle} />
          </div>
        ))}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.8 }}>Date et heure *</label>
            <input type="datetime-local" value={form.dateStr} onChange={set("dateStr")} style={{ ...fieldStyle, colorScheme: "dark" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.8 }}>Durée (min)</label>
            <input type="number" value={form.duration} onChange={set("duration")} min={30} step={30} style={fieldStyle} />
          </div>
        </div>

        {[
          { label: "Intervenant *", key: "empId", options: employees.map(e => ({ value: e.id, label: `${e.name} · ${e.role}` })) },
          { label: "Prestation", key: "service", options: services.map(s => ({ value: s, label: s })) },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.8 }}>{f.label}</label>
            <select value={form[f.key]} onChange={set(f.key)} style={{ ...fieldStyle }}>
              {f.options.map(o => <option key={o.value} value={o.value} style={{ background: "#0D1B2A" }}>{o.label}</option>)}
            </select>
          </div>
        ))}

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.8 }}>Notes pour l'intervenant</label>
          <textarea value={form.notes} onChange={set("notes")} placeholder="Instructions spécifiques, matériel à apporter…" rows={3}
            style={{ ...fieldStyle, resize: "vertical", fontFamily: "inherit" }} />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose}
            style={{ flex: 1, padding: "11px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94A3B8", fontSize: 14, cursor: "pointer", fontWeight: 600 }}>
            Annuler
          </button>
          <button onClick={handleSave}
            style={{ flex: 2, padding: "11px", borderRadius: 10, background: `linear-gradient(135deg, ${T}, ${P})`, border: "none", color: "#fff", fontSize: 14, cursor: "pointer", fontWeight: 700 }}>
            {isEdit ? "Enregistrer" : "Planifier le RDV"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Composant KPI card ── */
function KPI({ icon, label, value, sub, color, onClick, link }) {
  const inner = (
    <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${color}22`, borderRadius: 16, padding: "20px 18px", cursor: onClick || link ? "pointer" : "default", transition: "border-color 0.2s, transform 0.2s" }}
      onMouseEnter={e => { if (onClick || link) { e.currentTarget.style.borderColor = color + "66"; e.currentTarget.style.transform = "translateY(-2px)"; }}}
      onMouseLeave={e => { e.currentTarget.style.borderColor = color + "22"; e.currentTarget.style.transform = "none"; }}
      onClick={onClick}>
      <div style={{ fontSize: 26, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 30, fontWeight: 800, color, fontFamily: "sans-serif", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 6, fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: color + "aa", marginTop: 4 }}>{sub}</div>}
    </div>
  );
  return link ? <Link href={link} style={{ textDecoration: "none" }}>{inner}</Link> : inner;
}

/* ── Sidebar ── */
const TABS = [
  { id: "dashboard", icon: "📊", label: "Tableau de bord" },
  { id: "agenda",    icon: "📅", label: "Agenda" },
  { id: "sessions",  icon: "⏱️", label: "Sessions" },
  { id: "employees", icon: "👥", label: "Équipe" },
  { id: "quotes",    icon: "📨", label: "Demandes" },
  { id: "settings",  icon: "⚙️", label: "Paramètres" },
];

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState("dashboard");
  const [sessions, setSessions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sideOpen, setSideOpen] = useState(false);
  const [rdvModal, setRdvModal] = useState(null); // null | { mode: "add"|"edit", rdv? }

  /* Employee modal */
  const [empModal, setEmpModal] = useState(null); // null | { mode: "add"|"edit", emp?: {} }
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  /* Session filters */
  const [filterEmp, setFilterEmp] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const isAdmin = loadSession("jmtd_admin");
    if (!isAdmin) { router.replace("/portail"); return; }
    Promise.all([
      load("jmtd_sessions", []),
      load("jmtd_employees", DEMO_EMPS),
      load("jmtd_quotes", []),
      load("jmtd_appointments", []),
    ]).then(([s, e, q, a]) => {
      setSessions(s.sort((a, b) => b.start - a.start));
      setEmployees(e);
      setQuotes(q.sort((a, b) => b.date - a.date));
      setAppointments(a.sort((a, b) => a.date - b.date));
      setLoading(false);
    });
  }, []);

  const logout = () => { clearSession("jmtd_admin"); router.push("/portail"); };

  /* ── Stats ── */
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todaySessions = sessions.filter(s => s.start >= today.getTime());
  const weekSessions = sessions.filter(s => s.start > Date.now() - 7 * 86400000);
  const activeSessions = sessions.filter(s => !s.end);
  const totalHours = sessions.filter(s => s.end).reduce((a, s) => a + (s.end - s.start) / 3600000, 0);
  const weekHours = weekSessions.filter(s => s.end).reduce((a, s) => a + (s.end - s.start) / 3600000, 0);
  const newQuotes = quotes.filter(q => q.status === "nouveau" || !q.status).length;

  /* ── Employees CRUD ── */
  async function saveEmployee(form) {
    let updated;
    if (empModal.mode === "add") {
      updated = [...employees, { ...form, id: `e${Date.now()}` }];
    } else {
      updated = employees.map(e => e.id === empModal.emp.id ? { ...empModal.emp, ...form } : e);
    }
    setEmployees(updated);
    await save("jmtd_employees", updated);
    setEmpModal(null);
  }
  async function deleteEmployee(id) {
    const updated = employees.filter(e => e.id !== id);
    setEmployees(updated);
    await save("jmtd_employees", updated);
    setDeleteConfirm(null);
  }

  /* ── Appointments CRUD ── */
  async function saveRdv(form) {
    let updated;
    if (rdvModal.mode === "add") {
      updated = [...appointments, { ...form, id: `rdv_${Date.now()}`, status: "scheduled" }];
    } else {
      updated = appointments.map(r => r.id === rdvModal.rdv.id ? { ...rdvModal.rdv, ...form } : r);
    }
    updated.sort((a, b) => a.date - b.date);
    setAppointments(updated);
    await save("jmtd_appointments", updated);
    setRdvModal(null);
  }
  async function deleteRdv(id) {
    const updated = appointments.filter(r => r.id !== id);
    setAppointments(updated);
    await save("jmtd_appointments", updated);
  }
  async function setRdvStatus(id, status) {
    const updated = appointments.map(r => r.id === id ? { ...r, status } : r);
    setAppointments(updated);
    await save("jmtd_appointments", updated);
  }

  /* ── Quote status ── */
  async function setQuoteStatus(id, status) {
    const updated = quotes.map(q => q.id === id ? { ...q, status } : q);
    setQuotes(updated);
    await save("jmtd_quotes", updated);
  }

  /* ── Search ── */
  const [searchQuery, setSearchQuery] = useState("");

  /* ── Filtered sessions ── */
  const filteredSessions = sessions.filter(s => {
    if (filterEmp !== "all" && s.empId !== filterEmp) return false;
    if (filterStatus === "done" && !s.end) return false;
    if (filterStatus === "active" && s.end) return false;
    if (searchQuery && !s.empName?.toLowerCase().includes(searchQuery.toLowerCase()) && !s.clientName?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  /* ── Weekly chart data ── */
  const weeklyData = (() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate() - i);
      const next = new Date(d); next.setDate(next.getDate() + 1);
      const daySessions = sessions.filter(s => s.start >= d.getTime() && s.start < next.getTime() && s.end);
      const hours = daySessions.reduce((a, s) => a + (s.end - s.start) / 3600000, 0);
      days.push({ label: d.toLocaleDateString("fr-FR", { weekday: "short" }), hours: Math.round(hours * 10) / 10, count: daySessions.length });
    }
    return days;
  })();

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#060E18", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: `3px solid ${T}33`, borderTopColor: T, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <div style={{ color: "#475569", fontSize: 14 }}>Chargement…</div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const inputStyle = {
    padding: "9px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8, color: "#F8FAFC", fontSize: 13, outline: "none",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060E18", display: "flex" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: none; } }
        .admin-nav-item:hover { background: rgba(13,169,164,0.08) !important; }
        .admin-row:hover td { background: rgba(255,255,255,0.02); }
        select option { background: #0D1B2A; color: #F8FAFC; }
      `}</style>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 230, flexShrink: 0, background: "#0B1523", borderRight: "1px solid rgba(255,255,255,0.05)",
        display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", overflowY: "auto",
      }}>
        {/* Logo */}
        <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <svg viewBox="0 0 200 110" width={120} height={66} style={{ display: "block", overflow: "visible" }}>
            <text x="2" y="64" fontFamily="'Dancing Script', cursive" fontWeight="700" fontSize="58" fill="#D4197A" letterSpacing="-1">J&apos;m</text>
            <text x="68" y="107" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="92" fill="#0DA9A4" letterSpacing="-3">TD</text>
          </svg>
          <div style={{ fontSize: 10, color: "#475569", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>Administration</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className="admin-nav-item"
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 10, border: "none", background: tab === t.id ? `${T}15` : "none", borderLeft: tab === t.id ? `3px solid ${T}` : "3px solid transparent", color: tab === t.id ? T : "#64748B", fontSize: 14, fontWeight: tab === t.id ? 600 : 500, cursor: "pointer", marginBottom: 2, textAlign: "left", transition: "all 0.15s" }}>
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              {t.label}
              {t.id === "quotes" && newQuotes > 0 && (
                <span style={{ marginLeft: "auto", background: P, color: "#fff", borderRadius: 20, fontSize: 10, fontWeight: 700, padding: "2px 7px", minWidth: 18, textAlign: "center" }}>{newQuotes}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div style={{ padding: "12px 12px 20px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", gap: 6 }}>
          <Link href="/admin/veille"
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: `linear-gradient(135deg, ${T}15, ${P}08)`, border: `1px solid ${T}22`, color: T, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            🤖 Veille IA
          </Link>
          <Link href="/pointage"
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "#94A3B8", fontSize: 13, textDecoration: "none" }}>
            ⏱️ Pointage
          </Link>
          <Link href="/"
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "#94A3B8", fontSize: 13, textDecoration: "none" }}>
            🌐 Site public
          </Link>
          <button onClick={logout}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
            ⬅ Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, overflowY: "auto", padding: "32px 32px 64px", minWidth: 0 }}>

        {/* ═══ DASHBOARD ═══ */}
        {tab === "dashboard" && (
          <div style={{ animation: "slideIn 0.25s ease" }}>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: "#F8FAFC", margin: 0 }}>Tableau de bord</h1>
              <p style={{ fontSize: 14, color: "#475569", marginTop: 6 }}>{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
            </div>

            {/* KPIs row 1 */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, marginBottom: 24 }}>
              <KPI icon="📋" label="Sessions aujourd'hui" value={todaySessions.length} color={T} />
              <KPI icon="⏱️" label="Heures cette semaine" value={`${weekHours.toFixed(1)}h`} color={EMERALD} />
              <KPI icon="🔴" label="En cours" value={activeSessions.length} color={activeSessions.length > 0 ? "#EF4444" : "#475569"} sub={activeSessions.length > 0 ? activeSessions.map(s => s.empName).join(", ") : "Personne"} />
              <KPI icon="👥" label="Intervenants" value={employees.length} color="#8B5CF6" onClick={() => setTab("employees")} />
              <KPI icon="📨" label="Nouvelles demandes" value={newQuotes} color={P} onClick={() => setTab("quotes")} />
            </div>

            {/* Quick stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "22px 24px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Répartition par intervenant</div>
                {employees.map(emp => {
                  const h = sessions.filter(s => s.empId === emp.id && s.end).reduce((a, s) => a + (s.end - s.start) / 3600000, 0);
                  const pct = totalHours > 0 ? (h / totalHours) * 100 : 0;
                  return (
                    <div key={emp.id} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                        <span style={{ color: "#F8FAFC", fontWeight: 600 }}>{emp.name}</span>
                        <span style={{ color: T, fontWeight: 700 }}>{h.toFixed(1)}h</span>
                      </div>
                      <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 10 }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${T}, ${P})`, borderRadius: 10, transition: "width 0.5s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "22px 24px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Actions rapides</div>
                {[
                  { icon: "➕", label: "Ajouter un intervenant", action: () => { setEmpModal({ mode: "add" }); setTab("employees"); }, color: T },
                  { icon: "⏱️", label: "Voir les sessions en cours", action: () => { setFilterStatus("active"); setTab("sessions"); }, color: EMERALD },
                  { icon: "📄", label: "Exporter les sessions CSV", action: () => exportCSV(sessions), color: "#8B5CF6" },
                  { icon: "🤖", label: "Ouvrir la Veille IA", action: null, link: "/admin/veille", color: "#F59E0B" },
                ].map(item => item.link ? (
                  <Link key={item.label} href={item.link}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, background: `${item.color}0a`, border: `1px solid ${item.color}20`, marginBottom: 8, cursor: "pointer", textDecoration: "none" }}>
                    <span style={{ fontSize: 18, width: 28, textAlign: "center" }}>{item.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: item.color }}>{item.label}</span>
                  </Link>
                ) : (
                  <button key={item.label} onClick={item.action}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, background: `${item.color}0a`, border: `1px solid ${item.color}20`, marginBottom: 8, cursor: "pointer" }}>
                    <span style={{ fontSize: 18, width: 28, textAlign: "center" }}>{item.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: item.color }}>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Weekly chart */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "22px 24px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1 }}>Activité — 7 derniers jours</div>
                <div style={{ fontSize: 12, color: "#475569" }}>{weeklyData.reduce((a, d) => a + d.hours, 0).toFixed(1)}h total</div>
              </div>
              {(() => {
                const maxH = Math.max(...weeklyData.map(d => d.hours), 1);
                return (
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 100 }}>
                    {weeklyData.map((d, i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                        <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                          <div title={`${d.hours}h · ${d.count} session${d.count !== 1 ? "s" : ""}`}
                            style={{ width: "100%", height: `${Math.max((d.hours / maxH) * 100, d.hours > 0 ? 6 : 0)}%`, background: d.hours > 0 ? `linear-gradient(to top, ${T}, ${T}99)` : "rgba(255,255,255,0.05)", borderRadius: "4px 4px 0 0", transition: "height 0.6s ease", cursor: "default", minHeight: d.hours > 0 ? 4 : 0 }} />
                        </div>
                        <div style={{ fontSize: 10, color: "#475569", textTransform: "capitalize" }}>{d.label}</div>
                        {d.hours > 0 && <div style={{ fontSize: 10, color: T, fontWeight: 700 }}>{d.hours}h</div>}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Recent sessions */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "22px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1 }}>Dernières sessions</div>
                <button onClick={() => setTab("sessions")} style={{ background: "none", border: "none", color: T, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Tout voir →</button>
              </div>
              {sessions.slice(0, 5).map(s => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: s.end ? `${T}15` : `rgba(239,68,68,0.15)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                      {s.end ? "✅" : "🔴"}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#F8FAFC" }}>{s.empName}</div>
                      <div style={{ fontSize: 12, color: "#475569" }}>{fmt(s.start)}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: s.end ? T : "#EF4444" }}>{s.end ? duration(s.start, s.end) : "En cours"}</div>
                  </div>
                </div>
              ))}
              {sessions.length === 0 && (
                <div style={{ textAlign: "center", padding: "32px", color: "#475569" }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>📋</div>
                  <div>Aucune session enregistrée</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ AGENDA ═══ */}
        {tab === "agenda" && (() => {
          const now = Date.now();
          const todayStart = new Date(); todayStart.setHours(0,0,0,0);
          const todayRdv = appointments.filter(r => r.date >= todayStart.getTime() && r.date < todayStart.getTime() + 86400000);
          const upcomingRdv = appointments.filter(r => r.date >= todayStart.getTime() + 86400000);
          const pastRdv = appointments.filter(r => r.date < todayStart.getTime()).slice(-5).reverse();

          const statusColor = s => s === "done" ? EMERALD : s === "in-progress" ? T : s === "cancelled" ? "#EF4444" : P;
          const statusLabel = s => s === "done" ? "Terminé" : s === "in-progress" ? "En cours" : s === "cancelled" ? "Annulé" : "Planifié";

          return (
            <div style={{ animation: "slideIn 0.25s ease" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <h1 style={{ fontSize: 22, fontWeight: 800, color: "#F8FAFC", margin: 0 }}>Agenda des interventions</h1>
                  <p style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>{appointments.length} RDV au total · {todayRdv.length} aujourd&apos;hui</p>
                </div>
                <button onClick={() => setRdvModal({ mode: "add" })}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10, background: `linear-gradient(135deg, ${T}, ${P})`, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  ➕ Planifier un RDV
                </button>
              </div>

              {/* Aujourd'hui */}
              {todayRdv.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Aujourd&apos;hui</div>
                  {todayRdv.map(rdv => {
                    const emp = employees.find(e => e.id === rdv.empId);
                    return (
                      <div key={rdv.id} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${statusColor(rdv.status)}22`, borderRadius: 14, padding: "18px 20px", marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                              <span style={{ fontSize: 15, fontWeight: 700, color: "#F8FAFC" }}>{rdv.clientName}</span>
                              <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: statusColor(rdv.status) + "18", color: statusColor(rdv.status) }}>{statusLabel(rdv.status)}</span>
                            </div>
                            <div style={{ fontSize: 13, color: T, fontWeight: 600, marginBottom: 4 }}>{rdv.service}</div>
                            <div style={{ fontSize: 13, color: "#64748B" }}>
                              ⏰ {new Date(rdv.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                              {rdv.duration ? ` (${rdv.duration} min)` : ""}
                              {emp ? ` · 👤 ${emp.name}` : ""}
                            </div>
                            {rdv.address && <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>📍 {rdv.address}</div>}
                            {rdv.notes && <div style={{ fontSize: 12, color: "#475569", marginTop: 4, fontStyle: "italic" }}>📝 {rdv.notes}</div>}
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                            <select value={rdv.status} onChange={e => setRdvStatus(rdv.id, e.target.value)}
                              style={{ padding: "6px 10px", background: "#0D1B2A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#94A3B8", fontSize: 12, cursor: "pointer" }}>
                              <option value="scheduled">Planifié</option>
                              <option value="in-progress">En cours</option>
                              <option value="done">Terminé</option>
                              <option value="cancelled">Annulé</option>
                            </select>
                            <button onClick={() => setRdvModal({ mode: "edit", rdv })}
                              style={{ padding: "6px 10px", borderRadius: 8, background: `${T}10`, border: `1px solid ${T}22`, color: T, fontSize: 12, cursor: "pointer" }}>
                              ✏️ Modifier
                            </button>
                            <button onClick={() => deleteRdv(rdv.id)}
                              style={{ padding: "6px 10px", borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444", fontSize: 12, cursor: "pointer" }}>
                              🗑
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* À venir */}
              {upcomingRdv.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>À venir</div>
                  {upcomingRdv.map(rdv => {
                    const emp = employees.find(e => e.id === rdv.empId);
                    return (
                      <div key={rdv.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "16px 20px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC" }}>{rdv.clientName}</span>
                            <span style={{ fontSize: 12, color: T, fontWeight: 600 }}>{rdv.service}</span>
                          </div>
                          <div style={{ fontSize: 12, color: "#475569" }}>
                            📅 {new Date(rdv.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
                            {" · "}⏰ {new Date(rdv.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                            {emp ? ` · 👤 ${emp.name}` : ""}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => setRdvModal({ mode: "edit", rdv })}
                            style={{ padding: "6px 12px", borderRadius: 8, background: `${T}10`, border: `1px solid ${T}22`, color: T, fontSize: 12, cursor: "pointer" }}>✏️</button>
                          <button onClick={() => deleteRdv(rdv.id)}
                            style={{ padding: "6px 10px", borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444", fontSize: 12, cursor: "pointer" }}>🗑</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {appointments.length === 0 && (
                <div style={{ textAlign: "center", padding: "80px 32px", color: "#475569" }}>
                  <div style={{ fontSize: 52, marginBottom: 16 }}>📅</div>
                  <p style={{ fontSize: 15 }}>Aucun rendez-vous planifié.</p>
                  <button onClick={() => setRdvModal({ mode: "add" })} style={{ marginTop: 16, padding: "10px 24px", borderRadius: 10, background: T, border: "none", color: "#fff", cursor: "pointer", fontWeight: 700 }}>
                    Créer le premier RDV
                  </button>
                </div>
              )}
            </div>
          );
        })()}

        {/* ═══ SESSIONS ═══ */}
        {tab === "sessions" && (
          <div style={{ animation: "slideIn 0.25s ease" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#F8FAFC", margin: 0 }}>Sessions de pointage</h1>
              <button onClick={() => exportCSV(filteredSessions)}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10, background: `${T}15`, border: `1px solid ${T}33`, color: T, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                ⬇ Exporter CSV
              </button>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              <div style={{ position: "relative", flex: "2 1 200px" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#475569" }}>🔍</span>
                <input className="admin-search" placeholder="Rechercher intervenant ou client…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              <select value={filterEmp} onChange={e => setFilterEmp(e.target.value)} style={{ ...inputStyle, flex: "1 1 160px" }}>
                <option value="all">Tous les intervenants</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...inputStyle, flex: "1 1 130px" }}>
                <option value="all">Tous les statuts</option>
                <option value="done">Terminées</option>
                <option value="active">En cours</option>
              </select>
              <div style={{ display: "flex", alignItems: "center", fontSize: 13, color: "#475569", flexShrink: 0 }}>
                {filteredSessions.length} résultat{filteredSessions.length !== 1 ? "s" : ""}
              </div>
            </div>

            {filteredSessions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 32px", color: "#475569" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                <p style={{ fontSize: 15 }}>Aucune session ne correspond à ces filtres.</p>
              </div>
            ) : (
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      {["Intervenant", "Date", "Début", "Fin", "Durée", "GPS", "Statut"].map(h => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSessions.map(s => (
                      <tr key={s.id} className="admin-row" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ fontWeight: 600, color: "#F8FAFC" }}>{s.empName}</div>
                          <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{employees.find(e => e.id === s.empId)?.role}</div>
                        </td>
                        <td style={{ padding: "12px 16px", color: "#94A3B8" }}>{fmtDate(s.start)}</td>
                        <td style={{ padding: "12px 16px", color: EMERALD, fontWeight: 600 }}>
                          {new Date(s.start).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td style={{ padding: "12px 16px", color: s.end ? "#EF4444" : "#F59E0B", fontWeight: 600 }}>
                          {s.end ? new Date(s.end).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "—"}
                        </td>
                        <td style={{ padding: "12px 16px", color: T, fontWeight: 700 }}>
                          {s.end ? duration(s.start, s.end) : <span style={{ color: "#F59E0B" }}>En cours</span>}
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 11, color: "#475569" }}>
                          {s.startGps
                            ? <a href={`https://maps.google.com/?q=${s.startGps.lat},${s.startGps.lng}`} target="_blank" rel="noopener noreferrer" style={{ color: T, textDecoration: "none" }}>📍 Voir carte</a>
                            : "—"}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: s.end ? `${EMERALD}15` : "rgba(239,68,68,0.15)", color: s.end ? EMERALD : "#EF4444" }}>
                            {s.end ? "Terminée" : "En cours"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ═══ ÉQUIPE ═══ */}
        {tab === "employees" && (
          <div style={{ animation: "slideIn 0.25s ease" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#F8FAFC", margin: 0 }}>Équipe — {employees.length} intervenant{employees.length !== 1 ? "s" : ""}</h1>
              <button onClick={() => setEmpModal({ mode: "add" })}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10, background: `linear-gradient(135deg, ${T}, ${P})`, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                ➕ Ajouter
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {employees.map(emp => {
                const empSessions = sessions.filter(s => s.empId === emp.id);
                const done = empSessions.filter(s => s.end);
                const empHours = done.reduce((a, s) => a + (s.end - s.start) / 3600000, 0);
                const isActive = sessions.some(s => s.empId === emp.id && !s.end);

                return (
                  <div key={emp.id} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${isActive ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 18, padding: "22px 20px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg, ${T}30, ${P}20)`, border: `2px solid ${T}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, position: "relative" }}>
                          👤
                          {isActive && <div style={{ position: "absolute", bottom: 0, right: 0, width: 12, height: 12, background: "#EF4444", borderRadius: "50%", border: "2px solid #060E18" }} />}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: "#F8FAFC", fontSize: 15 }}>{emp.name}</div>
                          <div style={{ fontSize: 12, color: "#475569" }}>{emp.role}</div>
                          <div style={{ fontSize: 11, color: "#64748B" }}>{emp.zone}</div>
                        </div>
                      </div>
                      {isActive && (
                        <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: "rgba(239,68,68,0.15)", color: "#EF4444" }}>
                          🔴 En cours
                        </span>
                      )}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                      {[
                        { label: "Sessions", value: done.length },
                        { label: "Heures", value: `${empHours.toFixed(1)}h` },
                        { label: "PIN", value: "••••" },
                      ].map(stat => (
                        <div key={stat.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: T }}>{stat.value}</div>
                          <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setEmpModal({ mode: "edit", emp })}
                        style={{ flex: 1, padding: "8px", borderRadius: 8, background: `${T}12`, border: `1px solid ${T}33`, color: T, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        ✏️ Modifier
                      </button>
                      <button onClick={() => setDeleteConfirm(emp)}
                        style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444", fontSize: 12, cursor: "pointer" }}>
                        🗑
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {employees.length === 0 && (
              <div style={{ textAlign: "center", padding: "80px", color: "#475569" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
                <p>Aucun intervenant enregistré.</p>
                <button onClick={() => setEmpModal({ mode: "add" })} style={{ marginTop: 12, padding: "10px 24px", borderRadius: 10, background: T, border: "none", color: "#fff", cursor: "pointer", fontWeight: 700 }}>Ajouter</button>
              </div>
            )}
          </div>
        )}

        {/* ═══ DEMANDES (QUOTES) ═══ */}
        {tab === "quotes" && (
          <div style={{ animation: "slideIn 0.25s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#F8FAFC", margin: 0 }}>Demandes de contact</h1>
              <p style={{ fontSize: 13, color: "#475569", marginTop: 6 }}>Formulaires reçus depuis le site</p>
            </div>

            {quotes.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px", color: "#475569" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📨</div>
                <p>Aucune demande reçue pour l&apos;instant.</p>
                <p style={{ fontSize: 12, marginTop: 8 }}>Les formulaires soumis via la page Contact apparaîtront ici.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {quotes.map(q => (
                  <div key={q.id} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${(!q.status || q.status === "nouveau") ? `${P}33` : "rgba(255,255,255,0.07)"}`, borderRadius: 16, padding: "20px 22px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC" }}>{q.name}</div>
                          <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                            background: (!q.status || q.status === "nouveau") ? `${P}15` : q.status === "traité" ? `${EMERALD}15` : "rgba(255,255,255,0.06)",
                            color: (!q.status || q.status === "nouveau") ? P : q.status === "traité" ? EMERALD : "#64748B" }}>
                            {(!q.status || q.status === "nouveau") ? "Nouveau" : q.status === "traité" ? "Traité" : "Archivé"}
                          </span>
                        </div>
                        <div style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>
                          📞 {q.phone}  ·  ✉️ {q.email}
                        </div>
                        {q.service && <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>Service : <strong style={{ color: T }}>{q.service}</strong></div>}
                        {q.message && (
                          <div style={{ fontSize: 13, color: "#94A3B8", background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "10px 12px", marginTop: 8, lineHeight: 1.6 }}>
                            {q.message}
                          </div>
                        )}
                        <div style={{ fontSize: 11, color: "#475569", marginTop: 10 }}>
                          {q.date ? fmtDate(q.date) : "Date inconnue"}
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                        <a href={`tel:${q.phone?.replace(/\s/g, "")}`}
                          style={{ padding: "8px 14px", borderRadius: 8, background: `${T}12`, border: `1px solid ${T}33`, color: T, fontSize: 12, fontWeight: 600, textDecoration: "none", textAlign: "center" }}>
                          📞 Appeler
                        </a>
                        <a href={`mailto:${q.email}`}
                          style={{ padding: "8px 14px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#94A3B8", fontSize: 12, textDecoration: "none", textAlign: "center" }}>
                          ✉️ Email
                        </a>
                        <select value={q.status || "nouveau"} onChange={e => setQuoteStatus(q.id, e.target.value)}
                          style={{ padding: "7px 10px", background: "#0D1B2A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#94A3B8", fontSize: 12, cursor: "pointer" }}>
                          <option value="nouveau">Nouveau</option>
                          <option value="traité">Traité</option>
                          <option value="archivé">Archivé</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ PARAMÈTRES ═══ */}
        {tab === "settings" && (
          <div style={{ animation: "slideIn 0.25s ease", maxWidth: 660 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#F8FAFC", marginBottom: 28 }}>Paramètres</h1>

            {/* Company info */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "24px", marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Informations entreprise</div>
              {[
                { label: "Fondatrice", value: FONDATRICE },
                { label: "SIRET", value: SIRET },
                { label: "Téléphone", value: PHONE },
                { label: "Email", value: EMAIL },
                { label: "Adresse", value: ADDRESS },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "10px 0" }}>
                  <div style={{ width: 140, fontSize: 13, color: "#475569", flexShrink: 0 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: "#F8FAFC", fontWeight: 500 }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Tarification */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "24px", marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Rappel tarification</div>
              {[
                { label: "Aide ménagère", value: "Selon devis" },
                { label: "Coach rangement — Diagnostic", value: "Gratuit" },
                { label: "Coach rangement — 1 pièce", value: "Demi-journée" },
                { label: "Coach rangement — Maison entière", value: "Journée complète" },
                { label: "Crédit d'impôt SAP", value: "50% du coût" },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "10px 0" }}>
                  <div style={{ fontSize: 13, color: "#94A3B8" }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: T, fontWeight: 600 }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Accès admin */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "24px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Accès & sécurité</div>
              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.8 }}>
                <div>• Mot de passe admin : défini dans <code style={{ background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: 4, color: T }}>/portail</code></div>
                <div>• Sessions employés : gestion des PINs dans l&apos;onglet Équipe</div>
                <div>• Données stockées localement (localStorage + sessionStorage)</div>
              </div>
              <button onClick={logout}
                style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 10, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#EF4444", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                ⬅ Se déconnecter
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ── Modals ── */}
      {empModal && (
        <EmpModal
          emp={empModal.mode === "edit" ? empModal.emp : null}
          onSave={saveEmployee}
          onClose={() => setEmpModal(null)}
        />
      )}

      {/* ── Modal RDV ── */}
      {rdvModal && (() => {
        const initial = rdvModal.rdv ? {
          empId: rdvModal.rdv.empId || "",
          clientName: rdvModal.rdv.clientName || "",
          service: rdvModal.rdv.service || "",
          address: rdvModal.rdv.address || "",
          dateStr: rdvModal.rdv.date ? new Date(rdvModal.rdv.date).toISOString().slice(0,16) : "",
          duration: rdvModal.rdv.duration || 120,
          notes: rdvModal.rdv.notes || "",
        } : { empId: employees[0]?.id || "", clientName: "", service: "Entretien & Nettoyage", address: "", dateStr: "", duration: 120, notes: "" };

        const SERVICES_LIST = ["Entretien & Nettoyage", "Préparation des repas", "Livraison de courses", "Assistance administrative", "Coach en rangement"];

        return (
          <RdvModalInner
            key={rdvModal.rdv?.id || "new"}
            initial={initial}
            employees={employees}
            services={SERVICES_LIST}
            isEdit={rdvModal.mode === "edit"}
            onSave={saveRdv}
            onClose={() => setRdvModal(null)}
          />
        );
      })()}

      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
          onClick={e => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div style={{ background: "#0D1B2A", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 20, padding: "28px 32px", maxWidth: 380, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🗑️</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#F8FAFC", marginBottom: 8 }}>Supprimer {deleteConfirm.name} ?</div>
            <p style={{ fontSize: 13, color: "#64748B", marginBottom: 24 }}>Cette action est irréversible. Les sessions liées seront conservées.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)}
                style={{ flex: 1, padding: "11px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94A3B8", cursor: "pointer", fontWeight: 600 }}>
                Annuler
              </button>
              <button onClick={() => deleteEmployee(deleteConfirm.id)}
                style={{ flex: 1, padding: "11px", borderRadius: 10, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.35)", color: "#EF4444", cursor: "pointer", fontWeight: 700 }}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

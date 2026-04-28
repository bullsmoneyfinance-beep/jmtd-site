"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DEMO_EMPS, AMBER, PINK, NAVY } from "../../lib/data";
import { saveSession } from "../../lib/storage";

const ADMIN_PIN = "0000";

export default function PortailPage() {
  const router = useRouter();
  const [mode, setMode] = useState(null); // "employee" | "admin"
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));

    if (mode === "admin") {
      if (pin === ADMIN_PIN) {
        saveSession("jmtd_admin", true);
        router.push("/admin");
      } else {
        setError("Code administrateur incorrect.");
      }
    } else {
      const emp = DEMO_EMPS.find(e => e.pin === pin);
      if (emp) {
        saveSession("jmtd_emp", emp);
        router.push("/pointage");
      } else {
        setError("Code PIN introuvable. Contactez votre responsable.");
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060E18", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, background: `linear-gradient(135deg, ${AMBER}, ${PINK})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 16, color: NAVY }}>
              J&apos;MTD
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18, color: "#F8FAFC" }}>J&apos;MTD</div>
              <div style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: 1 }}>Espace équipe</div>
            </div>
          </div>
          <p style={{ fontSize: 14, color: "#475569" }}>🔐 Accès réservé au personnel</p>
        </div>

        {!mode ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <button onClick={() => setMode("employee")}
              style={{ padding: "20px 24px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${AMBER}44`; e.currentTarget.style.background = "rgba(245,158,11,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>👤</div>
              <div style={{ fontWeight: 700, color: "#F8FAFC", fontSize: 16, marginBottom: 4 }}>Espace intervenant</div>
              <div style={{ fontSize: 13, color: "#64748B" }}>Pointage GPS · Saisir mes heures</div>
            </button>

            <button onClick={() => setMode("admin")}
              style={{ padding: "20px 24px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${AMBER}44`; e.currentTarget.style.background = "rgba(245,158,11,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>⚙️</div>
              <div style={{ fontWeight: 700, color: "#F8FAFC", fontSize: 16, marginBottom: 4 }}>Espace administrateur</div>
              <div style={{ fontSize: 13, color: "#64748B" }}>Tableau de bord · Gestion équipe</div>
            </button>

            <div style={{ textAlign: "center", marginTop: 8 }}>
              <button onClick={() => router.push("/")}
                style={{ background: "none", border: "none", color: "#475569", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>
                ← Retour au site
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "32px 28px" }}>
            <button type="button" onClick={() => { setMode(null); setPin(""); setError(""); }}
              style={{ background: "none", border: "none", color: "#64748B", fontSize: 13, cursor: "pointer", marginBottom: 20, padding: 0 }}>
              ← Retour
            </button>

            <div style={{ fontSize: 28, marginBottom: 12 }}>{mode === "admin" ? "⚙️" : "👤"}</div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 800, color: "#F8FAFC", marginBottom: 6 }}>
              {mode === "admin" ? "Espace administrateur" : "Espace intervenant"}
            </h2>
            <p style={{ fontSize: 13, color: "#64748B", marginBottom: 24 }}>
              {mode === "admin" ? "Entrez votre code administrateur" : "Entrez votre code PIN personnel"}
            </p>

            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              className="form-input"
              placeholder="••••"
              value={pin}
              onChange={e => setPin(e.target.value.replace(/\D/g, ""))}
              autoFocus
              required
              style={{ textAlign: "center", fontSize: 24, letterSpacing: 8, marginBottom: 16 }}
            />

            {error && <div style={{ fontSize: 13, color: "#EF4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>{error}</div>}

            <button type="submit" disabled={loading || pin.length < 4} className="btn-amber"
              style={{ width: "100%", padding: 14, borderRadius: 30, fontSize: 16, cursor: loading ? "wait" : "pointer", opacity: pin.length < 4 ? 0.5 : 1 }}>
              {loading ? "Connexion…" : "Se connecter →"}
            </button>

            {mode === "employee" && (
              <p style={{ fontSize: 11, color: "#334155", textAlign: "center", marginTop: 16 }}>
                Vous n&apos;avez pas de code PIN ? Contactez votre responsable.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

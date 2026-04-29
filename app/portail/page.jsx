"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { load, saveSession } from "../../lib/storage";
import { DEMO_EMPS, AMBER, PINK } from "../../lib/data";

const T = AMBER;   // #0DA9A4
const P = PINK;    // #D4197A
const ADMIN_PIN = "0000";

/* ── Pavé numérique natif ── */
function NumPad({ value, onChange, maxLen = 4 }) {
  const keys = ["1","2","3","4","5","6","7","8","9","","0","⌫"];
  const tap = k => {
    if (k === "⌫") { onChange(value.slice(0, -1)); return; }
    if (!k) return;
    if (value.length < maxLen) onChange(value + k);
  };
  return (
    <div style={{ userSelect: "none" }}>
      {/* Dots affichage */}
      <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 28 }}>
        {Array.from({ length: maxLen }).map((_, i) => (
          <div key={i} style={{ width: 16, height: 16, borderRadius: "50%", transition: "all 0.15s cubic-bezier(0.34,1.56,0.64,1)", background: i < value.length ? T : "rgba(255,255,255,0.1)", transform: i < value.length ? "scale(1.2)" : "scale(1)", boxShadow: i < value.length ? `0 0 12px ${T}66` : "none" }} />
        ))}
      </div>
      {/* Touches */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, maxWidth: 280, margin: "0 auto" }}>
        {keys.map((k, i) => (
          <button key={i} onClick={() => tap(k)} disabled={!k && k !== "0"}
            style={{ height: 64, borderRadius: 16, background: k === "⌫" ? "rgba(239,68,68,0.08)" : k === "" ? "transparent" : "rgba(255,255,255,0.07)", border: k === "" ? "none" : `1px solid ${k === "⌫" ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.09)"}`, color: k === "⌫" ? "#EF4444" : "#F8FAFC", fontSize: k === "⌫" ? 20 : 22, fontWeight: 600, cursor: k === "" ? "default" : "pointer", transition: "all 0.1s", WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
            onMouseDown={e => { if (k && k !== "") e.currentTarget.style.background = k === "⌫" ? "rgba(239,68,68,0.18)" : "rgba(255,255,255,0.14)"; }}
            onMouseUp={e => { e.currentTarget.style.background = k === "⌫" ? "rgba(239,68,68,0.08)" : k === "" ? "transparent" : "rgba(255,255,255,0.07)"; }}>
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PortailPage() {
  const router = useRouter();
  const [mode, setMode] = useState(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState(DEMO_EMPS);

  useEffect(() => { load("jmtd_employees", DEMO_EMPS).then(setEmployees); }, []);

  /* Auto-submit quand PIN complet */
  useEffect(() => {
    if (pin.length === (mode === "admin" ? 4 : 4)) {
      setTimeout(() => handleLoginWithPin(pin), 150);
    }
  }, [pin]);

  const handleLoginWithPin = async (currentPin) => {
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 350));
    if (mode === "admin") {
      if (currentPin === ADMIN_PIN) {
        saveSession("jmtd_admin", true);
        router.push("/admin");
      } else {
        setError("Code administrateur incorrect.");
        setPin("");
      }
    } else {
      const emp = employees.find(e => e.pin === currentPin);
      if (emp) {
        saveSession("jmtd_emp", emp);
        router.push("/pointage");
      } else {
        setError("Code PIN introuvable. Contactez votre responsable.");
        setPin("");
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", minHeight: "100dvh", background: "#060E18", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 20px", paddingTop: "max(24px, env(safe-area-inset-top))", paddingBottom: "max(24px, env(safe-area-inset-bottom))", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes orbFloat { 0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-30px) scale(1.06)} }
        @keyframes shake { 0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)} }
        .pin-error { animation: shake 0.4s ease; }
      `}</style>

      {/* Orbs */}
      <div style={{ position: "absolute", top: -100, right: -80, width: 360, height: 360, borderRadius: "50%", background: `radial-gradient(circle, ${T}22, transparent 70%)`, animation: "orbFloat 12s ease-in-out infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -80, left: -60, width: 280, height: 280, borderRadius: "50%", background: `radial-gradient(circle, ${P}18, transparent 70%)`, animation: "orbFloat 15s ease-in-out infinite reverse", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 400, position: "relative", zIndex: 1 }}>

        {/* Logo + titre */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <svg viewBox="0 0 200 110" width={110} height={61} style={{ display: "block", margin: "0 auto 12px", overflow: "visible" }}>
            <text x="2" y="64" fontFamily="'Dancing Script', cursive" fontWeight="700" fontSize="58" fill="#D4197A" letterSpacing="-1">J&apos;m</text>
            <text x="68" y="107" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="92" fill="#0DA9A4" letterSpacing="-3">TD</text>
          </svg>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 1.5 }}>
            🔐 Espace équipe
          </div>
        </div>

        {/* Sélection mode */}
        {!mode && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ textAlign: "center", fontSize: 15, color: "#64748B", marginBottom: 8 }}>
              Comment souhaitez-vous vous connecter ?
            </p>

            {[
              { id: "employee", icon: "👤", label: "Espace intervenant", sub: "Pointage GPS · Agenda · Historique", color: T, gradient: `linear-gradient(135deg, ${T}22, ${T}08)`, border: `${T}33` },
              { id: "admin",    icon: "⚙️", label: "Administration",     sub: "Tableau de bord · Gestion équipe", color: P, gradient: `linear-gradient(135deg, ${P}18, ${P}08)`, border: `${P}33` },
            ].map(item => (
              <button key={item.id} onClick={() => { setMode(item.id); setPin(""); setError(""); }}
                style={{ padding: "22px 20px", background: item.gradient, border: `1.5px solid ${item.border}`, borderRadius: 20, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 18, transition: "transform 0.15s, box-shadow 0.15s", WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
                onMouseDown={e => { e.currentTarget.style.transform = "scale(0.98)"; }}
                onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}>
                <div style={{ width: 54, height: 54, borderRadius: 16, background: `${item.color}22`, border: `2px solid ${item.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: "#F8FAFC", fontSize: 16, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: "#64748B" }}>{item.sub}</div>
                </div>
                <div style={{ fontSize: 18, color: item.color }}>›</div>
              </button>
            ))}

            <button onClick={() => router.push("/")}
              style={{ background: "none", border: "none", color: "#475569", fontSize: 13, cursor: "pointer", padding: "12px", marginTop: 4, WebkitTapHighlightColor: "transparent" }}>
              ← Retour au site
            </button>
          </div>
        )}

        {/* Pavé PIN */}
        {mode && (
          <div>
            {/* Back */}
            <button onClick={() => { setMode(null); setPin(""); setError(""); }}
              style={{ background: "none", border: "none", color: "#64748B", fontSize: 14, cursor: "pointer", marginBottom: 24, padding: "8px 0", display: "flex", alignItems: "center", gap: 6, WebkitTapHighlightColor: "transparent" }}>
              ← Retour
            </button>

            {/* Card */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "28px 24px" }}>
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>{mode === "admin" ? "⚙️" : "👤"}</div>
                <div style={{ fontSize: 19, fontWeight: 700, color: "#F8FAFC", marginBottom: 6 }}>
                  {mode === "admin" ? "Code administrateur" : "Votre code PIN"}
                </div>
                <div style={{ fontSize: 13, color: "#64748B" }}>
                  {mode === "admin" ? "4 chiffres" : "Code à 4 chiffres — fourni par votre responsable"}
                </div>
              </div>

              {loading ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ width: 40, height: 40, border: `3px solid ${T}33`, borderTopColor: T, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
                  <div style={{ fontSize: 14, color: "#64748B" }}>Connexion…</div>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              ) : (
                <div className={error ? "pin-error" : ""}>
                  <NumPad value={pin} onChange={setPin} maxLen={4} />
                </div>
              )}

              {error && (
                <div style={{ marginTop: 20, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#EF4444", textAlign: "center" }}>
                  {error}
                </div>
              )}
            </div>

            {mode === "employee" && (
              <p style={{ fontSize: 12, color: "#334155", textAlign: "center", marginTop: 16, lineHeight: 1.6 }}>
                Pas de code PIN ? Contactez<br />votre responsable J&apos;MTD.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

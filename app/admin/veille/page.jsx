"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadSession } from "../../../lib/storage";
import { AMBER, PINK, NAVY, EMERALD } from "../../../lib/data";

const CAT_CONFIG = {
  juridique: { label: "Juridique", color: "#EF4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)" },
  fiscal:    { label: "Fiscal",    color: AMBER,       bg: "rgba(13,169,164,0.1)", border: "rgba(13,169,164,0.25)" },
  social:    { label: "Social",    color: "#8B5CF6",   bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.25)" },
  pratique:  { label: "Pratique",  color: EMERALD,     bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)" },
  general:   { label: "Général",   color: "#64748B",   bg: "rgba(100,116,139,0.1)", border: "rgba(100,116,139,0.2)" },
};

const IMP_CONFIG = {
  haute:   { label: "Prioritaire", color: "#EF4444", icon: "🔴" },
  moyenne: { label: "À suivre",    color: AMBER,     icon: "🟡" },
  faible:  { label: "Info",        color: "#64748B", icon: "⚪" },
};

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const CACHE_KEY = "jmtd_veille_cache";
const CACHE_TTL = 6 * 3600 * 1000; // 6h

export default function VeillePage() {
  const router = useRouter();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [filter, setFilter]   = useState("all");
  const [lastFetch, setLastFetch] = useState(null);

  useEffect(() => {
    if (!loadSession("jmtd_admin")) { router.replace("/portail"); return; }
    const cached = (() => {
      try { return JSON.parse(localStorage.getItem(CACHE_KEY)); } catch { return null; }
    })();
    if (cached && Date.now() - new Date(cached.fetched_at).getTime() < CACHE_TTL) {
      setData(cached);
      setLastFetch(new Date(cached.fetched_at));
    }
  }, []);

  const scan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/veille");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Erreur inconnue");
      setData(json);
      setLastFetch(new Date(json.fetched_at));
      localStorage.setItem(CACHE_KEY, JSON.stringify(json));
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  const items = data?.items ?? [];
  const filtered = filter === "all" ? items : items.filter(i => i.categorie === filter);
  const hautes = items.filter(i => i.importance === "haute").length;
  const categories = [...new Set(items.map(i => i.categorie))];

  return (
    <div style={{ minHeight: "100vh", background: "#060E18" }}>
      {/* Header */}
      <div style={{ background: "#0D1B2A", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/admin" style={{ fontSize: 13, color: "#64748B", textDecoration: "none" }}>← Admin</Link>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: `linear-gradient(135deg, ${AMBER}, ${PINK})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
            <div>
              <div style={{ fontWeight: 700, color: "#F8FAFC", fontSize: 16 }}>Veille réglementaire IA</div>
              <div style={{ fontSize: 12, color: "#475569" }}>
                Source : <a href="https://www.servicesalapersonne.gouv.fr" target="_blank" rel="noopener noreferrer" style={{ color: AMBER }}>servicesalapersonne.gouv.fr</a>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {lastFetch && <span style={{ fontSize: 12, color: "#475569" }}>Analysé le {fmtDate(lastFetch)}</span>}
          <button onClick={scan} disabled={loading}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 30, background: loading ? "rgba(255,255,255,0.06)" : `linear-gradient(135deg, ${AMBER}, ${PINK})`, color: loading ? "#64748B" : "#fff", border: "none", fontWeight: 700, fontSize: 14, cursor: loading ? "wait" : "pointer", transition: "all 0.2s" }}>
            <span style={{ display: "inline-block", animation: loading ? "spin 1s linear infinite" : "none" }}>⚡</span>
            {loading ? "Analyse en cours…" : "Scanner maintenant"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* Error */}
        {error && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 16, padding: "20px 24px", marginBottom: 28, display: "flex", gap: 14, alignItems: "flex-start" }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 700, color: "#EF4444", marginBottom: 6 }}>Erreur lors de l&apos;analyse</div>
              <div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6 }}>{error}</div>
              {error.includes("ANTHROPIC_API_KEY") && (
                <div style={{ marginTop: 12, fontSize: 12, color: "#64748B", background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: "10px 14px", fontFamily: "monospace" }}>
                  → Allez sur vercel.com → votre projet → Settings → Environment Variables<br />
                  → Ajoutez : <strong style={{ color: AMBER }}>ANTHROPIC_API_KEY</strong> = votre clé API Anthropic
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!data && !loading && !error && (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ fontSize: 64, marginBottom: 24, opacity: 0.6 }}>🤖</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, fontWeight: 800, color: "#F8FAFC", marginBottom: 12 }}>
              Veille réglementaire SAP
            </h2>
            <p style={{ fontSize: 16, color: "#64748B", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.7 }}>
              L&apos;agent IA analyse en temps réel le site officiel <strong style={{ color: "#94A3B8" }}>servicesalapersonne.gouv.fr</strong> et vous résume les actualités juridiques, fiscales et sociales importantes pour J&apos;MTD.
            </p>
            <button onClick={scan}
              style={{ padding: "16px 36px", borderRadius: 30, background: `linear-gradient(135deg, ${AMBER}, ${PINK})`, color: "#fff", border: "none", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>
              ⚡ Lancer la première analyse
            </button>
            <div style={{ marginTop: 20, fontSize: 12, color: "#334155" }}>⏱ ~10 secondes · Résultats mis en cache 6h</div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "64px 24px" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", border: `3px solid rgba(255,255,255,0.06)`, borderTop: `3px solid ${AMBER}`, margin: "0 auto 24px", animation: "spin 1s linear infinite" }} />
            <div style={{ fontSize: 16, color: "#94A3B8", marginBottom: 8 }}>Analyse en cours…</div>
            <div style={{ fontSize: 13, color: "#475569" }}>Lecture de servicesalapersonne.gouv.fr · Analyse Claude · Structuration</div>
          </div>
        )}

        {/* Results */}
        {data && !loading && (
          <>
            {/* Alert banner */}
            {data.alerte && (
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.35)", borderRadius: 16, padding: "18px 24px", marginBottom: 24, display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>🚨</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#EF4444", marginBottom: 4 }}>Alerte réglementaire</div>
                  <div style={{ fontSize: 14, color: "#94A3B8" }}>{data.alerte}</div>
                </div>
              </div>
            )}

            {/* Synthèse IA */}
            <div style={{ background: `linear-gradient(135deg, rgba(13,169,164,0.08), rgba(212,25,122,0.06))`, border: `1px solid ${AMBER}33`, borderRadius: 20, padding: "24px 28px", marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${AMBER}, ${PINK})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: AMBER, textTransform: "uppercase", letterSpacing: 1 }}>Synthèse de l&apos;agent IA</div>
              </div>
              <p style={{ fontSize: 15, color: "#94A3B8", lineHeight: 1.7, margin: 0 }}>{data.synthese}</p>
              <div style={{ marginTop: 16, display: "flex", gap: 16, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, color: "#475569" }}>📊 {items.length} points analysés</span>
                {hautes > 0 && <span style={{ fontSize: 13, color: "#EF4444", fontWeight: 600 }}>🔴 {hautes} prioritaire{hautes > 1 ? "s" : ""}</span>}
                {data.tokens_used && <span style={{ fontSize: 12, color: "#334155" }}>~{data.tokens_used} tokens</span>}
              </div>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
              <button onClick={() => setFilter("all")}
                style={{ padding: "6px 16px", borderRadius: 30, border: `1px solid ${filter === "all" ? AMBER : "rgba(255,255,255,0.1)"}`, background: filter === "all" ? `${AMBER}22` : "transparent", color: filter === "all" ? AMBER : "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Tout ({items.length})
              </button>
              {categories.map(cat => {
                const cfg = CAT_CONFIG[cat] || CAT_CONFIG.general;
                const count = items.filter(i => i.categorie === cat).length;
                return (
                  <button key={cat} onClick={() => setFilter(cat)}
                    style={{ padding: "6px 16px", borderRadius: 30, border: `1px solid ${filter === cat ? cfg.color : "rgba(255,255,255,0.1)"}`, background: filter === cat ? cfg.bg : "transparent", color: filter === cat ? cfg.color : "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    {cfg.label} ({count})
                  </button>
                );
              })}
            </div>

            {/* Cards grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {filtered.map(item => {
                const cat = CAT_CONFIG[item.categorie] || CAT_CONFIG.general;
                const imp = IMP_CONFIG[item.importance] || IMP_CONFIG.faible;
                return (
                  <div key={item.id}
                    style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${item.importance === "haute" ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 18, padding: "22px 20px", display: "flex", flexDirection: "column", gap: 14, transition: "border-color 0.2s" }}>
                    {/* Header badges */}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 30, background: cat.bg, border: `1px solid ${cat.border}`, fontSize: 11, color: cat.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
                        {cat.label}
                      </span>
                      <span style={{ padding: "3px 10px", borderRadius: 30, background: "rgba(255,255,255,0.04)", fontSize: 11, color: imp.color, fontWeight: 600 }}>
                        {imp.icon} {imp.label}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#F8FAFC", lineHeight: 1.4, margin: 0 }}>
                      {item.titre}
                    </h3>

                    {/* Summary */}
                    <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.65, margin: 0 }}>
                      {item.resume}
                    </p>

                    {/* Action */}
                    {item.action && (
                      <div style={{ background: "rgba(255,255,255,0.03)", borderLeft: `3px solid ${AMBER}`, borderRadius: "0 8px 8px 0", padding: "10px 14px" }}>
                        <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Action recommandée</div>
                        <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.6 }}>{item.action}</div>
                      </div>
                    )}

                    {/* Footer */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 4 }}>
                      <span style={{ fontSize: 11, color: "#334155" }}>{item.source_label || "servicesalapersonne.gouv.fr"}</span>
                      <a href="https://www.servicesalapersonne.gouv.fr" target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 11, color: "#475569", textDecoration: "none" }}>↗ Source</a>
                    </div>
                  </div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: 48, color: "#475569" }}>Aucun élément dans cette catégorie.</div>
            )}

            {/* Footer info */}
            <div style={{ marginTop: 40, padding: "20px 24px", background: "rgba(255,255,255,0.02)", borderRadius: 12, display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "space-between" }}>
              <div style={{ fontSize: 12, color: "#334155" }}>
                🤖 Analyse générée par Claude (Anthropic) · Données issues de servicesalapersonne.gouv.fr<br />
                Vérifiez toujours l&apos;information auprès de sources officielles avant toute décision juridique.
              </div>
              <div style={{ fontSize: 12, color: "#334155" }}>
                Prochaine actualisation possible dans {Math.max(0, Math.ceil((CACHE_TTL - (Date.now() - new Date(data.fetched_at).getTime())) / 3600000))}h
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

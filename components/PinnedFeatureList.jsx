"use client";
import { useEffect, useRef, useState } from "react";
import { IconTile } from "./Icon";

/**
 * PinnedFeatureList — moment signature façon Apple/Stripe : texte épinglé à
 * gauche pendant que les points défilent à droite. Chaque carte s'anime EN
 * CONTINU selon sa proximité au centre de l'écran (scale, ombre, saturation)
 * — pas un simple "apparu une fois". Rail vertical connecteur + compteur
 * "0X / 0Y" dans le texte épinglé, qui suit la carte active en direct.
 *
 * Un seul écouteur de scroll (rAF) pour toute la liste. No-op complet sous
 * prefers-reduced-motion (affichage statique net, sans mouvement).
 *
 *   <PinnedFeatureList eyebrow="…" title={<>…</>} intro="…" items={[{icon,title,text,color,to}]} />
 */
export default function PinnedFeatureList({ eyebrow, title, intro, items }) {
  const railFillRef = useRef(null);
  const itemRefs = useRef([]);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    if (mq.matches) return;

    let raf = null;
    const update = () => {
      const vh = window.innerHeight;
      const center = vh * 0.5;
      let closestIdx = 0, closestDist = Infinity;

      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const elCenter = r.top + r.height / 2;
        const dist = Math.abs(elCenter - center);
        const proximity = Math.max(0, 1 - dist / (vh * 0.55));
        el.style.setProperty("--proximity", proximity.toFixed(3));
        if (dist < closestDist) { closestDist = dist; closestIdx = i; }
      });
      setActive(closestIdx);

      const first = itemRefs.current[0];
      const last = itemRefs.current[itemRefs.current.length - 1];
      if (railFillRef.current && first && last) {
        const rf = first.getBoundingClientRect(), rl = last.getBoundingClientRect();
        const total = (rl.top + rl.height / 2) - (rf.top + rf.height / 2);
        const done = center - (rf.top + rf.height / 2);
        const pct = total !== 0 ? Math.max(0, Math.min(1, done / total)) : 0;
        railFillRef.current.style.height = `${pct * 100}%`;
      }
      raf = null;
    };
    const onScroll = () => { if (raf == null) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const activeColor = items[active]?.color || "#0DA9A4";

  return (
    <>
      <div className="pfl-grid" style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 56, alignItems: "start" }}>
        <div className="pfl-intro" style={{ position: "sticky", top: 110 }}>
          <div className="eyebrow">{eyebrow}</div>
          <h2 className="display" style={{ fontSize: "clamp(28px, 3.6vw, 44px)", marginBottom: 16 }}>{title}</h2>
          <p style={{ fontSize: 16.5, color: "#64748B", maxWidth: 400, lineHeight: 1.8, marginBottom: 28 }}>{intro}</p>

          <div className="pfl-counter" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div aria-hidden style={{
              width: 46, height: 46, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
              background: `radial-gradient(circle, ${activeColor}22, transparent 70%)`,
              border: `1.5px solid ${activeColor}55`,
              transition: "border-color 0.5s ease, background 0.5s ease",
            }}>
              <span className="display" style={{ fontSize: 15, fontWeight: 800, color: activeColor, transition: "color 0.5s ease" }}>
                {String(active + 1).padStart(2, "0")}
              </span>
            </div>
            <div style={{ fontSize: 12.5, color: "#94A3B8", fontWeight: 600, whiteSpace: "nowrap" }}>
              <span style={{ color: "#1A2D3D" }}>{String(active + 1).padStart(2, "0")}</span> / {String(items.length).padStart(2, "0")}
            </div>
            <div style={{ flex: 1, height: 3, borderRadius: 2, background: "rgba(0,0,0,0.06)", maxWidth: 90, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${((active + 1) / items.length) * 100}%`, background: "linear-gradient(90deg, #0DA9A4, #D4197A)", borderRadius: 2, transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)" }} />
            </div>
          </div>
        </div>

        <div className="pfl-items" style={{ display: "flex", flexDirection: "column", gap: 30, position: "relative" }}>
          {/* Rail vertical connecteur avec marqueur de progression */}
          <div aria-hidden className="pfl-rail" style={{ position: "absolute", left: -34, top: 30, bottom: 30, width: 2, background: "rgba(13,169,164,0.14)", borderRadius: 2 }}>
            <div ref={railFillRef} style={{ position: "absolute", top: 0, left: 0, right: 0, height: "0%", background: "linear-gradient(180deg, #0DA9A4, #D4197A)", borderRadius: 2 }} />
          </div>

          {items.map((it, i) => (
            <div
              key={it.title}
              ref={(el) => (itemRefs.current[i] = el)}
              style={{
                padding: "38px 32px", background: "#fff", borderRadius: 24,
                borderTop: `4px solid ${it.color}`,
                boxShadow: reduced ? "0 4px 28px rgba(0,0,0,0.06)" : `0 calc(10px + var(--proximity, 0) * 22px) calc(24px + var(--proximity, 0) * 36px) ${it.color}2e`,
                transform: reduced ? "none" : "scale(calc(0.95 + var(--proximity, 0) * 0.05))",
                opacity: reduced ? 1 : "calc(0.6 + var(--proximity, 0) * 0.4)",
                filter: reduced ? "none" : "saturate(calc(0.65 + var(--proximity, 0) * 0.35))",
                // Pas de transition ici : --proximity est déjà recalculé à chaque frame de
                // scroll (rAF) — une transition CSS par-dessus ferait "courir après" une
                // cible qui bouge 60x/s (jamais rattrapée, effet de traîne). Le scale/l'ombre
                // doivent suivre le scroll à l'image près, comme le mode `scrub` de Reveal.
                willChange: "transform, opacity, box-shadow",
              }}
            >
              <IconTile name={it.icon} size={60} icon={28} from={it.color} to={it.to} radius={18} style={{ marginBottom: 20 }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1A2D3D", marginBottom: 12, lineHeight: 1.4 }}>{it.title}</h3>
              <p style={{ fontSize: 14.5, color: "#64748B", lineHeight: 1.85 }}>{it.text}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .pfl-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .pfl-intro { position: static !important; top: auto !important; text-align: center; }
          .pfl-intro p { margin-left: auto; margin-right: auto; }
          .pfl-counter { justify-content: center; }
          .pfl-rail { display: none !important; }
        }
      `}</style>
    </>
  );
}

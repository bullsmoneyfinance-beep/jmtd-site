"use client";
import { useEffect, useRef, useState } from "react";
import { IconTile } from "./Icon";

/**
 * PinnedFeatureList — moment signature cinématique (référence : pages produit
 * Apple/Ferrari). Colonne épinglée = une SCÈNE qui change de couleur, de
 * numéro et d'icône selon le point actif (crossfade doux, pas de liste de
 * cartes). Colonne défilante = effet de MISE AU POINT : l'item au centre de
 * l'écran est net et pleine échelle, les autres sont flous, réduits, ternes.
 *
 * Un seul écouteur de scroll (rAF) pour toute la liste. No-op complet sous
 * prefers-reduced-motion : tout redevient net, statique, sans mouvement.
 *
 *   <PinnedFeatureList eyebrow="…" title={<>…</>} intro="…" items={[{icon,title,text,color,to}]} />
 */
export default function PinnedFeatureList({ eyebrow, title, intro, items }) {
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
        const proximity = Math.max(0, 1 - dist / (vh * 0.5));
        // Pas de transition CSS sur les propriétés pilotées par --proximity : elle est
        // recalculée à chaque frame de scroll, une transition la ferait "courir après".
        el.style.setProperty("--proximity", proximity.toFixed(3));
        if (dist < closestDist) { closestDist = dist; closestIdx = i; }
      });
      setActive(closestIdx);
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

  const cur = items[active] || items[0];

  return (
    <>
      <div className="pfl-grid" style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 56, alignItems: "start" }}>

        {/* ── Colonne épinglée : la SCÈNE — dégradé, numéro et icône qui changent ── */}
        <div className="pfl-intro" style={{ position: "sticky", top: 100 }}>
          <div className="eyebrow">{eyebrow}</div>
          <h2 className="display" style={{ fontSize: "clamp(28px, 3.6vw, 44px)", marginBottom: 16 }}>{title}</h2>
          <p style={{ fontSize: 16.5, color: "#64748B", maxWidth: 400, lineHeight: 1.8, marginBottom: 28 }}>{intro}</p>

          <div className="pfl-stage" style={{
            position: "relative", borderRadius: 28, overflow: "hidden", height: 260,
            background: `linear-gradient(135deg, ${cur.color}, ${cur.to})`,
            transition: "background 0.7s cubic-bezier(0.16,1,0.3,1)",
            boxShadow: `0 26px 60px ${cur.color}42`,
          }}>
            {/* Texture lumineuse fixe */}
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 90% at 15% 0%, rgba(255,255,255,0.28), transparent 55%)" }} />
            {/* Scrim bas — garantit un texte blanc toujours lisible quel que soit le dégradé */}
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.48) 0%, transparent 62%)" }} />

            {/* Grand numéro en fond, crossfade pur (opacité seule, jamais de layout) */}
            {items.map((it, i) => (
              <div key={it.title} aria-hidden style={{
                position: "absolute", right: 4, bottom: -40,
                fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700,
                fontSize: "clamp(120px, 15vw, 190px)", color: "rgba(255,255,255,0.18)", lineHeight: 1,
                opacity: active === i ? 1 : 0, transition: "opacity 0.6s ease",
              }}>
                {String(i + 1).padStart(2, "0")}
              </div>
            ))}

            {/* Icône active, crossfade */}
            <div style={{ position: "absolute", top: 26, left: 26, width: 58, height: 58 }}>
              {items.map((it, i) => (
                <div key={it.title} style={{ position: "absolute", top: 0, left: 0, opacity: active === i ? 1 : 0, transition: "opacity 0.5s ease" }}>
                  <IconTile name={it.icon} size={58} icon={27} from="rgba(255,255,255,0.24)" to="rgba(255,255,255,0.08)" radius={16} color="#fff" />
                </div>
              ))}
            </div>

            {/* Titre du point actif, crossfade */}
            <div style={{ position: "absolute", left: 26, bottom: 22, right: 90, height: 56 }}>
              {items.map((it, i) => (
                <p key={it.title} className="display" style={{
                  position: "absolute", left: 0, bottom: 0, right: 0, margin: 0,
                  fontSize: 19, fontWeight: 700, color: "#fff", lineHeight: 1.28,
                  opacity: active === i ? 1 : 0, transition: "opacity 0.5s ease",
                }}>
                  {it.title}
                </p>
              ))}
            </div>
          </div>

          {/* Compteur */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20 }}>
            <span style={{ fontSize: 12.5, color: "#94A3B8", fontWeight: 700, letterSpacing: 0.5, whiteSpace: "nowrap" }}>
              <span style={{ color: "#1A2D3D" }}>{String(active + 1).padStart(2, "0")}</span> / {String(items.length).padStart(2, "0")}
            </span>
            <div style={{ flex: 1, height: 3, borderRadius: 2, background: "rgba(0,0,0,0.06)", maxWidth: 120, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${((active + 1) / items.length) * 100}%`, background: `linear-gradient(90deg, ${cur.color}, ${cur.to})`, borderRadius: 2, transition: "width 0.5s cubic-bezier(0.16,1,0.3,1), background 0.5s ease" }} />
            </div>
          </div>
        </div>

        {/* ── Colonne défilante : effet de MISE AU POINT (net au centre, flou ailleurs) ── */}
        <div className="pfl-items" style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {items.map((it, i) => (
            <div
              key={it.title}
              ref={(el) => (itemRefs.current[i] = el)}
              style={{
                display: "flex", alignItems: "flex-start", gap: 20,
                filter: reduced ? "none" : "blur(calc((1 - var(--proximity, 0)) * 4px)) saturate(calc(0.45 + var(--proximity, 0) * 0.55))",
                transform: reduced ? "none" : "scale(calc(0.88 + var(--proximity, 0) * 0.12))",
                opacity: reduced ? 1 : "calc(0.28 + var(--proximity, 0) * 0.72)",
                transformOrigin: "left center",
                willChange: "transform, opacity, filter",
              }}
            >
              <div aria-hidden style={{
                width: 4, borderRadius: 2, alignSelf: "stretch", flexShrink: 0, minHeight: 90,
                background: it.color,
                opacity: reduced ? 1 : "calc(0.25 + var(--proximity, 0) * 0.75)",
              }} />
              <div>
                <h3 style={{ fontSize: "clamp(21px, 2.4vw, 27px)", fontWeight: 700, color: "#1A2D3D", marginBottom: 12, lineHeight: 1.3 }}>{it.title}</h3>
                <p style={{ fontSize: 15.5, color: "#64748B", lineHeight: 1.85, maxWidth: 480 }}>{it.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .pfl-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .pfl-intro { position: static !important; top: auto !important; text-align: center; }
          .pfl-intro p { margin-left: auto; margin-right: auto; }
          .pfl-stage { max-width: 420px; margin: 0 auto; }
        }
        @media (max-width: 480px) {
          .pfl-stage { height: 220px !important; }
        }
      `}</style>
    </>
  );
}

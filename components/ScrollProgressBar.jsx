"use client";
import { useEffect, useRef } from "react";

/**
 * ScrollProgressBar — fine barre dégradée en haut de page qui suit la
 * progression de lecture. Rendue UNE SEULE FOIS dans le layout racine :
 * un seul écouteur de scroll (rAF-throttled) pour tout le site, pas de
 * duplication par page. No-op sous prefers-reduced-motion (barre masquée).
 */
export default function ScrollProgressBar() {
  const barRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = null;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
      if (barRef.current) barRef.current.style.width = `${pct}%`;
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

  return (
    <div aria-hidden style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 9999, background: "transparent", pointerEvents: "none" }}
      className="scroll-progress-track">
      <div ref={barRef} style={{ height: "100%", width: "0%", background: "linear-gradient(90deg, #0DA9A4, #D4197A)", transition: "width 0.1s linear" }} />
    </div>
  );
}

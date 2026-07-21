"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Reveal — wrapper universel de scroll-reveal.
 *
 * Usage :
 *   <Reveal>…</Reveal>
 *   <Reveal as="section" delay={120} y={40}>…</Reveal>
 *   <Reveal scaleIn>…</Reveal>                     — fondu + montée + léger zoom (moment signature)
 *   <Reveal scrub>…</Reveal>                       — progression CONTINUE liée au scroll (pas juste apparu/disparu)
 *   <Reveal className="services-grid" style={{ … }}>…</Reveal>
 *
 * Props :
 *   as        — balise/élément à rendre (défaut "div")
 *   delay     — décalage d'apparition en ms (stagger) — ignoré si `scrub`
 *   y         — distance de montée en px (défaut 28)
 *   scaleIn   — ajoute un léger zoom (0.94→1) à la révélation, plus cinématique
 *   scrub     — au lieu d'un déclenchement binaire, --progress (0→1) suit en continu
 *               la position de l'élément dans le viewport pendant qu'on scrolle
 *   threshold — ratio d'intersection déclencheur (défaut 0.14, ignoré si `scrub`)
 *   once      — ne joue qu'une fois (ignoré si `scrub`, toujours continu)
 *
 * Les styles vivent dans globals.css (.reveal-el / .reveal-el.is-in / .reveal-scrub),
 * avec un no-op sous prefers-reduced-motion.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  y = 28,
  scaleIn = false,
  scrub = false,
  threshold = 0.14,
  once = true,
  className = "",
  style = {},
  ...rest
}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  // ── Mode binaire (défaut) : IntersectionObserver, apparaît une fois ──
  useEffect(() => {
    if (scrub) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setShown(true); return; }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            if (once) obs.unobserve(e.target);
          } else if (!once) {
            setShown(false);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, once, scrub]);

  // ── Mode scrub : --progress (0→1) recalculé à chaque frame de scroll ──
  useEffect(() => {
    if (!scrub) return;
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.style.setProperty("--progress", "1"); return; }
    let raf = null;
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 quand le haut de l'élément touche le bas du viewport, 1 quand le haut de l'élément atteint 30% de la hauteur
      const raw = (vh - r.top) / (vh * 0.75);
      const clamped = Math.max(0, Math.min(1, raw));
      el.style.setProperty("--progress", clamped.toFixed(3));
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
  }, [scrub]);

  const modeClass = scrub ? "reveal-scrub" : `reveal-el${shown ? " is-in" : ""}`;
  const scaleClass = scaleIn ? " reveal-scale" : "";

  return (
    <Tag
      ref={ref}
      className={`${modeClass}${scaleClass}${className ? " " + className : ""}`}
      style={{ "--reveal-delay": `${delay}ms`, "--reveal-y": `${y}px`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

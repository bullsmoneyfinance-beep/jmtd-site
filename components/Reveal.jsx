"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Reveal — wrapper universel de scroll-reveal (fade + montée douce).
 *
 * Usage :
 *   <Reveal>…</Reveal>
 *   <Reveal as="section" delay={120} y={40}>…</Reveal>
 *   <Reveal className="services-grid" style={{ … }}>…</Reveal>
 *
 * Props :
 *   as        — balise/élément à rendre (défaut "div")
 *   delay     — décalage d'apparition en ms (stagger)
 *   y         — distance de montée en px (défaut 28)
 *   threshold — ratio d'intersection déclencheur (défaut 0.14)
 *   once      — ne joue qu'une fois (défaut true)
 *
 * Les styles vivent dans globals.css (.reveal-el / .reveal-el.is-in),
 * avec un no-op sous prefers-reduced-motion.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  y = 28,
  threshold = 0.14,
  once = true,
  className = "",
  style = {},
  ...rest
}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Sécurité SSR / navigateurs anciens : on affiche directement.
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
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
  }, [threshold, once]);

  return (
    <Tag
      ref={ref}
      className={`reveal-el${shown ? " is-in" : ""}${className ? " " + className : ""}`}
      style={{ "--reveal-delay": `${delay}ms`, "--reveal-y": `${y}px`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

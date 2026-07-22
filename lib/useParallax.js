"use client";
import { useEffect } from "react";

/**
 * Parallax générique — piloté par les attributs [data-parallax] (voir globals.css .parallax).
 * Un seul écouteur de scroll pour toute la page, throttlé par requestAnimationFrame.
 * No-op complet sous prefers-reduced-motion.
 *
 * Hook partagé par les 9 pages du site (auparavant recopié à l'identique dans chacune).
 */
export default function useParallax() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layers = Array.from(document.querySelectorAll("[data-parallax]"));
    if (!layers.length) return;
    let raf = null;
    const update = () => {
      const vh = window.innerHeight;
      layers.forEach(el => {
        const speed = parseFloat(el.getAttribute("data-parallax")) || 0.12;
        const r = el.getBoundingClientRect();
        const offset = r.top + r.height / 2 - vh / 2;
        el.style.transform = `translate3d(0, ${(-offset * speed).toFixed(1)}px, 0)`;
      });
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
}

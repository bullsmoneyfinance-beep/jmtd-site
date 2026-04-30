"use client";
import { useState } from "react";

/**
 * Logo J'MTD
 * — Essaie /logo.png (image officielle)
 * — Si introuvable, bascule sur SVG inline Dancing Script
 *
 * Props:
 *   size   : "sm" | "md" | "lg"
 *   tagline: boolean (SVG seulement)
 */

const SIZES = {
  sm:  { img: { width: 140, height: 124 }, svg: { vw: 130, vh: 72,  jmS: 38, tdS: 60,  jmX: 2, jmY: 42, tdX: 44, tdY: 70  } },
  md:  { img: { width: 130, height: 115 }, svg: { vw: 200, vh: 110, jmS: 58, tdS: 92,  jmX: 2, jmY: 64, tdX: 68, tdY: 107 } },
  lg:  { img: { width: 180, height: 160 }, svg: { vw: 280, vh: 154, jmS: 80, tdS: 128, jmX: 2, jmY: 90, tdX: 94, tdY: 150 } },
};

export default function Logo({ size = "md", tagline = false, className = "", style = {} }) {
  const [useSvg, setUseSvg] = useState(false);
  const s = SIZES[size] || SIZES.md;

  if (!useSvg) {
    return (
      <img
        src="/logo.png"
        alt="J'MTD — Société de services sur mesure"
        width={s.img.width}
        height={s.img.height}
        className={className}
        style={{ display: "block", objectFit: "contain", ...style }}
        onError={() => setUseSvg(true)}
      />
    );
  }

  /* Fallback SVG inline */
  const sv = s.svg;
  const totalH = tagline ? sv.vh + (size === "sm" ? 18 : size === "md" ? 24 : 32) : sv.vh;
  return (
    <svg
      viewBox={`0 0 ${sv.vw} ${totalH}`}
      width={sv.vw}
      height={totalH}
      className={className}
      style={{ display: "block", overflow: "visible", ...style }}
      aria-label="J'MTD — Société de services sur mesure"
    >
      <text x={sv.jmX} y={sv.jmY} fontFamily="'Dancing Script', cursive" fontWeight="700" fontSize={sv.jmS} fill="#D4197A" letterSpacing="-1">J&apos;m</text>
      <text x={sv.tdX} y={sv.tdY} fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize={sv.tdS} fill="#0DA9A4" letterSpacing="-3">TD</text>
      {tagline && (
        <text x="2" y={sv.vh + (size === "sm" ? 14 : size === "md" ? 20 : 28)}
          fontFamily="'Dancing Script', cursive" fontWeight="700"
          fontSize={size === "sm" ? 11 : size === "md" ? 15 : 20}
          fill="#D4197A" letterSpacing="0.3">
          Société de services sur mesure
        </text>
      )}
    </svg>
  );
}

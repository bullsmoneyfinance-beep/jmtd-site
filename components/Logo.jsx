/**
 * Logo J'MTD — SVG inline pour que Dancing Script (chargé dans <head>) s'applique.
 * Reproduit fidèlement : J'm script rose en haut-gauche, TD teal bold en bas-droite,
 * tagline italique rose en dessous.
 *
 * Props:
 *   size   : "sm" | "md" | "lg"   (défaut "md")
 *   tagline: boolean               (affiche la tagline, défaut false)
 */

const SIZES = {
  //          vw    vh   jmSize  tdSize  jmX  jmY  tdX  tdY  spacing
  sm:  { vw: 130,  vh: 72,  jmSize: 38, tdSize: 60, jmX: 2,  jmY: 42, tdX: 44, tdY: 70 },
  md:  { vw: 200,  vh: 110, jmSize: 58, tdSize: 92, jmX: 2,  jmY: 64, tdX: 68, tdY: 107 },
  lg:  { vw: 280,  vh: 154, jmSize: 80, tdSize: 128, jmX: 2,  jmY: 90, tdX: 94, tdY: 150 },
};

export default function Logo({ size = "md", tagline = false, className = "", style = {} }) {
  const s = SIZES[size] || SIZES.md;
  const totalH = tagline ? s.vh + (size === "sm" ? 18 : size === "md" ? 24 : 32) : s.vh;

  return (
    <svg
      viewBox={`0 0 ${s.vw} ${totalH}`}
      width={s.vw}
      height={totalH}
      className={className}
      style={{ display: "block", overflow: "visible", ...style }}
      aria-label="J'MTD — Société de services sur mesure"
    >
      {/* J'm — script rose, top-left */}
      <text
        x={s.jmX}
        y={s.jmY}
        fontFamily="'Dancing Script', cursive"
        fontWeight="700"
        fontSize={s.jmSize}
        fill="#D4197A"
        letterSpacing="-1"
      >
        J&apos;m
      </text>

      {/* TD — block teal, bottom-right, large */}
      <text
        x={s.tdX}
        y={s.tdY}
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="900"
        fontSize={s.tdSize}
        fill="#0DA9A4"
        letterSpacing="-3"
      >
        TD
      </text>

      {/* Tagline optionnelle */}
      {tagline && (
        <text
          x="2"
          y={s.vh + (size === "sm" ? 14 : size === "md" ? 20 : 28)}
          fontFamily="'Dancing Script', cursive"
          fontWeight="700"
          fontSize={size === "sm" ? 11 : size === "md" ? 15 : 20}
          fill="#D4197A"
          letterSpacing="0.3"
        >
          Société de services sur mesure
        </text>
      )}
    </svg>
  );
}

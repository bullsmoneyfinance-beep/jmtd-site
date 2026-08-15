/**
 * Rendu de l'icône de marque J'MTD (carré, opaque) — partagé entre
 * l'apple-touch-icon iOS et les icônes du manifeste (Android / Chrome).
 * Les proportions sont exprimées en fraction de la taille pour rester
 * nettes de 180 px à 512 px.
 */
export function BrandIcon({ size = 180 }) {
  const u = size / 180; // unité d'échelle
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(140deg, #0DA9A4 0%, #12B5B0 45%, #D4197A 100%)",
        fontFamily: "Arial, Helvetica, sans-serif",
        position: "relative",
      }}
    >
      {/* Reflet doux en haut à gauche */}
      <div
        style={{
          position: "absolute",
          top: -50 * u,
          left: -40 * u,
          width: 190 * u,
          height: 190 * u,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.30) 0%, transparent 70%)",
          display: "flex",
        }}
      />
      {/* Lockup J'm TD */}
      <div style={{ display: "flex", alignItems: "flex-end", position: "relative" }}>
        <span style={{ fontSize: 52 * u, fontWeight: 900, color: "#fff", fontStyle: "italic", lineHeight: 1, letterSpacing: -1 * u }}>
          J&apos;m
        </span>
        <span style={{ fontSize: 72 * u, fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: -4 * u, marginBottom: -4 * u }}>
          TD
        </span>
      </div>
    </div>
  );
}

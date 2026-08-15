/**
 * Rendu de l'icône d'application J'MTD — partagé entre l'apple-touch-icon iOS
 * et les icônes du manifeste (Android / Chrome).
 *
 * On utilise le logo officiel (public/logo.png, 1054×784) posé sur un carré blanc :
 *  - iOS exige une icône CARRÉE et OPAQUE ;
 *  - le logo est plus large que haut, on le contient sans le déformer ;
 *  - une marge est conservée car iOS arrondit fortement les coins (~22 %),
 *    ce qui rognerait la signature « Société de services sur mesure ».
 *
 * @param {string} src  logo en data URI (base64)
 * @param {number} size côté de l'icône en pixels
 */
export function BrandIcon({ src, size = 180 }) {
  const largeur = Math.round(size * 0.92);          // marge latérale de sécurité
  const hauteur = Math.round(largeur * (784 / 1054)); // ratio d'origine préservé

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} width={largeur} height={hauteur} alt="J'MTD" />
    </div>
  );
}

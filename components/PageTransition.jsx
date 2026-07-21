"use client";
import { usePathname } from "next/navigation";

/**
 * PageTransition — signature d'entrée de page premium.
 *
 * À chaque changement de route, le contenu apparaît en fondu + légère montée
 * (translateY 14px → 0, opacity 0 → 1) sur ~0.45s avec l'easing maison
 * cubic-bezier(0.16,1,0.3,1) — la même courbe que <Reveal> / globals.css.
 *
 * Choix d'implémentation :
 *  - keyé par `pathname` → React remonte le wrapper à chaque navigation,
 *    ce qui rejoue l'animation d'entrée (pas d'observer, pas de scroll).
 *  - animation via @keyframes avec `animation-fill-mode: backwards` UNIQUEMENT.
 *    → pendant l'animation : interpolation depuis (opacity:0, translateY 14px).
 *    → une fois terminée : retour à l'état de base (opacity:1, transform:none).
 *    On ne laisse JAMAIS un `transform` figé après l'animation, sinon les
 *    descendants en `position: sticky` (ex. colonnes épinglées de l'accueil)
 *    seraient cassés par le contexte de transformation d'un ancêtre.
 *  - état de base = opacity:1 / transform:none → le contenu est déjà visible
 *    dans le HTML initial (aucun impact SEO, aucun contenu masqué par JS).
 *  - position: static, aucune largeur imposée → zéro layout shift, zéro
 *    débordement horizontal (y compris à 375px).
 *  - prefers-reduced-motion: reduce → animation désactivée en pur CSS.
 */

const CSS = `
.page-transition {
  opacity: 1;
  transform: none;
  animation: pageEnter 0.45s cubic-bezier(0.16, 1, 0.3, 1) backwards;
  will-change: opacity, transform;
}
@keyframes pageEnter {
  from { opacity: 0; transform: translate3d(0, 14px, 0); }
  to   { opacity: 1; transform: translate3d(0, 0, 0); }
}
@media (prefers-reduced-motion: reduce) {
  .page-transition {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
    will-change: auto;
  }
}
`;

export default function PageTransition({ children }) {
  const pathname = usePathname();
  return (
    <>
      <style>{CSS}</style>
      <div key={pathname} className="page-transition">
        {children}
      </div>
    </>
  );
}

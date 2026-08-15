import { ImageResponse } from "next/og";
import { BrandIcon } from "../lib/brandIcon";

/**
 * Icône d'écran d'accueil iOS (« Ajouter à l'écran d'accueil »).
 * iOS ignore les icônes du manifeste web : il lui faut un apple-touch-icon
 * carré et OPAQUE (une image transparente s'affiche sur fond noir).
 * Les coins arrondis sont appliqués par iOS lui-même.
 */
export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<BrandIcon size={180} />, { ...size });
}

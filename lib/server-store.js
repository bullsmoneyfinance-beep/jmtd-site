/**
 * server-store.js — stockage serveur pour Next.js
 *
 * Stratégie :
 *   1. Cache mémoire module-level (partagé entre requêtes du même process)
 *   2. Fichiers JSON dans /tmp (persistance inter-requêtes sur même Lambda)
 *
 * Sur Vercel, chaque région a ses propres Lambdas. Pour un usage
 * mono-région (Martinique → eu-west), les données sont cohérentes
 * tant que le Lambda reste chaud (5-10 min sans activité).
 *
 * Pour une persistance totale multi-instance, migrer vers Vercel KV.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const TMP_DIR = "/tmp/jmtd";
const cache = {};

// Crée le répertoire de stockage si absent
function ensureDir() {
  try {
    if (!existsSync(TMP_DIR)) mkdirSync(TMP_DIR, { recursive: true });
  } catch {
    // /tmp non disponible (local Windows dev) — cache seul
  }
}

ensureDir();

export function serverGet(key, fallback = null) {
  // 1. Cache mémoire
  if (cache[key] !== undefined) return cache[key];

  // 2. Fichier /tmp
  try {
    const file = join(TMP_DIR, `${key}.json`);
    if (existsSync(file)) {
      const parsed = JSON.parse(readFileSync(file, "utf8"));
      cache[key] = parsed;
      return parsed;
    }
  } catch { /* ignoré */ }

  return fallback;
}

export function serverSet(key, data) {
  cache[key] = data;
  try {
    ensureDir();
    writeFileSync(join(TMP_DIR, `${key}.json`), JSON.stringify(data));
  } catch { /* /tmp non dispo en dev Windows → cache seul */ }
}

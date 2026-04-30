/**
 * storage.js — couche de persistance unifiée
 *
 * load / save  → passent par l'API /api/data/:key (partagé entre appareils)
 *               avec fallback sur localStorage si l'API est inaccessible.
 *
 * loadSession / saveSession / clearSession → sessionStorage (local, non partagé)
 *   Utilisé uniquement pour l'authentification (admin, employé).
 */

/* ── Helpers API ── */
async function apiFetch(key) {
  try {
    const res = await fetch(`/api/data/${key}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

async function apiSave(key, data) {
  try {
    await fetch(`/api/data/${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });
    return true;
  } catch {
    return false;
  }
}

/* ── localStorage helpers (fallback) ── */
function lsGet(key, fallback) {
  try {
    if (typeof window === "undefined") return fallback;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function lsSet(key, data) {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* silently fail */ }
}

/* ── API publique ── */

export async function load(key, fallback) {
  if (typeof window === "undefined") return fallback;

  // 1. Essai API (source de vérité partagée)
  const apiData = await apiFetch(key);
  if (apiData !== null && apiData !== undefined) return apiData;

  // 2. Fallback localStorage (mode hors-ligne ou erreur réseau)
  return lsGet(key, fallback);
}

export async function save(key, data) {
  if (typeof window === "undefined") return;

  // Sauvegarde en parallèle : API (partagé) + localStorage (backup local)
  await apiSave(key, data);
  lsSet(key, data);
}

/* ── Session (auth locale uniquement, non partagée) ── */

export function loadSession(key, fallback = null) {
  try {
    if (typeof window === "undefined") return fallback;
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveSession(key, data) {
  try {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch { /* silently fail */ }
}

export function clearSession(key) {
  try {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(key);
  } catch { /* silently fail */ }
}

export async function load(key, fallback) {
  try {
    if (typeof window === "undefined") return fallback;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export async function save(key, data) {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* silently fail */ }
}

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

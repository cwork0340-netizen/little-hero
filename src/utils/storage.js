// ── localStorage helpers ───────────────────────
const KEY = 'little-hero-v1'

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // quota exceeded or private mode — fail silently
  }
}

export function clearState() {
  localStorage.removeItem(KEY)
}

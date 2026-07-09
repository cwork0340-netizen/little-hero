// ── localStorage helpers（含 schema 版本與遷移）──
import { makeTasks, DEFAULT_REWARDS } from '../data/tasks.js'

const KEY = 'little-hero-v1'
export const SCHEMA_VERSION = 2

export function todayStr(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function yesterdayStr() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return todayStr(d)
}

// 舊資料缺欄位時補預設值；壞到不能用就整個丟掉重來，絕不讓 App 白畫面
function migrateChild(c, idx) {
  if (!c || typeof c !== 'object' || !c.name) return null
  const line = c.line === 'boy' || c.line === 'girl' ? c.line : (c.avatar === '👦' ? 'boy' : 'girl')
  return {
    id:     c.id ?? idx + 1,
    name:   String(c.name),
    avatar: c.avatar || (line === 'boy' ? '👦' : '👧'),
    line,
    seasonOverride: c.seasonOverride ?? null,
    badges: Number.isFinite(c.badges) ? c.badges : 0,
    streak: Number.isFinite(c.streak) ? c.streak : 0,
    totalPoints: Number.isFinite(c.totalPoints) ? c.totalPoints : 0,
    lastPlayedDate:   c.lastPlayedDate   || null,
    lastCompletedDate: c.lastCompletedDate || null,
    badgeAwardedDate:  c.badgeAwardedDate  || null,
    history: Array.isArray(c.history) ? c.history : [],
    tasks: Array.isArray(c.tasks) && c.tasks.length
      ? c.tasks.filter(t => t && t.label).map((t, i) => ({
          id: t.id ?? i + 1,
          // 舊版存的 .png 路徑一律轉成 .webp（圖檔已全面壓縮改格式）
          icon: typeof t.icon === 'string' ? t.icon.replace(/\.png$/, '.webp') : '⭐',
          label: String(t.label),
          points: Number.isFinite(t.points) ? t.points : 10,
          done: !!t.done,
        }))
      : makeTasks(),
  }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const state = JSON.parse(raw)
    if (!state || !Array.isArray(state.children)) return null
    const children = state.children.map(migrateChild).filter(Boolean)
    if (!children.length) return null
    const rewards = Array.isArray(state.rewards) && state.rewards.length
      ? state.rewards.filter(r => r && r.label && Number.isFinite(r.badges))
          .map((r, i) => ({ id: r.id ?? i + 1, icon: r.icon || '🎁', label: String(r.label), badges: r.badges }))
      : DEFAULT_REWARDS
    return {
      version: SCHEMA_VERSION,
      parentPin: /^\d{4}$/.test(state.parentPin) ? state.parentPin : '1234',
      rewards,
      children,
    }
  } catch {
    return null
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...state, version: SCHEMA_VERSION }))
  } catch {
    // quota exceeded or private mode — fail silently
  }
}

export function clearState() {
  localStorage.removeItem(KEY)
}

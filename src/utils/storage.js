import { DEFAULT_REWARDS, TASK_ICON_CHOICES, makeTasks } from '../data/tasks.js'

const KEY = 'little-hero-v1'
export const SCHEMA_VERSION = 6

export const DEFAULT_PARENTS = [
  { id: 1, name: '家長 1', pin: '1234' },
]

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

function isReadableText(value) {
  return typeof value === 'string'
    && value.trim().length > 0
    && !/[�嚙稽摰蝡銝憭隞撌閮雿敺]/.test(value)
}

function normalizeTask(task, index) {
  const fallback = {
    icon: TASK_ICON_CHOICES[index % TASK_ICON_CHOICES.length],
    label: `自訂任務 ${index + 1}`,
    hint: '這是保留下來的任務。',
    points: 10,
  }
  return {
    id: Number.isFinite(task?.id) ? task.id : index + 1,
    icon: typeof task?.icon === 'string' && task.icon.startsWith('/assets/')
      ? task.icon.replace(/\.png$/, '.webp')
      : fallback.icon,
    label: isReadableText(task?.label) ? task.label.trim() : fallback.label,
    hint: isReadableText(task?.hint) ? task.hint.trim() : fallback.hint,
    points: Number.isFinite(task?.points) ? task.points : fallback.points,
    done: Boolean(task?.done),
  }
}

function migrateChild(child, index, options = {}) {
  if (!child || typeof child !== 'object') return null
  const line = child.line === 'boy' || child.line === 'girl' ? child.line : index % 2 ? 'boy' : 'girl'
  const tasks = options.clearTasks
    ? []
    : Array.isArray(child.tasks) && child.tasks.length
    ? child.tasks.map(normalizeTask)
    : makeTasks()

  return {
    id: Number.isFinite(child.id) ? child.id : index + 1,
    name: isReadableText(child.name) ? child.name.trim() : (index % 2 ? '小安' : '小米'),
    line,
    badges: Number.isFinite(child.badges) ? child.badges : 0,
    streak: Number.isFinite(child.streak) ? child.streak : 0,
    totalPoints: Number.isFinite(child.totalPoints) ? child.totalPoints : 0,
    lastPlayedDate: child.lastPlayedDate || null,
    lastCompletedDate: child.lastCompletedDate || null,
    badgeAwardedDate: child.badgeAwardedDate || null,
    history: Array.isArray(child.history) ? child.history : [],
    tasks,
  }
}

function normalizeReward(reward, index) {
  const fallback = DEFAULT_REWARDS[index % DEFAULT_REWARDS.length]
  return {
    id: Number.isFinite(reward?.id) ? reward.id : index + 1,
    icon: isReadableText(reward?.icon) ? reward.icon : fallback.icon,
    label: isReadableText(reward?.label) ? reward.label.trim() : fallback.label,
    badges: Number.isFinite(reward?.badges) && reward.badges > 0 ? reward.badges : fallback.badges,
  }
}

function normalizeParent(parent, index, fallbackPin = '1234') {
  return {
    id: Number.isFinite(parent?.id) ? parent.id : index + 1,
    name: isReadableText(parent?.name) ? parent.name.trim() : `家長 ${index + 1}`,
    pin: /^\d{4}$/.test(parent?.pin) ? parent.pin : fallbackPin,
  }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const state = JSON.parse(raw)
    if (!state || !Array.isArray(state.children)) return null
    const shouldClearTasks = Number(state.version || 0) < SCHEMA_VERSION
    const children = state.children.map((child, index) => migrateChild(child, index, { clearTasks: shouldClearTasks })).filter(Boolean)
    if (!children.length) return null

    const legacyPin = /^\d{4}$/.test(state.parentPin) ? state.parentPin : '1234'
    const parents = Array.isArray(state.parents) && state.parents.length
      ? state.parents.map((parent, index) => normalizeParent(parent, index, legacyPin))
      : [{ ...DEFAULT_PARENTS[0], pin: legacyPin }]

    return {
      version: SCHEMA_VERSION,
      parentPin: parents[0]?.pin || legacyPin,
      parents,
      rewards: Array.isArray(state.rewards) && state.rewards.length
        ? state.rewards.map(normalizeReward)
        : DEFAULT_REWARDS,
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
    // Ignore quota and private browsing failures.
  }
}

export function clearState() {
  localStorage.removeItem(KEY)
}

export function iconForReward(reward) {
  const map = {
    book: '/assets/little-hero-v4/ui/chest_open.webp',
    snack: '/assets/little-hero-v4/icons/tasks/breakfast.webp',
    movie: '/assets/little-hero-v4/ui/chest_closed.webp',
    park: '/assets/little-hero-v4/icons/tasks/water_flowers.webp',
  }
  return map[reward?.icon] || '/assets/little-hero-v4/ui/chest_closed.webp'
}

export function nextTaskIcon(index) {
  return TASK_ICON_CHOICES[index % TASK_ICON_CHOICES.length]
}

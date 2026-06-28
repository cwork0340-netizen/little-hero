import { THEMES } from './themes.js'

// ── Default task template ──────────────────────
export const TASK_META = [
  { icon: '🎒', label: '收書包',     points: 10 },
  { icon: '🍽️', label: '洗餐具',     points: 10 },
  { icon: '🛁', label: '洗澡',       points: 10 },
  { icon: '📖', label: '作業完成',   points: 15 },
  { icon: '📝', label: '聯絡簿簽名', points: 5  },
]

export function makeTasks(themeKey) {
  const th = THEMES[themeKey]
  return TASK_META.map((m, i) => ({
    id:     i + 1,
    icon:   m.icon,
    label:  m.label,
    points: m.points,
    story:  th.taskStories[i] || '完成這個任務吧！',
    done:   false,
  }))
}

// ── Achievements ───────────────────────────────
export const ACHIEVEMENTS = [
  { id: 'first',   icon: '🌟', label: '第一次完成所有任務', unlocked: true  },
  { id: '3day',    icon: '🔥', label: '連續 3 天完成',      unlocked: true  },
  { id: '7day',    icon: '🏆', label: '連續 7 天完成',      unlocked: false },
  { id: 'pack',    icon: '🎒', label: '第一次自己收書包',    unlocked: true  },
  { id: 'forest',  icon: '🌸', label: '第一片森林恢復',      unlocked: false },
  { id: 'collect', icon: '⭐', label: '集滿 5 枚徽章',       unlocked: false },
]

// ── Default rewards ────────────────────────────
export const DEFAULT_REWARDS = [
  { id: 1, icon: '🍦', label: '吃冰淇淋',   badges: 3 },
  { id: 2, icon: '🧸', label: '新玩具（小）', badges: 7 },
  { id: 3, icon: '🎬', label: '看電影',      badges: 5 },
  { id: 4, icon: '🎡', label: '親子活動',    badges: 10 },
]

// ── Initial children data ──────────────────────
export const CHILDREN_INIT = [
  {
    id:     1,
    name:   '小米',
    avatar: '👧',
    streak: 7,
    badges: 12,
    theme:  'forest',
    tasks:  makeTasks('forest'),
  },
  {
    id:     2,
    name:   '小宇',
    avatar: '👦',
    streak: 3,
    badges: 5,
    theme:  'ocean',
    tasks:  makeTasks('ocean'),
  },
]

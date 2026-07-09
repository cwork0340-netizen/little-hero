const V4 = '/assets/little-hero-v4'
const ICON = (name) => `${V4}/icons/tasks/${name}.webp`

// ── Default task template ──────────────────────
export const TASK_META = [
  { icon: ICON('toothbrush'), label: '刷牙',     points: 10 },
  { icon: ICON('homework'),   label: '功課',     points: 15 },
  { icon: ICON('tidy_toys'),  label: '收玩具',   points: 10 },
  { icon: ICON('shower'),     label: '洗澡',     points: 10 },
  { icon: ICON('backpack'),   label: '上學準備', points: 5  },
]

// 家長新增任務時可選的圖示
export const TASK_ICON_CHOICES = [
  ICON('toothbrush'), ICON('homework'), ICON('tidy_toys'), ICON('shower'),
  ICON('backpack'), ICON('reading'), ICON('dishes'), ICON('shoes'),
  ICON('folded_clothes'), ICON('water_flowers'), ICON('watering_can'),
  ICON('pet_bowl'), ICON('breakfast'), ICON('water_cup'), ICON('heart_outline'),
]

export function makeTasks() {
  return TASK_META.map((m, i) => ({
    id:     i + 1,
    icon:   m.icon,
    label:  m.label,
    points: m.points,
    done:   false,
  }))
}

// ── Achievements（依真實資料判定解鎖）──────────
export function getAchievements(child) {
  return [
    { id: 'first',   icon: ICON('heart_filled'),  label: '第一次完成所有任務', unlocked: child.badges >= 1 },
    { id: '3day',    icon: '🔥',                  label: '連續 3 天完成',      unlocked: child.streak >= 3 },
    { id: '7day',    icon: '🏆',                  label: '連續 7 天完成',      unlocked: child.streak >= 7 },
    { id: 'house',   icon: '🏡',                  label: '第一棟房子蓋好了',    unlocked: child.badges >= 1 },
    { id: 'collect', icon: ICON('heart_outline'), label: '集滿 5 枚徽章',       unlocked: child.badges >= 5 },
    { id: 'points',  icon: '⭐',                  label: '累積 300 點',         unlocked: (child.totalPoints || 0) >= 300 },
  ]
}

// ── Default rewards ────────────────────────────
export const DEFAULT_REWARDS = [
  { id: 1, icon: '🍦', label: '吃冰淇淋',   badges: 3 },
  { id: 2, icon: '🎬', label: '看電影',      badges: 5 },
  { id: 3, icon: '🧸', label: '新玩具（小）', badges: 7 },
  { id: 4, icon: '🎡', label: '親子活動',    badges: 10 },
]

// ── Initial children data（真實從 0 開始）───────
export function makeChild(id, name, line) {
  return {
    id,
    name,
    avatar: line === 'boy' ? '👦' : '👧',
    line,
    seasonOverride: null,
    badges: 0,
    streak: 0,
    totalPoints: 0,
    lastPlayedDate: null,
    lastCompletedDate: null,
    badgeAwardedDate: null,
    history: [],
    tasks: makeTasks(),
  }
}

export const CHILDREN_INIT = [
  makeChild(1, '小米', 'girl'),
  makeChild(2, '小宇', 'boy'),
]

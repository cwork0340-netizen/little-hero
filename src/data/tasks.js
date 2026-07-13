const V4 = '/assets/little-hero-v4'
const ICON = (name) => `${V4}/icons/tasks/${name}.webp`

export const TASK_ICON_CHOICES = [
  ICON('toothbrush'),
  ICON('backpack'),
  ICON('homework'),
  ICON('tidy_toys'),
  ICON('reading'),
  ICON('shower'),
  ICON('dishes'),
  ICON('breakfast'),
  ICON('folded_clothes'),
  ICON('water_cup'),
  ICON('water_flowers'),
  ICON('pet_bowl'),
]

export const TASK_META = [
  {
    icon: ICON('toothbrush'),
    label: '刷牙洗臉',
    hint: '照顧好自己，是今天的第一步。',
    points: 10,
  },
  {
    icon: ICON('backpack'),
    label: '整理書包',
    hint: '把需要的東西放進去。',
    points: 10,
  },
  {
    icon: ICON('homework'),
    label: '完成作業',
    hint: '先做一小段也可以。',
    points: 15,
  },
  {
    icon: ICON('tidy_toys'),
    label: '收好玩具',
    hint: '讓房間變得好走路。',
    points: 10,
  },
  {
    icon: ICON('reading'),
    label: '閱讀 10 分鐘',
    hint: '挑一本喜歡的書就好。',
    points: 10,
  },
]

export const QUICK_TASKS = [
  ...TASK_META,
  {
    icon: ICON('shower'),
    label: '洗澡',
    hint: '把身體洗乾淨，準備放鬆。',
    points: 10,
  },
  {
    icon: ICON('dishes'),
    label: '幫忙收碗',
    hint: '把自己的碗盤放到水槽。',
    points: 10,
  },
  {
    icon: ICON('water_cup'),
    label: '喝水',
    hint: '記得補充一杯水。',
    points: 5,
  },
]

export const DEFAULT_REWARDS = [
  { id: 1, icon: 'book', label: '睡前多一本故事書', badges: 3 },
  { id: 2, icon: 'snack', label: '週末選一份小點心', badges: 5 },
  { id: 3, icon: 'movie', label: '家庭電影時間', badges: 8 },
  { id: 4, icon: 'park', label: '假日去公園玩', badges: 10 },
]

export function makeTasks() {
  return []
}

export function makeChild(id, name, line = 'girl') {
  return {
    id,
    name,
    line,
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
  makeChild(2, '小安', 'boy'),
  makeChild(3, '菲菲', 'girl'),
]

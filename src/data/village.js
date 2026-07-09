// ── 村莊季節與成長 ──────────────────────────────
const V4 = '/assets/little-hero-v4'

export const SEASON_BG = {
  spring: { label: '春天', file: `${V4}/village/bg_spring.webp` },
  summer: { label: '夏天', file: `${V4}/village/bg_summer.webp` },
  autumn: { label: '秋天', file: `${V4}/village/bg_autumn.webp` },
  winter: { label: '冬天', file: `${V4}/village/bg_winter.webp` },
  night:  { label: '夜晚', file: `${V4}/village/bg_night.webp` },
  rainy:  { label: '雨天', file: `${V4}/village/bg_rainy.webp` },
}

export function currentSeason(date = new Date()) {
  const m = date.getMonth() + 1
  if (m >= 3 && m <= 5) return 'spring'
  if (m >= 6 && m <= 8) return 'summer'
  if (m >= 9 && m <= 11) return 'autumn'
  return 'winter'
}

const GROWTH_FILES = {
  boy:  [`${V4}/growth/seed.webp`, `${V4}/growth/sprout.webp`, `${V4}/growth/sapling_boy.webp`, `${V4}/growth/tree_boy.webp`],
  girl: [`${V4}/growth/seed.webp`, `${V4}/growth/sprout.webp`, `${V4}/growth/bud_girl.webp`, `${V4}/growth/bloom_girl.webp`],
}
const GROWTH_LABELS = ['種子', '發芽', '成長中', '長成']
const GROWTH_THRESHOLDS = [0, 2, 5, 10]

export function getGrowthStage(line, badges) {
  let stage = 0
  for (let i = 0; i < GROWTH_THRESHOLDS.length; i++) {
    if (badges >= GROWTH_THRESHOLDS[i]) stage = i
  }
  const next = GROWTH_THRESHOLDS[stage + 1] ?? null
  return {
    stage,
    label: GROWTH_LABELS[stage],
    file: GROWTH_FILES[line][stage],
    progress: next ? Math.min(1, (badges - GROWTH_THRESHOLDS[stage]) / (next - GROWTH_THRESHOLDS[stage])) : 1,
  }
}

// 村莊裝飾元件：達到徽章門檻後淡入疊加在空景上
export const VILLAGE_ELEMENTS = [
  { key: 'house',  min: 1,  file: `${V4}/village/elements/house.webp`,         style: { left: '3%',  bottom: '38%', width: '20%' } },
  { key: 'pond',   min: 3,  file: `${V4}/village/elements/pond.svg`,          style: { right: '3%', bottom: '23%', width: '16%' } },
  { key: 'farm',   min: 6,  file: `${V4}/village/elements/farm.svg`,          style: { left: '4%',  bottom: '23%', width: '18%' } },
  { key: 'bloom',  min: 9,  file: `${V4}/village/elements/blooming_tree.webp`, style: { right: '5%', bottom: '42%', width: '15%' } },
]

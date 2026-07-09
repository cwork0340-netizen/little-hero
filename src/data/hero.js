// ── 小勇者／小園丁 升級系統 ──────────────────────
// 等級依累積徽章數判定；還沒生成的等級美術先沿用 Lv1 圖，之後補上即可替換。
const V4 = '/assets/little-hero-v4'

export const HERO_LINES = {
  boy: {
    label: '小勇者',
    levels: [
      { min: 0,  name: '小勇者',  idle: `${V4}/characters/hero-boy/lv1_idle.webp`, cheer: `${V4}/characters/hero-boy/lv1_cheer.webp` },
      { min: 5,  name: '騎士',    idle: `${V4}/characters/hero-boy/lv5_idle.webp`, cheer: `${V4}/characters/hero-boy/lv5_cheer.webp` },
      { min: 10, name: '魔法師',  idle: `${V4}/characters/hero-boy/lv5_idle.webp`, cheer: `${V4}/characters/hero-boy/lv5_cheer.webp` },
      { min: 20, name: '守護者',  idle: `${V4}/characters/hero-boy/lv5_idle.webp`, cheer: `${V4}/characters/hero-boy/lv5_cheer.webp` },
    ],
  },
  girl: {
    label: '小園丁',
    levels: [
      { min: 0,  name: '小園丁',   idle: `${V4}/characters/hero-girl/lv1_idle.webp`, cheer: `${V4}/characters/hero-girl/lv1_cheer.webp` },
      { min: 5,  name: '花藝師',   idle: `${V4}/characters/hero-girl/lv1_idle.webp`, cheer: `${V4}/characters/hero-girl/lv1_cheer.webp` },
      { min: 10, name: '花仙子',   idle: `${V4}/characters/hero-girl/lv1_idle.webp`, cheer: `${V4}/characters/hero-girl/lv1_cheer.webp` },
      { min: 20, name: '花園女王', idle: `${V4}/characters/hero-girl/lv1_idle.webp`, cheer: `${V4}/characters/hero-girl/lv1_cheer.webp` },
    ],
  },
}

export function getHeroLevel(line, badges) {
  const levels = HERO_LINES[line].levels
  let idx = 0
  for (let i = 0; i < levels.length; i++) {
    if (badges >= levels[i].min) idx = i
  }
  const cur = levels[idx]
  const next = levels[idx + 1] || null
  return {
    ...cur,
    levelIndex: idx,
    next,
    progress: next ? Math.min(1, (badges - cur.min) / (next.min - cur.min)) : 1,
  }
}

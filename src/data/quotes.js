// ── 每日鼓勵文字（依今天的完成度變化，隨機挑一句）──
export const ENCOURAGE = {
  none: [
    '新的一天開始囉，你準備好了嗎？',
    '只要開始，就已經很棒了！',
    '慢慢來，一步一步做就可以。',
    '你今天想先做哪一件呢？',
    '相信自己，你一定做得到！',
  ],
  some: [
    '已經完成 {done} 件了，你很棒！',
    '繼續加油，你做得很好！',
    '你比昨天更進步了一點！',
    '再一點點，就快要全部完成囉！',
    '你很努力，我都看到了！',
    '還差 {left} 件，你可以的！',
  ],
  all: [
    '今天全部完成了，你太厲害了！',
    '你做到了！為自己感到驕傲吧！',
    '全部完成，你是最棒的！',
    '你今天表現得非常好！',
    '休息一下吧，你值得的！',
  ],
}

export function pickEncouragement(done, total) {
  const key = done <= 0 ? 'none' : done >= total ? 'all' : 'some'
  const pool = ENCOURAGE[key]
  const line = pool[Math.floor(Math.random() * pool.length)]
  return line
    .replace('{done}', done)
    .replace('{total}', total)
    .replace('{left}', Math.max(0, total - done))
}

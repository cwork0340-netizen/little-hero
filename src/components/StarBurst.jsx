// StarBurst.jsx — 完成任務時的星星爆炸效果
import { useEffect } from 'react'

export default function StarBurst({ x, y, onDone }) {
  const EMOJIS = ['⭐', '✨', '💫', '🌟']
  const points = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * 360
    const dist  = 55 + Math.random() * 50
    return {
      dx: Math.cos((angle * Math.PI) / 180) * dist,
      dy: Math.sin((angle * Math.PI) / 180) * dist,
      e:  EMOJIS[i % 4],
    }
  })

  useEffect(() => {
    const t = setTimeout(onDone, 950)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div style={{
      position: 'fixed',
      left: x,
      top: y,
      pointerEvents: 'none',
      zIndex: 9999,
    }}>
      {points.map((p, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            fontSize: 16,
            '--sdx': `${p.dx}px`,
            '--sdy': `${p.dy}px`,
            animation: 'lhStar .8s ease-out forwards',
            animationDelay: `${i * 22}ms`,
          }}
        >
          {p.e}
        </span>
      ))}
    </div>
  )
}

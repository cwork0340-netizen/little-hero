// pages/MainScreen.jsx
import { useState } from 'react'
import { THEMES } from '../data/themes.js'
import WoodSign from '../components/WoodSign.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import TaskCard from '../components/TaskCard.jsx'
import BottomNav from '../components/BottomNav.jsx'
import StarBurst from '../components/StarBurst.jsx'

export default function MainScreen({ child, onTaskComplete, onReorderTasks, onAllDone, onNavChange, navTab }) {
  const th = THEMES[child.theme]
  const [drag, setDrag]       = useState(null)
  const [dragOver, setDragOver] = useState(null)
  const [burst, setBurst]     = useState(null)
  const [charAnim, setCharAnim] = useState('lh-float')

  const done     = child.tasks.filter(x => x.done).length
  const total    = child.tasks.length
  const pct      = Math.round((done / total) * 100)
  const worldPct = Math.round(20 + pct * 0.6)

  function handleComplete(taskId, e) {
    const r = e.currentTarget.getBoundingClientRect()
    setBurst({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
    setCharAnim('lh-bounce')
    setTimeout(() => setCharAnim('lh-float'), 700)
    onTaskComplete(child.id, taskId)
    if (done + 1 === total) setTimeout(onAllDone, 900)
  }

  function handleDrop() {
    if (drag == null || dragOver == null || drag === dragOver) {
      setDrag(null); setDragOver(null); return
    }
    onReorderTasks(child.id, drag, dragOver)
    setDrag(null); setDragOver(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: th.bg }}>
      {burst && <StarBurst x={burst.x} y={burst.y} onDone={() => setBurst(null)} />}

      {/* ── TOP BAR ── */}
      <div style={{
        background: `linear-gradient(180deg, #FFF7E8, ${th.bg})`,
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        borderBottom: '2px solid rgba(0,0,0,.06)',
        flexShrink: 0,
      }}>
        <div style={{
          fontSize: 28, width: 46, height: 46, borderRadius: '50%',
          background: `linear-gradient(135deg, #F3D7B6, #FFB6B955)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,.1)', flexShrink: 0,
        }}>{child.avatar}</div>

        <div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#4A3428' }}>{child.name}</div>
          <div style={{ fontSize: 10, color: '#8B7566' }}>下午好！冒險家 ☀️</div>
        </div>

        <div style={{ flex: 1 }} />

        {/* streak & badges pills */}
        {[
          { icon: '⭐', v: child.badges, l: '今日徽章', c: '#FFE08A' },
          { icon: '🔥', v: `${child.streak}`, l: '連續天數', c: '#FFD0A0' },
        ].map((p, i) => (
          <div key={i} style={{
            background: p.c, borderRadius: 20, padding: '5px 13px',
            display: 'flex', alignItems: 'center', gap: 5,
            boxShadow: '0 2px 8px rgba(0,0,0,.09)',
          }}>
            <span style={{ fontSize: 16 }}>{p.icon}</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#4A3428', lineHeight: 1 }}>{p.v}</div>
              <div style={{ fontSize: 9, color: '#8B7566' }}>{p.l}</div>
            </div>
          </div>
        ))}

        <button style={{
          background: '#FFB6B9', border: 'none', borderRadius: 20,
          padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 4,
          cursor: 'pointer', fontSize: 13, fontWeight: 800, color: '#fff',
          fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(0,0,0,.1)',
        }}>
          🎁 獎勵 ›
        </button>
      </div>

      {/* ── BODY ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* LEFT：故事世界 */}
        <div style={{
          flex: '0 0 52%',
          background: `linear-gradient(160deg, ${th.bg} 30%, ${th.panelBg})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px 12px',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* bg emoji decoration */}
          <div style={{
            position: 'absolute', bottom: 70, left: 0, right: 0,
            textAlign: 'center', fontSize: 56, opacity: .07,
            pointerEvents: 'none', userSelect: 'none',
          }}>
            {Array(5).fill(th.emoji).join(' ')}
          </div>

          {/* title */}
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <WoodSign fontSize={20}>今天的冒險</WoodSign>
            <div style={{ fontSize: 12, color: '#8B7566', marginTop: 6, fontWeight: 600 }}>
              {th.story}
            </div>
          </div>

          {/* character */}
          <div
            className={charAnim}
            onClick={() => { setCharAnim('lh-wiggle'); setTimeout(() => setCharAnim('lh-float'), 500) }}
            style={{
              fontSize: 96,
              cursor: 'pointer',
              userSelect: 'none',
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,.15))',
              position: 'relative',
              zIndex: 2,
              lineHeight: 1,
            }}
          >
            {th.char}
          </div>

          {/* speech bubble */}
          {done > 0 && (
            <div style={{
              background: 'rgba(255,255,255,.88)',
              borderRadius: 20,
              padding: '7px 16px',
              fontSize: 12,
              fontWeight: 700,
              color: '#4A3428',
              boxShadow: '0 2px 10px rgba(0,0,0,.08)',
              position: 'relative',
              zIndex: 2,
            }}>
              {done === total
                ? `🎉 太棒了！今天全部完成！`
                : `還差 ${total - done} 步就完成了！繼續加油！`
              }
            </div>
          )}

          {/* progress bar + world map */}
          <div style={{ width: '100%', display: 'flex', gap: 10, alignItems: 'flex-end', position: 'relative', zIndex: 2 }}>
            <div style={{ flex: 1 }}>
              <ProgressBar pct={worldPct} color={th.accentD} label={th.worldLabel} />
            </div>
            <button style={{
              background: '#fff',
              border: '2px solid #C8934A',
              borderRadius: 14,
              padding: '7px 12px',
              fontSize: 12,
              fontWeight: 800,
              color: '#4A3428',
              cursor: 'pointer',
              flexShrink: 0,
              fontFamily: 'inherit',
              boxShadow: '0 2px 8px rgba(0,0,0,.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 3,
            }}>
              🗺️ 世界地圖
            </button>
          </div>
        </div>

        {/* RIGHT：任務清單 */}
        <div style={{
          flex: 1,
          background: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '2px solid rgba(0,0,0,.05)',
        }}>
          {/* task panel header */}
          <div style={{
            padding: '12px 16px 8px',
            borderBottom: '1px solid #f0e8dc',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#4A3428', flex: 1 }}>今天的任務</div>
            <div style={{
              fontSize: 11,
              fontWeight: 800,
              background: done === total ? '#BFE3C0' : '#F3D7B6',
              color: '#4A3428',
              borderRadius: 10,
              padding: '3px 10px',
            }}>
              {done}/{total} 完成
            </div>
          </div>

          <div style={{ fontSize: 11, color: '#bbb', textAlign: 'center', padding: '6px 0 2px', fontWeight: 600 }}>
            ✦ 拖曳卡片可調整順序
          </div>

          {/* task list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '6px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {child.tasks.map(task => (
              <div
                key={task.id}
                draggable={!task.done}
                onDragStart={() => setDrag(task.id)}
                onDragEnter={() => setDragOver(task.id)}
                onDragEnd={handleDrop}
                onDragOver={e => e.preventDefault()}
              >
                <TaskCard
                  task={task}
                  themeKey={child.theme}
                  onComplete={e => handleComplete(task.id, e)}
                  isDragging={drag === task.id}
                  isDragOver={dragOver === task.id && drag !== task.id}
                />
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid #f0e8dc' }}>
            <button
              onClick={done === total ? onAllDone : undefined}
              style={{
                width: '100%',
                height: 52,
                background: done === total
                  ? 'linear-gradient(90deg, #FFD166, #FFB6B9)'
                  : `linear-gradient(90deg, ${th.accentD}, ${th.accent})`,
                border: 'none',
                borderRadius: 26,
                fontSize: 17,
                fontWeight: 900,
                color: '#fff',
                cursor: done === total ? 'pointer' : 'default',
                boxShadow: '0 4px 16px rgba(0,0,0,.14)',
                fontFamily: 'inherit',
                letterSpacing: 0.3,
                transition: 'all .3s',
              }}
            >
              {done === total ? '🎉 查看今日成就！' : '▶ 開始冒險！'}
            </button>
          </div>
        </div>
      </div>

      <BottomNav active={navTab} onChange={onNavChange} />
    </div>
  )
}

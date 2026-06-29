// pages/MainScreen.jsx
import { useState } from 'react'
import { THEMES } from '../data/themes.js'
import TaskCard from '../components/TaskCard.jsx'
import BottomNav from '../components/BottomNav.jsx'
import StarBurst from '../components/StarBurst.jsx'
import WorldScene from '../components/WorldScene.jsx'

export default function MainScreen({ child, onTaskComplete, onReorderTasks, onAllDone, onNavChange, navTab }) {
  const th = THEMES[child.theme]
  const [drag, setDrag]       = useState(null)
  const [dragOver, setDragOver] = useState(null)
  const [burst, setBurst]     = useState(null)
  const [charAnim, setCharAnim] = useState('lh-float')

  const done  = child.tasks.filter(x => x.done).length
  const total = child.tasks.length || 1

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
    <div className="storybook-frame">
      {burst && <StarBurst x={burst.x} y={burst.y} onDone={() => setBurst(null)} />}

      <header className="top-cloud lh-header" style={{
        padding: '14px 18px 10px',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 10,
        flexShrink: 0,
      }}>
        <div style={{
          fontSize: 26,
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: `linear-gradient(135deg, #fff, ${th.bg})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 22px rgba(74,52,40,.12)',
          border: '3px solid rgba(255,255,255,.86)',
          flexShrink: 0,
        }}>{child.avatar}</div>

        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#4A3428', lineHeight: 1.1 }}>{child.name}</div>
          <div style={{ fontSize: 12, color: '#8B7566', fontWeight: 800, marginTop: 2 }}>下午好，今天要先幫誰呢？☀️</div>
        </div>

        <div style={{ flex: '1 0 auto', minWidth: 8 }} />

        <div className="lh-stat-row" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { icon: '⭐', v: child.badges, l: '徽章', c: '#FFF2BD' },
            { icon: '🔥', v: child.streak, l: '連續天數', c: '#FFE0C2' },
          ].map((p, i) => (
            <div key={i} className="stat-pill" style={{ background: p.c, minHeight: 48, minWidth: 86, padding: '6px 12px' }}>
              <span style={{ fontSize: 19 }}>{p.icon}</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#4A3428', lineHeight: 1 }}>{p.v}</div>
                <div style={{ fontSize: 10, color: '#8B7566', fontWeight: 800 }}>{p.l}</div>
              </div>
            </div>
          ))}

          <button className="soft-button" style={{ minHeight: 48, fontSize: 14, padding: '0 18px' }}>
            🎁 獎勵
          </button>
        </div>
      </header>

      <main className="lh-main" style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        padding: '8px 16px 14px',
        overflowY: 'auto',
      }}>
        <WorldScene
          theme={th}
          done={done}
          total={total}
          charAnim={charAnim}
          onCharacterClick={() => { setCharAnim('lh-wiggle'); setTimeout(() => setCharAnim('lh-float'), 500) }}
        />

        <section className="storybook-card" style={{
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}>
          <div style={{
            padding: '16px 18px 12px',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 16,
              display: 'grid',
              placeItems: 'center',
              background: `linear-gradient(135deg, ${th.accent}55, #fff)`,
              fontSize: 22,
              boxShadow: '0 8px 18px rgba(74,52,40,.08)',
              flexShrink: 0,
            }}>{th.emoji}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: 'clamp(17px, 3.4vw, 22px)', fontWeight: 900, color: '#4A3428', lineHeight: 1.15 }}>{th.taskTitle}</h2>
              <p style={{ fontSize: 12, color: '#8B7566', fontWeight: 800, marginTop: 3 }}>拖曳卡片，排出你今天想做的順序。</p>
            </div>
            <div style={{
              minWidth: 64,
              padding: '7px 10px',
              borderRadius: 16,
              textAlign: 'center',
              background: done === total ? '#DFF1D8' : '#FFF0D0',
              color: '#4A3428',
              fontWeight: 900,
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.7)',
              flexShrink: 0,
            }}>
              <div style={{ fontSize: 18, lineHeight: 1 }}>{done}/{total}</div>
              <div style={{ fontSize: 9 }}>完成</div>
            </div>
          </div>

          <div style={{
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            background: 'linear-gradient(180deg, rgba(255,247,232,.55), rgba(255,255,255,.2))',
          }}>
            {child.tasks.map((task, index) => (
              <div
                key={task.id}
                className="lh-fadeup"
                style={{ animationDelay: `${index * 45}ms` }}
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

          <div style={{ padding: '12px 16px 16px', borderTop: '1px solid var(--line)' }}>
            <button
              onClick={done === total ? onAllDone : undefined}
              className="soft-button"
              style={{
                width: '100%',
                background: done === total
                  ? 'linear-gradient(135deg, #FFD166, #FF9CAD)'
                  : `linear-gradient(135deg, ${th.accentD}, ${th.accent})`,
                cursor: done === total ? 'pointer' : 'default',
                opacity: done === total ? 1 : .9,
              }}
            >
              {done === total ? '🎉 查看今日成就' : '▶ 開始今天的冒險'}
            </button>
          </div>
        </section>
      </main>

      <BottomNav active={navTab} onChange={onNavChange} />
    </div>
  )
}

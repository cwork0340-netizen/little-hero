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

  const done     = child.tasks.filter(x => x.done).length
  const total    = child.tasks.length || 1
  const pct      = Math.round((done / total) * 100)
  const worldPct = Math.round(18 + pct * 0.72)

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

      <header className="top-cloud" style={{
        padding: '16px 24px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        flexShrink: 0,
      }}>
        <div style={{
          fontSize: 30,
          width: 58,
          height: 58,
          borderRadius: '50%',
          background: `linear-gradient(135deg, #fff, ${th.bg})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 22px rgba(74,52,40,.12)',
          border: '3px solid rgba(255,255,255,.86)',
          flexShrink: 0,
        }}>{child.avatar}</div>

        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#4A3428', lineHeight: 1.1 }}>{child.name}</div>
          <div style={{ fontSize: 13, color: '#8B7566', fontWeight: 800, marginTop: 4 }}>下午好，今天要先幫誰呢？☀️</div>
        </div>

        <div style={{ flex: 1 }} />

        {[
          { icon: '⭐', v: child.badges, l: '徽章', c: '#FFF2BD' },
          { icon: '🔥', v: child.streak, l: '連續天數', c: '#FFE0C2' },
        ].map((p, i) => (
          <div key={i} className="stat-pill" style={{ background: p.c }}>
            <span style={{ fontSize: 24 }}>{p.icon}</span>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#4A3428', lineHeight: 1 }}>{p.v}</div>
              <div style={{ fontSize: 11, color: '#8B7566', fontWeight: 800 }}>{p.l}</div>
            </div>
          </div>
        ))}

        <button className="soft-button" style={{ minHeight: 52, fontSize: 16 }}>
          🎁 獎勵
        </button>
      </header>

      <main style={{
        flex: 1,
        minHeight: 0,
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.18fr) minmax(380px, .82fr)',
        gap: 20,
        padding: '12px 22px 18px',
      }}>
        <WorldScene
          theme={th}
          done={done}
          total={total}
          pct={pct}
          worldPct={worldPct}
          charAnim={charAnim}
          onCharacterClick={() => { setCharAnim('lh-wiggle'); setTimeout(() => setCharAnim('lh-float'), 500) }}
        />

        <section className="storybook-card" style={{
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '22px 22px 14px',
            borderBottom: '1px solid var(--line)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 50,
                height: 50,
                borderRadius: 18,
                display: 'grid',
                placeItems: 'center',
                background: `linear-gradient(135deg, ${th.accent}55, #fff)`,
                fontSize: 26,
                boxShadow: '0 8px 18px rgba(74,52,40,.08)',
              }}>{th.emoji}</div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#4A3428', lineHeight: 1.15 }}>{th.taskTitle}</h2>
                <p style={{ fontSize: 13, color: '#8B7566', fontWeight: 800, marginTop: 4 }}>拖曳卡片，排出你今天想做的順序。</p>
              </div>
              <div style={{
                minWidth: 74,
                padding: '8px 12px',
                borderRadius: 18,
                textAlign: 'center',
                background: done === total ? '#DFF1D8' : '#FFF0D0',
                color: '#4A3428',
                fontWeight: 900,
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.7)',
              }}>
                <div style={{ fontSize: 20, lineHeight: 1 }}>{done}/{total}</div>
                <div style={{ fontSize: 10 }}>完成</div>
              </div>
            </div>
          </div>

          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 18px',
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

          <div style={{ padding: '16px 18px 18px', borderTop: '1px solid var(--line)' }}>
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

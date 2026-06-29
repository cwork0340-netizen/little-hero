// pages/MainScreenV3.jsx — V3 storybook home: SVG forest scene + bear character
import { useState } from 'react'
import { THEMES } from '../data/themes.js'
import TaskCardV3 from '../components/TaskCardV3.jsx'
import BottomNav from '../components/BottomNav.jsx'
import StarBurst from '../components/StarBurst.jsx'
import ProgressBar from '../components/ProgressBar.jsx'

const V3 = '/assets/little-hero-v3'
const BEAR = {
  idle:  `${V3}/characters/bear/bear_idle.svg`,
  happy: `${V3}/characters/bear/bear_happy.svg`,
  jump:  `${V3}/characters/bear/bear_jump.svg`,
}
const REWARD_CHEST = `${V3}/ui/reward_chest.svg`
const BADGE_ICON   = `${V3}/effects/badge.svg`
const SPARKLE_ICON = `${V3}/effects/sparkle.svg`

const SPARKLE_SPOTS = [
  { left: '10%', top: '30%', delay: '0s' },
  { right: '8%', top: '46%', delay: '.5s' },
  { left: '40%', top: '12%', delay: '1s' },
]

function ForestSceneV3({ theme, done, total, charState, charAnim, onCharacterClick }) {
  const bearSrc = done === total ? BEAR.jump : (charState === 'happy' ? BEAR.happy : BEAR.idle)
  const pct = Math.round((done / total) * 100)
  const worldPct = Math.round(18 + pct * 0.72)

  return (
    <section className="v3-scene">
      <img className="v3-scene-layer v3-scene-clouds" src={`${V3}/forest/clouds.svg`} alt="" />
      <img className="v3-scene-layer v3-scene-sun" src={`${V3}/forest/sun.svg`} alt="" />
      <img className="v3-scene-layer v3-scene-treehouse" src={`${V3}/forest/treehouse.svg`} alt="" />
      <img className="v3-scene-layer v3-scene-river" src={`${V3}/forest/river.svg`} alt="" />
      <img className="v3-scene-layer v3-scene-bridge" src={`${V3}/forest/bridge.svg`} alt="" />
      <img className="v3-scene-layer v3-scene-grass" src={`${V3}/forest/grass_patch.svg`} alt="" />
      <img className="v3-scene-layer v3-scene-flowers" src={`${V3}/forest/flowers.svg`} alt="" />
      <img className="v3-scene-layer v3-scene-crystal lh-sparkle" src={`${V3}/forest/crystal.svg`} alt="" />

      {SPARKLE_SPOTS.map((s, i) => (
        <img
          key={i}
          className="v3-sparkle"
          src={SPARKLE_ICON}
          alt=""
          style={{ ...s, animationDelay: s.delay, opacity: i < done + 1 ? 1 : 0.25 }}
        />
      ))}

      <div className="v3-scene-badge">
        <span>{theme.emoji}</span>
        <span>{theme.label}</span>
      </div>

      <div className="v3-bubble">
        {done === total
          ? `太棒了！${theme.completionPhrase}`
          : done === 0
            ? `${theme.charName}正在等你開始今天的冒險。`
            : `還差 ${total - done} 步，世界就會再亮一點。`}
      </div>

      <div className={`v3-bear-wrap ${charAnim}`} onClick={onCharacterClick}>
        <img src={bearSrc} alt={theme.charName} />
      </div>

      <div className="v3-scene-foot">
        <ProgressBar pct={worldPct} color={theme.accentD} label={theme.worldLabel} />
        <button className="v3-map-btn">🗺️ 地圖</button>
      </div>
    </section>
  )
}

export default function MainScreenV3({ child, onTaskComplete, onReorderTasks, onAllDone, onNavChange, navTab }) {
  const th = THEMES[child.theme]
  const [drag, setDrag]         = useState(null)
  const [dragOver, setDragOver] = useState(null)
  const [burst, setBurst]       = useState(null)
  const [charAnim, setCharAnim] = useState('lh-float')
  const [charState, setCharState] = useState('idle')

  const done  = child.tasks.filter(x => x.done).length
  const total = child.tasks.length || 1

  function handleComplete(taskId, e) {
    const r = e.currentTarget.getBoundingClientRect()
    setBurst({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
    setCharAnim('lh-bounce')
    setCharState('happy')
    setTimeout(() => { setCharAnim('lh-float'); setCharState('idle') }, 900)
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
    <div className="v3-frame">
      {burst && <StarBurst x={burst.x} y={burst.y} onDone={() => setBurst(null)} />}

      <header className="top-cloud v3-header">
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

        <div className="v3-stat-row">
          <div className="stat-pill" style={{ background: '#FFF2BD', minHeight: 48, minWidth: 86, padding: '6px 12px' }}>
            <img src={BADGE_ICON} alt="" style={{ width: 22, height: 22 }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#4A3428', lineHeight: 1 }}>{child.badges}</div>
              <div style={{ fontSize: 10, color: '#8B7566', fontWeight: 800 }}>徽章</div>
            </div>
          </div>
          <div className="stat-pill" style={{ background: '#FFE0C2', minHeight: 48, minWidth: 86, padding: '6px 12px' }}>
            <span style={{ fontSize: 19 }}>🔥</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#4A3428', lineHeight: 1 }}>{child.streak}</div>
              <div style={{ fontSize: 10, color: '#8B7566', fontWeight: 800 }}>連續天數</div>
            </div>
          </div>

          <button className="soft-button" style={{ minHeight: 48, fontSize: 14, padding: '0 16px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <img src={REWARD_CHEST} alt="" style={{ width: 20, height: 18 }} />
            獎勵
          </button>
        </div>
      </header>

      <main className="v3-main">
        <ForestSceneV3
          theme={th}
          done={done}
          total={total}
          charAnim={charAnim}
          charState={charState}
          onCharacterClick={() => { setCharAnim('lh-wiggle'); setTimeout(() => setCharAnim('lh-float'), 500) }}
        />

        <section className="storybook-card v3-task-card">
          <div className="v3-task-head">
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

          <div className="v3-task-list">
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
                <TaskCardV3
                  task={task}
                  themeKey={child.theme}
                  onComplete={e => handleComplete(task.id, e)}
                  isDragging={drag === task.id}
                  isDragOver={dragOver === task.id && drag !== task.id}
                />
              </div>
            ))}
          </div>

          <div className="v3-task-foot">
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

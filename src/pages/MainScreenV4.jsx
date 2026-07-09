// pages/MainScreenV4.jsx — village home: season background + growing village + hero character
import { useState } from 'react'
import { COLOR } from '../styles/tokens.js'
import { getHeroLevel } from '../data/hero.js'
import { SEASON_BG, currentSeason, getGrowthStage, VILLAGE_ELEMENTS } from '../data/village.js'
import TaskCardV4 from '../components/TaskCardV4.jsx'
import BottomNav from '../components/BottomNav.jsx'
import StarBurst from '../components/StarBurst.jsx'
import ProgressBar from '../components/ProgressBar.jsx'

const STAR_ICON  = '/assets/little-hero-v4/ui/star.webp'
const CHEST_ICON = '/assets/little-hero-v4/ui/chest_closed.webp'
const FLAME_ICON = '/assets/little-hero-v4/ui/flame.svg'

function VillageScene({ line, badges, seasonOverride, done, total, charAnim, onCharacterClick }) {
  const season = seasonOverride || currentSeason()
  const bg = SEASON_BG[season]
  const level = getHeroLevel(line, badges)
  const growth = getGrowthStage(line, badges)
  const heroSrc = charAnim === 'lh-bounce' ? level.cheer : level.idle

  return (
    <section className="v3-scene">
      <img className="v3-scene-layer" src={bg.file} alt="" style={{ top: 0, left: 0, objectFit: 'cover', width: '100%', height: '100%' }} />

      {VILLAGE_ELEMENTS.map(el => (
        <div
          key={el.key}
          className="v3-elem-wrap"
          style={{ ...el.style, opacity: badges >= el.min ? 1 : 0, transition: 'opacity .6s ease' }}
        >
          <div className="v3-elem-shadow" />
          <img src={el.file} alt="" style={{ filter: 'drop-shadow(0 6px 8px rgba(40,30,15,.18))' }} />
        </div>
      ))}

      <div className="v3-scene-badge">
        <span>{bg.label}</span>
      </div>

      <div className="v3-bubble">
        {done === total
          ? '太棒了！村莊又更熱鬧了！'
          : done === 0
            ? `${level.name}正在等你開始今天的冒險。`
            : `還差 ${total - done} 步，村莊就會再成長一點。`}
      </div>

      <div className={`v3-bear-wrap ${charAnim}`} onClick={onCharacterClick}>
        <img src={heroSrc} alt={level.name} style={{ objectFit: 'contain' }} />
      </div>

      <div className="v3-scene-foot">
        <ProgressBar
          pct={Math.round(growth.progress * 100)}
          color={COLOR.yellow}
          label={`村莊成長：${growth.label}`}
          trackColor="rgba(255,255,255,.22)"
          textColor="#FFF7E0"
          labelColor="#FFF3D9"
        />
        <div className="v3-foot-tag">
          <img src={STAR_ICON} alt="" style={{ width: 16, height: 16 }} /> {level.name}
        </div>
      </div>
    </section>
  )
}

export default function MainScreenV4({ child, onTaskComplete, onReorderTasks, onAllDone, onNavChange, navTab, onOpenRewards, onSwitchChild }) {
  const [burst, setBurst]       = useState(null)
  const [charAnim, setCharAnim] = useState('lh-float')

  const done  = child.tasks.filter(x => x.done).length
  const total = child.tasks.length || 1

  function handleComplete(taskId, e) {
    const r = e.currentTarget.getBoundingClientRect()
    setBurst({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
    setCharAnim('lh-bounce')
    setTimeout(() => setCharAnim('lh-float'), 900)
    onTaskComplete(child.id, taskId)
    if (done + 1 === total) setTimeout(onAllDone, 900)
  }

  // 用上下箭頭跟相鄰任務交換位置（觸控友善）
  function moveTask(taskId, dir) {
    const idx = child.tasks.findIndex(t => t.id === taskId)
    const target = child.tasks[idx + dir]
    if (target) onReorderTasks(child.id, taskId, target.id)
  }

  const level = getHeroLevel(child.line, child.badges)

  return (
    <div className="v3-frame">
      {burst && <StarBurst x={burst.x} y={burst.y} onDone={() => setBurst(null)} />}

      <header className="top-cloud v3-header">
        <button
          onClick={onSwitchChild}
          aria-label="換一位冒險家"
          className="v3-avatar-btn"
          style={{
            position: 'relative',
            width: 52, height: 52, borderRadius: '50%', overflow: 'visible',
            background: 'none', border: 'none', padding: 0,
            cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit',
          }}
        >
          <div style={{
            width: 52, height: 52, borderRadius: '50%', overflow: 'hidden',
            background: `linear-gradient(135deg, #fff, ${COLOR.meadow})`,
            boxShadow: '0 10px 22px rgba(62,62,62,.12)',
            border: '3px solid rgba(255,255,255,.86)',
          }}>
            <img src={level.idle} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
          </div>
          <span style={{
            position: 'absolute', right: -5, bottom: -5,
            width: 23, height: 23, borderRadius: '50%',
            background: '#fff', border: '2px solid #72C27A',
            boxShadow: '0 2px 6px rgba(62,62,62,.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, color: '#3E8A47', fontWeight: 900,
          }}>⇄</span>
        </button>

        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: COLOR.ink, lineHeight: 1.1 }}>{child.name}</div>
          <div style={{ fontSize: 12, color: COLOR.slate, fontWeight: 800, marginTop: 2 }}>點頭像可以換人喔 ⇄</div>
        </div>

        <div style={{ flex: '1 0 auto', minWidth: 8 }} />

        <div className="v3-stat-row">
          <div className="v3-stat-tag">
            <img src={STAR_ICON} alt="" style={{ width: 24, height: 24 }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#6B4A1E', lineHeight: 1 }}>{child.badges}</div>
              <div style={{ fontSize: 10, color: '#8A6A3A', fontWeight: 800 }}>徽章</div>
            </div>
          </div>
          <div className="v3-stat-tag">
            <img src={FLAME_ICON} alt="" style={{ width: 22, height: 26 }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#6B4A1E', lineHeight: 1 }}>{child.streak}</div>
              <div style={{ fontSize: 10, color: '#8A6A3A', fontWeight: 800 }}>連續天數</div>
            </div>
          </div>

          <button className="v3-stat-tag is-button" onClick={onOpenRewards}>
            <img src={CHEST_ICON} alt="" style={{ width: 24, height: 22 }} />
            <span style={{ fontSize: 14, fontWeight: 900, color: '#6B4A1E' }}>寶箱</span>
          </button>
        </div>
      </header>

      <main className="v3-main">
        <VillageScene
          line={child.line}
          badges={child.badges}
          seasonOverride={child.seasonOverride}
          done={done}
          total={total}
          charAnim={charAnim}
          onCharacterClick={() => { setCharAnim('lh-wiggle'); setTimeout(() => setCharAnim('lh-float'), 500) }}
        />

        <section className="storybook-card v3-task-card">
          <div className="v3-task-head">
            <div style={{
              width: 44, height: 44, borderRadius: 16, display: 'grid', placeItems: 'center',
              background: `linear-gradient(135deg, ${COLOR.green}44, #fff)`,
              boxShadow: '0 8px 18px rgba(62,62,62,.08)', flexShrink: 0,
            }}>
              <img src="/assets/little-hero-v4/icons/tasks/reading.webp" alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: 'clamp(17px, 3.4vw, 22px)', fontWeight: 900, color: COLOR.ink, lineHeight: 1.15 }}>今天的任務</h2>
              <p style={{ fontSize: 12, color: COLOR.slate, fontWeight: 800, marginTop: 3 }}>用 ▲▼ 排出你今天想做的順序。</p>
            </div>
            <div style={{
              minWidth: 64, padding: '7px 10px', borderRadius: 16, textAlign: 'center',
              background: done === total ? '#DFF1D8' : '#FFF0D0', color: COLOR.ink,
              fontWeight: 900, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.7)', flexShrink: 0,
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
              >
                <TaskCardV4
                  task={task}
                  onComplete={e => handleComplete(task.id, e)}
                  onMoveUp={() => moveTask(task.id, -1)}
                  onMoveDown={() => moveTask(task.id, +1)}
                  canMoveUp={index > 0}
                  canMoveDown={index < child.tasks.length - 1}
                />
              </div>
            ))}
          </div>

          <div className="v3-task-foot">
            <button
              onClick={() => {
                if (done === total) { onAllDone(); return }
                const el = document.querySelector('.v3-task-list .v3-card:not(.is-done)')
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  el.classList.add('lh-wiggle')
                  setTimeout(() => el.classList.remove('lh-wiggle'), 700)
                }
              }}
              className="soft-button"
              style={{
                width: '100%',
                background: done === total
                  ? 'linear-gradient(135deg, #FFD45A, #FFA36A)'
                  : `linear-gradient(135deg, #3E8A47, ${COLOR.green})`,
                cursor: 'pointer',
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

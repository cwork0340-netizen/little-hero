// pages/MainScreen.jsx — 簡化版主畫面：鼓勵文字卡＋今天的任務清單
import { useMemo, useState } from 'react'
import { COLOR } from '../styles/tokens.js'
import { AVATAR } from '../data/avatar.js'
import { pickEncouragement } from '../data/quotes.js'
import TaskList from '../components/TaskList.jsx'
import StarBurst from '../components/StarBurst.jsx'

const STAR_ICON  = '/assets/little-hero-v4/ui/star.webp'
const CHEST_ICON = '/assets/little-hero-v4/ui/chest_closed.webp'
const FLAME_ICON = '/assets/little-hero-v4/ui/flame.svg'

export default function MainScreen({ child, onTaskComplete, onReorderTasks, onAllDone, onOpenRewards, onSwitchChild }) {
  const [burst, setBurst] = useState(null)
  const avatar = AVATAR[child.line] || AVATAR.boy

  const done  = child.tasks.filter(t => t.done).length
  const total = child.tasks.length || 1
  const bucket = done <= 0 ? 'none' : done >= total ? 'all' : 'some'
  // 鼓勵文字只在完成度跨到新的一組時才換一句，避免每次重新渲染就跳字
  const message = useMemo(() => pickEncouragement(done, total), [child.id, bucket]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleComplete(taskId, e) {
    const r = e.currentTarget.getBoundingClientRect()
    setBurst({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
    onTaskComplete(child.id, taskId)
    if (done + 1 === total) setTimeout(onAllDone, 800)
  }

  function handleReorder(fromId, toId) {
    onReorderTasks(child.id, fromId, toId)
  }

  return (
    <div className="v3-frame">
      {burst && <StarBurst x={burst.x} y={burst.y} onDone={() => setBurst(null)} />}

      <header className="top-cloud v3-header">
        <button
          onClick={onSwitchChild}
          aria-label="換一位小朋友"
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
            <img src={avatar.idle} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
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
        <section className="storybook-card lh-encourage-card">
          <div className="lh-encourage-text">{message}</div>
          <div className="lh-encourage-progress">今天 {done}/{total} 完成</div>
        </section>

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
              <p style={{ fontSize: 12, color: COLOR.slate, fontWeight: 800, marginTop: 3 }}>長按卡片可以拖曳，調整順序。</p>
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

          <TaskList tasks={child.tasks} onCompleteTask={handleComplete} onReorder={handleReorder} />
        </section>
      </main>
    </div>
  )
}

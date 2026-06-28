import { useState } from 'react'
import { THEMES } from '../data/themes.js'
import TaskCard from '../components/TaskCard.jsx'
import BottomNav from '../components/BottomNav.jsx'
import StarBurst from '../components/StarBurst.jsx'

const decoSlots = [
  'v2-deco treehouse',
  'v2-deco flower-a',
  'v2-deco crystal',
  'v2-deco rabbit',
  'v2-deco mushroom',
  'v2-deco helper',
]

export default function MainScreenV2({ child, onTaskComplete, onReorderTasks, onAllDone, onNavChange, navTab }) {
  const theme = THEMES[child.theme]
  const [drag, setDrag] = useState(null)
  const [dragOver, setDragOver] = useState(null)
  const [burst, setBurst] = useState(null)
  const [mood, setMood] = useState('lh-float')

  const done = child.tasks.filter(task => task.done).length
  const total = child.tasks.length || 1
  const progress = Math.round((done / total) * 100)
  const remaining = total - done
  const decorations = (theme.decorations || []).slice(0, Math.min(done + 3, 6))

  function complete(taskId, event) {
    const rect = event.currentTarget.getBoundingClientRect()
    setBurst({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
    setMood('lh-bounce')
    setTimeout(() => setMood('lh-float'), 680)
    onTaskComplete(child.id, taskId)
    if (done + 1 === total) setTimeout(onAllDone, 900)
  }

  function drop() {
    if (drag == null || dragOver == null || drag === dragOver) {
      setDrag(null)
      setDragOver(null)
      return
    }
    onReorderTasks(child.id, drag, dragOver)
    setDrag(null)
    setDragOver(null)
  }

  return (
    <div className="v2-screen">
      {burst && <StarBurst x={burst.x} y={burst.y} onDone={() => setBurst(null)} />}

      <header className="v2-header">
        <div className="v2-user">
          <div className="v2-user-avatar">{child.avatar}</div>
          <div>
            <div className="v2-user-name">{child.name}</div>
            <div className="v2-user-subtitle">Lv.4 冒險家</div>
          </div>
        </div>
        <div className="v2-header-stats">
          <div className="v2-chip"><span>⭐</span><b>{child.badges}</b><small>星光</small></div>
          <div className="v2-chip"><span>🔥</span><b>{child.streak}</b><small>連續</small></div>
          <button className="v2-gift">🎁</button>
        </div>
      </header>

      <main className="v2-content">
        <section className="v2-world" style={{ background: theme.gradient }}>
          <div className="v2-sky" />
          <div className="v2-sun">☀️</div>
          <div className="v2-cloud cloud-1">☁️</div>
          <div className="v2-cloud cloud-2">☁️</div>
          <div className="v2-waterfall" />
          <div className="v2-river" />

          <div className="v2-title-sign">
            <span>{theme.emoji}</span>
            <strong>今天的森林冒險</strong>
          </div>

          {decorations.map((item, index) => (
            <span key={`${item}-${index}`} className={decoSlots[index]}>{item}</span>
          ))}

          <button
            className={`v2-hero ${mood}`}
            onClick={() => { setMood('lh-wiggle'); setTimeout(() => setMood('lh-float'), 520) }}
            aria-label="跟角色互動"
          >
            {theme.char}
          </button>

          <div className="v2-bubble">
            {done === total
              ? `太棒了！${theme.completionPhrase}`
              : done === 0
                ? '我們一起讓森林更有光彩！'
                : `已完成 ${done} 件，還差 ${remaining} 件。`
            }
          </div>

          <div className="v2-ground" />

          <div className="v2-progress-card">
            <div>
              <div className="v2-progress-title">{theme.worldLabel}</div>
              <div className="v2-track"><i style={{ width: `${progress}%`, background: theme.accentD }} /></div>
            </div>
            <b>{progress}%</b>
          </div>
        </section>

        <section className="v2-tasks">
          <div className="v2-task-title-row">
            <div>
              <h2>{theme.taskTitle}</h2>
              <p>拖曳卡片，排出今天想做的順序。</p>
            </div>
            <div className="v2-count">{done}/{total}</div>
          </div>

          <div className="v2-task-stack">
            {child.tasks.map((task, index) => (
              <div
                key={task.id}
                draggable={!task.done}
                onDragStart={() => setDrag(task.id)}
                onDragEnter={() => setDragOver(task.id)}
                onDragEnd={drop}
                onDragOver={event => event.preventDefault()}
                className="lh-fadeup"
                style={{ animationDelay: `${index * 45}ms` }}
              >
                <TaskCard
                  task={task}
                  themeKey={child.theme}
                  onComplete={event => complete(task.id, event)}
                  isDragging={drag === task.id}
                  isDragOver={dragOver === task.id && drag !== task.id}
                />
              </div>
            ))}
          </div>

          <button className="v2-start" onClick={done === total ? onAllDone : undefined}>
            {done === total ? '🎉 查看今日成就' : '▶ 開始今天的冒險'}
          </button>
        </section>
      </main>

      <BottomNav active={navTab} onChange={onNavChange} />
    </div>
  )
}

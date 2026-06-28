import { useState } from 'react'
import { THEMES } from '../data/themes.js'
import TaskCard from '../components/TaskCard.jsx'
import BottomNav from '../components/BottomNav.jsx'
import StarBurst from '../components/StarBurst.jsx'

export default function MainScreenV2({ child, onTaskComplete, onReorderTasks, onAllDone, onNavChange, navTab }) {
  const theme = THEMES[child.theme]
  const [drag, setDrag] = useState(null)
  const [dragOver, setDragOver] = useState(null)
  const [burst, setBurst] = useState(null)
  const done = child.tasks.filter(task => task.done).length
  const total = child.tasks.length || 1
  const progress = Math.round((done / total) * 100)

  function complete(taskId, event) {
    const rect = event.currentTarget.getBoundingClientRect()
    setBurst({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
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
            <div className="v2-user-subtitle">Adventure helper</div>
          </div>
        </div>
        <div className="v2-header-stats">
          <div className="v2-chip"><span>{child.badges}</span><small>stars</small></div>
          <div className="v2-chip"><span>{child.streak}</span><small>days</small></div>
        </div>
      </header>
      <main className="v2-content">
        <section className="v2-world" style={{ background: theme.gradient }}>
          <div className="v2-sign"><strong>Today Adventure</strong></div>
          <button className="v2-hero">{theme.char}</button>
          <div className="v2-bubble">{done === total ? theme.completionPhrase : theme.story}</div>
          <div className="v2-progress-card">
            <div className="v2-track"><i style={{ width: `${progress}%`, background: theme.accentD }} /></div>
            <b>{progress}%</b>
          </div>
        </section>
        <section className="v2-tasks">
          <div className="v2-task-title-row"><h2>{theme.taskTitle}</h2><div className="v2-count">{done}/{total}</div></div>
          <div className="v2-task-stack">
            {child.tasks.map(task => (
              <div key={task.id} draggable={!task.done} onDragStart={() => setDrag(task.id)} onDragEnter={() => setDragOver(task.id)} onDragEnd={drop} onDragOver={event => event.preventDefault()}>
                <TaskCard task={task} themeKey={child.theme} onComplete={event => complete(task.id, event)} isDragging={drag === task.id} isDragOver={dragOver === task.id && drag !== task.id} />
              </div>
            ))}
          </div>
          <button className="v2-start" onClick={done === total ? onAllDone : undefined}>Start adventure</button>
        </section>
      </main>
      <BottomNav active={navTab} onChange={onNavChange} />
    </div>
  )
}

import { useState } from 'react'
import { THEMES } from '../data/themes.js'

export default function TaskCard({ task, themeKey, onComplete, isDragOver, isDragging }) {
  const th = THEMES[themeKey]
  const [hovering, setHovering] = useState(false)

  return (
    <div className="task-card-v2" draggable={!task.done} style={{
      background: task.done ? `linear-gradient(135deg, ${th.accent}28, rgba(255,255,255,.9))` : 'linear-gradient(135deg, rgba(255,255,255,.98), rgba(255,247,232,.9))',
      borderColor: task.done ? `${th.accent}66` : 'rgba(122,91,59,.08)',
      boxShadow: isDragOver && !isDragging ? `0 0 0 4px ${th.accentD}55, 0 18px 34px rgba(74,52,40,.18)` : '0 10px 24px rgba(74,52,40,.1)',
      transform: isDragOver && !isDragging ? 'scale(1.018)' : isDragging ? 'scale(.985)' : 'scale(1)',
      cursor: task.done ? 'default' : 'grab',
      opacity: isDragging ? 0.72 : 1,
    }}>
      <div className="task-card-drag">⋮⋮</div>

      <div className="task-card-icon" style={{ background: `linear-gradient(135deg, #fff, ${th.bg})` }}>
        {task.icon}
      </div>

      <div className="task-card-copy">
        <div className="task-card-title-row">
          <strong>{task.label}</strong>
          {task.done && <span style={{ color: th.accentD }}>完成</span>}
        </div>
        <p>{task.story}</p>
      </div>

      <div className="task-card-points" style={{ color: th.accentD, background: `${th.accent}33` }}>
        +{task.points}
      </div>

      {task.done ? (
        <div className="task-card-check done" style={{ background: `linear-gradient(135deg, ${th.accentD}, ${th.accent})` }}>✓</div>
      ) : (
        <button
          className="task-card-check"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onClick={onComplete}
          aria-label={`完成${task.label}`}
          style={{
            background: hovering ? `linear-gradient(135deg, ${th.accentD}, ${th.accent})` : '#fff',
            borderColor: hovering ? th.accentD : '#E7D8C5',
            color: hovering ? '#fff' : '#E7D8C5',
          }}
        >✓</button>
      )}
    </div>
  )
}

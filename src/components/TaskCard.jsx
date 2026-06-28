// TaskCard.jsx
import { useState } from 'react'
import { THEMES } from '../data/themes.js'

export default function TaskCard({ task, themeKey, onComplete, isDragOver, isDragging }) {
  const th = THEMES[themeKey]
  const [hovering, setHovering] = useState(false)

  return (
    <div
      draggable={!task.done}
      style={{
        background:  task.done ? `${th.accent}22` : '#FFFFFF',
        borderRadius: 20,
        padding: '11px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: isDragOver && !isDragging
          ? `0 0 0 3px ${th.accentD}, 0 6px 20px rgba(0,0,0,.12)`
          : '0 3px 12px rgba(0,0,0,.08)',
        transform: isDragOver && !isDragging ? 'scale(1.02)' : 'scale(1)',
        transition: 'all .22s',
        border: `2px solid ${task.done ? th.accent + '44' : 'transparent'}`,
        cursor: task.done ? 'default' : 'grab',
        opacity: task.done ? 0.78 : 1,
      }}
    >
      {/* drag handle */}
      <div style={{ color: '#ccc', fontSize: 14, cursor: 'grab', flexShrink: 0 }}>⠿</div>

      {/* icon badge */}
      <div style={{
        fontSize: 26,
        width: 44,
        height: 44,
        borderRadius: 13,
        background: task.done ? `${th.accent}33` : '#FFF7E8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {task.icon}
      </div>

      {/* text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14,
          fontWeight: 800,
          color: task.done ? '#8B7566' : '#4A3428',
          textDecoration: task.done ? 'line-through' : 'none',
        }}>
          {task.label}
        </div>
        <div style={{ fontSize: 11, color: '#8B7566', marginTop: 1 }}>
          {task.story}
        </div>
      </div>

      {/* points */}
      <div style={{ fontSize: 11, color: th.accentD, fontWeight: 700, flexShrink: 0 }}>
        +{task.points}pt
      </div>

      {/* complete button / checkmark */}
      {task.done ? (
        <div style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: th.accentD,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 15,
          color: '#fff',
          flexShrink: 0,
          boxShadow: `0 2px 8px ${th.accentD}88`,
        }}>✓</div>
      ) : (
        <button
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onClick={onComplete}
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: hovering ? th.accentD : '#f5f5f5',
            border: `2.5px solid ${hovering ? th.accentD : '#ddd'}`,
            cursor: 'pointer',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            color: hovering ? '#fff' : 'transparent',
            transition: 'all .15s',
            fontFamily: 'inherit',
          }}
        >
          ✓
        </button>
      )}
    </div>
  )
}

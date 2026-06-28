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
        minHeight: 88,
        background: task.done
          ? `linear-gradient(135deg, ${th.accent}28, rgba(255,255,255,.86))`
          : 'linear-gradient(135deg, rgba(255,255,255,.96), rgba(255,247,232,.86))',
        borderRadius: 28,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        boxShadow: isDragOver && !isDragging
          ? `0 0 0 4px ${th.accentD}55, 0 18px 34px rgba(74,52,40,.18)`
          : task.done
            ? '0 8px 22px rgba(74,52,40,.08)'
            : '0 12px 26px rgba(74,52,40,.11)',
        transform: isDragOver && !isDragging ? 'scale(1.018)' : isDragging ? 'scale(.985)' : 'scale(1)',
        transition: 'all .22s ease',
        border: `2px solid ${task.done ? th.accent + '66' : 'rgba(122,91,59,.08)'}`,
        cursor: task.done ? 'default' : 'grab',
        opacity: isDragging ? 0.72 : 1,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        background: task.done ? `radial-gradient(circle at 86% 18%, ${th.accent}55, transparent 22%)` : 'none',
        pointerEvents: 'none',
      }} />

      <div style={{
        color: task.done ? '#C9B8A8' : '#B9A898',
        fontSize: 18,
        cursor: task.done ? 'default' : 'grab',
        flexShrink: 0,
        position: 'relative',
        zIndex: 1,
        letterSpacing: -4,
      }}>⋮⋮</div>

      <div style={{
        fontSize: 30,
        width: 58,
        height: 58,
        borderRadius: 20,
        background: task.done
          ? `linear-gradient(135deg, ${th.accent}66, #fff)`
          : `linear-gradient(135deg, #fff, ${th.bg})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.7), 0 8px 18px rgba(74,52,40,.1)',
        position: 'relative',
        zIndex: 1,
      }}>
        {task.icon}
      </div>

      <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 4,
        }}>
          <div style={{
            fontSize: 18,
            fontWeight: 900,
            color: task.done ? '#7D6A5C' : '#4A3428',
            lineHeight: 1.2,
          }}>
            {task.label}
          </div>
          {task.done && (
            <span style={{
              fontSize: 11,
              fontWeight: 900,
              color: th.accentD,
              background: '#fff',
              borderRadius: 999,
              padding: '3px 8px',
              boxShadow: '0 4px 10px rgba(74,52,40,.08)',
            }}>
              完成章
            </span>
          )}
        </div>
        <div style={{ fontSize: 13, color: '#8B7566', lineHeight: 1.35, fontWeight: 700 }}>
          {task.story}
        </div>
      </div>

      <div style={{
        fontSize: 12,
        color: th.accentD,
        fontWeight: 900,
        flexShrink: 0,
        background: `${th.accent}33`,
        borderRadius: 999,
        padding: '5px 9px',
        position: 'relative',
        zIndex: 1,
      }}>
        +{task.points} 星光
      </div>

      {task.done ? (
        <div style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${th.accentD}, ${th.accent})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          color: '#fff',
          flexShrink: 0,
          boxShadow: `0 8px 18px ${th.accentD}55`,
          position: 'relative',
          zIndex: 1,
        }}>✓</div>
      ) : (
        <button
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onClick={onComplete}
          aria-label={`完成${task.label}`}
          style={{
            width: 46,
            height: 46,
            borderRadius: '50%',
            background: hovering ? `linear-gradient(135deg, ${th.accentD}, ${th.accent})` : '#fff',
            border: `3px solid ${hovering ? th.accentD : '#E7D8C5'}`,
            cursor: 'pointer',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            color: hovering ? '#fff' : '#E7D8C5',
            transition: 'all .15s',
            fontFamily: 'inherit',
            boxShadow: hovering ? `0 8px 18px ${th.accentD}44` : '0 4px 12px rgba(74,52,40,.08)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          ✓
        </button>
      )}
    </div>
  )
}

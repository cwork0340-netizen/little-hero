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
        minHeight: 92,
        background: task.done
          ? `linear-gradient(135deg, ${th.accent}28, rgba(255,255,255,.86))`
          : 'linear-gradient(135deg, rgba(255,255,255,.96), rgba(255,247,232,.86))',
        borderRadius: 26,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(10px, 2.4vw, 16px)',
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

      {task.done && (
        <span style={{
          position: 'absolute',
          top: 10,
          right: 10,
          fontSize: 10,
          fontWeight: 900,
          color: th.accentD,
          background: '#fff',
          borderRadius: 999,
          padding: '3px 9px',
          boxShadow: '0 4px 10px rgba(74,52,40,.08)',
          zIndex: 2,
        }}>
          完成章
        </span>
      )}

      {/* 圖示 */}
      <div style={{
        fontSize: 28,
        width: 'clamp(46px, 11vw, 58px)',
        height: 'clamp(46px, 11vw, 58px)',
        borderRadius: 18,
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

      {/* 任務名稱／故事句 */}
      <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: 'clamp(15px, 3vw, 18px)',
          fontWeight: 900,
          color: task.done ? '#7D6A5C' : '#4A3428',
          lineHeight: 1.25,
          marginBottom: 3,
        }}>
          {task.label}
        </div>
        <div style={{
          fontSize: 'clamp(11px, 2.4vw, 13px)',
          color: '#8B7566',
          lineHeight: 1.35,
          fontWeight: 700,
        }}>
          {task.story}
        </div>
      </div>

      {/* 星光點數 */}
      <div style={{
        fontSize: 'clamp(11px, 2.2vw, 12px)',
        color: th.accentD,
        fontWeight: 900,
        flexShrink: 0,
        background: `${th.accent}33`,
        borderRadius: 999,
        padding: '5px 9px',
        position: 'relative',
        zIndex: 1,
        whiteSpace: 'nowrap',
      }}>
        +{task.points}
      </div>

      {/* 完成按鈕 */}
      {task.done ? (
        <div style={{
          width: 42,
          height: 42,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${th.accentD}, ${th.accent})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
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
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: hovering ? `linear-gradient(135deg, ${th.accentD}, ${th.accent})` : '#fff',
            border: `3px solid ${hovering ? th.accentD : '#E7D8C5'}`,
            cursor: 'pointer',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 17,
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

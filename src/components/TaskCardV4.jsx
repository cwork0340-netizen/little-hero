// TaskCardV4.jsx — village task card, real icon art, touch-friendly reorder arrows
import { useState } from 'react'
import { COLOR } from '../styles/tokens.js'

const BADGE_ICON = '/assets/little-hero-v4/ui/star.webp'

function ArrowButton({ dir, disabled, onClick, label }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{
        width: 38,
        height: 36,
        border: 'none',
        borderRadius: 12,
        background: disabled ? 'transparent' : '#EAD9BE',
        color: disabled ? '#D8CFBE' : '#8A6A3A',
        fontSize: 16,
        fontWeight: 900,
        cursor: disabled ? 'default' : 'pointer',
        fontFamily: 'inherit',
        padding: 0,
        lineHeight: 1,
      }}
    >
      {dir === 'up' ? '▲' : '▼'}
    </button>
  )
}

export default function TaskCardV4({ task, onComplete, onMoveUp, onMoveDown, canMoveUp, canMoveDown }) {
  const [hovering, setHovering] = useState(false)

  return (
    <div
      className={`v3-card${task.done ? ' is-done' : ''}`}
      style={{
        background: task.done
          ? `linear-gradient(135deg, ${COLOR.green}28, rgba(255,255,255,.86))`
          : 'linear-gradient(135deg, rgba(255,255,255,.96), rgba(255,249,243,.86))',
        boxShadow: task.done
          ? '0 8px 22px rgba(62,62,62,.08)'
          : '0 12px 26px rgba(62,62,62,.11)',
        border: `2px solid ${task.done ? COLOR.green + '66' : 'rgba(62,62,62,.08)'}`,
      }}
    >
      {task.done && (
        <span className="v3-card-done-tag" style={{ color: COLOR.green }}>
          <img src={BADGE_ICON} alt="" />
          完成章
        </span>
      )}

      {!task.done && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
          <ArrowButton dir="up" disabled={!canMoveUp} onClick={onMoveUp} label={`把${task.label}往上移`} />
          <ArrowButton dir="down" disabled={!canMoveDown} onClick={onMoveDown} label={`把${task.label}往下移`} />
        </div>
      )}

      <div className="v3-card-icon" style={{
        background: task.done
          ? `linear-gradient(135deg, ${COLOR.green}55, #fff)`
          : `linear-gradient(135deg, #fff, ${COLOR.cream})`,
      }}>
        {task.icon.startsWith('/')
          ? <img src={task.icon} alt={task.label} />
          : <span style={{ fontSize: 26 }}>{task.icon}</span>}
      </div>

      <div className="v3-card-body">
        <div className="v3-card-label" style={{ color: task.done ? '#7D7D7D' : COLOR.ink }}>
          {task.label}
        </div>
      </div>

      <div className="v3-card-points" style={{
        color: '#3E8A47',
        background: `${COLOR.green}33`,
      }}>
        +{task.points}
      </div>

      {task.done ? (
        <div className="v3-card-check" style={{
          background: `linear-gradient(135deg, #3E8A47, ${COLOR.green})`,
          color: '#fff',
          boxShadow: `0 8px 18px ${COLOR.green}55`,
        }}>✓</div>
      ) : (
        <button
          className="v3-card-check"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onClick={onComplete}
          aria-label={`完成${task.label}`}
          style={{
            background: hovering ? `linear-gradient(135deg, #3E8A47, ${COLOR.green})` : '#fff',
            border: `3px solid ${hovering ? '#3E8A47' : '#E7DCCB'}`,
            color: hovering ? '#fff' : '#E7DCCB',
            boxShadow: hovering ? `0 8px 18px ${COLOR.green}44` : '0 4px 12px rgba(62,62,62,.08)',
          }}
        >
          ✓
        </button>
      )}
    </div>
  )
}

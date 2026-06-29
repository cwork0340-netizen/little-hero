// TaskCardV3.jsx — V3 storybook task card (SVG icons, no emoji as primary visual)
import { useState } from 'react'
import { THEMES } from '../data/themes.js'

const ICON_MAP = {
  '收書包':     '/assets/little-hero-v3/icons/tasks/backpack.svg',
  '洗餐具':     '/assets/little-hero-v3/icons/tasks/dishes.svg',
  '洗澡':       '/assets/little-hero-v3/icons/tasks/bath.svg',
  '作業完成':   '/assets/little-hero-v3/icons/tasks/homework.svg',
  '聯絡簿簽名': '/assets/little-hero-v3/icons/tasks/contact_book.svg',
}

const BADGE_ICON = '/assets/little-hero-v3/effects/badge.svg'

export default function TaskCardV3({ task, themeKey, onComplete, isDragOver, isDragging }) {
  const th = THEMES[themeKey]
  const [hovering, setHovering] = useState(false)
  const iconSrc = ICON_MAP[task.label]

  return (
    <div
      className="v3-card"
      draggable={!task.done}
      style={{
        background: task.done
          ? `linear-gradient(135deg, ${th.accent}28, rgba(255,255,255,.86))`
          : 'linear-gradient(135deg, rgba(255,255,255,.96), rgba(255,247,232,.86))',
        boxShadow: isDragOver && !isDragging
          ? `0 0 0 4px ${th.accentD}55, 0 18px 34px rgba(74,52,40,.18)`
          : task.done
            ? '0 8px 22px rgba(74,52,40,.08)'
            : '0 12px 26px rgba(74,52,40,.11)',
        transform: isDragOver && !isDragging ? 'scale(1.018)' : isDragging ? 'scale(.985)' : 'scale(1)',
        border: `2px solid ${task.done ? th.accent + '66' : 'rgba(122,91,59,.08)'}`,
        cursor: task.done ? 'default' : 'grab',
        opacity: isDragging ? 0.72 : 1,
      }}
    >
      {task.done && (
        <span className="v3-card-done-tag" style={{ color: th.accentD }}>
          <img src={BADGE_ICON} alt="" />
          完成章
        </span>
      )}

      {/* 圖示 */}
      <div className="v3-card-icon" style={{
        background: task.done
          ? `linear-gradient(135deg, ${th.accent}66, #fff)`
          : `linear-gradient(135deg, #fff, ${th.bg})`,
      }}>
        {iconSrc ? <img src={iconSrc} alt={task.label} /> : <span style={{ fontSize: 28 }}>{task.icon}</span>}
      </div>

      {/* 任務名稱／故事句 */}
      <div className="v3-card-body">
        <div className="v3-card-label" style={{ color: task.done ? '#7D6A5C' : '#4A3428' }}>
          {task.label}
        </div>
        <div className="v3-card-story">
          {task.story}
        </div>
      </div>

      {/* 星光點數 */}
      <div className="v3-card-points" style={{
        color: th.accentD,
        background: `${th.accent}33`,
      }}>
        +{task.points}
      </div>

      {/* 完成按鈕 */}
      {task.done ? (
        <div className="v3-card-check" style={{
          background: `linear-gradient(135deg, ${th.accentD}, ${th.accent})`,
          color: '#fff',
          boxShadow: `0 8px 18px ${th.accentD}55`,
        }}>✓</div>
      ) : (
        <button
          className="v3-card-check"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onClick={onComplete}
          aria-label={`完成${task.label}`}
          style={{
            background: hovering ? `linear-gradient(135deg, ${th.accentD}, ${th.accent})` : '#fff',
            border: `3px solid ${hovering ? th.accentD : '#E7D8C5'}`,
            color: hovering ? '#fff' : '#E7D8C5',
            boxShadow: hovering ? `0 8px 18px ${th.accentD}44` : '0 4px 12px rgba(74,52,40,.08)',
          }}
        >
          ✓
        </button>
      )}
    </div>
  )
}

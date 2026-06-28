// pages/SelectChild.jsx
import WoodSign from '../components/WoodSign.jsx'
import { THEMES } from '../data/themes.js'

export default function SelectChild({ children, onSelect, onAddChild }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#FFF7E8',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 28,
      padding: 32,
    }}>
      <WoodSign fontSize={24}>選擇冒險家 🌿</WoodSign>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
        {children.map(ch => {
          const th = THEMES[ch.theme]
          return (
            <button
              key={ch.id}
              onClick={() => onSelect(ch.id)}
              className="lh-fadeup"
              style={{
                background: '#FFFFFF',
                border: `3px solid ${th.accent}`,
                borderRadius: 28,
                padding: '22px 26px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                boxShadow: `0 6px 24px ${th.accent}66`,
                transition: 'transform .2s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{
                fontSize: 52,
                width: 84,
                height: 84,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${th.bg}, ${th.panelBg})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,.12)',
              }}>
                {ch.avatar}
              </div>
              <div style={{ fontSize: 19, fontWeight: 900, color: '#4A3428' }}>{ch.name}</div>
              <div style={{ display: 'flex', gap: 10, fontSize: 12, color: '#8B7566', fontWeight: 700 }}>
                <span>🔥 {ch.streak}天</span>
                <span>🏅 {ch.badges}枚</span>
              </div>
              <div style={{
                fontSize: 11,
                color: th.accentD,
                fontWeight: 800,
                background: th.bg,
                borderRadius: 10,
                padding: '2px 10px',
              }}>
                {th.emoji} {th.label}
              </div>
            </button>
          )
        })}

        {/* Add child button */}
        <button
          onClick={onAddChild}
          style={{
            background: '#f8f4ef',
            border: '3px dashed #D4B896',
            borderRadius: 28,
            padding: '22px 26px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'transform .2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{
            fontSize: 32,
            width: 84,
            height: 84,
            borderRadius: '50%',
            background: '#efe8df',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            ＋
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#8B7566' }}>新增孩子</div>
        </button>
      </div>

      <div style={{ fontSize: 12, color: '#8B7566' }}>右下角 🔐 可進入家長設定</div>
    </div>
  )
}

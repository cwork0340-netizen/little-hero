// pages/SelectChild.jsx
import WoodSign from '../components/WoodSign.jsx'
import { getHeroLevel } from '../data/hero.js'
import { COLOR } from '../styles/tokens.js'

export default function SelectChild({ children, onSelect, onAddChild }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: COLOR.cream,
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
          const level = getHeroLevel(ch.line, ch.badges)
          return (
            <button
              key={ch.id}
              onClick={() => onSelect(ch.id)}
              className="lh-fadeup"
              style={{
                background: '#FFFFFF',
                border: `3px solid ${COLOR.green}`,
                borderRadius: 28,
                padding: '22px 26px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                boxShadow: `0 6px 24px ${COLOR.green}44`,
                transition: 'transform .2s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{
                width: 84,
                height: 84,
                borderRadius: '50%',
                overflow: 'hidden',
                background: `linear-gradient(135deg, ${COLOR.sky}, ${COLOR.meadow})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,.12)',
              }}>
                <img src={level.idle} alt={ch.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
              </div>
              <div style={{ fontSize: 19, fontWeight: 900, color: COLOR.ink }}>{ch.name}</div>
              <div style={{ display: 'flex', gap: 12, fontSize: 12, color: COLOR.slate, fontWeight: 700, alignItems: 'center' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                  <img src="/assets/little-hero-v4/ui/flame.svg" alt="" style={{ width: 13, height: 15 }} />
                  {ch.streak} 天
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                  <img src="/assets/little-hero-v4/ui/star.webp" alt="" style={{ width: 14, height: 14 }} />
                  {ch.badges} 枚
                </span>
              </div>
              <div style={{
                fontSize: 11,
                color: '#fff',
                fontWeight: 800,
                background: COLOR.green,
                borderRadius: 10,
                padding: '2px 10px',
              }}>
                {level.name}
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

// BottomNav.jsx — 村莊 / 故事 / 任務 / 寶箱 / 我的勇者
const NAV = '/assets/little-hero-v4/nav'
const TABS = [
  { id: 'home',     icon: `${NAV}/village.svg`, label: '村莊'    },
  { id: 'achieve',  icon: `${NAV}/quest.svg`,   label: '成就'    },
  { id: 'rewards',  icon: `${NAV}/chest.svg`,   label: '寶箱'    },
  { id: 'settings', icon: `${NAV}/hero.svg`,    label: '家長'    },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav style={{
      padding: '10px 22px 18px',
      flexShrink: 0,
    }}>
      <div style={{
        maxWidth: 620,
        margin: '0 auto',
        minHeight: 76,
        background: 'rgba(255,255,255,.82)',
        border: '1px solid rgba(255,255,255,.78)',
        borderRadius: 999,
        display: 'flex',
        padding: 8,
        boxShadow: '0 16px 34px rgba(62,62,62,.14)',
        backdropFilter: 'blur(14px)',
      }}>
        {TABS.map(tab => {
          const selected = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              style={{
                flex: 1,
                background: selected ? 'linear-gradient(135deg, #FFD45A, #FFA36A)' : 'transparent',
                border: 'none',
                borderRadius: 999,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '8px 10px',
                fontFamily: 'inherit',
                boxShadow: selected ? '0 10px 20px rgba(255,163,106,.32)' : 'none',
                transition: 'all .2s ease',
              }}
            >
              <img src={tab.icon} alt="" style={{ width: 22, height: 22, opacity: selected ? 1 : .45 }} />
              <span style={{
                fontSize: 13,
                fontWeight: selected ? 900 : 800,
                color: selected ? '#3E3E3E' : '#6D808C',
              }}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

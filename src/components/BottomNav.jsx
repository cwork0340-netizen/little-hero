// BottomNav.jsx
const TABS = [
  { id: 'home',     icon: '🏠', label: '首頁'  },
  { id: 'achieve',  icon: '⭐', label: '成就'  },
  { id: 'rewards',  icon: '🎁', label: '獎勵'  },
  { id: 'chars',    icon: '🐾', label: '角色'  },
  { id: 'settings', icon: '⚙️', label: '設定'  },
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
        boxShadow: '0 16px 34px rgba(74,52,40,.14)',
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
                background: selected ? 'linear-gradient(135deg, #FFB6B9, #FFD166)' : 'transparent',
                border: 'none',
                borderRadius: 999,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '8px 10px',
                fontFamily: 'inherit',
                color: selected ? '#4A3428' : '#8B7566',
                boxShadow: selected ? '0 10px 20px rgba(255,182,185,.28)' : 'none',
                transition: 'all .2s ease',
              }}
            >
              <span style={{ fontSize: 24 }}>{tab.icon}</span>
              <span style={{
                fontSize: 13,
                fontWeight: selected ? 900 : 800,
                display: selected ? 'inline' : 'none',
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

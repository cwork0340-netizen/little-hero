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
    <div style={{
      background: 'linear-gradient(180deg, #FFF7E8, #F3E8D0)',
      borderTop: '2px solid #E8D5B8',
      display: 'flex',
      padding: '6px 0 4px',
      flexShrink: 0,
    }}>
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            padding: '4px 0',
            fontFamily: 'inherit',
          }}
        >
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: active === tab.id ? '#FFB6B9' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            boxShadow: active === tab.id ? '0 3px 10px rgba(255,182,185,.5)' : 'none',
            transition: 'all .2s',
          }}>
            {tab.icon}
          </div>
          <span style={{
            fontSize: 10,
            fontWeight: active === tab.id ? 800 : 600,
            color: active === tab.id ? '#4A3428' : '#8B7566',
          }}>
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  )
}

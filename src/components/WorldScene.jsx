import ProgressBar from './ProgressBar.jsx'

const POSITIONS = [
  { left: '7%', top: '18%', size: 42, delay: '0s' },
  { left: '17%', bottom: '22%', size: 46, delay: '.4s' },
  { right: '12%', top: '20%', size: 40, delay: '.8s' },
  { right: '8%', bottom: '30%', size: 54, delay: '.2s' },
  { left: '9%', bottom: '8%', size: 40, delay: '1.1s' },
  { right: '23%', bottom: '10%', size: 34, delay: '.7s' },
]

export default function WorldScene({ theme, done, total, pct, worldPct, charAnim, onCharacterClick }) {
  const decorations = theme.decorations || []
  const light = Math.min(1, 0.42 + pct / 160)

  return (
    <section
      className="world-scene"
      style={{
        '--world-light': light,
        flex: '1 1 0',
        minHeight: 0,
        borderRadius: 34,
        background: theme.gradient,
        boxShadow: 'inset 0 -40px 90px rgba(74,52,40,.08), 0 24px 50px rgba(74,52,40,.14)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div className="world-hill" />

      {decorations.slice(0, 6).map((item, index) => {
        const pos = POSITIONS[index]
        return (
          <div
            key={`${item}-${index}`}
            className="scene-decoration lh-sparkle"
            style={{ ...pos, fontSize: pos.size, animationDelay: pos.delay, opacity: index < done + 2 ? 1 : 0.28 }}
          >
            {item}
          </div>
        )
      })}

      <div style={{ position: 'relative', zIndex: 5, maxWidth: 440 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 14px',
          borderRadius: 999,
          background: 'rgba(255,255,255,.72)',
          color: '#5B4638',
          fontSize: 13,
          fontWeight: 900,
          boxShadow: '0 8px 20px rgba(74,52,40,.1)',
        }}>
          <span>{theme.emoji}</span>
          <span>{theme.label}</span>
        </div>

        <h1 style={{
          marginTop: 16,
          fontSize: 'clamp(34px, 4vw, 54px)',
          lineHeight: 1.05,
          fontWeight: 900,
          color: '#4A3428',
          letterSpacing: '-.03em',
          textShadow: '0 2px 0 rgba(255,255,255,.45)',
        }}>
          今天的冒險
        </h1>
        <p style={{
          marginTop: 10,
          fontSize: 17,
          fontWeight: 800,
          color: '#6C584B',
          lineHeight: 1.45,
          maxWidth: 360,
        }}>
          {theme.story}
        </p>
      </div>

      <div style={{
        position: 'relative',
        zIndex: 6,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 18,
        minHeight: 210,
      }}>
        <div
          className={`character-stage ${charAnim}`}
          onClick={onCharacterClick}
          style={{ cursor: 'pointer' }}
        >
          <span style={{
            fontSize: 'clamp(92px, 12vw, 156px)',
            lineHeight: 1,
            filter: 'drop-shadow(0 16px 16px rgba(74,52,40,.16))',
          }}>
            {theme.char}
          </span>
        </div>

        <div style={{
          maxWidth: 258,
          background: 'rgba(255,255,255,.86)',
          borderRadius: '24px 24px 24px 8px',
          padding: '16px 18px',
          color: '#4A3428',
          fontSize: 15,
          fontWeight: 800,
          lineHeight: 1.45,
          boxShadow: '0 12px 30px rgba(74,52,40,.12)',
        }}>
          {done === total
            ? `太棒了！${theme.completionPhrase}`
            : done === 0
              ? `${theme.charName}正在等你開始今天的冒險。`
              : `還差 ${total - done} 步，世界就會再亮一點。`
          }
        </div>
      </div>

      <div style={{
        position: 'relative',
        zIndex: 6,
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 12,
        alignItems: 'end',
      }}>
        <ProgressBar pct={worldPct} color={theme.accentD} label={theme.worldLabel} />
        <button style={{
          minHeight: 54,
          padding: '0 16px',
          borderRadius: 18,
          border: '2px solid rgba(122,91,59,.18)',
          background: 'rgba(255,255,255,.84)',
          boxShadow: '0 10px 24px rgba(74,52,40,.12)',
          color: '#4A3428',
          fontSize: 14,
          fontWeight: 900,
          cursor: 'pointer',
        }}>
          🗺️ 世界地圖
        </button>
      </div>
    </section>
  )
}

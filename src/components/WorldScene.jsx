import ProgressBar from './ProgressBar.jsx'

const POSITIONS = [
  { left: '6%', top: '14%', size: 34, delay: '0s' },
  { left: '14%', bottom: '18%', size: 38, delay: '.4s' },
  { right: '10%', top: '16%', size: 32, delay: '.8s' },
  { right: '7%', bottom: '24%', size: 42, delay: '.2s' },
  { left: '8%', bottom: '6%', size: 30, delay: '1.1s' },
  { right: '20%', bottom: '8%', size: 28, delay: '.7s' },
]

export default function WorldScene({ theme, done, total, charAnim, onCharacterClick }) {
  const decorations = theme.decorations || []

  return (
    <section
      className="world-scene"
      style={{
        flexShrink: 0,
        height: 'clamp(260px, 50vh, 480px)',
        borderRadius: 28,
        background: theme.gradient,
        boxShadow: 'inset 0 -30px 70px rgba(74,52,40,.08), 0 18px 40px rgba(74,52,40,.14)',
        padding: 'clamp(14px, 3vw, 24px)',
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

      <div style={{ position: 'relative', zIndex: 5, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          borderRadius: 999,
          background: 'rgba(255,255,255,.72)',
          color: '#5B4638',
          fontSize: 12,
          fontWeight: 900,
          boxShadow: '0 6px 16px rgba(74,52,40,.1)',
        }}>
          <span>{theme.emoji}</span>
          <span>{theme.label}</span>
        </span>
      </div>

      <div style={{
        position: 'relative',
        zIndex: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        minHeight: 0,
      }}>
        <div
          className={`character-stage ${charAnim}`}
          onClick={onCharacterClick}
          style={{ cursor: 'pointer' }}
        >
          <span style={{
            fontSize: 'clamp(96px, 22vw, 168px)',
            lineHeight: 1,
            filter: 'drop-shadow(0 16px 16px rgba(74,52,40,.16))',
          }}>
            {theme.char}
          </span>
        </div>
      </div>

      <div style={{
        position: 'relative',
        zIndex: 6,
        background: 'rgba(255,255,255,.86)',
        borderRadius: '20px 20px 20px 6px',
        padding: '12px 16px',
        color: '#4A3428',
        fontSize: 'clamp(13px, 2vw, 15px)',
        fontWeight: 800,
        lineHeight: 1.4,
        boxShadow: '0 10px 24px rgba(74,52,40,.12)',
        maxWidth: 360,
      }}>
        {done === total
          ? `太棒了！${theme.completionPhrase}`
          : done === 0
            ? `${theme.charName}正在等你開始今天的冒險。`
            : `還差 ${total - done} 步，世界就會再亮一點。`
        }
      </div>

      <div style={{
        position: 'relative',
        zIndex: 6,
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 10,
        alignItems: 'end',
        marginTop: 10,
      }}>
        <ProgressBar pct={Math.round(18 + (done / total) * 72)} color={theme.accentD} label={theme.worldLabel} />
        <button style={{
          minHeight: 44,
          padding: '0 14px',
          borderRadius: 16,
          border: '2px solid rgba(122,91,59,.18)',
          background: 'rgba(255,255,255,.84)',
          boxShadow: '0 8px 18px rgba(74,52,40,.12)',
          color: '#4A3428',
          fontSize: 13,
          fontWeight: 900,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}>
          🗺️ 地圖
        </button>
      </div>
    </section>
  )
}

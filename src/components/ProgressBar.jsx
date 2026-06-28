// ProgressBar.jsx
export default function ProgressBar({ pct, color, label }) {
  return (
    <div>
      {label && (
        <div style={{ fontSize: 11, color: '#8B7566', fontWeight: 700, marginBottom: 4 }}>
          {label}
        </div>
      )}
      <div style={{
        background: '#ddd0b8',
        borderRadius: 20,
        height: 14,
        overflow: 'hidden',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,.12)',
      }}>
        <div style={{
          height: '100%',
          borderRadius: 20,
          background: color,
          width: `${Math.min(pct, 100)}%`,
          transition: 'width .6s ease',
        }} />
      </div>
      <div style={{ fontSize: 11, fontWeight: 800, color: '#4A3428', textAlign: 'right', marginTop: 2 }}>
        {pct}%
      </div>
    </div>
  )
}

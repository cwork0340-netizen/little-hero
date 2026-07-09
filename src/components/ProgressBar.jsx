// ProgressBar.jsx
export default function ProgressBar({
  pct, color, label,
  trackColor = '#ddd0b8', textColor = '#4A3428', labelColor = '#8B7566',
}) {
  return (
    <div>
      {label && (
        <div style={{ fontSize: 11, color: labelColor, fontWeight: 800, marginBottom: 4 }}>
          {label}
        </div>
      )}
      <div style={{
        background: trackColor,
        borderRadius: 20,
        height: 14,
        overflow: 'hidden',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,.25)',
      }}>
        <div style={{
          height: '100%',
          borderRadius: 20,
          background: color,
          width: `${Math.min(pct, 100)}%`,
          transition: 'width .6s ease',
        }} />
      </div>
      <div style={{ fontSize: 11, fontWeight: 800, color: textColor, textAlign: 'right', marginTop: 2 }}>
        {pct}%
      </div>
    </div>
  )
}

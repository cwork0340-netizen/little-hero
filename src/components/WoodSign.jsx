// WoodSign.jsx — 木頭招牌標題元件
export default function WoodSign({ children, fontSize = 22 }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      background: 'linear-gradient(180deg, #D4A55A, #B8832A)',
      borderRadius: 18,
      padding: '9px 26px',
      boxShadow: '0 4px 0 #8B6020, 0 6px 16px rgba(0,0,0,.2)',
      border: '3px solid #C89030',
    }}>
      <span style={{
        fontSize,
        fontWeight: 900,
        color: '#FFF7E0',
        textShadow: '0 2px 4px rgba(0,0,0,.35)',
        letterSpacing: 0.5,
      }}>
        {children}
      </span>
    </div>
  )
}

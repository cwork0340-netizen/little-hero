// pages/RewardsPage.jsx — 小孩看的寶箱頁：獎勵清單＋自己的徽章進度
import WoodSign from '../components/WoodSign.jsx'
import { COLOR } from '../styles/tokens.js'

const CHEST_OPEN   = '/assets/little-hero-v4/ui/chest_open.webp'
const CHEST_CLOSED = '/assets/little-hero-v4/ui/chest_closed.webp'
const STAR_ICON    = '/assets/little-hero-v4/ui/star.webp'

export default function RewardsPage({ child, rewards: rewardsProp, onBack }) {
  const rewards = [...rewardsProp].sort((a, b) => a.badges - b.badges)

  return (
    <div style={{ minHeight: '100vh', background: COLOR.cream, padding: 20 }}>
      <div style={{ maxWidth: 580, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>←</button>
          <WoodSign fontSize={17}>🎁 我的寶箱</WoodSign>
        </div>

        {/* 目前徽章數 */}
        <div style={{
          background: 'linear-gradient(180deg, #FFF9F3, #F3E6CC)',
          border: '2px solid #C89030', borderRadius: 20,
          padding: '14px 18px', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 3px 0 rgba(139,96,32,.3)',
        }}>
          <img src={STAR_ICON} alt="" style={{ width: 36, height: 36 }} />
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#6B4A1E', lineHeight: 1.1 }}>{child.badges} 枚徽章</div>
            <div style={{ fontSize: 12, color: '#8A6A3A', fontWeight: 700 }}>每天完成全部任務就能得到 1 枚！</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rewards.map((r, i) => {
            const reached = child.badges >= r.badges
            const pct = Math.min(100, Math.round((child.badges / r.badges) * 100))
            return (
              <div key={r.id} className="lh-fadeup" style={{
                animationDelay: `${i * 55}ms`,
                background: '#fff', borderRadius: 20, padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: '0 4px 16px rgba(62,62,62,.08)',
                border: reached ? `2px solid ${COLOR.yellow}` : '2px solid #f0e8da',
              }}>
                <img
                  src={reached ? CHEST_OPEN : CHEST_CLOSED}
                  alt=""
                  style={{ width: 52, height: 46, objectFit: 'contain', filter: reached ? 'none' : 'grayscale(.4) opacity(.8)' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 900, color: COLOR.ink }}>{r.icon} {r.label}</div>
                  <div style={{
                    marginTop: 6, height: 14, borderRadius: 14,
                    background: '#EFE6D4', overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', width: `${pct}%`, borderRadius: 14,
                      background: reached
                        ? `linear-gradient(90deg, ${COLOR.yellow}, ${COLOR.orange})`
                        : COLOR.green,
                      transition: 'width .5s ease',
                    }} />
                  </div>
                  <div style={{ fontSize: 11, color: COLOR.slate, fontWeight: 800, marginTop: 4 }}>
                    {reached ? '達成！找爸媽兌換 🎉' : `${child.badges} / ${r.badges} 枚`}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ fontSize: 12, color: COLOR.slate, textAlign: 'center', marginTop: 16, fontWeight: 700 }}>
          兌換獎勵要請爸媽到家長設定裡按「兌換」喔
        </div>
      </div>
    </div>
  )
}

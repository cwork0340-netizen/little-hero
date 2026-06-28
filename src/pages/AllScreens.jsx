// pages/AllDone.jsx
import { useState, useEffect } from 'react'
import { THEMES } from '../data/themes.js'

export function AllDone({ child, onHome }) {
  const th = THEMES[child.theme]
  const [anim, setAnim] = useState('lh-bounce')
  useEffect(() => {
    const iv = setInterval(() => {
      setAnim(''); setTimeout(() => setAnim('lh-bounce'), 60)
    }, 2200)
    return () => clearInterval(iv)
  }, [])

  return (
    <div style={{
      minHeight: '100vh', background: th.bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 20, padding: 28, textAlign: 'center',
    }}>
      <div className="lh-fadeup" style={{ fontSize: 40, fontWeight: 900, color: th.accentD }}>
        🎉 今日冒險完成！
      </div>

      <div className={anim} style={{
        fontSize: 96, display: 'inline-block',
        filter: 'drop-shadow(0 8px 16px rgba(0,0,0,.15))',
      }}>
        {th.char}
      </div>

      <div style={{ fontSize: 17, fontWeight: 700, color: '#4A3428' }}>
        {th.charName}超開心！謝謝你今天的幫忙 🌟
      </div>

      {/* badge card */}
      <div className="lh-glow" style={{
        background: '#fff', borderRadius: 28, padding: '22px 28px',
        boxShadow: '0 8px 28px rgba(0,0,0,.1)', maxWidth: 300, width: '100%',
      }}>
        <div style={{ fontSize: 50 }}>🏅</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#FFD166', marginTop: 8 }}>
          獲得 1 枚冒險徽章！
        </div>
        <div style={{ fontSize: 12, color: '#8B7566', marginTop: 5 }}>
          累積 3 枚可兌換爸媽設定的獎勵
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 14 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              width: 42, height: 42, borderRadius: '50%',
              background: i <= 2 ? '#FFD166' : '#eee',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
              boxShadow: i <= 2 ? '0 2px 10px rgba(255,209,102,.6)' : 'none',
              border: i <= 2 ? '2px solid #f0b800' : '2px solid #ddd',
            }}>
              {i <= 2 ? '🏅' : ''}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: '#8B7566', marginTop: 5 }}>2 / 3 枚 — 還差 1 枚！</div>
      </div>

      <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 320 }}>
        <button onClick={onHome} style={{
          flex: 1, height: 50, background: th.accentD, border: 'none', borderRadius: 25,
          fontSize: 15, fontWeight: 800, color: '#fff', cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(0,0,0,.12)', fontFamily: 'inherit',
        }}>🌟 看我的成就</button>
        <button onClick={onHome} style={{
          flex: 1, height: 50, background: '#fff', border: '2px solid #ddd', borderRadius: 25,
          fontSize: 15, fontWeight: 800, color: '#4A3428', cursor: 'pointer', fontFamily: 'inherit',
        }}>回首頁</button>
      </div>
    </div>
  )
}


// pages/AchievementBook.jsx
import { ACHIEVEMENTS } from '../data/tasks.js'
import WoodSign from '../components/WoodSign.jsx'

export function AchievementBook({ child, onBack }) {
  const th = THEMES[child.theme]
  return (
    <div style={{ minHeight: '100vh', background: '#FFF7E8', padding: 20 }}>
      <div style={{ maxWidth: 580, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>←</button>
          <WoodSign fontSize={17}>✨ 我的成就收藏冊</WoodSign>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {ACHIEVEMENTS.map((a, i) => (
            <div key={a.id} className="lh-fadeup" style={{
              animationDelay: `${i * 55}ms`,
              background: a.unlocked ? '#fff' : '#f4f4f4',
              borderRadius: 20, padding: 16, textAlign: 'center',
              boxShadow: a.unlocked ? '0 4px 18px rgba(0,0,0,.09)' : 'none',
              opacity: a.unlocked ? 1 : 0.45,
              filter: a.unlocked ? 'none' : 'grayscale(1)',
            }}>
              <div style={{ fontSize: 34, marginBottom: 6 }}>{a.unlocked ? a.icon : '🔒'}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#4A3428', lineHeight: 1.4 }}>{a.label}</div>
              {a.unlocked && (
                <div style={{
                  marginTop: 7, fontSize: 10, color: th.accentD, fontWeight: 800,
                  background: th.bg, borderRadius: 8, padding: '2px 8px', display: 'inline-block',
                }}>已解鎖 ✓</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


// pages/ParentPIN.jsx
export function ParentPIN({ onUnlock, onBack }) {
  const [val, setVal] = useState('')
  const [shake, setShake] = useState(false)
  const [wrong, setWrong] = useState(false)

  function press(d) {
    if (val.length >= 4) return
    const next = val + d
    setVal(next)
    if (next.length === 4) {
      if (next === '1234') {
        setTimeout(onUnlock, 200)
      } else {
        setShake(true); setWrong(true)
        setTimeout(() => { setVal(''); setShake(false); setWrong(false) }, 680)
      }
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#EDE8F5',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 16, padding: 28,
    }}>
      <button onClick={onBack} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>←</button>
      <div style={{ fontSize: 38 }}>🔐</div>
      <div style={{ fontSize: 22, fontWeight: 900, color: '#7B5EA7' }}>家長模式</div>
      <div style={{ fontSize: 13, color: '#999', fontWeight: 600 }}>
        {wrong ? '❌ PIN 錯誤，請重試' : '請輸入 PIN 碼（測試：1234）'}
      </div>

      <div className={shake ? 'lh-wiggle' : ''} style={{ display: 'flex', gap: 14 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            width: 16, height: 16, borderRadius: '50%',
            background: i < val.length ? (wrong ? '#e77' : '#7B5EA7') : '#ddd',
            transition: 'background .15s',
          }} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 9, maxWidth: 240, width: '100%', marginTop: 4 }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map((d, i) => (
          <button key={i}
            onClick={() => d === '⌫' ? setVal(v => v.slice(0, -1)) : d !== '' && press(String(d))}
            style={{
              background: d === '' ? 'transparent' : '#fff',
              border: 'none', borderRadius: 14, padding: 14,
              fontSize: 19, fontWeight: 800, color: '#7B5EA7',
              cursor: d === '' ? 'default' : 'pointer',
              boxShadow: d === '' ? 'none' : '0 2px 8px rgba(0,0,0,.07)',
              visibility: d === '' ? 'hidden' : 'visible',
              fontFamily: 'inherit',
            }}>
            {d}
          </button>
        ))}
      </div>
    </div>
  )
}


// pages/ParentDash.jsx
import { DEFAULT_REWARDS } from '../data/tasks.js'

export function ParentDash({ children, setChildren, currentChildId, onBack }) {
  const [tab, setTab] = useState('tasks')
  const [adding, setAdding] = useState(false)
  const [newTask, setNewTask] = useState({ icon: '⭐', label: '', story: '', points: 10 })
  const child = children.find(c => c.id === currentChildId) || children[0]
  const pu = '#7B5EA7', puL = '#EDE8F5'

  function addTask() {
    if (!newTask.label.trim()) return
    setChildren(prev => prev.map(c => c.id === child.id
      ? { ...c, tasks: [...c.tasks, { id: Date.now(), done: false, ...newTask }] }
      : c
    ))
    setNewTask({ icon: '⭐', label: '', story: '', points: 10 })
    setAdding(false)
  }

  function deleteTask(taskId) {
    setChildren(prev => prev.map(c => c.id === child.id
      ? { ...c, tasks: c.tasks.filter(t => t.id !== taskId) }
      : c
    ))
  }

  const tabBtn = (key, label) => (
    <button onClick={() => setTab(key)} style={{
      flex: 1, padding: '9px 0',
      background: tab === key ? pu : 'transparent',
      color: tab === key ? '#fff' : pu,
      border: 'none', borderRadius: 14, fontSize: 12, fontWeight: 800,
      cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s',
    }}>{label}</button>
  )

  return (
    <div style={{ minHeight: '100vh', background: puL, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, maxWidth: 540, margin: '0 auto 16px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>←</button>
        <div style={{ fontSize: 19, fontWeight: 900, color: pu }}>⚙️ 家長設定</div>
        <div style={{ marginLeft: 'auto', fontSize: 13, color: pu, fontWeight: 700 }}>{child.avatar} {child.name}</div>
      </div>

      {/* tabs */}
      <div style={{ background: '#fff', borderRadius: 18, padding: 4, display: 'flex', gap: 3, maxWidth: 540, margin: '0 auto 14px', boxShadow: '0 2px 10px rgba(0,0,0,.07)' }}>
        {tabBtn('tasks', '📋 任務')}
        {tabBtn('rewards', '🎁 獎勵')}
        {tabBtn('stats', '📊 紀錄')}
        {tabBtn('theme', '🎨 主題')}
      </div>

      <div style={{ maxWidth: 540, margin: '0 auto' }}>
        {/* TASKS TAB */}
        {tab === 'tasks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {child.tasks.map(t => (
              <div key={t.id} style={{ background: '#fff', borderRadius: 16, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 2px 10px rgba(0,0,0,.07)' }}>
                <span style={{ fontSize: 24 }}>{t.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#4A3428' }}>{t.label}</div>
                  <div style={{ fontSize: 10, color: '#8B7566' }}>{t.story}</div>
                </div>
                <span style={{ fontSize: 11, color: pu, fontWeight: 700 }}>+{t.points}pt</span>
                <button onClick={() => deleteTask(t.id)} style={{ background: '#feeeed', border: 'none', borderRadius: 9, padding: '3px 9px', cursor: 'pointer', fontSize: 11, color: '#e77', fontWeight: 700 }}>刪除</button>
              </div>
            ))}

            {adding ? (
              <div style={{ background: '#fff', borderRadius: 16, padding: 14, boxShadow: '0 2px 10px rgba(0,0,0,.07)' }}>
                <div style={{ display: 'flex', gap: 5, marginBottom: 7, flexWrap: 'wrap' }}>
                  {['📖', '🎒', '🍽️', '🛁', '🪥', '🏃', '🎨', '🎮', '📝', '🌟'].map(e => (
                    <button key={e} onClick={() => setNewTask(p => ({ ...p, icon: e }))} style={{
                      fontSize: 18, padding: 4, borderRadius: 7, cursor: 'pointer',
                      border: newTask.icon === e ? `2px solid ${pu}` : '2px solid transparent',
                      background: newTask.icon === e ? puL : '#f8f8f8',
                    }}>{e}</button>
                  ))}
                </div>
                <input value={newTask.label} onChange={e => setNewTask(p => ({ ...p, label: e.target.value }))}
                  placeholder="任務名稱" style={{ width: '100%', border: '2px solid #eee', borderRadius: 9, padding: '8px 11px', fontSize: 13, marginBottom: 5 }} />
                <input value={newTask.story} onChange={e => setNewTask(p => ({ ...p, story: e.target.value }))}
                  placeholder="故事短句（選填）" style={{ width: '100%', border: '2px solid #eee', borderRadius: 9, padding: '8px 11px', fontSize: 13, marginBottom: 7 }} />
                <div style={{ display: 'flex', gap: 7 }}>
                  <button onClick={addTask} style={{ flex: 1, background: pu, color: '#fff', border: 'none', borderRadius: 12, padding: '9px 0', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>新增</button>
                  <button onClick={() => setAdding(false)} style={{ flex: 1, background: '#f0f0f0', color: '#4A3428', border: 'none', borderRadius: 12, padding: '9px 0', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>取消</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAdding(true)} style={{ width: '100%', background: pu, color: '#fff', border: 'none', borderRadius: 16, padding: '12px 0', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(123,94,167,.3)' }}>
                ＋ 新增任務
              </button>
            )}
          </div>
        )}

        {/* REWARDS TAB */}
        {tab === 'rewards' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {DEFAULT_REWARDS.map(r => (
              <div key={r.id} style={{ background: '#fff', borderRadius: 16, padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 10px rgba(0,0,0,.07)' }}>
                <span style={{ fontSize: 28 }}>{r.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#4A3428' }}>{r.label}</div>
                  <div style={{ fontSize: 11, color: '#8B7566' }}>需要 {r.badges} 枚徽章</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#FFD166' }}>🏅×{r.badges}</div>
              </div>
            ))}
            <button style={{ width: '100%', background: pu, color: '#fff', border: 'none', borderRadius: 16, padding: '12px 0', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(123,94,167,.3)' }}>
              ＋ 新增獎勵
            </button>
          </div>
        )}

        {/* STATS TAB */}
        {tab === 'stats' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {[
              { l: '本週完成率', v: '85%', icon: '📈', c: '#BFE3C0' },
              { l: '連續天數',   v: `${child.streak} 天`, icon: '🔥', c: '#FFD0A0' },
              { l: '累積徽章',   v: `${child.badges} 枚`, icon: '🏅', c: '#FFE08A' },
              { l: '累積點數',   v: '240 pt', icon: '⭐', c: '#A7D8FF' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 10px rgba(0,0,0,.07)' }}>
                <div style={{ fontSize: 26, width: 44, height: 44, borderRadius: 12, background: `${s.c}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: '#4A3428' }}>{s.l}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: pu }}>{s.v}</div>
              </div>
            ))}
          </div>
        )}

        {/* THEME TAB */}
        {tab === 'theme' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            <div style={{ fontSize: 13, color: '#999', marginBottom: 4, fontWeight: 600 }}>選擇 {child.name} 的冒險世界</div>
            {Object.entries(THEMES).map(([key, th]) => (
              <button key={key}
                onClick={() => !th.locked && setChildren(prev => prev.map(c =>
                  c.id === child.id ? { ...c, theme: key, tasks: makeTasks(key) } : c
                ))}
                style={{
                  background: child.theme === key ? th.accent : '#fff',
                  color: child.theme === key ? '#fff' : '#4A3428',
                  border: child.theme === key ? 'none' : '2px solid #eee',
                  borderRadius: 16, padding: '13px 14px',
                  fontSize: 15, fontWeight: 800, cursor: th.locked ? 'not-allowed' : 'pointer',
                  textAlign: 'left', fontFamily: 'inherit',
                  boxShadow: '0 2px 10px rgba(0,0,0,.07)', transition: 'all .2s',
                  opacity: th.locked ? 0.5 : 1,
                }}>
                {th.char} {th.emoji} {th.label} {th.locked ? '🔒' : ''} {child.theme === key ? '✓' : ''}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

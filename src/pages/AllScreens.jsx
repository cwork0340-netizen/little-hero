// pages/AllScreens.jsx — AllDone / ParentPIN / ParentDash
import { useState, useEffect } from 'react'
import { COLOR } from '../styles/tokens.js'
import { AVATAR, LINE_LABELS } from '../data/avatar.js'
import { TASK_ICON_CHOICES, makeChild } from '../data/tasks.js'
import { todayStr } from '../utils/storage.js'

const STAR_ICON = '/assets/little-hero-v4/ui/star.webp'

// ── 今日任務全部完成 — 疊加式慶祝卡（不整頁跳轉）──
export function AllDone({ child, onClose }) {
  const avatar = AVATAR[child.line] || AVATAR.boy
  const [anim, setAnim] = useState('lh-bounce')
  useEffect(() => {
    const iv = setInterval(() => {
      setAnim(''); setTimeout(() => setAnim('lh-bounce'), 60)
    }, 2200)
    return () => clearInterval(iv)
  }, [])

  const earnedToday = child.badgeAwardedDate === todayStr()

  return (
    <div className="lh-overlay-backdrop" onClick={onClose}>
      <div
        className="lh-fadeup"
        onClick={e => e.stopPropagation()}
        style={{
          background: COLOR.cream, borderRadius: 32, padding: '28px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
          textAlign: 'center', maxWidth: 340, width: '100%',
          boxShadow: '0 24px 60px rgba(0,0,0,.3)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 32, lineHeight: 1 }}>🎉</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: COLOR.green }}>今天全部完成了！</div>
        </div>

        <div className={anim} style={{ width: 110, filter: 'drop-shadow(0 8px 16px rgba(0,0,0,.15))' }}>
          <img src={avatar.cheer} alt="" style={{ width: '100%' }} />
        </div>

        <div className="lh-glow" style={{
          background: '#fff', borderRadius: 24, padding: '18px 22px', width: '100%',
          boxShadow: '0 8px 24px rgba(0,0,0,.08)',
        }}>
          <img src={STAR_ICON} alt="" style={{ width: 42, height: 42 }} />
          <div style={{ fontSize: 17, fontWeight: 900, color: '#E8A800', marginTop: 6 }}>
            {earnedToday ? '獲得 1 枚徽章！' : '今天的任務都完成了！'}
          </div>
          <div style={{ fontSize: 13, fontWeight: 800, color: COLOR.ink, marginTop: 6 }}>
            已累積 {child.badges} 枚徽章
          </div>
          <div style={{ fontSize: 11, color: COLOR.slate, marginTop: 3 }}>
            連續 {child.streak} 天完成 🔥
          </div>
        </div>

        <button onClick={onClose} style={{
          width: '100%', height: 48, background: COLOR.green, border: 'none', borderRadius: 24,
          fontSize: 15, fontWeight: 800, color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
        }}>太棒了！</button>
      </div>
    </div>
  )
}

// ── 家長 PIN（不顯示提示，支援自訂）─────────────
export function ParentPIN({ pin = '1234', onUnlock, onBack }) {
  const [val, setVal] = useState('')
  const [shake, setShake] = useState(false)
  const [wrong, setWrong] = useState(false)

  function press(d) {
    if (val.length >= 4) return
    const next = val + d
    setVal(next)
    if (next.length === 4) {
      if (next === pin) {
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
        {wrong ? '❌ PIN 錯誤，請重試' : '請輸入 4 位數 PIN 碼'}
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

// ── 家長設定 ────────────────────────────────────
export function ParentDash({ children, setChildren, rewards, setRewards, parentPin, setParentPin, currentChildId, onBack }) {
  const [tab, setTab] = useState('tasks')
  const [selectedId, setSelectedId] = useState(currentChildId)
  const [adding, setAdding] = useState(false)
  const [newTask, setNewTask] = useState({ icon: TASK_ICON_CHOICES[0], label: '', points: 10 })
  const [addingReward, setAddingReward] = useState(false)
  const [newReward, setNewReward] = useState({ icon: '🎁', label: '', badges: 3 })
  const [addingChild, setAddingChild] = useState(false)
  const [newChild, setNewChild] = useState({ name: '', line: 'boy' })
  const [pinInput, setPinInput] = useState('')
  const [pinMsg, setPinMsg] = useState('')
  const [confirmRedeem, setConfirmRedeem] = useState(null)

  const child = children.find(c => c.id === selectedId) || children[0]
  const pu = '#7B5EA7', puL = '#EDE8F5'

  function updateChild(id, patch) {
    setChildren(prev => prev.map(c => c.id === id ? { ...c, ...(typeof patch === 'function' ? patch(c) : patch) } : c))
  }

  function addTask() {
    if (!newTask.label.trim()) return
    updateChild(child.id, c => ({ tasks: [...c.tasks, { id: Date.now(), done: false, ...newTask, label: newTask.label.trim() }] }))
    setNewTask({ icon: TASK_ICON_CHOICES[0], label: '', points: 10 })
    setAdding(false)
  }

  function deleteTask(taskId) {
    updateChild(child.id, c => ({ tasks: c.tasks.filter(t => t.id !== taskId) }))
  }

  function addReward() {
    if (!newReward.label.trim() || newReward.badges < 1) return
    setRewards(prev => [...prev, { id: Date.now(), ...newReward, label: newReward.label.trim() }])
    setNewReward({ icon: '🎁', label: '', badges: 3 })
    setAddingReward(false)
  }

  function redeem(reward) {
    updateChild(child.id, c => ({ badges: Math.max(0, c.badges - reward.badges) }))
    setConfirmRedeem(null)
  }

  function addChild() {
    const name = newChild.name.trim()
    if (!name) return
    const id = Math.max(0, ...children.map(c => c.id)) + 1
    setChildren(prev => [...prev, makeChild(id, name, newChild.line)])
    setNewChild({ name: '', line: 'boy' })
    setAddingChild(false)
  }

  function savePin() {
    if (!/^\d{4}$/.test(pinInput)) { setPinMsg('要 4 位數字'); return }
    setParentPin(pinInput)
    setPinInput('')
    setPinMsg('已更新 ✓')
    setTimeout(() => setPinMsg(''), 2000)
  }

  // 真實統計
  const last7 = child.history.slice(-7)
  const completedDays = last7.filter(h => h.completed).length

  const tabBtn = (key, label) => (
    <button onClick={() => setTab(key)} style={{
      flex: 1, padding: '9px 0',
      background: tab === key ? pu : 'transparent',
      color: tab === key ? '#fff' : pu,
      border: 'none', borderRadius: 14, fontSize: 12, fontWeight: 800,
      cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s',
    }}>{label}</button>
  )

  const inputStyle = { width: '100%', border: '2px solid #eee', borderRadius: 9, padding: '8px 11px', fontSize: 13, marginBottom: 7, fontFamily: 'inherit' }

  return (
    <div style={{ minHeight: '100vh', background: puL, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, maxWidth: 540, margin: '0 auto 12px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>←</button>
        <div style={{ fontSize: 19, fontWeight: 900, color: pu }}>⚙️ 家長設定</div>
      </div>

      {/* 孩子切換 */}
      <div style={{ display: 'flex', gap: 6, maxWidth: 540, margin: '0 auto 10px', flexWrap: 'wrap' }}>
        {children.map(c => (
          <button key={c.id} onClick={() => setSelectedId(c.id)} style={{
            padding: '6px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
            background: c.id === child.id ? pu : '#fff', color: c.id === child.id ? '#fff' : pu,
            fontSize: 13, fontWeight: 800, fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(0,0,0,.06)',
          }}>{c.avatar} {c.name}</button>
        ))}
      </div>

      {/* tabs */}
      <div style={{ background: '#fff', borderRadius: 18, padding: 4, display: 'flex', gap: 3, maxWidth: 540, margin: '0 auto 14px', boxShadow: '0 2px 10px rgba(0,0,0,.07)' }}>
        {tabBtn('tasks', '📋 任務')}
        {tabBtn('rewards', '🎁 獎勵')}
        {tabBtn('stats', '📊 紀錄')}
        {tabBtn('kids', '👧 孩子')}
        {tabBtn('settings', '⚙️ 設定')}
      </div>

      <div style={{ maxWidth: 540, margin: '0 auto' }}>
        {/* TASKS TAB */}
        {tab === 'tasks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {child.tasks.map(t => (
              <div key={t.id} style={{ background: '#fff', borderRadius: 16, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 2px 10px rgba(0,0,0,.07)' }}>
                {t.icon.startsWith('/')
                  ? <img src={t.icon} alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                  : <span style={{ fontSize: 24 }}>{t.icon}</span>}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#4A3428' }}>{t.label}</div>
                  {t.done && <div style={{ fontSize: 10, color: '#3E8A47', fontWeight: 700 }}>今天已完成 ✓</div>}
                </div>
                <span style={{ fontSize: 11, color: pu, fontWeight: 700 }}>+{t.points}pt</span>
                {t.done && (
                  <button
                    onClick={() => updateChild(child.id, c => ({ tasks: c.tasks.map(x => x.id === t.id ? { ...x, done: false } : x) }))}
                    style={{ background: '#eef6ee', border: 'none', borderRadius: 9, padding: '3px 9px', cursor: 'pointer', fontSize: 11, color: '#3E8A47', fontWeight: 700 }}>
                    還原
                  </button>
                )}
                <button onClick={() => deleteTask(t.id)} style={{ background: '#feeeed', border: 'none', borderRadius: 9, padding: '3px 9px', cursor: 'pointer', fontSize: 11, color: '#e77', fontWeight: 700 }}>刪除</button>
              </div>
            ))}

            {adding ? (
              <div style={{ background: '#fff', borderRadius: 16, padding: 14, boxShadow: '0 2px 10px rgba(0,0,0,.07)' }}>
                <div style={{ display: 'flex', gap: 5, marginBottom: 7, flexWrap: 'wrap' }}>
                  {TASK_ICON_CHOICES.map(src => (
                    <button key={src} onClick={() => setNewTask(p => ({ ...p, icon: src }))} style={{
                      padding: 4, borderRadius: 9, cursor: 'pointer',
                      border: newTask.icon === src ? `2px solid ${pu}` : '2px solid transparent',
                      background: newTask.icon === src ? puL : '#f8f8f8',
                    }}>
                      <img src={src} alt="" style={{ width: 30, height: 30, objectFit: 'contain', display: 'block' }} />
                    </button>
                  ))}
                </div>
                <input value={newTask.label} onChange={e => setNewTask(p => ({ ...p, label: e.target.value }))}
                  placeholder="任務名稱" style={inputStyle} />
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
            <div style={{ fontSize: 12, color: '#888', fontWeight: 700 }}>{child.name} 目前有 🏅 {child.badges} 枚徽章</div>
            {rewards.map(r => {
              const can = child.badges >= r.badges
              return (
                <div key={r.id} style={{ background: '#fff', borderRadius: 16, padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 10px rgba(0,0,0,.07)' }}>
                  <span style={{ fontSize: 28 }}>{r.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#4A3428' }}>{r.label}</div>
                    <div style={{ fontSize: 11, color: '#8B7566' }}>需要 {r.badges} 枚徽章</div>
                  </div>
                  {confirmRedeem === r.id ? (
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button onClick={() => redeem(r)} style={{ background: '#3E8A47', color: '#fff', border: 'none', borderRadius: 9, padding: '5px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 800, fontFamily: 'inherit' }}>確認扣 {r.badges} 枚</button>
                      <button onClick={() => setConfirmRedeem(null)} style={{ background: '#f0f0f0', border: 'none', borderRadius: 9, padding: '5px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: 'inherit' }}>取消</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => can && setConfirmRedeem(r.id)}
                      disabled={!can}
                      style={{
                        background: can ? pu : '#eee', color: can ? '#fff' : '#aaa',
                        border: 'none', borderRadius: 9, padding: '5px 12px',
                        cursor: can ? 'pointer' : 'not-allowed', fontSize: 12, fontWeight: 800, fontFamily: 'inherit',
                      }}>兌換</button>
                  )}
                </div>
              )
            })}

            {addingReward ? (
              <div style={{ background: '#fff', borderRadius: 16, padding: 14, boxShadow: '0 2px 10px rgba(0,0,0,.07)' }}>
                <div style={{ display: 'flex', gap: 5, marginBottom: 7, flexWrap: 'wrap' }}>
                  {['🎁', '🍦', '🎬', '🧸', '🎡', '🍕', '📱', '⚽', '🎮', '🚲'].map(e => (
                    <button key={e} onClick={() => setNewReward(p => ({ ...p, icon: e }))} style={{
                      fontSize: 18, padding: 4, borderRadius: 7, cursor: 'pointer',
                      border: newReward.icon === e ? `2px solid ${pu}` : '2px solid transparent',
                      background: newReward.icon === e ? puL : '#f8f8f8',
                    }}>{e}</button>
                  ))}
                </div>
                <input value={newReward.label} onChange={e => setNewReward(p => ({ ...p, label: e.target.value }))}
                  placeholder="獎勵名稱" style={inputStyle} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#4A3428' }}>需要徽章：</span>
                  <input type="number" min="1" max="99" value={newReward.badges}
                    onChange={e => setNewReward(p => ({ ...p, badges: Math.max(1, parseInt(e.target.value) || 1) }))}
                    style={{ ...inputStyle, width: 70, marginBottom: 0 }} />
                </div>
                <div style={{ display: 'flex', gap: 7 }}>
                  <button onClick={addReward} style={{ flex: 1, background: pu, color: '#fff', border: 'none', borderRadius: 12, padding: '9px 0', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>新增</button>
                  <button onClick={() => setAddingReward(false)} style={{ flex: 1, background: '#f0f0f0', color: '#4A3428', border: 'none', borderRadius: 12, padding: '9px 0', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>取消</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAddingReward(true)} style={{ width: '100%', background: pu, color: '#fff', border: 'none', borderRadius: 16, padding: '12px 0', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(123,94,167,.3)' }}>
                ＋ 新增獎勵
              </button>
            )}
          </div>
        )}

        {/* STATS TAB — 真實數據 */}
        {tab === 'stats' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {[
              { l: '最近 7 天全部完成', v: `${completedDays} 天`, icon: '📈', c: '#BFE3C0' },
              { l: '連續天數',   v: `${child.streak} 天`, icon: '🔥', c: '#FFD0A0' },
              { l: '累積徽章',   v: `${child.badges} 枚`, icon: '🏅', c: '#FFE08A' },
              { l: '累積點數',   v: `${child.totalPoints || 0} pt`, icon: '⭐', c: '#A7D8FF' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 10px rgba(0,0,0,.07)' }}>
                <div style={{ fontSize: 26, width: 44, height: 44, borderRadius: 12, background: `${s.c}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: '#4A3428' }}>{s.l}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: pu }}>{s.v}</div>
              </div>
            ))}
            {last7.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 16, padding: '14px 16px', boxShadow: '0 2px 10px rgba(0,0,0,.07)' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#4A3428', marginBottom: 10 }}>最近紀錄</div>
                {last7.slice().reverse().map(h => (
                  <div key={h.date} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#8B7566', fontWeight: 700, padding: '4px 0' }}>
                    <span>{h.date}</span>
                    <span>{h.completed ? '✅ 全部完成' : `${h.done}/${h.total}`}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* KIDS TAB */}
        {tab === 'kids' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {children.map(c => (
              <div key={c.id} style={{ background: '#fff', borderRadius: 16, padding: '13px 14px', boxShadow: '0 2px 10px rgba(0,0,0,.07)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>{c.avatar}</span>
                  <input
                    value={c.name}
                    onChange={e => updateChild(c.id, { name: e.target.value })}
                    style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                  />
                  {children.length > 1 && (
                    <button onClick={() => setChildren(prev => prev.filter(x => x.id !== c.id))}
                      style={{ background: '#feeeed', border: 'none', borderRadius: 9, padding: '5px 10px', cursor: 'pointer', fontSize: 11, color: '#e77', fontWeight: 700, fontFamily: 'inherit' }}>刪除</button>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {Object.entries(LINE_LABELS).map(([key, label]) => (
                    <button key={key}
                      onClick={() => updateChild(c.id, { line: key, avatar: key === 'boy' ? '👦' : '👧' })}
                      style={{
                        flex: 1, padding: '7px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                        background: c.line === key ? pu : '#f4f0fa', color: c.line === key ? '#fff' : pu,
                        fontSize: 12, fontWeight: 800, fontFamily: 'inherit',
                      }}>{label}{c.line === key ? ' ✓' : ''}</button>
                  ))}
                </div>
              </div>
            ))}

            {addingChild ? (
              <div style={{ background: '#fff', borderRadius: 16, padding: 14, boxShadow: '0 2px 10px rgba(0,0,0,.07)' }}>
                <input value={newChild.name} onChange={e => setNewChild(p => ({ ...p, name: e.target.value }))}
                  placeholder="孩子的名字" style={inputStyle} />
                <div style={{ display: 'flex', gap: 6, marginBottom: 7 }}>
                  {Object.entries(LINE_LABELS).map(([key, label]) => (
                    <button key={key} onClick={() => setNewChild(p => ({ ...p, line: key }))}
                      style={{
                        flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                        background: newChild.line === key ? pu : '#f4f0fa', color: newChild.line === key ? '#fff' : pu,
                        fontSize: 12, fontWeight: 800, fontFamily: 'inherit',
                      }}>{label}{newChild.line === key ? ' ✓' : ''}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 7 }}>
                  <button onClick={addChild} style={{ flex: 1, background: pu, color: '#fff', border: 'none', borderRadius: 12, padding: '9px 0', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>新增</button>
                  <button onClick={() => setAddingChild(false)} style={{ flex: 1, background: '#f0f0f0', color: '#4A3428', border: 'none', borderRadius: 12, padding: '9px 0', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>取消</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAddingChild(true)} style={{ width: '100%', background: pu, color: '#fff', border: 'none', borderRadius: 16, padding: '12px 0', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(123,94,167,.3)' }}>
                ＋ 新增孩子
              </button>
            )}
          </div>
        )}

        {/* SETTINGS TAB：家長 PIN */}
        {tab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 14, boxShadow: '0 2px 10px rgba(0,0,0,.07)' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#4A3428', marginBottom: 8 }}>🔐 修改家長 PIN</div>
              <div style={{ display: 'flex', gap: 7 }}>
                <input
                  type="password" inputMode="numeric" maxLength={4}
                  value={pinInput}
                  onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="新的 4 位數 PIN"
                  style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                />
                <button onClick={savePin} style={{ background: pu, color: '#fff', border: 'none', borderRadius: 12, padding: '0 18px', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>儲存</button>
              </div>
              {pinMsg && <div style={{ fontSize: 12, color: pinMsg.includes('✓') ? '#3E8A47' : '#e77', fontWeight: 700, marginTop: 6 }}>{pinMsg}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

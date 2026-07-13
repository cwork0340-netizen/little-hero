import { useEffect, useMemo, useState } from 'react'
import { AVATAR, LINE_LABELS } from './data/avatar.js'
import {
  CHILDREN_INIT,
  DEFAULT_REWARDS,
  QUICK_TASKS,
  TASK_ICON_CHOICES,
  makeChild,
} from './data/tasks.js'
import { DEFAULT_PARENTS, iconForReward, loadState, saveState, todayStr, yesterdayStr } from './utils/storage.js'

const STAR_ICON = '/assets/little-hero-v4/ui/star.webp'
const FLAME_ICON = '/assets/little-hero-v4/ui/flame.svg'

function applyDailyReset(child) {
  const today = todayStr()
  if (child.lastPlayedDate === today) return child
  const keepStreak = child.lastCompletedDate === today || child.lastCompletedDate === yesterdayStr()
  return {
    ...child,
    lastPlayedDate: today,
    streak: keepStreak ? child.streak : 0,
    tasks: child.tasks.map((task) => ({ ...task, done: false })),
  }
}

function clampNumber(value, min, max) {
  const n = Number(value)
  if (!Number.isFinite(n)) return min
  return Math.min(max, Math.max(min, n))
}

function todayMessage(done, total) {
  if (total === 0) return '今天還沒有任務，可以自己新增一件小事。'
  if (done === total) return '今天的小任務都完成了，做得很好。'
  if (done === 0) return '慢慢來，一件一件完成就很好。'
  return `已經完成 ${done} 件了，剩下 ${total - done} 件。`
}

function createTask(task) {
  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    icon: task.icon || TASK_ICON_CHOICES[0],
    label: task.label,
    hint: task.hint || '這是自己加上的小任務。',
    points: Number.isFinite(task.points) ? task.points : 10,
    done: false,
  }
}

function ScreenButton({ active, children, onClick }) {
  return (
    <button className={active ? 'lh-nav-button is-active' : 'lh-nav-button'} onClick={onClick}>
      {children}
    </button>
  )
}

function ChildSwitcher({ childrenList, activeId, onSelect, onAdd }) {
  return (
    <div className="lh-child-switcher">
      {childrenList.map((child) => {
        const avatar = AVATAR[child.line] || AVATAR.girl
        return (
          <button
            key={child.id}
            className={child.id === activeId ? 'lh-child-chip is-active' : 'lh-child-chip'}
            onClick={() => onSelect(child.id)}
          >
            <img src={avatar.idle} alt="" />
            <span>{child.name}</span>
          </button>
        )
      })}
      <button className="lh-child-chip is-add" onClick={onAdd}>新增</button>
    </div>
  )
}

function TodayView({
  child,
  onCompleteTask,
  onOpenParent,
  onOpenRewards,
  onSwitchChild,
  onAddTask,
  onReorderTasks,
}) {
  const [customTask, setCustomTask] = useState('')
  const [dragId, setDragId] = useState(null)
  const [overId, setOverId] = useState(null)
  const avatar = AVATAR[child.line] || AVATAR.girl
  const done = child.tasks.filter((task) => task.done).length
  const total = child.tasks.length
  const percent = total ? Math.round((done / total) * 100) : 0

  function submitCustomTask() {
    const label = customTask.trim()
    if (!label) return
    onAddTask(child.id, createTask({ label }))
    setCustomTask('')
  }

  function addQuickTask(task) {
    onAddTask(child.id, createTask(task))
  }

  function startDrag(taskId, event) {
    setDragId(taskId)
    setOverId(taskId)
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  function moveDrag(event) {
    if (!dragId) return
    event.preventDefault()
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-task-id]')
    if (!target) return
    const nextOverId = Number(target.dataset.taskId)
    if (Number.isFinite(nextOverId)) setOverId(nextOverId)
  }

  function endDrag() {
    if (dragId && overId && dragId !== overId) onReorderTasks(child.id, dragId, overId)
    setDragId(null)
    setOverId(null)
  }

  return (
    <div className="lh-daily-grid">
      <aside className="lh-summary-panel">
        <div className="lh-topbar">
          <button className="lh-avatar-button" onClick={onSwitchChild} aria-label="切換孩子">
            <img src={avatar.idle} alt="" />
          </button>
          <div>
            <div className="lh-eyebrow">今天的小任務</div>
            <h1>{child.name}</h1>
          </div>
          <button className="lh-icon-button" onClick={onOpenParent} aria-label="家長設定">設</button>
        </div>

        <section className="lh-note-card">
          <p className="lh-note-title">{todayMessage(done, total)}</p>
          <p className="lh-note-copy">全部完成後，可以得到 1 顆星星。</p>
          <div className="lh-progress" aria-label={`今日進度 ${percent}%`}>
            <span style={{ width: `${percent}%` }} />
          </div>
          <div className="lh-progress-label">{done} / {total} 完成</div>
        </section>

        <section className="lh-kid-add-card">
          <div>
            <div className="lh-eyebrow">自己加一件事</div>
            <h2>今天還想做什麼？</h2>
          </div>
          <div className="lh-kid-add-row">
            <input
              value={customTask}
              onChange={(event) => setCustomTask(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && submitCustomTask()}
              placeholder="例如：練鋼琴 10 分鐘"
            />
            <button onClick={submitCustomTask}>加入</button>
          </div>
          <div className="lh-quick-list" aria-label="任務快選">
            {QUICK_TASKS.map((task) => (
              <button key={task.label} onClick={() => addQuickTask(task)}>
                <img src={task.icon} alt="" />
                <span>{task.label}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="lh-stats">
          <div className="lh-stat-card">
            <img src={STAR_ICON} alt="" />
            <div><b>{child.badges}</b><span>星星</span></div>
          </div>
          <div className="lh-stat-card">
            <img src={FLAME_ICON} alt="" />
            <div><b>{child.streak}</b><span>連續天數</span></div>
          </div>
        </div>

        <button className="lh-reward-cta" onClick={onOpenRewards}>
          打開獎勵盒
        </button>
      </aside>

      <main className="lh-task-panel">
        <div className="lh-section-head">
          <div>
            <div className="lh-eyebrow">今日清單</div>
            <h2>拖曳把手可以換順序</h2>
          </div>
          <span className={done === total && total > 0 ? 'lh-status is-done' : 'lh-status'}>{percent}%</span>
        </div>

        <div className="lh-task-list" onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag}>
          {child.tasks.map((task) => (
            <article
              key={task.id}
              data-task-id={task.id}
              className={[
                'lh-task',
                task.done ? 'is-done' : '',
                dragId === task.id ? 'is-dragging' : '',
                overId === task.id && dragId !== task.id ? 'is-drop-target' : '',
              ].filter(Boolean).join(' ')}
            >
              <button
                className="lh-drag-handle"
                onPointerDown={(event) => startDrag(task.id, event)}
                aria-label={`拖曳 ${task.label}`}
              >
                ⋮⋮
              </button>
              <span className="lh-task-icon"><img src={task.icon} alt="" /></span>
              <span className="lh-task-text">
                <strong>{task.label}</strong>
                <small>{task.hint || '完成後點一下右邊的圈圈。'}</small>
              </span>
              <button className="lh-check" onClick={() => onCompleteTask(task.id)} aria-label={`完成 ${task.label}`}>
                {task.done ? '✓' : ''}
              </button>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}

function RewardsView({ child, rewards, onBack }) {
  const sorted = [...rewards].sort((a, b) => a.badges - b.badges)
  return (
    <div className="lh-page-card">
      <header className="lh-simple-head">
        <button className="lh-icon-button" onClick={onBack}>回</button>
        <div>
          <div className="lh-eyebrow">星星可以換的小期待</div>
          <h1>獎勵盒</h1>
        </div>
      </header>

      <section className="lh-note-card">
        <p className="lh-note-title">目前有 {child.badges} 顆星星。</p>
        <p className="lh-note-copy">獎勵由家長確認後兌換，孩子只需要知道自己正在靠近。</p>
      </section>

      <div className="lh-reward-list">
        {sorted.map((reward) => {
          const ready = child.badges >= reward.badges
          const left = Math.max(0, reward.badges - child.badges)
          return (
            <article key={reward.id} className={ready ? 'lh-reward-card is-ready' : 'lh-reward-card'}>
              <img src={iconForReward(reward)} alt="" />
              <div>
                <h2>{reward.label}</h2>
                <p>{ready ? '已經可以兌換' : `還差 ${left} 顆星星`}</p>
              </div>
              <span>{reward.badges}</span>
            </article>
          )
        })}
      </div>
    </div>
  )
}

function PinView({ parents, onUnlock, onBack }) {
  const [value, setValue] = useState('')
  const [wrong, setWrong] = useState(false)

  function press(digit) {
    if (value.length >= 4) return
    const next = value + digit
    setValue(next)
    if (next.length === 4) {
      const parent = parents.find((item) => item.pin === next)
      if (parent) {
        setTimeout(() => onUnlock(parent), 180)
      } else {
        setWrong(true)
        setTimeout(() => {
          setWrong(false)
          setValue('')
        }, 620)
      }
    }
  }

  return (
    <div className="lh-pin-page">
      <button className="lh-icon-button" onClick={onBack}>回</button>
      <div className="lh-pin-card">
        <div className="lh-eyebrow">家長設定</div>
        <h1>輸入 PIN</h1>
        <p>{wrong ? 'PIN 不正確，請再試一次。' : '請輸入任一位家長的 4 位數 PIN。'}</p>
        <div className={wrong ? 'lh-pin-dots is-wrong' : 'lh-pin-dots'}>
          {[0, 1, 2, 3].map((i) => <span key={i} className={i < value.length ? 'is-filled' : ''} />)}
        </div>
        <div className="lh-keypad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((key, index) => (
            <button
              key={`${key}-${index}`}
              disabled={key === ''}
              onClick={() => key === 'del' ? setValue((current) => current.slice(0, -1)) : press(String(key))}
            >
              {key === 'del' ? '←' : key}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function ParentView({
  childrenList,
  activeId,
  rewards,
  parents,
  onBack,
  onSelectChild,
  onUpdateChild,
  onAddChild,
  onDeleteTask,
  onAddTask,
  onAddReward,
  onRedeemReward,
  onAddParent,
  onUpdateParent,
  onDeleteParent,
}) {
  const [tab, setTab] = useState('tasks')
  const [newTask, setNewTask] = useState({ label: '', hint: '', icon: TASK_ICON_CHOICES[0] })
  const [newReward, setNewReward] = useState({ label: '', badges: 3, icon: 'book' })
  const [newChild, setNewChild] = useState({ name: '', line: 'girl' })
  const [newParent, setNewParent] = useState({ name: '', pin: '' })
  const child = childrenList.find((item) => item.id === activeId) || childrenList[0]

  function submitTask() {
    if (!newTask.label.trim()) return
    onAddTask(child.id, createTask({
      ...newTask,
      label: newTask.label.trim(),
      hint: newTask.hint.trim() || '完成後點一下右邊的圈圈。',
    }))
    setNewTask({ label: '', hint: '', icon: TASK_ICON_CHOICES[0] })
  }

  function submitReward() {
    if (!newReward.label.trim()) return
    onAddReward({
      ...newReward,
      label: newReward.label.trim(),
      badges: clampNumber(newReward.badges, 1, 99),
    })
    setNewReward({ label: '', badges: 3, icon: 'book' })
  }

  function submitChild() {
    if (!newChild.name.trim()) return
    onAddChild(newChild.name.trim(), newChild.line)
    setNewChild({ name: '', line: 'girl' })
  }

  function submitParent() {
    if (!newParent.name.trim() || !/^\d{4}$/.test(newParent.pin)) return
    onAddParent({ name: newParent.name.trim(), pin: newParent.pin })
    setNewParent({ name: '', pin: '' })
  }

  return (
    <div className="lh-parent-layout">
      <aside className="lh-parent-side">
        <header className="lh-simple-head">
          <button className="lh-icon-button" onClick={onBack}>回</button>
          <div>
            <div className="lh-eyebrow">家長設定</div>
            <h1>每日安排</h1>
          </div>
        </header>

        <ChildSwitcher
          childrenList={childrenList}
          activeId={child.id}
          onSelect={onSelectChild}
          onAdd={() => setTab('kids')}
        />

        <nav className="lh-parent-tabs">
          {[
            ['tasks', '任務'],
            ['rewards', '獎勵'],
            ['history', '記錄'],
            ['kids', '孩子'],
            ['settings', '設定'],
          ].map(([key, label]) => (
            <button key={key} className={tab === key ? 'is-active' : ''} onClick={() => setTab(key)}>{label}</button>
          ))}
        </nav>
      </aside>

      <main className="lh-parent-main">
        {tab === 'tasks' && (
          <>
            <section className="lh-admin-card">
              <h2>新增任務</h2>
              <div className="lh-icon-picker">
                {TASK_ICON_CHOICES.map((icon) => (
                  <button
                    key={icon}
                    className={newTask.icon === icon ? 'is-active' : ''}
                    onClick={() => setNewTask((current) => ({ ...current, icon }))}
                  >
                    <img src={icon} alt="" />
                  </button>
                ))}
              </div>
              <input value={newTask.label} onChange={(event) => setNewTask((current) => ({ ...current, label: event.target.value }))} placeholder="任務名稱" />
              <input value={newTask.hint} onChange={(event) => setNewTask((current) => ({ ...current, hint: event.target.value }))} placeholder="給孩子看的短提醒" />
              <button className="lh-primary-button" onClick={submitTask}>加入任務</button>
            </section>

            <div className="lh-admin-list">
              {child.tasks.map((task) => (
                <article key={task.id} className="lh-admin-row">
                  <img src={task.icon} alt="" />
                  <div><b>{task.label}</b><span>{task.hint}</span></div>
                  <button onClick={() => onDeleteTask(child.id, task.id)}>刪除</button>
                </article>
              ))}
            </div>
          </>
        )}

        {tab === 'rewards' && (
          <>
            <section className="lh-admin-card">
              <h2>新增獎勵</h2>
              <input value={newReward.label} onChange={(event) => setNewReward((current) => ({ ...current, label: event.target.value }))} placeholder="獎勵名稱" />
              <input type="number" min="1" max="99" value={newReward.badges} onChange={(event) => setNewReward((current) => ({ ...current, badges: event.target.value }))} placeholder="需要星星數" />
              <button className="lh-primary-button" onClick={submitReward}>加入獎勵</button>
            </section>

            <div className="lh-admin-list">
              {rewards.map((reward) => (
                <article key={reward.id} className="lh-admin-row">
                  <img src={iconForReward(reward)} alt="" />
                  <div><b>{reward.label}</b><span>需要 {reward.badges} 顆星星</span></div>
                  <button onClick={() => onRedeemReward(child.id, reward)} disabled={child.badges < reward.badges}>兌換</button>
                </article>
              ))}
            </div>
          </>
        )}

        {tab === 'history' && (
          <section className="lh-admin-card">
            <h2>最近記錄</h2>
            <div className="lh-history">
              {child.history.length ? child.history.slice(-10).reverse().map((item) => (
                <div key={item.date}>
                  <span>{item.date}</span>
                  <b>{item.completed ? '全部完成' : `${item.done}/${item.total}`}</b>
                </div>
              )) : <p>還沒有完成記錄。</p>}
            </div>
          </section>
        )}

        {tab === 'kids' && (
          <>
            <section className="lh-admin-card">
              <h2>新增孩子</h2>
              <input value={newChild.name} onChange={(event) => setNewChild((current) => ({ ...current, name: event.target.value }))} placeholder="孩子名字" />
              <div className="lh-segmented">
                {Object.entries(LINE_LABELS).map(([line, label]) => (
                  <button key={line} className={newChild.line === line ? 'is-active' : ''} onClick={() => setNewChild((current) => ({ ...current, line }))}>{label}</button>
                ))}
              </div>
              <button className="lh-primary-button" onClick={submitChild}>新增孩子</button>
            </section>

            <div className="lh-admin-list">
              {childrenList.map((item) => (
                <article key={item.id} className="lh-admin-row">
                  <img src={(AVATAR[item.line] || AVATAR.girl).idle} alt="" />
                  <div className="lh-inline-fields">
                    <input
                      value={item.name}
                      onChange={(event) => onUpdateChild(item.id, { name: event.target.value })}
                      aria-label="孩子名稱"
                    />
                    <span>{LINE_LABELS[item.line]}</span>
                  </div>
                  <button onClick={() => onUpdateChild(item.id, { line: item.line === 'girl' ? 'boy' : 'girl' })}>切換</button>
                </article>
              ))}
            </div>
          </>
        )}

        {tab === 'settings' && (
          <>
            <section className="lh-admin-card">
              <h2>家長</h2>
              <p>每位家長都可以有自己的名稱與 4 位數 PIN。登入家長設定時，輸入任一位家長 PIN 都可以進入。</p>
              <input
                value={newParent.name}
                onChange={(event) => setNewParent((current) => ({ ...current, name: event.target.value }))}
                placeholder="家長名稱"
              />
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={newParent.pin}
                onChange={(event) => setNewParent((current) => ({ ...current, pin: event.target.value.replace(/\D/g, '') }))}
                placeholder="4 位數 PIN"
              />
              <button className="lh-primary-button" onClick={submitParent}>新增家長</button>
            </section>

            <div className="lh-admin-list">
              {parents.map((parent) => (
                <article key={parent.id} className="lh-admin-row">
                  <div className="lh-parent-avatar">{parent.name.slice(0, 1) || '家'}</div>
                  <div className="lh-inline-fields">
                    <input
                      value={parent.name}
                      onChange={(event) => onUpdateParent(parent.id, { name: event.target.value })}
                      aria-label="家長名稱"
                    />
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      value={parent.pin}
                      onChange={(event) => onUpdateParent(parent.id, { pin: event.target.value.replace(/\D/g, '') })}
                      aria-label="家長 PIN"
                    />
                  </div>
                  <button onClick={() => onDeleteParent(parent.id)} disabled={parents.length <= 1}>刪除</button>
                </article>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

function Celebration({ child, onClose }) {
  const avatar = AVATAR[child.line] || AVATAR.girl
  return (
    <div className="lh-modal-backdrop">
      <section className="lh-celebration">
        <img src={avatar.cheer} alt="" />
        <h1>今天完成了</h1>
        <p>你把今天的小任務都做好了。星星已經放進你的小盒子。</p>
        <button className="lh-primary-button" onClick={onClose}>好</button>
      </section>
    </div>
  )
}

export default function App() {
  const [state, setState] = useState(() => {
    const saved = loadState()
    const base = saved || { parentPin: '1234', parents: DEFAULT_PARENTS, rewards: DEFAULT_REWARDS, children: CHILDREN_INIT }
    return { ...base, children: ensureFeifei(base.children).map(applyDailyReset) }
  })
  const [activeId, setActiveId] = useState(() => state.children[0]?.id || 1)
  const [screen, setScreen] = useState('today')
  const [celebrating, setCelebrating] = useState(false)

  const childrenList = state.children
  const child = useMemo(
    () => childrenList.find((item) => item.id === activeId) || childrenList[0],
    [childrenList, activeId],
  )

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    const timer = setInterval(() => {
      setState((current) => ({ ...current, children: current.children.map(applyDailyReset) }))
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  function setChildren(updater) {
    setState((current) => ({
      ...current,
      children: typeof updater === 'function' ? updater(current.children) : updater,
    }))
  }

  function updateChild(childId, patch) {
    setChildren((current) => current.map((item) => item.id === childId ? { ...item, ...patch } : item))
  }

  function completeTask(taskId) {
    const today = todayStr()
    setChildren((current) => current.map((item) => {
      if (item.id !== child.id) return item
      const previousTask = item.tasks.find((task) => task.id === taskId)
      const tasks = item.tasks.map((task) => task.id === taskId ? { ...task, done: !task.done } : task)
      const completedNow = previousTask && !previousTask.done
      const done = tasks.filter((task) => task.done).length
      const allDone = tasks.length > 0 && done === tasks.length
      const firstAwardToday = allDone && item.badgeAwardedDate !== today
      const history = [
        ...item.history.filter((entry) => entry.date !== today).slice(-13),
        { date: today, done, total: tasks.length, completed: allDone },
      ]

      if (firstAwardToday) setTimeout(() => setCelebrating(true), 260)

      return {
        ...item,
        tasks,
        history,
        badges: firstAwardToday ? item.badges + 1 : item.badges,
        streak: firstAwardToday ? item.streak + 1 : item.streak,
        totalPoints: completedNow ? item.totalPoints + (previousTask.points || 0) : item.totalPoints,
        lastCompletedDate: allDone ? today : item.lastCompletedDate,
        badgeAwardedDate: firstAwardToday ? today : item.badgeAwardedDate,
      }
    }))
  }

  function addTask(childId, task) {
    setChildren((current) => current.map((item) => (
      item.id === childId ? { ...item, tasks: [...item.tasks, task] } : item
    )))
  }

  function reorderTasks(childId, fromId, toId) {
    setChildren((current) => current.map((item) => {
      if (item.id !== childId) return item
      const tasks = [...item.tasks]
      const fromIndex = tasks.findIndex((task) => task.id === fromId)
      const toIndex = tasks.findIndex((task) => task.id === toId)
      if (fromIndex < 0 || toIndex < 0) return item
      const [moved] = tasks.splice(fromIndex, 1)
      tasks.splice(toIndex, 0, moved)
      return { ...item, tasks }
    }))
  }

  function deleteTask(childId, taskId) {
    setChildren((current) => current.map((item) => {
      if (item.id !== childId) return item
      return { ...item, tasks: item.tasks.filter((task) => task.id !== taskId) }
    }))
  }

  function addReward(reward) {
    setState((current) => ({ ...current, rewards: [...current.rewards, { id: Date.now(), ...reward }] }))
  }

  function redeemReward(childId, reward) {
    setChildren((current) => current.map((item) => {
      if (item.id !== childId || item.badges < reward.badges) return item
      return { ...item, badges: item.badges - reward.badges }
    }))
  }

  function addChild(name, line) {
    const nextId = Math.max(0, ...childrenList.map((item) => item.id)) + 1
    const next = makeChild(nextId, name, line)
    setChildren((current) => [...current, next])
    setActiveId(next.id)
  }

  function addParent(parent) {
    setState((current) => {
      const parents = current.parents?.length ? current.parents : DEFAULT_PARENTS
      const nextId = Math.max(0, ...parents.map((item) => item.id)) + 1
      const nextParents = [...parents, { id: nextId, ...parent }]
      return { ...current, parents: nextParents, parentPin: nextParents[0]?.pin || current.parentPin }
    })
  }

  function updateParent(parentId, patch) {
    setState((current) => {
      const parents = (current.parents?.length ? current.parents : DEFAULT_PARENTS).map((item) => (
        item.id === parentId ? { ...item, ...patch } : item
      ))
      return { ...current, parents, parentPin: parents[0]?.pin || current.parentPin }
    })
  }

  function deleteParent(parentId) {
    setState((current) => {
      const parents = current.parents?.length ? current.parents : DEFAULT_PARENTS
      if (parents.length <= 1) return current
      const nextParents = parents.filter((item) => item.id !== parentId)
      return { ...current, parents: nextParents, parentPin: nextParents[0]?.pin || current.parentPin }
    })
  }

  if (!child) return null

  return (
    <div className="lh-app">
      {screen === 'today' && (
        <TodayView
          child={child}
          onCompleteTask={completeTask}
          onAddTask={addTask}
          onReorderTasks={reorderTasks}
          onOpenRewards={() => setScreen('rewards')}
          onOpenParent={() => setScreen('pin')}
          onSwitchChild={() => setScreen('children')}
        />
      )}

      {screen === 'children' && (
        <div className="lh-page-card">
          <header className="lh-simple-head">
            <button className="lh-icon-button" onClick={() => setScreen('today')}>回</button>
            <div>
              <div className="lh-eyebrow">選擇孩子</div>
              <h1>今天是誰的小本本？</h1>
            </div>
          </header>
          <ChildSwitcher
            childrenList={childrenList}
            activeId={child.id}
            onSelect={(id) => {
              setActiveId(id)
              setScreen('today')
            }}
            onAdd={() => setScreen('pin')}
          />
        </div>
      )}

      {screen === 'rewards' && <RewardsView child={child} rewards={state.rewards} onBack={() => setScreen('today')} />}

      {screen === 'pin' && (
        <PinView
          parents={state.parents?.length ? state.parents : DEFAULT_PARENTS}
          onUnlock={() => setScreen('parent')}
          onBack={() => setScreen('today')}
        />
      )}

      {screen === 'parent' && (
        <ParentView
          childrenList={childrenList}
          activeId={child.id}
          rewards={state.rewards}
          parents={state.parents?.length ? state.parents : DEFAULT_PARENTS}
          onBack={() => setScreen('today')}
          onSelectChild={setActiveId}
          onUpdateChild={updateChild}
          onAddChild={addChild}
          onDeleteTask={deleteTask}
          onAddTask={addTask}
          onAddReward={addReward}
          onRedeemReward={redeemReward}
          onAddParent={addParent}
          onUpdateParent={updateParent}
          onDeleteParent={deleteParent}
        />
      )}

      {screen !== 'today' && (
        <nav className="lh-bottom-nav">
          <ScreenButton active={screen === 'today'} onClick={() => setScreen('today')}>今天</ScreenButton>
          <ScreenButton active={screen === 'rewards'} onClick={() => setScreen('rewards')}>獎勵</ScreenButton>
          <ScreenButton active={screen === 'parent'} onClick={() => setScreen('pin')}>家長</ScreenButton>
        </nav>
      )}

      {celebrating && <Celebration child={child} onClose={() => setCelebrating(false)} />}
    </div>
  )
}

function ensureFeifei(children) {
  if (children.some((child) => child.name === '菲菲')) return children
  const nextId = Math.max(0, ...children.map((child) => child.id || 0)) + 1
  return [...children, makeChild(nextId, '菲菲', 'girl')]
}

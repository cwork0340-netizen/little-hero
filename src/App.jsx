// App.jsx — root component + routing
import { useState, useEffect } from 'react'
import { CHILDREN_INIT, DEFAULT_REWARDS } from './data/tasks.js'
import { loadState, saveState, todayStr, yesterdayStr } from './utils/storage.js'

import SelectChild   from './pages/SelectChild.jsx'
import MainScreenV4  from './pages/MainScreenV4.jsx'
import RewardsPage   from './pages/RewardsPage.jsx'
import { AllDone, AchievementBook, ParentPIN, ParentDash } from './pages/AllScreens.jsx'

// 開新的一天：任務歸零；昨天沒完成就斷掉連續天數
function applyDailyReset(child) {
  const today = todayStr()
  if (child.lastPlayedDate === today) return child
  const keepStreak = child.lastCompletedDate === today || child.lastCompletedDate === yesterdayStr()
  return {
    ...child,
    lastPlayedDate: today,
    streak: keepStreak ? child.streak : 0,
    tasks: child.tasks.map(t => ({ ...t, done: false })),
  }
}

export default function App() {
  const [state, setState] = useState(() => {
    const saved = loadState()
    const base = saved || { parentPin: '1234', rewards: DEFAULT_REWARDS, children: CHILDREN_INIT }
    return { ...base, children: base.children.map(applyDailyReset) }
  })
  const [activeId, setActiveId] = useState(null)
  const [screen,   setScreen]   = useState('select')
  const [navTab,   setNavTab]   = useState('home')

  const { children, parentPin, rewards } = state
  const child = children.find(c => c.id === activeId) || children[0]

  useEffect(() => {
    saveState(state)
  }, [state])

  // App 開著跨過午夜也要重置（每分鐘檢查一次，同一天時不動 state）
  useEffect(() => {
    const iv = setInterval(() => {
      setState(prev => {
        if (prev.children.every(c => c.lastPlayedDate === todayStr())) return prev
        return { ...prev, children: prev.children.map(applyDailyReset) }
      })
    }, 60000)
    return () => clearInterval(iv)
  }, [])

  function setChildren(updater) {
    setState(prev => ({
      ...prev,
      children: typeof updater === 'function' ? updater(prev.children) : updater,
    }))
  }

  function setParentPin(pin) {
    setState(prev => ({ ...prev, parentPin: pin }))
  }

  function setRewards(updater) {
    setState(prev => ({
      ...prev,
      rewards: typeof updater === 'function' ? updater(prev.rewards) : updater,
    }))
  }

  function completeTask(childId, taskId) {
    const today = todayStr()
    setChildren(prev => prev.map(c => {
      if (c.id !== childId) return c
      const tasks = c.tasks.map(t => t.id === taskId ? { ...t, done: true } : t)
      const task = c.tasks.find(t => t.id === taskId)
      const justEarned = task && !task.done ? task.points : 0
      const allDone = tasks.length > 0 && tasks.every(t => t.done)
      const firstAwardToday = allDone && c.badgeAwardedDate !== today

      // 更新今日歷史（近 14 天）
      const history = [
        ...c.history.filter(h => h.date !== today).slice(-13),
        { date: today, done: tasks.filter(t => t.done).length, total: tasks.length, completed: allDone },
      ]

      return {
        ...c,
        tasks,
        history,
        totalPoints: (c.totalPoints || 0) + justEarned,
        badges: firstAwardToday ? c.badges + 1 : c.badges,
        streak: firstAwardToday ? c.streak + 1 : c.streak,
        lastCompletedDate: allDone ? today : c.lastCompletedDate,
        badgeAwardedDate: firstAwardToday ? today : c.badgeAwardedDate,
      }
    }))
  }

  function reorderTasks(childId, fromId, toId) {
    setChildren(prev => prev.map(c => {
      if (c.id !== childId) return c
      const arr  = [...c.tasks]
      const from = arr.findIndex(t => t.id === fromId)
      const to   = arr.findIndex(t => t.id === toId)
      if (from < 0 || to < 0) return c
      const [item] = arr.splice(from, 1)
      arr.splice(to, 0, item)
      return { ...c, tasks: arr }
    }))
  }

  function handleNavChange(tab) {
    setNavTab(tab)
    if (tab === 'achieve') setScreen('achieve')
    else if (tab === 'rewards') setScreen('rewards')
    else if (tab === 'settings') setScreen('pin')
    else setScreen('main')
  }

  function backHome() {
    setNavTab('home')
    setScreen('main')
  }

  return (
    <div className="app-shell">
      {screen === 'select' && (
        <SelectChild
          children={children}
          onSelect={id => { setActiveId(id); setScreen('main') }}
          onAddChild={() => setScreen('pin')}
        />
      )}

      {screen === 'main' && (
        <MainScreenV4
          child={child}
          onTaskComplete={completeTask}
          onReorderTasks={reorderTasks}
          onAllDone={() => setScreen('allDone')}
          onNavChange={handleNavChange}
          navTab={navTab}
          onOpenRewards={() => handleNavChange('rewards')}
          onSwitchChild={() => { setNavTab('home'); setScreen('select') }}
        />
      )}

      {screen === 'allDone' && (
        <AllDone
          child={child}
          onHome={backHome}
          onAchievements={() => { setNavTab('achieve'); setScreen('achieve') }}
        />
      )}

      {screen === 'achieve' && (
        <AchievementBook child={child} onBack={backHome} />
      )}

      {screen === 'rewards' && (
        <RewardsPage child={child} rewards={rewards} onBack={backHome} />
      )}

      {screen === 'pin' && (
        <ParentPIN
          pin={parentPin}
          onUnlock={() => setScreen('parent')}
          onBack={backHome}
        />
      )}

      {screen === 'parent' && (
        <ParentDash
          children={children}
          setChildren={setChildren}
          rewards={rewards}
          setRewards={setRewards}
          parentPin={parentPin}
          setParentPin={setParentPin}
          currentChildId={activeId || children[0]?.id}
          onBack={backHome}
        />
      )}

      {!['pin', 'parent', 'select'].includes(screen) && (
        <button
          onClick={() => setScreen('pin')}
          className="parent-lock-button"
          aria-label="進入家長模式"
        >
          🔐
        </button>
      )}
    </div>
  )
}

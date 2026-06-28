// App.jsx — root component + routing
import { useState, useEffect } from 'react'
import { CHILDREN_INIT, makeTasks } from './data/tasks.js'
import { loadState, saveState } from './utils/storage.js'

import SelectChild from './pages/SelectChild.jsx'
import MainScreen  from './pages/MainScreen.jsx'
import { AllDone, AchievementBook, ParentPIN, ParentDash } from './pages/AllScreens.jsx'

export default function App() {
  // ── State ──────────────────────────────────────
  const [children, setChildren] = useState(() => loadState()?.children || CHILDREN_INIT)
  const [activeId, setActiveId] = useState(null)
  const [screen,   setScreen]   = useState('select')
  const [navTab,   setNavTab]   = useState('home')

  const child = children.find(c => c.id === activeId) || children[0]

  // ── Persist to localStorage ────────────────────
  useEffect(() => {
    saveState({ children })
  }, [children])

  // ── Handlers ───────────────────────────────────
  function completeTask(childId, taskId) {
    setChildren(prev => prev.map(c =>
      c.id === childId
        ? { ...c, tasks: c.tasks.map(t => t.id === taskId ? { ...t, done: true } : t) }
        : c
    ))
  }

  function reorderTasks(childId, fromId, toId) {
    setChildren(prev => prev.map(c => {
      if (c.id !== childId) return c
      const arr  = [...c.tasks]
      const from = arr.findIndex(t => t.id === fromId)
      const to   = arr.findIndex(t => t.id === toId)
      const [item] = arr.splice(from, 1)
      arr.splice(to, 0, item)
      return { ...c, tasks: arr }
    }))
  }

  function handleNavChange(tab) {
    setNavTab(tab)
    if (tab === 'achieve')  setScreen('achieve')
    else if (tab === 'settings') setScreen('pin')
    else setScreen('main')
  }

  // ── Render ─────────────────────────────────────
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', minHeight: '100vh' }}>

      {screen === 'select' && (
        <SelectChild
          children={children}
          onSelect={id => { setActiveId(id); setScreen('main') }}
          onAddChild={() => {}}
        />
      )}

      {screen === 'main' && (
        <MainScreen
          child={child}
          onTaskComplete={completeTask}
          onReorderTasks={reorderTasks}
          onAllDone={() => setScreen('allDone')}
          onNavChange={handleNavChange}
          navTab={navTab}
        />
      )}

      {screen === 'allDone' && (
        <AllDone child={child} onHome={() => setScreen('main')} />
      )}

      {screen === 'achieve' && (
        <AchievementBook child={child} onBack={() => setScreen('main')} />
      )}

      {screen === 'pin' && (
        <ParentPIN
          onUnlock={() => setScreen('parent')}
          onBack={() => setScreen('main')}
        />
      )}

      {screen === 'parent' && (
        <ParentDash
          children={children}
          setChildren={setChildren}
          currentChildId={activeId || children[0].id}
          onBack={() => setScreen('main')}
        />
      )}

      {/* Floating parent lock button */}
      {!['pin', 'parent', 'select'].includes(screen) && (
        <button
          onClick={() => setScreen('pin')}
          style={{
            position: 'fixed',
            bottom: 76,
            right: 14,
            background: '#7B5EA7',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 44,
            height: 44,
            fontSize: 18,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(123,94,167,.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          🔐
        </button>
      )}
    </div>
  )
}

import { useState } from 'react'
import { THEMES } from '../data/themes.js'

export default function MainScreenV2({ child }) {
  const theme = THEMES[child.theme]
  const done = child.tasks.filter(task => task.done).length
  const total = child.tasks.length || 1
  const progress = Math.round((done / total) * 100)

  return (
    <div className="v2-screen">
      <header className="v2-header">
        <div className="v2-user">
          <div className="v2-user-avatar">{child.avatar}</div>
          <div>
            <div className="v2-user-name">{child.name}</div>
            <div className="v2-user-subtitle">Adventure helper</div>
          </div>
        </div>
      </header>

      <main className="v2-content">
        <section className="v2-world" style={{ background: theme.gradient }}>
          <div className="v2-sign"><strong>Today Adventure</strong></div>
          <button className="v2-hero">{theme.char}</button>
          <div className="v2-bubble">{done === total ? theme.completionPhrase : theme.story}</div>
          <div className="v2-progress-card">
            <div className="v2-track"><i style={{ width: `${progress}%`, background: theme.accentD }} /></div>
            <b>{progress}%</b>
          </div>
        </section>
      </main>
    </div>
  )
}

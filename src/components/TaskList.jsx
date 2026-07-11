// TaskList.jsx — 任務清單容器，處理「長按卡片後拖曳排序」
import { useRef, useState } from 'react'
import TaskCardV4 from './TaskCardV4.jsx'

const LONG_PRESS_MS = 380
const MOVE_CANCEL_PX = 8

export default function TaskList({ tasks, onCompleteTask, onReorder }) {
  const [dragId, setDragId] = useState(null)
  const [dragY, setDragY]   = useState(0)
  const [overId, setOverId] = useState(null)
  const itemRefs   = useRef(new Map())
  const pressState = useRef(null)

  function clearPress() {
    if (pressState.current?.timer) clearTimeout(pressState.current.timer)
    pressState.current = null
  }

  function handlePointerDown(e, task) {
    if (task.done) return
    if (e.target.closest('.v3-card-check')) return // 完成鈕不觸發拖曳
    const targetEl = e.currentTarget
    pressState.current = {
      taskId: task.id,
      startX: e.clientX,
      startY: e.clientY,
      pointerId: e.pointerId,
      timer: setTimeout(() => {
        if (!pressState.current) return
        try { targetEl.setPointerCapture?.(pressState.current.pointerId) } catch { /* noop */ }
        setDragId(task.id)
        setDragY(0)
        setOverId(null)
        if (navigator.vibrate) navigator.vibrate(12)
      }, LONG_PRESS_MS),
    }
  }

  function handlePointerMove(e) {
    const ps = pressState.current
    if (!ps) return

    if (dragId == null) {
      const dx = e.clientX - ps.startX
      const dy = e.clientY - ps.startY
      if (Math.abs(dx) > MOVE_CANCEL_PX || Math.abs(dy) > MOVE_CANCEL_PX) clearPress()
      return
    }

    e.preventDefault()
    setDragY(e.clientY - ps.startY)

    let nextOverId = null
    for (const t of tasks) {
      if (t.id === dragId) continue
      const el = itemRefs.current.get(t.id)
      if (!el) continue
      const rect = el.getBoundingClientRect()
      if (e.clientY < rect.top + rect.height / 2) { nextOverId = t.id; break }
    }
    setOverId(nextOverId)
  }

  function handlePointerUp() {
    if (dragId != null) onReorder(dragId, overId)
    clearPress()
    setDragId(null)
    setDragY(0)
    setOverId(null)
  }

  return (
    <div
      className="v3-task-list"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {tasks.map((task, index) => {
        const isDragging = dragId === task.id
        const isDropTarget = dragId != null && overId === task.id
        return (
          <div
            key={task.id}
            ref={el => {
              if (el) itemRefs.current.set(task.id, el)
              else itemRefs.current.delete(task.id)
            }}
            className={`lh-fadeup v3-task-item${isDragging ? ' is-dragging' : ''}${isDropTarget ? ' v3-drop-before' : ''}`}
            style={{
              animationDelay: `${index * 45}ms`,
              transform: isDragging ? `translateY(${dragY}px) scale(1.03)` : undefined,
              touchAction: dragId != null ? 'none' : 'pan-y',
            }}
            onPointerDown={e => handlePointerDown(e, task)}
          >
            <TaskCardV4 task={task} onComplete={e => onCompleteTask(task.id, e)} />
          </div>
        )
      })}
    </div>
  )
}

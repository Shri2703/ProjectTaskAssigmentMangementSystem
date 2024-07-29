import React, { useState } from 'react'
import './KanbanBoard.css'
import Notification from '../components/Notification'

const KanbanBoard = () => {
  const [tasks, setTasks] = useState({
    todo: ['Task 1', 'Task 2'],
    inProgress: [],
    done: [],
  })
  const [notification, setNotification] = useState('')

  const handleDragStart = (e, task, status) => {
    e.dataTransfer.setData('task', task)
    e.dataTransfer.setData('status', status)
  }

  const handleDrop = (e, status) => {
    const task = e.dataTransfer.getData('task')
    const prevStatus = e.dataTransfer.getData('status')

    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks }
      updatedTasks[prevStatus] = updatedTasks[prevStatus].filter(
        (t) => t !== task
      )
      updatedTasks[status].push(task)

      return updatedTasks
    })

    setNotification('Your task status has been updated')
  }

  const handleCloseNotification = () => {
    setNotification('')
  }

  return (
    <div>
      <h2 className='title'>Project Status</h2>
      <div className='kanban-board'>
        {['todo', 'inProgress', 'done'].map((status) => (
          <div
            key={status}
            className='kanban-column'
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, status)}
          >
            <h2>{status.toUpperCase()}</h2>
            {tasks[status].map((task, idx) => (
              <div
                key={idx}
                className='kanban-task'
                draggable
                onDragStart={(e) => handleDragStart(e, task, status)}
              >
                {task}
              </div>
            ))}
          </div>
        ))}
        {notification && (
          <Notification
            message={notification}
            onClose={handleCloseNotification}
          />
        )}
      </div>
    </div>
  )
}

export default KanbanBoard

import React from 'react'
import './kanbancolumn.css'

const KanbanColumn = ({ title, tasks, onTaskDrop }) => {
  const handleDrop = (e) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('text')
    onTaskDrop(taskId)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  return (
    <div
      className='kanban-column'
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <h2>{title}</h2>
      <div className='kanban-column-tasks'>
        {tasks.map((task) => (
          <div
            key={task.id}
            className='kanban-task'
            draggable
            onDragStart={(e) => e.dataTransfer.setData('text', task.id)}
          >
            {task.name}
          </div>
        ))}
      </div>
    </div>
  )
}

export default KanbanColumn

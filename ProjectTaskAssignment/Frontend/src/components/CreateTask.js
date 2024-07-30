import React, { useState, useEffect } from 'react'
import { createTask } from '../api/task'
import { getProjects } from '../api/project' // Adjust the import based on your API structure
import { getMembers } from '../api/member' // Adjust the import based on your API structure
import Button from '../components/Button'

const CreateTask = ({ onTaskCreated, projects, members }) => {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: '',
    projectId: '',
    assignedTo: '',
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }))
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    try {
      await createTask(newTask)
      setSuccess(true) // Set success state to true
      setNewTask({
        title: '',
        description: '',
        status: '',
        projectId: '',
        assignedTo: '',
      })
      onTaskCreated() // Notify parent component of new task creation
    } catch (error) {
      console.error('Error creating task:', error)
      setError('Failed to create task')
    }
  }

  return (
    <div className='card mb-4'>
      <div className='card-body'>
        <h5 className='card-title'>Create New Task</h5>
        {success && <p className='text-success'>Task created successfully!</p>}
        {error && <p className='text-danger'>{error}</p>}
        <form onSubmit={handleCreateTask}>
          <div className='mb-3'>
            <input
              type='text'
              className='form-control'
              name='title'
              placeholder='Task Title'
              value={newTask.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='mb-3'>
            <textarea
              className='form-control'
              name='description'
              placeholder='Task Description'
              value={newTask.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='mb-3'>
            <select
              className='form-control'
              name='status'
              value={newTask.status}
              onChange={handleInputChange}
              required
            >
              <option value=''>Select Status</option>
              <option value='pending'>Pending</option>
              <option value='in-progress'>In Progress</option>
              <option value='completed'>Completed</option>
            </select>
          </div>
          <div className='mb-3'>
            <select
              className='form-control'
              name='projectId'
              value={newTask.projectId}
              onChange={handleInputChange}
              required
            >
              <option value=''>Select Project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div className='mb-3'>
            <select
              className='form-control'
              name='assignedTo'
              value={newTask.assignedTo}
              onChange={handleInputChange}
              required
            >
              <option value=''>Assign To</option>
              {members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
          <Button type='submit' variant='primary'>
            Create Task
          </Button>
        </form>
      </div>
    </div>
  )
}

export default CreateTask

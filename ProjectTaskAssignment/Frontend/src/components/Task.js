import React, { useState, useEffect } from 'react'
import { getTasks, updateTask, deleteTask } from '../api/task'
import { getProjects } from '../api/project'
import { getUsers } from '../api/member'
import Button from '../components/Button'
import CreateTask from './CreateTask'

const TaskList = () => {
  const [tasks, setTasks] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showUpdateForm, setShowUpdateForm] = useState(null)
  const [updateTaskData, setUpdateTaskData] = useState({})
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksData = await getTasks()
        const projectsData = await getProjects()
        const usersData = await getUsers()
        setTasks(tasksData)
        setProjects(projectsData)
        setUsers(usersData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const handleCreateTask = () => {
    setShowCreateForm(!showCreateForm)
  }

  const handleUpdateTask = (task) => {
    setUpdateTaskData(task)
    setShowUpdateForm(true)
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId)
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId))
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleTaskUpdated = async () => {
    try {
      const tasksData = await getTasks() // Fetch updated tasks
      setTasks(tasksData)
      setShowUpdateForm(false) // Hide update form after updating
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target
    setUpdateTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateTask(updateTaskData._id, updateTaskData)
      handleTaskUpdated()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  return (
    <div>
      <div className='d-flex justify-content-between mb-4'>
        <h2>Tasks</h2>
        <Button onClick={handleCreateTask} variant='primary'>
          {showCreateForm ? 'Hide Form' : 'Create New Task'}
        </Button>
        {showCreateForm && (
          <CreateTask
            onTaskCreated={() => handleTaskUpdated()}
            projects={projects}
            members={users}
          />
        )}
      </div>
      

      {showUpdateForm && (
        <div className='card mt-4'>
          <div className='card-body'>
            <h5 className='card-title'>Update Task</h5>
            <form onSubmit={handleUpdateSubmit}>
              <div className='mb-3'>
                <input
                  type='text'
                  name='title'
                  className='form-control'
                  placeholder='Task Title'
                  value={updateTaskData.title}
                  onChange={handleUpdateInputChange}
                  required
                />
              </div>
              <div className='mb-3'>
                <textarea
                  name='description'
                  className='form-control'
                  placeholder='Task Description'
                  value={updateTaskData.description}
                  onChange={handleUpdateInputChange}
                  required
                />
              </div>
              <div className='mb-3'>
                <select
                  name='status'
                  className='form-control'
                  value={updateTaskData.status}
                  onChange={handleUpdateInputChange}
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
                  name='projectId'
                  className='form-control'
                  value={updateTaskData.projectId}
                  onChange={handleUpdateInputChange}
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
                  name='assignedTo'
                  className='form-control'
                  value={updateTaskData.assignedTo}
                  onChange={handleUpdateInputChange}
                  required
                >
                  <option value=''>Assign To</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button type='submit' variant='primary'>
                Update Task
              </Button>
            </form>
          </div>
        </div>
      )}
      <div className='task-list'>
        {tasks.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          <div className='row'>
            {tasks.map((task) => (
              <div className='col-md-4 mb-4' key={task._id}>
                <div className='card'>
                  <div className='card-body'>
                    <h5 className='card-title'>{task.title}</h5>
                    <p className='card-text'>{task.description}</p>
                    <p className='card-text'>Status: {task.status}</p>
                    <p className='card-text'>Project: {task.projectName}</p>
                    <p className='card-text'>
                      Assigned To: {task.assignedUserName}
                    </p>
                    <div className='d-flex justify-content-between'>
                      <Button
                        onClick={() => handleUpdateTask(task)}
                        variant='warning'
                      >
                        Update
                      </Button>
                      <Button
                        onClick={() => handleDeleteTask(task._id)}
                        variant='danger'
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskList

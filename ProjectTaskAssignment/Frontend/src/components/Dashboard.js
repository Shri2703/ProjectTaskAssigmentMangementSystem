import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { logoutUser } from '../redux/actions/authActions'
import { FaBell, FaSearch } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import {
  getAllProjects,
  getAssignedProjects,
  getAssignedTasks,
  updateTaskStatus,
} from '../api/project'
import './Dashboard.css' // Ensure this path is correct

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null)
  const [error, setError] = useState(null)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [editMode, setEditMode] = useState(false)
  const [allProjects, setAllProjects] = useState([])
  const [assignedProjects, setAssignedProjects] = useState([])
  const [assignedTasks, setAssignedTasks] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [taskStatus, setTaskStatus] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedTokens = JSON.parse(localStorage.getItem('decodedTokens'))
        const token = storedTokens?.[0]?.token

        if (token) {
          const decodedToken = storedTokens[0]
          const userId = decodedToken.id

          // Fetch user information
          const userResponse = await axios.get(
            `http://localhost:5000/members/${userId}`
          )
          setUserInfo(userResponse.data)

          // Fetch all projects and assigned projects
          const allProjectsData = await getAllProjects()
          setAllProjects(allProjectsData)
          const assignedProjectsData = await getAssignedProjects(userId)
          setAssignedProjects(assignedProjectsData)

          // Fetch assigned tasks
          const assignedTasksData = await getAssignedTasks(userId)
          setAssignedTasks(assignedTasksData)
        } else {
          setError('No token found')
        }
      } catch (error) {
        setError('Failed to fetch data')
        console.error(error)
      }
    }

    fetchData()
  }, [])

  const handleLogout = () => {
    dispatch(logoutUser())
    localStorage.removeItem('decodedTokens')
    navigate('/')
  }

  const handleSectionChange = (section) => {
    setActiveSection(section)
  }

  const handleEditProfile = () => {
    setEditMode(true)
    setFormData({ name: userInfo.name, email: userInfo.email, password: '' })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUpdateProfile = async () => {
    try {
      const storedTokens = JSON.parse(localStorage.getItem('decodedTokens'))
      const token = storedTokens?.[0]?.token
      const decodedToken = storedTokens[0]
      const userId = decodedToken.id

      const response = await axios.put(
        `http://localhost:5000/members/${userId}`,
        formData
      )
      setUserInfo(response.data)
      setEditMode(false)
      storedTokens[0].name = response.data.name
      localStorage.setItem('decodedTokens', JSON.stringify(storedTokens))
    } catch (error) {
      setError('Failed to update profile')
      console.error(error)
    }
  }

  const handleStatusChange = (taskId, status) => {
    setEditingTaskId(taskId)
    setTaskStatus(status)
  }

  const handleStatusUpdate = async () => {
    try {
      const updatedTask = await updateTaskStatus(editingTaskId, taskStatus)
      setAssignedTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === editingTaskId ? updatedTask : task
        )
      )
      setEditingTaskId(null)
      setTaskStatus('')
    } catch (error) {
      setError('Failed to update task status')
      console.error(error)
    }
  }

  return (
    <div className='container-fluid d-flex p-0'>
      <div className='sidebar bg-dark p-3'>
        <a
          className='nav-link'
          onClick={() => handleSectionChange('dashboard')}
        >
          Dashboard
        </a>
        <a className='nav-link' onClick={() => handleSectionChange('projects')}>
          Projects
        </a>
        <a className='nav-link' onClick={() => handleSectionChange('tasks')}>
          Tasks
        </a>
        <a className='nav-link' onClick={() => handleSectionChange('profile')}>
          Profile
        </a>
        <a className='nav-link' onClick={handleLogout}>
          Sign Out
        </a>
      </div>
      <div className='main-content flex-grow-1 p-4'>
        <div className='d-flex justify-content-between align-items-center mb-4'>
          <div className='input-group'>
            <input
              type='text'
              className='form-control'
              placeholder='Search...'
            />
            <button className='btn btn-outline-secondary '>
              <FaSearch />
            </button>
          </div>
          <div className='d-flex align-items-center'>
            <FaBell className='me-3' />
            <span className='username'>
              {userInfo ? userInfo.name : 'Loading...'}
            </span>
          </div>
        </div>
        <div className='content'>
          {activeSection === 'dashboard' && <h1>Welcome to the Dashboard</h1>}
          {activeSection === 'projects' && (
            <div>
              <h1>Projects</h1>
              <h2>All Projects</h2>
              <div className='row'>
                {allProjects.map((project) => (
                  <div className='col-md-4' key={project._id}>
                    <div className='card mb-4'>
                      <div className='card-body'>
                        <h5 className='card-title'>{project.title}</h5>
                        <p className='card-text'>{project.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <h2>Projects Assigned to You</h2>
              <div className='row'>
                {assignedProjects.map((project) => (
                  <div className='col-md-4' key={project._id}>
                    <div className='card mb-4'>
                      <div className='card-body'>
                        <h5 className='card-title'>{project.title}</h5>
                        <p className='card-text'>{project.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeSection === 'tasks' && (
            <div>
              <h1>Tasks</h1>
              <div className='row'>
                {assignedTasks.map((task) => (
                  <div
                    className={`col-md-4 mb-4 ${
                      task.status === 'completed' ? 'bg-success text-white' : ''
                    }`}
                    key={task._id}
                  >
                    <div className='card m-4'>
                      <div className='card-body'>
                        <h5 className='card-title'>{task.title}</h5>
                        <p className='card-text'>{task.description}</p>
                        <p className='card-text'>Status: {task.status}</p>
                        {editingTaskId === task._id ? (
                          <div>
                            <div className='form-group mb-3'>
                              <label htmlFor='status'>Status</label>
                              <select
                                id='status'
                                className='form-control'
                                value={taskStatus}
                                onChange={(e) => setTaskStatus(e.target.value)}
                              >
                                <option value='pending'>Pending</option>
                                <option value='in-progress'>In Progress</option>
                                <option value='completed'>Completed</option>
                              </select>
                            </div>
                            <button
                              className='btn btn-success'
                              onClick={handleStatusUpdate}
                            >
                              Update Status
                            </button>
                          </div>
                        ) : (
                          <button
                            className='btn btn-primary'
                            onClick={() =>
                              handleStatusChange(task._id, task.status)
                            }
                          >
                            Update Status
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeSection === 'profile' && (
            <div>
              <h1>Profile Section</h1>
              {userInfo && (
                <div>
                  <p>Name: {userInfo.name}</p>
                  <p>Email: {userInfo.email}</p>
                  <button
                    className='btn btn-primary'
                    onClick={handleEditProfile}
                  >
                    Edit Profile
                  </button>
                  {editMode && (
                    <div className='mt-3'>
                      <div className='mb-3'>
                        <label className='form-label'>Name</label>
                        <input
                          type='text'
                          className='form-control'
                          name='name'
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className='mb-3'>
                        <label className='form-label'>Email</label>
                        <input
                          type='email'
                          className='form-control'
                          name='email'
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className='mb-3'>
                        <label className='form-label'>Password</label>
                        <input
                          type='password'
                          className='form-control'
                          name='password'
                          value={formData.password}
                          onChange={handleChange}
                        />
                      </div>
                      <button
                        className='btn btn-success'
                        onClick={handleUpdateProfile}
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

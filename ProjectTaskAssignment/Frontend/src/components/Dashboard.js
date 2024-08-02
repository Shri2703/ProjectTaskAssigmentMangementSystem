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
  uploadFile,
  updateTaskStatus,
} from '../api/project'
import './Dashboard.css' // Ensure this path is correct
import { dashimg } from '../asserts'
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
  const [file, setFile] = useState(null)
  const [fileUploadStatus, setFileUploadStatus] = useState(null)

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleFileUpload = async () => {
    try {
      const storedTokens = JSON.parse(localStorage.getItem('decodedTokens'))
      const userId = storedTokens?.[0]?.id

      const response = await uploadFile(file, userId, editingTaskId)
      if (response) {
        setFileUploadStatus('File uploaded successfully')
      } else {
        setFileUploadStatus('Failed to upload file')
      }
    } catch (error) {
      setFileUploadStatus('Failed to upload file')
      console.error(error)
    }
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

  const getCardStyle = (status) => {
    switch (status) {
      case 'completed':
        return {
          border: '2px solid green',
          borderRadius: '0.25rem', // Adjust border radius as needed
          backgroundColor: 'white', // Keeping background color white
        }
      default:
        return {
          border: '1px solid #ddd',
          borderRadius: '0.25rem', // Adjust border radius as needed
          backgroundColor: 'white',
        }
    }
  }

  return (
    <div className='container-fluid d-flex p-0 '>
      <div className='sidebar bg-dark p-3 pt-5'>
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
        <div className='d-flex justify-content-between align-items-center mb-2'>
          <div className='input-group w-50'>
            <input
              type='text'
              className='form-control'
              placeholder='Search...'
            />
            <button className='btn btn-outline-secondary'>
              <FaSearch />
            </button>
          </div>
          <div className='d-flex align-items-center py-2'>
            <FaBell className='me-2' />
            <span className='username'>
              {userInfo ? userInfo.name : 'Loading...'}
            </span>
          </div>
        </div>

        <div className='content'>
          {activeSection === 'dashboard' && (
            <div className='dashboard-center'>
              <h1>Welcome to the Dashboard</h1>
              <img
                src={dashimg} // Update this path to your image
                alt='Dashboard'
                className='img-fluid mt-1 w-50'
              />
            </div>
          )}

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
              <h2>Assigned Projects</h2>
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
                  <div className='col-md-4' key={task._id}>
                    <div
                      className='card mb-4'
                      style={getCardStyle(task.status)}
                    >
                      <div className='card-body'>
                        <h5 className='card-title'>{task.title}</h5>
                        <p className='card-text'>{task.description}</p>
                        {editingTaskId === task._id ? (
                          <div>
                            <select
                              value={taskStatus}
                              onChange={(e) =>
                                handleStatusChange(task._id, e.target.value)
                              }
                              className='form-select mb-2'
                            >
                              <option value='pending'>pending</option>
                              <option value='in-process'>in-progress</option>
                              <option value='completed'>Completed</option>
                            </select>
                            <button
                              className='btn btn-primary'
                              onClick={handleStatusUpdate}
                            >
                              Update Status
                            </button>
                          </div>
                        ) : (
                          <div>
                            <p>Status: {task.status}</p>
                            <button
                              className='btn btn-primary'
                              onClick={() =>
                                handleStatusChange(task._id, task.status)
                              }
                            >
                              Edit Status
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className='mt-2 col-md-4'>
                <h2 className='card-title'>Upload File</h2>
                <div className='card'>
                  <div className='card-body'>
                    <p>select the file and upload</p>
                    <div className='input-group '>
                      <input
                        type='file'
                        onChange={handleFileChange}
                        className='form-control mb-2'
                        id='fileUploadInput'
                      />
                    </div>

                    <div className='d-flex justify-content-around'>
                      <button
                        className='btn btn-primary'
                        onClick={handleFileUpload}
                      >
                        Upload
                      </button>
                      <button
                        className='btn btn-secondary'
                        onClick={() => {
                          document.getElementById('fileUploadInput').value = '' // Clear file input
                          setFile(null)
                          setFileUploadStatus(null) // Clear file state
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                    {fileUploadStatus && (
                      <p className='mt-2'>{fileUploadStatus}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeSection === 'profile' && (
            <div>
              <h1>Profile</h1>
              {userInfo && !editMode && (
                <div>
                  <p>Name: {userInfo.name}</p>
                  <p>Email: {userInfo.email}</p>
                  <button
                    className='btn btn-primary'
                    onClick={handleEditProfile}
                  >
                    Edit Profile
                  </button>
                </div>
              )}
              {editMode && (
                <div>
                  <div className='mb-3'>
                    <label htmlFor='name' className='form-label'>
                      Name
                    </label>
                    <input
                      type='text'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      className='form-control'
                    />
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='email' className='form-label'>
                      Email
                    </label>
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      className='form-control'
                    />
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='password' className='form-label'>
                      Password
                    </label>
                    <input
                      type='password'
                      name='password'
                      value={formData.password}
                      onChange={handleChange}
                      className='form-control'
                    />
                  </div>
                  <button
                    className='btn btn-primary'
                    onClick={handleUpdateProfile}
                  >
                    Update Profile
                  </button>
                  <button
                    className='btn btn-secondary ms-2'
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
          {error && <p className='text-danger'>{error}</p>}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

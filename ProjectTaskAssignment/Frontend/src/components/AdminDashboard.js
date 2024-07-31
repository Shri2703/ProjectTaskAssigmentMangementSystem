import React, { useEffect, useState } from 'react'
import {
  getProjects,
  getUsers,
  createProject,
  updateProject,
  deleteProject,
  getUsersWithCounts,
} from '../api/admin'
import { logoutUser } from '../redux/actions/authActions'
import { useNavigate } from 'react-router-dom'


import { FaBell, FaSearch } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import Button from '../components/Button'
import './AdminDashboard.css'
import Tasks from './Task' // Adjust the path as necessary
import axios from 'axios'
import { useSelector } from 'react-redux'
const API_URL = 'http://localhost:5000'
const AdminDashboard = () => {
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [selectedTab, setSelectedTab] = useState('projects')
  const [selectedProject, setSelectedProject] = useState(null)
  const [newProject, setNewProject] = useState({ name: '', description: '' })
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [username, setUsername] = useState('')

  // State for update functionality
  const [isUpdating, setIsUpdating] = useState(false)
  const [projectToUpdate, setProjectToUpdate] = useState(null)
  const [updatedProject, setUpdatedProject] = useState({
    name: '',
    description: '',
  })

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const token = useSelector((state) => state.auth.token)
  const user = useSelector((state) => state.auth.user)

 const dispatch = useDispatch()
 const navigate = useNavigate()
  const fetchProfileData = async () => {
    try {
      if (!token) {
        console.error('No authentication token found')
        return
      }
      const response = await axios.get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
      })
      const profile = response.data
      setProfileData(profile) // Update state with fetched profile data
    } catch (error) {
      console.error('Error fetching profile data:', error)
    }
  }

  useEffect(() => {
    fetchProfileData()
  }, [token]) // Re-fetch profile data when token changes

  const handleProfileUpdate = async () => {
    try {
      if (!token) {
        console.error('No authentication token found')
        return
      }
      const response = await axios.put(`${API_URL}/profile`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
      })
      const updatedProfile = response.data
      setProfileData(updatedProfile) // Update state with new data
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  useEffect(() => {
    const fetchUsersWithCounts = async () => {
      try {
        const data = await getUsersWithCounts()
        console.log('Users with counts data:', data)
        setUsers(data) // Update state with fetched data
      } catch (error) {
        console.error('Error fetching users with counts:', error)
      }
    }

    fetchUsersWithCounts()
  }, [])

  useEffect(() => {
    const fetchProjectsAndUsers = async () => {
      try {
        const projectsData = await getProjects()
        const usersData = await getUsers()
        setProjects(projectsData)
        setUsers(usersData)
        const loggedInUser = 'John Doe' // Replace with actual logic to fetch username
        setUsername(loggedInUser)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchProjectsAndUsers()
  }, [])

  const handleTabClick = (tab) => {
    setSelectedTab(tab)
    setSelectedProject(null)
    setIsUpdating(false)
  }

  const handleProjectClick = (project) => {
    setSelectedProject(project)
    setUpdatedProject({ name: project.name, description: project.description })
    setProjectToUpdate(project)
    setIsUpdating(true)
  }

  const handleCreateProject = async () => {
    try {
      await createProject(newProject)
      // Directly update state without fetching again
      setProjects((prevProjects) => [
        ...prevProjects,
        { ...newProject, _id: Math.random().toString(36).substr(2, 9) }, // Mocking ID
      ])
      setNewProject({ name: '', description: '' })
      setShowCreateForm(false)
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  const handleUpdateProject = async () => {
    try {
      if (projectToUpdate) {
        await updateProject(projectToUpdate._id, updatedProject)
        // Directly update state without fetching again
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project._id === projectToUpdate._id
              ? { ...project, ...updatedProject }
              : project
          )
        )
        setIsUpdating(false)
        setSelectedProject(null)
        setProjectToUpdate(null)
        setUpdatedProject({ name: '', description: '' })
      }
    } catch (error) {
      console.error('Error updating project:', error)
    }
  }

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId)
      // Directly update state without fetching again
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project._id !== projectId)
      )
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUpdatedProject((prev) => ({ ...prev, [name]: value }))
  }
  
  const handleLogout = () => {
    dispatch(logoutUser())
    // Clear the localStorage
    localStorage.removeItem('decodedTokens')
    // Navigate to homepage
    navigate('/')
  }  
  

  return (
    <div className='container-fluid p-0 d-flex'>
      <div className=' sidebar px-3 pt-5 '>
        <ul className='nav flex-column'>
          <li
            className={`nav-item mt-2 ${
              selectedTab === 'projects' ? 'active' : ''
            }`}
            onClick={() => handleTabClick('projects')}
          >
            <a className='nav-link '>Projects</a>
          </li>
          <li
            className={`nav-item mt-2 ${
              selectedTab === 'tasks' ? 'active' : ''
            }`}
            onClick={() => handleTabClick('tasks')}
          >
            <a className='nav-link '>Tasks</a>
          </li>
          <li
            className={`nav-item mt-2 ${
              selectedTab === 'users' ? 'active' : ''
            }`}
            onClick={() => handleTabClick('users')}
          >
            <a className='nav-link '>Users</a>
          </li>

          {/* <li
            className={`nav-item mt-2 ${
              selectedTab === 'profile' ? 'active' : ''
            }`}
            onClick={() => handleTabClick('profile')}
          >
            <a className='nav-link text-dark'>Profile</a>
          </li> */}
        </ul>
        <a className='nav-link' onClick={handleLogout}>
          Sign Out
        </a>
      </div>
      <div className='main-content flex-fill p-4 bg-some'>
        <div className='search-header'>
          <div className='search-bar'>
            <input type='text' placeholder='Search...' />
            <button>
              <FaSearch />
            </button>
          </div>
          <div className='user-info'>
            <span className='username'>Admin</span>
          </div>
        </div>
        <div className='header d-flex justify-content-between align-items-center mb-4 pt-5'>
          <h1>Welcome to Admin Dashboard</h1>
        </div>
        <div className='content'>
          {selectedTab === 'projects' && (
            <div>
              <div className='d-flex justify-content-between mb-4'>
                <h2 className='text-bold'>All Projects</h2>
                <Button
                  variant='success'
                  onClick={() => setShowCreateForm(!showCreateForm)}
                >
                  {showCreateForm ? 'Hide Form' : 'Create New Project'}
                </Button>
              </div>
              {showCreateForm && (
                <div className='card mb-4'>
                  <div className='card-body'>
                    <h5 className='card-title'>Create New Project</h5>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        handleCreateProject()
                      }}
                    >
                      <div className='mb-3'>
                        <input
                          type='text'
                          className='form-control'
                          placeholder='Project Title'
                          value={newProject.name}
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              name: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className='mb-3'>
                        <textarea
                          className='form-control'
                          placeholder='Project Description'
                          value={newProject.description}
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              description: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <Button type='submit' variant='primary'>
                        Create Project
                      </Button>
                    </form>
                  </div>
                </div>
              )}
              {projects.length === 0 ? (
                <p>No projects available.</p>
              ) : (
                <div className='row'>
                  {projects.map((project) => (
                    <div className='col-md-4 mb-4' key={project._id}>
                      <div className='card'>
                        <div className='card-body'>
                          <h5 className='card-title text-bold'>
                            {project.name}
                          </h5>
                          <p className='card-text text-basic'>
                            {project.description}
                          </p>
                          <div className='d-flex'>
                            <Button
                              variant='warning'
                              onClick={() => handleProjectClick(project)}
                            >
                              Update
                            </Button>
                            <Button
                              variant='danger'
                              className='ms-2'
                              onClick={() => handleDeleteProject(project._id)}
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
          )}
          {selectedTab === 'tasks' && <Tasks />}
          {selectedTab === 'users' && (
            <div>
              <h2 className='text-bold'>All Users</h2>
              <div className='row'>
                {users.length === 0 ? (
                  <p>No users available.</p>
                ) : (
                  users.map((user) => (
                    <div className='col-md-4 mb-4' key={user._id}>
                      <div className='card'>
                        <div className='card-body'>
                          <h5 className='card-title text-basic'>
                            Name:{user.name}
                          </h5>
                          <p className='card-text text-basic'>
                            E-Mail: {user.email}
                          </p>
                          <p className='card-text text-basic'>
                            Tasks: {user.taskCount || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          {/* {selectedTab === 'profile' && (
            <div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleProfileUpdate() // Use the locally defined function
                }}
              >
                <div className='mb-3'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Name'
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className='mb-3'>
                  <input
                    type='email'
                    className='form-control'
                    placeholder='Email'
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className='mb-3'>
                  <input
                    type='password'
                    className='form-control'
                    placeholder='Password'
                    value={profileData.password}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
                <button type='submit' className='btn btn-primary'>
                  Update Profile
                </button>
              </form>
            </div>
          )} */}

          {isUpdating && selectedTab === 'projects' && (
            <div className='card mt-4'>
              <div className='card-body'>
                <h5 className='card-title'>Update Project</h5>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleUpdateProject()
                  }}
                >
                  <div className='mb-3'>
                    <input
                      type='text'
                      className='form-control'
                      placeholder='Project Title'
                      name='name'
                      value={updatedProject.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className='mb-3'>
                    <textarea
                      className='form-control'
                      placeholder='Project Description'
                      name='description'
                      value={updatedProject.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button type='submit' variant='primary'>
                    Update Project
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

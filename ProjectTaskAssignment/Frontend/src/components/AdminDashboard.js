import React, { useEffect, useState } from 'react'
import {
  getProjects,
  getUsers,
  createProject,
  updateProject,
  deleteProject,
} from '../api/admin'
import Button from '../components/Button'
import './AdminDashboard.css'
import Tasks from './Task' // Adjust the path as necessary

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

  return (
    <div className='container-fluid d-flex'>
      <div className='sidebar bg-light p-3 pt-5 '>
        <ul className='nav flex-column'>
          <li
            className={`nav-item mt-2 ${
              selectedTab === 'projects' ? 'active' : ''
            }`}
            onClick={() => handleTabClick('projects')}
          >
            <a className='nav-link text-dark'>Projects</a>
          </li>
          <li
            className={`nav-item mt-2 ${
              selectedTab === 'tasks' ? 'active' : ''
            }`}
            onClick={() => handleTabClick('tasks')}
          >
            <a className='nav-link text-dark'>Tasks</a>
          </li>
          <li
            className={`nav-item mt-2 ${
              selectedTab === 'users' ? 'active' : ''
            }`}
            onClick={() => handleTabClick('users')}
          >
            <a className='nav-link text-dark'>Users</a>
          </li>
          <li
            className={`nav-item mt-2 ${
              selectedTab === 'profile' ? 'active' : ''
            }`}
            onClick={() => handleTabClick('profile')}
          >
            <a className='nav-link text-dark'>Profile</a>
          </li>
        </ul>
      </div>
      <div className='main-content flex-fill p-4 bg-some'>
        <div className='header d-flex justify-content-between align-items-center mb-4'>
          <h1>Welcome to Admin Dashboard</h1>
          <div className='d-flex align-items-center'>
            <Button
              variant='secondary'
              onClick={() => {
                /* Handle logout or other action */
              }}
            >
              <i className='fas fa-sign-out-alt'></i>
            </Button>
          </div>
        </div>
        <div className='content'>
          {selectedTab === 'projects' && (
            <div>
              <div className='d-flex justify-content-between mb-4'>
                <h2>All Projects</h2>
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
                          <h5 className='card-title text-bold'>{project.name}</h5>
                          <p className='card-text text-basic'>{project.description}</p>
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
                          {/* <Button
                            className='mt-2'
                            variant='info'
                            onClick={() => handleProjectClick(project)}
                          >
                            View More
                          </Button> */}
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
              <h2>All Users</h2>
              <div className='row'>
                {users.length === 0 ? (
                  <p>No users available.</p>
                ) : (
                  users.map((user) => (
                    <div className='col-md-4 mb-4' key={user._id}>
                      <div className='card'>
                        <div className='card-body'>
                          <h5 className='card-title text-bold'>{user.name}</h5>
                          <p className='card-text text-basic'>{user.email}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          {selectedTab === 'profile' && (
            <div>
              <h2>Profile</h2>
              <p>Username: {username}</p>
            </div>
          )}
        </div>
        {isUpdating && (
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
                    name='name'
                    className='form-control'
                    placeholder='Project Title'
                    value={updatedProject.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className='mb-3'>
                  <textarea
                    name='description'
                    className='form-control'
                    placeholder='Project Description'
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
  )
}

export default AdminDashboard

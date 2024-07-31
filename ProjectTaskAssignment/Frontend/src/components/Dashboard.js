import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { logoutUser } from '../redux/actions/authActions'
import { FaBell, FaSearch } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css' // Ensure this path is correct

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null)
  const [error, setError] = useState(null)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    // Get the token from localStorage
    const storedTokens = JSON.parse(localStorage.getItem('decodedTokens'))
    const token = storedTokens?.[0]?.token

    if (token) {
      // Decode the token to get the user ID
      const decodedToken = storedTokens[0]
      const userId = decodedToken.id

      // Fetch user information by ID
      const fetchUserInfo = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/members/${userId}`
          )
          setUserInfo(response.data)
        } catch (error) {
          setError('Failed to fetch user information')
          console.error(error)
        }
      }

      fetchUserInfo()
    } else {
      setError('No token found')
    }
  }, [])

  const handleLogout = () => {
    dispatch(logoutUser())
    // Clear the localStorage
    localStorage.removeItem('decodedTokens')
    // Navigate to homepage
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
      // Update the name in localStorage
      storedTokens[0].name = response.data.name
      localStorage.setItem('decodedTokens', JSON.stringify(storedTokens))
    } catch (error) {
      setError('Failed to update profile')
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
          {activeSection === 'projects' && <h1>This is the Project Section</h1>}
          {activeSection === 'tasks' && <h1>This is the Task Section</h1>}
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
                          name='name'
                          className='form-control'
                          value={formData.name}
                          onChange={handleChange}
                          placeholder='Name'
                        />
                      </div>
                      <div className='mb-3'>
                        <label className='form-label'>Email</label>
                        <input
                          type='email'
                          name='email'
                          className='form-control'
                          value={formData.email}
                          onChange={handleChange}
                          placeholder='Email'
                        />
                      </div>
                      <div className='mb-3'>
                        <label className='form-label'>Password</label>
                        <input
                          type='password'
                          name='password'
                          className='form-control'
                          value={formData.password}
                          onChange={handleChange}
                          placeholder='Password'
                        />
                      </div>
                      <button
                        className='btn btn-success'
                        onClick={handleUpdateProfile}
                      >
                        Update Profile
                      </button>
                    </div>
                  )}
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

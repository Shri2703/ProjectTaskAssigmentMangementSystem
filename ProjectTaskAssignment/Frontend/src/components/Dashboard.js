// src/components/Dashboard.js
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../redux/actions/authActions'
import { FaBell, FaSearch } from 'react-icons/fa'
import './Dashboard.css' // Ensure this path is correct

const Dashboard = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user) // Adjust this based on your state structure

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <div className='flex-container'>
      <div className='sidebar'>
        <a href='#dashboard'>Dashboard</a>
        <a href='#projects'>Projects</a>
        <a href='#tasks'>Tasks</a>
        <a onClick={handleLogout}>Sign Out</a>
      </div>
      <div className='main-content'>
        <div className='search-header'>
          <div className='search-bar'>
            <input type='text' placeholder='Search...' />
            <button>
              <FaSearch />
            </button>
          </div>
          <div className='user-info'>
            <FaBell className='bell-icon' />
            <span className='username'>Member</span>
          </div>
        </div>
        <div className='content'>
          <h1>Welcome to the Member Page</h1>
          {/* Add other user-specific components or UI here */}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

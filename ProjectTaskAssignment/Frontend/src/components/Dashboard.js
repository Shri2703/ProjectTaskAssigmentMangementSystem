// src/components/Dashboard.js
import React from 'react'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../redux/actions/authActions'

const Dashboard = () => {
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <div>
      <h1>User Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
      {/* Add other user-specific components or UI here */}
    </div>
  )
}

export default Dashboard

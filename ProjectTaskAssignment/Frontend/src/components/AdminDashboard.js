// src/components/AdminDashboard.js

import React, { useEffect, useState } from 'react'
import { getProjects, getUsers } from '../api/admin' // Replace with your API calls

const AdminDashboard = () => {
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    // Fetch projects and users for admin
    const fetchProjectsAndUsers = async () => {
      try {
        const projectsData = await getProjects() // Implement this API call
        const usersData = await getUsers() // Implement this API call
        setProjects(projectsData)
        setUsers(usersData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchProjectsAndUsers()
  }, [])

  return (
    <div className='admin-dashboard'>
      <h1>Admin Dashboard</h1>
      <div className='projects'>
        <h2>All Projects</h2>
        {projects.length > 0 ? (
          <ul>
            {projects.map((project) => (
              <li key={project._id}>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No projects found.</p>
        )}
      </div>
      <div className='users'>
        <h2>All Users</h2>
        {users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li key={user._id}>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard

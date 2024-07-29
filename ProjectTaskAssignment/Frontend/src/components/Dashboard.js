// src/components/Dashboard.js

import React, { useEffect, useState } from 'react'
import { getProjects } from '../api/projects' // Replace with your API call
import '../style.css'
const Dashboard = () => {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    // Fetch projects for the user
    const fetchProjects = async () => {
      try {
        const data = await getProjects() // Implement this API call
        setProjects(data)
      } catch (error) {
        console.error('Error fetching projects:', error)
      }
    }

    fetchProjects()
  }, [])

  return (
     
    <div className="container dashboard">
      <h2>Dashboard</h2>
      <div className="project-cards">
        <div className="project-card">
          <h2>Project Title</h2>
          <p>Project Description</p>
          <button>View Details</button>
        </div>
      </div>
    </div>
  )
  
}

export default Dashboard

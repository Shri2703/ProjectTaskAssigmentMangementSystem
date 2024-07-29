// src/api/projects.js

import axios from 'axios'

const API_URL = 'http://localhost:5000' // Replace with your API URL

export const getProjects = async () => {
  try {
    const response = await axios.get(`${API_URL}/projects`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return response.data
  } catch (error) {
    throw error
  }
}

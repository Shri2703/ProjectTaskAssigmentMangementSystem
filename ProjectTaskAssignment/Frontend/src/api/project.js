// api/project.js
import axios from 'axios'

const API_URL = 'http://localhost:5000' // Update this with your API URL

export const getProjects = async () => {
  const response = await axios.get(`${API_URL}/projects`)
  return response.data
}



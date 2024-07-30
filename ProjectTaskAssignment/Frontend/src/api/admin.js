import axios from 'axios'

const API_URL = 'http://localhost:5000'

// Projects API
export const getProjects = async () => {
  const response = await axios.get(`${API_URL}/projects`)
  return response.data
}

export const createProject = async (project) => {
  const response = await axios.post(`${API_URL}/projects`, project)
  return response.data
}

export const updateProject = async (projectId, project) => {
  const response = await axios.put(`${API_URL}/projects/${projectId}`, project)
  return response.data
}

export const deleteProject = async (projectId) => {
  const response = await axios.delete(`${API_URL}/projects/${projectId}`)
  return response.data
}

// Users API
export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/members`)
  return response.data
}

export const createUser = async (user) => {
  const response = await axios.post(`${API_URL}/members`, user)
  return response.data
}

export const updateUser = async (userId, user) => {
  const response = await axios.put(`${API_URL}/members/${userId}`, user)
  return response.data
}

export const deleteUser = async (userId) => {
  const response = await axios.delete(`${API_URL}/members/${userId}`)
  return response.data
}

// Tasks API
export const getTasks = async () => {
  const response = await axios.get(`${API_URL}/tasks`)
  return response.data
}

export const createTask = async (task) => {
  const response = await axios.post(`${API_URL}/tasks`, task)
  return response.data
}

export const updateTask = async (taskId, task) => {
  const response = await axios.put(`${API_URL}/tasks/${taskId}`, task)
  return response.data
}

export const deleteTask = async (taskId) => {
  const response = await axios.delete(`${API_URL}/tasks/${taskId}`)
  return response.data
}

// Users with Counts API
export const getUsersWithCounts = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/usersWithCounts`)
    return response.data
  } catch (error) {
    console.error('Error fetching users with task counts:', error)
    throw error
  }
}

// Profile API
export const updateProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('token') // Retrieve the JWT token from localStorage
    const response = await axios.put(`${API_URL}/profile`, profileData, {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in the request headers
      },
    })
    return response.data
  } catch (error) {
    console.error('Error updating profile:', error)
    throw error
  }
}

import axios from 'axios'

const API_URL = 'http://localhost:5000' // Update this with your API URL

export const getProjects = async () => {
  const response = await axios.get(`${API_URL}/projects`)
  return response.data
}

export const getAssignedProjects = async (userId) => {
  const response = await axios.get(`${API_URL}/projects/assigned/${userId}`)
  return response.data
}

export const getAllProjects = async () => {
  try {
    const response = await axios.get(`${API_URL}/projects`)
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Failed to fetch all projects', error)
    return [] // Return an empty array on error
  }
}

export const getAssignedTasks = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/tasks/assigned/${userId}`)
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Failed to fetch assigned tasks', error)
    return [] // Return an empty array on error
  }
}

export const uploadFile = async (file, userId, taskId) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('userId', userId)
  formData.append('taskId', taskId)

  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error(
      'Failed to upload file',
      error.response ? error.response.data : error.message
    )
    throw error
  }
}

export const updateTaskStatus = async (taskId, status) => {
  const response = await axios.put(`${API_URL}/updateStatus/${taskId}`, {
    status,
  })
  return response.data
}

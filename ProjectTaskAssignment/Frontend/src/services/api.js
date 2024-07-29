import axios from 'axios'

const API_URL = 'http://localhost:5000'

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor to attach the JWT token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const register = (userData) => {
  return axios.post('/register', userData)
}

export const login = (userData) => axiosInstance.post('/login', userData)

export const getMembers = () => axiosInstance.get('/members')

export const createProject = (projectData) =>
  axiosInstance.post('/projects', projectData)

export const getProjects = () => axiosInstance.get('/projects')

export const updateProject = (id, projectData) =>
  axiosInstance.put(`/projects/${id}`, projectData)

export const deleteProject = (id) => axiosInstance.delete(`/projects/${id}`)

export const createTask = (taskData) => axiosInstance.post('/tasks', taskData)

export const getTasks = () => axiosInstance.get('/tasks')

export const updateTask = (id, taskData) =>
  axiosInstance.put(`/tasks/${id}`, taskData)

export const deleteTask = (id) => axiosInstance.delete(`/tasks/${id}`)

export const uploadFile = (fileData) =>
  axiosInstance.post('/api/upload', fileData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

export const search = (query) => axiosInstance.get(`/search?q=${query}`)

// frontend/src/api/tasks.js

import axios from 'axios'

// Define the base URL for your backend API
const API_BASE_URL = 'http://localhost:5000' // Adjust according to your backend URL

// Function to fetch all tasks

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/members`)
    return response.data
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

export const getProjects = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects`);
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};
export const getTasks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks`)
    return response.data
  } catch (error) {
    console.error('Error fetching tasks:', error)
    throw error
  }
}

// Function to create a new task
export const createTask = async (taskData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tasks`, taskData)
    return response.data
  } catch (error) {
    console.error('Error creating task:', error)
    throw error
  }
}

// Function to update an existing task
export const updateTask = async (taskId, taskData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/tasks/${taskId}`,
      taskData
    )
    return response.data
  } catch (error) {
    console.error('Error updating task:', error)
    throw error
  }
}

// Function to delete a task
export const deleteTask = async (taskId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/tasks/${taskId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting task:', error)
    throw error
  }
}

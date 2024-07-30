// api/member.js
import axios from 'axios'

const API_URL = 'http://localhost:5000' // Update this with your API URL

export const getMembers = async () => {
  const response = await axios.get(`${API_URL}/members`)
  return response.data
}
export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/members`)
  return response.data
}
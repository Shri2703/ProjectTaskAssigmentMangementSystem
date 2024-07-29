// src/api/auth.js
import axios from 'axios';
import { jwtDecode as jwt_decode } from 'jwt-decode'

import { REGISTER_SUCCESS, REGISTER_FAIL } from './types'

export const registerUser = (formData) => async (dispatch) => {
  try {
    const res = await axios.post('http://localhost:5000/register', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: REGISTER_FAIL,
      payload: err.response.data.errors,
    })
  }
}

// Function to handle user login
export const loginUser = async (email, password) => {
  try {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (response.ok) {
      const data = await response.json()
      localStorage.setItem('token', data.token)

      // Decode token to get user role
      const decodedToken = jwt_decode(data.token)
      const userRole = decodedToken.role

      // Return role to handle redirection
      return { token: data.token, role: userRole }
    } else {
      throw new Error('Login failed')
    }
  } catch (error) {
    console.error('Error logging in:', error)
    throw error
  }
}

// Function to get the current user from the token
export const getCurrentUser = () => {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      return jwt_decode(token)
    } catch (error) {
      console.error('Error decoding token:', error)
    }
  }
  return null
}

// Function to handle user logout
export const logoutUser = () => {
  localStorage.removeItem('token')
}

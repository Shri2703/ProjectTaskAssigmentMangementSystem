import axios from 'axios'
import { jwtDecode as jwt_decode } from 'jwt-decode'
import { SET_CURRENT_USER } from '../types'
import setAuthToken from '../../utils/setAuthToken'

// Set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  }
}

// Login - Get user token
export const loginUser = (token) => (dispatch) => {
  // Save token to localStorage
  localStorage.setItem('jwtToken', token)
  // Set token to Auth header
  setAuthToken(token)
  // Decode token to get user data
  const decoded = jwt_decode(token)
  // Set current user
  dispatch(setCurrentUser(decoded))
}

// Log user out
export const logoutUser = () => (dispatch) => {
  // Remove token from local storage
  localStorage.removeItem('jwtToken')
  // Remove auth header for future requests
  setAuthToken(false)
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}))
}

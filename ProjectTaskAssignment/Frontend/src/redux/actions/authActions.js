// src/redux/actions/authActions.js
import {
  SET_TOKEN,
  SET_CURRENT_USER,
  LOGOUT_USER,
  UPDATE_USER_PROFILE,
} from '../types'

// Action to set token
export const setToken = (token) => ({
  type: SET_TOKEN,
  payload: token,
})

// Action to set current user
export const setCurrentUser = (user) => ({
  type: SET_CURRENT_USER,
  payload: user,
})

// Action to handle logout
export const logoutUser = () => ({
  type: LOGOUT_USER,
})

// Action to update user profile
export const updateUserProfile = (user) => ({
  type: UPDATE_USER_PROFILE,
  payload: user,
})

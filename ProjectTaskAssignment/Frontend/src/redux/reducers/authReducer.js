// src/redux/reducers/authReducer.js
import { SET_TOKEN, SET_CURRENT_USER, LOGOUT_USER } from '../types'

const initialState = {
  token: null,
  user: null,
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      }
    case SET_CURRENT_USER:
      return {
        ...state,
        user: action.payload,
      }
    case LOGOUT_USER:
      return {
        ...state,
        token: null,
        user: null,
      }
    default:
      return state
  }
}

export default authReducer

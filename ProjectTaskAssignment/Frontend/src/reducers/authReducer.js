const initialState = {
  token: localStorage.getItem('token') || '',
  isAuthenticated: !!localStorage.getItem('token'),
  user: null,
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token)
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        user: action.payload.user,
      }
    case 'LOGOUT':
      localStorage.removeItem('token')
      return {
        ...state,
        token: '',
        isAuthenticated: false,
        user: null,
      }
    case 'GET_USER':
      return {
        ...state,
        user: action.payload,
      }
    default:
      return state
  }
}

export default authReducer

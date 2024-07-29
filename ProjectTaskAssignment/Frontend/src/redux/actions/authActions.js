import axios from 'axios'

export const register = (userData) => async (dispatch) => {
  try {
    const res = await axios.post('/register', userData)
    dispatch({
      type: 'REGISTER_SUCCESS',
      payload: res.data,
    })
  } catch (err) {
    console.error(err)
  }
}

export const login = (userData) => async (dispatch) => {
  try {
    const res = await axios.post('/login', userData)
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: res.data,
    })
  } catch (err) {
    console.error(err)
  }
}

export const logout = () => (dispatch) => {
  dispatch({ type: 'LOGOUT' })
}

export const getUser = () => async (dispatch) => {
  try {
    const res = await axios.get('/user', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    dispatch({
      type: 'GET_USER',
      payload: res.data,
    })
  } catch (err) {
    console.error(err)
  }
}

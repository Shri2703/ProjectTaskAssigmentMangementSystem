// Login.js
import React, { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { jwtDecode as jwtDecode} from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { setToken } from '../redux/actions/authActions'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { email, password } = formData

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
      })
      const { token } = response.data
      dispatch(setToken(token))
      const decodedToken = jwtDecode(token)
      if (decodedToken.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      console.error(err.response.data)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type='email'
        name='email'
        value={email}
        onChange={onChange}
        placeholder='Email'
      />
      <input
        type='password'
        name='password'
        value={password}
        onChange={onChange}
        placeholder='Password'
      />
      <button type='submit'>Login</button>
    </form>
  )
}

export default Login

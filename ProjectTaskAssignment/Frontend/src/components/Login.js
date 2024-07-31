import React, { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import {jwtDecode} from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { setToken } from '../redux/actions/authActions'
import Button from '../components/Button'
import './Login.css'

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

      // Store the decoded token in localStorage as an array of objects
      localStorage.setItem(
        'decodedTokens',
        JSON.stringify([{ token, ...decodedToken }])
      )

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
    <div className='container d-flex justify-content-center align-items-center vh-100'>
      <div className='card p-4' style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className='text-center mb-4'>Login</h2>
        <form onSubmit={onSubmit}>
          <div className='form-group p-2'>
            <input
              type='email'
              name='email'
              className='form-control'
              value={email}
              onChange={onChange}
              placeholder='Email'
              required
            />
          </div>
          <div className='form-group p-2'>
            <input
              type='password'
              name='password'
              className='form-control'
              value={password}
              onChange={onChange}
              placeholder='Password'
              required
            />
          </div>
          <Button type='submit' variant='success' className='w-100'>
            Login
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Login

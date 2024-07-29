import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const navigate = useNavigate()

  const { email, password } = formData

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:5000/login', formData)
      console.log(res.data)
      // Handle token storage and redirection here
      navigate('/dashboard')
    } catch (err) {
      console.error(err.response.data)
    }
  }

  return (
    <div className='login-container'>
      <form className='login-form' onSubmit={onSubmit}>
        <h2>Login</h2>
        <input
          type='email'
          name='email'
          value={email}
          onChange={onChange}
          placeholder='Email'
          required
        />
        <input
          type='password'
          name='password'
          value={password}
          onChange={onChange}
          placeholder='Password'
          required
        />
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

export default Login

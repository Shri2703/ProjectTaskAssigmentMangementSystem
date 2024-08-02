import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button' // Import the Button component
import './Register.css'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const navigate = useNavigate()

  const { name, email, password } = formData

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:5000/register', formData)
      console.log(res.data)
      navigate('/login')
    } catch (err) {
      console.error(err.response.data)
    }
  }

  const handleLoginRedirect = () => {
    navigate('/login')
  }

  return (
    <div className='container d-flex justify-content-center align-items-center vh-100'>
      <div className='card p-4' style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className='text-center mb-4'>Register</h2>
        <form onSubmit={onSubmit}>
          <div className='form-group p-2'>
            <input
              type='text'
              name='name'
              className='form-control'
              value={name}
              onChange={onChange}
              placeholder='Name'
              required
            />
          </div>
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
            Register
          </Button>
        </form>
        <div className='text-center mt-3'>
          <p>
            If you have an account,{' '}
            <span
              className='text-primary'
              style={{ cursor: 'pointer' }}
              onClick={handleLoginRedirect}
            >
              click here
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register

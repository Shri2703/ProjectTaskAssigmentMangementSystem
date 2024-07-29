import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


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

  return (
    <div className='register-container'>
      <form className='register-form' onSubmit={onSubmit}>
        <h2>Register</h2>
        <input
          type='text'
          name='name'
          value={name}
          onChange={onChange}
          placeholder='Name'
          required
        />
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
        <button type='submit'>Register</button>
      </form>
    </div>
  )
}

export default Register

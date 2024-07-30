// Home.js
import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button' // Import the reusable Button component

import './Home.css'

const Home = () => (
  <div className='container d-flex justify-content-center align-items-center vh-100'>
    <div className='text-center'>
      <h1 className='mb-4'>Welcome to the Home Page</h1>
      <h6 className='mb-4'>If you are a new user, click the button below:</h6>
      <div className='d-flex justify-content-center gap-3'>
        <Link to='/register'>
          <Button variant='success'>Register</Button>
        </Link>
        <Link to='/login'>
          <Button variant='secondary'>Login</Button>
        </Link>
      </div>
    </div>
  </div>
)

export default Home

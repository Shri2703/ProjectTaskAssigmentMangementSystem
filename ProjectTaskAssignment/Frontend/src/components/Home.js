import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button' // Import the reusable Button component

import './Home.css'

const Home = () => (
  <div className='container d-flex justify-content-center align-items-center vh-100 p-5'>
    <div className='home-box text-center p-5'>
      <h1 className='mb-4'>Welcome to the Home Page</h1>
      <p className='mb-4'>
        Our Project and Task Management tool helps you efficiently manage
        projects and tasks. Whether you are an admin creating new projects or a
        team member updating tasks, our platform provides a seamless experience
        to enhance productivity and collaboration.
      </p>
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

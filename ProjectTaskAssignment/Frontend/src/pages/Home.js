import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Button from '../components/Button'
import './Home.css'

const Home = () => (
  <div className='home-container'>
    <div className='home-content'>
      <h1>Welcome to the Home Page</h1>
      <h6>If you are a new user, click the button below:</h6>
      <div className='button-container'>
        
        <Link to='/register'>
          <Button>Register</Button>
        </Link>
        <Link to='/login'>
          <Button>Login</Button>
        </Link>
      </div>
    </div>
  </div>
)

export default Home

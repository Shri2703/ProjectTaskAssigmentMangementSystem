import React from 'react'
import { Routes, Route, Router } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  )
}

export default App

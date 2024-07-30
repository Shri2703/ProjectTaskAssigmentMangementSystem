import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Admin from './components/AdminDashboard'
import { Provider } from 'react-redux'
import store from './redux/store'
import './style.css'
import Home from './components/Home'


const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/admin' element={<Admin />} />
          
        </Routes>
      </Router>
    </Provider>
  )
}

export default App

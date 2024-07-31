// src/index.js
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import store from './redux/store'
import App from './App'
import setAuthToken from './utils/setAuthToken'
import { setCurrentUser, logoutUser } from './redux/actions/authActions' // Correct import
import {jwtDecode as  jwt_decode} from 'jwt-decode'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  const token = localStorage.jwtToken
  setAuthToken(token)
  const decoded = jwt_decode(token)
  store.dispatch(setCurrentUser(decoded))

  const currentTime = Date.now() / 1000
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser())
    window.location.href = './login'
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    
      <App />
    
  </Provider>
)

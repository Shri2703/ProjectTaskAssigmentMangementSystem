import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import store from './redux/store'
import App from './App'
import setAuthToken from './utils/setAuthToken'
import { setCurrentUser, logoutUser } from './redux/actions/authActions' // Import logoutUser
import { jwtDecode as jwt_decode } from 'jwt-decode'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'
// Remove this line from index.js
//import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';



// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken
  setAuthToken(token)
  // Decode token and get user info and exp
  const decoded = jwt_decode(token)
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded))

  // Check for expired token
  const currentTime = Date.now() / 1000
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser())
    // Redirect to login
    window.location.href = './login'
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    
      <App />
    
  </Provider>
)

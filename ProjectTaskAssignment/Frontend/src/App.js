import React from 'react'
import { BrowserRouter as Router, Route,  Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>

          <Route path='/' component={Home} />
          <Route path='/register' component={Register} />
          <Route path='/login' component={Login} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App

// index.js or main.js
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Create a root
const root = ReactDOM.createRoot(document.getElementById('root'))

// Render the App
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

import React, { useEffect } from 'react'
import './Notification.css'

const Notification = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 1000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className='notification'>
      <span>{message}</span>
      <button onClick={onClose} className='close-btn'>
        x
      </button>
    </div>
  )
}

export default Notification

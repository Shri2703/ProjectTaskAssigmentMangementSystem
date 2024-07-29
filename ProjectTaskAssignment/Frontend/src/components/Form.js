import React from 'react'
import './form.css'

const Form = ({ children, onSubmit }) => {
  return (
    <form className='form' onSubmit={onSubmit}>
      {children}
    </form>
  )
}

export default Form

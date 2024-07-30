// Button.js
import React from 'react'
import PropTypes from 'prop-types'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../App.css'
const Button = ({
  children,
  onClick,
  className,
  type = 'button',
  variant = 'success',
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn btn-${variant} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
  ]),
  disabled: PropTypes.bool,
}

export default Button

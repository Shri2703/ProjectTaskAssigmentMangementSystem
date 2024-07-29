import React from 'react'
import './profile.css'
import Button from '../components/Button'
const Profile = () => {
  return (
    <div className='profile'>
      <header>
        <h1>User Profile</h1>
      </header>
      <main>
        <form className='profile-form'>
          <label>
            Name:
            <input type='text' name='name' />
          </label>
          <label>
            Email:
            <input type='email' name='email' />
          </label>
          <Button>Save </Button>
        </form>
      </main>
      <footer>
        <p>Footer Content</p>
      </footer>
    </div>
  )
}

export default Profile

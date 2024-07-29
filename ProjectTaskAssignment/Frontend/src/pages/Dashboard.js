// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// // import { fetchUser, updateUser } from '../redux/actions/userActions'
// import ProjectCard from '../components/ProjectCard'
// import { useNavigate } from 'react-router-dom'
// import Button from '../components/Button'
// import KanbanBoard from '../pages/KanbanBoard'
// import './dashboard.css'

// const Dashboard = () => {
//   const dispatch = useDispatch()
//   const user = useSelector((state) => state.user.user)
//   const navigate = useNavigate()

//   const [formData, setFormData] = useState({
//     username: user?.username || '',
//     email: user?.email || '',
//   })
//   const [showUpdateForm, setShowUpdateForm] = useState(false)
//   const [showKanbanBoard, setShowKanbanBoard] = useState(false)

//   useEffect(() => {
//     dispatch(fetchUser())
//   }, [dispatch])

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         username: user.username,
//         email: user.email,
//       })
//     }
//   }, [user])

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     })
//   }

//   const handleUpdate = (e) => {
//     e.preventDefault()
//     dispatch(updateUser(formData))
//     alert('Profile updated successfully!')
//   }

//   const handleViewDetails = () => {
//     setShowKanbanBoard(!showKanbanBoard)
//   }

//   const toggleUpdateForm = () => {
//     setShowUpdateForm(!showUpdateForm)
//   }

//   if (!user) return <div>Loading...</div>

//   return (
//     <div className='dashboard'>
//       <div className='header'>
//         <h1>Welcome, {user.username}</h1>
//         <Button   onClick={toggleUpdateForm}>
//           {showUpdateForm ? 'Hide Update Form' : 'Update Profile'}
//         </Button>
//       </div>
//       {showUpdateForm && (
//         <form onSubmit={handleUpdate} className='update-form'>
//           <input
//             type='text'
//             name='username'
//             value={formData.username}
//             onChange={handleChange}
//             placeholder='Username'
//             required
//           />
//           <input
//             type='email'
//             name='email'
//             value={formData.email}
//             onChange={handleChange}
//             placeholder='Email'
//             required
//           />
//           <Button type='submit'>Update Profile</Button>
//         </form>
//       )}
//       <h2 className='title'> List of Projects</h2>
//       <div className='project-cards'>
//         <ProjectCard
//           title='Project 1'
//           description='Description of Project 1'
//           onViewDetails={handleViewDetails}
//         />
//         <ProjectCard
//           title='Project 2'
//           description='Description of Project 2'
//           onViewDetails={handleViewDetails}
//         />
//         <ProjectCard
//           title='Project 3'
//           description='Description of Project 3'
//           onViewDetails={handleViewDetails}
//         />
//       </div>
//       {showKanbanBoard && <KanbanBoard />}
//     </div>
//   )
// }

// export default Dashboard

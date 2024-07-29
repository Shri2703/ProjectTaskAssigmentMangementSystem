import React from 'react'
import Button from './Button'
import './projectcard.css'

const ProjectCard = ({ title, description, onViewDetails }) => {
  return (
    <div className='project-card'>
      <h2>{title}</h2>
      <p>{description}</p>
      <Button onClick={onViewDetails}>View Details</Button>
    </div>
  )
}

export default ProjectCard

import React from 'react'

interface IProjectProgressProps {
  balance: number
  progress: number
}

const ProjectProgress: React.FC<IProjectProgressProps> = ({ progress, balance }) => {
  return (
    <div className='progress'>
      <div className='progress-bar' role='progressbar' style={{ width: `${progress}%` }} aria-valuenow={balance} aria-valuemin={0} aria-valuemax={100}>
        {progress}%
      </div>
    </div>
  )
}

export default ProjectProgress

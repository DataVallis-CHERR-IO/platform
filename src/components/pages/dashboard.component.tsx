import React from 'react'
import CreateNewProjectCard from '../../views/dashboard/create-new-project-card'

const DashboardComponent: React.FC = () => {
  return (
    <section className='section-1'>
      <div className='container'>
        <div className='row dashboard-cards'>
          <CreateNewProjectCard />
        </div>
      </div>
    </section>
  )
}

export default DashboardComponent

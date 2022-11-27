import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import PagePreloader from '../page-preloader'

const Dashboard = dynamic(() => import('../../views/dashboard'), { suspense: true })
const DashboardComponent: React.FC = () => {
  return (
    <section className='section-1'>
      <div className='container'>
        <div className='row dashboard-cards ml-0 mr-0'>
          <Suspense fallback={<PagePreloader />}>
            <Dashboard />
          </Suspense>
        </div>
      </div>
    </section>
  )
}

export default DashboardComponent

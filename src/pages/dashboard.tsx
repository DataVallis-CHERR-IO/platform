import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import PagePreloader from '../components/page-preloader'

const DashboardComponent = dynamic(() => import('../components/pages/dashboard.component'), { suspense: true })
const Dashboard = () => {
  return (
    <Suspense fallback={<PagePreloader />}>
      <DashboardComponent />
    </Suspense>
  )
}

export default Dashboard

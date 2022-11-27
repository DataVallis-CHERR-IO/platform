import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import PagePreloader from '../../components/page-preloader'

const MarketComponent = dynamic(() => import('../../components/pages/dashboard/market.component'), { suspense: true })
const Market: React.FC = () => {
  return (
    <Suspense fallback={<PagePreloader />}>
      <MarketComponent />
    </Suspense>
  )
}

export default Market

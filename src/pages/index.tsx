import type { NextPage } from 'next'
import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import PagePreloader from '../components/page-preloader'

const Home = dynamic(() => import('../components/pages/home'), { suspense: true })
const App: NextPage = () => {
  return (
    <Suspense fallback={<PagePreloader />}>
      <Home />
    </Suspense>
  )
}

export default App

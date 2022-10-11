import type { NextPage } from 'next'
import React from 'react'
import Header from '../components/pages/header'
import Head from 'next/head'
import Footer from '../components/pages/footer'
import Home from '../components/pages/home'
import CampaignsProvider from '../contexts/campaigns'
import { ICampaignsProps } from '../interfaces/components'
import { apolloClient } from '../clients/graphql'
import { QUERY_PROJECTS } from '../constants/queries/moralis/campaign'

export async function getServerSideProps() {
  const { data } = await apolloClient.query({
    query: QUERY_PROJECTS
  })

  return {
    props: {
      campaigns: data.campaigns
    }
  }
}

const App: NextPage<ICampaignsProps> = ({ campaigns }) => {
  return (
    <div>
      <Head>
        <title>CHERR.IO | Platform</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
        <meta name='description' content='' />
        <meta name='author' content='' />
      </Head>
      <Header />
      <CampaignsProvider campaigns={campaigns}>
        <Home />
      </CampaignsProvider>
      <Footer />
    </div>
  )
}

export default App

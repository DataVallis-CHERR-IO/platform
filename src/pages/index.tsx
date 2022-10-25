import type { NextPage } from 'next'
import React from 'react'
import Head from 'next/head'
import Header from '../components/pages/header'
import Home from '../components/pages/home'
import Footer from '../components/pages/footer'
import ProjectsProvider, { IProject } from '../contexts/projects'
import { apolloClient } from '../clients/graphql'
import { QUERY_PROJECTS } from '../constants/queries/moralis/project'
import { OrderDirection } from '../../server/src/graphql'

export async function getServerSideProps() {
  const { data } = await apolloClient.query({
    query: QUERY_PROJECTS,
    variables: {
      sort: {
        orderBy: 'createdAt',
        orderDirection: OrderDirection.DESC
      },
      limit: 3
    }
  })

  console.log(data.projects, 'PROJECTS')
  return {
    props: {
      projects: data.projects
    }
  }
}

interface IAppProps {
  projects?: IProject[]
}

const App: NextPage<IAppProps> = ({ projects }) => {
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
      <ProjectsProvider projects={projects}>
        <Home />
      </ProjectsProvider>
      <Footer />
    </div>
  )
}

export default App

import type { NextPage } from 'next'
import React from 'react'
import Head from 'next/head'
import Home from '../components/pages/home'
import ProjectsProvider, { IProject } from '../contexts/projects'
import { apolloClient } from '../clients/graphql'
import { QUERY_PROJECTS } from '../constants/queries/database/project'

export const getServerSideProps = async () => {
  const { data } = await apolloClient.query({
    query: QUERY_PROJECTS,
    variables: {
      take: 3
    }
  })

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
      <ProjectsProvider projects={projects}>
        <Home />
      </ProjectsProvider>
    </div>
  )
}

export default App

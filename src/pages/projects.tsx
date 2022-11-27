import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import PagePreloader from '../components/page-preloader'
import { apolloClient } from '../clients/graphql'
import { QUERY_PROJECTS } from '../constants/queries/database/project'
import { NextPage } from 'next'
import { IProject } from '../interfaces/api'

const ProjectsComponent = dynamic(() => import('../components/pages/projects.component'), { suspense: true })

export const getServerSideProps = async () => {
  const { data } = await apolloClient.query({
    query: QUERY_PROJECTS
  })

  return {
    props: {
      projects: data.projects
    }
  }
}

interface IProjectsProps {
  projects?: IProject[]
}

const Projects: NextPage<IProjectsProps> = ({ projects }) => {
  return (
    <Suspense fallback={<PagePreloader />}>
      <ProjectsComponent projects={projects} />
    </Suspense>
  )
}

export default Projects

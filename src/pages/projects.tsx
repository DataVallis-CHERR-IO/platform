import Layout from '../components/pages/layout'
import ProjectsComponent from '../components/pages/projects.component'
import { apolloClient } from '../clients/graphql'
import { QUERY_PROJECTS } from '../constants/queries/database/project'
import { IProject } from '../interfaces/api'
import { NextPage } from 'next'

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
    <Layout>
      <ProjectsComponent projects={projects} />
    </Layout>
  )
}

export default Projects

import React from 'react'
import Layout from '../../components/pages/layout'
import ProjectDetail from '../../components/pages/projects/project-detail'
import { apolloClient } from '../../clients/graphql'
import { QUERY_PROJECT } from '../../constants/queries/moralis/project'
import { IProject } from '../../interfaces/api'

export const getServerSideProps = async context => {
  const { data } = await apolloClient.query({
    query: QUERY_PROJECT,
    variables: {
      slug: context.params.slug
    }
  })

  return {
    props: {
      project: data.project,
      seo: {
        title: data.project.title,
        description: data.project.description
      }
    }
  }
}

interface IProjectProps {
  project?: IProject
}

const Slug: React.FC<IProjectProps> = ({ project }) => {
  return (
    <Layout>
      <ProjectDetail project={project} />
    </Layout>
  )
}

export default Slug

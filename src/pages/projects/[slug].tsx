import React from 'react'
import Layout from '../../components/pages/layout'
import ProjectDetail from '../../components/pages/projects/project-detail'
import { IProjectProps } from '../../interfaces/components'
import { apolloClient } from '../../clients/graphql'
import { QUERY_CAMPAIGN } from '../../constants/queries/moralis/project'

export const getServerSideProps = async context => {
  const { data } = await apolloClient.query({
    query: QUERY_CAMPAIGN,
    variables: {
      slug: context.params.slug
    }
  })

  return {
    props: {
      project: data.campaign,
      seo: {
        title: data.campaign.title,
        description: data.campaign.description
      }
    }
  }
}

const Slug: React.FC<IProjectProps> = ({ project }) => {
  return (
    <Layout>
      <ProjectDetail project={project} />
    </Layout>
  )
}

export default Slug

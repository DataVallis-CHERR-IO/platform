import React from 'react'
import Layout from '../../components/pages/layout'
import CampaignDetail from '../../components/pages/campaigns/campaign-detail'
import { apolloClient } from '../../clients/graphql'
import { QUERY_PROJECT } from '../../constants/queries/moralis/campaign'
import { IProjectProps } from '../../interfaces/components'

export const getServerSideProps = async context => {
  const { data } = await apolloClient.query({
    query: QUERY_PROJECT,
    variables: {
      slug: context.params.slug
    }
  })

  return {
    props: {
      campaign: data.campaign,
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
      <CampaignDetail project={project} />
    </Layout>
  )
}

export default Slug

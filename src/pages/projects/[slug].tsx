import React from 'react'
import ProjectDetail from '../../components/pages/projects/project-detail'
import ContractProvider from '../../contexts/contract'
import { apolloClient } from '../../clients/graphql'
import { QUERY_PROJECT } from '../../constants/queries/database/project'
import { IProject } from '../../interfaces/api'

export const getServerSideProps = async context => {
  const { data } = await apolloClient.query({
    query: QUERY_PROJECT,
    variables: {
      where: {
        slug: context.params.slug
      }
    }
  })

  if (!data.project) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      project: data.project,
      seo: {
        title: data.project?.title,
        description: data.project?.excerpt
      }
    }
  }
}

interface IProjectProps {
  project?: IProject
}

const Slug: React.FC<IProjectProps> = ({ project }) => {
  return (
    <ContractProvider project={project}>
      <ProjectDetail project={project} />
    </ContractProvider>
  )
}

export default Slug

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import ContractProvider from '../../contexts/contract'
import { apolloClient } from '../../clients/graphql'
import { QUERY_PROJECT } from '../../constants/queries/database/project'
import { IProject } from '../../interfaces/api'
import PagePreloader from '../../components/page-preloader'

const ProjectDetail = dynamic(() => import('../../components/pages/projects/project-detail'), { suspense: true })

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
    <Suspense fallback={<PagePreloader />}>
      <ContractProvider project={project}>
        <ProjectDetail project={project} />
      </ContractProvider>
    </Suspense>
  )
}

export default Slug

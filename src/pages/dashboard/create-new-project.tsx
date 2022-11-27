import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import PagePreloader from '../../components/page-preloader'
import { useQuery } from 'react-query'
import { apolloClient } from '../../clients/graphql'
import { QUERY_PROJECT_TYPES } from '../../constants/queries/database/project-type'

const CreateNewProjectComponent = dynamic(() => import('../../components/pages/dashboard/create-new-project.component'), { suspense: true })
const CreateNewProject: React.FC = () => {
  const { data: projectTypes } = useQuery(
    ['projectDetail'],
    async () => {
      return (
        await apolloClient.query({
          query: QUERY_PROJECT_TYPES
        })
      ).data.projectTypes
    },
    {
      onError: error => {
        console.log('❌ GraphQL error (query detail): ', error)
      }
    }
  )

  return (
    <Suspense fallback={<PagePreloader />}>
      <CreateNewProjectComponent projectTypes={projectTypes} />
    </Suspense>
  )
}

export default CreateNewProject

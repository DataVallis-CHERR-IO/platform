import React from 'react'
import Layout from '../../components/pages/layout'
import CreateNewProjectComponent from '../../components/pages/dashboard/create-new-project.component'
import { apolloClient } from '../../clients/graphql'
import { QUERY_PROJECT_TYPES } from '../../constants/queries/database/project-type'
import { IProjectType } from '../../interfaces/api'

export const getServerSideProps = async () => {
  const { data } = await apolloClient.query({
    query: QUERY_PROJECT_TYPES
  })

  return {
    props: {
      projectTypes: data.projectTypes
    }
  }
}

interface ICreateNewProjectProps {
  projectTypes?: IProjectType[]
}

const CreateNewProject: React.FC<ICreateNewProjectProps> = ({ projectTypes }) => {
  return (
    <Layout>
      <CreateNewProjectComponent projectTypes={projectTypes} />
    </Layout>
  )
}

export default CreateNewProject

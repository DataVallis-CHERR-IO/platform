import React from 'react'
import Layout from '../../components/pages/layout'
import CreateNewProjectComponent from '../../components/pages/dashboard/create-new-project.component'
import { apolloClient } from '../../clients/graphql'
import { IProjectType } from '../../interfaces/api'
import { QUERY_PROJECT_TYPES } from '../../constants/queries/moralis/project-type'

export const getServerSideProps = async () => {
  const { data } = await apolloClient.query({
    query: QUERY_PROJECT_TYPES
  })

  const projectTypes = []
  data.projectTypes.forEach((projectType: IProjectType) =>
    projectTypes.push({
      id: projectType._id,
      label: projectType.lkName
    })
  )

  return {
    props: {
      projectTypes
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

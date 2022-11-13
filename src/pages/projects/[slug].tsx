import React from 'react'
import TronWeb from 'tronweb'
import Layout from '../../components/pages/layout'
import ProjectDetail from '../../components/pages/projects/project-detail'
import ContractProvider from '../../contexts/contract'
import { apolloClient } from '../../clients/graphql'
import { QUERY_PROJECT } from '../../constants/queries/database/project'
import { IProject } from '../../interfaces/api'
import { fromSun } from '../../utils'
import { contractProjectActivatorOptions, tronNetworkOptions } from '../../config'

const HttpProvider = TronWeb.providers.HttpProvider
const tronWeb = new TronWeb(
  new HttpProvider(tronNetworkOptions.provider),
  new HttpProvider(tronNetworkOptions.provider),
  new HttpProvider(tronNetworkOptions.provider)
)
tronWeb.setAddress(contractProjectActivatorOptions.owner)

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

  const contractProject = await tronWeb.contract().at(data.project.contractAddress)
  const contractProjectActivator = await tronWeb.contract().at(contractProjectActivatorOptions.address)
  const contractProjectData = await contractProject.getData().call()
  const contractProjectRequests = await contractProject.getRequests().call()
  const contractProjectActivatorProject = await contractProjectActivator.projects(data.project.contractAddress).call()
  const contractProjectActivatorActivators = await contractProjectActivator.getActivators(data.project.contractAddress).call()

  return {
    props: {
      project: data.project,
      initialData: JSON.stringify({
        project: {
          owner: tronWeb.address.fromHex(contractProjectData._owner),
          stage: contractProjectData._stage,
          minimumDonation: fromSun(contractProjectData._minimumDonation.toString()),
          startedAt: contractProjectData._startedAt.toString(),
          deadline: contractProjectData._deadline.toString(),
          endedAt: contractProjectData._endedAt.toString(),
          raisedAmount: fromSun(contractProjectData._raisedAmount.toString()),
          numDonations: Number(contractProjectData._numDonations.toString()),
          requests: {
            descriptions: contractProjectRequests._descriptions,
            values: contractProjectRequests._values.map(value => Number(value.toString())),
            recipients: contractProjectRequests._recipients,
            completed: contractProjectRequests._completed,
            numVoters: contractProjectRequests._numVoters
          }
        },
        projectActivator: {
          project: {
            stage: contractProjectActivatorProject.stage,
            numActivators: Number(contractProjectActivatorProject.numActivators.toString()),
            activateSize: fromSun(contractProjectActivatorProject.activateSize.toString()),
            activatedAmount: fromSun(contractProjectActivatorProject.activatedAmount.toString()),
            activators: contractProjectActivatorActivators._activators
          }
        }
      }),
      seo: {
        title: data.project?.title,
        description: data.project?.excerpt
      }
    }
  }
}

interface IProjectProps {
  project?: IProject
  initialData?: any
}

const Slug: React.FC<IProjectProps> = ({ project, initialData }) => {
  return (
    <Layout>
      <ContractProvider project={project} initialData={initialData}>
        <ProjectDetail project={project} />
      </ContractProvider>
    </Layout>
  )
}

export default Slug

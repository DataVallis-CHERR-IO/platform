import { useCallback, useMemo } from 'react'
import { useBlockNumber } from 'wagmi'
import { useQuery } from 'react-query'
import { useTronWebContext } from '../contexts/tronweb/provider'
import { useSession } from 'next-auth/react'
import { fromSun } from '../utils'

interface IData {
  project?: string[]
  projectActivator?: string[]
}

interface IDataRes {
  project?: {
    owner?: string
    stage?: number
    minimumDonation?: number
    startedAt?: string
    deadline?: string
    endedAt?: string
    raisedAmount?: number
    numDonations?: number
    donations?: number
    requests?: {
      descriptions?: string[]
      values?: number[]
      recipients?: string[]
      completed?: boolean[]
      numVoters?: number[]
    }
  }
  projectActivator?: {
    project?: {
      stage?: number
      rewarded?: boolean
      numActivators?: number
      activateSize?: number
      activatedAmount?: number
      activators?: string[]
    }
    activatedAmount?: number
  }
}

interface IUseContractDataProps {
  contractAddress: string
  data: IData
  initialData?: any
}

const useContractData = ({ contractAddress, data, initialData = {} }: IUseContractDataProps) => {
  const { tronWeb } = useTronWebContext()
  const { data: session } = useSession()
  const { data: blockNumber } = useBlockNumber({ watch: true })
  const instanceProject = useCallback(async () => await tronWeb.contract().at(contractAddress), [contractAddress])
  const instanceActivator = useCallback(async () => await tronWeb.contract().at(process.env.CONTRACT_CHERRIO_PROJECT_ACTIVATOR_ADDRESS), [])
  const queryKey = useMemo(
    () => ({
      blockNumber,
      contractAddress,
      instanceProject,
      instanceActivator
    }),
    [blockNumber, contractAddress, instanceProject, instanceActivator]
  )
  return useQuery(
    [queryKey],
    async () => {
      const dataRes: IDataRes = {}

      if (data?.project) {
        const contractProject = await instanceProject()
        dataRes.project = {}

        if (data.project.includes('getData')) {
          const contractProjectData = await contractProject.getData().call()

          dataRes.project.owner = tronWeb.address.fromHex(contractProjectData._owner)
          dataRes.project.stage = contractProjectData._stage
          dataRes.project.minimumDonation = fromSun(contractProjectData._minimumDonation.toString())
          dataRes.project.startedAt = contractProjectData._startedAt.toString()
          dataRes.project.deadline = contractProjectData._deadline.toString()
          dataRes.project.endedAt = contractProjectData._endedAt.toString()
          dataRes.project.raisedAmount = fromSun(contractProjectData._raisedAmount.toString())
          dataRes.project.numDonations = Number(contractProjectData._numDonations.toString())
        }

        if (data.project.includes('getRequests')) {
          const contractProjectRequests = await contractProject.getRequests().call()

          dataRes.project.requests = {}
          dataRes.project.requests.descriptions = contractProjectRequests._descriptions
          dataRes.project.requests.values = contractProjectRequests._values
          dataRes.project.requests.recipients = contractProjectRequests._recipients
          dataRes.project.requests.completed = contractProjectRequests._completed
          dataRes.project.requests.numVoters = contractProjectRequests._numVoters
        }

        if (data.project.includes('donations')) {
          let contractProjectDonations = null

          if (session) {
            contractProjectDonations = await contractProject.donations(session.user.name).call()

            dataRes.project.donations = fromSun(contractProjectDonations.toString())
          }
        }
      }

      if (data?.projectActivator) {
        const contractProjectActivator = await instanceActivator()
        dataRes.projectActivator = {}

        if (data.projectActivator.includes('getProject')) {
          const contractProjectActivatorProject = await contractProjectActivator.getProject(contractAddress).call()

          dataRes.projectActivator.project || (dataRes.projectActivator.project = {})
          dataRes.projectActivator.project.stage = contractProjectActivatorProject._stage
          dataRes.projectActivator.project.rewarded = contractProjectActivatorProject._rewarded
          dataRes.projectActivator.project.numActivators = Number(contractProjectActivatorProject._numActivators.toString())
          dataRes.projectActivator.project.activateSize = fromSun(contractProjectActivatorProject._activateSize.toString())
          dataRes.projectActivator.project.activatedAmount = fromSun(contractProjectActivatorProject._activatedAmount.toString())
        }

        if (data.projectActivator.includes('getActivators')) {
          const contractProjectActivatorActivators = await contractProjectActivator.getActivators(contractAddress).call()

          dataRes.projectActivator.project || (dataRes.projectActivator.project = {})
          dataRes.projectActivator.project.activators = contractProjectActivatorActivators._activators
        }

        if (data.projectActivator.includes('getActivatedAmount')) {
          let contractProjectActivatorActivatedAmount = null

          if (session) {
            contractProjectActivatorActivatedAmount = await contractProjectActivator.getActivatedAmount(contractAddress, session.user.name).call()

            dataRes.projectActivator.activatedAmount = fromSun(contractProjectActivatorActivatedAmount.toString())
          }
        }
      }

      return dataRes
    },
    {
      onError: error => {
        console.log('❌ GraphQL error (query detail): ', error)
      },
      initialData,
      keepPreviousData: true,
      enabled: !!blockNumber && !!contractAddress && !!initialData
    }
  )
}

export default useContractData

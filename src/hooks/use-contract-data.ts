import { useCallback, useMemo } from 'react'
import { useBlockNumber } from 'wagmi'
import { useQuery } from 'react-query'
import { useTronWebContext } from '../contexts/tronweb/provider'
import { useSession } from 'next-auth/react'
import { fromSun } from '../utils'
import { contractProjectActivatorOptions } from '../config'

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
      voted?: boolean[]
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
  const instanceActivator = useCallback(async () => await tronWeb.contract().at(contractProjectActivatorOptions.address), [])
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

          dataRes.project.requests || (dataRes.project.requests = {})
          dataRes.project.requests.descriptions = contractProjectRequests._descriptions
          dataRes.project.requests.values = contractProjectRequests._values.map(value => Number(value.toString()))
          dataRes.project.requests.recipients = contractProjectRequests._recipients
          dataRes.project.requests.completed = contractProjectRequests._completed
          dataRes.project.requests.numVoters = contractProjectRequests._numVoters
        }

        if (data.project.includes('getVoted') && session) {
          const contractProjectNumRequests = Number((await contractProject.numRequests().call()).toString())

          if (contractProjectNumRequests > 0) {
            dataRes.project.requests || (dataRes.project.requests = {})

            for (let i = 0; i < contractProjectNumRequests; i++) {
              const contractProjectVoted = await contractProject.getVoted(i, session.user.name).call()

              dataRes.project.requests.voted = contractProjectVoted._voted
            }
          }
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

        if (data.projectActivator.includes('projects')) {
          const contractProjectActivatorProject = await contractProjectActivator.projects(contractAddress).call()

          dataRes.projectActivator.project || (dataRes.projectActivator.project = {})
          dataRes.projectActivator.project.stage = contractProjectActivatorProject.stage
          dataRes.projectActivator.project.rewarded = contractProjectActivatorProject.rewarded
          dataRes.projectActivator.project.numActivators = Number(contractProjectActivatorProject.numActivators.toString())
          dataRes.projectActivator.project.activateSize = fromSun(contractProjectActivatorProject.activateSize.toString())
          dataRes.projectActivator.project.activatedAmount = fromSun(contractProjectActivatorProject.activatedAmount.toString())
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
        console.log('❌ useContractData hook error: ', error)
      },
      initialData,
      keepPreviousData: true
    }
  )
}

export default useContractData

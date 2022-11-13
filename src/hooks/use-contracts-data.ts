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

interface IUseContractsDataProps {
  contractAddresses: string[]
  data: IData
  initialData?: any
}

const useContractsData = ({ contractAddresses, data, initialData = {} }: IUseContractsDataProps) => {
  const { tronWeb } = useTronWebContext()
  const { data: session } = useSession()
  const { data: blockNumber } = useBlockNumber({ watch: true })
  const instanceProjects: any[] = []

  for (const [index, contractAddress] of contractAddresses.entries()) {
    instanceProjects[index] = useCallback(async () => await tronWeb.contract().at(contractAddress), [contractAddress])
  }

  const instanceActivator = useCallback(async () => await tronWeb.contract().at(contractProjectActivatorOptions.address), [])
  const queryKey = useMemo(
    () => ({
      blockNumber,
      contractAddresses,
      instanceProjects,
      instanceActivator
    }),
    [blockNumber, contractAddresses, instanceProjects, instanceActivator]
  )
  return useQuery(
    [queryKey],
    async () => {
      const dataRes: IDataRes[] = []

      for (const [index, contractAddress] of contractAddresses.entries()) {
        if (data?.project) {
          const contractProject = await instanceProjects[index]()
          dataRes[index] = { project: {} }

          if (data.project.includes('getData')) {
            const contractProjectData = await contractProject.getData().call()

            dataRes[index].project.owner = tronWeb.address.fromHex(contractProjectData._owner)
            dataRes[index].project.stage = contractProjectData._stage
            dataRes[index].project.minimumDonation = fromSun(contractProjectData._minimumDonation.toString())
            dataRes[index].project.startedAt = contractProjectData._startedAt.toString()
            dataRes[index].project.deadline = contractProjectData._deadline.toString()
            dataRes[index].project.endedAt = contractProjectData._endedAt.toString()
            dataRes[index].project.raisedAmount = fromSun(contractProjectData._raisedAmount.toString())
            dataRes[index].project.numDonations = Number(contractProjectData._numDonations.toString())
          }

          if (data.project.includes('getRequests')) {
            const contractProjectRequests = await contractProject.getRequests().call()

            const values: number[] = []

            if (contractProjectRequests._values.length > 0) {
              contractProjectRequests._values.forEach(value => values.push(Number(value.toString())))
            }

            dataRes[index].project.requests || (dataRes[index].project.requests = {})
            dataRes[index].project.requests.descriptions = contractProjectRequests._descriptions
            dataRes[index].project.requests.values = values
            dataRes[index].project.requests.recipients = contractProjectRequests._recipients
            dataRes[index].project.requests.completed = contractProjectRequests._completed
            dataRes[index].project.requests.numVoters = contractProjectRequests._numVoters
          }

          if (data.project.includes('getVoted') && session) {
            const contractProjectNumRequests = Number((await contractProject.numRequests().call()).toString())

            if (contractProjectNumRequests > 0) {
              dataRes[index].project.requests || (dataRes[index].project.requests = {})

              for (let i = 0; i < contractProjectNumRequests; i++) {
                const contractProjectVoted = await contractProject.getVoted(i, session.user.name).call()

                dataRes[index].project.requests.voted = contractProjectVoted._voted
              }
            }
          }

          if (data.project.includes('donations')) {
            let contractProjectDonations = null

            if (session) {
              contractProjectDonations = await contractProject.donations(session.user.name).call()

              dataRes[index].project.donations = fromSun(contractProjectDonations.toString())
            }
          }
        }

        if (data?.projectActivator) {
          const contractProjectActivator = await instanceActivator()
          dataRes[index] = { projectActivator: {} }

          if (data.projectActivator.includes('projects')) {
            const contractProjectActivatorProject = await contractProjectActivator.projects(contractAddress).call()

            dataRes[index].projectActivator.project || (dataRes[index].projectActivator.project = {})
            dataRes[index].projectActivator.project.stage = contractProjectActivatorProject.stage
            dataRes[index].projectActivator.project.rewarded = contractProjectActivatorProject.rewarded
            dataRes[index].projectActivator.project.numActivators = Number(contractProjectActivatorProject.numActivators.toString())
            dataRes[index].projectActivator.project.activateSize = fromSun(contractProjectActivatorProject.activateSize.toString())
            dataRes[index].projectActivator.project.activatedAmount = fromSun(contractProjectActivatorProject.activatedAmount.toString())
          }

          if (data.projectActivator.includes('getActivators')) {
            const contractProjectActivatorActivators = await contractProjectActivator.getActivators(contractAddress).call()

            dataRes[index].projectActivator.project || (dataRes[index].projectActivator.project = {})
            dataRes[index].projectActivator.project.activators = contractProjectActivatorActivators._activators
          }

          if (data.projectActivator.includes('getActivatedAmount')) {
            let contractProjectActivatorActivatedAmount = null

            if (session) {
              contractProjectActivatorActivatedAmount = await contractProjectActivator.getActivatedAmount(contractAddress, session.user.name).call()

              dataRes[index].projectActivator.activatedAmount = fromSun(contractProjectActivatorActivatedAmount.toString())
            }
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
      keepPreviousData: true,
      enabled: !!blockNumber && !!contractAddresses && !!initialData
    }
  )
}

export default useContractsData

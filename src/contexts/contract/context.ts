import { createContext } from 'react'

interface IContractProjectRequests {
  descriptions?: string[]
  values?: number[]
  recipients?: string[]
  completed?: boolean[]
  numVoters?: number[]
  votes?: boolean[]
}

export interface IContractProject {
  owner?: string
  stage?: number
  minimumDonation?: number
  startedAt?: string
  deadline?: string
  endedAt?: string
  raisedAmount?: number
  donations?: number
  numDonations?: number
  requests?: IContractProjectRequests
}

interface IContractActivatorProject {
  stage?: number
  rewarded?: boolean
  numActivators?: number
  activateSize?: number
  activatedAmount?: number
  activators?: string[]
}

interface IProjectActivatorContract {
  project?: IContractActivatorProject
  activatedAmount?: number
}

interface IContractContext {
  contractProject: IContractProject
  contractProjectActivator: IProjectActivatorContract
  isLoading?: boolean
  isError?: boolean
}

const ContractContext = createContext<IContractContext>({
  contractProject: null,
  contractProjectActivator: null,
  isLoading: true,
  isError: false
})

export default ContractContext

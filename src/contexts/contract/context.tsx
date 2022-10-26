import { createContext } from 'react'

interface IProjectRequestsContract {
  descriptions?: string[]
  amounts?: number[]
  recipients?: string[]
  completed?: boolean[]
  numberOfVoters?: number[]
}

interface IProjectContract {
  owner?: string
  stage?: number
  goal?: number
  minimumDonation?: string
  startedAt?: string
  deadline?: string
  endedAt?: string
  donations?: number
  raisedAmount?: number
  totalDonations?: number
  requests?: IProjectRequestsContract
}

interface IProjectActivatorProjectContract {
  stage?: number
  flag?: boolean
  rewarded?: boolean
  numActivators?: number
  activateSize?: number
  activatedAmount?: number
  reward?: number
  activators?: string[]
}

interface IProjectActivatorContract {
  project?: IProjectActivatorProjectContract
  activatedAmount?: number
}

interface IContractContext {
  projectContract: IProjectContract
  projectActivatorContract: IProjectActivatorContract
  isLoading: boolean
  isError: boolean
}

const ContractContext = createContext<IContractContext>({
  projectContract: null,
  projectActivatorContract: null,
  isLoading: true,
  isError: false
})

export default ContractContext

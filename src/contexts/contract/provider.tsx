import React, { useContext, useMemo } from 'react'
import ContractContext from './context'
import { useAccount, useContractReads } from 'wagmi'
import { getCherrioProjectAbi } from '../../contracts/abi/cherrio-project'
import { getCherrioProjectActivatorAbi } from '../../contracts/abi/cherrio-project-activator'
import { IProject } from '../../interfaces/api'
import * as _ from 'lodash'
import { fromSun } from '../../utils'

export const useContractContext = () => useContext(ContractContext)

interface IContractProviderProps {
  children: React.ReactNode
  project: IProject
}

const ContractProvider: React.FC<IContractProviderProps> = ({ children, project }) => {
  const { address } = useAccount()

  const cherrioProjectContract = useMemo(
    () => ({
      addressOrName: project.contractAddress,
      contractInterface: getCherrioProjectAbi()
    }),
    [project?.contractAddress]
  )

  const cherrioProjectActivatorContract = useMemo(
    () => ({
      addressOrName: process.env.CONTRACT_CHERRIO_PROJECT_ACTIVATOR_ADDRESS,
      contractInterface: getCherrioProjectActivatorAbi()
    }),
    []
  )

  const contracts = useMemo(() => {
    if (!address) return []
    return [
      {
        ...cherrioProjectContract,
        functionName: 'donations',
        args: [address]
      },
      {
        ...cherrioProjectActivatorContract,
        functionName: 'getActivatedAmount',
        args: [project?.contractAddress, address]
      }
    ]
  }, [address, cherrioProjectContract, cherrioProjectActivatorContract, project?.contractAddress])

  const { data, isLoading, isError } = useContractReads({
    contracts: [
      {
        ...cherrioProjectContract,
        functionName: 'getOwner'
      },
      {
        ...cherrioProjectContract,
        functionName: 'stage'
      },
      {
        ...cherrioProjectContract,
        functionName: 'goal'
      },
      {
        ...cherrioProjectContract,
        functionName: 'minimumDonation'
      },
      {
        ...cherrioProjectContract,
        functionName: 'startedAt'
      },
      {
        ...cherrioProjectContract,
        functionName: 'deadline'
      },
      {
        ...cherrioProjectContract,
        functionName: 'endedAt'
      },
      {
        ...cherrioProjectContract,
        functionName: 'raisedAmount'
      },
      {
        ...cherrioProjectContract,
        functionName: 'getRequests'
      },
      {
        ...cherrioProjectContract,
        functionName: 'totalDonations'
      },
      {
        ...cherrioProjectActivatorContract,
        functionName: 'projects',
        args: [project.contractAddress]
      },
      {
        ...cherrioProjectActivatorContract,
        functionName: 'getActivators',
        args: [project.contractAddress]
      },
      ...contracts
    ],
    watch: true
  })

  return (
    <ContractContext.Provider
      value={{
        projectContract: {
          owner: _.get(data, '[0]'),
          stage: _.get(data, '[1]'),
          goal: fromSun(_.get(data, '[2]')),
          minimumDonation: _.get(data, '[3]', '').toString(),
          startedAt: _.get(data, '[4]', '').toString(),
          deadline: _.get(data, '[5]', '').toString(),
          endedAt: _.get(data, '[6]', '').toString(),
          raisedAmount: fromSun(_.get(data, '[7]')),
          donations: fromSun(_.get(data, '[12]')),
          totalDonations: Number(_.get(data, '[9]', '').toString()),
          requests: {
            descriptions: _.get(data, '[8].descriptions'),
            amounts: _.get(data, '[8].amounts'),
            recipients: _.get(data, '[8].recipients'),
            completed: _.get(data, '[8].completed'),
            numberOfVoters: _.get(data, '[8].numberOfVoters')
          }
        },
        projectActivatorContract: {
          project: {
            stage: _.get(data, '[10].stage'),
            flag: _.get(data, '[10].flag'),
            rewarded: _.get(data, '[10].rewarded'),
            numActivators: +_.get(data, '[10].numActivators', '').toString(),
            activateSize: fromSun(_.get(data, '[10].activateSize')),
            activatedAmount: fromSun(_.get(data, '[10].activatedAmount')),
            reward: fromSun(_.get(data, '[10].reward')),
            activators: _.get(data, '[11]')
          },
          activatedAmount: fromSun(_.get(data, '[13]'))
        },
        isLoading,
        isError
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}

export default ContractProvider

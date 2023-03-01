import React, { useContext, useMemo } from 'react'
import ContractContext from './context'
import { Address, useAccount, useContractReads } from 'wagmi'
import { getCherrioProjectAbi } from '../../contracts/abi/cherrio-project'
import { getCherrioProjectActivatorAbi } from '../../contracts/abi/cherrio-project-activator'
import { getEther } from '../../utils'
import { IProject } from '../../interfaces/api'
import { contractOptions } from '../../config'
import * as _ from 'lodash'

export const useContractContext = () => useContext(ContractContext)

interface IContractProviderProps {
  children: React.ReactNode
  project: IProject
}

const ContractProvider: React.FC<IContractProviderProps> = ({ children, project }) => {
  const { address } = useAccount()

  const cherrioProjectContract = useMemo(
    () => ({
      address: project.contractAddress as Address,
      abi: getCherrioProjectAbi()
    }),
    [project?.contractAddress]
  )

  const cherrioProjectActivatorContract = useMemo(
    () => ({
      address: contractOptions.projectActivator.address as Address,
      abi: getCherrioProjectActivatorAbi()
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
        ...cherrioProjectContract,
        functionName: 'getVotes',
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
        functionName: 'numDonations'
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
        contractProject: {
          owner: _.get(data, '[0]'),
          stage: _.get(data, '[1]'),
          minimumDonation: _.get(data, '[2]', '').toString(),
          startedAt: _.get(data, '[3]', '').toString(),
          deadline: _.get(data, '[4]', '').toString(),
          endedAt: _.get(data, '[5]', '').toString(),
          raisedAmount: getEther(_.get(data, '[6]')),
          donations: getEther(_.get(data, '[11]')),
          numDonations: Number(_.get(data, '[8]', '').toString()),
          requests: {
            descriptions: _.get(data, '[7]._descriptions'),
            values: _.get(data, '[7]._values'),
            recipients: _.get(data, '[7]._recipients'),
            completed: _.get(data, '[7]._completed'),
            numVoters: _.get(data, '[7]._numVoters'),
            votes: _.get(data, '[12]')
          }
        },
        contractProjectActivator: {
          project: {
            stage: _.get(data, '[9].stage'),
            rewarded: _.get(data, '[9].rewarded'),
            numActivators: +_.get(data, '[9].numActivators', '').toString(),
            activateSize: getEther(_.get(data, '[9].activateSize')),
            activatedAmount: getEther(_.get(data, '[9].activatedAmount')),
            activators: _.get(data, '[10]')
          },
          activatedAmount: getEther(_.get(data, '[13]'))
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

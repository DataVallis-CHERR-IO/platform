import React, { useContext } from 'react'
import ContractContext from './context'
import useContractData from '../../hooks/use-contract-data'
import { IProject } from '../../interfaces/api'

export const useContractContext = () => useContext(ContractContext)

interface IContractProviderProps {
  children: React.ReactNode
  project: IProject
}

const ContractProvider: React.FC<IContractProviderProps> = ({ children, project }) => {
  const { data: contractData } = useContractData({
    contractAddress: project.contractAddress,
    data: { project: ['getData', 'getRequests', 'getVoted', 'donations'], projectActivator: ['projects', 'getActivators', 'getActivatedAmount'] }
  })

  return (
    <ContractContext.Provider
      value={{
        contractProject: {
          owner: contractData?.project?.owner,
          stage: contractData?.project?.stage,
          minimumDonation: contractData?.project?.minimumDonation,
          startedAt: contractData?.project?.startedAt,
          deadline: contractData?.project?.deadline,
          endedAt: contractData?.project?.endedAt,
          raisedAmount: contractData?.project?.raisedAmount,
          numDonations: contractData?.project?.numDonations,
          donations: contractData?.project?.donations,
          requests: {
            descriptions: contractData?.project?.requests?.descriptions,
            values: contractData?.project?.requests?.values,
            recipients: contractData?.project?.requests?.recipients,
            completed: contractData?.project?.requests?.completed,
            numVoters: contractData?.project?.requests?.numVoters,
            voted: contractData?.project?.requests?.voted
          }
        },
        contractProjectActivator: {
          project: {
            stage: contractData?.projectActivator?.project?.stage,
            rewarded: contractData?.projectActivator?.project?.rewarded,
            numActivators: contractData?.projectActivator?.project?.numActivators,
            activateSize: contractData?.projectActivator?.project?.activateSize,
            activatedAmount: contractData?.projectActivator?.project?.activatedAmount,
            activators: contractData?.projectActivator?.project?.activators
          },
          activatedAmount: contractData?.projectActivator?.activatedAmount
        }
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}

export default ContractProvider

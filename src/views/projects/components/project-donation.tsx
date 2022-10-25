import React, { useCallback, useEffect, useState } from 'react'
import Moralis from 'moralis'
import useTranslation from 'next-translate/useTranslation'
import ProjectProgress from './project-progress'
import { EvmChain } from '@moralisweb3/evm-utils'
import { useBalance, useContractEvent, useContractRead } from 'wagmi'
import { notify } from '../../../utils/notify'
import { IProject } from '../../../interfaces/api'
import { getCherrioProjectAbi } from '../../../contracts/abi/cherrio-project'
import { getEthers } from '../../../utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'

interface IProjectContributionProps {
  project?: IProject
}

const ProjectDonation: React.FC<IProjectContributionProps> = ({ project }) => {
  const { t } = useTranslation('common')
  const [balance, setBalance] = useState<number>(0)
  const [goal, setGoal] = useState<number>(0)
  const [progress, setProgress] = useState<number>(0)
  const [donations, setDonations] = useState<number>(0)

  const { data: dataBalance, isLoading: isLoadingBalance } = useBalance({
    addressOrName: project.contractAddress
  })

  const { data: dataGoal, isLoading: isLoadingGoal } = useContractRead({
    addressOrName: project.contractAddress,
    contractInterface: getCherrioProjectAbi(),
    functionName: 'goal'
  })

  useContractEvent({
    addressOrName: project.contractAddress,
    contractInterface: getCherrioProjectAbi(),
    eventName: 'Donation',
    listener: data => {
      const donation = Number(getEthers(data[0]))
      notify(t('newDonationForProjectReceived', { project: project.title, donation }))
      handleDonation(donation)
    }
  })

  const getDonations = useCallback(async () => {
    const chain = EvmChain[process.env.EVM_CHAIN]

    await Moralis.start({
      apiKey: process.env.MORALIS_API_KEY
    })

    const transactions = (
      await Moralis.EvmApi.transaction.getWalletTransactions({
        address: project.contractAddress,
        chain
      })
    ).raw

    setDonations(transactions.total)
  }, [])

  const handleDonation = useCallback((donation: number) => {
    setBalance(balance + donation)
    setProgress(Math.floor(((balance + donation) / Number(goal)) * 100))
  }, [])

  useEffect(() => {
    if (!isLoadingBalance && !balance) {
      setBalance(Number(dataBalance.formatted))
      setProgress(Math.floor((Number(dataBalance.formatted) / getEthers(dataGoal)) * 100))
      getDonations()
    }
    if (!isLoadingGoal && !goal) {
      setGoal(getEthers(dataGoal))
    }
    // if (!balance) {
    //   setContribution(Number(data.formatted))
    //   setProgress(Math.floor(((balance + contribution) / Number(project.goal)) * 100))
    // }
    // if (contribution) {
    //   setBalance(balance + contribution)
    //   setProgress(Math.floor(((balance + contribution) / Number(project.goal)) * 100))
    //   setDonations(donations + 1)
    //   setContribution(0)
    // }
  }, [isLoadingBalance, isLoadingGoal])

  return (
    <div className='project-content-right'>
      <div className='project-title'>{t('project.details')}</div>
      <div className='project-progress'>
        <ProjectProgress progress={progress} balance={balance} />
        <div className='project-info'>
          <div className='project-info-1'>
            {t('funded')}:{' '}
            <>
              <FontAwesomeIcon icon={faEthereum} /> <span>{balance}</span>
            </>
          </div>
          <div className='project-info-2'>
            {t('goal')}:{' '}
            <>
              <FontAwesomeIcon icon={faEthereum} /> <span>{goal}</span>
            </>
          </div>
          <div className='project-info-3'>
            {t('donations')}: {donations}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDonation

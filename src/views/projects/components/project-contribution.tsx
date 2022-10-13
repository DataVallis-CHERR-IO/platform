import React, { useCallback, useEffect, useState } from 'react'
import Moralis from 'moralis'
import useTranslation from 'next-translate/useTranslation'
import ProjectProgress from './project-progress'
import { ethers } from 'ethers'
import { EvmChain } from '@moralisweb3/evm-utils'
import { useBalance, useContractEvent } from 'wagmi'
import { notify } from '../../../utils/notify'
import { IProject } from '../../../interfaces/api'
import { getCherrioProjectAbi } from '../../../contracts/abi/cherrio-project'

interface IProjectContributionProps {
  project?: IProject
}

const ProjectContribution: React.FC<IProjectContributionProps> = ({ project }) => {
  const { t } = useTranslation('common')
  const [balance, setBalance] = useState<number>(0)
  const [contribution, setContribution] = useState<number>(0)
  const [progress, setProgress] = useState<number>(0)
  const [donations, setDonations] = useState<number>(0)

  const { data } = useBalance({
    addressOrName: project.contractAddress
  })

  !ethers.utils.isAddress(project.contractAddress) ||
    useContractEvent({
      addressOrName: project.contractAddress,
      contractInterface: getCherrioProjectAbi(),
      eventName: 'donations',
      listener: event => {
        const amount = Number(ethers.utils.formatUnits(event[0].toString(), process.env.TOKEN_DECIMALS))
        notify(t('newContributionForProjectReceived', { project: project.title, contribution: amount }))
        updateData(amount)
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

  const updateData = useCallback((donation?: number) => {
    !donation || setContribution(donation)
  }, [])

  useEffect(() => {
    if (!balance) {
      setContribution(Number(data.formatted))
      setProgress(Math.floor(((balance + contribution) / Number(project.goal)) * 100))
      getDonations()
    }
    if (contribution) {
      setBalance(balance + contribution)
      setProgress(Math.floor(((balance + contribution) / Number(project.goal)) * 100))
      setDonations(donations + 1)
      setContribution(0)
    }
  }, [balance, contribution, donations])

  return (
    <div className='project-content-right'>
      <div className='project-title'>{t('project.details')}</div>
      <div className='project-progress'>
        <ProjectProgress progress={progress} balance={balance} />
        <div className='project-info'>
          <div className='project-info-1'>
            {t('funded')}: {balance} ETH
          </div>
          <div className='project-info-2'>
            {t('goal')}: {project.goal} ETH
          </div>
          <div className='project-info-3'>
            {t('donations')}: {donations}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectContribution

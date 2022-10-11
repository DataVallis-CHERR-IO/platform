import React, { useCallback, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { ICampaignContributionProps } from '../../../interfaces/components'
import { EvmChain } from '@moralisweb3/evm-utils'
import { useBalance, useContract, useContractEvent } from 'wagmi'
import { notify } from '../../../utils/notify'
import { getFundRaisingAbi } from '../../../../server/src/abi/fund-raising.abi'
import useTranslation from 'next-translate/useTranslation'
import CampaignProgress from './campaign-progress'
import Moralis from 'moralis'

const CampaignContribution: React.FC<ICampaignContributionProps> = ({ project }) => {
  const { t } = useTranslation()
  const [balance, setBalance] = useState<number>(0)
  const [contribution, setContribution] = useState<number>(0)
  const [progress, setProgress] = useState<number>(0)
  const [donations, setDonations] = useState<number>(0)

  const { data } = useBalance({
    addressOrName: project.contractAddress
  })

  const contract: ethers.Contract = useContract({
    addressOrName: project.contractAddress,
    contractInterface: getFundRaisingAbi()
  })

  console.log(contract)
  console.log(contract.address)
  console.log(contract.callStatic)

  useContractEvent({
    addressOrName: project.contractAddress,
    contractInterface: getFundRaisingAbi(),
    eventName: 'donations',
    listener: event => {
      const amount = Number(ethers.utils.formatUnits(event[0].toString(), process.env.TOKEN_DECIMALS))
      notify(t('common:newContributionForCampaignReceived', { project: project.title, contribution: amount }))
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
    <div className='campaign-content-right'>
      <div className='campaign-title'>{t('campaign:details')}</div>
      <div className='campaign-progress'>
        <CampaignProgress progress={progress} balance={balance} />
        <div className='campaign-info'>
          <div className='campaign-info-1'>
            {t('common:funded')}: {balance} ETH
          </div>
          <div className='campaign-info-2'>
            {t('common:goal')}: {project.goal} ETH
          </div>
          <div className='campaign-info-3'>
            {t('common:donations')}: {donations}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignContribution

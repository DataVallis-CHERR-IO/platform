import React, { useCallback, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { Loading } from '@web3uikit/core'
import { ICampaignCardProps } from '../../../interfaces/components'
import { IProject } from '../../../interfaces/api'
import { getFundRaisingAbi } from '../../../../server/src/abi/fund-raising.abi'
import { notify } from '../../../utils/notify'
import { useCampaignContext } from '../../../contexts/campaigns/campaignsProvider'
import { useBalance, useContractEvent } from 'wagmi'
import moment from 'moment'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import CampaignProgress from './campaign-progress'

const CampaignCards: React.FC = () => {
  const { projects } = useCampaignContext()

  return (
    <div className='section-content'>
      <div className='row mtli-row-clearfix'>
        {!!projects.length ? (
          projects.map((campaign: IProject) => (
            <React.Fragment key={campaign._id}>
              <CampaignCard project={campaign} />
            </React.Fragment>
          ))
        ) : (
          <div>Loading campaigns...</div>
        )}
      </div>
    </div>
  )
}

const CampaignCard: React.FC<ICampaignCardProps> = ({ project }) => {
  const { t } = useTranslation()
  const [balance, setBalance] = useState<number>(0)
  const [contribution, setContribution] = useState<number>(0)
  const [progress, setProgress] = useState<number>(0)
  const [displayDonateBtn, setDisplayDonateBtn] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(true)

  const { data, isLoading } = useBalance({
    addressOrName: project.contractAddress
  })

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

  const updateData = useCallback((donation?: number) => {
    !donation || setContribution(donation)
  }, [])

  useEffect(() => {
    setLoading(isLoading)

    console.log(data);
    if (displayDonateBtn && (moment().isAfter(moment(project.endedAt, 'x')) || moment().isBefore(moment(project.startedAt, 'x')))) {
      setDisplayDonateBtn(false)
    }
    if (!balance) {
      setContribution(Number(data?.formatted || 0))
      setProgress(Math.floor(((balance + contribution) / Number(project.goal)) * 100))
    }
    if (contribution) {
      setBalance(balance + contribution)
      setProgress(Math.floor(((balance + contribution) / Number(project.goal)) * 100))
      setContribution(0)
    }
  }, [balance, contribution, displayDonateBtn, isLoading])

  return (
    <div className='col-sm-12 col-md-12 col-lg-4 animation-1 mt-4'>
      <div className='causes maxwidth500 mb-sm-50'>
        <div className='thumb'>
          <img className='img-thumbnail' alt='campaign image' src={project.image} />
        </div>
        <div className='causes-details clearfix'>
          <div className='p-30 p-sm-15 bg-lighter'>
            <h4>
              <span>{project.title}</span>
            </h4>
            <p>{project.description}</p>
            <CampaignProgress progress={progress} balance={balance} />
            <ul className='list-inline clearfix mt-20 mb-20'>
              <li className='pull-left flip pr-0'>
                <i className='fab fa-ethereum' />
                <span className='font-weight-bold text-lowercase'>
                  {loading && (
                    <div className='campaign-card-loading'>
                      <Loading size={12} spinnerColor='#FFFFFF' spinnerType='wave' />
                    </div>
                  )}
                  {!loading && (
                    <div>
                      {balance} {t('common:raisedOf')} <i className='fab fa-ethereum' /> {project.goal}
                    </div>
                  )}
                </span>
              </li>
            </ul>
            <Link href={`/campaigns/${project.slug}`}>
              <div className='btn btn-black mt-2 btn-sm'>{t(`common:${displayDonateBtn ? 'donateNow' : 'readMore'}`)}</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignCards

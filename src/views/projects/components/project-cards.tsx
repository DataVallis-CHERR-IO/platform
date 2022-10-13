import React, { useCallback, useEffect, useState } from 'react'
import moment from 'moment'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import ProjectProgress from './project-progress'
import { ethers } from 'ethers'
import { Loading } from '@web3uikit/core'
import { IProjectCardType } from '../../../interfaces/components'
import { IProject } from '../../../interfaces/api'
import { getCherrioProjectAbi } from '../../../../server/src/web3/abi/cherrio-project'
import { notify } from '../../../utils/notify'
import { useProjectsContext } from '../../../contexts/projects/provider'
import { useBalance, useContractEvent } from 'wagmi'

const ProjectCards: React.FC = () => {
  const { projects } = useProjectsContext()

  console.log(projects)
  return (
    <div className='section-content'>
      <div className='row mtli-row-clearfix'>
        {!!projects?.length ? (
          projects.map((project: IProject) => (
            <React.Fragment key={project._id}>
              <ProjectCard project={project} />
            </React.Fragment>
          ))
        ) : (
          <div>Loading projects...</div>
        )}
      </div>
    </div>
  )
}

const ProjectCard: React.FC<IProjectCardType> = ({ project }) => {
  const { t } = useTranslation('common')
  const [balance, setBalance] = useState<number>(0)
  const [contribution, setContribution] = useState<number>(0)
  const [progress, setProgress] = useState<number>(0)
  const [displayDonateBtn, setDisplayDonateBtn] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(true)

  const { data, isLoading } = useBalance({
    addressOrName: project.contractAddress
  })

  !project.contractAddress ||
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

  const updateData = useCallback((donation?: number) => {
    !donation || setContribution(donation)
  }, [])

  useEffect(() => {
    setLoading(isLoading)

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
          <img className='img-thumbnail' alt={t('project.text')} src={project.image} />
        </div>
        <div className='causes-details clearfix'>
          <div className='p-30 p-sm-15 bg-lighter'>
            <h4>
              <span>{project.title}</span>
            </h4>
            <p>{project.description}</p>
            <ProjectProgress progress={progress} balance={balance} />
            <ul className='list-inline clearfix mt-20 mb-20'>
              <li className='pull-left flip pr-0'>
                <i className='fab fa-ethereum' />
                <span className='font-weight-bold text-lowercase'>
                  {loading && (
                    <div className='project-card-loading'>
                      <Loading size={12} spinnerColor='#FFFFFF' spinnerType='wave' />
                    </div>
                  )}
                  {!loading && (
                    <div>
                      {balance} {t('raisedOf')} <i className='fab fa-ethereum' /> {project.goal}
                    </div>
                  )}
                </span>
              </li>
            </ul>
            <Link href={`/projects/${project.slug}`}>
              <div className='btn btn-black mt-2 btn-sm'>{t(`common:${displayDonateBtn ? 'donateNow' : 'readMore'}`)}</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectCards

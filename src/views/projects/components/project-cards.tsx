import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import ProjectProgress from './project-progress'
import { ethers } from 'ethers'
import { IProject } from '../../../interfaces/api'
import { notify } from '../../../utils/notify'
import { useProjectsContext } from '../../../contexts/projects/provider'
import { useBalance, useContractEvent, useContractRead } from 'wagmi'
import { getCherrioProjectAbi } from '../../../contracts/abi/cherrio-project'
import { useSubscription } from '@apollo/client'
import { SUBSCRIPTION_PROJECT_CREATED } from '../../../constants/queries/moralis/project'
import * as _ from 'lodash'
import { BeatLoader } from 'react-spinners'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import { StageEnum } from '../../../enums/stage.enum'

const ProjectCards: React.FC = () => {
  const { projects } = useProjectsContext()
  const [lastProjects, setLastProjects] = useState<IProject[]>([])
  const { data, loading, error } = useSubscription(SUBSCRIPTION_PROJECT_CREATED)

  useEffect(() => {
    !projects || setLastProjects(projects)

    if (!loading && data) {
      lastProjects.unshift(data.projectCreated)
      lastProjects.length < 4 || lastProjects.pop()
      setLastProjects(_.cloneDeep(lastProjects))
    }
  }, [data, loading, error])

  return (
    <div className='section-content'>
      <div className='row mtli-row-clearfix'>
        {!!lastProjects.length &&
          lastProjects.map((project: IProject) => (
            <React.Fragment key={project._id}>
              <ProjectCard project={project} />
            </React.Fragment>
          ))}
      </div>
    </div>
  )
}

interface IProjectCardProps {
  project: IProject
}

const ProjectCard: React.FC<IProjectCardProps> = ({ project }) => {
  const { t } = useTranslation('common')
  const [balance, setBalance] = useState<number>(0)
  const [contribution, setContribution] = useState<number>(0)
  const [progress, setProgress] = useState<number>(0)
  const [goal, setGoal] = useState<number>(0)
  const [stage, setStage] = useState<number>(StageEnum.PENDING)
  const [btnText, setBtnText] = useState<string>('activate')

  const { data: dataBalance, isLoading: isLoadingBalance } = useBalance({
    addressOrName: project.contractAddress
  })

  const { data: dataGoal, isLoading: isLoadingGoal } = useContractRead({
    addressOrName: project.contractAddress,
    contractInterface: getCherrioProjectAbi(),
    functionName: 'goal'
  })

  const { data: dataStage, isLoading: isLoadingStage } = useContractRead({
    addressOrName: project.contractAddress,
    contractInterface: getCherrioProjectAbi(),
    functionName: 'stage'
  })

  !ethers.utils.isAddress(project.contractAddress) ||
    useContractEvent({
      addressOrName: project.contractAddress,
      contractInterface: getCherrioProjectAbi(),
      eventName: 'Donation',
      listener: data => {
        const amount = Number(ethers.utils.formatUnits(data[0].toString(), process.env.TOKEN_DECIMALS))
        notify(t('newContributionForProjectReceived', { project: project.title, contribution: amount }))
        handleContribution(amount)
      }
    })

  !ethers.utils.isAddress(project.contractAddress) ||
    useContractEvent({
      addressOrName: project.contractAddress,
      contractInterface: getCherrioProjectAbi(),
      eventName: 'StageChanged',
      listener: data => {
        console.log(data, 'StageChanged')
        // notify(t('newContributionForProjectReceived', { project: project.title, contribution: amount }))
        handleStageChanged(Number(data[0]))
      }
    })

  const handleContribution = useCallback((donation?: number) => {
    console.log(donation, 'handleContribution')
    setBalance(balance + donation)
    setProgress(Math.floor(((balance + donation) / Number(goal)) * 100))
    // !donation || setContribution(donation)
  }, [])

  const handleStageChanged = useCallback((stage?: number) => {
    console.log(stage, 'handleStageChanged')
    setBtnText(stage === StageEnum.ACTIVE ? 'donateNow' : 'readMore')
  }, [])

  useEffect(() => {
    // console.log(dataBalance.formatted, 'dataBalance')
    // console.log(dataGoal.toString(), 'dataGoal')
    // console.log(dataStage, 'dataStage')
    // setLoading(isLoading)

    // if (displayDonateBtn && (moment().isAfter(moment(project.endedAt, 'x')) || moment().isBefore(moment(project.startedAt, 'x')))) {
    //   setDisplayDonateBtn(false)
    // }
    if (!isLoadingStage && !stage) {
      setStage(Number(dataStage))
      // setContribution(Number(data?.formatted || 0))
      // setProgress(Math.floor(((balance + contribution) / Number(project.goal)) * 100))
    }
    if (!isLoadingBalance && !balance) {
      setBalance(Number(dataBalance.formatted))
      // setContribution(Number(data?.formatted || 0))
      // setProgress(Math.floor(((balance + contribution) / Number(project.goal)) * 100))
    }
    if (!isLoadingGoal && !goal) {
      setGoal(Number(ethers.utils.formatUnits(dataGoal.toString(), process.env.TOKEN_DECIMALS)))
      // setContribution(Number(data?.formatted || 0))
      // setProgress(Math.floor(((balance + contribution) / Number(project.goal)) * 100))
    }
    if (contribution) {
      setBalance(balance + contribution)
      setProgress(Math.floor(((balance + contribution) / Number(goal)) * 100))
      setContribution(0)
    }
  }, [isLoadingBalance, isLoadingGoal, contribution])

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
            <p>{project.excerpt}</p>
            <ProjectProgress progress={progress} balance={balance} />
            <ul className='list-inline clearfix mt-20 mb-20'>
              <li className='pull-left flip pr-0'>
                <i className='fab fa-ethereum' />
                <span className='font-weight-bold text-lowercase'>
                  <div className='row justify-content-center mt-2'>
                    <div>
                      <BeatLoader color='#FFFFFF' loading={isLoadingBalance} size={5} />
                      {!isLoadingBalance && balance}
                    </div>
                    <div className='mx-2'>{t('raisedOf')}</div>
                    <div>
                      <BeatLoader color='#FFFFFF' loading={isLoadingGoal} size={5} />
                      {!isLoadingGoal && (
                        <>
                          <FontAwesomeIcon icon={faEthereum} /> <span>{goal}</span>
                        </>
                      )}
                    </div>
                  </div>
                </span>
              </li>
            </ul>
            <Link href={`/projects/${project.slug}`}>
              <div className='btn btn-black mt-2 btn-sm'>{t(`common:${btnText}`)}</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectCards

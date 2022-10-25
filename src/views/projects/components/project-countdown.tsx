import React, { useEffect, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { IProject } from '../../../interfaces/api'
import { useContractEvent, useContractRead } from 'wagmi'
import { getCherrioProjectAbi } from '../../../contracts/abi/cherrio-project'
import { StageEnum } from '../../../enums/stage.enum'
import { getCherrioProjectActivatorAbi } from '../../../contracts/abi/cherrio-project-activator'
import LinearProgressWithLabel from '../../../themes/components/feedback/linear-progress-with-label'
import { getEthers } from '../../../utils'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'

interface IProjectCountdownProps {
  project: IProject
}

const ProjectCountdown: React.FC<IProjectCountdownProps> = ({ project }) => {
  const { t } = useTranslation('common')
  const [stage, setStage] = useState<number>(0)
  const [days, setDays] = useState<number>(0)
  const [minutes, setMinutes] = useState<number>(0)
  const [hours, setHours] = useState<number>(0)
  const [seconds, setSeconds] = useState<number>(0)
  const [activators, setActivators] = useState<number>(0)
  const [numActivators, setNumActivators] = useState<number>(0)
  const [activateSize, setActivateSize] = useState<number>(0)
  const [activatedAmount, setActivatedAmount] = useState<number>(0)
  const [progress, setProgress] = useState<number>(0)
  const [title, setTitle] = useState<string>(t('project.activationIsNeeded'))
  const [subtitle, setSubtitle] = useState<string>(t('project.numberOfActivators'))

  const { data: dataStage, isLoading: isLoadingStage } = useContractRead({
    addressOrName: project.contractAddress,
    contractInterface: getCherrioProjectAbi(),
    functionName: 'stage'
  })

  const { data: dataProject, isLoading: isLoadingProject } = useContractRead({
    addressOrName: process.env.CONTRACT_CHERRIO_PROJECT_ACTIVATOR_ADDRESS,
    contractInterface: getCherrioProjectActivatorAbi(),
    functionName: 'projects',
    args: [project.contractAddress]
  })

  const { data: dataActivators, isLoading: isLoadingActivators } = useContractRead({
    addressOrName: process.env.CONTRACT_CHERRIO_PROJECT_ACTIVATOR_ADDRESS,
    contractInterface: getCherrioProjectActivatorAbi(),
    functionName: 'getActivators',
    args: [project.contractAddress]
  })

  useContractEvent({
    addressOrName: project.contractAddress,
    contractInterface: getCherrioProjectAbi(),
    eventName: 'ProjectActivated',
    listener: data => data[0].toLowerCase() !== project.contractAddress.toLowerCase() || handleCountdown(StageEnum.ACTIVE, data[1])
  })

  useContractEvent({
    addressOrName: process.env.CONTRACT_CHERRIO_PROJECT_ACTIVATOR_ADDRESS,
    contractInterface: getCherrioProjectActivatorAbi(),
    eventName: 'NewActivator',
    listener: data => data[0].toLowerCase() !== project.contractAddress.toLowerCase() || setActivators(activators + 1)
  })

  useContractEvent({
    addressOrName: process.env.CONTRACT_CHERRIO_PROJECT_ACTIVATOR_ADDRESS,
    contractInterface: getCherrioProjectActivatorAbi(),
    eventName: 'ActivateProject',
    listener: data => data[0].toLowerCase() !== project.contractAddress.toLowerCase() || setActivatedAmount(activatedAmount + getEthers(data[2]))
  })

  const handleCountdown = (currentStage: number, endedAt: string) => {
    setStage(currentStage)
    setTitle(t(currentStage === StageEnum.ACTIVE ? 'project.isLiveNow' : 'project.hasEnded'))
    setSubtitle(t(currentStage === StageEnum.ACTIVE ? 'project.endsIn' : 'project.endedBefore'))

    const deadline = new Date(moment(endedAt, 'x').format('YYYY-MM-DD HH:mm:ss'))
    const interval = setInterval(() => {
      const difference = deadline.getTime() - new Date().getTime()

      const d = Math.floor(difference / (1000 * 60 * 60 * 24))
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((difference % (1000 * 60)) / 1000)

      setDays(d)
      setMinutes(m)
      setHours(h)
      setSeconds(s)
    }, 1000)

    return () => clearInterval(interval)
  }

  useEffect(() => {
    if (!isLoadingStage && dataStage) {
      console.log('IF')
      handleCountdown(Number(dataStage), dataProject.endedAt)
    }

    if (!isLoadingProject) {
      setNumActivators(Number(dataProject.numActivators))
      setActivateSize(getEthers(dataProject.activateSize))
      setActivatedAmount(getEthers(dataProject.activatedAmount))
      console.log(dataProject, 'dataProject')
    }

    if (!isLoadingActivators) {
      setActivators(dataActivators.length)
      console.log(dataActivators, 'dataActivators')
      console.log(dataActivators.length, 'dataActivators')
    }
  }, [isLoadingStage, isLoadingProject])

  return (
    <div className='project-content-left'>
      <div className='project-title'>{title}</div>
      <div className='project-subtitle'>
        {subtitle}
        {stage === StageEnum.PENDING && (
          <span>
            : {activators} / {numActivators}
          </span>
        )}
      </div>
      {stage !== StageEnum.PENDING ? (
        <div className='project-countdown'>
          <div className='project-cd-item project-day'>
            <div className='project-cd-item-inner'>
              <span className='num'>{days}</span> <span className='label'>{t('daysShort')}</span>
            </div>
          </div>
          <div className='project-cd-item project-day'>
            <div className='project-cd-item-inner'>
              <span className='num'>{hours}</span> <span className='label'>{t('hoursShort')}</span>
            </div>
          </div>
          <div className='project-cd-item project-day'>
            <div className='project-cd-item-inner'>
              <span className='num'>{minutes}</span> <span className='label'>{t('minutesShort')}</span>
            </div>
          </div>
          <div className='project-cd-item project-day'>
            <div className='project-cd-item-inner'>
              <span className='num'>{seconds}</span> <span className='label'>{t('secondsShort')}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className='project-countdown'>
          <div className='row'>
            <div className='col-md-6'>
              <FontAwesomeIcon icon={faEthereum} /> {activatedAmount}
            </div>
            <div className='col-md-6'>
              <FontAwesomeIcon icon={faEthereum} /> {activateSize}
            </div>
            <div className='col-md-12'>
              <LinearProgressWithLabel value={progress} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectCountdown

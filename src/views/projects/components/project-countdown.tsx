import React, { useEffect, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import LinearWithLabelProgress from '../../../themes/components/feedback/progress/linear-with-label.progress'
import { StageEnum } from '../../../enums/stage.enum'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
import { useContractContext } from '../../../contexts/contract/provider'

const ProjectCountdown: React.FC = () => {
  const { t } = useTranslation('common')
  const [days, setDays] = useState<number>(0)
  const [minutes, setMinutes] = useState<number>(0)
  const [hours, setHours] = useState<number>(0)
  const [seconds, setSeconds] = useState<number>(0)
  const [progress, setProgress] = useState<number>(0)
  const [title, setTitle] = useState<string>(t('project.activationIsNeeded'))
  const [subtitle, setSubtitle] = useState<string>(t('project.numberOfActivators'))
  const { projectContract, projectActivatorContract } = useContractContext()

  useEffect(() => {
    if (projectContract?.stage !== StageEnum.PENDING) {
      setTitle(t(projectContract?.stage === StageEnum.ACTIVE ? 'project.isLiveNow' : 'project.hasEnded'))
      setSubtitle(t(projectContract?.stage === StageEnum.ACTIVE ? 'project.endsIn' : 'project.endedBefore'))

      const endedAt = new Date(
        moment(projectContract?.stage === StageEnum.ACTIVE ? projectContract?.deadline : projectContract?.endedAt, 'X').format('YYYY-MM-DD HH:mm:ss')
      )
      const interval = setInterval(() => {
        const difference = projectContract?.stage === StageEnum.ACTIVE ? endedAt.getTime() - new Date().getTime() : new Date().getTime() - endedAt.getTime()

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

    !projectActivatorContract ||
      setProgress(Math.floor((projectActivatorContract?.project?.activatedAmount / projectActivatorContract?.project?.activateSize) * 100))
  }, [projectContract?.stage, projectActivatorContract?.project?.activatedAmount, projectActivatorContract?.project?.activators])

  return (
    <div className='project-content-left'>
      <div className='project-title'>{title}</div>
      <div className='project-subtitle'>
        {subtitle}
        {projectContract?.stage === StageEnum.PENDING && (
          <span>
            : {projectActivatorContract?.project?.activators?.length} / {projectActivatorContract?.project?.numActivators}
          </span>
        )}
      </div>
      {projectContract?.stage !== StageEnum.PENDING ? (
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
              <FontAwesomeIcon icon={faEthereum} /> {projectActivatorContract?.project?.activatedAmount}
            </div>
            <div className='col-md-6'>
              <FontAwesomeIcon icon={faEthereum} /> {projectActivatorContract?.project?.activateSize}
            </div>
            <div className='col-md-12'>
              <LinearWithLabelProgress value={progress} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectCountdown

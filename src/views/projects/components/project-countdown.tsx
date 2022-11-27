import React, { useEffect, useState } from 'react'
import moment from 'moment'
import useTranslation from 'next-translate/useTranslation'
import LinearWithLabelProgress from '../../../themes/components/feedback/progress/linear-with-label.progress'
import { BeatLoader } from 'react-spinners'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContractContext } from '../../../contexts/contract/provider'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import { StageEnum } from '../../../enums/stage.enum'

const ProjectCountdown: React.FC = () => {
  const { t } = useTranslation('common')
  const [days, setDays] = useState<number>(0)
  const [minutes, setMinutes] = useState<number>(0)
  const [hours, setHours] = useState<number>(0)
  const [seconds, setSeconds] = useState<number>(0)
  const [progress, setProgress] = useState<number>(0)
  const [title, setTitle] = useState<string>(t('project.activationIsNeeded'))
  const [subtitle, setSubtitle] = useState<string>(t('project.numberOfActivators'))
  const { contractProject, contractProjectActivator } = useContractContext()

  useEffect(() => {
    if (contractProjectActivator.project?.activatedAmount === undefined) return

    if (contractProject?.stage !== StageEnum.PENDING) {
      setTitle(t(contractProject?.stage === StageEnum.ACTIVE ? 'project.isLiveNow' : 'project.hasEnded'))
      setSubtitle(t(contractProject?.stage === StageEnum.ACTIVE ? 'project.endsIn' : 'project.endedBefore'))

      const endedAt = new Date(
        moment(contractProject?.stage === StageEnum.ACTIVE ? contractProject?.deadline : contractProject?.endedAt, 'X').format('YYYY-MM-DD HH:mm:ss')
      )
      const interval = setInterval(() => {
        const difference = contractProject?.stage === StageEnum.ACTIVE ? endedAt.getTime() - new Date().getTime() : new Date().getTime() - endedAt.getTime()

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

    !contractProjectActivator ||
      setProgress(Math.floor((contractProjectActivator.project?.activatedAmount / contractProjectActivator.project?.activateSize) * 100))
  }, [contractProject?.stage, contractProjectActivator.project?.activatedAmount, contractProjectActivator.project?.activators])

  return (
    <div className='project-content-left'>
      <div className='project-title'>{title}</div>
      <div className='project-subtitle'>
        <span className='mr-1'>{subtitle}:</span>
        {contractProject?.stage === StageEnum.PENDING &&
          (contractProjectActivator.project?.numActivators === undefined ? (
            <span>
              <BeatLoader color='#d21242' loading={true} size={5} />
            </span>
          ) : (
            <span>
              {contractProjectActivator.project?.activators?.length} / {contractProjectActivator.project?.numActivators}
            </span>
          ))}
      </div>
      {contractProject?.stage !== StageEnum.PENDING ? (
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
              {contractProjectActivator.project?.activatedAmount === undefined ? (
                <BeatLoader color='#d21242' loading={true} size={5} />
              ) : (
                <>
                  <FontAwesomeIcon icon={faEthereum} /> {contractProjectActivator.project?.activatedAmount}
                </>
              )}
            </div>
            <div className='col-md-6'>
              {contractProjectActivator.project?.activateSize === undefined ? (
                <BeatLoader color='#d21242' loading={true} size={5} />
              ) : (
                <>
                  <FontAwesomeIcon icon={faEthereum} /> {contractProjectActivator.project?.activateSize}
                </>
              )}
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

import React, { useEffect, useState } from 'react'
import moment from 'moment'
import useTranslation from 'next-translate/useTranslation'

interface IProjectCountdownProps {
  startedAt: string
  endedAt: string
}

const ProjectCountdown: React.FC<IProjectCountdownProps> = ({ startedAt, endedAt }) => {
  const { t } = useTranslation('common')
  const [days, setDays] = useState<number>(0)
  const [minutes, setMinutes] = useState<number>(0)
  const [hours, setHours] = useState<number>(0)
  const [seconds, setSeconds] = useState<number>(0)
  const [title, setTitle] = useState<string>(t('project.isLiveNow'))
  const [subtitle, setSubtitle] = useState<string>(t('project.endsIn'))
  let useStartedAt = false

  useEffect(() => {
    if (moment().isAfter(moment(endedAt, 'x'))) {
      setTitle(t('project.hasEnded'))
      setSubtitle(t('project.endedBefore'))
    } else if (moment().isBefore(moment(startedAt, 'x'))) {
      setTitle(t('project.willStartSoon'))
      setSubtitle(t('project.startsIn'))
      useStartedAt = true
    }

    const deadline = new Date(moment(useStartedAt ? startedAt : endedAt, 'x').format('YYYY-MM-DD HH:mm:ss'))
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
  })

  return (
    <div className='project-content-left'>
      <div className='project-title'>{title}</div>
      <div className='project-subtitle'>{subtitle}</div>
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
    </div>
  )
}

export default ProjectCountdown

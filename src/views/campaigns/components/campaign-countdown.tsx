import React, { useEffect, useState } from 'react'
import { ICampaignCountdownProps } from '../../../interfaces/components'
import moment from 'moment'
import useTranslation from 'next-translate/useTranslation'

const CampaignCountdown: React.FC<ICampaignCountdownProps> = ({ startedAt, endedAt }) => {
  const { t } = useTranslation()
  const [days, setDays] = useState<number>(0)
  const [minutes, setMinutes] = useState<number>(0)
  const [hours, setHours] = useState<number>(0)
  const [seconds, setSeconds] = useState<number>(0)
  const [title, setTitle] = useState<string>(t('campaign:isLiveNow'))
  const [subtitle, setSubtitle] = useState<string>(t('campaign:endsIn'))
  let useStartedAt = false

  useEffect(() => {
    if (moment().isAfter(moment(endedAt, 'x'))) {
      setTitle(t('campaign:hasEnded'))
      setSubtitle(t('campaign:endedBefore'))
    } else if (moment().isBefore(moment(startedAt, 'x'))) {
      setTitle(t('campaign:willStartSoon'))
      setSubtitle(t('campaign:startsIn'))
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
    <div className='campaign-content-left'>
      <div className='campaign-title'>{title}</div>
      <div className='campaign-subtitle'>{subtitle}</div>
      <div className='campaign-countdown'>
        <div className='campagin-cd-item campaign-day'>
          <div className='campaign-cd-item-inner'>
            <span className='num'>{days}</span> <span className='label'>{t('common:daysShort')}</span>
          </div>
        </div>
        <div className='campagin-cd-item campaign-day'>
          <div className='campaign-cd-item-inner'>
            <span className='num'>{hours}</span> <span className='label'>{t('common:hoursShort')}</span>
          </div>
        </div>
        <div className='campagin-cd-item campaign-day'>
          <div className='campaign-cd-item-inner'>
            <span className='num'>{minutes}</span> <span className='label'>{t('common:minutesShort')}</span>
          </div>
        </div>
        <div className='campagin-cd-item campaign-day'>
          <div className='campaign-cd-item-inner'>
            <span className='num'>{seconds}</span> <span className='label'>{t('common:secondsShort')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignCountdown

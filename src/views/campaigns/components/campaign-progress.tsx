import { ICampaignProgressProps } from '../../../interfaces/components'
import React from 'react'

const CampaignProgress: React.FC<ICampaignProgressProps> = ({ progress, balance }) => {
  return (
    <div className='progress'>
      <div className='progress-bar' role='progressbar' style={{ width: `${progress}%` }} aria-valuenow={balance} aria-valuemin={0} aria-valuemax={100}>
        {progress}%
      </div>
    </div>
  )
}

export default CampaignProgress

import React, { useEffect, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import ProjectProgress from './project-progress'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import { useContractContext } from '../../../contexts/contract/provider'

const ProjectDonation: React.FC = () => {
  const { t } = useTranslation('common')
  const [progress, setProgress] = useState<number>(0)
  const { projectContract } = useContractContext()

  useEffect(() => {
    setProgress(Math.floor((projectContract?.raisedAmount / projectContract?.goal) * 100))
  }, [projectContract?.raisedAmount, projectContract?.totalDonations])

  return (
    <div className='project-content-right'>
      <div className='project-title'>{t('project.details')}</div>
      <div className='project-progress'>
        <ProjectProgress progress={progress} balance={projectContract?.raisedAmount} />
        <div className='project-info'>
          <div className='project-info-1'>
            {t('funded')}:{' '}
            <>
              <FontAwesomeIcon icon={faEthereum} /> <span>{projectContract?.raisedAmount}</span>
            </>
          </div>
          <div className='project-info-2'>
            {t('goal')}:{' '}
            <>
              <FontAwesomeIcon icon={faEthereum} /> <span>{projectContract?.goal}</span>
            </>
          </div>
          <div className='project-info-3'>
            {t('donations')}: {projectContract?.totalDonations}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDonation

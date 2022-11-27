import React, { useEffect, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import ProjectProgress from './project-progress'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContractContext } from '../../../contexts/contract/provider'
import { getEther } from '../../../utils'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import { IProject } from '../../../interfaces/api'

interface IProjectDonationProps {
  project: IProject
}

const ProjectDonation: React.FC<IProjectDonationProps> = ({ project }) => {
  const { t } = useTranslation('common')
  const [progress, setProgress] = useState<number>(0)
  const { contractProject } = useContractContext()

  useEffect(() => {
    if (contractProject.raisedAmount === undefined) return

    setProgress(Math.floor((contractProject.raisedAmount / getEther(project?.goal)) * 100))
  }, [contractProject.raisedAmount])

  return (
    <div className='project-content-right'>
      <div className='project-title'>{t('project.details')}</div>
      <div className='project-progress'>
        <ProjectProgress progress={progress} balance={contractProject.raisedAmount} />
        <div className='project-info'>
          <div className='project-info-1'>
            {t('funded')}:{' '}
            <>
              <FontAwesomeIcon icon={faEthereum} />
              <span className='ml-1'>{contractProject.raisedAmount}</span>
            </>
          </div>
          <div className='project-info-2'>
            {t('goal')}:{' '}
            <>
              <FontAwesomeIcon icon={faEthereum} />
              <span className='ml-1'>{getEther(project?.goal)}</span>
            </>
          </div>
          <div className='project-info-3'>
            {t('donations')}: {contractProject.numDonations}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDonation

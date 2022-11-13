import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'
import ProjectProgress from './project-progress'
import { useContractContext } from '../../../contexts/contract/provider'
import { IProject } from '../../../interfaces/api'
import { fromSun } from '../../../utils'

interface IProjectDonation {
  project: IProject
}

const ProjectDonation: React.FC<IProjectDonation> = ({ project }) => {
  const { t } = useTranslation('common')
  const [progress, setProgress] = useState<number>(0)
  const { contractProject } = useContractContext()

  useEffect(() => {
    if (contractProject.raisedAmount === undefined) return

    setProgress(Math.floor((contractProject.raisedAmount / fromSun(project?.goal)) * 100))
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
              <Image src='/img/tron-white.png' width={14} height={14} />
              <span className='ml-1'>{contractProject.raisedAmount}</span>
            </>
          </div>
          <div className='project-info-2'>
            {t('goal')}:{' '}
            <>
              <Image src='/img/tron-white.png' width={14} height={14} />
              <span className='ml-1'>{fromSun(project?.goal)}</span>
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

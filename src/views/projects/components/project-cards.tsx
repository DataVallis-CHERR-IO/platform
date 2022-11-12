import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import ProjectProgress from './project-progress'
import useContractData from '../../../hooks/use-contract-data'
import { IProject } from '../../../interfaces/api'
import { useProjectsContext } from '../../../contexts/projects/provider'
import { useSubscription } from '@apollo/client'
import { SUBSCRIPTION_PROJECT_CREATED } from '../../../constants/queries/database/project'
import { BeatLoader } from 'react-spinners'
import { StageEnum } from '../../../enums/stage.enum'
import { fromSun } from '../../../utils'
import * as _ from 'lodash'

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
            <React.Fragment key={project.id}>
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
  const [progress, setProgress] = useState<number>(0)
  const [btnText, setBtnText] = useState<string>('activate')
  const { data: contractData, isLoading } = useContractData({
    contractAddress: project.contractAddress,
    data: { project: ['getData'] }
  })

  useEffect(() => {
    setBtnText(contractData?.project?.stage === StageEnum.ACTIVE ? 'donateNow' : contractData?.project?.stage === StageEnum.ENDED ? 'readMore' : 'activate')
    setProgress(Math.floor((contractData?.project?.raisedAmount / fromSun(project.goal)) * 100))
  }, [contractData?.project?.stage, contractData?.project?.raisedAmount])

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
            <ProjectProgress progress={progress} balance={contractData?.project?.raisedAmount} />
            <ul className='list-inline clearfix mt-20 mb-20'>
              <li className='pull-left flip pr-0'>
                <i className='fab fa-ethereum' />
                <span className='font-weight-bold text-lowercase'>
                  <div className='row justify-content-center mt-2'>
                    <div>
                      <BeatLoader color='#FFFFFF' loading={isLoading} size={5} />
                      {!isLoading && (
                        <>
                          <Image src='/img/tron-white.png' width={14} height={14} /> <span>{contractData?.project?.raisedAmount}</span>
                        </>
                      )}
                    </div>
                    <div className='mx-2'>{t('raisedOf')}</div>
                    <div>
                      <BeatLoader color='#FFFFFF' loading={isLoading} size={5} />
                      {!isLoading && (
                        <>
                          <Image src='/img/tron-white.png' width={14} height={14} /> <span>{fromSun(project.goal)}</span>
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

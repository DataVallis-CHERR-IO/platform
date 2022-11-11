import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import ProjectProgress from './project-progress'
import { IProject } from '../../../interfaces/api'
import { useProjectsContext } from '../../../contexts/projects/provider'
import { useSubscription } from '@apollo/client'
import { SUBSCRIPTION_PROJECT_CREATED } from '../../../constants/queries/database/project'
import { BeatLoader } from 'react-spinners'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import { StageEnum } from '../../../enums/stage.enum'
import { fromSun } from '../../../utils'
import { useQuery } from 'react-query'
import { useTronWebContext } from '../../../contexts/tronweb/provider'
import * as _ from 'lodash'

const ProjectCards: React.FC = () => {
  const { projects } = useProjectsContext()
  const [lastProjects, setLastProjects] = useState<IProject[]>([])
  const { data, loading, error } = useSubscription(SUBSCRIPTION_PROJECT_CREATED)

  useEffect(() => {
    !projects || setLastProjects(projects)

    if (!loading && data) {
      lastProjects.unshift(data.projectCreated)
      lastProjects.length < 14 || lastProjects.pop()
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
  const { tronWeb } = useTronWebContext()

  const { data: projectContract, isLoading } = useQuery(
    ['projectContract'],
    async () => {
      const contract = await tronWeb.contract().at(project.contractAddress)
      const raisedAmount = await contract.raisedAmount().call()
      const stage = await contract.stage().call()

      return {
        raisedAmount,
        stage
      }
    },
    {
      onError: error => {
        console.log('❌ GraphQL error (query media): ', error)
      }
    }
  )

  // const contract = useMemo(
  //   () => ({
  //     addressOrName: project.contractAddress
  //   }),
  //   [project.contractAddress]
  // )
  // const contractInterface = useMemo(
  //   () => ({
  //     contractInterface: getCherrioProjectAbi()
  //   }),
  //   []
  // )

  // const { data: projectContract, isLoading } = useContractReads({
  //   contracts: [
  //     {
  //       ...contract,
  //       ...contractInterface,
  //       functionName: 'stage'
  //     },
  //     {
  //       ...contract,
  //       ...contractInterface,
  //       functionName: 'goal'
  //     },
  //     {
  //       ...contract,
  //       ...contractInterface,
  //       functionName: 'raisedAmount'
  //     }
  //   ],
  //   watch: true
  // })

  useEffect(() => {
    setBtnText(Number(projectContract?.stage) === StageEnum.ACTIVE ? 'donateNow' : Number(projectContract?.stage) === StageEnum.ENDED ? 'readMore' : 'activate')
    setProgress(Math.floor(fromSun(projectContract?.raisedAmount / project.goal) * 100))
  }, [projectContract?.stage, projectContract?.raisedAmount])

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
            <ProjectProgress progress={progress} balance={_.get(projectContract, '[2]')} />
            <ul className='list-inline clearfix mt-20 mb-20'>
              <li className='pull-left flip pr-0'>
                <i className='fab fa-s' />
                <span className='font-weight-bold text-lowercase'>
                  <div className='row justify-content-center mt-2'>
                    <div>
                      <BeatLoader color='#FFFFFF' loading={isLoading} size={5} />
                      {!isLoading && (
                        <>
                          <FontAwesomeIcon icon={faEthereum} /> <span>{fromSun(projectContract?.raisedAmount)}</span>
                        </>
                      )}
                    </div>
                    <div className='mx-2'>{t('raisedOf')}</div>
                    <div>
                      <BeatLoader color='#FFFFFF' loading={isLoading} size={5} />
                      {!isLoading && (
                        <>
                          <FontAwesomeIcon icon={faEthereum} /> <span>{project.goal}</span>
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

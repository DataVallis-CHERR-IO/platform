import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import ProjectProgress from './project-progress'
import { Address, useContractReads } from 'wagmi'
import { getCherrioProjectAbi } from '../../../contracts/abi/cherrio-project'
import { useSubscription } from '@apollo/client'
import { useQuery } from 'react-query'
import { BeatLoader, FadeLoader } from 'react-spinners'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getEther } from '../../../utils'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import { apolloClient } from '../../../clients/graphql'
import { QUERY_PROJECTS, SUBSCRIPTION_PROJECT_CREATED } from '../../../constants/queries/database/project'
import { IProject } from '../../../interfaces/api'
import { StageEnum } from '../../../enums/stage.enum'
import * as _ from 'lodash'

const ProjectCards: React.FC = () => {
  const [lastProjects, setLastProjects] = useState<IProject[]>(null)
  const { data: newProject } = useSubscription(SUBSCRIPTION_PROJECT_CREATED)

  const { data: projects } = useQuery(
    ['projects'],
    async () => {
      return (
        await apolloClient.query({
          query: QUERY_PROJECTS,
          variables: {
            take: 3
          }
        })
      ).data.projects
    },
    {
      onError: error => {
        console.log('❌ GraphQL error (query detail): ', error)
      }
    }
  )

  useEffect(() => {
    !projects || setLastProjects(projects)

    if (newProject) {
      lastProjects.unshift(newProject.projectCreated)
      lastProjects.length < 4 || lastProjects.pop()
      setLastProjects(_.cloneDeep(lastProjects))
    }
  }, [projects, newProject])

  return (
    <div className='section-content'>
      <div className='row mtli-row-clearfix' style={!lastProjects ? { justifyContent: 'center' } : {}}>
        {lastProjects ? (
          lastProjects.map((project: IProject) => (
            <React.Fragment key={project.id}>
              <ProjectCard project={project} />
            </React.Fragment>
          ))
        ) : (
          <FadeLoader color='#d21242' loading={true} />
        )}
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

  const contract = useMemo(
    () => ({
      address: project.contractAddress as Address
    }),
    [project.contractAddress]
  )
  const abi = useMemo(
    () => ({
      abi: getCherrioProjectAbi()
    }),
    []
  )

  const { data: contractProject } = useContractReads({
    contracts: [
      {
        ...contract,
        ...abi,
        functionName: 'stage'
      },
      {
        ...contract,
        ...abi,
        functionName: 'raisedAmount'
      }
    ],
    watch: true
  })

  useEffect(() => {
    setBtnText(
      Number(_.get(contractProject, '[0]')) === StageEnum.ACTIVE
        ? 'donateNow'
        : Number(_.get(contractProject, '[0]')) === StageEnum.ENDED
        ? 'readMore'
        : 'activate'
    )
    setProgress(Math.floor((getEther(_.get(contractProject, '[1]')) / getEther(project?.goal)) * 100))
  }, [_.get(contractProject, '[0]'), _.get(contractProject, '[1]')])

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
            <ProjectProgress progress={progress} balance={getEther(_.get(contractProject, '[1]'))} />
            <ul className='list-inline clearfix mt-20 mb-20'>
              <li className='pull-left flip pr-0'>
                <i className='fab fa-ethereum' />
                <span className='font-weight-bold text-lowercase'>
                  <div className='row justify-content-center mt-2'>
                    <div>
                      <BeatLoader color='#FFFFFF' loading={contractProject === undefined} size={5} />
                      {contractProject !== undefined && (
                        <>
                          <FontAwesomeIcon icon={faEthereum} /> <span>{getEther(_.get(contractProject, '[1]'))}</span>
                        </>
                      )}
                    </div>
                    <div className='mx-2'>{t('raisedOf')}</div>
                    <div>
                      <>
                        <FontAwesomeIcon icon={faEthereum} /> <span>{getEther(project?.goal)}</span>
                      </>
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

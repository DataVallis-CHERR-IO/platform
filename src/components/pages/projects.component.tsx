import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ImageLightbox from '../../themes/components/lightbox/image.lightbox'
import DataTable from '../../themes/components/data/data.table'
import useTranslation from 'next-translate/useTranslation'
import useContractsData from '../../hooks/use-contracts-data'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tooltip } from '@mui/material'
import { BeatLoader } from 'react-spinners'
import { getCherrioProjectAbi } from '../../contracts/abi/cherrio-project'
import { useSubscription } from '@apollo/client'
import { getEther } from '../../utils'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import { faClock, faFlagCheckered, faListCheck } from '@fortawesome/free-solid-svg-icons'
import { SUBSCRIPTION_PROJECT_CREATED } from '../../constants/queries/database/project'
import { IProject } from '../../interfaces/api'
import { StageEnum } from '../../enums/stage.enum'
import * as _ from 'lodash'
import moment from 'moment'

interface IProjectsComponentProps {
  projects?: IProject[]
}

const ProjectsComponent: React.FC<IProjectsComponentProps> = ({ projects }) => {
  const { t } = useTranslation('common')
  const [rows, setRows] = useState<any[]>([])
  const [openImageLightbox, setOpenImageLightbox] = useState<boolean>(false)
  const [images, setImages] = useState<string[]>([])
  const [allProjects, setAllProjects] = useState<IProject[]>(projects)
  const { data: newProject } = useSubscription(SUBSCRIPTION_PROJECT_CREATED)
  const { data: contractsData } = useContractsData({
    contracts: allProjects.map((project: IProject, index: number) => ({
      key: `project-${index}`,
      address: project.contractAddress,
      abi: getCherrioProjectAbi(),
      funcName: 'getData'
    }))
  })

  const columns = useMemo(
    () => [
      { id: 'image', label: t('image') },
      { id: 'title', label: t('title') },
      { id: 'excerpt', label: t('excerpt') },
      { id: 'donated', label: t('donated'), width: 100 },
      { id: 'goal', label: t('goal'), width: 100 },
      { id: 'startedAt', label: t('startedAt'), width: 100 },
      { id: 'endedAt', label: t('endedAt'), width: 100 },
      { id: 'status', label: t('status'), align: 'center' }
    ],
    []
  )

  const handleProjects = useCallback(() => {
    const data = []

    allProjects.forEach((project: IProject, index: number) => {
      data.push({
        image: (
          <div style={{ width: '80px' }}>
            <Image
              loader={() => project.image}
              src={project.image}
              alt={project.title}
              width='100%'
              height='100%'
              layout='responsive'
              objectFit='contain'
              unoptimized={true}
              onClick={() => handleLightboxImagesOnClick(project)}
            />
          </div>
        ),
        title: (
          <Link href={`/projects/${project.slug}`}>
            <a target='_blank' rel='noreferrer noopener' className='link'>
              {project.title}
            </a>
          </Link>
        ),
        excerpt: project.excerpt,
        donated:
          _.get(contractsData, `[${index}].getData._raisedAmount`) === undefined ? (
            <BeatLoader color='#d21242' loading={true} size={5} />
          ) : (
            <>
              <FontAwesomeIcon icon={faEthereum} /> {getEther(_.get(contractsData, `[${index}].getData._raisedAmount`, '').toString())}
            </>
          ),
        goal: (
          <>
            <FontAwesomeIcon icon={faEthereum} /> {getEther(project.goal)}
          </>
        ),
        startedAt: (
          <>
            {_.get(contractsData, `[${index}].getData._stage`) === undefined ? (
              <BeatLoader color='#d21242' loading={true} size={5} />
            ) : _.get(contractsData, `[${index}].getData._stage`) === StageEnum.PENDING ? (
              '/'
            ) : (
              <div>{moment(_.get(contractsData, `[${index}].getData._startedAt`)).format('DD/MM/YYYY')}</div>
            )}
          </>
        ),
        endedAt: (
          <>
            {_.get(contractsData, `[${index}].getData._stage`) === undefined ? (
              <BeatLoader color='#d21242' loading={true} size={5} />
            ) : _.get(contractsData, `[${index}].getData._stage`) === StageEnum.PENDING ? (
              '/'
            ) : (
              <div>{moment(_.get(contractsData, `[${index}].getData._endedAt`)).format('DD/MM/YYYY')}</div>
            )}
          </>
        ),
        status:
          _.get(contractsData, `[${index}].getData._stage`) === undefined ? (
            <BeatLoader color='#d21242' loading={true} size={5} />
          ) : (
            <Tooltip
              title={t(
                _.get(contractsData, `[${index}].getData._stage`) === StageEnum.PENDING
                  ? 'project.activationIsNeeded'
                  : _.get(contractsData, `[${index}].getData._stage`) === StageEnum.ACTIVE
                  ? 'project.isLiveNow'
                  : 'project.hasEnded'
              )}
            >
              <FontAwesomeIcon
                icon={
                  _.get(contractsData, `[${index}].getData._stage`) === StageEnum.PENDING
                    ? faListCheck
                    : _.get(contractsData, `[${index}].getData._stage`) === StageEnum.ACTIVE
                    ? faClock
                    : faFlagCheckered
                }
                className={
                  _.get(contractsData, `[${index}].getData._stage`) === StageEnum.PENDING
                    ? 'color-warning'
                    : _.get(contractsData, `[${index}].getData._stage`) === StageEnum.ACTIVE
                    ? 'color-success'
                    : 'color-danger'
                }
                size={'xl'}
              />
            </Tooltip>
          )
      })
    })

    setRows(data)
  }, [allProjects.length, contractsData])

  const handleLightboxImagesOnClick = (project: IProject) => {
    setImages([project.image])
    setOpenImageLightbox(true)
  }

  useEffect(() => {
    if (newProject) {
      const newProjects = [...projects]
      newProjects.unshift(newProject.projectCreated)
      setAllProjects(newProjects)
    }

    !allProjects || handleProjects()
  }, [allProjects.length, contractsData, newProject])

  return (
    <>
      <section className='section-1'>
        <div className='container'>
          <div className='row ml-0 mr-0'>
            <DataTable columns={columns} rows={rows} />
          </div>
        </div>
      </section>
      <ImageLightbox images={images} open={openImageLightbox} onClose={() => setOpenImageLightbox(false)} />
    </>
  )
}

export default ProjectsComponent

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'
import StickyHeadTable from '../../themes/components/data/sticky-head.table'
import useContractsData from '../../hooks/use-contracts-data'
import { IProject } from '../../interfaces/api'
import { fromSun } from '../../utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { StageEnum } from '../../enums/stage.enum'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { faFlagCheckered, faListCheck } from '@fortawesome/free-solid-svg-icons'
import { BeatLoader } from 'react-spinners'
import { Tooltip } from '@mui/material'

interface IProjectsComponentProps {
  projects?: IProject[]
}

const ProjectsComponent: React.FC<IProjectsComponentProps> = ({ projects }) => {
  const { t } = useTranslation('common')
  const [rows, setRows] = useState<any[]>([])
  const { data: contractsData } = useContractsData({
    contractAddresses: projects.map((project: IProject) => project.contractAddress),
    data: { project: ['getData'] }
  })
  const columns = useMemo(
    () => [
      { id: 'image', label: t('image') },
      { id: 'title', label: t('title') },
      { id: 'excerpt', label: t('excerpt') },
      { id: 'donated', label: t('donated'), width: 100 },
      { id: 'goal', label: t('goal'), width: 100 },
      { id: 'status', label: t('status') }
    ],
    []
  )

  const handleProjects = useCallback(() => {
    const data = []
    projects.forEach((project: IProject, index: number) => {
      data.push({
        image: <Image loader={() => project.image} src={project.image} alt={project.title} width={48} height={48} unoptimized={true} />,
        title: (
          <Link href={`/projects/${project.slug}`}>
            <a target='_blank' rel='noreferrer noopener' className='link'>
              {project.title}
            </a>
          </Link>
        ),
        excerpt: project.excerpt,
        donated:
          contractsData[index]?.project?.raisedAmount === undefined ? (
            <BeatLoader color='#d21242' loading={true} size={5} />
          ) : (
            <>
              <Image src='/img/tron-black.png' width={14} height={14} /> {contractsData[index]?.project?.raisedAmount}
            </>
          ),
        goal: (
          <>
            <Image src='/img/tron-black.png' width={14} height={14} /> {fromSun(project.goal)}
          </>
        ),
        status:
          contractsData[index]?.project?.stage === undefined ? (
            <BeatLoader color='#d21242' loading={true} size={5} />
          ) : (
            <Tooltip
              title={t(
                contractsData[index]?.project?.stage === StageEnum.PENDING
                  ? 'project.activationIsNeeded'
                  : contractsData[index]?.project?.stage === StageEnum.ACTIVE
                  ? 'project.isLiveNow'
                  : 'project.hasEnded'
              )}
            >
              <FontAwesomeIcon
                icon={
                  contractsData[index]?.project?.stage === StageEnum.PENDING
                    ? faListCheck
                    : contractsData[index]?.project?.stage === StageEnum.ACTIVE
                    ? faClock
                    : faFlagCheckered
                }
                className={
                  contractsData[index]?.project?.stage === StageEnum.PENDING
                    ? 'color-warning'
                    : contractsData[index]?.project?.stage === StageEnum.ACTIVE
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
  }, [projects, contractsData])

  useEffect(() => {
    handleProjects()
  }, [projects, contractsData])

  return (
    <section className='section-1'>
      <div className='container'>
        <div className='row'>
          <StickyHeadTable columns={columns} rows={rows} />
        </div>
      </div>
    </section>
  )
}

export default ProjectsComponent

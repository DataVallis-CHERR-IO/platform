import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'
import StickyHeadTable from '../../themes/components/data/sticky-head.table'
import { IProject } from '../../interfaces/api'
import { fromSun } from '../../utils'

interface IProjectsComponentProps {
  projects?: IProject[]
}

const ProjectsComponent: React.FC<IProjectsComponentProps> = ({ projects }) => {
  const { t } = useTranslation('common')
  const [rows, setRows] = useState<any[]>([])
  const columns = useMemo(
    () => [
      { id: 'image', label: t('image') },
      { id: 'title', label: t('title') },
      { id: 'excerpt', label: t('excerpt') },
      { id: 'goal', label: t('goal') }
    ],
    []
  )

  const handleProjects = useCallback(() => {
    const data = []
    for (const project of projects) {
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
        goal: (
          <>
            <Image src='/img/tron-black.png' width={14} height={14} /> {fromSun(project.goal)}
          </>
        )
      })
    }

    setRows(data)
  }, [projects])

  useEffect(() => {
    handleProjects()
  }, [projects])

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

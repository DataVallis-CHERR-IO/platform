import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'
import StickyHeadTable from '../../themes/components/data/sticky-head.table'
import { IProject } from '../../interfaces/api'
import { fromSun } from '../../utils'
// import { useQuery } from 'react-query'
// import { apolloClient } from '../../clients/graphql'
// import { QUERY_PROJECT_MEDIA } from '../../constants/queries/database/project-media'
// import { MediaTypeEnum } from '../../enums/media-type.enum'
// import { useTronWebContext } from '../../contexts/tronweb/provider'
// import useContractData from '../../hooks/use-contract-data'

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
      { id: 'stage', label: t('stage') },
      { id: 'goal', label: t('goal') }
    ],
    []
  )
  const contractsData = []
  //
  // projects.forEach((project: IProject, index: number) => {
  //   const { data: contractData } = useContractData({
  //     contractAddress: project.contractAddress,
  //     data: { project: ['getData'] }
  //   })
  //
  //   contractsData[index] = contractData
  // })

  // const getContractData = (contractAddress: string) => {
  //   return useQuery(
  //     ['contractData'],
  //     async () => {
  //       const contract = await tronWeb.contract().at(contractAddress)
  //       const data = await contract.getData().call()
  //
  //       console.log(data)
  //
  //       return {}
  //     },
  //     {
  //       onError: error => {
  //         console.log('❌ GraphQL error (query media): ', error)
  //       }
  //     }
  //   )
  // }

  const handleProjects = useCallback(() => {
    const data = []
    projects.forEach((project: IProject) => {
      // const { data: contractData, isLoading } = getContractData(project.contractAddress)
      // console.log(contractsData[index])
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
        stage: <>1</>,
        // stage: <>{contractsData[index]?.project?.stage}</>,
        goal: (
          <>
            <Image src='/img/tron-black.png' width={14} height={14} /> {fromSun(project.goal)}
          </>
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

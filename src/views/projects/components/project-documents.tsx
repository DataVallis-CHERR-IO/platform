import React, { useEffect, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import { useQuery } from 'react-query'
import { apolloClient } from '../../../clients/graphql'
import { QUERY_PROJECT_DOCUMENTS } from '../../../constants/queries/moralis/project-document'
import { Loading } from '@web3uikit/core'
import { IProjectDocument } from '../../../interfaces/api'

interface IProjectDocumentsProps {
  projectId: string
}

const ProjectDocuments: React.FC<IProjectDocumentsProps> = ({ projectId }) => {
  const { t } = useTranslation('common')
  const [projectDocuments, setProjectDocuments] = useState<IProjectDocument[]>([])

  const { data, isLoading } = useQuery(
    ['projectDocuments'],
    async () => {
      return (
        await apolloClient.query({
          query: QUERY_PROJECT_DOCUMENTS,
          variables: {
            projectId
          }
        })
      ).data.projectDocuments
    },
    {
      onError: error => {
        console.log('❌ GraphQL error (query subscribers): ', error)
      }
    }
  )

  useEffect(() => {
    !data || setProjectDocuments(data)
  }, [data])

  return (
    <section className='section-3 pt-0 pb-0'>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-12'>
            <h2 className='c-gray'>{t('documents')}</h2>
            <div className='documents-list'>
              {!isLoading ? (
                projectDocuments.map((projectDocument: IProjectDocument) => (
                  <React.Fragment key={projectDocument._id}>
                    <div className='document-item clearfix'>
                      <div className='document-icon'>
                        <Image src={projectDocument.icon} alt={projectDocument.format} width={22} height={28} />
                      </div>
                      <div className='document-abbr text-uppercase'>{projectDocument.format}</div>
                      <div className='document-title'>{projectDocument.title}</div>
                      <div className='document-button'>
                        <div className='btn'>{t('preview')}</div>
                      </div>
                    </div>
                  </React.Fragment>
                ))
              ) : (
                <div>
                  <Loading size={12} spinnerColor='#000000' />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProjectDocuments

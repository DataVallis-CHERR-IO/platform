import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'
import { IProjectMedia } from '../../../interfaces/api'
import { useQuery } from 'react-query'
import { apolloClient } from '../../../clients/graphql'
import { QUERY_PROJECT_MEDIA } from '../../../constants/queries/moralis/project-media'
import { Loading } from '@web3uikit/core'

interface IProjectMediaProps {
  projectId: string
}

const ProjectMedia: React.FC<IProjectMediaProps> = ({ projectId }) => {
  const { t } = useTranslation('common')
  const [projectMedia, setProjectMedia] = useState<IProjectMedia[]>([])

  const { data, isLoading } = useQuery(
    ['projectMedia'],
    async () => {
      return (
        await apolloClient.query({
          query: QUERY_PROJECT_MEDIA,
          variables: {
            projectId
          }
        })
      ).data.projectMedia
    },
    {
      onError: error => {
        console.log('❌ GraphQL error (query subscribers): ', error)
      }
    }
  )

  useEffect(() => {
    !data || setProjectMedia(data)
  }, [data])

  return (
    <section className='section-3 pt-0'>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-12'>
            <h2 className='c-gray'>{t('gallery')}</h2>
            <div className='popup-gallery' data-aos='fade-up' data-aos-delay={300}>
              {!isLoading ? (
                projectMedia.map((media: IProjectMedia) => (
                  <React.Fragment key={media._id}>
                    <div>
                      <Image loader={() => media.image} src={media.image} alt={media.title} width={341} height={341} />
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

export default ProjectMedia

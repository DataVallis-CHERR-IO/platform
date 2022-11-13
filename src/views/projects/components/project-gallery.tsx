import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import { IProjectMedia } from '../../../interfaces/api'
import { useQuery } from 'react-query'
import { apolloClient } from '../../../clients/graphql'
import { QUERY_PROJECT_MEDIA } from '../../../constants/queries/database/project-media'
import { FadeLoader } from 'react-spinners'
import { MediaTypeEnum } from '../../../enums/media-type.enum'

interface IProjectMediaProps {
  projectId: number
}

const ProjectGallery: React.FC<IProjectMediaProps> = ({ projectId }) => {
  const { t } = useTranslation('common')

  const { data: projectMedia, isLoading } = useQuery(
    ['projectMedia'],
    async () => {
      return (
        await apolloClient.query({
          query: QUERY_PROJECT_MEDIA,
          variables: {
            where: {
              projectId,
              mediaTypeId: MediaTypeEnum.IMAGE
            }
          }
        })
      ).data.projectMedia
    },
    {
      onError: error => {
        console.log('❌ GraphQL error (query media): ', error)
      }
    }
  )

  return (
    <section className='section-3 pt-0'>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-12'>
            <h2 className='c-gray'>{t('gallery')}</h2>
            <div className='popup-gallery' data-aos='fade-up' data-aos-delay={300}>
              {!isLoading ? (
                projectMedia.map((media: IProjectMedia) => (
                  <React.Fragment key={media.id}>
                    <img alt={media.name} src={media.path} width={341} />
                  </React.Fragment>
                ))
              ) : (
                <div>
                  <FadeLoader color='#CA354C' loading={isLoading} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProjectGallery

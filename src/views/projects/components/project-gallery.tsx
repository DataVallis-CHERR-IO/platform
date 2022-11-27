import React, { useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import ImageLightbox from '../../../themes/components/lightbox/image.lightbox'
import { useQuery } from 'react-query'
import { apolloClient } from '../../../clients/graphql'
import { QUERY_PROJECT_MEDIA } from '../../../constants/queries/database/project-media'
import { IProjectMedia } from '../../../interfaces/api'
import { MediaTypeEnum } from '../../../enums/media-type.enum'

interface IProjectMediaProps {
  projectId: number
}

const ProjectGallery: React.FC<IProjectMediaProps> = ({ projectId }) => {
  const { t } = useTranslation('common')
  const [openImageLightbox, setOpenImageLightbox] = useState<boolean>(false)
  const [images, setImages] = useState<string[]>([])

  const { data: projectMedia } = useQuery(
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

  if (projectMedia?.length === 0) return

  const handleLightboxImagesOnClick = () => {
    setImages([projectMedia.map((media: IProjectMedia) => media.path)][0])
    setOpenImageLightbox(true)
  }

  return (
    <>
      <section className='section-3 pt-0'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-12'>
              <h2 className='c-gray'>{t('gallery')}</h2>
              <div className='popup-gallery' data-aos='fade-up' data-aos-delay={300}>
                {!!projectMedia?.length &&
                  projectMedia.map((media: IProjectMedia) => (
                    <React.Fragment key={media.id}>
                      <img alt={media.name} src={media.path} width={341} style={{ marginRight: '24px' }} onClick={handleLightboxImagesOnClick} />
                    </React.Fragment>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <ImageLightbox images={images} open={openImageLightbox} onClose={() => setOpenImageLightbox(false)} />
    </>
  )
}

export default ProjectGallery

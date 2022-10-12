import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'
import { IProjectImage } from '../../../interfaces/api'
import { useQuery } from 'react-query'
import { apolloClient } from '../../../clients/graphql'
import { QUERY_CAMPAIGN_IMAGES } from '../../../constants/queries/moralis/project-image'
import { Loading } from '@web3uikit/core'

interface IProjectImageProps {
  projectId: string
}

const ProjectImages: React.FC<IProjectImageProps> = ({ projectId }) => {
  const { t } = useTranslation('common')
  const [projectImages, setProjectImages] = useState<IProjectImage[]>([])

  const { data, isLoading } = useQuery(
    ['projectImages'],
    async () => {
      return (
        await apolloClient.query({
          query: QUERY_CAMPAIGN_IMAGES,
          variables: {
            campaignId: projectId
          }
        })
      ).data.campaignImages
    },
    {
      onError: error => {
        console.log('❌ GraphQL error (query subscribers): ', error)
      }
    }
  )

  useEffect(() => {
    if (data) {
      setProjectImages(data)
    }
  }, [data])

  return (
    <section className='section-3 pt-0'>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-12'>
            <h2 className='c-gray'>{t('gallery')}</h2>
            <div className='popup-gallery' data-aos='fade-up' data-aos-delay={300}>
              {!isLoading ? (
                projectImages.map((projectImage: IProjectImage) => (
                  <React.Fragment key={projectImage._id}>
                    <div>
                      <Image loader={() => projectImage.image} src={projectImage.image} alt={projectImage.title} width={341} height={341} />
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

export default ProjectImages

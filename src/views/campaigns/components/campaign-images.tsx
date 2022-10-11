import React, { useEffect, useState } from 'react'
import { IProjectImage } from '../../../interfaces/api'
import { ICampaignImageProps } from '../../../interfaces/components'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import { useQuery } from 'react-query'
import { apolloClient } from '../../../clients/graphql'
import { QUERY_CAMPAIGN_IMAGES } from '../../../constants/queries/moralis/campaign-image'
import { Loading } from '@web3uikit/core'

const CampaignImages: React.FC<ICampaignImageProps> = ({ campaignId }) => {
  const { t } = useTranslation()
  const [campaignImages, setCampaignImages] = useState<IProjectImage[]>([])

  const { data, isLoading } = useQuery(
    ['campaignImages'],
    async () => {
      return (
        await apolloClient.query({
          query: QUERY_CAMPAIGN_IMAGES,
          variables: {
            campaignId: campaignId
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
      setCampaignImages(data)
    }
  }, [data])

  return (
    <section className='section-3 pt-0'>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-12'>
            <h2 className='c-gray'>{t('common:gallery')}</h2>
            <div className='popup-gallery' data-aos='fade-up' data-aos-delay={300}>
              {!isLoading ? (
                campaignImages.map((campaignImage: IProjectImage) => (
                  <React.Fragment key={campaignImage._id}>
                    <div>
                      <Image loader={() => campaignImage.image} src={campaignImage.image} alt={campaignImage.title} width={341} height={341} />
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

export default CampaignImages

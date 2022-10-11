import React, { useEffect, useState } from 'react'
import { IProjectDocument } from '../../../interfaces/api'
import { ICampaignDocumentProps } from '../../../interfaces/components'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import { useQuery } from 'react-query'
import { apolloClient } from '../../../clients/graphql'
import { QUERY_CAMPAIGN_DOCUMENTS } from '../../../constants/queries/moralis/campaign-document'
import { Loading } from '@web3uikit/core'

const CampaignDocuments: React.FC<ICampaignDocumentProps> = ({ campaignId }) => {
  const { t } = useTranslation()
  const [campaignDocuments, setCampaignDocuments] = useState<IProjectDocument[]>([])

  const { data, isLoading } = useQuery(
    ['campaignDocuments'],
    async () => {
      return (
        await apolloClient.query({
          query: QUERY_CAMPAIGN_DOCUMENTS,
          variables: {
            campaignId: campaignId
          }
        })
      ).data.campaignDocuments
    },
    {
      onError: error => {
        console.log('❌ GraphQL error (query subscribers): ', error)
      }
    }
  )

  useEffect(() => {
    if (data) {
      setCampaignDocuments(data)
    }
  }, [data])

  return (
    <section className='section-3 pt-0 pb-0'>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-12'>
            <h2 className='c-gray'>{t('common:documents')}</h2>
            <div className='documents-list'>
              {!isLoading ? (
                campaignDocuments.map((campaignDocument: IProjectDocument) => (
                  <React.Fragment key={campaignDocument._id}>
                    <div className='document-item clearfix'>
                      <div className='document-icon'>
                        <Image src={campaignDocument.icon} alt={campaignDocument.format} width={22} height={28} />
                      </div>
                      <div className='document-abbr text-uppercase'>{campaignDocument.format}</div>
                      <div className='document-title'>{campaignDocument.title}</div>
                      <div className='document-button'>
                        <div className='btn'>{t('common:preview')}</div>
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

export default CampaignDocuments

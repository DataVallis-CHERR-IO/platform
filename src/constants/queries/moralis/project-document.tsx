import { gql } from '@apollo/client'

export const QUERY_CAMPAIGN_DOCUMENTS = gql`
  query CampaignDocuments($campaignId: String) {
    campaignDocuments(campaignId: $campaignId) {
      _id
      title
      path
      icon
      format
    }
  }
`

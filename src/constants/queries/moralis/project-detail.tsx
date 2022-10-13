import { gql } from '@apollo/client'

export const QUERY_CAMPAIGN_DETAIL = gql`
  query CampaignDetail($campaignId: String) {
    campaignDetail(campaignId: $campaignId) {
      _id
      requirements
      description
    }
  }
`

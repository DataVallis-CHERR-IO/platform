import { gql } from '@apollo/client'

export const QUERY_CAMPAIGN_DETAIL = gql`
  query campaignDetail($campaignId: String) {
    campaignDetail(campaignId: $campaignId) {
      _id
      requirements
      description
    }
  }
`

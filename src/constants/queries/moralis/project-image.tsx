import { gql } from '@apollo/client'

export const QUERY_CAMPAIGN_IMAGES = gql`
  query CampaignImages($campaignId: String) {
    campaignImages(campaignId: $campaignId) {
      _id
      title
      path
      image
    }
  }
`

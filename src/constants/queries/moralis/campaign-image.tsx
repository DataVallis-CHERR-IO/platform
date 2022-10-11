import { gql } from '@apollo/client'

export const QUERY_CAMPAIGN_IMAGES = gql`
  query campaignImages($campaignId: String) {
    campaignImages(campaignId: $campaignId) {
      _id
      title
      path
      image
    }
  }
`

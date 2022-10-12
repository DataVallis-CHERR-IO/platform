import { gql } from '@apollo/client'

export const QUERY_CAMPAIGNS = gql`
  query campaigns {
    campaigns {
      _id
      title
      description
      slug
      contractAddress
      image
      goal
      isHighlightedProject
      statusId
      startedAt
      endedAt
    }
  }
`

export const QUERY_CAMPAIGN = gql`
  query campaign($slug: String) {
    campaign(slug: $slug) {
      _id
      title
      description
      slug
      contractAddress
      image
      goal
      isHighlightedProject
      statusId
      startedAt
      endedAt
    }
  }
`

import { gql } from '@apollo/client'

export const QUERY_PROJECTS = gql`
  query projects {
    projects {
      _id
      title
      description
      slug
      contractAddress
      image
      goal
      isHighlighted
      statusId
      startedAt
      endedAt
    }
  }
`

export const QUERY_PROJECT = gql`
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

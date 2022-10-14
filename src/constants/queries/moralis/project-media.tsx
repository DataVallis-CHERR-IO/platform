import { gql } from '@apollo/client'

export const QUERY_PROJECT_MEDIA = gql`
  query ProjectMedia($projectId: String!) {
    projectMedia(projectId: $projectId) {
      _id
      title
      path
      image
    }
  }
`

import { gql } from '@apollo/client'

export const QUERY_PROJECT_DOCUMENTS = gql`
  query ProjectDocuments($projectId: String!) {
    projectDocuments(projectId: $projectId) {
      _id
      title
      path
      icon
      format
    }
  }
`

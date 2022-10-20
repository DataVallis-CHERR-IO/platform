import { gql } from '@apollo/client'

export const QUERY_PROJECT_MEDIA = gql`
  query ProjectMedia($projectId: String!) {
    projectMedia(projectId: $projectId) {
      _id
      type
      title
      path
      format
    }
  }
`

export const MUTATION_CREATE_PROJECT_MEDIA = gql`
  mutation CreateProjectMedia($projectId: String!, $type: String!, $title: String!, $format: String!, $content: String!) {
    createProjectMedia(projectId: $projectId, type: $type, title: $title, format: $format, content: $content)
  }
`

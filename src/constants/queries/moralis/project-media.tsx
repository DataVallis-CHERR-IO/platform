import { gql } from '@apollo/client'

export const QUERY_PROJECT_MEDIA = gql`
  query ProjectMedia($projectId: String!) {
    projectMedia(projectId: $projectId) {
      _id
      title
      path
      mediaTypeId
    }
  }
`

export const MUTATION_CREATE_PROJECT_MEDIA = gql`
  mutation CreateProjectMedia($projectId: String!, $title: String!, $content: String!, $mediaTypeId: Int!) {
    createProjectMedia(projectId: $projectId, title: $title, content: $content, mediaTypeId: $mediaTypeId) {
      _id
      path
    }
  }
`

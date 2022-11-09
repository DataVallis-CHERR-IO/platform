import { gql } from '@apollo/client'

export const QUERY_PROJECT_MEDIA = gql`
  query ProjectMedia($where: Where!) {
    projectMedia(where: $where) {
      id
      projectId
      mediaTypeId
      name
      path
    }
  }
`

export const MUTATION_CREATE_PROJECT_MEDIA = gql`
  mutation CreateProjectMedia($projectId: Int!, $mediaTypeId: Int!, $name: String!, $path: String!) {
    createProjectMedia(projectId: $projectId, mediaTypeId: $mediaTypeId, name: $name, path: $path)
  }
`

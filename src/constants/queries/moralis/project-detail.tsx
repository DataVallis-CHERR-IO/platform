import { gql } from '@apollo/client'

export const QUERY_PROJECT_DETAIL = gql`
  query ProjectDetail($projectId: String!) {
    projectDetail(projectId: $projectId) {
      _id
      requirements
      description
    }
  }
`

export const MUTATION_CREATE_PROJECT_DETAIL = gql`
  mutation createProjectDetail($projectId: String!, $description: String!, $requirements: String) {
    createProjectDetail(projectId: $projectId, description: $description, requirements: $requirements) {
      _id
      requirements
      description
    }
  }
`

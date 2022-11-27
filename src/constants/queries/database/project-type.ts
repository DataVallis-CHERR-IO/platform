import { gql } from '@apollo/client'

export const QUERY_PROJECT_TYPES = gql`
  query ProjectTypes {
    projectTypes {
      id
      lkName
    }
  }
`

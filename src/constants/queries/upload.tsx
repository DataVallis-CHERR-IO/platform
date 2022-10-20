import { gql } from '@apollo/client'

export const MUTATION_UPLOAD = gql`
  mutation Upload($title: String!, $content: String!) {
    upload(title: $title, content: $content)
  }
`

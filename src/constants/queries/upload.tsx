import { gql } from '@apollo/client'

export const MUTATION_UPLOAD = gql`
  mutation Upload($title: String!, $extension: String!, $content: String!, $isObject: Boolean) {
    upload(title: $title, extension: $extension, content: $content, isObject: $isObject)
  }
`

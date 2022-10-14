import { gql } from '@apollo/client'

export const MUTATION_SUBSCRIBE = gql`
  mutation Subscribe($email: String!) {
    subscribe(email: $email)
  }
`

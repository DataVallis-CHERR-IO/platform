import { gql } from '@apollo/client'

export const MUTATION_NEW_PROJECT = gql`
  mutation NewProject($contractAddress: String!, $goal: Float!) {
    newProject(contractAddress: $contractAddress, goal: $goal)
  }
`

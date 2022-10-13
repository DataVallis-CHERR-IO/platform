import { gql } from '@apollo/client'

export const QUERY_PROJECTS = gql`
  query Projects {
    projects {
      _id
      title
      excerpt
      slug
      image
      goal
      contractAddress
      statusId
      startedAt
      endedAt
    }
  }
`

export const QUERY_PROJECT = gql`
  query Project($slug: String) {
    project(slug: $slug) {
      _id
      title
      excerpt
      slug
      image
      goal
      contractAddress
      statusId
      startedAt
      endedAt
    }
  }
`

export const MUTATION_CREATE_PROJECT = gql`
  mutation createProject(
    $title: String!
    $excerpt: String!
    $slug: String!
    $goal: Float!
    $image: String!
    $contractAddress: String!
    $statusId: Int
    $startedAt: String
  ) {
    createProject(
      title: $title
      excerpt: $excerpt
      slug: $slug
      goal: $goal
      image: $image
      contractAddress: $contractAddress
      statusId: $statusId
      startedAt: $startedAt
    ) {
      _id
      title
      excerpt
      slug
      image
      goal
      contractAddress
      statusId
      startedAt
    }
  }
`

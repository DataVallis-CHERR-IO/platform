import { gql } from '@apollo/client'

export const QUERY_PROJECTS = gql`
  query Projects($sort: Sort, $skip: Int, $limit: Int) {
    projects(sort: $sort, skip: $skip, limit: $limit) {
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
  query Project($slug: String!) {
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

export const SUBSCRIPTION_PROJECT_CREATED = gql`
  subscription ProjectCreated {
    projectCreated {
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

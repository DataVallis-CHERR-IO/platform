import { gql } from '@apollo/client'

export const QUERY_PROJECTS = gql`
  query Projects($skip: Int, $take: Int) {
    projects(skip: $skip, take: $take) {
      id
      title
      excerpt
      slug
      image
      contractAddress
      goal
    }
  }
`

export const QUERY_PROJECT = gql`
  query Project($where: WhereProjectInput!) {
    project(where: $where) {
      id
      title
      excerpt
      description
      slug
      image
      contractAddress
      goal
    }
  }
`

export const MUTATION_CREATE_PROJECT = gql`
  mutation createProject(
    $title: String!
    $excerpt: String!
    $description: String!
    $slug: String!
    $image: String!
    $contractAddress: String!
    $goal: String!
    $duration: Int!
    $projectTypes: [ProjectTypeInput!]!
  ) {
    createProject(
      title: $title
      excerpt: $excerpt
      description: $description
      slug: $slug
      image: $image
      contractAddress: $contractAddress
      goal: $goal
      duration: $duration
      projectTypes: $projectTypes
    ) {
      id
      title
      excerpt
      description
      slug
      image
      contractAddress
      goal
      duration
    }
  }
`

export const SUBSCRIPTION_PROJECT_CREATED = gql`
  subscription ProjectCreated {
    projectCreated {
      id
      title
      excerpt
      slug
      image
      contractAddress
    }
  }
`

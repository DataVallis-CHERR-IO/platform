import { gql } from '@apollo/client'

export const QUERY_PROJECTS = gql`
  query Projects($sort: Sort, $skip: Int, $limit: Int) {
    projects(sort: $sort, skip: $skip, limit: $limit) {
      _id
      title
      excerpt
      slug
      image
      contractAddress
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
      contractAddress
    }
  }
`

export const MUTATION_CREATE_PROJECT = gql`
  mutation createProject($title: String!, $excerpt: String!, $slug: String!, $image: String!, $contractAddress: String!) {
    createProject(title: $title, excerpt: $excerpt, slug: $slug, image: $image, contractAddress: $contractAddress) {
      _id
      title
      excerpt
      slug
      image
      contractAddress
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
      contractAddress
    }
  }
`

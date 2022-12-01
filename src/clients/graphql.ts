import { ErrorResponse, onError } from '@apollo/client/link/error'
import { GraphQLError } from 'graphql'
import { ApolloClient, DefaultOptions, HttpLink, InMemoryCache, split } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'

const httpLink = new HttpLink({
  uri: process.env.HTTPS_PROVIDER
})

const wsLink =
  typeof window !== 'undefined'
    ? new GraphQLWsLink(
        createClient({
          url: process.env.WSS_PROVIDER
        })
      )
    : null

const errorLink = onError(({ graphQLErrors }: ErrorResponse) => {
  if (!!graphQLErrors?.length) {
    graphQLErrors.map((graphQLError: GraphQLError) => {
      console.log('❌ GraphQL error: ', graphQLError.message)
    })
  }
})

const splitLink =
  typeof window !== 'undefined'
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query)
          return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
        },
        wsLink,
        httpLink
      )
    : httpLink

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    nextFetchPolicy: 'no-cache',
    errorPolicy: 'ignore'
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  }
}

export const apolloClient = new ApolloClient({
  link: errorLink.concat(splitLink),
  ssrMode: typeof window === 'undefined',
  cache: new InMemoryCache({ addTypename: false }),
  defaultOptions
})

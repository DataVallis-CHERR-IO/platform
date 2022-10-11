import { ErrorResponse, onError } from '@apollo/client/link/error'
import { GraphQLError } from 'graphql'
import { ApolloClient, DefaultOptions, HttpLink, InMemoryCache } from '@apollo/client'

const errorLink = onError(({ graphQLErrors }: ErrorResponse) => {
  if (!!graphQLErrors?.length) {
    graphQLErrors.map((graphQLError: GraphQLError) => {
      console.log('❌ GraphQL error: ', graphQLError.message)
    })
  }
})

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
  link: errorLink.concat(
    new HttpLink({
      uri: process.env.GRAPHQL_URL
    })
  ),
  cache: new InMemoryCache(),
  defaultOptions
})

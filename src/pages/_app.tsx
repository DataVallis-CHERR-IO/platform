import type { AppProps } from 'next/app'
import App from 'next/app'
import React from 'react'
import I18nProvider from 'next-translate/I18nProvider'
import RouteGuard from '../guards/route.guard'
import { Session } from 'next-auth'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ToastContainer } from 'react-toastify'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { getSession, SessionProvider } from 'next-auth/react'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from '../clients/graphql'
import 'react-toastify/dist/ReactToastify.css'
import '../../public/vendor/bootstrap/css/bootstrap.min.css'
import '../../public/css/styles.min.css'

const { provider, webSocketProvider } = configureChains(
  [chain[process.env.WAGMI_CHAIN]],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: process.env.HTTPS_PROVIDER,
        webSocket: process.env.WSSS_PROVIDER
      })
    })
  ]
)

const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: true
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnWindowFocus: false
    }
  }
})

const MyApp = ({ Component, pageProps }: AppProps<{ session: Session }>) => {
  return (
    <I18nProvider lang='en'>
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          <WagmiConfig client={client}>
            <SessionProvider session={pageProps.session} refetchInterval={0}>
              <RouteGuard>
                <Component {...pageProps} />
                <ToastContainer />
              </RouteGuard>
            </SessionProvider>
          </WagmiConfig>
        </QueryClientProvider>
      </ApolloProvider>
    </I18nProvider>
  )
}

MyApp.getInitialProps = async appContext => {
  const appProps = await App.getInitialProps(appContext)
  appProps.pageProps.session = await getSession(appContext)

  return { ...appProps }
}

export default MyApp

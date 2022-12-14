import type { AppProps } from 'next/app'
import App from 'next/app'
import React from 'react'
import I18nProvider from 'next-translate/I18nProvider'
import RouteGuard from '../guards/route.guard'
import TronWebProvider from '../contexts/tronweb'
import Layout from '../components/pages/layout'
import { Session } from 'next-auth'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ToastContainer } from 'react-toastify'
import { getSession, SessionProvider } from 'next-auth/react'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from '../clients/graphql'
import { configureChains, createClient, defaultChains, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import 'react-toastify/dist/ReactToastify.css'
import '../../public/vendor/bootstrap/css/bootstrap.min.css'
import '../../public/css/styles.min.css'

const { provider, webSocketProvider } = configureChains(defaultChains, [publicProvider()])

const client = createClient({
  provider,
  webSocketProvider
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
            <TronWebProvider>
              <SessionProvider session={pageProps.session} refetchInterval={0}>
                <RouteGuard>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                  <ToastContainer />
                </RouteGuard>
              </SessionProvider>
            </TronWebProvider>
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

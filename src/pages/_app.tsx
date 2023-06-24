import App from 'next/app'
import React, { useEffect, useState } from 'react'
import I18nProvider from 'next-translate/I18nProvider'
import RouteGuard from '../guards/route.guard'
import Layout from '../components/pages/layout'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ToastContainer } from 'react-toastify'
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from '../clients/graphql'
import 'react-18-image-lightbox/style.css'
import 'react-toastify/dist/ReactToastify.css'
import '../../public/vendor/bootstrap/css/bootstrap.min.css'
import '../../public/css/styles.min.css'

const chains = [sepolia]
const { provider, webSocketProvider } = configureChains(chains, [walletConnectProvider({ projectId: process.env.WALLET_CONNECT_PROJECT_ID })])
const client = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    projectId: process.env.WALLET_CONNECT_PROJECT_ID,
    version: '2',
    appName: 'web3Modal',
    chains
  }),
  provider,
  webSocketProvider
})
const ethereumClient = new EthereumClient(client, chains)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnWindowFocus: false
    }
  }
})

const MyApp = ({ Component, pageProps }) => {
  const [showChild, setShowChild] = useState<boolean>(false)

  useEffect(() => {
    setShowChild(true)
  }, [])

  if (!showChild) return null
  if (typeof window === 'undefined') return <></>

  return (
    <>
      <I18nProvider lang='en'>
        <ApolloProvider client={apolloClient}>
          <QueryClientProvider client={queryClient}>
            <WagmiConfig client={client}>
              <Layout>
                <RouteGuard>
                  <Component {...pageProps} />
                  <ToastContainer />
                </RouteGuard>
              </Layout>
            </WagmiConfig>
          </QueryClientProvider>
        </ApolloProvider>
      </I18nProvider>
      <Web3Modal projectId={process.env.WALLET_CONNECT_PROJECT_ID} ethereumClient={ethereumClient} />
    </>
  )
}

MyApp.getInitialProps = async appContext => {
  return App.getInitialProps(appContext)
}

export default MyApp

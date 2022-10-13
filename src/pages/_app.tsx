import type { AppProps } from 'next/app'
import React from 'react'
import I18nProvider from 'next-translate/I18nProvider'
import { Session } from 'next-auth'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ToastContainer } from 'react-toastify'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { SessionProvider } from 'next-auth/react'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
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
      <QueryClientProvider client={queryClient}>
        <WagmiConfig client={client}>
          <SessionProvider session={pageProps.session} refetchInterval={0}>
            <Component {...pageProps} />
            <ToastContainer />
          </SessionProvider>
        </WagmiConfig>
      </QueryClientProvider>
    </I18nProvider>
  )
}

export default MyApp

import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { SessionProvider } from 'next-auth/react'
import { MoralisProvider } from 'react-moralis'
import { Session } from 'next-auth'
import { QueryClient, QueryClientProvider } from 'react-query'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import React from 'react'
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

const wagmiClient = createClient({
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
    <QueryClientProvider client={queryClient}>
      <MoralisProvider appId={process.env.NEXT_PUBLIC_APP_ID} serverUrl={process.env.NEXT_PUBLIC_SERVER_URL}>
        <WagmiConfig client={wagmiClient}>
          <SessionProvider session={pageProps.session} refetchInterval={0}>
            <Component {...pageProps} />
            <ToastContainer />
          </SessionProvider>
        </WagmiConfig>
      </MoralisProvider>
    </QueryClientProvider>
  )
}

export default MyApp

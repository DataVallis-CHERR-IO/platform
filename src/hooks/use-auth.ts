import useTranslation from 'next-translate/useTranslation'
import { useEffect } from 'react'
import { signIn, signOut } from 'next-auth/react'
import { notify } from '../utils/notify'
import { changeNetwork } from '../modules/change-network'
import { chain as supportedChain, useConnect, useDisconnect, useSignMessage } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { tokenOptions } from '../config'

interface IUseConnectRes {
  connect?: any
  disconnect?: any
}

const useAuth = (): IUseConnectRes => {
  const { t } = useTranslation('common')
  const { connectAsync } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const { signMessageAsync } = useSignMessage()

  const connect = async () => {
    const ethereum = window.ethereum

    if (!ethereum) {
      notify(t('metamaskInstanceMissing'), 'warning')
      return
    }

    const { account: address, chain } = await connectAsync({
      connector: new MetaMaskConnector({
        chains: [supportedChain[tokenOptions.wagmiChain]]
      })
    })

    if (chain.unsupported) {
      await disconnect()
      await changeNetwork()

      return
    }

    try {
      await signMessageAsync({ message: t('metamaskSignMessage') })
      await signIn('credentials', { address })
      window.location.reload()
    } catch (error) {
      await disconnect()
    }
  }

  const disconnect = async () => {
    await disconnectAsync()
    await signOut()
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', async () => {
        await disconnect()
        window.location.reload()
      })
      window.ethereum.on('accountsChanged', async () => {
        await disconnect()
        window.location.reload()
      })
    }
  }, [])

  return {
    connect,
    disconnect
  }
}

export default useAuth

import useTranslation from 'next-translate/useTranslation'
import { useCallback, useEffect } from 'react'
import { signIn, signOut } from 'next-auth/react'
import { notify } from '../utils/notify'
import { tronNetworkOptions } from '../config'

interface IUseConnectRes {
  connect?: any
  disconnect?: any
}

const useConnect = (): IUseConnectRes => {
  const { t } = useTranslation('common')
  const tronWeb = (window as any).tronWeb
  const tronLink = (window as any).tronLink

  const connect = useCallback(async (): Promise<boolean> => {
    !tronLink || (await tronLink.request({ method: 'tron_requestAccounts' }))

    if (!tronWeb) {
      notify(t('tronWebInstanceMissing'), 'warning')
      return false
    }

    if (tronWeb?.eventServer?.host !== tronNetworkOptions.event) {
      notify(t('tronWebInvalidNetwork', { network: tronNetworkOptions.name }), 'warning')
      return false
    }

    !tronLink.ready || (await handleConnect())

    return true
  }, [])

  const handleConnect = useCallback(async () => {
    await signIn('credentials', { address: tronWeb.defaultAddress.base58 })
  }, [])

  const disconnect = useCallback(async () => {
    await signOut()
  }, [])

  const tronLinkEventListener = useCallback(() => {
    window.addEventListener('message', async msg => {
      const { message } = msg.data

      if (!message) return

      if (message.action === 'connect') {
        await handleConnect()
      } else if (message.action === 'accountsChanged') {
        await connect()
      } else if (message.action === 'disconnect' || message.action === 'setNode') {
        await disconnect()
      }
    })
  }, [])

  useEffect(() => {
    tronLinkEventListener()
  }, [])

  return {
    connect,
    disconnect
  }
}

export default useConnect

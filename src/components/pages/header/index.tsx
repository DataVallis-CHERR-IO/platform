import React, { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import { chain as supportedChain, useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { permalink } from '../../../constants/routes'
import { truncateAddress } from '../../../utils'
import { notify } from '../../../utils/notify'
import axios from 'axios'
import Link from 'next/link'
import Web3 from 'web3'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'

const Header: React.FC = () => {
  const { t } = useTranslation()
  const { connectAsync } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const { isConnected, address } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const [loggedIn, setLoggedIn] = useState<boolean>(false)

  const changeNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: Web3.utils.toHex(process.env.CHAIN_ID) }]
      })
    } catch (error) {
      console.error(error)
    }
  }

  const login = async () => {
    const ethereum = window.ethereum

    if (!ethereum) {
      notify(t('common:metamaskInstanceMissing'), 'warning')
      return
    }

    const { account, chain } = await connectAsync({
      connector: new MetaMaskConnector({
        chains: [supportedChain.polygonMumbai]
      })
    })

    if (chain.unsupported) {
      notify(t('common:metamaskInvalidNetwork', { chain: process.env.CHAIN }), 'warning')
      await logout()
      await changeNetwork()
      return
    }

    const userData = { address: account, chain: chain.id, network: 'evm' }
    const { data } = await axios.post(permalink.auth, userData, {
      headers: {
        'content-type': 'application/json'
      }
    })

    const message = data.message

    try {
      const signature = await signMessageAsync({ message })

      await signIn('credentials', { message, signature })

      setLoggedIn(true)
    } catch (error) {
      await logout()
    }
  }

  const logout = async () => {
    await disconnectAsync()

    setLoggedIn(false)
  }

  useEffect(() => {
    !isConnected || setLoggedIn(isConnected)

    if (window.ethereum) {
      window.ethereum.on('chainChanged', async () => {
        await logout()
        window.location.reload()
      })
      window.ethereum.on('accountsChanged', async () => {
        await logout()
        window.location.reload()
      })
    }
  }, [isConnected])

  return (
    <nav className='navbar navbar-expand-lg navbar-light fixed-top' id='mainNav'>
      <div className='container'>
        <div className='navbar-brand js-scroll-trigger'>
          <Image src='/img/logo-cherrio-white.svg' alt='Cherrio Logo' className='img-responsive logo-white' width={150} height={44} />
        </div>
        <button
          className='navbar-toggler navbar-toggler-right'
          type='button'
          data-toggle='collapse'
          data-target='#navbarResponsive'
          aria-controls='navbarResponsive'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <div id='nav-icon3'>
            <span /> <span /> <span /> <span />
          </div>
        </button>
        <div className='collapse navbar-collapse' id='navbarResponsive'>
          <ul className='navbar-nav mx-auto'>
            <li className='nav-item'>
              <Link href='/'>
                <a className='nav-link js-scroll-trigger'>{t('common:home')}</a>
              </Link>
            </li>
            <li className='nav-item'>
              <Link href='#'>
                <a className='nav-link js-scroll-trigger'>{t('common:about')}</a>
              </Link>
            </li>
            <li className='nav-item'>
              <Link href='#'>
                <a className='nav-link js-scroll-trigger'>{t('common:projects')}</a>
              </Link>
            </li>
            <li className='nav-item'>
              <Link href='#'>
                <a className='nav-link js-scroll-trigger'>{t('common:ngos')}</a>
              </Link>
            </li>
            <li className='nav-item'>
              <Link href='#'>
                <a className='nav-link js-scroll-trigger'>{t('common:contact')}</a>
              </Link>
            </li>
            {!loggedIn && (
              <li className='nav-item'>
                <Link href='#'>
                  <a className='nav-link js-scroll-trigger' onClick={() => login()}>
                    {t('common:login')}
                  </a>
                </Link>
              </li>
            )}
            {loggedIn && (
              <>
                <li className='nav-item'>
                  <Link href='#'>
                    <a className='nav-link js-scroll-trigger'>{truncateAddress(address)}</a>
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link href='#'>
                    <a className='nav-link js-scroll-trigger' onClick={() => logout()}>
                      {t('common:logout')}
                    </a>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Header

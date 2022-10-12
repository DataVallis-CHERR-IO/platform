import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'
import { signIn } from 'next-auth/react'
import { chain as supportedChain, useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { permalink } from '../../../constants/routes'
import { truncateAddress } from '../../../utils'
import { notify } from '../../../utils/notify'
import { changeNetwork } from '../../../modules/change-network'

const Header: React.FC = () => {
  const { t } = useTranslation('common')
  const { connectAsync, status } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const { isConnected, address } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const [loggedIn, setLoggedIn] = useState<boolean>(false)

  const login = async () => {
    const ethereum = window.ethereum

    if (!ethereum) {
      notify(t('metamaskInstanceMissing'), 'warning')
      return
    }

    const { account, chain } = await connectAsync({
      connector: new MetaMaskConnector({
        chains: [supportedChain.polygonMumbai]
      })
    })

    if (chain.unsupported) {
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
    !isConnected || status === 'loading' || setLoggedIn(isConnected)

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
        <div className='collapse navbar-collapse' id='navbarResponsive'>
          <ul className='navbar-nav mx-auto'>
            <li className='nav-item'>
              <Link href='/'>
                <a className='nav-link js-scroll-trigger'>{t('home.text')}</a>
              </Link>
            </li>
            <li className='nav-item'>
              <Link href='#'>
                <a className='nav-link js-scroll-trigger'>{t('projects')}</a>
              </Link>
            </li>
            <li className='nav-item'>
              <Link href='https://www.cherr.io/'>
                <a className='nav-link js-scroll-trigger'>{t('about')}</a>
              </Link>
            </li>
            {!loggedIn ? (
              <li className='nav-item'>
                <div className='nav-link js-scroll-trigger' onClick={() => login()}>
                  {t('login')}
                </div>
              </li>
            ) : (
              <>
                <li className='nav-item'>
                  <Link href='/dashboard'>
                    <a className='nav-link js-scroll-trigger'>{t('dashboard')}</a>
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link href='#'>
                    <a className='nav-link js-scroll-trigger'>{truncateAddress(address)}</a>
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link href='#'>
                    <a className='nav-link js-scroll-trigger' onClick={() => logout()}>
                      {t('logout')}
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

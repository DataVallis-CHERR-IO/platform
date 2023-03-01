import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import { Web3Button, useWeb3ModalTheme } from '@web3modal/react'
import { useAccount } from 'wagmi'

const Header: React.FC = () => {
  const { t } = useTranslation('common')
  const { isConnected } = useAccount()
  const { setTheme } = useWeb3ModalTheme()
  setTheme({
    themeMode: 'light',
    themeColor: 'blackWhite',
    themeBackground: 'gradient'
  })
  return (
    <>
      <Head>
        <title>CHERR.IO | Platform</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
        <meta name='description' content='' />
        <meta name='author' content='' />
      </Head>
      <div
        className='container'
        style={{ position: 'fixed', zIndex: '1030', right: '0', left: '0', backgroundColor: '#FFFFFF', maxWidth: 'unset', textAlign: 'center' }}
      >
        <div>CHERR.IO Alpha is currently deployed on ETH Goerli Testnet for testing purposes, therefore technical disruptions may occur.</div>
      </div>
      <nav className='navbar navbar-expand-lg navbar-light fixed-top' id='mainNav' style={{ top: '22px' }}>
        <div className='container'>
          <div className='navbar-brand js-scroll-trigger'>
            <Image src='/img/logo-cherrio-white.svg' alt='Cherrio Logo' className='img-responsive logo-white' width={150} height={44} />
          </div>
          <div className='collapse navbar-collapse' id='navbarResponsive'>
            <ul className='navbar-nav mx-auto mr-00'>
              <li className='nav-item'>
                <Link href='/'>
                  <a className='nav-link js-scroll-trigger'>{t('home.text')}</a>
                </Link>
              </li>
              <li className='nav-item'>
                <Link href='/projects'>
                  <a className='nav-link js-scroll-trigger'>{t('projects')}</a>
                </Link>
              </li>
              <li className='nav-item'>
                <Link href='https://www.cherr.io/'>
                  <a className='nav-link js-scroll-trigger'>{t('about')}</a>
                </Link>
              </li>
              {isConnected && (
                <li className='nav-item'>
                  <Link href='/dashboard'>
                    <a className='nav-link js-scroll-trigger'>{t('dashboard')}</a>
                  </Link>
                </li>
              )}
              <Web3Button />
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Header

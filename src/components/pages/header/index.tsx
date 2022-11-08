import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'
import useConnect from '../../../hooks/use-connect'
import { truncateAddress } from '../../../utils'
import { useSession } from 'next-auth/react'

const Header: React.FC = () => {
  const { t } = useTranslation('common')
  const { data: session } = useSession()
  const { connect, disconnect } = useConnect()

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
            {!session ? (
              <li className='nav-item'>
                <div className='nav-link js-scroll-trigger' onClick={connect}>
                  {t('connect')}
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
                  <div className='nav-link js-scroll-trigger'>{truncateAddress(session?.user?.name)}</div>
                </li>
                <li className='nav-item'>
                  <div className='nav-link js-scroll-trigger' onClick={disconnect}>
                    {t('disconnect')}
                  </div>
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

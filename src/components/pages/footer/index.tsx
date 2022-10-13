import React from 'react'
import moment from 'moment'
import Link from 'next/link'
import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'

const Footer: React.FC = () => {
  const { t } = useTranslation('common')

  return (
    <footer className='custom-footer'>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-12 text-center'>
            <div className='social-nav'>
              <ul>
                <li>
                  <Link href='https://www.twitter.com/CherrioPlatform'>
                    <a target='_blank' rel='noreferrer noopener'>
                      <i className='icon-social-twitter' />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href='https://medium.com/cherr-io'>
                    <a target='_blank' rel='noreferrer noopener'>
                      <i className='icon-social-medium' />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href='https://www.facebook.com/CherrioPlatform'>
                    <a target='_blank' rel='noreferrer noopener'>
                      <i className='icon-social-facebook' />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href='https://www.instagram.com/CherrioPlatform'>
                    <a target='_blank' rel='noreferrer noopener'>
                      <i className='icon-social-instagram' />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href='https://www.linkedin.com/company/11326200'>
                    <a target='_blank' rel='noreferrer noopener'>
                      <i className='icon-social-linkedin' />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href='https://t.me/CherrioPlatform'>
                    <a target='_blank' rel='noreferrer noopener' className='telegram-icon'>
                      <i className='icon-social-telegram' />
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
            <div className='logo-footer'>
              <Image src='/img/logo-cherrio.svg' alt={t('companyName')} width={225} height={65} />
            </div>
            <div className='footer-contact'>
              <Link href='mailto:info@cherr.io'>
                <a>{t('infoEmailAddress')}</a>
              </Link>
            </div>
            <div className='footer-nav'>
              <ul>
                <li className='text-uppercase'>
                  {t('domainName')} ({t('companyName')}) © {moment().format('YYYY')}
                </li>
                <li>
                  <Link href='/'>
                    <a className='text-uppercase'>{t('home.text')}</a>
                  </Link>
                </li>
                <li>
                  <Link href='#'>
                    <a className='text-uppercase'>{t('terms')}</a>
                  </Link>
                </li>
                <li>
                  <Link href='#'>
                    <a className='text-uppercase'>{t('privacyPolicy')}</a>
                  </Link>
                </li>
              </ul>
            </div>
            <p>{t('copyright')}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

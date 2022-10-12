import React from 'react'
import useTranslation from 'next-translate/useTranslation'

const Header: React.FC = () => {
  const { t } = useTranslation('common')

  return (
    <header className='pagehead'>
      <div className='header-content'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-7'>
              <h1>{t('home.header.title')}</h1>
            </div>
            <div className='col-lg-7'>
              <p className='subtitle'>{t('home.header.subtitle')}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

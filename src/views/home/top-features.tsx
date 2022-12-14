import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faMedal, faUsers, faVrCardboard } from '@fortawesome/free-solid-svg-icons'
import { faConnectdevelop } from '@fortawesome/free-brands-svg-icons'

const TopFeatures: React.FC = () => {
  const { t } = useTranslation('common')

  return (
    <section className='section-1'>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-8 mx-auto text-center'>
            <h2 className='c-red'>{t('home.topFeatures.title')}</h2>
            <p className='lead'>{t('home.topFeatures.subtitle')}</p>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <div className='row'>
              <div className='col-lg-6 col-md-6 col-xl-4'>
                <div className='mt-5'>
                  <FontAwesomeIcon icon={faConnectdevelop} className='text-primary mb-4' size='2x' />
                  <h3 className='h4 mb-2'>{t('home.topFeatures.text1.title')}</h3>
                  <p className='text-muted mb-0'>{t('home.topFeatures.text1.subtitle')}</p>
                </div>
              </div>
              <div className='col-lg-6 col-md-6 col-xl-4'>
                <div className='mt-5'>
                  <FontAwesomeIcon icon={faUsers} className='text-primary mb-4' size='2x' />
                  <h3 className='h4 mb-2'>{t('home.topFeatures.text2.title')}</h3>
                  <p className='text-muted mb-0'>{t('home.topFeatures.text2.subtitle')}</p>
                </div>
              </div>
              <div className='col-lg-6 col-md-6 col-xl-4'>
                <div className='mt-5'>
                  {<FontAwesomeIcon icon={faFingerprint} className='text-primary mb-4' size='2x' />}
                  <h3 className='h4 mb-2'>{t('home.topFeatures.text3.title')}</h3>
                  <p className='text-muted mb-0'>{t('home.topFeatures.text3.subtitle')}</p>
                </div>
              </div>
              <div className='col-lg-6 col-md-6 col-xl-4'>
                <div className='mt-5'>
                  {<FontAwesomeIcon icon={faVrCardboard} className='text-primary mb-4' size='2x' />}
                  <h3 className='h4 mb-2'>{t('home.topFeatures.text4.title')}</h3>
                  <p className='text-muted mb-0'>{t('home.topFeatures.text4.subtitle')}</p>
                </div>
              </div>
              <div className='col-lg-6 col-md-6 col-xl-4'>
                <div className='mt-5'>
                  {<FontAwesomeIcon icon={faCertificate} className='text-primary mb-4' size='2x' />}
                  <h3 className='h4 mb-2'>{t('home.topFeatures.text5.title')}</h3>
                  <p className='text-muted mb-0'>{t('home.topFeatures.text5.subtitle')}</p>
                </div>
              </div>
              <div className='col-lg-6 col-md-6 col-xl-4'>
                <div className='mt-5'>
                  {<FontAwesomeIcon icon={faGears} className='text-primary mb-4' size='2x' />}
                  <h3 className='h4 mb-2'>{t('home.topFeatures.text6.title')}</h3>
                  <p className='text-muted mb-0'>{t('home.topFeatures.text6.subtitle')}</p>
                </div>
              </div>
              <div className='col-lg-6 col-md-6 col-xl-4'>
                <div className='mt-5'>
                  {<FontAwesomeIcon icon={faGamepad} className='text-primary mb-4' size='2x' />}
                  <h3 className='h4 mb-2'>{t('home.topFeatures.text7.title')}</h3>
                  <p className='text-muted mb-0'>{t('home.topFeatures.text7.subtitle')}</p>
                </div>
              </div>
              <div className='col-lg-6 col-md-6 col-xl-4'>
                <div className='mt-5'>
                  <FontAwesomeIcon icon={faMedal} className='text-primary mb-4' size='2x' />
                  <h3 className='h4 mb-2'>{t('home.topFeatures.text8.title')}</h3>
                  <p className='text-muted mb-0'>{t('home.topFeatures.text8.subtitle')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TopFeatures

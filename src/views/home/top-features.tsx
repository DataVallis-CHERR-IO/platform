import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'

const TopFeatures: React.FC = () => {
  const { t } = useTranslation('common')

  return (
    <section className='section-1' style={{ background: '#F1F1F3' }}>
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
                  <Image
                    src='/img/icons/integrated-defi-protocols-icon.svg'
                    alt={t('home.topFeatures.text1.title')}
                    className='img-responsive logo-white'
                    width={48}
                    height={48}
                  />
                  <h3 className='h4 mb-2'>{t('home.topFeatures.text1.title')}</h3>
                  <p className='text-muted mb-0'>{t('home.topFeatures.text1.subtitle')}</p>
                </div>
              </div>
              <div className='col-lg-6 col-md-6 col-xl-4'>
                <div className='mt-5'>
                  <Image
                    src='/img/icons/proof-of-charity-icon.svg'
                    alt={t('home.topFeatures.text2.title')}
                    className='img-responsive logo-white'
                    width={48}
                    height={48}
                  />
                  <h3 className='h4 mb-2'>{t('home.topFeatures.text2.title')}</h3>
                  <p className='text-muted mb-0'>{t('home.topFeatures.text2.subtitle')}</p>
                </div>
              </div>
              <div className='col-lg-6 col-md-6 col-xl-4'>
                <div className='mt-5'>
                  <Image
                    src='/img/icons/charity-market-analytics-icon.svg'
                    alt={t('home.topFeatures.text3.title')}
                    className='img-responsive logo-white'
                    width={48}
                    height={48}
                  />
                  <h3 className='h4 mb-2'>{t('home.topFeatures.text3.title')}</h3>
                  <p className='text-muted mb-0'>{t('home.topFeatures.text3.subtitle')}</p>
                </div>
              </div>
              <div className='col-lg-6 col-md-6 col-xl-4'>
                <div className='mt-5'>
                  <Image src='/img/icons/sbd-icon.svg' alt={t('home.topFeatures.text4.title')} className='img-responsive logo-white' width={48} height={48} />
                  <h3 className='h4 mb-2'>{t('home.topFeatures.text4.title')}</h3>
                  <p className='text-muted mb-0'>{t('home.topFeatures.text4.subtitle')}</p>
                </div>
              </div>
              <div className='col-lg-6 col-md-6 col-xl-4'>
                <div className='mt-5'>
                  <Image src='/img/icons/sdk-icon.svg' alt={t('home.topFeatures.text5.title')} className='img-responsive logo-white' width={48} height={48} />
                  <h3 className='h4 mb-2'>{t('home.topFeatures.text5.title')}</h3>
                  <p className='text-muted mb-0'>{t('home.topFeatures.text5.subtitle')}</p>
                </div>
              </div>
              <div className='col-lg-6 col-md-6 col-xl-4'>
                <div className='mt-5'>
                  <Image
                    src='/img/icons/nfts-launchpad-icon.svg'
                    alt={t('home.topFeatures.text6.title')}
                    className='img-responsive logo-white'
                    width={48}
                    height={48}
                  />
                  <h3 className='h4 mb-2'>{t('home.topFeatures.text6.title')}</h3>
                  <p className='text-muted mb-0'>{t('home.topFeatures.text6.subtitle')}</p>
                </div>
              </div>
              <div className='col-lg-6 col-md-6 col-xl-4'>
                <div className='mt-5'>
                  <Image
                    src='/img/icons/gamefi-icon.svg'
                    alt={t('home.topFeatures.text7.title')}
                    className='img-responsive logo-white'
                    width={48}
                    height={48}
                  />
                  <h3 className='h4 mb-2'>{t('home.topFeatures.text7.title')}</h3>
                  <p className='text-muted mb-0'>{t('home.topFeatures.text7.subtitle')}</p>
                </div>
              </div>
              <div className='col-lg-6 col-md-6 col-xl-4'>
                <div className='mt-5'>
                  <Image
                    src='/img/icons/metaverse-icon.svg'
                    alt={t('home.topFeatures.text8.title')}
                    className='img-responsive logo-white'
                    width={48}
                    height={48}
                  />
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

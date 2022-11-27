import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'

const Dashboard: React.FC = () => {
  const { t } = useTranslation('common')

  return (
    <div className='section-content'>
      <div className='row mtli-row-clearfix ml-0 mr-0'>
        <div className='col-sm-12 col-md-12 col-lg-4 animation-1 mt-4'>
          <Link href='/dashboard/create-new-project'>
            <div className='causes maxwidth500 mb-sm-50 dashboard-card-wrapper'>
              <div className='thumb'>
                <div className='dashboard-card-container' style={{ background: 'none #FFFFFF' }}>
                  <img className='img-thumbnail bg-black' alt='grid-2' src='/img/grid-2.png' />
                  <div className='dashboard-card-content'>{t('project.newProject')}?</div>
                </div>
              </div>
              <div className='causes-details clearfix dashboard-card-details'>
                <div className='p-30 p-sm-15 bg-lighter'>
                  <p className='fg-black'>{t('project.clickToCreateNew')}</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
        <div className='col-sm-12 col-md-12 col-lg-4 animation-1 mt-4'>
          <Link href='/dashboard/market'>
            <div className='causes maxwidth500 mb-sm-50 dashboard-card-wrapper'>
              <div className='thumb'>
                <div className='dashboard-card-container' style={{ background: 'none #FFFFFF' }}>
                  <img className='img-thumbnail bg-black' alt='grid-2' src='/img/grid-2.png' />
                  <div className='dashboard-card-content'>{t('market')}</div>
                </div>
              </div>
              <div className='causes-details clearfix dashboard-card-details'>
                <div className='p-30 p-sm-15 bg-lighter'>
                  <p className='fg-black'>{t('marketDescription')}</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

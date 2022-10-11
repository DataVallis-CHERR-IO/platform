import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import CampaignCards from './components/campaign-cards'

const Campaigns: React.FC = () => {
  const { t } = useTranslation()

  return (
    <section>
      <div className='container pb-80'>
        <div className='row'>
          <div className='col-lg-6 mx-auto text-center'>
            <h2 className='c-red'>{t('home:highlightedProjects.title')}</h2>
            <p className='lead'>{t('home:highlightedProjects.subtitle')}</p>
          </div>
        </div>
        <CampaignCards />
      </div>
    </section>
  )
}

export default Campaigns

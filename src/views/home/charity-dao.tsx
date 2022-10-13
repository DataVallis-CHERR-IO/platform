import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'

const CharityDAO: React.FC = () => {
  const { t } = useTranslation('common')

  return (
    <section className='section-1'>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-5'>
            <h2 className='c-red'>{t('home.lastProjects.description.title')}</h2>
            <p className='lead'>{t('home.lastProjects.description.text1')}</p>
            <p>{t('home.lastProjects.description.text2')}</p>
          </div>
          <div className='col-lg-7'>
            <div className='section-img text-center'>
              <Image src='/img/platform/section-1.png' alt={t('lastProjects')} className='img-fluid' width={504} height={424} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CharityDAO

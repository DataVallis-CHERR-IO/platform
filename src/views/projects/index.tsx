import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import ProjectCards from './components/project-cards'

const Projects: React.FC = () => {
  const { t } = useTranslation('common')

  return (
    <section>
      <div className='container pb-80'>
        <div className='row'>
          <div className='col-lg-6 mx-auto text-center'>
            <h2 className='c-red'>{t('home.lastProjects.title')}</h2>
            <p className='lead whiteFont'>{t('home.lastProjects.subtitle')}</p>
          </div>
        </div>
        <ProjectCards />
      </div>
    </section>
  )
}

export default Projects

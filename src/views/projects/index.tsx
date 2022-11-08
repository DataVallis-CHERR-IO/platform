import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import ProjectCards from './components/project-cards'
import TronWeb from 'tronweb'
const Projects: React.FC = () => {
  const { t } = useTranslation('common')

  console.log(TronWeb.address.fromHex('41893186a6bde128cc0970c81196fdb19b49a6f0e1'))
  console.log(TronWeb.address.toHex('TWrRd9bhran4gLYFeXLHFsbGtd8caFKhdE'), 'CHR TOKEN')
  console.log(TronWeb.address.toHex('TRBW8ZxcxU2ZaMz8WSiEa4GekUfznorBBa'), 'ACTIVATOR')
  return (
    <section>
      <div className='container pb-80'>
        <div className='row'>
          <div className='col-lg-6 mx-auto text-center'>
            <h2 className='c-red'>{t('home.lastProjects.title')}</h2>
            <p className='lead'>{t('home.lastProjects.subtitle')}</p>
          </div>
        </div>
        <ProjectCards />
      </div>
    </section>
  )
}

export default Projects

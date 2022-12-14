import React from 'react'
import useTranslation from 'next-translate/useTranslation'

const ProblemAndSolution: React.FC = () => {
  const { t } = useTranslation('common')

  return (
    <section className='section-2'>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-7'>
            <div className='box-left'>
              <h2 className='text-uppercase'>{t('home.problemAndSolution.problem.title')}</h2>
              <h3 className='c-red'>{t('home.problemAndSolution.problem.subtitle')}</h3>
              <ul>
                <li>{t('home.problemAndSolution.problem.text1')}</li>
                <li>{t('home.problemAndSolution.problem.text3')}</li>
                <li>{t('home.problemAndSolution.problem.text4')}</li>
                <li>{t('home.problemAndSolution.problem.text5')}</li>
                <li>{t('home.problemAndSolution.problem.text7')}</li>
                <li>{t('home.problemAndSolution.problem.text8')}</li>
                <li>{t('home.problemAndSolution.problem.text9')}</li>
                <li>{t('home.problemAndSolution.problem.text10')}</li>
                <li>{t('home.problemAndSolution.problem.text11')}</li>
              </ul>
            </div>
          </div>
          <div className='col-lg-7 box-to-right'>
            <div className='box-right'>
              <h2 className='text-uppercase'>{t('home.problemAndSolution.solution.title')}</h2>
              <h3>{t('home.problemAndSolution.solution.subtitle')}</h3>
              <ul>
                <li>{t('home.problemAndSolution.solution.text1')}</li>
                <li>{t('home.problemAndSolution.solution.text2')}</li>
                <li>{t('home.problemAndSolution.solution.text3')}</li>
                <li>{t('home.problemAndSolution.solution.text4')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProblemAndSolution

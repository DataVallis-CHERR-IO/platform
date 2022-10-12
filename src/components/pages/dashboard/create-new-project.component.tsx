import useTranslation from 'next-translate/useTranslation'
import { Input, Select, TextArea } from '@web3uikit/core'

const CreateNewProjectComponent = () => {
  const { t } = useTranslation('common')

  return (
    <section className='section-1'>
      <div className='container'>
        <div className='row'>
          <div className='section-dashboard'>
            <div className='container-fluid p-0'>
              <section className='resume-section p-3 p-lg-5' id='about'>
                <h1>{t('project.createNew')}</h1>
                <p>{t('project.createNewDescription')}</p>
                <div className='row'>
                  <div className='col-md-6 mb-5'>
                    <Input label={t('title')} onBlur={function noRefCheck() {}} onChange={function noRefCheck() {}} state='initial' width='100%' />
                  </div>
                  <div className='col-md-6 mb-5'>
                    <Input label={t('excerpt')} onBlur={function noRefCheck() {}} onChange={function noRefCheck() {}} state='error' width='100%' />
                  </div>
                  <div className='col-md-6 mb-5'>
                    <Select
                      isMulti
                      isSearch
                      label='Select'
                      max={3}
                      name='demo'
                      onBlurTraditional={function noRefCheck() {}}
                      onChange={function noRefCheck() {}}
                      onChangeTraditional={function noRefCheck() {}}
                      options={[
                        {
                          id: 'discord',
                          label: 'Discord'
                        },
                        {
                          id: 'emoji',
                          label: 'Emoji'
                        },
                        {
                          id: 'txt',
                          label: 'TXT'
                        }
                      ]}
                      placeholder='Something big name'
                      tryBeta
                      value={[]}
                      width='100%'
                    />
                  </div>
                  <div className='col-md-6 mb-5'>
                    <Input
                      label={t('goal')}
                      name='Test number Input'
                      onBlur={function noRefCheck() {}}
                      onChange={function noRefCheck() {}}
                      type='number'
                      state='initial'
                      width='100%'
                    />
                  </div>
                  <div className='col-md-12 mb-5'>
                    <TextArea
                      label={t('description')}
                      onBlur={function noRefCheck() {}}
                      onChange={function noRefCheck() {}}
                      placeholder='Type here field'
                      width='100%'
                    />
                  </div>
                </div>
                <div className='row section-profile'>
                  <div className='col-md-12'>
                    <div className='form-group'>
                      <button type='submit' className='btn btn-primary btn-rounded'>
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreateNewProjectComponent

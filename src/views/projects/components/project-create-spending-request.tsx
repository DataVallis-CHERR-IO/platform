import React, { useRef, useState } from 'react'
import { Button, TextField } from '@mui/material'
import { FadeLoader } from 'react-spinners'
import useTranslation from 'next-translate/useTranslation'
import { method } from '../../../modules/method'
import { toSun, isAddress } from '../../../utils'
import { notify } from '../../../utils/notify'
import { IProject } from '../../../interfaces/api'

interface IProjectCreateSpendingRequestProps {
  project: IProject
}

const ProjectCreateSpendingRequest: React.FC<IProjectCreateSpendingRequestProps> = ({ project }) => {
  const { t } = useTranslation('common')
  const [recipient, setRecipient] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleCreate = async event => {
    event.preventDefault()

    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity()
      return
    }

    if (!isAddress(recipient)) {
      notify(t('invalidAddress'), 'warning')
      return
    }

    setLoading(true)

    await method('createSpendingRequest', [description, recipient, toSun(value)], null, project.contractAddress)

    setRecipient('')
    setValue('')
    setDescription('')

    setLoading(false)
  }

  return (
    <section className='section-3 pt-0'>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-12'>
            <form ref={formRef}>
              <h1>{t('project.createSpendingRequest')}</h1>
              <p>{t('project.createSpendingRequestContent')}</p>
              <div className='row'>
                <div className='col-md-6 mb-5'>
                  <TextField
                    required
                    label={t('recipient')}
                    id='recipient'
                    variant='standard'
                    fullWidth={true}
                    value={recipient}
                    onChange={event => setRecipient(event.target.value)}
                  />
                </div>
                <div className='col-md-6 mb-5'>
                  <TextField
                    required
                    label={t('value')}
                    id='value'
                    variant='standard'
                    fullWidth={true}
                    value={value}
                    onChange={event => setValue(event.target.value)}
                    type='number'
                  />
                </div>
                <div className='col-md-12 mb-5'>
                  <TextField
                    required
                    label={t('description')}
                    multiline={true}
                    rows={4}
                    id='description'
                    variant='standard'
                    fullWidth={true}
                    value={description}
                    onChange={event => setDescription(event.target.value)}
                  />
                </div>
              </div>
              <div className='row section-profile'>
                <div className='col-md-12'>
                  {!loading ? (
                    <Button onClick={handleCreate} variant='contained' color='success'>
                      {t('create')}
                    </Button>
                  ) : (
                    <FadeLoader color='#CA354C' loading={loading} />
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProjectCreateSpendingRequest

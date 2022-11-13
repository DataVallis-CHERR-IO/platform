import React, { useCallback, useEffect, useRef, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { Backdrop, Button, CircularProgress, TextField } from '@mui/material'
import { method } from '../../../modules/method'
import { toSun, isAddress, fromSun } from '../../../utils'
import { notify } from '../../../utils/notify'
import { IProject } from '../../../interfaces/api'
import { IContractProject } from '../../../contexts/contract/context'

interface IProjectCreateSpendingRequestProps {
  project: IProject
  contractProject: IContractProject
}

const ProjectCreateSpendingRequest: React.FC<IProjectCreateSpendingRequestProps> = ({ project, contractProject }) => {
  const { t } = useTranslation('common')
  const [recipient, setRecipient] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [max, setMax] = useState<number>(fromSun(project.goal))
  const [open, setOpen] = React.useState<boolean>(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleCreate = useCallback(
    async event => {
      event.preventDefault()

      if (!formRef.current.checkValidity()) {
        formRef.current.reportValidity()
        return
      }

      if (!isAddress(recipient)) {
        notify(t('invalidAddress'), 'warning')
        return
      }

      setOpen(!open)

      await method('createSpendingRequest', [description, recipient, toSun(value)], null, project.contractAddress)

      setRecipient('')
      setValue('')
      setDescription('')

      setOpen(false)
    },
    [recipient, description, value]
  )

  const handleMax = useCallback(() => {
    console.log(contractProject?.requests?.values)
    contractProject?.requests?.values?.length === 0 ||
      setMax(fromSun(project.goal) - fromSun(contractProject?.requests?.values?.reduce((value1, value2) => value1 + value2, 0)))
  }, [contractProject?.requests?.values])

  useEffect(() => {
    handleMax()
  }, [contractProject?.requests?.values])

  return (
    <>
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
                  <div className='col-md-5 mb-5'>
                    <TextField
                      required
                      label={t('value')}
                      id='value'
                      variant='standard'
                      fullWidth={true}
                      inputProps={{ min: 0.0, max, step: 'any' }}
                      value={value}
                      onChange={event => setValue(event.target.value)}
                      type='number'
                    />
                  </div>
                  <div className='col-md-1 mb-5 align-self-end'>
                    <div onClick={() => setValue(max.toString())} className='cursor-pointer'>
                      {t('max')}
                    </div>
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
                    {!!max && (
                      <Button onClick={handleCreate} variant='contained' color='success'>
                        {t('create')}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  )
}

export default ProjectCreateSpendingRequest

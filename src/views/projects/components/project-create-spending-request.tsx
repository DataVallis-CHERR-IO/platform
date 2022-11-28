import React, { useCallback, useEffect, useRef, useState } from 'react'
import TextField from '../../../themes/components/inputs/text-field.input'
import useTranslation from 'next-translate/useTranslation'
import { method } from '../../../modules/method'
import { getEther, getWei, isAddress } from '../../../utils'
import { notify } from '../../../utils/notify'
import { useContractContext } from '../../../contexts/contract/provider'
import { getCherrioProjectAbi } from '../../../contracts/abi/cherrio-project'
import { useSessionContext } from '../../../contexts/session/provider'
import { Backdrop, Button, CircularProgress, InputAdornment } from '@mui/material'
import { IProject } from '../../../interfaces/api'

interface IProjectCreateSpendingRequestProps {
  project: IProject
}

const ProjectCreateSpendingRequest: React.FC<IProjectCreateSpendingRequestProps> = ({ project }) => {
  const { t } = useTranslation('common')
  const { contractProject } = useContractContext()
  const { account } = useSessionContext()
  const [recipient, setRecipient] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [max, setMax] = useState<number>(0)
  const [open, setOpen] = React.useState<boolean>(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleCreateOnClick = useCallback(
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

      await method('createSpendingRequest', [description, recipient, getWei(value)], null, project.contractAddress, getCherrioProjectAbi())

      setRecipient('')
      setValue('')
      setDescription('')

      setOpen(false)
      handleMax(false)
    },
    [recipient, description, value]
  )

  const handleMax = useCallback(
    (doSetValue: boolean = true) => {
      const goal = getEther(project.goal)
      const value = +(
        (contractProject.raisedAmount < goal ? contractProject.raisedAmount : goal) -
        getEther(contractProject?.requests?.values?.reduce((value1, value2) => Number(value1.toString()) + Number(value2.toString()), 0))
      ).toFixed(12)

      setMax(value)
      !doSetValue || setValue(value.toString())
    },
    [contractProject.raisedAmount, contractProject?.requests?.values]
  )

  useEffect(() => {
    handleMax(false)
  }, [contractProject.raisedAmount])

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
                      id='recipient'
                      label={t('recipient')}
                      value={recipient}
                      onChange={data => setRecipient(data)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end' onClick={() => setRecipient(account)} className='text-lowercase cursor-pointer'>
                            {t('account')}
                          </InputAdornment>
                        )
                      }}
                      minLength={42}
                      maxLength={42}
                    />
                  </div>
                  <div className='col-md-6 mb-5'>
                    <TextField
                      id='amount'
                      label={t('amount')}
                      type='number'
                      value={value}
                      onChange={data => setValue(data)}
                      inputProps={{ min: 0.0, max, step: 'any' }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end' onClick={() => handleMax()} className='text-lowercase cursor-pointer'>
                            {t('max')}
                          </InputAdornment>
                        )
                      }}
                    />
                  </div>
                  <div className='col-md-12 mb-5'>
                    <TextField
                      id='description'
                      label={t('description')}
                      multiline={true}
                      rows={4}
                      value={description}
                      onChange={data => setDescription(data)}
                    />
                  </div>
                </div>
                <div className='row section-profile'>
                  <div className='col-md-12'>
                    {contractProject.raisedAmount > 0 ? (
                      !!max ? (
                        <Button onClick={handleCreateOnClick} variant='contained' color='success'>
                          {t('create')}
                        </Button>
                      ) : (
                        <p style={{ color: '#d21242' }}>*{t('project.maxSpendingRequestAmountReached')}</p>
                      )
                    ) : (
                      <p style={{ color: '#d21242' }}>*{t('project.noDonations')}</p>
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

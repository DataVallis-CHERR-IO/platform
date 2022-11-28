import React, { useCallback, useEffect, useRef, useState } from 'react'
import TextField from '../../inputs/text-field.input'
import useTranslation from 'next-translate/useTranslation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useBalance } from 'wagmi'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'

interface ISendTransactionDialogProps {
  open: boolean
  onClose: any
  title: string
  contentText: string
  sender: string
  min?: number
  max?: number
}

const SendTransactionDialog = ({ title, contentText, open, onClose, sender, min, max }: ISendTransactionDialogProps) => {
  const { t } = useTranslation('common')
  const [value, setValue] = useState<string>('')
  const [balance, setBalance] = useState<string>(null)
  const [maxValue, setMaxValue] = useState<number>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const { data: userBalance } = useBalance({
    addressOrName: sender,
    watch: true
  })

  const handleCloseOnClick = () => {
    onClose(null)
    setValue('')
  }

  const handleSendOnClick = useCallback(() => {
    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity()
      return
    }

    onClose(value)
    setValue('')
  }, [value])

  useEffect(() => {
    !userBalance || setBalance(Number(userBalance.formatted).toFixed(4))
    setMaxValue(max === null ? Number(Number(userBalance?.formatted).toFixed(4)) : max)
  }, [userBalance])

  return (
    <Dialog open={open} onClose={handleSendOnClick}>
      <DialogTitle>{t(title)}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t(contentText)}</DialogContentText>
        <p>
          {t('balance')}: <FontAwesomeIcon icon={faEthereum} /> {balance}
        </p>
        {max !== 0 ? (
          <>
            <form ref={formRef}>
              <TextField
                id='amount'
                label={t('amount')}
                type='number'
                value={value}
                onChange={event => setValue(event.target.value)}
                autoFocus
                margin='dense'
                inputProps={{ min, max, step: 'any' }}
              />
            </form>
            <div className='row'>
              <div className='col-md-6'>
                {!!min && (
                  <div onClick={() => setValue(min.toString())} className='cursor-pointer'>
                    {t('min')}
                  </div>
                )}
              </div>
              <div className='col-md-6 text-right'>
                {!!maxValue && (
                  <div onClick={() => setValue(maxValue.toString())} className='cursor-pointer'>
                    {t('max')}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <p>{t('maxTransactionAmountReachedOrNoRights')}</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseOnClick}>{t('close')}</Button>
        {maxValue !== 0 && <Button onClick={handleSendOnClick}>{t('send')}</Button>}
      </DialogActions>
    </Dialog>
  )
}

export default SendTransactionDialog

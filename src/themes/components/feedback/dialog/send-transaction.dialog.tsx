import React, { useRef, useState } from 'react'
import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'

interface ISendTransactionDialog {
  open: boolean
  onClose: any
  title: string
  contentText: string
  balance?: number
  min?: number
  max?: number
}

const SendTransactionDialog = ({ title, contentText, open, onClose, balance, min, max }: ISendTransactionDialog) => {
  const { t } = useTranslation('common')
  const [value, setValue] = useState<string>('')
  const formRef = useRef<HTMLFormElement>(null)

  const handleCancel = () => {
    onClose(null)
    setValue('')
  }

  const handleSend = () => {
    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity()
      return
    }

    onClose(value)
    setValue('')
  }

  return (
    <Dialog open={open} onClose={handleSend}>
      <DialogTitle>{t(title)}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t(contentText)}</DialogContentText>
        <p>
          {t('balance')}: <Image src='/img/tron-black.png' width={14} height={14} /> {balance}
        </p>
        <form ref={formRef}>
          <TextField
            required
            autoFocus
            margin='dense'
            id='value'
            label={t('value')}
            type='number'
            fullWidth
            variant='standard'
            inputProps={{ min, max, step: 'any' }}
            value={value}
            onChange={event => setValue(event.target.value)}
          />
        </form>
        <div className='row'>
          <div className='col-md-6'>
            {min && (
              <div onClick={() => setValue(min.toString())} className='cursor-pointer'>
                {t('min')}
              </div>
            )}
          </div>
          <div className='col-md-6 text-right'>
            {max && (
              <div onClick={() => setValue(max.toString())} className='cursor-pointer'>
                {t('max')}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>{t('cancel')}</Button>
        <Button onClick={handleSend}>{t('send')}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default SendTransactionDialog

import React, { useCallback, useEffect, useRef, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { useBalance } from 'wagmi'
import { useSession } from 'next-auth/react'
import { method } from '../../../../modules/method'
import { getWei } from '../../../../utils'
import { getAavePoolAbi } from '../../../../contracts/abi/aave/pool'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { tokenOptions } from '../../../../config'
import { IAsset } from '../../../../interfaces'
import { getMaticAbi } from '../../../../contracts/abi/assets/polygon/matic'

interface IBorrowDialogProps {
  account: string
  asset: IAsset
  open: boolean
  onClose: any
}

const BorrowDialog = ({ account, asset, open, onClose }: IBorrowDialogProps) => {
  const { t } = useTranslation('common')
  const { data: session } = useSession()
  const [value, setValue] = useState<string>('')
  const formRef = useRef<HTMLFormElement>(null)

  const { data: balance } = useBalance({
    addressOrName: account,
    watch: true
  })

  const handleCloseOnClick = () => {
    onClose(false)
    setValue('')
  }

  const handleBorrowOnClick = useCallback(async () => {
    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity()
      return
    }

    const approve = await method('approveDelegation', [tokenOptions.contract.wethGateway, getWei(value)], null, asset.variableDebtToken, getMaticAbi())
    console.log(approve, 'approveDelegation approve')
    // const response = await method('borrow', [asset.address, getWei(value), 2, 0, session.user.name], null, tokenOptions.contract.poolAddress, getAavePoolAbi())
    // console.log(response, 'borrow response')

    onClose(false)
    setValue('')
  }, [value])

  useEffect(() => {
    console.log(balance)
  }, [])

  return (
    <Dialog open={open} onClose={handleCloseOnClick}>
      <DialogTitle>
        {t('asset.borrow')} {asset?.name}
      </DialogTitle>
      <DialogContent>
        <>
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
              inputProps={{ min: 0, max: balance || 0, step: 'any' }}
              value={value}
              onChange={event => setValue(event.target.value)}
            />
          </form>
          <div className='row'>
            <div className='col-md-12 text-right'>
              <div onClick={() => setValue(balance?.toString())} className='cursor-pointer'>
                {t('max')}
              </div>
            </div>
          </div>
        </>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseOnClick} className='color-danger'>
          {t('close')}
        </Button>
        <Button variant='contained' onClick={handleBorrowOnClick} className='bg-color-danger'>
          {t('asset.borrow')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BorrowDialog

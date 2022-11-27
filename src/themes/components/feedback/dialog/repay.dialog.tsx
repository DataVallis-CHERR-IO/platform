import React, { useCallback, useRef, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { method } from '../../../../modules/method'
import { getWei } from '../../../../utils'
import { getAavePolygonWMATICAbi } from '../../../../contracts/abi/aave/polygon-wmatic'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import { tokenOptions } from '../../../../config'
import { IAsset } from '../../../../interfaces'

interface IRepayDialogProps {
  account: string
  asset: IAsset
  balance: number
  open: boolean
  onClose: any
}

const RepayDialog = ({ account, asset, balance, open, onClose }: IRepayDialogProps) => {
  const { t } = useTranslation('common')
  const [value, setValue] = useState<string>('')
  const formRef = useRef<HTMLFormElement>(null)

  const handleCloseOnClick = () => {
    onClose(false)
    setValue('')
  }

  const handleApproveOnClick = useCallback(async () => {
    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity()
      return
    }

    console.log('APPROVE')
    console.log(value, asset)
    console.log(tokenOptions.contract.wethGateway, 'tokenOptions.contract.wethGateway')
    console.log(value, getWei(value))
    console.log(asset.address, 'asset.address')
    console.log(getAavePolygonWMATICAbi(), 'getAavePolygonWMATICAbi')
    // const allowance = await method('allowance', [session.user.name, tokenOptions.contract.wethGateway], null, asset.address, getAavePolygonWMATICAbi())
    // console.log(getEther(allowance.toString()))
    await method('approve', [tokenOptions.contract.poolAddress, getWei(value)], null, asset.address, asset.abi)
    onClose(false)
    setValue('')
  }, [value])

  const handleWithdrawOnClick = useCallback(async () => {
    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity()
      return
    }

    console.log('WITHDRAW')
    console.log(value, asset)
    console.log(tokenOptions.contract.wethGateway, 'tokenOptions.contract.wethGateway')
    console.log(value, getWei(value))
    console.log(asset.address, 'asset.address')
    // console.log(getAavePolygonWMATICAbi(), 'getAavePolygonWMATICAbi')
    // await method('withdraw', [asset.address, getWei(value), session?.user?.name], null, asset.poolAddress, getAavePoolAbi())
    await method('withdraw', [tokenOptions.contract.poolAddress, getWei(value), account], null, asset.address, asset.abi)

    onClose(false)
    setValue('')
  }, [value])

  return (
    <Dialog open={open} onClose={handleCloseOnClick}>
      <DialogTitle>
        {t('asset.withdraw')} {asset?.name}
      </DialogTitle>
      <DialogContent>
        <>
          <p>
            {t('balance')}: <FontAwesomeIcon icon={faEthereum} /> {balance}
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
              inputProps={{ min: 0, max: balance || 0, step: 'any' }}
              value={value}
              onChange={event => setValue(event.target.value)}
            />
          </form>
          <div className='row'>
            <div className='col-md-12 text-right'>
              <div onClick={() => setValue(balance.toString())} className='cursor-pointer'>
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
        <Button variant='contained' onClick={handleWithdrawOnClick} className='bg-color-danger'>
          {t('asset.withdraw')}
        </Button>
        <Button variant='contained' onClick={handleApproveOnClick} className='bg-color-info'>
          {t('asset.approve')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RepayDialog

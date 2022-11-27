import React, { useCallback, useRef, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { method } from '../../../../modules/method'
import { getWei } from '../../../../utils'
import { getAaveWETHGatewayAbi } from '../../../../contracts/abi/aave/weth-gateway'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import { tokenOptions } from '../../../../config'
import { IAsset } from '../../../../interfaces'

interface ISupplyDialogProps {
  account: string
  asset: IAsset
  balance: number
  open: boolean
  onClose: any
}

const SupplyDialog = ({ account, asset, balance, open, onClose }: ISupplyDialogProps) => {
  const { t } = useTranslation('common')
  const [value, setValue] = useState<string>('')
  const formRef = useRef<HTMLFormElement>(null)

  const handleCloseOnClick = () => {
    onClose(false)
    setValue('')
  }

  const handleSupplyOnClick = useCallback(async () => {
    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity()
      return
    }

    await method('depositETH', [tokenOptions.contract.poolAddress, account, 0], getWei(value), tokenOptions.contract.wethGateway, getAaveWETHGatewayAbi())
    // const approve = await method('approve', [tokenOptions.contract.poolAddress, getWei(value)], null, asset.address, asset.abi)
    // const approve = await method('approve', [tokenOptions.contract.poolAddress, getWei(value)], null, '0xb685400156cF3CBE8725958DeAA61436727A30c3', asset.abi)
    // console.log(approve, 'supply approve')

    // const response = await method('deposit', [asset.address, getWei(value), account, 0], null, tokenOptions.contract.poolAddress, getAavePoolAbi())
    // const response = await method(
    //   'deposit',
    //   ['0xb685400156cF3CBE8725958DeAA61436727A30c3', getWei(value), account, 0],
    //   null,
    //   tokenOptions.contract.poolAddress,
    //   getAavePoolAbi()
    // )
    // console.log(response, 'supply response')

    onClose(false)
    setValue('')
  }, [value])

  return (
    <Dialog open={open} onClose={handleCloseOnClick}>
      <DialogTitle>
        {t('asset.supply')} {asset?.name}
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
        <Button variant='contained' onClick={handleSupplyOnClick} className='bg-color-danger'>
          {t('asset.supply')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SupplyDialog
